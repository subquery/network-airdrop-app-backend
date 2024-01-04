import { CronJob } from "cron";
import { checkKYCStatus } from "./kyc-whitelisted";
import { checkDelegateRecord } from "./delegate-record";

let minute = 0;

function increaseMinute() {
  minute += 5;
  if (minute >= 60) {
    minute = minute % 60;
  }
  return minute;
}

CronJob.from({
  cronTime: `0 ${increaseMinute()} * * * *`,
  onTick: checkKYCStatus,
  timeZone: "UTC",
  start: true,
  runOnInit: false,
});

CronJob.from({
  cronTime: `0 ${increaseMinute()} * * * *`,
  onTick: checkDelegateRecord,
  timeZone: "UTC",
  start: true,
  runOnInit: false,
});
