import {
  getChallenge,
  getUserChallenge,
  getUsersWithoutChallengeAchieved,
  updateUserChallenge,
} from "../database";
import { Challenge } from "../models/database-models";
import { querySubqueryList } from "../utils/query";

const challenges: { [key: string]: Challenge | undefined } = {
  "swap-1": undefined,
  "swap-2": undefined,
  "swap-3": undefined,
  "swap-4": undefined,
};

async function initChallengeIds() {
  if (challenges["swap-4"] !== undefined) {
    return;
  }
  for (let tag in challenges) {
    challenges[tag] = await getChallenge(tag);
  }
}

export async function checkSwapRecord() {
  const startTime = Date.now();
  try {
    await initChallengeIds();
  } catch (e) {
    console.error(`Challenge not found: ${e}`);
    return;
  }
  if (!challenges["swap-4"]) {
    console.error(`Challenge not found`);
    return;
  }
  const users = await getUsersWithoutChallengeAchieved(challenges["swap-4"].id);
  console.log(`Checking swap record for ${users.length} users`);
  const swapRecords = await getAllSwapRecords();
  for (let user of users) {
    try {
      let amount = swapRecords[user.id] || 0;
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
      console.error(`Error checking swap record for ${user.id}: ${e}`);
    }
  }
  console.log(`Done checking swap record. Took ${Date.now() - startTime}ms.`);
}

async function getAllSwapRecords(): Promise<{ [key: string]: number }> {
  const result = await querySubqueryList({
    method: "POST",
    url: `https://api.subquery.network/sq/subquery/kepler-network`,
    timeout: 20000,
    variables: {},
    query: `
      {
        trades(
          filter: {tokenGet: {equalTo: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174"}}
        ) {
          groupedAggregates(groupBy: SENDER_ID) {
            sum {
              amountGive
            }
            keys
          }
        }
      }
    `,
    type: "trades",
    nodesName: "groupedAggregates",
    list: [],
  });
  const swapRecords: { [key: string]: number } = {};
  for (let trade of result) {
    swapRecords[trade.keys[0]] = trade.sum.amountGive / Math.pow(10, 18);
  }
  return swapRecords;
}
