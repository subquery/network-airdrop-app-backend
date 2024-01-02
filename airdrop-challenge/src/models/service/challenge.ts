export interface Challenge {
  id: number;
  name: string;
  success: boolean;
  reward: number;
  reward_type: "FIXED" | "MULTIPLE";
  description: string;
  cta: string;
  cta_label: string;
}
