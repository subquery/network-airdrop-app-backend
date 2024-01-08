export interface UserChallengeResponse {
  id: number;
  name: string;
  success: boolean;
  success_date: number | undefined;
  reward: number;
  reward_type: "FIXED" | "MULTIPLE";
  description: string;
  cta: string;
  cta_label: string;
}
