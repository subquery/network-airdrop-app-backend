import express from "express";
import { UserResponse } from "../models/service/user-response";
import assert from "assert";
import { UserChallengeResponse } from "../models/service/user-challenge-response";
import { LeaderboardSummaryResponse } from "../models/service/leaderboard_summary-response";
import {
  getLeaderboard,
  getUser,
  getUserChallengesForQuery,
} from "../database";

const router = express.Router();

router.get<{}, UserResponse>("/:id", async (req, res, next) => {
  assert("id" in req.params, "ID missing from URL");
  const userID = req.params.id as string;
  console.log(`Got user request for user ${userID}`);
  res.json(
    (await getUser(userID).catch((e) => {
      res.statusCode = 401;
      next(e);
    })) || undefined
  );
});

router.get<{}, UserChallengeResponse[]>(
  "/:id/challenges",
  async (req, res, next) => {
    assert("id" in req.params, "ID missing from URL");
    const userID = req.params.id as string;
    console.log(`Got challenges request for user ${userID}`);
    res.json(
      (await getUserChallengesForQuery(userID).catch((e) => next(e))) ||
        undefined
    );
  }
);

router.get<{}, LeaderboardSummaryResponse>(
  "/:id/leaderboard",
  async (req, res, next) => {
    assert("id" in req.params, "ID missing from URL");
    const userID = req.params.id as string;
    console.log(`Got leaderboard request for user ${userID}`);
    res.json((await getLeaderboard(userID).catch((e) => next(e))) || undefined);
  }
);

export default router;
