import {
  Challenge,
  Database,
  NewUser,
  NewUserChallenge,
  User,
  UserChallenge,
  UserUpdate,
} from "./models/database";
import { UserSignupRequest } from "./models/service/user-signup-request";

import { Pool } from "pg";
import { Kysely, PostgresDialect } from "kysely";
import { UserResponse } from "./models/service/user-response";
import { UserChallengeResponse } from "./models/service/user-challenge-response";
import {
  LeaderboardRecordResponse,
  LeaderboardSummaryResponse,
} from "./models/service/leaderboard_summary-response";

const dialect = new PostgresDialect({
  pool: new Pool({
    database: "test",
    host: "localhost",
    user: "admin",
    port: 5434,
    max: 10,
  }),
});

// Database interface is passed to Kysely's constructor, and from now on, Kysely
// knows your database structure.
// Dialect is passed to Kysely's constructor, and from now on, Kysely knows how
// to communicate with your database.
export const db = new Kysely<Database>({
  dialect,
});

export async function createNewUser(
  signup: UserSignupRequest,
  referring_user_id: string | undefined
) {
  const newUser: NewUser = {
    ...signup,
    verified_email: false,
    raw_score: referring_user_id ? 400 : 200,
    referral_count: referring_user_id ? 1 : 0,
    referral_code: Array.from(Array(8), () =>
      Math.floor(Math.random() * 36).toString(36)
    ).join(""),
    referring_user_id,
    verify_email_code: Array.from(Array(12), () =>
      Math.floor(Math.random() * 36).toString(36)
    ).join(""),
  };

  return await db
    .insertInto("users")
    .values(newUser)
    .returningAll()
    .executeTakeFirstOrThrow();
}

export async function getReferringUserID(
  referrral_code: string
): Promise<string> {
  const { id } = await db
    .selectFrom("users")
    .select("id")
    .where("referral_code", "=", referrral_code)
    .executeTakeFirstOrThrow();
  return id;
}

export async function verifyUserEmail(verify_email_code: string) {
  const user = await db
    .selectFrom("users")
    .where("verify_email_code", "=", verify_email_code)
    .selectAll()
    .executeTakeFirstOrThrow();

  if (user) {
    const updateUser: UserUpdate = {
      ...user,
    };
    // Update boolean
    updateUser.verified_email = true;
    await db
      .updateTable("users")
      .set(updateUser)
      .where("verify_email_code", "=", verify_email_code);
  } else {
    throw new Error("No User Found");
  }
}

export async function getUser(id: string): Promise<UserResponse> {
  const userTable: User = await db
    .selectFrom("users")
    .selectAll()
    .where("id", "=", id)
    .executeTakeFirstOrThrow();
  return {
    ...userTable,
    address: userTable.id,
    total_score: userTable.raw_score * (userTable.referral_count + 1),
    rank: 0, // TODO
  } as UserResponse;
}

export async function getLeaderboard(
  userID: string
): Promise<LeaderboardSummaryResponse> {
  const allUsers = await db
    .selectFrom("users")
    .select(["id", "raw_score", "referral_count"])
    .execute();
  const sortedUsersWithScore = allUsers
    .map((u) => ({
      ...u,
      total_score: u.raw_score * (u.referral_count + 1),
    }))
    .sort((a, b) => (a.total_score > b.total_score ? -1 : 1));

  const currentUserIndex = sortedUsersWithScore.findIndex(
    (u) => u.id === userID
  );
  const topFiveSummary: LeaderboardRecordResponse[] = sortedUsersWithScore
    .slice(0, 5)
    .map((u, i) => ({
      rank: i,
      name: u.id,
      raw_score: u.raw_score,
      referral_multiplier: u.referral_count + 1,
      total_score: u.total_score,
    }));
  const startIndex = Math.max(currentUserIndex - 7, 5);
  const userSummary: LeaderboardRecordResponse[] = sortedUsersWithScore
    .slice(startIndex, startIndex + 5)
    .map((u, i) => ({
      rank: startIndex + i,
      name: u.id,
      raw_score: u.raw_score,
      referral_multiplier: u.referral_count + 1,
      total_score: u.total_score,
    }));

  return {
    total_participants: sortedUsersWithScore.length,
    summary: topFiveSummary.concat(userSummary),
  } as LeaderboardSummaryResponse;
}

export async function getUserChallegesForQuery(
  userID: string
): Promise<UserChallengeResponse[]> {
  const [challenges, userChallenges] = await Promise.all([
    getChallenges(),
    getUserChallenges(userID),
  ]);

  return await Promise.all(
    challenges.map(async (c) => {
      let userChallege = userChallenges.find((uc) => uc.challenge_id === c.id);
      if (!userChallege) {
        userChallege = await initNewUserChallenge(userID, c.id);
      }

      return {
        ...c,
        success: !!userChallege.achieved,
        success_date: !!userChallege.achieved
          ? userChallege.achieved
          : undefined,
      } as UserChallengeResponse;
    })
  );
}

async function initNewUserChallenge(
  user_id: string,
  challenge_id: number
): Promise<UserChallenge> {
  const newUserChallenge: NewUserChallenge = {
    user_id,
    challenge_id,
    achieved: undefined,
  };
  return await db
    .insertInto("user_challenges")
    .values(newUserChallenge)
    .returningAll()
    .executeTakeFirstOrThrow();
}

async function getChallenges(): Promise<Challenge[]> {
  return await db.selectFrom("challenges").selectAll().execute();
}

async function getUserChallenges(userID: string): Promise<UserChallenge[]> {
  return await db
    .selectFrom("user_challenges")
    .selectAll()
    .where("user_id", "=", userID)
    .execute();
}
