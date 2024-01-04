CREATE TABLE users (
    id VARCHAR(255) PRIMARY KEY,
    email VARCHAR(512) NOT NULL,
    verified_email BOOLEAN NOT NULL,
    verify_email_code VARCHAR(100) NOT NULL,
    raw_score INT NOT NULL,
    referral_code VARCHAR(50) NOT NULL,
    referral_count INT NOT NULL,
    referring_user_id VARCHAR(255),
    FOREIGN KEY (referring_user_id) REFERENCES users(id)
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
	CONSTRAINT user_challenges_challenge_id_fkey FOREIGN KEY (challenge_id) REFERENCES public.challenges(id),
	CONSTRAINT user_challenges_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id)
);

INSERT INTO challenges (name, reward, reward_type, multiple_denominator, description, cta, cta_label) VALUES 
('Reach Level 2 on Zealy', 400, 'FIXED', '', 'Description', 'https://zealy.io/c/subquerynetwork', 'Sign up to Zealy and Start'),
('Reach Level 4 on Zealy', 700, 'FIXED', '', 'Description', 'https://zealy.io/c/subquerynetwork', 'Sign up to Zealy and Start'),
('Get Whitelisted for SQT Token Launch', 2000, 'FIXED', '', 'Description', 'https://subquery.foundation/sale', 'Start Whitelisting'),
('Acquire kSQT via Kepler Swap', 2, 'MULTIPLE', 'for each kSQT swapped!', 'Description', 'https://kepler.subquery.network/swap', 'Swap kSQT today'),
('Delegate on Kepler', 4, 'MULTIPLE', 'for each kSQT delegated!', 'Description', 'https://kepler.subquery.network/delegator', 'Delegate now'),
('Claim Rewards on Kepler', 5, 'MULTIPLE', 'for each kSQT claimed!', 'Description', 'https://kepler.subquery.network/profile/rewards', 'Claim Rewards Now');