import express from "express";
import { User } from "../models/service/user";
import assert from "assert";
import { Challenge } from "../models/service/challenge";
import { LeaderboardSummary } from "../models/service/leaderboard_summary";

const router = express.Router();

router.get<{}, User>("/:id", (req, res) => {
  assert("id" in req.params, "ID missing from URL");
  const result: User = {
    address: req.params.id as string,
    email: "james@subquery.network",
    verified_email: true,
    raw_score: 1400,
    total_score: 2800,
    rank: 121,
    referral_code: "GHDSDGDS",
    referral_count: 2,
  };
  res.json(result);
});

router.get<{}, Challenge[]>("/:id/challenges", (req, res) => {
  assert("id" in req.params, "ID missing from URL");
  const result: Challenge[] = [
    {
      id: 1,
      name: "Reach Level 2 on Zealy",
      success: true,
      reward: 400,
      reward_type: "FIXED",
      description:
        "This one is easy, join our Zealy program and reach level 2 to be awarded 400 points.\n\nYou can (sign up to Zealy here)[https://zealy.io/c/subquerynetwork] and start earning",
      cta_label: "Sign up to Zealy and Start",
      cta: "https://zealy.io/c/subquerynetwork",
    },
    {
      id: 2,
      name: "Reach Level 4 on Zealy",
      success: false,
      reward: 700,
      reward_type: "FIXED",
      description:
        "This one is easy, join our Zealy program and reach level 4 to be awarded 700 points.\n\nYou can (sign up to Zealy here)[https://zealy.io/c/subquerynetwork] and start earning",
      cta_label: "Sign up to Zealy and Start",
      cta: "https://zealy.io/c/subquerynetwork",
    },
    {
      id: 3,
      name: "Acquire kSQT via Kepler Swap",
      success: false,
      reward: 2,
      reward_type: "MULTIPLE",
      description:
        "For each kSQT that you swap using our official swap tool, you get 2 points, Read the instructions here and start swapping",
      cta_label: "Head to kepler Seap",
      cta: "https://kepler.subquery.network",
    },
  ];
  res.json(result);
});

router.get<{}, LeaderboardSummary>("/:id/leaderboard", (req, res) => {
  assert("id" in req.params, "ID missing from URL");
  const result: LeaderboardSummary = {
    total_participants: 2213,
    summary: [
      {
        rank: 1,
        name: "0x1231231321",
        raw_score: 1000,
        referral_multiplier: 8,
        total_score: 8000,
      },
      {
        rank: 2,
        name: "0x1231231321",
        raw_score: 1000,
        referral_multiplier: 8,
        total_score: 8000,
      },
      {
        rank: 3,
        name: "0x1231231321",
        raw_score: 1000,
        referral_multiplier: 8,
        total_score: 8000,
      },
      {
        rank: 4,
        name: "0x1231231321",
        raw_score: 1000,
        referral_multiplier: 8,
        total_score: 8000,
      },
      {
        rank: 5,
        name: "0x1231231321",
        raw_score: 1000,
        referral_multiplier: 8,
        total_score: 8000,
      },
      {
        rank: 119,
        name: "0x1231231321",
        raw_score: 700,
        referral_multiplier: 2,
        total_score: 1400,
      },
      {
        rank: 120,
        name: "0x1231231321",
        raw_score: 650,
        referral_multiplier: 2,
        total_score: 1300,
      },
      {
        rank: 121,
        name: req.params.id as string,
        raw_score: 620,
        referral_multiplier: 2,
        total_score: 1240,
      },
      {
        rank: 4,
        name: "0x1231231321",
        raw_score: 500,
        referral_multiplier: 1,
        total_score: 500,
      },
      {
        rank: 5,
        name: "0x1231231321",
        raw_score: 450,
        referral_multiplier: 1,
        total_score: 450,
      },
    ],
  };
  res.json(result);
});

export default router;
