CREATE TABLE users (
	id varchar(255) NOT NULL,
	email varchar(512) NOT NULL,
	verified_email bool NOT NULL,
	verify_email_code varchar(100) NOT NULL,
	raw_score int4 NOT NULL,
	referral_code varchar(50) NOT NULL,
	referral_count int4 NOT NULL,
	referring_user_id varchar(255) NULL,
	CONSTRAINT users_email_unique UNIQUE (email),
	CONSTRAINT users_pkey PRIMARY KEY (id),
	CONSTRAINT users_referring_user_id_fkey FOREIGN KEY (referring_user_id) REFERENCES users(id)
);

CREATE TYPE reward_type AS ENUM ('FIXED', 'MULTIPLE');

CREATE TABLE challenges (
    id SERIAL PRIMARY KEY,
    name VARCHAR(512) NOT NULL,
    reward INT NOT NULL,
    reward_type reward_type NOT NULL,
    multiple_denominator VARCHAR(256) NOT NULL,
    description TEXT,
    cta VARCHAR(512) NOT NULL,
    cta_label VARCHAR(512) NOT NULL
);

CREATE TABLE user_challenges (
	id serial4 NOT NULL,
	user_id varchar(255) NOT NULL,
	challenge_id int4 NOT NULL,
	achieved timestamp NULL,
	amount numeric NOT NULL DEFAULT 0,
	CONSTRAINT user_challenges_pkey PRIMARY KEY (id),
	CONSTRAINT user_challenges_challenge_id_fkey FOREIGN KEY (challenge_id) REFERENCES challenges(id),
	CONSTRAINT user_challenges_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id)
);

INSERT INTO challenges (name, reward, reward_type, description, cta, cta_label) VALUES 
('Reach 500 XP on Zealy', 500, 'FIXED', 'Description', 'https://zealy.io/c/subquerynetwork', 'Sign up to Zealy and Start'),
('Reach 1,200 XP on Zealy', 1000, 'FIXED', 'Description', 'https://zealy.io/c/subquerynetwork', 'Sign up to Zealy and Start'),
('Reach 2,200 XP on Zealy', 1000, 'FIXED', 'Description', 'https://zealy.io/c/subquerynetwork', 'Sign up to Zealy and Start'),
('Get Whitelisted for SQT Token Launch', 2000, 'FIXED', 'Description', 'https://subquery.foundation/sale', 'Start Whitelisting'),
('Acquire 500 kSQT via Kepler Swap', 500, 'FIXED', 'Description', 'https://kepler.subquery.network/swap', 'Swap kSQT today'),
('Acquire 1,000 kSQT via Kepler Swap', 500, 'FIXED', 'Description', 'https://kepler.subquery.network/swap', 'Swap kSQT today'),
('Acquire 1,500 kSQT via Kepler Swap', 500, 'FIXED', 'Description', 'https://kepler.subquery.network/swap', 'Swap kSQT today'),
('Acquire 2,000 kSQT via Kepler Swap', 500, 'FIXED', 'Description', 'https://kepler.subquery.network/swap', 'Swap kSQT today'),
('Delegate 500 kSQT on Kepler', 400, 'FIXED', 'Description', 'https://kepler.subquery.network/delegator', 'Delegate now'),
('Delegate 1,000 kSQT on Kepler', 400, 'FIXED', 'Description', 'https://kepler.subquery.network/delegator', 'Delegate now'),
('Delegate 1,500 kSQT on Kepler', 400, 'FIXED', 'Description', 'https://kepler.subquery.network/delegator', 'Delegate now'),
('Delegate 2,000 kSQT on Kepler', 400, 'FIXED', 'Description', 'https://kepler.subquery.network/delegator', 'Delegate now'),
('Claim 100 kSQT as Rewards on Kepler', 400, 'FIXED', 'Description', 'https://kepler.subquery.network/profile/rewards', 'Claim Rewards Now'),
('Claim 200 kSQT as Rewards on Kepler', 400, 'FIXED', 'Description', 'https://kepler.subquery.network/profile/rewards', 'Claim Rewards Now');
