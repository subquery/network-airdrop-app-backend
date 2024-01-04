import axios from "axios";
import {
  getChallengeId,
  getUserChallenge,
  getUsersWithoutChallengeAchieved,
  updateUserChallenge,
} from "../database";

export async function checkKYCStatus() {
  let challengeId: number;
  try {
    challengeId = await getChallengeId("Get Whitelisted for SQT Token Launch");
  } catch (e) {
    console.error(`Challenge not found: ${e}`);
    return;
  }
  const users = await getUsersWithoutChallengeAchieved(challengeId);
  console.log(`Checking KYC status for ${users.length} users`);
  for (let user of users) {
    try {
      const result = await axios.request({
        method: "GET",
        url: `https://sq-airdrop-backend.subquery.network/kyc/status/${user.id}`,
        timeout: 10000,
      });
      if (result.data.status === true) {
        await getUserChallenge(user.id, challengeId);
        await updateUserChallenge(user.id, challengeId, new Date(), 0n);
      }
    } catch (e) {
      console.error(`Error checking KYC status for ${user.id}: ${e}`);
    }
  }
}
