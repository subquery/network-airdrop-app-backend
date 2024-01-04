import {
  getChallengeId,
  getUserChallenge,
  getUsers,
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
  const users = await getUsers();
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
      const userChallenge = await getUserChallenge(user.id, challengeId);
      if (userChallenge.amount < amount) {
        await updateUserChallenge(user.id, challengeId, new Date(), amount);
      }
    } catch (e) {
      console.error(`Error checking delegate record for ${user.id}: ${e}`);
    }
  }
  console.log(`Done checking delegate record`);
}
