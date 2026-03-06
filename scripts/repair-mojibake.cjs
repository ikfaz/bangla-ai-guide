const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const markerRegex = /[\u00e0\u00c2\u00e2\u00c3]/;

const cp1252ByteMap = new Map([
  [0x20AC, 0x80],
  [0x201A, 0x82],
  [0x0192, 0x83],
  [0x201E, 0x84],
  [0x2026, 0x85],
  [0x2020, 0x86],
  [0x2021, 0x87],
  [0x02C6, 0x88],
  [0x2030, 0x89],
  [0x0160, 0x8A],
  [0x2039, 0x8B],
  [0x0152, 0x8C],
  [0x017D, 0x8E],
  [0x2018, 0x91],
  [0x2019, 0x92],
  [0x201C, 0x93],
  [0x201D, 0x94],
  [0x2022, 0x95],
  [0x2013, 0x96],
  [0x2014, 0x97],
  [0x02DC, 0x98],
  [0x2122, 0x99],
  [0x0161, 0x9A],
  [0x203A, 0x9B],
  [0x0153, 0x9C],
  [0x017E, 0x9E],
  [0x0178, 0x9F],
]);

function toCp1252Bytes(value) {
  const bytes = [];
  for (const ch of value) {
    const cp = ch.codePointAt(0);
    if (cp <= 0xFF) {
      bytes.push(cp);
      continue;
    }
    if (cp1252ByteMap.has(cp)) {
      bytes.push(cp1252ByteMap.get(cp));
      continue;
    }
    // Keep unmappable chars as '?' so quality gate can reject bad decodes.
    bytes.push(0x3F);
  }
  return Buffer.from(bytes);
}

function decodeMojibake(value) {
  return toCp1252Bytes(value).toString("utf8");
}

function countBengali(value) {
  let count = 0;
  for (const ch of value) {
    const cp = ch.codePointAt(0);
    if (cp >= 0x0980 && cp <= 0x09FF) {
      count += 1;
    }
  }
  return count;
}

function countMarkers(value) {
  let count = 0;
  for (const ch of value) {
    if (
      ch === "\u00e0" ||
      ch === "\u00c2" ||
      ch === "\u00e2" ||
      ch === "\u00c3"
    ) {
      count += 1;
    }
  }
  return count;
}

function shouldReplace(original, decoded) {
  if (decoded === original) {
    return false;
  }
  if (decoded.includes("\uFFFD")) {
    return false;
  }

  const originalBn = countBengali(original);
  const decodedBn = countBengali(decoded);
  const originalMarkers = countMarkers(original);
  const decodedMarkers = countMarkers(decoded);

  // Primary signal: decoded Bengali coverage improves.
  if (decodedBn > originalBn && decodedMarkers <= originalMarkers) {
    return true;
  }

  // Secondary signal: mojibake markers drop significantly and no control chars.
  if (
    decodedMarkers < originalMarkers &&
    !/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/.test(decoded)
  ) {
    return true;
  }

  return false;
}

function maybeFixSegment(value) {
  if (!markerRegex.test(value)) {
    return value;
  }
  const decoded = decodeMojibake(value);
  return shouldReplace(value, decoded) ? decoded : value;
}

function repairContent(content) {
  let updated = content;

  // Quoted attribute/string values
  updated = updated.replace(
    /"([^"\n]*[\u00e0\u00c2\u00e2\u00c3][^"\n]*)"/g,
    (full, inner) => {
      const fixed = maybeFixSegment(inner);
      return fixed === inner ? full : `"${fixed}"`;
    }
  );

  updated = updated.replace(
    /'([^'\n]*[\u00e0\u00c2\u00e2\u00c3][^'\n]*)'/g,
    (full, inner) => {
      const fixed = maybeFixSegment(inner);
      return fixed === inner ? full : `'${fixed}'`;
    }
  );

  // Text nodes in HTML
  updated = updated.replace(
    />([^<]*[\u00e0\u00c2\u00e2\u00c3][^<]*)</g,
    (full, inner) => {
      const fixed = maybeFixSegment(inner);
      return fixed === inner ? full : `>${fixed}<`;
    }
  );

  return updated;
}

function walkHtmlFiles(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === ".git" || entry.name === "node_modules") {
        continue;
      }
      walkHtmlFiles(fullPath, files);
      continue;
    }
    if (entry.name.toLowerCase().endsWith(".html")) {
      files.push(fullPath);
    }
  }
  return files;
}

function normalizeToolDetail(filePath) {
  let text = fs.readFileSync(filePath, "utf8");

  text = text.replace(
    /<title>[\s\S]*?<\/title>/,
    "<title>টুল ডিটেইলস | বাংলা AI গাইড</title>"
  );
  text = text.replace(
    /<meta name="description" content="[\s\S]*?" \/>/,
    '<meta name="description" content="বাংলা AI গাইডে টুল ডিটেইলস, রিভিউ, প্রাইস ও বাংলাদেশে ব্যবহার গাইড দেখুন।" />'
  );

  text = text
    .replace(/aria-label="[^"]*হোম"/, 'aria-label="বাংলা AI গাইড হোম"')
    .replace(/aria-label="[^"]*টগল[^"]*"/, 'aria-label="মেনু টগল করুন"')
    .replace(/aria-label="[^"]*ন্যাভিগেশন"/, 'aria-label="প্রধান ন্যাভিগেশন"')
    .replace(/<a href="index\.html#toolsSection">[^<]*<\/a>/g, '<a href="index.html#toolsSection">টুলস দেখুন</a>')
    .replace(/<a href="index\.html#categoryTabs">[^<]*<\/a>/g, '<a href="index.html#categoryTabs">ক্যাটাগরি</a>')
    .replace(/<a href="index\.html#newsletter">[^<]*<\/a>/g, '<a href="index.html#newsletter">নিউজলেটার</a>')
    .replace(/<a href="submit\.html" class="btn btn-primary">[^<]*<\/a>/, '<a href="submit.html" class="btn btn-primary">টুল সাবমিট করুন</a>')
    .replace(/<a href="submit\.html" class="btn btn-primary mobile-cta">[^<]*<\/a>/, '<a href="submit.html" class="btn btn-primary mobile-cta">টুল সাবমিট করুন</a>')
    .replace(/<h2>[^<]*<\/h2>\s*<div class="related-grid" id="relatedGrid"><\/div>/, '<h2>সম্পর্কিত টুলস</h2>\n      <div class="related-grid" id="relatedGrid"></div>')
    .replace(/<p class="resource-intro">[^<]*<\/p>/, '<p class="resource-intro">ক্যাটাগরি অনুযায়ী প্রাসঙ্গিক গাইড লিংক নিচে দেখুন।</p>')
    .replace(/<a class="resource-card" href="vpn-chara-ai-tools-bangladesh\.html">[^<]*<\/a>/, '<a class="resource-card" href="vpn-chara-ai-tools-bangladesh.html">VPN ছাড়া AI tools Bangladesh</a>')
    .replace(/<a class="resource-card" href="bkash-diye-ai-tools-kena-jay\.html">[^<]*<\/a>/, '<a class="resource-card" href="bkash-diye-ai-tools-kena-jay.html">bKash দিয়ে AI tools কেনা যায়</a>')
    .replace(/<p>[^<]*©[^<]*<\/p>/, "<p>© ২০২৬ বাংলা AI গাইড · বাংলাদেশের জন্য তৈরি</p>")
    .replace(/aria-label="[^"]*ফুটার[^"]*"/, 'aria-label="ফুটার লিংক"')
    .replace(/<a href="submit\.html">[^<]*<\/a>/, '<a href="submit.html">টুল সাবমিট</a>')
    .replace(/<a href="index\.html#newsletter">[^<]*<\/a>/, '<a href="index.html#newsletter">বিজ্ঞাপন</a>')
    .replace(/<a href="privacy\.html">[^<]*<\/a>/, '<a href="privacy.html">প্রাইভেসি</a>');

  const footerLinks = text.match(/<nav class="footer-links"[\s\S]*?<\/nav>/);
  if (footerLinks && !footerLinks[0].includes("যোগাযোগ")) {
    text = text.replace(
      /<nav class="footer-links"[\s\S]*?<\/nav>/,
      `<nav class="footer-links" aria-label="ফুটার লিংক">
        <a href="submit.html">টুল সাবমিট</a>
        <a href="index.html#newsletter">বিজ্ঞাপন</a>
        <a href="privacy.html">প্রাইভেসি</a>
        <a href="index.html#newsletter">যোগাযোগ</a>
      </nav>`
    );
  }

  fs.writeFileSync(filePath, text, "utf8");
}

function main() {
  const htmlFiles = walkHtmlFiles(root);
  const targets = [
    ...htmlFiles,
    path.join(root, "scripts", "generate-seo-pages.cjs"),
  ];

  let changed = 0;
  for (const filePath of targets) {
    const original = fs.readFileSync(filePath, "utf8");
    const repaired = repairContent(original);
    if (repaired !== original) {
      fs.writeFileSync(filePath, repaired, "utf8");
      changed += 1;
    }
  }

  const toolDetail = path.join(root, "tool-detail.html");
  if (fs.existsSync(toolDetail)) {
    normalizeToolDetail(toolDetail);
  }

  console.log(`Repaired files: ${changed}`);
}

main();
