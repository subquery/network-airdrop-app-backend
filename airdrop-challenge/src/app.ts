import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";

import * as middlewares from "./middlewares";
import userAPI from "./api/user-api";
import MessageResponse from "./interfaces/MessageResponse";
import { UserResponse } from "./models/service/user-response";
import { UserSignupRequest } from "./models/service/user-signup-request";
import { createNewUser, getReferringUserID, verifyUserEmail } from "./database";
import assert from "assert";

require("dotenv").config();

const app = express();

app.use(morgan("dev"));
app.use(helmet());
app.use(cors());
app.use(express.json());

app.get<{}, MessageResponse>("/", (req, res) => {
  res.json({
    message: "SubQuery Airdrop API",
  });
});

app.post<{}, UserResponse>("/signup", async (req, res) => {
  console.log("Got signup request");
  const signup = req.body as UserSignupRequest;
  const referral_code = signup.referral_code;
  let referring_user_id: string | undefined = undefined;
  if (referral_code) {
    referring_user_id = await getReferringUserID(referral_code);
  }
  await createNewUser(signup, referring_user_id);

  // Signup user in SendGrid marketing
  await fetch("https://signup.subquery.network/subscribe", {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: signup.email,
    }),
  });

  res.sendStatus(201);
});

// We don't need this
app.post("/verify_email/:code", async (req, res) => {
  assert("code" in req.params, "Code missing from URL");
  const verify_email_code = req.params.code as string;
  console.log(`Got email verify code ${verify_email_code}`);
  await verifyUserEmail(verify_email_code);
  res.sendStatus(200);
});

app.use("/user", userAPI);

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

export default app;
