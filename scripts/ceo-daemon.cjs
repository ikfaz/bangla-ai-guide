#!/usr/bin/env node
// 24/7 Autonomous CEO Daemon for banglaaiguide.com
// Periodically syncs repository, regenerates sitemaps/news-sitemap/llms.txt if needed,
// and pings Google Search Console sitemaps (`sitemap.xml`, `news-sitemap.xml`, `feed.xml`).

const { spawnSync } = require("child_process");
const path = require("path");
const fs = require("fs");

const ROOT = path.resolve(__dirname, "..");
const LOG_FILE = "/tmp/banglaaiguide-ceo-daemon.log";
const INTERVAL_MS = 6 * 60 * 60 * 1000; // Every 6 hours check & sync GSC sitemaps

function log(msg) {
  const line = `[${new Date().toISOString()}] ${msg}\n`;
  process.stdout.write(line);
  try {
    fs.appendFileSync(LOG_FILE, line, "utf8");
  } catch {}
}

function runCycle() {
  log("Starting CEO Daemon sync cycle...");
  const pulse = spawnSync(process.execPath, [path.join(__dirname, "ceo-pulse.cjs"), "--submit-sitemaps"], {
    cwd: ROOT,
    encoding: "utf8",
  });
  if (pulse.stdout) log(pulse.stdout.trim());
  if (pulse.stderr) log(`WARN: ${pulse.stderr.trim()}`);
  log(`Cycle complete (exit=${pulse.status}). Next check in 6 hours.`);
}

log("Bangla AI Guide 24/7 CEO Daemon initialized.");
runCycle();
setInterval(runCycle, INTERVAL_MS);
