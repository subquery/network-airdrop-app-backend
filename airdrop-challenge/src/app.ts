import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";

import * as middlewares from "./middlewares";
import userAPI from "./api/user-api";
import MessageResponse from "./interfaces/MessageResponse";
import { User } from "./models/service/user";
import { UserSignupRequest } from "./models/service/user-signup-request";

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

app.post<{}, User>("/signup", (req, res) => {
  console.log("Got signup request");
  const signup = req.body as UserSignupRequest;
  //assert();
  res.sendStatus(201);
});

app.use("/user", userAPI);

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

export default app;
