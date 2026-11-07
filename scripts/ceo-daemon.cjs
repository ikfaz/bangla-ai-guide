#!/usr/bin/env node
// 24/7 Autonomous CEO Daemon for banglaaiguide.com (runs with IsDaemon: true)
// - Runs a check every 15 minutes
// - At 03:00 UTC (09:00 AM Bangladesh Standard Time) daily, triggers the daily GSC + trend + sitemap pulse
// - Every 6 hours, syncs sitemaps (`sitemap.xml`, `news-sitemap.xml`, `feed.xml`) with Google Search Console

const { spawnSync } = require("child_process");
const path = require("path");
const fs = require("fs");

const ROOT = path.resolve(__dirname, "..");
const LOG_FILE = "/tmp/banglaaiguide-ceo-daemon.log";
const TICK_MS = 15 * 60 * 1000; // Check clock every 15 minutes
const SYNC_INTERVAL_MS = 6 * 60 * 60 * 1000; // 6-hour GSC sitemap sync

let lastSyncAt = 0;
let lastDailyDate = "";

function log(msg) {
  const line = `[${new Date().toISOString()}] ${msg}\n`;
  process.stdout.write(line);
  try {
    fs.appendFileSync(LOG_FILE, line, "utf8");
  } catch {}
}

function runPulse(reason) {
  log(`Running CEO Pulse (${reason})...`);
  const build = spawnSync(process.execPath, [path.join(__dirname, "build.cjs")], {
    cwd: ROOT,
    encoding: "utf8",
  });
  if (build.status !== 0 && build.stderr) {
    log(`Build warn: ${build.stderr.trim()}`);
  }
  const pulse = spawnSync(process.execPath, [path.join(__dirname, "ceo-pulse.cjs"), "--submit-sitemaps"], {
    cwd: ROOT,
    encoding: "utf8",
  });
  if (pulse.stdout) log(pulse.stdout.trim());
  if (pulse.stderr) log(`WARN: ${pulse.stderr.trim()}`);
  lastSyncAt = Date.now();
  log(`Cycle complete (${reason}, exit=${pulse.status}).`);
}

function tick() {
  const now = new Date();
  const utcDate = now.toISOString().slice(0, 10);
  const utcHour = now.getUTCHours();

  // 03:00 UTC = 09:00 AM Bangladesh Standard Time (Asia/Dhaka)
  if (utcHour === 3 && lastDailyDate !== utcDate) {
    lastDailyDate = utcDate;
    runPulse(`Daily 09:00 AM BST (${utcDate}) scheduled run`);
    return;
  }

  if (Date.now() - lastSyncAt >= SYNC_INTERVAL_MS) {
    runPulse("6-hour GSC & sitemap sync");
  }
}

log("Bangla AI Guide 24/7 CEO Daemon started (Daily window: 09:00 AM BST / 03:00 UTC).");
tick();
setInterval(tick, TICK_MS);
