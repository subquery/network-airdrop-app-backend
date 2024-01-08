import axios from "axios";
import {
  getChallenge,
  getUserChallenge,
  getUsersWithoutChallengeAchieved,
  updateUserChallenge,
} from "../database";
import { Challenge } from "../models/database-models";

export async function checkKYCStatus() {
  const startTime = Date.now();
  let challenge: Challenge;
  try {
    challenge = await getChallenge("whitelist-1");
  } catch (e) {
    console.error(`Challenge not found: ${e}`);
    return;
  }
  const users = await getUsersWithoutChallengeAchieved(challenge.id);
  console.log(`Checking KYC status for ${users.length} users`);
  for (let user of users) {
    try {
      const result = await axios.request({
        method: "GET",
        url: `https://sq-airdrop-backend.subquery.network/kyc/status/${user.id}`,
        timeout: 10000,
      });
      if (result.data.status === true) {
        await getUserChallenge(user.id, challenge.id);
        await updateUserChallenge(
          user.id,
          challenge.id,
          new Date(),
          challenge.reward
        );
      }
    } catch (e) {
      console.error(`Error checking KYC status for ${user.id}: ${e}`);
    }
  }
  console.log(`Done checking KYC status. Took ${Date.now() - startTime}ms.`);
}
