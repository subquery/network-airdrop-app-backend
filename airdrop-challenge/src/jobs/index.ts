import { CronJob } from "cron";
import { checkKYCStatus } from "./kyc-whitelisted";
import { checkDelegateRecord } from "./delegate-record";
import { checkRewardRecord } from "./reward-record";
import { checkZealyPoints } from "./zealy-points";

let minute = 0;

function nextMinute() {
  minute += 5;
  if (minute >= 60) {
    minute = minute % 60;
  }
  return minute;
}

CronJob.from({
  cronTime: `0 ${nextMinute()} * * * *`,
  onTick: checkKYCStatus,
  timeZone: "UTC",
  start: true,
  runOnInit: false,
});

CronJob.from({
  cronTime: `0 ${nextMinute()} * * * *`,
  onTick: checkDelegateRecord,
  timeZone: "UTC",
  start: true,
  runOnInit: false,
});

CronJob.from({
  cronTime: `0 ${nextMinute()} * * * *`,
  onTick: checkRewardRecord,
  timeZone: "UTC",
  start: true,
  runOnInit: false,
});

CronJob.from({
  cronTime: `0 ${nextMinute()} * * * *`,
  onTick: checkZealyPoints,
  timeZone: "UTC",
  start: true,
  runOnInit: false,
});
