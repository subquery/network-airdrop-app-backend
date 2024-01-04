import axios from "axios";
import {
  getChallengeId,
  getUserChallenge,
  getUsersWithoutChallengeAchieved,
  updateUserChallenge,
} from "../database";

export async function checkZealyPoints() {
  let challengeIdLevel2: number;
  let challengeIdLevel4: number;
  try {
    challengeIdLevel2 = await getChallengeId("Reach Level 2 on Zealy");
    challengeIdLevel4 = await getChallengeId("Reach Level 4 on Zealy");
  } catch (e) {
    console.error(`Challenge not found: ${e}`);
    return;
  }
  const users = await getUsersWithoutChallengeAchieved(challengeIdLevel4);
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
          ethAddress: user.id,
        },
      });
      const zealyUser: ZealyUser = result.data;
      const challengeLevel2 = await getUserChallenge(
        user.id,
        challengeIdLevel2
      );
      const challengeLevel4 = await getUserChallenge(
        user.id,
        challengeIdLevel4
      );
      if (zealyUser.level >= 2 && !challengeLevel2.achieved) {
        await updateUserChallenge(user.id, challengeIdLevel2, new Date(), 0);
      }
      if (zealyUser.level >= 4 && !challengeLevel4.achieved) {
        await updateUserChallenge(user.id, challengeIdLevel4, new Date(), 0);
      }
    } catch (e) {
      console.error(`Error checking zealy points for ${user.id}: ${e}`);
    }
  }
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
