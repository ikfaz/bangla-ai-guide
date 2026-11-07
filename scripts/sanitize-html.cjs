#!/usr/bin/env node
// Strip NUL padding and junk after </html> on blog articles.
// claude-ai-bangladesh-guide is truncated mid-footer; close it with the
// same footer ending used by the sibling guide pages.

const fs = require('fs');
const { listBlogArticles, countLine } = require('./lib/site-policy.cjs');

const TAIL = `">বাংলা AI গাইড</a>
            </p>
        </div>
    </footer>
<script src="/js/mailchimp.js?v=2026-10-26-trust" defer></script>
</body>
</html>
`;

function sanitize(buf) {
  let bytes = buf;
  let changed = false;
  if (bytes.includes(0)) {
    bytes = Buffer.from(Array.prototype.filter.call(bytes, (b) => b !== 0));
    changed = true;
  }
  let html = bytes.toString('utf8');
  const nextHtml = html.replace(/<a\b([^>]*\btarget=["']_blank["'][^>]*)>/gi, (match, attrs) => {
    if (/\brel\s*=/i.test(attrs)) {
      if (/\bnoopener\b/i.test(attrs)) return match;
      return `<a${attrs.replace(/\brel=(["'])([^"']*)\1/i, (_m, q, val) => `rel=${q}${val.trim()} noopener noreferrer${q}`)}>`;
    }
    return `<a${attrs} rel="noopener noreferrer">`;
  });
  if (nextHtml !== html) {
    html = nextHtml;
    changed = true;
  }
  const closeAt = html.lastIndexOf('</html>');
  if (closeAt !== -1) {
    const end = closeAt + '</html>'.length;
    if (end < html.length) {
      html = html.slice(0, end);
      if (!html.endsWith('\n')) html += '\n';
      changed = true;
    }
    return { html, changed };
  }

  changed = true;
  if (/href="\/bangla-ai-guide\/\s*$/.test(html)) {
    html += TAIL;
  } else if (!/<\/body>/i.test(html)) {
    html = html.replace(/\s*$/, '\n</body>\n</html>\n');
  } else {
    html = html.replace(/\s*$/, '\n</html>\n');
  }
  return { html, changed };
}

function run() {
  let scanned = 0;
  let stripped = 0;
  for (const article of listBlogArticles()) {
    scanned += 1;
    const buf = fs.readFileSync(article.file);
    const { html, changed } = sanitize(buf);
    if (!changed) continue;
    if (html === buf.toString('utf8') && !buf.includes(0)) continue;
    fs.writeFileSync(article.file, html);
    stripped += 1;
  }
  console.log(`Sanitize HTML: scanned ${scanned}, stripped ${stripped}`);
  countLine('nulls_stripped', stripped);
}

run();
