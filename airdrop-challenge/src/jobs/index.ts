import { CronJob } from "cron";
import { checkKYCStatus } from "./kyc-whitelisted";
import { checkDelegateRecord } from "./delegate-record";

CronJob.from({
  cronTime: "0 0 * * * *",
  onTick: checkKYCStatus,
  timeZone: "UTC",
  start: true,
  runOnInit: false,
});

CronJob.from({
  cronTime: "0 5 * * * *",
  onTick: checkDelegateRecord,
  timeZone: "UTC",
  start: true,
  runOnInit: true,
});
