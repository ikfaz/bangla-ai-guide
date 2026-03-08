# BanglaAIGuide (বাংলা AI গাইড)

বাংলাদেশের জন্য, বাংলায় AI টুলস।

## Project Structure

```text
/banglaaiguide
  ├── apple-touch-icon.png
  ├── 404.html
  ├── ai-tools-bangladesh-bengali.html
  ├── ai-tools-bdt-price-2026-bangladesh.html
  ├── ai-tools-bdt-price-2026-bangladesh.html
  ├── bangladeshe-ai-tools-kibhabe-bebohar-korben.html
  ├── bkash-diye-ai-tools-kena-jay.html
  ├── chatgpt-bangladesh-theke-bebohar.html
  ├── cursor-ai-bangla.html
  ├── elevenlabs-bangla-voice.html
  ├── favicon.svg
  ├── index.html
  ├── contact.html
  ├── terms.html
  ├── disclaimer.html
  ├── midjourney-bangladesh-free.html
  ├── privacy.html
  ├── submit.html
  ├── tool-detail.html
  ├── vpn-chara-ai-tools-bangladesh.html
  ├── robots.txt
  ├── sitemap.xml
  ├── css/
  │   └── style.css
  ├── js/
  │   ├── 404.js
  │   ├── contact.js
  │   ├── main.js
  │   ├── privacy.js
  │   ├── seo-pages.js
  │   ├── submit.js
  │   ├── tool-detail.js
  │   └── tools-data.js
  ├── scripts/
  │   └── generate-seo-pages.cjs
  └── README.md
```

## Data Source

- `js/tools-data.js` is copied from the uploaded file and used as the exact source of truth.
- No tool records are hardcoded inside `main.js`.

## Run Locally

1. Open `banglaaiguide/index.html` in any modern browser.
2. No build step required.

## Implemented Features

- Sticky navbar with mobile hamburger menu.
- SEO head tags (title/meta/canonical/Open Graph/Twitter).
- JSON-LD structured data (`WebSite` + `ItemList` for first 10 tools).
- Hero section with live search.
- Static tool pages via `/<slug>/` plus legacy `tool-detail.html?tool=` and `/tools/<slug>.html` redirect compatibility.
- Submit page with Bengali validation and success message.
- Friendly Bengali 404 page with random tool suggestions.
- Bengali legal pages: privacy, terms, disclaimer, and contact.
- Contact page with static form UI and Bengali validation feedback.
- Dismissible affiliate disclaimer banner on homepage.
- Phase-1 SEO cluster pages for low-competition Bangladesh keywords.
- Dynamic stats bar from dataset.
- Category tabs with live count badges.
- Combined filtering:
  - Search (`name` + `description_bn`)
  - Category
  - Payment
  - Bangladesh/VPN
  - Price buckets in BDT
- Featured tool banner from first filtered item.
- Tool cards with Bengali review quote and affiliate CTA.
- BDT conversion from `usdPrice` using `USD_TO_BDT` (`110` fallback).
- Responsive layout:
  - Desktop: sidebar + 3-column grid
  - Tablet: 2-column grid
  - Mobile: sidebar hidden, horizontal filter chips
- Footer text: `© ২০২৬ বাংলা AI গাইড · বাংলাদেশের জন্য তৈরি`
- `robots.txt` and `sitemap.xml` included.

## Price Conversion Rules

- `Free / $20/mo` → `ফ্রি / ৳২,২০০/মাস`
- `$49/mo` → `৳৫,৩৯০/মাস`
- `সম্পূর্ণ ফ্রি` → `৳০ — ফ্রি`
- `Usage-based` → `চাহিদাভিত্তিক`
- `Free / API paid` → `ফ্রি / API পেইড`

## Current Dataset Notes

- Current dataset includes 34 tools.
- No `payment: "bkash"` entries currently exist.
- All entries currently have `works_in_bd: true` and `no_vpn: true`.

## Tech Stack

- HTML5
- Pure CSS (no framework)
- Vanilla JavaScript (no jQuery)

## Tool URL Pattern

- `/chatgpt/`
- Legacy compatibility: `tool-detail.html?tool=chatgpt` and `/tools/chatgpt.html` redirect to the static canonical page.
