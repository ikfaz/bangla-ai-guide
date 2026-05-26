/* Batch 4b — 3 latest-model articles (Gemini 3.5, Claude Sonnet 4.6, Opus 4.7) */

module.exports = [
  // 1 — Gemini 3.5
  {
    slug: 'gemini-3-5-bangla-guide',
    title: 'Gemini 3.5 বাংলা গাইড — Google-এর নতুন Flagship AI (২০২৬)',
    description: 'Google Gemini 3.5 — কী নতুন, ২.৫ Pro থেকে কতটা ভালো, কীভাবে বাংলায় ব্যবহার করবেন, দাম ও Workspace integration — বাংলাদেশি ব্যবহারকারীদের জন্য সম্পূর্ণ গাইড।',
    keywords: 'Gemini 3.5, Gemini 3.5 bangla, Google AI latest, Gemini Advanced 3.5, Gemini 3.5 vs ChatGPT, Gemini new model',
    sections: [
      {
        h2: 'ভূমিকা — Gemini 3.5 কেন গুরুত্বপূর্ণ?',
        paragraphs: [
          'Google-এর Gemini 3.5 — Gemini lineup-এর সর্বশেষ flagship। 2.5 Pro-এর উত্তরসূরি, AI race-এ ChatGPT GPT-5 এবং Claude Opus 4.7-এর সাথে সরাসরি প্রতিদ্বন্দ্বিতা করছে।',
          'এই গাইডে আমরা দেখব 3.5-এ কী নতুন, 2.5 Pro থেকে কতটা এগিয়েছে, বাংলাদেশি ব্যবহারকারীর জন্য কোথায় ব্যবহারযোগ্য, এবং কী খরচ।',
        ],
      },
      {
        h2: '২.৫ Pro থেকে কী নতুন?',
        list: [
          '<b>উন্নত reasoning:</b> thinking mode আরো sophisticated, multi-step problem-এ বেশি সঠিক',
          '<b>দীর্ঘতর context:</b> 2M token base, কিছু tier-এ 4M পর্যন্ত',
          '<b>Multimodal উন্নতি:</b> video + audio + image একসাথে comprehend',
          '<b>Tool use:</b> agentic capability — browser, code, API চালাতে পারে',
          '<b>Speed:</b> inference latency কম, কম resource',
          '<b>Voice:</b> emotion-aware, real-time conversation',
          '<b>Code:</b> SWE-bench score উন্নতি',
        ],
      },
      {
        h2: 'অ্যাক্সেস',
        list: [
          '<b>gemini.google.com</b> — basic free tier-এ Flash 3.5',
          '<b>Google AI Premium ($20/মাস):</b> Gemini 3.5 Pro full access',
          '<b>Workspace Business+:</b> built-in integration',
          '<b>AI Studio (ai.google.dev):</b> developer free tier',
          '<b>Vertex AI:</b> enterprise + API',
          '<b>BD থেকে:</b> Google account দিয়ে, VPN ছাড়া',
        ],
      },
      {
        h2: 'বাংলায় Gemini 3.5 — কেমন কাজ করে',
        list: [
          'Native-quality Bengali, 2.5 Pro-এর চেয়ে slightly natural',
          'লম্বা বাংলা document analysis — pristine accuracy',
          'বাংলা handwriting OCR উন্নত',
          'Code-switching (বাংলা ↔ English) — seamless',
          'Voice mode Bangla accent বুঝে — pronunciation feedback',
          'Bengali literary text (Rabindra, Nazrul) understands deeply',
        ],
      },
      {
        h2: 'নতুন ফিচার যা game-changing',
        subs: [
          {
            h3: 'Live Video Conversation',
            paragraphs: [
              'Camera চালু করে real-time conversation। "এই recipe বইটার এই পেজ পড়ো এবং বাংলায় বুঝিয়ে দাও" — ১ সেকেন্ডে।',
            ],
          },
          {
            h3: 'Project Mariner (agentic browsing)',
            paragraphs: [
              'Gemini নিজে browser চালিয়ে কাজ করতে পারে — flight book, form fill, research compile।',
            ],
          },
          {
            h3: 'Workspace Deep Integration',
            paragraphs: [
              'Docs/Sheets/Slides-এ "@Gemini" mention করলে inline সাহায্য। 2.5 Pro-এর চেয়ে faster + context-aware।',
            ],
          },
        ],
      },
      {
        h2: 'Gemini 3.5 vs প্রতিদ্বন্দ্বী',
        list: [
          '<b>vs ChatGPT GPT-5:</b> Tied; Gemini long-context-এ এগিয়ে, ChatGPT creative writing-এ',
          '<b>vs Claude Opus 4.7:</b> Opus reasoning-এ slight edge, Gemini multimodal-এ এগিয়ে',
          '<b>vs DeepSeek R3:</b> Gemini বেশি polished, DeepSeek ফ্রি',
          '<b>Best for Gemini:</b> Workspace power user, long document, multimodal',
        ],
      },
      {
        h2: 'বাংলাদেশি use cases (Top 7)',
        list: [
          'Government document analysis (long PDFs)',
          'Bangla research paper summarization',
          'Gmail-এ AI reply (Workspace user)',
          'Excel/Sheets data analysis',
          'Video meeting summarization',
          'Live image-based Q&A (camera shopping, market)',
          'Multi-language client communication',
        ],
      },
      {
        h2: 'দাম (BD context)',
        list: [
          '<b>Free tier:</b> Flash 3.5 — generous, daily limit',
          '<b>Premium ($20 ≈ ৳২,৪০০):</b> 3.5 Pro full',
          '<b>Ultra/Pro+ (where available):</b> $99 — heavy users',
          '<b>API:</b> $1.25-15 per 1M tokens (model-dependent)',
        ],
      },
      {
        h2: 'যখন Gemini 3.5 worth it',
        list: [
          'Workspace user (Google Docs/Sheets/Drive)',
          'নিয়মিত long PDF analysis (200+ pages)',
          'Multimodal কাজ (video + image)',
          'Researcher / academic',
          'Multi-language office',
        ],
      },
      {
        h2: 'উপসংহার',
        paragraphs: [
          'Gemini 3.5 — Google-এর AI lineup-এ "ChatGPT এর সমান বা ভালো" claim-কে প্রমাণ করল। বাংলাদেশি Workspace ব্যবহারকারীদের জন্য এটি no-brainer upgrade। ফ্রি tier-এ আজই Flash 3.5 test করুন, Premium নিলে workflow পাল্টে যাবে।',
        ],
      },
    ],
    related: [
      { href: '/gemini/', label: 'Gemini' },
      { href: '/blog/gemini-2-5-pro-bangla-guide/', label: 'Gemini 2.5 Pro গাইড' },
      { href: '/blog/gemini-vs-chatgpt-konti-bhalo-bangla-comparison-2026/', label: 'Gemini vs ChatGPT' },
      { href: '/blog/claude-sonnet-4-6-bangla-guide/', label: 'Claude Sonnet 4.6' },
    ],
  },

  // 2 — Claude Sonnet 4.6
  {
    slug: 'claude-sonnet-4-6-bangla-guide',
    title: 'Claude Sonnet 4.6 বাংলা গাইড — Anthropic-এর নতুন সেরা মডেল ২০২৬',
    description: 'Claude Sonnet 4.6 — কী নতুন, 4.5 থেকে কতটা ভালো, বাংলায় কেমন কাজ করে, দাম, কখন ব্যবহার? Anthropic-এর latest flagship-এর সম্পূর্ণ গাইড।',
    keywords: 'Claude Sonnet 4.6, Claude 4.6 bangla, Claude latest, Anthropic new model, Sonnet 4.6 vs GPT-5, Claude Bengali',
    sections: [
      {
        h2: 'ভূমিকা',
        paragraphs: [
          'Claude Sonnet 4.6 — Anthropic-এর Sonnet line-এর সর্বশেষ রিলিজ। 4.5-এর successor হিসেবে coding, agentic tasks, এবং long-form reasoning-এ significant improvement এনেছে।',
          'বাংলা ভাষায় Claude-এর dominance বরাবরের মতো — 4.6-এ আরো polished। বাংলাদেশি content creator, developer, researcher-দের জন্য সবচেয়ে relevant model।',
        ],
      },
      {
        h2: '4.5 থেকে কী নতুন',
        list: [
          '<b>Coding:</b> SWE-bench score আরো উন্নত, real-world task সলভ best-in-class',
          '<b>Agentic tasks:</b> long multi-step autonomous কাজে আরো reliable',
          '<b>Computer Use:</b> beta থেকে production-grade',
          '<b>Tool use:</b> parallel function calling, error recovery',
          '<b>Long context:</b> 200K consistency improved (no "lost in middle")',
          '<b>Refusal calibration:</b> over-cautious behavior কমেছে',
          '<b>Speed:</b> faster inference, lower latency',
        ],
      },
      {
        h2: 'অ্যাক্সেস',
        list: [
          '<b>claude.ai</b> — Free tier limited usage; Pro ($20/মাস) full',
          '<b>Claude Code CLI:</b> developer terminal-এ',
          '<b>Claude API:</b> $3 / 1M input tokens',
          '<b>Cursor, Replit, others-এ embedded</b>',
          '<b>Mobile:</b> Android + iOS apps',
          '<b>BD থেকে:</b> VPN ছাড়া; phone verification needed signup-এ',
        ],
      },
      {
        h2: 'বাংলায় Claude 4.6 — গুণমান',
        list: [
          'Native-grade Bengali — বাজারে সবচেয়ে natural output',
          'রবীন্দ্রনাথ, নজরুল style replicate করতে পারে',
          'বাংলা poetry generation — meter সংরক্ষণ',
          'Mixed Banglish handle perfectly',
          'Bengali idiom appropriate context-এ',
          'Long Bengali document analysis precision',
        ],
      },
      {
        h2: 'নতুন ক্ষমতা — practical examples',
        subs: [
          {
            h3: 'Computer Use (production-ready)',
            paragraphs: [
              'Claude নিজে মাউস + কীবোর্ড control করতে পারে। Form fill, data entry, multi-app workflow automate — desktop app-এ available।',
            ],
          },
          {
            h3: 'Artifacts v2',
            paragraphs: [
              'Code preview, React component, SVG diagram, document — sidebar-এ live render। React, HTML/CSS, Mermaid — সব support।',
            ],
          },
          {
            h3: 'Project Long Context',
            paragraphs: [
              'Pro-এ "Projects" — files persist, context maintain across conversations। 200K token-এ pristine recall।',
            ],
          },
        ],
      },
      {
        h2: 'Claude Sonnet 4.6 vs প্রতিদ্বন্দ্বী',
        list: [
          '<b>vs ChatGPT GPT-5:</b> Claude bangla এবং long-form-এ এগিয়ে; ChatGPT image gen, voice mode-এ',
          '<b>vs Gemini 3.5:</b> Claude reasoning এবং writing; Gemini multimodal এবং long-context',
          '<b>vs Claude Opus 4.7:</b> Sonnet দ্রুত + সস্তা; Opus deep reasoning + complex',
          '<b>সেরা workflow:</b> দৈনিক কাজে Sonnet, hardest problem-এ Opus',
        ],
      },
      {
        h2: 'দাম (BD context)',
        list: [
          '<b>Free tier:</b> Claude.ai-তে দৈনিক ~১০ message Sonnet 4.6',
          '<b>Pro ($20 ≈ ৳২,৪০০/মাস):</b> 5x usage, all features',
          '<b>Max ($100-200):</b> heavy usage tiers',
          '<b>API:</b> $3 in / $15 out per 1M tokens',
          '<b>BD পেমেন্ট:</b> International card / Wise / virtual card',
        ],
      },
      {
        h2: 'কখন Sonnet 4.6 বেছে নেবেন',
        list: [
          'Bangla long-form content (blog, article, story)',
          'Coding/development (best free model)',
          'Document analysis (PDF, contract, paper)',
          'Sensitive/nuanced reasoning (ethics, philosophy)',
          'Bangla-English translation (literary quality)',
          'Code Review',
          'Tutoring (deep explanation)',
        ],
      },
      {
        h2: 'যখন অন্যদিকে যাবেন',
        list: [
          'Image generation দরকার → ChatGPT (DALL-E)',
          'Sora-style video → ChatGPT Pro',
          'Voice mode-এ AVM → ChatGPT',
          'Google Workspace integration → Gemini',
          'একদম ফ্রি unlimited → DeepSeek',
        ],
      },
      {
        h2: 'উপসংহার',
        paragraphs: [
          'Claude Sonnet 4.6 — বাংলা content + serious কাজের জন্য most reliable AI। যিনি 4.5 ব্যবহার করছেন, upgrade automatic হয়ে গেছে (claude.ai-তে)। আজকের আপনার এক difficult কাজে Sonnet 4.6-এ try করে দেখুন — fluency-এ পার্থক্য টের পাবেন।',
        ],
      },
    ],
    related: [
      { href: '/claude/', label: 'Claude' },
      { href: '/blog/claude-sonnet-4-5-bangla-guide/', label: 'Claude Sonnet 4.5' },
      { href: '/blog/claude-opus-4-7-bangla-guide/', label: 'Claude Opus 4.7' },
      { href: '/blog/claude-vs-chatgpt-bangladeshe-konti-bhalo/', label: 'Claude vs ChatGPT' },
    ],
  },

  // 3 — Claude Opus 4.7
  {
    slug: 'claude-opus-4-7-bangla-guide',
    title: 'Claude Opus 4.7 বাংলা গাইড — Anthropic-এর সবচেয়ে শক্তিশালী AI (২০২৬)',
    description: 'Claude Opus 4.7 — Anthropic-এর top-tier model। কী পারে, কতটা শক্তিশালী, বাংলায় ব্যবহার, দাম, কখন worth it — researcher, developer ও power user-দের জন্য সম্পূর্ণ গাইড।',
    keywords: 'Claude Opus 4.7, Opus 4.7 bangla, Anthropic top model, Claude flagship, Opus vs GPT-5, Opus vs Gemini',
    sections: [
      {
        h2: 'ভূমিকা — Opus কী?',
        paragraphs: [
          'Claude Opus 4.7 — Anthropic-এর সবচেয়ে শক্তিশালী এবং expensive মডেল। Sonnet daily driver হলে, Opus হলো heavy lifting-এর জন্য — সবচেয়ে কঠিন problems, longest reasoning, most nuanced output।',
          'Power user, researcher, enterprise — এদের জন্য designed। বাংলাদেশি serious user-দের জানা উচিত কখন এটি দরকার, কখন overkill।',
        ],
      },
      {
        h2: 'Opus 4.7 কী আলাদা করে',
        list: [
          '<b>Reasoning depth:</b> দীর্ঘ multi-step problem solve — Sonnet যা miss করে, Opus catch করে',
          '<b>Hardest benchmarks:</b> GPQA, MATH, agentic tasks-এ state-of-the-art',
          '<b>Nuance:</b> ethics, philosophy, legal reasoning-এ subtle',
          '<b>Long agentic tasks:</b> ৪+ ঘণ্টার autonomous task',
          '<b>Code quality:</b> complex architecture, large refactor',
          '<b>Writing:</b> publication-grade essays, novels',
          '<b>Cost:</b> উল্লেখযোগ্য বেশি ($15 in / $75 out per 1M)',
        ],
      },
      {
        h2: 'অ্যাক্সেস',
        list: [
          '<b>claude.ai Pro ($20):</b> Limited Opus 4.7 (daily messages)',
          '<b>claude.ai Max ($100-200):</b> Heavy Opus access',
          '<b>API:</b> Pay-per-token, expensive but most flexible',
          '<b>Claude Code CLI:</b> developers-এর জন্য available',
          '<b>Enterprise:</b> Custom contract',
        ],
      },
      {
        h2: 'কখন Opus 4.7 ব্যবহার করবেন',
        list: [
          '<b>কঠিন research:</b> medical, legal, scientific paper analysis',
          '<b>Long agentic task:</b> "এই 50-page report থেকে structure বের করো, summarize, recommendation দাও"',
          '<b>Complex code:</b> system design, large codebase refactor',
          '<b>Publication writing:</b> academic paper, book chapter',
          '<b>Strategic planning:</b> business case, investment thesis',
          '<b>Multi-step reasoning:</b> 10+ logical step problem',
        ],
      },
      {
        h2: 'কখন Opus overkill — Sonnet যথেষ্ট',
        list: [
          'দৈনিক blog/article writing',
          'Simple translation',
          'Code snippet generation',
          'Quick chat / brainstorming',
          'Email draft',
          'Email summary',
          '<b>Rule of thumb:</b> "Sonnet দিয়ে চেষ্টা — যদি miss করে, তখন Opus"',
        ],
      },
      {
        h2: 'বাংলায় Opus 4.7',
        list: [
          'Native-grade — Sonnet 4.6-এর সাথে hardly distinguishable casual use-এ',
          'দীর্ঘ Bengali essay / academic writing — Opus subtle nuance ধরে',
          'Bengali literature/poetry analysis — deeper than Sonnet',
          'Bengali legal/medical Q — more authoritative',
          'Mixed Banglish technical writing — polish বেশি',
        ],
      },
      {
        h2: 'দাম + ROI বিশ্লেষণ (BD context)',
        list: [
          '<b>API cost:</b> 1-hour heavy use = $5-20',
          '<b>Pro plan ($20):</b> ~দৈনিক ১০-২০ Opus message',
          '<b>Max ($100):</b> heavy usage but ৳১২,০০০/মাস BD-এ',
          '<b>Use case viable BD:</b> consulting/agency client work যেখানে hour-rate $50+',
          '<b>Hobbyist:</b> Sonnet enough — Opus luxury',
        ],
      },
      {
        h2: 'Opus 4.7 vs প্রতিদ্বন্দ্বী top-tier',
        list: [
          '<b>vs ChatGPT GPT-5 Pro:</b> Opus reasoning-এ এগিয়ে, GPT-5 multimodal-এ',
          '<b>vs Gemini 3.5 Ultra:</b> Opus depth, Gemini context length',
          '<b>vs o3 (OpenAI reasoning):</b> Tied; Opus more polished',
          '<b>Combined:</b> Power user হলে দুটো subscription — different tasks',
        ],
      },
      {
        h2: '5টি real-world examples',
        list: [
          '<b>Lawyer:</b> "এই 100-page contract analyze, risky clauses ranking, suggested redline"',
          '<b>Researcher:</b> "5 papers compare methodologies, gaps identify, future research directions"',
          '<b>Developer:</b> "এই codebase architecture document করো, refactor plan with phases"',
          '<b>Writer:</b> "এই 200-page manuscript edit — structure, pacing, theme consistency"',
          '<b>Consultant:</b> "Industry analysis bd RMG sector — 5 year outlook, recommendations"',
        ],
      },
      {
        h2: 'টিপস — Opus থেকে সর্বোচ্চ পেতে',
        list: [
          'Long detailed prompt — instructions clear রাখুন',
          'Reference documents upload (Pro/Max)',
          'Multi-turn conversation — clarify, iterate',
          'Use "Extended Thinking" mode complex problem-এ',
          'Output format specify (markdown, JSON, etc.)',
        ],
      },
      {
        h2: 'উপসংহার',
        paragraphs: [
          'Opus 4.7 — luxury tool। বেশিরভাগ user-এর দরকার নেই। কিন্তু যিনি serious knowledge work করেন (consulting, research, complex dev) — Opus 4.7 ROI দেয়। Max plan ($100) consideration: ১ মাসে ৫টি difficult client task save করলে value 5x। ছোট ছোট experiment করে নিজের need verify করুন।',
        ],
      },
    ],
    related: [
      { href: '/claude/', label: 'Claude' },
      { href: '/blog/claude-sonnet-4-6-bangla-guide/', label: 'Claude Sonnet 4.6' },
      { href: '/blog/claude-sonnet-4-5-bangla-guide/', label: 'Claude Sonnet 4.5' },
      { href: '/blog/claude-vs-chatgpt-bangladeshe-konti-bhalo/', label: 'Claude vs ChatGPT' },
    ],
  },
];
