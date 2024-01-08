CREATE TYPE reward_type AS ENUM ('FIXED', 'MULTIPLE');

CREATE TABLE
	users (
		id varchar(255) NOT NULL,
		email varchar(512) NOT NULL,
		verified_email bool NOT NULL,
		verify_email_code varchar(100) NOT NULL,
		raw_score int4 NOT NULL,
		referral_code varchar(50) NOT NULL,
		referral_count int4 NOT NULL,
		referring_user_id varchar(255) NULL,
		challenge_score int4 NOT NULL DEFAULT 0,
		total_score int4 NOT NULL DEFAULT 0,
		"rank" int4 NULL,
		CONSTRAINT users_email_unique UNIQUE (email),
		CONSTRAINT users_pkey PRIMARY KEY (id),
		CONSTRAINT users_referring_user_id_fkey FOREIGN KEY (referring_user_id) REFERENCES users (id)
	);

CREATE TABLE
	challenges (
		id serial4 NOT NULL,
		"name" varchar(512) NOT NULL,
		fixed_amount int4 NOT NULL,
		tag varchar NOT NULL,
		reward int4 NOT NULL,
		reward_type reward_type NOT NULL,
		description text NULL,
		cta varchar(512) NOT NULL,
		cta_label varchar(512) NOT NULL,
		CONSTRAINT challenges_pkey PRIMARY KEY (id),
		CONSTRAINT challenges_tag_unique UNIQUE (tag)
	);

CREATE TABLE
	user_challenges (
		id serial4 NOT NULL,
		user_id varchar(255) NOT NULL,
		challenge_id int4 NOT NULL,
		achieved timestamp NULL,
		amount numeric NOT NULL DEFAULT 0,
		CONSTRAINT user_challenges_pkey PRIMARY KEY (id),
		CONSTRAINT user_challenges_challenge_id_fkey FOREIGN KEY (challenge_id) REFERENCES challenges (id),
		CONSTRAINT user_challenges_user_id_fkey FOREIGN KEY (user_id) REFERENCES users (id)
	);

INSERT INTO
	challenges (
		name,
		fixed_amount,
		tag,
		reward,
		reward_type,
		description,
		cta,
		cta_label
	)
VALUES
	(
		'Reach 1,000 XP on Zealy',
		1000,
		'zealy-1',
		400,
		'FIXED',
		'Description',
		'https://zealy.io/c/subquerynetwork',
		'Sign up to Zealy and Start'
	),
	(
		'Reach 5,000 XP on Zealy',
		5000,
		'zealy-2',
		500,
		'FIXED',
		'Description',
		'https://zealy.io/c/subquerynetwork',
		'Sign up to Zealy and Start'
	),
	(
		'Reach 10,000 XP on Zealy',
		10000,
		'zealy-3',
		500,
		'FIXED',
		'Description',
		'https://zealy.io/c/subquerynetwork',
		'Sign up to Zealy and Start'
	),
	(
		'Reach 15,000 XP on Zealy',
		15000,
		'zealy-4',
		500,
		'FIXED',
		'Description',
		'https://zealy.io/c/subquerynetwork',
		'Sign up to Zealy and Start'
	),
	(
		'Reach 20,000 XP on Zealy',
		20000,
		'zealy-5',
		500,
		'FIXED',
		'Description',
		'https://zealy.io/c/subquerynetwork',
		'Sign up to Zealy and Start'
	),
	(
		'Reach 25,000 XP on Zealy',
		25000,
		'zealy-6',
		500,
		'FIXED',
		'Description',
		'https://zealy.io/c/subquerynetwork',
		'Sign up to Zealy and Start'
	),
	(
		'Reach 30,000 XP on Zealy',
		30000,
		'zealy-7',
		500,
		'FIXED',
		'Description',
		'https://zealy.io/c/subquerynetwork',
		'Sign up to Zealy and Start'
	),
	(
		'Get Whitelisted for SQT Token Launch',
		0,
		'whitelist-1',
		2000,
		'FIXED',
		'Description',
		'https://subquery.foundation/sale',
		'Start Whitelisting'
	),
	(
		'Acquire 500 kSQT via Kepler Swap',
		500,
		'swap-1',
		500,
		'FIXED',
		'Description',
		'https://kepler.subquery.network/swap',
		'Swap kSQT today'
	),
	(
		'Acquire 1,000 kSQT via Kepler Swap',
		1000,
		'swap-2',
		500,
		'FIXED',
		'Description',
		'https://kepler.subquery.network/swap',
		'Swap kSQT today'
	),
	(
		'Acquire 1,500 kSQT via Kepler Swap',
		1500,
		'swap-3',
		500,
		'FIXED',
		'Description',
		'https://kepler.subquery.network/swap',
		'Swap kSQT today'
	),
	(
		'Acquire 2,000 kSQT via Kepler Swap',
		2000,
		'swap-4',
		500,
		'FIXED',
		'Description',
		'https://kepler.subquery.network/swap',
		'Swap kSQT today'
	),
	(
		'Delegate 500 kSQT on Kepler',
		500,
		'delegate-1',
		400,
		'FIXED',
		'Description',
		'https://kepler.subquery.network/delegator',
		'Delegate now'
	),
	(
		'Delegate 1,000 kSQT on Kepler',
		1000,
		'delegate-2',
		400,
		'FIXED',
		'Description',
		'https://kepler.subquery.network/delegator',
		'Delegate now'
	),
	(
		'Delegate 1,500 kSQT on Kepler',
		1500,
		'delegate-3',
		400,
		'FIXED',
		'Description',
		'https://kepler.subquery.network/delegator',
		'Delegate now'
	),
	(
		'Delegate 2,000 kSQT on Kepler',
		2000,
		'delegate-4',
		400,
		'FIXED',
		'Description',
		'https://kepler.subquery.network/delegator',
		'Delegate now'
	),
	(
		'Claim 100 kSQT as Rewards on Kepler',
		100,
		'reward-1',
		400,
		'FIXED',
		'Description',
		'https://kepler.subquery.network/profile/rewards',
		'Claim Rewards Now'
	),
	(
		'Claim 200 kSQT as Rewards on Kepler',
		200,
		'reward-2',
		400,
		'FIXED',
		'Description',
		'https://kepler.subquery.network/profile/rewards',
		'Claim Rewards Now'
	);