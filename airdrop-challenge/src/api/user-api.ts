import express from "express";
import { UserResponse } from "../models/service/user-response";
import assert from "assert";
import { UserChallengeResponse } from "../models/service/user-challenge-response";
import { LeaderboardSummaryResponse } from "../models/service/leaderboard_summary-response";
import { getLeaderboard, getUser, getUserChallegesForQuery } from "../database";

const router = express.Router();

router.get<{}, UserResponse>("/:id", async (req, res) => {
  assert("id" in req.params, "ID missing from URL");
  const userID = req.params.id as string;
  console.log(`Got user request for user ${userID}`);
  res.json(await getUser(userID));
});

router.get<{}, UserChallengeResponse[]>("/:id/challenges", async (req, res) => {
  assert("id" in req.params, "ID missing from URL");
  const userID = req.params.id as string;
  console.log(`Got challenges request for user ${userID}`);
  res.json(await getUserChallegesForQuery(userID));
});

router.get<{}, LeaderboardSummaryResponse>(
  "/:id/leaderboard",
  async (req, res) => {
    assert("id" in req.params, "ID missing from URL");
    const userID = req.params.id as string;
    console.log(`Got leaderboard request for user ${userID}`);
    res.json(await getLeaderboard(userID));
  }
);

export default router;
