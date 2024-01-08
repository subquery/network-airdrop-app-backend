import {
  getChallenge,
  getUserChallenge,
  getUsers,
  updateUserChallenge,
} from "../database";
import { Challenge } from "../models/database-models";
import { querySubqueryList } from "../utils/query";

const challenges: { [key: string]: Challenge | undefined } = {
  "reward-1": undefined,
  "reward-2": undefined,
};

async function initChallengeIds() {
  if (challenges["reward-2"] !== undefined) {
    return;
  }
  for (let tag in challenges) {
    challenges[tag] = await getChallenge(tag);
  }
}

export async function checkRewardRecord() {
  try {
    await initChallengeIds();
  } catch (e) {
    console.error(`Challenge not found: ${e}`);
    return;
  }
  if (!challenges["reward-2"]) {
    console.error(`Challenge not found`);
    return;
  }
  const users = await getUsers();
  console.log(`Checking reward record for ${users.length} users`);
  for (let user of users) {
    try {
      const result = await querySubqueryList({
        method: "POST",
        url: `https://api.subquery.network/sq/subquery/kepler-network`,
        timeout: 20000,
        variables: {
          address: user.id,
        },
        query: `
          query ($address: String, $offset: Int) {
            rewards(
              filter: { delegatorId: {equalTo: $address}},
              offset: $offset
            ) {
              totalCount
              nodes {
                amount
              }
            }
          }
        `,
        type: "rewards",
        list: [],
      });
      if (result.length === 0) {
        continue;
      }
      let amount = 0;
      for (let reward of result) {
        amount += reward.amount / Math.pow(10, 18);
      }
      for (let challenge of Object.values(challenges)) {
        if (!challenge) {
          continue;
        }
        if (amount > challenge.fixed_amount) {
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
      console.error(`Error checking reward record for ${user.id}: ${e}`);
    }
  }
  console.log(`Done checking reward record`);
}
