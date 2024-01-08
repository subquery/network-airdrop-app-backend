import axios from "axios";
import {
  getChallenge,
  getUserChallenge,
  getUsersWithoutChallengeAchieved,
  updateUserChallenge,
} from "../database";
import { Challenge } from "../models/database-models";

const challenges: { [key: string]: Challenge | undefined } = {
  "zealy-1": undefined,
  "zealy-2": undefined,
  "zealy-3": undefined,
  "zealy-4": undefined,
  "zealy-5": undefined,
  "zealy-6": undefined,
  "zealy-7": undefined,
};

async function initChallengeIds() {
  if (challenges["zealy-7"] !== undefined) {
    return;
  }
  for (let tag in challenges) {
    challenges[tag] = await getChallenge(tag);
  }
}

export async function checkZealyPoints() {
  const startTime = Date.now();
  try {
    await initChallengeIds();
  } catch (e) {
    console.error(`Challenge not found: ${e}`);
    return;
  }
  if (!challenges["zealy-7"]) {
    console.error(`Challenge not found`);
    return;
  }
  const users = await getUsersWithoutChallengeAchieved(
    challenges["zealy-7"].id
  );
  console.log(`Checking zealy points for ${users.length} users`);
  for (let user of users) {
    try {
      const result = await axios.request({
        method: "GET",
        url: `https://api.zealy.io/communities/subquerynetwork/users`,
        timeout: 10000,
        headers: {
          "x-api-key": process.env.ZEALY_API_KEY || "",
        },
        params: {
          email: user.email,
          // ethAddress: user.id,
        },
      });
      const zealyUser: ZealyUser = result.data;
      for (let challenge of Object.values(challenges)) {
        if (!challenge) {
          continue;
        }
        if (zealyUser.xp > challenge.fixed_amount) {
          await getUserChallenge(user.id, challenge.id);
          await updateUserChallenge(
            user.id,
            challenge.id,
            new Date(),
            challenge.reward
          );
        }
      }
    } catch (e) {
      console.error(`Error checking zealy points for ${user.id}: ${e}`);
    }
  }
  console.log(`Done checking zealy points. Took ${Date.now() - startTime}ms.`);
}

type ZealyUser = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  avatar?: string;
  addresses?: [any];
  discordHandle?: string;
  twitterUsername?: string;
  displayedInformation?: [string];
  deleted?: boolean;
  xp: number;
  rank: number;
  invites?: number;
  role?: string;
  level: number;
  isBanned?: boolean;
  isMe?: boolean;
};
