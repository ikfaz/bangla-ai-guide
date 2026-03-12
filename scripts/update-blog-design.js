const fs = require('fs');
const path = require('path');

const blogDir = path.join(__dirname, '../blog');

const navbar = `    <!-- Navbar -->
    <header class="navbar">
        <div class="container navbar-inner">
            <a href="/" class="logo">
                <img class="logo-mark" src="/favicon.svg" alt="বাংলা AI গাইড লোগো" width="28" height="28" decoding="async" />
                <span class="logo-text">বাংলা AI গাইড</span>
            </a>
            <nav class="nav-links">
                <a href="/#toolsSection">টুলস দেখুন</a>
                <a href="/blog/">ব্লগ</a>
                <a href="/bangla-ai-guide/">বাংলা AI গাইড</a>
            </nav>
        </div>
    </header>

    <!-- Article Content -->`;

const footer = `
    <!-- Footer -->
    <footer class="footer">
        <div class="container footer-inner">
            <p class="footer-brand">
                <img class="logo-mark" src="/favicon.svg" alt="বাংলা AI গাইড লোগো" width="20" height="20" decoding="async" />
                <span>বাংলা AI গাইড</span>
            </p>
            <p>© ২০২৬ বাংলা AI গাইড · বাংলাদেশের জন্য তৈরি</p>
            <p class="footer-links">
                <a href="/privacy/">গোপনীয়তা</a> ·
                <a href="/terms/">শর্তাবলী</a> ·
                <a href="/contact/">যোগাযোগ</a> ·
                <a href="/bangla-ai-guide/">বাংলা AI গাইড</a>
            </p>
        </div>
    </footer>`;

function updateBlogArticle(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  // Skip if already has navbar
  if (content.includes('<!-- Navbar -->')) {
    console.log(`Skipped (already updated): ${filePath}`);
    return;
  }

  // Fix CSS path - change ../css/blog-premium.css to ../../css/blog-premium.css
  // and add main style.css
  if (content.includes('href="../css/blog-premium.css"')) {
    content = content.replace(
      'href="../css/blog-premium.css"',
      'href="../../css/style.css">\n    <link rel="stylesheet" href="../../css/blog-premium.css"'
    );
  } else if (!content.includes('blog-premium.css')) {
    // If no blog CSS at all, add it after google fonts
    content = content.replace(
      '</head>',
      '    <link rel="stylesheet" href="../../css/style.css">\n    <link rel="stylesheet" href="../../css/blog-premium.css">\n</head>'
    );
  }

  // Add navbar after <body>
  content = content.replace(
    '</head>\n<body>',
    '</head>\n<body>\n' + navbar
  );

  // Add footer before </body>
  content = content.replace(
    '</body>',
    footer + '\n</body>'
  );

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Updated: ${filePath}`);
}

function processDirectory(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      processDirectory(fullPath);
    } else if (entry.name === 'index.html' && fullPath !== path.join(blogDir, 'index.html')) {
      // Process blog article HTML files, but skip the main blog index
      updateBlogArticle(fullPath);
    }
  }
}

console.log('Starting blog design update...\n');
processDirectory(blogDir);
console.log('\nBlog design update complete!');
