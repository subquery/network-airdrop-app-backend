import { Generated, Insertable, Selectable, Updateable } from "kysely";

export interface Database {
  users: UsersTable;
  challenges: ChallengesTable;
  user_challenges: UserChallengesTable;
}

export interface UsersTable {
  id: Generated<string>;
  email: string;
  verified_email: boolean;
  verify_email_code: string;
  raw_score: number;
  referral_code: string;
  referral_count: number;
  referring_user_id: string | undefined;
}

export interface ChallengesTable {
  id: Generated<number>;
  name: string;
  reward: number;
  reward_type: "FIXED" | "MULTIPLE";
  multiple_denominator: string;
  description: string;
  cta: string;
  cta_label: string;
}

export interface UserChallengesTable {
  id: Generated<number>;
  user_id: string;
  challenge_id: number;
  achieved: Date | undefined;
  amount: BigInt;
}

// You should not use the table schema interfaces directly. Instead, you should
// use the `Selectable`, `Insertable` and `Updateable` wrappers. These wrappers
// make sure that the correct types are used in each operation.
export type User = Selectable<UsersTable>;
export type NewUser = Insertable<UsersTable>;
export type UserUpdate = Updateable<UsersTable>;

export type Challenge = Selectable<ChallengesTable>;

export type UserChallenge = Selectable<UserChallengesTable>;
export type NewUserChallenge = Insertable<UserChallengesTable>;
export type UserChallengeUpdate = Updateable<UserChallengesTable>;
