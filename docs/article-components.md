# Article components

Use these snippets in new blog posts. Link the stylesheet once in `<head>`:

```html
<link rel="stylesheet" href="/css/article-visuals.css">
```

Keep question headings as `<h3>` elements that end with `?`, followed by the answer paragraphs. The build's FAQ schema step reads those headings. A `<details>` wrapper is fine when the heading stays inside it.

The shared magazine chrome (cover, chips, table of contents, reading time) is added by `scripts/inject-article-chrome.cjs` for every post under `blog/`. Posts that are not wrapped in `<article>` get the class `article-sheet` on the content container. Do not hand-copy that block.

## Hero

Do **not** manually add `<figure class="av-hero">` or inline `cover.png` inside the article body.
- `scripts/inject-article-chrome.cjs` and `scripts/apply-guide-workshops.cjs` automatically inject `<figure class="article-hero">` in the top `.gw-hero-visual` slot using the clean vector editorial illustration `/assets/editorial/<topic>.svg` mapped by `scripts/lib/editorial-art.cjs`.
- `scripts/generate-blog-covers.cjs` automatically generates the `1200×630` `cover.svg` and `cover.png` from that same `/assets/editorial/<topic>.svg` illustration for OpenGraph, Twitter Cards, Google News, and `Article` / `NewsArticle` JSON-LD schema.
- **Always match the article's real subject (never use unrelated or made-up art):** If a new article combines specific concepts (for example, `code-pricing` combining `['code', 'card', 'coin', 'blue']` for a coding tool's pricing & BDT cost guide), add a tailored scene `[hero, back, detail, palette]` in `scripts/generate-editorial-art.cjs`, register its topic and Bangla `alt` description at the end of `subjects` (and in `overrides`) inside `scripts/lib/editorial-art.cjs`, and run `node scripts/generate-editorial-art.cjs` before `node scripts/build.cjs`.

## Quick answer

```html
<aside class="av-tldr">
  <p class="av-tldr-label">সংক্ষেপে</p>
  <p>এক অনুচ্ছেদে মূল উত্তর।</p>
</aside>
```

## Key facts

```html
<dl class="av-facts">
  <div class="av-fact">
    <dt>বিষয়</dt>
    <dd>সংক্ষিপ্ত তথ্য</dd>
  </div>
  <div class="av-fact">
    <dt>খরচ</dt>
    <dd>যাচাই করা দাম</dd>
  </div>
</dl>
```

## Numbered steps

```html
<ol class="av-steps">
  <li>প্রথম ধাপের বাক্য।</li>
  <li>দ্বিতীয় ধাপের বাক্য।</li>
</ol>
```

The number is drawn by CSS. Do not type the number again inside the item.

## Callouts

```html
<aside class="av-callout av-callout--tip">
  <p class="av-callout-label">টিপ</p>
  <p>কাজে লাগে এমন একটি পরামর্শ।</p>
</aside>

<aside class="av-callout av-callout--note">
  <p class="av-callout-label">নোট</p>
  <p>উৎস বা সীমাবদ্ধতা।</p>
</aside>

<aside class="av-callout av-callout--warning">
  <p class="av-callout-label">সতর্কতা</p>
  <p>ঝুঁকি বা যা এড়িয়ে চলতে হবে।</p>
</aside>
```

## Table

```html
<div class="av-table-scroll">
  <table class="av-table">
    <caption>টেবিলের শিরোনাম</caption>
    <thead>
      <tr><th>কলাম</th><th>তথ্য</th></tr>
    </thead>
    <tbody>
      <tr><td>নাম</td><td>বিবরণ</td></tr>
    </tbody>
  </table>
</div>
```

## Pull quote

```html
<blockquote class="av-pullquote">
  <p>লেখা থেকে এক লাইন, নতুন দাবি যোগ না করে।</p>
</blockquote>
```

## FAQ

```html
<section>
  <h2>সচরাচর জিজ্ঞাসা</h2>
  <details class="av-faq">
    <summary><h3>প্রশ্নটি কি এখানে লেখা?</h3></summary>
    <p>উত্তরের অনুচ্ছেদ।</p>
  </details>
</section>
```

## Flow diagram

Inline SVG keeps the labels in Bangla and adds no extra request. Use `Hind Siliguri`, which the article already loads.

```html
<figure class="av-flow">
  <svg viewBox="0 0 720 150" role="img" aria-label="ধাপ এক, তারপর ধাপ দুই">
    <rect x="16" y="36" width="200" height="72" rx="16" fill="#f0fdf4" stroke="#16a34a"/>
    <text x="116" y="78" text-anchor="middle" font-family="Hind Siliguri, sans-serif" font-size="20" fill="#14532d">ধাপ এক</text>
    <text x="250" y="80" font-size="28" fill="#16a34a">→</text>
    <rect x="290" y="36" width="200" height="72" rx="16" fill="#f0fdf4" stroke="#16a34a"/>
    <text x="390" y="78" text-anchor="middle" font-family="Hind Siliguri, sans-serif" font-size="20" fill="#14532d">ধাপ দুই</text>
  </svg>
  <figcaption>দুই ধাপের সংক্ষিপ্ত ধারা</figcaption>
</figure>
```

## Before / After comparison & prompt examples (`.av-compare`)

When an article teaches image/photo editing, prompt engineering, or configuration changes, include an inline `.av-compare` Before/After visual block (using real before/after WebP/SVG visuals or side-by-side prompt/setup comparison cards) inside the relevant section to make the transformation immediately clear:

```html
<figure class="av-compare">
  <div class="av-compare-item av-compare-item--before">
    <span class="av-compare-badge">আগে (ভুল প্রম্পট / সেটআপ)</span>
    <p>অস্পষ্ট প্রম্পট বা ভুল সেটিংসের ফলাফল।</p>
  </div>
  <div class="av-compare-item av-compare-item--after">
    <span class="av-compare-badge">পরে (সঠিক প্রম্পট / সেটআপ)</span>
    <p>স্পষ্ট প্রম্পট বা অপ্টিমাইজড সেটিংসের ফলাফল।</p>
  </div>
  <figcaption>আগে বনাম পরে: প্রম্পট ও সেটআপের পার্থক্য</figcaption>
</figure>
```

