import express from "express";
import { UserResponse } from "../models/service/user-response";
import assert from "assert";
import { UserChallengeResponse } from "../models/service/user-challenge-response";
import { LeaderboardSummaryResponse } from "../models/service/leaderboard_summary-response";
import { getLeaderboard, getUser, getUserChallegesForQuery } from "../database";

const router = express.Router();

router.get<{}, UserResponse>("/:id", async (req, res) => {
  assert("id" in req.params, "ID missing from URL");
  res.json(await getUser(req.params.id as string));
});

router.get<{}, UserChallengeResponse[]>("/:id/challenges", async (req, res) => {
  assert("id" in req.params, "ID missing from URL");
  res.json(await getUserChallegesForQuery(req.params.id as string));
});

router.get<{}, LeaderboardSummaryResponse>(
  "/:id/leaderboard",
  async (req, res) => {
    assert("id" in req.params, "ID missing from URL");
    res.json(await getLeaderboard(req.params.id as string));
  }
);

export default router;
