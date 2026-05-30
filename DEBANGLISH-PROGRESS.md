# De-Banglish Progress

Goal: convert casual English code-switching ("Banglish") in Bengali blog prose into
natural Bengali, keeping legitimate English terms (brands, SEO/IELTS/BCS, prices, code).

## ⚠️ CRITICAL ARCHITECTURE FINDING (read before editing)

The stated workflow ("edit data file → `generate-bulk-articles.cjs` → durable") is **UNSAFE
in this repo's current state.** Divergence check (2026-05-30) across all 12
`scripts/data/bulk-articles-data*.cjs` files:

- **~39 posts in-sync** with their data file
- **~113 posts DIVERGED** — the live `blog/<slug>/index.html` was hand-edited
  (deep-rewritten) AFTER generation; the data files hold STALE prose.

**Therefore: `node scripts/generate-bulk-articles.cjs <datafile>` would REVERT ~113
deep-rewrites.** Do NOT run it. The live HTML is the source of truth.

**Safe method for every post (data-backed or not):**
1. Edit `blog/<slug>/index.html` directly, element-by-element (Edit tool, exact-match
   on `<p>`/`<li>`/`<h2>`/`<h3>` text only). Never touch `<head>`, `<script>`/JSON-LD,
   tags, or attributes. No broad `[\s\S]*?` regex.
2. Verify per file: `</head>`, `<body`, `</body>`, `</html>` present; `<script>` count
   unchanged vs `git HEAD`; every `application/ld+json` block `JSON.parse()`s cleanly.
3. Safe to run afterward (inject-only, non-destructive): `inject-faq-schema.cjs`.
   NEVER run `generate-bulk-articles.cjs`.

Latent landmine for the owner: if anyone re-runs the bulk generator, ~113 deep-rewrites
vanish. Recommend treating HTML as source of truth (or back-porting bodies into data
files) long-term.

## Priority
GSC impressions data is plan-gated (unavailable). Using: (1) high-commercial-intent
(income/freelancing/job/IELTS/BCS/resume), (2) the rest alphabetically.

## Done (skip)
- blog/claude-ai-bangladesh-guide
- blog/claude-vs-chatgpt-bangladeshe-konti-bhalo

## Batch 1 — high-commercial-intent ✅ DONE (2026-05-30, commit pending)
All 12 verified: head region byte-identical to HEAD, <script> count unchanged,
all ld+json parse, 657/657 balanced prose-only diff, 0 head/script lines touched.
- [x] ai-diye-freelancing-kivabe-ay-korben-sompurno-bangla-guide (24 edits)
- [x] ai-diye-taka-income-2026-bangladesh (28 edits)
- [x] ai-tools-for-freelancers-income-bangladesh (18 edits)
- [x] ai-diye-affiliate-marketing-income-bangla (21 edits; fixed stray Cyrillic «без»→ছাড়া)
- [x] ai-diye-bcs-preparation-sompurno-bangla-guide (24 edits)
- [x] ai-diye-ielts-preparation-bangla-guide (22 edits)
- [x] ai-resume-cv-maker-bangladesh (17 edits)
- [x] ai-diye-bdjobs-application-optimize-bangla (19 edits)
- [x] ai-diye-chakrir-cover-letter-bangla (15 edits)
- [x] ai-diye-mock-interview-job-prostuti-bangla (21 edits)
- [x] best-ai-tools-for-students-bangladesh (19 edits)
- [x] ai-diye-digital-marketer-freelance-bangla (16 edits; fixed stray Indonesian «yang»)

NOTE: FAQ answer-dumps in FAQPage JSON-LD are NOT auto-refreshed on push
(extend-faq-coverage skips posts that already have a FAQPage block). Visible prose
is clean; the hidden FAQ schema answers may still hold some Banglish. Optional
follow-up: a scoped `extend-faq-coverage --rewrite` on just the de-Banglished slugs.

## Remaining high-intent (batch 2 candidates)
- ai-chakri-jhuki-bangladesh-nirapotta, ai-diye-contract-review-freelancer-bangla,
  ai-diye-dropshipping-business-bangladesh, ai-diye-freelance-writer-bd-us-clients-bangla,
  ai-diye-it-student-career-bangladesh, ai-diye-ui-ux-design-freelance-bangla,
  ai-diye-video-editing-freelance-service-bangla, freelancer-ai-automation,
  notebooklm-diye-porashona-students-bangla-guide
- (~218 more posts after high-intent cluster, alphabetical)
