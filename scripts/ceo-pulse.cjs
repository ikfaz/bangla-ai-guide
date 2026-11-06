#!/usr/bin/env node
// CEO Pulse CLI: Live Google Search Console & GA4 reporting + automated
// Sitemap & Google News Sitemap submission for banglaaiguide.com.
//
// Usage:
//   node scripts/ceo-pulse.cjs                   # Full report + submit sitemaps
//   node scripts/ceo-pulse.cjs --submit-sitemaps # Submit sitemap.xml, news-sitemap.xml, feed.xml
//   node scripts/ceo-pulse.cjs --inspect <url>   # Inspect URL indexing status in GSC

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const DEFAULT_SA_PATHS = [
  process.env.GOOGLE_APPLICATION_CREDENTIALS,
  "/home/antigravity/site-reporter-513623-7ba12965e51c.json",
  path.resolve(__dirname, "..", "..", "site-reporter-513623-7ba12965e51c.json"),
].filter(Boolean);

const SITE_DOMAIN = "sc-domain:banglaaiguide.com";
const SITE_URL = "https://banglaaiguide.com";
const SITEMAPS_TO_SUBMIT = [
  `${SITE_URL}/sitemap.xml`,
  `${SITE_URL}/news-sitemap.xml`,
  `${SITE_URL}/feed.xml`,
];

function loadServiceAccount() {
  for (const p of DEFAULT_SA_PATHS) {
    if (fs.existsSync(p)) {
      return JSON.parse(fs.readFileSync(p, "utf8"));
    }
  }
  throw new Error(
    "Service account JSON not found. Set GOOGLE_APPLICATION_CREDENTIALS or place key at /home/antigravity/site-reporter-513623-7ba12965e51c.json"
  );
}

async function getAccessToken(sa, scopes) {
  const headRes = await fetch("https://oauth2.googleapis.com/token", { method: "HEAD" });
  const dateHeader = headRes.headers.get("date");
  const now = dateHeader ? Math.floor(new Date(dateHeader).getTime() / 1000) : Math.floor(Date.now() / 1000);
  const header = Buffer.from(JSON.stringify({ alg: "RS256", typ: "JWT" })).toString("base64url");
  const payload = Buffer.from(
    JSON.stringify({
      iss: sa.client_email,
      scope: scopes.join(" "),
      aud: sa.token_uri,
      exp: now + 3600,
      iat: now,
    })
  ).toString("base64url");
  const sign = crypto.createSign("RSA-SHA256");
  sign.update(`${header}.${payload}`);
  const jwt = `${header}.${payload}.${sign.sign(sa.private_key, "base64url")}`;

  const res = await fetch(sa.token_uri, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: jwt,
    }),
  });
  const data = await res.json();
  if (!data.access_token) {
    throw new Error(`OAuth token error: ${JSON.stringify(data)}`);
  }
  return { token: data.access_token, serverDate: dateHeader ? new Date(dateHeader) : new Date() };
}

async function submitSitemaps(token) {
  const headers = { Authorization: `Bearer ${token}` };
  const siteEnc = encodeURIComponent(SITE_DOMAIN);
  console.log("\n=== Submitting Sitemaps to Google Search Console ===");
  for (const smUrl of SITEMAPS_TO_SUBMIT) {
    const putUrl = `https://www.googleapis.com/webmasters/v3/sites/${siteEnc}/sitemaps/${encodeURIComponent(smUrl)}`;
    const res = await fetch(putUrl, { method: "PUT", headers });
    console.log(`  PUT ${smUrl} -> HTTP ${res.status} ${res.status === 204 ? "✓ Submitted" : await res.text()}`);
  }
}

async function inspectUrl(token, targetUrl) {
  console.log(`\n=== GSC URL Inspection: ${targetUrl} ===`);
  const res = await fetch("https://searchconsole.googleapis.com/v1/urlInspection/index:inspect", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      inspectionUrl: targetUrl,
      siteUrl: SITE_DOMAIN,
    }),
  });
  const data = await res.json();
  const idx = data?.inspectionResult?.indexStatusResult;
  if (idx) {
    console.log(`  Verdict: ${idx.verdict} | Coverage: ${idx.coverageState} | Last Crawl: ${idx.lastCrawlTime || "N/A"}`);
  } else {
    console.log("  Response:", JSON.stringify(data));
  }
}

async function runReport(token, serverDate) {
  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
  const siteEnc = encodeURIComponent(SITE_DOMAIN);
  const endDate = serverDate.toISOString().slice(0, 10);
  const start90 = new Date(serverDate.getTime() - 90 * 86400 * 1000).toISOString().slice(0, 10);

  console.log(`\n=== GSC Executive Pulse (${start90} to ${endDate}) ===`);
  const totRes = await fetch(`https://www.googleapis.com/webmasters/v3/sites/${siteEnc}/searchAnalytics/query`, {
    method: "POST",
    headers,
    body: JSON.stringify({ startDate: start90, endDate }),
  });
  const totData = await totRes.json();
  const tot = totData.rows?.[0] || { clicks: 0, impressions: 0, ctr: 0, position: 0 };
  console.log(
    `  Total Clicks: ${tot.clicks} | Total Impressions: ${tot.impressions} | Avg CTR: ${(tot.ctr * 100).toFixed(2)}% | Avg Position: ${tot.position.toFixed(1)}`
  );

  const qRes = await fetch(`https://www.googleapis.com/webmasters/v3/sites/${siteEnc}/searchAnalytics/query`, {
    method: "POST",
    headers,
    body: JSON.stringify({ startDate: start90, endDate, dimensions: ["query"], rowLimit: 250 }),
  });
  const qData = await qRes.json();
  const rows = qData.rows || [];

  console.log("\n--- Top 10 Queries by Clicks ---");
  for (const r of rows.slice(0, 10)) {
    console.log(
      `  ${r.keys[0].padEnd(38)} | clicks: ${String(r.clicks).padStart(3)} | impr: ${String(r.impressions).padStart(5)} | ctr: ${(r.ctr * 100).toFixed(1)}% | pos: ${r.position.toFixed(1)}`
    );
  }

  const opps = [...rows]
    .filter((r) => r.impressions >= 25 && r.ctr < 0.03)
    .sort((a, b) => b.impressions - a.impressions);
  console.log("\n--- Top 10 High-Impression Low-CTR Opportunities ---");
  for (const r of opps.slice(0, 10)) {
    console.log(
      `  ${r.keys[0].padEnd(38)} | clicks: ${String(r.clicks).padStart(3)} | impr: ${String(r.impressions).padStart(5)} | ctr: ${(r.ctr * 100).toFixed(1)}% | pos: ${r.position.toFixed(1)}`
    );
  }
}

async function main() {
  const args = process.argv.slice(2);
  const sa = loadServiceAccount();
  const { token, serverDate } = await getAccessToken(sa, [
    "https://www.googleapis.com/auth/webmasters",
    "https://www.googleapis.com/auth/analytics.readonly",
  ]);

  const inspectIdx = args.indexOf("--inspect");
  if (inspectIdx !== -1 && args[inspectIdx + 1]) {
    await inspectUrl(token, args[inspectIdx + 1]);
    return;
  }

  if (args.includes("--submit-sitemaps")) {
    await submitSitemaps(token);
    return;
  }

  await runReport(token, serverDate);
  await submitSitemaps(token);
}

main().catch((err) => {
  console.error("CEO Pulse error:", err.message);
  process.exit(1);
});
