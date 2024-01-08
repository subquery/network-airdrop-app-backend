import { sql } from "kysely";
import { getDB } from "../database";

export async function updateUsers() {
  await updateChallengeScore();
  await updateReferralCountAndTotalScore();
  await updateUserRank();
}

async function updateChallengeScore() {
  const startTime = Date.now();
  console.log(`Updating challenge score`);
  try {
    const db = getDB();
    const users = await db.selectFrom("users").selectAll().execute();
    for (let user of users) {
      const challenges = await db
        .selectFrom("user_challenges")
        .selectAll()
        .where("user_id", "=", user.id)
        .execute();
      let challengeScore = 0;
      for (let challenge of challenges) {
        challengeScore += challenge.amount;
      }
      await db
        .updateTable("users")
        .where("id", "=", user.id)
        .set({ challenge_score: challengeScore })
        .execute();
    }
  } catch (e) {
    console.error(`Error updating challenge score: ${e}`);
  }
  console.log(
    `Done updating challenge score. Took ${Date.now() - startTime}ms.`
  );
}

async function updateReferralCountAndTotalScore() {
  const challenge_score_limit = 1000;
  const startTime = Date.now();
  console.log(`Updating referral count`);
  try {
    const db = getDB();
    const users = await db.selectFrom("users").selectAll().execute();
    for (let user of users) {
      const referrals = await db
        .selectFrom("users")
        .where(({ and, eb }) =>
          and([
            eb("referring_user_id", "=", user.id),
            eb("challenge_score", ">", challenge_score_limit),
          ])
        )
        .execute();
      const baseReferredCount = !!user.referring_user_id ? 2 : 1;
      const referral_count = referrals.length + baseReferredCount;
      await db
        .updateTable("users")
        .where("id", "=", user.id)
        .set({
          referral_count,
          total_score: user.challenge_score + user.raw_score * referral_count,
        })
        .execute();
    }
  } catch (e) {
    console.error(`Error updating referral count: ${e}`);
  }
  console.log(
    `Done updating referral count. Took ${Date.now() - startTime}ms.`
  );
}

async function updateUserRank() {
  const db = getDB();
  // @ts-ignore
  const subQuery = db
    .selectFrom("users")
    .select([
      "id",
      sql.raw("ROW_NUMBER() OVER (ORDER BY total_score DESC) as rank1"),
    ])
    .as("sub");

  await db
    .updateTable("users")
    .from(subQuery)
    .set({
      rank: sql.ref("sub.rank1"),
    })
    .where("users.id", "=", sql.ref("sub.id"))
    .execute();
}
