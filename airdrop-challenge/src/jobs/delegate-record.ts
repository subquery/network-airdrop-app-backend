import {
  getChallenge,
  getUserChallenge,
  getUsersWithoutChallengeAchieved,
  updateUserChallenge,
} from "../database";
import { Challenge } from "../models/database-models";
import { querySubqueryList } from "../utils/query";

const challenges: { [key: string]: Challenge | undefined } = {
  "delegate-1": undefined,
  "delegate-2": undefined,
  "delegate-3": undefined,
  "delegate-4": undefined,
};

async function initChallengeIds() {
  if (challenges["delegate-4"] !== undefined) {
    return;
  }
  for (let tag in challenges) {
    challenges[tag] = await getChallenge(tag);
  }
}

export async function checkDelegateRecord() {
  const startTime = Date.now();
  try {
    await initChallengeIds();
  } catch (e) {
    console.error(`Challenge not found: ${e}`);
    return;
  }
  if (!challenges["delegate-4"]) {
    console.error(`Challenge not found`);
    return;
  }
  const users = await getUsersWithoutChallengeAchieved(
    challenges["delegate-4"].id
  );
  console.log(`Checking delegate record for ${users.length} users`);
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
            delegations(
              filter: {delegatorId: {equalTo: $address}}, 
              offset: $offset
            ) {
              totalCount
              nodes {
                amount
              }
            }
          }
        `,
        type: "delegations",
        list: [],
      });
      if (result.length === 0) {
        continue;
      }
      let amount = 0;
      for (let delegation of result) {
        amount += delegation.amount.value.value / Math.pow(10, 18);
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
      console.error(`Error checking delegate record for ${user.id}: ${e}`);
    }
  }
  console.log(
    `Done checking delegate record. Took ${Date.now() - startTime}ms.`
  );
}
