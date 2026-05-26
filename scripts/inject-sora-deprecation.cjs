#!/usr/bin/env node
/*
 * One-time patch — inject a deprecation notice into Sora-related articles.
 *
 * As of 2026 mid-year, Sora was discontinued. These articles remain for
 * historical/search reference but need a clear "discontinued" banner so
 * readers aren't misled. Notice points to current video AI alternatives.
 *
 * Idempotent — uses sentinels.
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const BLOG = path.join(ROOT, 'blog');

const TARGETS = [
  'sora-ai-video-bangladesh',
  'veo-3-sora-2-bangla-guide-best-ai-video-models',
];

const NOTICE = `<!-- DEPRECATION-NOTICE:START -->
<aside class="deprecation-notice" style="max-width:820px;margin:24px auto 0;padding:18px 22px;background:linear-gradient(135deg,#FFFBEB 0%,#FEF3C7 100%);border:1.5px solid #F59E0B;border-radius:14px;font-family:'Hind Siliguri',sans-serif;color:#92400E;">
  <div style="display:flex;gap:12px;align-items:flex-start;">
    <span style="font-size:22px;flex-shrink:0;">⚠️</span>
    <div>
      <strong style="display:block;margin-bottom:6px;color:#78350F;font-size:15px;">আপডেট: Sora বন্ধ করা হয়েছে</strong>
      <span style="font-size:14px;line-height:1.65;color:#92400E;">
        OpenAI ২০২৬ সালের মাঝামাঝি Sora পরিষেবা বন্ধ করেছে। এই আর্টিকেলটি ঐতিহাসিক রেফারেন্স হিসেবে রাখা হয়েছে।
        বর্তমানে সেরা AI video tools:
        <a href="/blog/veo-3-advanced-techniques-bangla/" style="color:#92400E;font-weight:600;text-decoration:underline;">Google Veo 3</a>,
        <a href="/blog/kling-ai-2-bangla-deep-guide/" style="color:#92400E;font-weight:600;text-decoration:underline;">Kling AI 2.0</a>,
        <a href="/blog/runway-gen-4-bangla-guide/" style="color:#92400E;font-weight:600;text-decoration:underline;">Runway Gen-4</a>।
        <a href="/blog/ai-video-models-comparison-2026-post-sora/" style="color:#92400E;font-weight:600;text-decoration:underline;">পুরো comparison দেখুন →</a>
      </span>
    </div>
  </div>
</aside>
<!-- DEPRECATION-NOTICE:END -->`;

function patch(slug) {
  const file = path.join(BLOG, slug, 'index.html');
  if (!fs.existsSync(file)) {
    console.log(`Skip: ${slug} (not found)`);
    return false;
  }
  let html = fs.readFileSync(file, 'utf8');
  if (/<!-- DEPRECATION-NOTICE:START -->/.test(html)) {
    html = html.replace(/<!-- DEPRECATION-NOTICE:START -->[\s\S]*?<!-- DEPRECATION-NOTICE:END -->/, NOTICE);
  } else if (/<h1[\s>][\s\S]*?<\/h1>/i.test(html)) {
    html = html.replace(/(<h1[\s>][\s\S]*?<\/h1>)/i, `$1\n${NOTICE}`);
  } else {
    console.log(`Skip: ${slug} (no h1)`);
    return false;
  }
  fs.writeFileSync(file, html, 'utf8');
  console.log(`Patched: ${slug}`);
  return true;
}

let patched = 0;
for (const slug of TARGETS) {
  if (patch(slug)) patched++;
}
console.log(`\nDone. ${patched}/${TARGETS.length} articles patched.`);
