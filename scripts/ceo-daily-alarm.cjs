#!/usr/bin/env node
// Daily 09:00 AM Bangladesh Time (03:00 UTC) wake-up alarm for the autonomous CEO agent.
// When run as a non-daemon background task, exiting at 03:00 UTC automatically wakes
// the agent conversation to research trends, write & publish the daily article,
// push to GitHub, and submit sitemaps to Google Search Console & Google News.

const { spawnSync } = require("child_process");
const path = require("path");

const TARGET_UTC_HOUR = 3; // 03:00 UTC = 09:00 AM Bangladesh Standard Time (UTC+6)
const TARGET_UTC_MINUTE = 0;

function nextRunUtc(now = new Date()) {
  const next = new Date(Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate(),
    TARGET_UTC_HOUR,
    TARGET_UTC_MINUTE,
    0,
    0
  ));
  if (next.getTime() <= now.getTime() + 60 * 1000) {
    next.setUTCDate(next.getUTCDate() + 1);
  }
  return next;
}

const now = new Date();
const target = nextRunUtc(now);
const waitMs = target.getTime() - now.getTime();
const bstString = new Date(target.getTime() + 6 * 3600 * 1000).toISOString().replace("T", " ").slice(0, 16) + " BST (UTC+6)";

console.log(`[CEO Daily Schedule] Current time: ${now.toISOString()}`);
console.log(`[CEO Daily Schedule] Next daily article publish window: ${target.toISOString()} (${bstString})`);
console.log(`[CEO Daily Schedule] Sleeping for ${Math.round(waitMs / 60000)} minutes until wake-up...`);

// Wait in chunks (max 30 min per timeout) so Node timers never overflow
function sleepUntil(targetTime) {
  const remaining = targetTime - Date.now();
  if (remaining <= 0) {
    console.log(`[CEO Daily Schedule] Wake-up triggered at ${new Date().toISOString()}! Running GSC pulse pre-check...`);
    const pulse = spawnSync(process.execPath, [path.join(__dirname, "ceo-pulse.cjs"), "--submit-sitemaps"], {
      cwd: path.resolve(__dirname, ".."),
      encoding: "utf8",
    });
    if (pulse.stdout) console.log(pulse.stdout);
    console.log("[CEO Daily Schedule] ALARM COMPLETE: Agent should now research trends, publish today's Bangla AI article, git push, and re-arm this alarm.");
    process.exit(0);
  }
  const chunk = Math.min(remaining, 30 * 60 * 1000);
  setTimeout(() => sleepUntil(targetTime), chunk);
}

sleepUntil(target.getTime());
