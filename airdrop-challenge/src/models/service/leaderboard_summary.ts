export interface LeaderboardSummary {
  total_participants: number;
  summary: LeaderboardRecord[];
}

export interface LeaderboardRecord {
  rank: number;
  name: string;
  raw_score: number;
  referral_multiplier: number;
  total_score: number;
}
