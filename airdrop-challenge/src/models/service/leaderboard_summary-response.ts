export interface LeaderboardSummaryResponse {
  total_participants: number;
  summary: LeaderboardRecordResponse[];
}

export interface LeaderboardRecordResponse {
  rank: number;
  name: string;
  raw_score: number;
  referral_multiplier: number;
  total_score: number;
}
