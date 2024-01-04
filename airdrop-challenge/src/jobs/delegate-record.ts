import {
  getChallengeId,
  getUserChallenge,
  getUsersWithoutChallengeAchieved,
  updateUserChallenge,
} from "../database";
import { querySubqueryList } from "../utils/query";

export async function checkDelegateRecord() {
  let challengeId: number;
  try {
    challengeId = await getChallengeId("Delegate on Kepler");
  } catch (e) {
    console.error(`Challenge not found: ${e}`);
    return;
  }
  const users = await getUsersWithoutChallengeAchieved(challengeId);
  console.log(`Checking delegate record for ${users.length} users`);
  for (let user of users) {
    try {
      const result = await querySubqueryList({
        method: "POST",
        url: `https://api.subquery.network/sq/subquery/kepler-network`,
        timeout: 20000,
        variables: {
          delegatorId: user.id,
        },
        query: `
          query ($delegatorId: String, $offset: Int) {
            delegations(filter: {delegatorId: {equalTo: $delegatorId}}, offset: $offset) {
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
      let amount = BigInt(0);
      for (let delegation of result) {
        amount += BigInt(delegation.amount.value.value);
      }
      const userChallenge = await getUserChallenge(user.id, challengeId);
      // @ts-ignore
      if (userChallenge.amount < amount) {
        await updateUserChallenge(user.id, challengeId, new Date(), amount);
      }
    } catch (e) {
      console.error(`Error checking delegate record for ${user.id}: ${e}`);
    }
  }
}
