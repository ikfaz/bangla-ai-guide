/*
 * Batch 2 — 10 content-gap articles (2026-05-26).
 * Schema identical to bulk-articles-data.cjs; consumed by generate-bulk-articles.cjs.
 */

module.exports = [
  // 1 — Bangla translation comparison
  {
    slug: 'ai-diye-bangla-translation-konti-bhalo-comparison',
    title: 'AI দিয়ে বাংলা Translation — Google, ChatGPT, DeepL কোনটি ভালো? (২০২৬)',
    description: 'বাংলা থেকে ইংরেজি বা ইংরেজি থেকে বাংলা translation-এর জন্য সেরা AI টুল কোনটি? Google Translate, ChatGPT, Claude, DeepL — সব টুলের accuracy টেস্ট, দাম ও use case।',
    keywords: 'bangla translation AI, ChatGPT translation, Google Translate bangla, DeepL bangla, AI translator bangla, bangla english translation',
    sections: [
      {
        h2: 'ভূমিকা',
        paragraphs: [
          'বাংলা থেকে ইংরেজি বা উল্টোটা — translation-এর প্রয়োজন প্রায় সবার। চাকরির ইমেইল, academic paper, business document, social media post — সব জায়গায়। কিন্তু কোন AI টুল বাংলা সবচেয়ে ভালো বোঝে?',
          'এই গাইডে আমরা ৫টি প্রধান translation AI-কে একই বাংলা ও ইংরেজি sample দিয়ে test করেছি। ফলাফল দেখলে অবাক হবেন।',
        ],
      },
      {
        h2: 'টেস্ট পদ্ধতি',
        paragraphs: [
          'আমরা ৩ ধরনের টেক্সট ব্যবহার করেছি:',
        ],
        list: [
          '<b>সহজ conversation:</b> "আপনি কেমন আছেন? আজ আকাশ মেঘলা।"',
          '<b>Technical text:</b> "নবায়নযোগ্য শক্তির উৎস হিসেবে সৌরশক্তির ব্যবহার ক্রমবর্ধমান।"',
          '<b>Idiomatic phrase:</b> "মাথা ঠাণ্ডা রাখুন এবং পরিস্থিতি সামাল দিন।"',
        ],
      },
      {
        h2: '১. ChatGPT (GPT-4o) — সর্বাধিক context-aware',
        list: [
          '<b>সহজ vacb:</b> সাবলীল, native English-এর মতো',
          '<b>Technical:</b> পরিভাষা সঠিক, এমনকি domain বুঝে synonym বদলায়',
          '<b>Idiom:</b> "Keep your cool and handle the situation" — context perfectly captured',
          '<b>দাম:</b> ফ্রি tier-এ সীমিত; Plus $২০/মাস',
          '<b>সেরা ব্যবহার:</b> creative + technical translation, paragraph-level, tone adaptation',
        ],
      },
      {
        h2: '২. Claude — সাহিত্যিক বাংলায় সেরা',
        list: [
          '<b>সহজ:</b> খুব fluid',
          '<b>Technical:</b> ChatGPT-এর সমান, কিন্তু কখনো একটু verbose',
          '<b>Idiom:</b> nuanced; সাংস্কৃতিক ব্যাখ্যাও যোগ করে যদি চাও',
          '<b>দাম:</b> ফ্রি; Pro $২০/মাস',
          '<b>সেরা ব্যবহার:</b> সাহিত্য, গল্প, রচনা — যেখানে tone গুরুত্বপূর্ণ',
        ],
      },
      {
        h2: '৩. Google Translate — দ্রুততম',
        list: [
          '<b>সহজ:</b> ৯০%+ সঠিক, কিন্তু একটু literal',
          '<b>Technical:</b> পরিভাষা miss করে কখনো; word-by-word translation প্রবণতা',
          '<b>Idiom:</b> literal — "Keep head cool"-এর মতো ভুল আসে',
          '<b>দাম:</b> সম্পূর্ণ ফ্রি, unlimited',
          '<b>সেরা ব্যবহার:</b> দ্রুত, casual translation; webpage entire translation',
        ],
      },
      {
        h2: '৪. DeepL — বাংলা সাপোর্ট সম্প্রতি যোগ',
        list: [
          '<b>সহজ:</b> European ভাষায় best-in-class কিন্তু বাংলায় এখনো Google-এর সমান',
          '<b>Technical:</b> ভালো, structure preserves',
          '<b>Idiom:</b> Google-এর চেয়ে ভালো, কিন্তু ChatGPT-এর চেয়ে কম',
          '<b>দাম:</b> ফ্রি tier আছে; Pro $৮.৯৯/মাস',
          '<b>সেরা ব্যবহার:</b> formal document, document upload (PDF/DOCX সরাসরি translate)',
        ],
      },
      {
        h2: '৫. Gemini — Google ecosystem-এ integrated',
        list: [
          '<b>সহজ:</b> Google Translate-এর চেয়ে ভালো (LLM-based)',
          '<b>Technical:</b> ChatGPT-এর সমান প্রায়',
          '<b>Idiom:</b> ভালো বুঝতে পারে',
          '<b>দাম:</b> ফ্রি tier-এ বড় limit',
          '<b>সেরা ব্যবহার:</b> Google Docs / Gmail-এ inline translation',
        ],
      },
      {
        h2: 'একনজরে তুলনা',
        list: [
          '<b>সাবলীলতা (Fluency):</b> Claude ≥ ChatGPT > Gemini > DeepL > Google',
          '<b>Speed:</b> Google > Gemini ≈ DeepL > ChatGPT/Claude',
          '<b>Free ব্যবহার:</b> Google সবচেয়ে generous',
          '<b>Bulk document:</b> DeepL সেরা (file upload)',
          '<b>Context awareness:</b> ChatGPT/Claude সবচেয়ে এগিয়ে',
        ],
      },
      {
        h2: 'বিশেষ ব্যবহারের ক্ষেত্রে কোনটি বেছে নেবেন',
        list: [
          '<b>ছাত্র/পরীক্ষার্থী:</b> ChatGPT (free tier) — explanation সহ translation',
          '<b>ব্যবসায়িক ইমেইল:</b> Claude — natural English tone',
          '<b>চাকরির CV:</b> ChatGPT + Grammarly combo',
          '<b>Academic paper:</b> DeepL Pro (document upload)',
          '<b>সাইট/অ্যাপ localization:</b> ChatGPT API (custom prompt)',
          '<b>দ্রুত একটা শব্দ/বাক্য:</b> Google Translate',
        ],
      },
      {
        h2: 'টিপস — ভালো translation পেতে',
        list: [
          'ChatGPT/Claude-এ context দিন: "এটি একটি academic paper-এর paragraph, formal tone-এ translate করো"',
          'একই AI-তে multiple try করুন — variation আসবে; সেরাটা বেছে নিন',
          'Reverse-translate করে যাচাই করুন (English → Bangla আবার Bangla → English)',
          'গুরুত্বপূর্ণ document-এ AI translate + native speaker review combine করুন',
          'কথ্য বাংলা translate-এ idiom বুঝতে AI-কে context দিন',
        ],
      },
      {
        h2: 'উপসংহার',
        paragraphs: [
          '২০২৬ সালে এসে বাংলা translation আর "অনুমান" না — context-aware AI দিয়ে প্রায় native quality পাওয়া সম্ভব। আপনার use case-এর জন্য সঠিক টুল বেছে নিন: দ্রুত প্রয়োজনে Google, গুরুত্বপূর্ণ কাজে ChatGPT/Claude।',
        ],
      },
    ],
    related: [
      { href: '/blog/ai-translation-bangla-tools/', label: 'AI Translation বাংলা টুলস' },
      { href: '/chatgpt/', label: 'ChatGPT' },
      { href: '/claude/', label: 'Claude AI' },
      { href: '/gemini/', label: 'Gemini' },
    ],
  },

  // 2 — Image to video
  {
    slug: 'ai-diye-image-to-video-banano-bangla-guide',
    title: 'AI দিয়ে Image থেকে Video বানানো — Kling, Pika, Runway গাইড',
    description: 'একটি static ছবি থেকে কীভাবে AI দিয়ে animated video বানাবেন? Kling AI, Pika Labs, Runway ML, Luma — সব ইমেজ-টু-ভিডিও টুলের তুলনা ও বাংলায় টিউটোরিয়াল।',
    keywords: 'image to video AI, Kling AI bangla, Pika Labs, Runway ML, AI video bangla, photo to video AI',
    sections: [
      {
        h2: 'ভূমিকা — Image-to-Video কী?',
        paragraphs: [
          'একটি স্থির ছবি (still image) দিন, AI সেটিকে ৪-১০ সেকেন্ডের ভিডিওতে রূপান্তর করবে — মুভমেন্ট, ক্যামেরা angle, এমনকি character animation সহ। এটিই ২০২৫-২০২৬ এর সবচেয়ে দ্রুত-বর্ধমান AI category।',
          'YouTube creator, marketer, brand owner — সবার জন্য এটি ছোট ভিডিও content বানানোর সবচেয়ে সহজ পথ।',
        ],
      },
      {
        h2: 'সেরা ৫টি Image-to-Video টুল',
        subs: [
          {
            h3: '১. Kling AI — চীনা origin, সবচেয়ে natural motion',
            paragraphs: [
              'Kling-এর motion physics realistic — যা Sora-এর সাথে compare করা হয়। কিছু shot-এ মানুষ আলাদা করতে পারবে না AI vs real।',
            ],
            list: [
              '<b>দাম:</b> Free tier আছে (limited); Pro $৬.৯৯/মাস থেকে',
              '<b>Output:</b> 5-10s, 720p/1080p',
              '<b>BD অ্যাক্সেস:</b> klingai.com — সরাসরি কাজ করে',
            ],
          },
          {
            h3: '২. Pika Labs — creator-friendly',
            paragraphs: [
              'Discord-based ছিল, এখন web app আছে। Lip-sync, special effects (Pikaffects) — মজার additions।',
            ],
            list: [
              '<b>দাম:</b> Free 30 credits/day; Standard $৮/মাস',
              '<b>Special:</b> "Inflate", "Explode", "Cake-ify" — viral effects',
            ],
          },
          {
            h3: '৩. Runway Gen-3 / Gen-4',
            paragraphs: [
              'Industry-standard, professional video editor-দের favorite। 10s+ video, 4K upscaling।',
            ],
            list: [
              '<b>দাম:</b> Free trial; Standard $১৫/মাস',
              '<b>Best for:</b> commercial-quality, agency কাজ',
            ],
          },
          {
            h3: '৪. Luma Dream Machine',
            paragraphs: [
              'Photorealism-এ Kling-এর প্রতিদ্বন্দ্বী; দ্রুত, free tier generous।',
            ],
          },
          {
            h3: '৫. Hailuo AI (MiniMax)',
            paragraphs: [
              'Free, no signup ছোট ক্লিপের জন্য চমৎকার; বাংলা prompt accept করে।',
            ],
          },
        ],
      },
      {
        h2: 'প্রথম video বানানোর ধাপ (Kling AI উদাহরণে)',
        list: [
          'klingai.com → "Image to Video"',
          'ছবি upload করুন (1024×1024 অথবা landscape — quality যত বেশি, output তত ভালো)',
          'Motion prompt লিখুন: "Camera slowly zooms in, person looks up and smiles, soft wind blowing"',
          'Settings: Duration 5s, Mode Standard/Pro',
          '"Generate" → ২-৫ মিনিট wait',
          'Download MP4',
        ],
      },
      {
        h2: 'ভালো output পেতে prompt লেখার ৭টি নিয়ম',
        list: [
          '<b>Camera motion specify করুন:</b> "zoom in", "pan left", "dolly forward"',
          '<b>Subject action আলাদা বলুন:</b> "person walks", "leaves rustle"',
          '<b>Environment detail:</b> "soft sunlight", "rain drops falling"',
          '<b>Avoid কী বলবেন:</b> "no morphing", "stable face" — distortion কমে',
          '<b>Short prompt better:</b> ২০-৪০ শব্দে রাখুন',
          '<b>Image quality:</b> blurry image input → blurry output; high-res দিন',
          '<b>Aspect ratio:</b> ছবি 16:9 হলে video-ও 16:9',
        ],
      },
      {
        h2: 'কী কাজে ব্যবহার করবেন?',
        list: [
          '<b>প্রোডাক্ট মার্কেটিং:</b> static product photo → 5s animation for Instagram Reels',
          '<b>YouTube thumbnail animation:</b> বুদ্ধিমান touch',
          '<b>Personal portrait:</b> wedding photo animation',
          '<b>স্টোরিটেলিং:</b> কাহিনীর প্রতিটি scene-এর ছবি → video sequence',
          '<b>মিউজিক ভিডিও:</b> Suno দিয়ে গান + Kling দিয়ে visual',
          '<b>Real estate:</b> property photo animation',
        ],
      },
      {
        h2: 'কোন টুল কোন কাজে?',
        list: [
          '<b>Realism:</b> Kling AI ≥ Luma',
          '<b>Fun effects:</b> Pika Labs',
          '<b>Commercial quality:</b> Runway Gen-4',
          '<b>একদম ফ্রি দ্রুত:</b> Hailuo AI',
          '<b>Lip-sync (avatar):</b> Pika or HeyGen',
        ],
      },
      {
        h2: 'সীমাবদ্ধতা',
        list: [
          'মানুষের চেহারায় কখনো distortion (especially long shot)',
          'লেখা/text image-এ rendering সমস্যা',
          'Hand motion এখনো imperfect',
          'Long-form video (১+ মিনিট) এখনো না — multiple clip stitch করতে হয়',
        ],
      },
      {
        h2: 'উপসংহার',
        paragraphs: [
          'Image-to-Video প্রযুক্তি গত ১২ মাসে ১০০× উন্নত হয়েছে। আজ একটি ফ্রি ক্লিপ বানিয়ে দেখুন (Kling বা Hailuo)। ৬ মাস পর এই টুলগুলো আরও powerful হবে — যিনি এখন থেকে practice করছেন, তিনি অনেক এগিয়ে থাকবেন।',
        ],
      },
    ],
    related: [
      { href: '/kling-ai/', label: 'Kling AI টুল পেজ' },
      { href: '/pika-labs/', label: 'Pika Labs' },
      { href: '/runway-ml/', label: 'Runway ML' },
      { href: '/blog/best-ai-video-generators-2026-bangladesh/', label: 'সেরা AI ভিডিও জেনারেটর' },
    ],
  },

  // 3 — Veo 3 / Sora 2
  {
    slug: 'veo-3-sora-2-bangla-guide-best-ai-video-models',
    title: 'Veo 3 vs Sora 2 বাংলা গাইড — ২০২৬-এর সেরা AI Video Model',
    description: 'Google Veo 3 এবং OpenAI Sora 2 — দুই সবচেয়ে শক্তিশালী AI video model। কোনটি ভালো? দাম, কোয়ালিটি, বাংলাদেশ থেকে অ্যাক্সেস ও practical demo।',
    keywords: 'Veo 3 bangla, Sora 2 bangla, AI video model 2026, Google Veo, OpenAI Sora, best AI video',
    sections: [
      {
        h2: 'ভূমিকা',
        paragraphs: [
          '২০২৪ সালে OpenAI Sora ঘোষণা করল — মাস ঘুরতেই AI video industry পাল্টে গেল। ২০২৬-এ এসে দাঁড়িয়ে দুটি নাম সবচেয়ে শক্তিশালী: <b>Google Veo 3</b> এবং <b>OpenAI Sora 2</b>।',
          'উভয়ই text বা image থেকে professional-quality video বানাতে পারে — কিছু ক্ষেত্রে Hollywood-এর সাথে তুলনীয়। এই গাইডে আমরা দুটোকে compare করব বাংলাদেশি ব্যবহারকারীর প্রেক্ষাপটে।',
        ],
      },
      {
        h2: 'Veo 3 — Google-এর flagship',
        list: [
          '<b>Output:</b> 1080p, ৮ সেকেন্ড পর্যন্ত (Veo 3.5 দীর্ঘ)',
          '<b>Audio:</b> Native সাউন্ড generation (sound effects, music, even dialogue)',
          '<b>অ্যাক্সেস:</b> Google AI Studio + Vertex AI; Gemini Advanced ($২০/মাস) subscribers',
          '<b>BD থেকে:</b> Gemini Advanced subscription লাগবে; International card',
        ],
      },
      {
        h2: 'Sora 2 — OpenAI-এর সবচেয়ে advanced',
        list: [
          '<b>Output:</b> 1080p, ১০-২০ সেকেন্ড পর্যন্ত',
          '<b>Audio:</b> Synchronized sound, dialogue',
          '<b>অ্যাক্সেস:</b> sora.com — ChatGPT Plus ($২০/মাস) বা Pro ($২০০/মাস) সাবস্ক্রিপশনে',
          '<b>BD থেকে:</b> ChatGPT Plus account থাকলেই কাজ করে',
        ],
      },
      {
        h2: '৫টি ক্ষেত্রে head-to-head তুলনা',
        subs: [
          {
            h3: '১. Photorealism',
            paragraphs: [
              'উভয় মডেলই surreal level-এর realistic। বিশেষজ্ঞদের blind test-এ Sora 2 কিছুটা এগিয়ে — বিশেষ করে human face এবং complex lighting-এ।',
            ],
          },
          {
            h3: '২. Audio quality',
            paragraphs: [
              'Veo 3-এর dialogue + sound effects একসাথে generation এই মুহূর্তে best-in-class। Sora 2-এর audio ভালো কিন্তু Veo 3-এর integrated approach আলাদা সুবিধা।',
            ],
          },
          {
            h3: '৩. Physics ও motion',
            paragraphs: [
              'Sora 2 জল, কাপড়, smoke-এর physics realistically simulate করে। Veo 3 character interaction-এ বেশি reliable।',
            ],
          },
          {
            h3: '৪. Prompt adherence',
            paragraphs: [
              'Sora 2 instruction follow-এ আরো কঠোর; complex prompt accurately follow করে। Veo 3 কখনো creative liberty নেয়।',
            ],
          },
          {
            h3: '৫. দাম per video',
            paragraphs: [
              'ChatGPT Plus-এ Sora 2 unlimited (rate-limited)। Veo 3 credits-based — প্রতি video ~10 credits।',
            ],
          },
        ],
      },
      {
        h2: 'বাংলাদেশ থেকে অ্যাক্সেস (practical)',
        list: [
          '<b>Sora 2:</b> ChatGPT Plus ($২০) থাকলেই pages.com থেকে অ্যাক্সেস (BD থেকে কাজ করে)',
          '<b>Veo 3:</b> Gemini Advanced ($২০) → AI Studio-এ Veo মডেল available',
          '<b>Payment:</b> দারাজ virtual card / Wise / Payoneer',
          '<b>VPN:</b> সাধারণত লাগে না, কিন্তু কখনো কখনো region restriction থাকে',
        ],
      },
      {
        h2: 'কী কাজে ব্যবহার?',
        list: [
          '<b>YouTube cinematic intro:</b> উভয়ই চমৎকার',
          '<b>Product commercial:</b> Veo 3 (audio integration)',
          '<b>Short film / storytelling:</b> Sora 2 (longer clip)',
          '<b>Educational explainer:</b> Veo 3 (dialogue)',
          '<b>Social media ad:</b> দুটোই — A/B test দুটোতে',
        ],
      },
      {
        h2: 'টিপস — ভালো output পেতে',
        list: [
          'Prompt গঠন: [shot type] + [subject] + [action] + [setting] + [style]',
          'উদাহরণ: "Wide shot, a Bangladeshi farmer plants rice in a green paddy field, golden hour, cinematic, 35mm film grain"',
          'একবারে একটি scene — multi-scene বানালে আলাদাভাবে generate করে stitch করুন',
          'Reference image (image-to-video mode) দিলে consistency অনেক বাড়ে',
          'নিম্ন quality output হলে — prompt কে আরো specific করুন',
        ],
      },
      {
        h2: 'সীমাবদ্ধতা',
        list: [
          'দীর্ঘ video (১+ মিনিট) এখনো না',
          'নির্দিষ্ট ব্যক্তির face cloning সীমাবদ্ধ (policy)',
          'খরচ — পেশাদার production-এর জন্য মাসে $৫০-২০০',
          'বাংলা dialogue audio এখনো সীমিত — ইংরেজি best',
        ],
      },
      {
        h2: 'উপসংহার',
        paragraphs: [
          'Veo 3 এবং Sora 2 এই মুহূর্তে আকাশ ছোঁয়া। বাংলাদেশের video creators-দের জন্য এটি বিরাট opportunity — Hollywood-grade visual এখন $২০/মাসে। আপনি যদি serious video content করেন, একটি subscription নিন এবং আগামী ৬ মাস regularly practice করুন। AI video-এর golden era এখনই।',
        ],
      },
    ],
    related: [
      { href: '/blog/sora-ai-video-bangladesh/', label: 'Sora AI Video গাইড' },
      { href: '/gemini/', label: 'Gemini (Veo access)' },
      { href: '/blog/best-ai-video-generators-2026-bangladesh/', label: 'সেরা AI ভিডিও জেনারেটর' },
      { href: '/runway-ml/', label: 'Runway ML' },
    ],
  },

  // 4 — AI Content Detector
  {
    slug: 'ai-content-detector-bangla-bachte-paren-ki',
    title: 'AI Content Detector বাংলা গাইড — ChatGPT-এর লেখা ধরা পড়ে কীভাবে?',
    description: 'AI-জেনারেটেড content কীভাবে detect হয়? GPTZero, Turnitin, Originality.ai কতটা accurate? AI-লেখা content humanize করার নৈতিক উপায় ও সীমাবদ্ধতা — সম্পূর্ণ বাংলা গাইড।',
    keywords: 'AI detector bangla, GPTZero bangla, Turnitin AI, AI content detection, humanize AI text, ChatGPT detector',
    sections: [
      {
        h2: 'ভূমিকা',
        paragraphs: [
          'একজন ছাত্র ChatGPT দিয়ে অ্যাসাইনমেন্ট লিখে জমা দিলেন — শিক্ষক ১০ সেকেন্ডে ধরে ফেললেন। কীভাবে? আজকের AI detector-গুলো এতই sophisticated যে এরা GPT-এর "fingerprint" চিনে নেয়।',
          'এই গাইডে আমরা দেখব — AI detector কীভাবে কাজ করে, কতটা নির্ভরযোগ্য, এবং সবচেয়ে গুরুত্বপূর্ণ: <b>ethical</b> উপায়ে কীভাবে AI ব্যবহার করেও original content তৈরি করা যায়।',
        ],
      },
      {
        h2: 'AI detector কীভাবে কাজ করে?',
        paragraphs: [
          'মূল ৩টি signal-এর উপর ভিত্তি করে:',
        ],
        list: [
          '<b>Perplexity:</b> AI predictable শব্দ ব্যবহার করে; perplexity (পরবর্তী শব্দের অনিশ্চয়তা) কম থাকে',
          '<b>Burstiness:</b> মানুষ ছোট-বড় বাক্য mix করে; AI একই দৈর্ঘ্যের বাক্যে লেখে',
          '<b>Token pattern:</b> AI কিছু phrase repeat করে ("In conclusion", "Moreover", "It is important to note")',
        ],
      },
      {
        h2: 'জনপ্রিয় ৫টি AI Detector',
        list: [
          '<b>GPTZero:</b> সবচেয়ে famous; free tier-এ ৫,০০০ words/মাস; শিক্ষা প্রতিষ্ঠানে বেশি ব্যবহৃত',
          '<b>Turnitin:</b> University-grade; plagiarism + AI detection একসাথে; ৯৭% accuracy claim',
          '<b>Originality.ai:</b> $14.95/মাস; SEO writer-দের জন্য designed',
          '<b>Copyleaks:</b> Multilingual সাপোর্ট; বাংলা detection-এ কিছুটা কাজ করে',
          '<b>ZeroGPT:</b> ফ্রি, দ্রুত; কিন্তু false positive বেশি',
        ],
      },
      {
        h2: 'কতটা নির্ভরযোগ্য?',
        list: [
          '<b>Accuracy claim:</b> ৯০-৯৭% (vendor-এর হিসাব)',
          '<b>বাস্তবে:</b> Pure ChatGPT output ~৮০-৯০% caught; edited content অনেক কম',
          '<b>False positive:</b> ১০-১৫% — অর্থাৎ human-written content-ও AI বলে চিহ্নিত হতে পারে',
          '<b>বাংলা content:</b> Detection accuracy তুলনামূলকভাবে কম (model কম trained)',
        ],
      },
      {
        h2: 'বাংলা content-এ AI detection — কতটা কাজ করে?',
        paragraphs: [
          'বেশিরভাগ detector ইংরেজি-ভিত্তিক। বাংলা text-এ:',
        ],
        list: [
          'GPTZero বাংলা সাপোর্ট দাবি করে; কিন্তু accuracy ~৬০-৭০%',
          'Turnitin বাংলা detection দুর্বল',
          'Copyleaks বাংলায় কাজ করে কিন্তু false positive বেশি',
          '<b>অর্থাৎ:</b> বাংলা content-এ AI detection এখনো গবেষণাধীন',
        ],
      },
      {
        h2: 'AI ব্যবহার করেও original content — Ethical workflow',
        paragraphs: [
          '"AI detector bypass" শেখানো লক্ষ্য নয়। লক্ষ্য — AI-কে একটি tool হিসেবে ব্যবহার করে নিজস্ব original কাজ তৈরি করা।',
        ],
        list: [
          '<b>১. Outline দিয়ে শুরু করুন:</b> নিজে outline বানান, AI দিয়ে শুধু expand করান',
          '<b>২. Bullet-to-paragraph:</b> নিজের bullet points দিন, AI কে শুধু সাজাতে বলুন',
          '<b>৩. Heavy edit করুন:</b> AI draft এর ৩০-৫০% rewrite করুন — নিজের voice যোগ করুন',
          '<b>৪. ব্যক্তিগত উদাহরণ যোগ করুন:</b> AI আপনার ব্যক্তিগত experience জানে না — তা যোগ করলে original হয়',
          '<b>৫. Sentence structure vary করুন:</b> ছোট-বড় বাক্য mix করুন',
          '<b>৬. Idiom/local reference:</b> বাংলাদেশি context (যেমন "তেজগাঁও-এর জ্যাম") যোগ করুন',
        ],
      },
      {
        h2: '"Humanize AI text" tools — কতটা কাজ করে?',
        paragraphs: [
          'অনেক টুল ("Undetectable.ai", "Quillbot Humanizer") দাবি করে — তারা AI text-কে human-like বানিয়ে detection bypass করে। বাস্তবতা:',
        ],
        list: [
          'Quality decrease হয় — সংশোধিত text-এ ব্যাকরণ ভুল আসে',
          'New-generation detector (GPTZero v2, Turnitin 2026) এদের ধরে',
          'নৈতিকভাবে সমস্যাজনক — academic dishonesty',
          '<b>আমাদের সুপারিশ:</b> এসব এড়িয়ে চলুন; original work-এর কোনো বিকল্প নেই',
        ],
      },
      {
        h2: 'কখন AI ব্যবহার সম্পূর্ণ acceptable?',
        list: [
          'Idea generation, brainstorming',
          'Research summarization (নিজে rewrite করে)',
          'Grammar/spelling correction (Grammarly-এর মতো)',
          'Personal email, business proposal draft (নিজের voice-এ rewrite)',
          'Translation, paraphrase (যথাযথ citation সহ)',
        ],
      },
      {
        h2: 'কখন এড়াবেন?',
        list: [
          'Academic exam, graded assignment (instructor policy অনুযায়ী)',
          'Personal essay / Statement of Purpose (এটি আপনার voice হতে হবে)',
          'Legal document, contract',
          'Medical advice',
          'Journalism — fact-check ছাড়া কখনো না',
        ],
      },
      {
        h2: 'উপসংহার',
        paragraphs: [
          'AI content detection একটি cat-and-mouse game — detector আর AI দুটোই সমানভাবে develop হচ্ছে। সেরা কৌশল: AI-কে একজন সহকারী হিসেবে দেখুন, replacement হিসেবে নয়। নিজের চিন্তা, voice, ব্যক্তিগত experience — এগুলোই আপনার content কে original করে। Detector পাশ করার জন্য নয় — নিজের শিক্ষার জন্য মেহনত করুন।',
        ],
      },
    ],
    related: [
      { href: '/blog/ai-diye-content-writing-banglay-shikhun/', label: 'AI দিয়ে কনটেন্ট রাইটিং' },
      { href: '/blog/ai-diye-blog-lekha-seo-friendly-article-ekti-sompurno-guide/', label: 'AI দিয়ে SEO ব্লগ' },
      { href: '/chatgpt/', label: 'ChatGPT' },
      { href: '/blog/best-ai-tools-for-students-bangladesh/', label: 'শিক্ষার্থীদের জন্য AI' },
    ],
  },

  // 5 — YouTube Thumbnail
  {
    slug: 'ai-diye-youtube-thumbnail-banano-ctr-baranor-guide',
    title: 'AI দিয়ে YouTube Thumbnail বানানো — CTR বাড়ানোর সম্পূর্ণ গাইড',
    description: 'YouTube-এ click-through rate (CTR) বাড়ানোর জন্য কীভাবে AI দিয়ে আকর্ষণীয় thumbnail বানাবেন? Canva AI, Midjourney, Photoshop AI — বাংলা creator-দের জন্য practical টিউটোরিয়াল।',
    keywords: 'YouTube thumbnail AI, Canva AI thumbnail, YouTube CTR bangla, AI thumbnail maker, YouTube growth bangla',
    sections: [
      {
        h2: 'ভূমিকা',
        paragraphs: [
          'YouTube-এ ভিডিওর সাফল্যের ৬০% নির্ভর করে thumbnail-এর উপর। ভালো content + খারাপ thumbnail = কম view; সাধারণ content + চমৎকার thumbnail = অনেক বেশি view। বাস্তবতা।',
          'কিন্তু professional designer hire করা ব্যয়বহুল। AI এই কাজ ১০ মিনিটে $০-১০-এ করে দিতে পারে। এই গাইডে দেখব কীভাবে।',
        ],
      },
      {
        h2: 'একটি high-CTR thumbnail-এর উপাদান',
        list: [
          '<b>Big readable text (৩-৫ শব্দ):</b> মোবাইল thumb-size থেকেও পড়া যায়',
          '<b>Strong emotion:</b> shock, curiosity, excitement (close-up face)',
          '<b>Contrast color:</b> bright vs dark background',
          '<b>Visual hierarchy:</b> চোখ যেন প্রথমে subject, তারপর text-এ যায়',
          '<b>Brand consistency:</b> প্রতি video-তে একই font/color → audience চিনতে পারে',
        ],
      },
      {
        h2: 'AI টুল ১: Canva AI — দ্রুততম রাস্তা',
        paragraphs: [
          'নতুনদের জন্য সবচেয়ে easy। হাজারো YouTube thumbnail template আছে; AI দিয়ে customize করা সহজ।',
        ],
        list: [
          'canva.com → "YouTube Thumbnail" template',
          '"Magic Edit" দিয়ে background change',
          '"Magic Eraser" দিয়ে unwanted object সরান',
          '"Magic Write" দিয়ে catchy headline',
          'Brand kit setup — color/font consistency',
        ],
      },
      {
        h2: 'AI টুল ২: Midjourney + Photoshop AI',
        paragraphs: [
          'High-end YouTuber-দের secret combo।',
        ],
        list: [
          'Midjourney-তে background scene generate করুন ("cinematic kitchen with food explosion, dramatic lighting, 16:9")',
          'নিজের selfie photo নিন (good lighting-এ)',
          'Photoshop AI Generative Fill-এ background change',
          'Text layer যোগ করুন (Photoshop-এ বা Canva-তে)',
        ],
      },
      {
        h2: 'AI টুল ৩: Thumbnail.ai (specialized)',
        paragraphs: [
          'এক ক্লিকে multiple variation। ChannelMatch feature — পুরোনো successful thumbnail-এর style copy করে।',
        ],
      },
      {
        h2: 'AI টুল ৪: PicLumen Thumbnail / 1.AI',
        paragraphs: [
          'Specifically YouTube thumbnail-এর জন্য designed। Topic দিন → ১০-২০ variation।',
        ],
      },
      {
        h2: 'বাংলা YouTube channel-এর জন্য বিশেষ টিপস',
        list: [
          '<b>বাংলা text:</b> Hind Siliguri, Solaiman Lipi-এর মতো readable font ব্যবহার',
          '<b>সংখ্যা ইংরেজি/বাংলা:</b> "১০টি" এর চেয়ে "10টি" বেশি readable thumbnail-এ',
          '<b>Color choice:</b> লাল-হলুদ-সাদা combination বাংলা audience-এ ভালো কাজ করে',
          '<b>Face zoom:</b> বাংলা creator-দের thumbnail-এ মুখ থাকলে CTR ১৫-২৫% বেশি',
          '<b>Locality cue:</b> Dhaka skyline, paddy field — local context recognition',
        ],
      },
      {
        h2: 'A/B Testing — কোন thumbnail ভালো কাজ করছে কীভাবে বুঝবেন?',
        list: [
          'YouTube Studio-এর built-in A/B test (নতুন feature)',
          'প্রতিটি video-তে ২-৩টি thumbnail বানান',
          'প্রথম ২৪ ঘণ্টায় যেটার CTR বেশি — সেটাই keep',
          'TubeBuddy / VidIQ দিয়ে competitor analysis',
        ],
      },
      {
        h2: 'সাধারণ ভুল — যা এড়ানো উচিত',
        list: [
          'অনেক text (৫+ শব্দ) — অপাঠ্য',
          'Low contrast — thumb-size-এ মিলিয়ে যায়',
          'Generic stock photo',
          'Clickbait যা content match করে না — long-term retention নষ্ট হয়',
          'Inconsistent style — viewer চ্যানেল চিনতে পারে না',
        ],
      },
      {
        h2: '১০ মিনিটে একটি thumbnail বানানোর workflow',
        list: [
          'মিনিট ১-২: Hook line ভাবুন ("আমি ChatGPT দিয়ে ১ মাসে যা শিখলাম")',
          'মিনিট ৩-৫: Canva-তে template open; নিজের photo বা AI-generated বসান',
          'মিনিট ৬-৭: Text বসান, color check',
          'মিনিট ৮-৯: ২-৩টি variation save করুন',
          'মিনিট ১০: ছোট size-এ preview (thumb-test)',
        ],
      },
      {
        h2: 'উপসংহার',
        paragraphs: [
          'Thumbnail হলো YouTube-এর "book cover"। AI আপনাকে যা দিয়েছে তা হলো — designer ছাড়াই professional thumbnail বানানোর ক্ষমতা। আজকের ভিডিওতেই apply করুন; ৩০ দিন pratice করলে নিজের signature style develop হবে।',
        ],
      },
    ],
    related: [
      { href: '/canva-ai/', label: 'Canva AI' },
      { href: '/midjourney/', label: 'Midjourney' },
      { href: '/blog/ai-diye-youtube-video-toiri-sompurno-guide/', label: 'AI দিয়ে YouTube ভিডিও' },
      { href: '/ai-tools-for-youtube-bangladesh/', label: 'YouTube-এর জন্য AI টুলস' },
    ],
  },

  // 6 — No-code website (Bolt, v0, Lovable)
  {
    slug: 'ai-diye-website-banano-no-code-bangla-guide',
    title: 'AI দিয়ে Website বানানো — Bolt, v0, Lovable (No-Code বাংলা গাইড)',
    description: 'কোনো কোডিং না জেনে কীভাবে AI দিয়ে professional website বানাবেন? Bolt.new, v0 by Vercel, Lovable, Replit Agent — সব no-code AI tool-এর তুলনা ও practical tutorial।',
    keywords: 'AI website builder bangla, Bolt.new bangla, v0 vercel, Lovable AI, no-code website, AI app builder',
    sections: [
      {
        h2: 'ভূমিকা — AI কোডিং-এর নতুন যুগ',
        paragraphs: [
          '২০২৪-২০২৫-এ AI coding tools-এর এমন উন্নতি হয়েছে যে — এখন কেউ কোডিং না জেনেই production-ready website বানাতে পারছেন। শুধু সাধারণ ভাষায় বলুন কী চান, AI পুরো site বানিয়ে দেবে।',
          'বাংলাদেশি ছোট ব্যবসা, freelancer, ছাত্র — সবার জন্য এটি একটি বিরাট opportunity। MVP $০-এ launch করতে পারবেন এক সন্ধ্যায়।',
        ],
      },
      {
        h2: 'শীর্ষ ৫টি AI website builder',
        subs: [
          {
            h3: '১. Bolt.new — সবচেয়ে fast prototype',
            paragraphs: [
              'StackBlitz-এর তৈরি; browser-এই full Node.js environment। বলুন "একটি portfolio site বানাও" — ৩০ সেকেন্ডে পুরো React app।',
            ],
            list: [
              'Free tier: দৈনিক tokens limit',
              'Pro: $২০/মাস (unlimited)',
              'Output: Live preview + download',
            ],
          },
          {
            h3: '২. v0 by Vercel — component-level perfection',
            paragraphs: [
              'Designer-দের favorite। কোনো UI উপাদান দরকার? একটি screenshot upload করুন, AI কোড generate করবে।',
            ],
            list: [
              'Free credits প্রতিদিন',
              'Premium: $২০/মাস',
              'Vercel-এ এক ক্লিকে deploy',
            ],
          },
          {
            h3: '৩. Lovable — sleek, designer-friendly',
            paragraphs: [
              'Bolt-এর alternative; UI এবং user experience-এ বেশি polished। database integration সহজ।',
            ],
          },
          {
            h3: '৪. Replit Agent',
            paragraphs: [
              'Replit-এর built-in AI; বলুন "একটি pizza ordering app বানাও" — পুরো full-stack app।',
            ],
          },
          {
            h3: '৫. Cursor (advanced)',
            paragraphs: [
              'Pure AI-পরিচালিত IDE — coding জানলে dramatically দ্রুত হবেন, কিন্তু purely no-code না।',
            ],
          },
        ],
      },
      {
        h2: 'Bolt.new দিয়ে প্রথম site (ধাপে ধাপে)',
        list: [
          'bolt.new-এ যান (signup না করেই কাজ করে)',
          'Prompt: "Create a portfolio website for a Bangladeshi web developer. Sections: hero with name and tagline, about with bio, projects (3 cards), skills list, contact form. Use Tailwind, modern minimal design, blue accent."',
          'AI ১০-৩০ সেকেন্ডে পুরো site বানিয়ে preview দেখাবে',
          'যেকোনো অংশ change-এর জন্য আবার prompt দিন: "Change accent color to green"',
          '"Deploy" button → Netlify/Vercel-এ এক ক্লিকে live',
        ],
      },
      {
        h2: 'বাংলাদেশি use case — কী বানাতে পারেন?',
        list: [
          '<b>ব্যক্তিগত portfolio</b> — চাকরি/clientship জন্য',
          '<b>Restaurant landing page</b> — menu, reservation form',
          '<b>Online tuition page</b> — শিক্ষকদের জন্য',
          '<b>E-commerce single-product</b> — Dropshipping পরীক্ষায়',
          '<b>Event RSVP page</b> — বিয়ে, conference',
          '<b>Local NGO website</b>',
          '<b>SaaS MVP landing page</b> — investor-pitch ব্যবহারে',
        ],
      },
      {
        h2: 'Effective prompt লেখার ৭টি নিয়ম',
        list: [
          '<b>Goal স্পষ্ট:</b> "Build a [type] website for [audience]"',
          '<b>Section list দিন:</b> hero, about, services, testimonials, footer',
          '<b>Style hints:</b> "minimal", "playful", "corporate", "Apple-like"',
          '<b>Color palette specify:</b> "navy blue accent on white background"',
          '<b>Tech stack বলুন:</b> "React + Tailwind + shadcn/ui"',
          '<b>Sample content:</b> "Use placeholder Bangladeshi names like Rahim, Karim"',
          '<b>Iterate:</b> Initial output পেলে — refine ("make hero bigger, add CTA button")',
        ],
      },
      {
        h2: 'Deployment ও custom domain',
        list: [
          'Bolt → Netlify direct: এক ক্লিকে live URL (free)',
          'v0 → Vercel: built-in seamless',
          'Custom .com domain: Namecheap থেকে কিনুন → DNS connect',
          'Free SSL automatic (Let\'s Encrypt)',
          'বাংলাদেশ থেকে domain কিনতে দারাজ virtual card কাজ করে',
        ],
      },
      {
        h2: 'সীমাবদ্ধতা',
        list: [
          'জটিল backend (payment processing) এখনো manual coding লাগে',
          'Token limit — খুব বড় app-এ ফ্রি tier শেষ হয়ে যায়',
          'AI generated কোডে bug থাকতে পারে — review essential',
          'SEO/performance optimization manually করতে হয়',
        ],
      },
      {
        h2: 'কোন টুল কোন কাজে?',
        list: [
          '<b>দ্রুত prototype:</b> Bolt.new',
          '<b>UI/UX polish:</b> v0 by Vercel',
          '<b>Database-heavy app:</b> Lovable',
          '<b>Full-stack with auth:</b> Replit Agent',
          '<b>Long-term maintenance:</b> Cursor (control বেশি)',
        ],
      },
      {
        h2: 'উপসংহার',
        paragraphs: [
          'এই tool-গুলো coding শেখার বিকল্প নয় — কিন্তু entrepreneur, marketer, ছোট ব্যবসার মালিকদের জন্য — production-ready site বানানোর সবচেয়ে দ্রুত পথ। আজকেই Bolt.new খুলে একটি landing page বানান (যেকোনো idea-র জন্য)। ৩০ মিনিট দিয়ে দেখুন — কী সম্ভব।',
        ],
      },
    ],
    related: [
      { href: '/bolt-new/', label: 'Bolt.new' },
      { href: '/v0-by-vercel/', label: 'v0 by Vercel' },
      { href: '/lovable/', label: 'Lovable' },
      { href: '/blog/v0-dev-bangla-guide/', label: 'v0.dev বাংলা গাইড' },
    ],
  },

  // 7 — Mock Interview
  {
    slug: 'ai-diye-mock-interview-job-prostuti-bangla',
    title: 'AI দিয়ে Mock Interview — চাকরির ইন্টারভিউ প্রস্তুতি বাংলা গাইড',
    description: 'চাকরির ইন্টারভিউয়ের জন্য AI দিয়ে কীভাবে practice করবেন? ChatGPT, Interview Warmup, Yoodli — বাংলা ও ইংরেজি mock interview, behavioral question, salary negotiation।',
    keywords: 'AI mock interview, job interview prep bangla, ChatGPT interview, interview practice AI, chakri prostuti, AI career coach',
    sections: [
      {
        h2: 'ভূমিকা',
        paragraphs: [
          'চাকরির ইন্টারভিউয়ের প্রস্তুতিতে সবচেয়ে কঠিন অংশ — practice partner খোঁজা। বন্ধু-পরিবার বেশিরভাগ সময় serious interview-এর simulation করতে পারে না। আর professional career coach $৫০-২০০ প্রতি session।',
          'AI এই দুটোর মধ্যবর্তী সমাধান — যেকোনো সময়, যেকোনো প্রশ্ন, instant feedback। বাংলাদেশি job market-এর জন্য এই গাইডে দেখব practical workflow।',
        ],
      },
      {
        h2: '১. ChatGPT — সবচেয়ে versatile',
        paragraphs: [
          'প্রথম prompt: <i>"আমি [কোম্পানি]-এ [পদ]-এর জন্য interview দিচ্ছি। আমার CV: [paste]. Job description: [paste]. তুমি একজন strict HR interviewer। আমাকে ১০টি technical + behavioral প্রশ্ন করো — একটা একটা করে। আমি প্রতি উত্তরের পর তুমি feedback দাও — strength, weakness, improvement suggestion।"</i>',
          'Voice mode-এ এই কাজ আরো effective — কথ্য practice হবে।',
        ],
      },
      {
        h2: '২. Google Interview Warmup',
        list: [
          'grow.google/interview-warmup',
          'সম্পূর্ণ ফ্রি',
          '২০টি field-specific question (data analytics, project management, IT support, e-commerce)',
          'Voice answer record করে — feedback দেয় তোমার words, talking speed, eye contact-এ',
          'বাংলায় answer করলেও ইংরেজি transcript এবং feedback পাবেন',
        ],
      },
      {
        h2: '৩. Yoodli — communication coaching',
        list: [
          'Speech analytics — filler words ("um", "uh"), pace, clarity',
          'Free tier আছে',
          'Real-time AI conversation possible',
          'Premium: $২০/মাস',
        ],
      },
      {
        h2: 'বাংলাদেশি job market-এর জন্য common প্রশ্ন (AI দিয়ে practice করার জন্য)',
        subs: [
          {
            h3: 'Behavioral (যেকোনো পদে)',
            list: [
              '"নিজের সম্পর্কে বলুন" — STAR formula-তে answer practice',
              '"আপনার strength এবং weakness কী?"',
              '"আপনি কেন এই কোম্পানিতে join করতে চান?"',
              '"একটি কঠিন situation describe করুন যেখানে আপনি leadership দেখিয়েছিলেন"',
              '"৫ বছর পর নিজেকে কোথায় দেখেন?"',
            ],
          },
          {
            h3: 'বাংলাদেশ-specific',
            list: [
              '"আপনি ঢাকার বাইরে কাজ করতে রাজি?" — relocation question',
              '"Current salary কত? Expected salary?" — most asked in BD',
              '"আপনি কেন previous job ছেড়েছেন?"',
              '"আপনি কোন domain-এ specialize করতে চান?"',
            ],
          },
          {
            h3: 'Technical (IT/Engineering)',
            list: [
              '"এই algorithm explain করুন: [...]"',
              '"আপনার সেরা project এবং তার technical challenge"',
              'System design questions',
              'Bug debugging scenarios',
            ],
          },
        ],
      },
      {
        h2: 'AI দিয়ে salary negotiation practice',
        paragraphs: [
          'বাংলাদেশে অনেকেই salary negotiate করতে পারেন না — ফলে নিজের প্রাপ্য থেকে কম পান। ChatGPT-কে এই role দিন: <i>"তুমি একজন hard-negotiating HR manager। আমি আমার expected salary ৬০,০০০ টাকা দাবি করব, তুমি ৪৫,০০০ offer করবে। আমাকে negotiate করতে সাহায্য করো — প্রতিটি counter-এর পর tip দাও।"</i>',
          '৫-৬ round practice করলে real negotiation-এ confidence অনেক বাড়বে।',
        ],
      },
      {
        h2: 'CV/Resume optimization — AI দিয়ে',
        list: [
          'নিজের CV ChatGPT-এ paste করে: "এই CV-কে [job description] এর জন্য optimize করো; relevant keywords যোগ করো"',
          'ATS (Applicant Tracking System)-এর জন্য: "Make this CV ATS-friendly"',
          'Cover letter: "Write a 250-word cover letter for [job] using my CV"',
        ],
      },
      {
        h2: '১-সপ্তাহের interview prep schedule (AI-driven)',
        list: [
          '<b>দিন ১:</b> Company research (ChatGPT-এ company নাম দিন, mission/values/recent news request)',
          '<b>দিন ২:</b> CV optimization + LinkedIn polish',
          '<b>দিন ৩:</b> ১৫টি behavioral question practice (voice mode-এ)',
          '<b>দিন ৪:</b> Technical question practice',
          '<b>দিন ৫:</b> Mock interview full (৪৫ মিনিট)',
          '<b>দিন ৬:</b> Salary negotiation practice',
          '<b>দিন ৭:</b> Final review + আত্মবিশ্বাস building',
        ],
      },
      {
        h2: 'Interview-এর দিন AI-র সাহায্য',
        list: [
          'সকালে: ChatGPT-এ company-র latest news search',
          '১ ঘণ্টা আগে: ২-৩টা likely question-এর answer mentally repeat',
          'After-interview: কী কী প্রশ্ন হয়েছে notebook-এ লিখুন → future practice-এর জন্য',
        ],
      },
      {
        h2: 'সতর্কতা',
        list: [
          'AI সব প্রশ্নের সঠিক answer জানে না — বিশেষ করে niche technical/domain question',
          'কথ্য বাংলা practice-এ AI সাহায্য সীমিত — বন্ধুর সাথে combine করুন',
          'AI dependency-তে confidence কমে যেতে পারে — final practice নিজে নিজে করুন',
        ],
      },
      {
        h2: 'উপসংহার',
        paragraphs: [
          'Interview প্রস্তুতি আর "ভাগ্যের" উপর নয় — practice-এর উপর। AI আপনাকে অনন্ত practice partner দিচ্ছে। আজকের চাকরির interview-এর আগে শুধু ১ ঘণ্টা ChatGPT voice mode-এ practice করুন। ফলাফল হাতে পেলে অবাক হবেন।',
        ],
      },
    ],
    related: [
      { href: '/blog/ai-resume-cv-maker-bangladesh/', label: 'AI Resume Maker' },
      { href: '/chatgpt/', label: 'ChatGPT' },
      { href: '/claude/', label: 'Claude AI' },
      { href: '/blog/ai-tools-for-freelancers-income-bangladesh/', label: 'ফ্রিল্যান্স আয়' },
    ],
  },

  // 8 — Product Photography
  {
    slug: 'ai-product-photography-ecommerce-bangla-guide',
    title: 'AI দিয়ে Product Photography — E-commerce ব্যবসার জন্য বাংলা গাইড',
    description: 'ছোট ব্যবসার জন্য costly studio photoshoot ছাড়াই professional product ছবি কীভাবে বানাবেন? Photoroom, FluxAI, Pebblely — AI product photography টুলগুলোর সম্পূর্ণ tutorial।',
    keywords: 'AI product photography, ecommerce photo bangla, Photoroom, Pebblely, AI background, daraz product image',
    sections: [
      {
        h2: 'ভূমিকা',
        paragraphs: [
          'Daraz, Facebook page বা নিজের shop-এ একটি product বিক্রির জন্য সবচেয়ে বড় অস্ত্র — ভালো ছবি। কিন্তু একটি professional product photo shoot ৫,০০০-৩০,০০০ টাকা।',
          'AI এই কাজ এখন ১০ মিনিটে $০-১০-এ করে দিতে পারে। নিজের মোবাইলে তোলা সাধারণ ছবিও studio-quality-তে রূপান্তর হয়। এই গাইডে দেখব কীভাবে।',
        ],
      },
      {
        h2: 'কী কী সমস্যার সমাধান AI দেয়?',
        list: [
          '<b>Background remove + replace:</b> ঘরের ছবি → studio-style সাদা/textured background',
          '<b>Lighting fix:</b> অন্ধকার ছবি → professional lighting',
          '<b>Lifestyle scene:</b> বাটি → "kitchen counter with steam, morning light"',
          '<b>Model on product:</b> জামা শুধু → AI model পরা হয়ে দেখানো',
          '<b>Color variation:</b> এক product-এর ১০ color variation এক ক্লিকে',
        ],
      },
      {
        h2: 'সেরা ৫টি AI product photography টুল',
        subs: [
          {
            h3: '১. Photoroom — সবচেয়ে user-friendly',
            paragraphs: [
              'মোবাইল অ্যাপ এবং web — দুটোই আছে। One-click background remove, smart resizing, batch processing।',
            ],
            list: [
              'Free tier-এ basic features',
              'Pro: $৯.৯৯/মাস (unlimited HD, AI scene generation)',
              'BD থেকে: সরাসরি কাজ করে',
            ],
          },
          {
            h3: '২. Pebblely — scene generation specialist',
            paragraphs: [
              'AI generated scenes-এ product বসিয়ে দেয় (beach, kitchen, marble counter ইত্যাদি)। প্রতিদিন ৪০টা ফ্রি image।',
            ],
          },
          {
            h3: '৩. Flair AI — agency-grade',
            paragraphs: [
              'Drag-and-drop interface, professional templates, model generation (AI মডেলে জামা পরিয়ে দেখান)।',
            ],
            list: [
              'Free trial',
              'Standard: $২৫/মাস',
            ],
          },
          {
            h3: '৪. Flux 1.1 / Midjourney',
            paragraphs: [
              'Custom scene generation। "Place this watch on a marble countertop next to a coffee cup, soft morning light" — পুরো scene বানিয়ে দেবে।',
            ],
          },
          {
            h3: '৫. Remove.bg + Canva combo',
            paragraphs: [
              'সবচেয়ে ফ্রি workflow: Remove.bg → Canva-তে background paste। Daraz seller-দের জন্য চমৎকার।',
            ],
          },
        ],
      },
      {
        h2: 'মোবাইল দিয়ে ভালো ছবি তোলার ৫টি টিপস (AI করার আগে)',
        list: [
          'প্রাকৃতিক আলোতে তুলুন (জানালার পাশে সকাল ১০টা)',
          'একটি সাদা বা plain background ব্যবহার করুন',
          'Hand-held shake এড়ান — ফোন স্থির রাখুন',
          'একই product-এর ৫-১০টা angle তুলুন (AI এ choice দেবে)',
          'Focus সঠিক — product blur হলে AI fix করতে পারে কিন্তু perfect না',
        ],
      },
      {
        h2: 'Daraz seller-এর জন্য complete workflow',
        list: [
          'মোবাইলে product photo (5-10 angles)',
          'Photoroom-এ background remove → white',
          'Pebblely-তে hero shot (lifestyle scene)',
          'Canva-তে collage বানান (1080×1080 Daraz format)',
          'Product name, USP, price text overlay',
          'Upload as primary image + 4-5 gallery photos',
        ],
      },
      {
        h2: 'Cost comparison',
        list: [
          '<b>Traditional studio shoot:</b> ৳৫,০০০-৩০,০০০ + শিপিং product to studio',
          '<b>Hired freelance photographer:</b> ৳২,০০০-১০,০০০',
          '<b>AI workflow (নিজে করা):</b> ৳০-৩,০০০/মাস (একাধিক product cover)',
          '<b>সময়:</b> Studio shoot ১ দিন + edit ২-৩ দিন; AI: ৩০ মিনিট/product',
        ],
      },
      {
        h2: 'Category-ভিত্তিক টিপস',
        subs: [
          {
            h3: 'পোশাক (saree, পাঞ্জাবি, kurti)',
            paragraphs: [
              'Flair AI বা MagicShoot-এ AI model upload করে জামা পরিয়ে দিন। একই জামার female/male model, multiple pose।',
            ],
          },
          {
            h3: 'খাবার',
            paragraphs: [
              'Pebblely-তে "served on wooden plate" বা "with steam rising"। বাঙালি খাবারের জন্য "banana leaf" background ভালো কাজ করে।',
            ],
          },
          {
            h3: 'ইলেকট্রনিক্স',
            paragraphs: [
              'Photoroom-এ white/gradient background; spec callout text overlay (Canva)।',
            ],
          },
          {
            h3: 'গহনা',
            paragraphs: [
              'Close-up shot + Flair AI দিয়ে scene generation; ring on velvet, necklace on neck stand।',
            ],
          },
        ],
      },
      {
        h2: 'নৈতিক বিবেচনা',
        list: [
          'AI-generated lifestyle image হলে product যেন আকারে/বৈশিষ্ট্যে accurate হয়',
          'Misleading claim করবেন না (যেমন: একটি product অন্য কিছু দেখানো)',
          'Real product বনাম AI image — দ্বিতীয় slot-এ real photo রাখুন',
          'AI generated মডেলের কথা নয় — শুধু product দেখান',
        ],
      },
      {
        h2: 'উপসংহার',
        paragraphs: [
          'ছোট ব্যবসার জন্য AI product photography একটি unfair advantage। বড় brand-এর মতো ছবি, কিন্তু খরচ ১/১০। আজকেই একটি product-এর ৩-৪টা ছবি তুলুন এবং Photoroom + Pebblely দিয়ে process করুন। পরের সপ্তাহে যখন নতুন listing post করবেন — engagement-এর পার্থক্য নিজেই দেখবেন।',
        ],
      },
    ],
    related: [
      { href: '/blog/ai-ecommerce-tools-bangladesh/', label: 'AI E-commerce টুলস' },
      { href: '/remove-bg/', label: 'Remove.bg' },
      { href: '/canva-ai/', label: 'Canva AI' },
      { href: '/midjourney/', label: 'Midjourney' },
    ],
  },

  // 9 — Teachers
  {
    slug: 'best-ai-tools-for-teachers-bangladesh',
    title: 'শিক্ষকদের জন্য সেরা AI টুলস — বাংলাদেশি শিক্ষকদের সম্পূর্ণ গাইড',
    description: 'বাংলাদেশের স্কুল-কলেজ-ভার্সিটির শিক্ষকদের জন্য সেরা AI টুলস কোনগুলো? Lesson plan, quiz, worksheet, presentation, grading — সব কাজ AI দিয়ে দ্রুত করার practical গাইড।',
    keywords: 'AI tools teachers bangladesh, AI shikkhok, AI lesson plan, ChatGPT for teachers, AI education bangla, teacher productivity AI',
    sections: [
      {
        h2: 'ভূমিকা',
        paragraphs: [
          'বাংলাদেশের একজন শিক্ষকের সাপ্তাহিক ৪০-৬০ ঘণ্টা কাজ — শ্রেণিকক্ষ, পাঠ পরিকল্পনা, খাতা মূল্যায়ন, অভিভাবক যোগাযোগ। ছাত্রদের পেছনে যতটা সময় দিতে চান, ততটা পান না।',
          'AI এই workload-এর ৪০-৫০% reduce করতে পারে — যাতে আপনি focus দিতে পারেন শিক্ষাদানের আসল কাজে। এই গাইডে শিক্ষকদের জন্য বিশেষায়িত AI workflow।',
        ],
      },
      {
        h2: '১. Lesson Plan তৈরি — ChatGPT/Claude',
        paragraphs: [
          'একটি ৪০-মিনিটের ক্লাসের পরিকল্পনা তৈরিতে যা ১-২ ঘণ্টা লাগত, AI-এ ৫ মিনিট।',
        ],
        list: [
          'Prompt: "Class IX biology-এর জন্য একটি ৪০-মিনিটের lesson plan বানাও। Topic: কোষ বিভাজন। Section: warm-up (5 min), introduction (10 min), main concept (15 min), activity (5 min), wrap-up (5 min)। বাংলায়।"',
          'NCTB syllabus reference করতে বলুন',
          'Bloom\'s taxonomy অনুযায়ী objective যোগ করতে বলুন',
        ],
      },
      {
        h2: '২. Quiz ও Worksheet — Quizgecko / ChatGPT',
        list: [
          'ChatGPT-এ paste করুন পাঠ্য অধ্যায়; বলুন "১০টি MCQ + ৫টি short question তৈরি করো, সঠিক উত্তর সহ"',
          '<b>Quizgecko:</b> URL/PDF থেকে instant quiz generation; bulk export',
          '<b>Diffit:</b> একটি reading passage থেকে comprehension questions, ভিন্ন difficulty level-এ',
          '<b>Curipod:</b> ইন্টারঅ্যাক্টিভ live quiz (ছাত্ররা ফোনে জবাব দেবে)',
        ],
      },
      {
        h2: '৩. Presentation/Slide — Gamma AI',
        paragraphs: [
          'একটি ক্লাসের জন্য ১৫-স্লাইডের visual presentation Gamma AI-তে ২ মিনিটে। Topic দিন, "academic, with diagrams" specify করুন। ফ্রি tier-এ ১০-১৫টা presentation/মাস।',
        ],
      },
      {
        h2: '৪. Grading / Essay Evaluation',
        paragraphs: [
          'হাতে লেখা খাতা মূল্যায়ন AI করতে পারে না, কিন্তু typed essay/assignment-এ অনেক সাহায্য করবে।',
        ],
        list: [
          'ChatGPT-এ student essay paste করুন; বলুন "Evaluate this 7th-grade essay on [topic]. Rubric: content (40), language (30), structure (20), creativity (10). Give marks + 3 specific improvement suggestions."',
          '<b>Gradescope (paid):</b> AI-assisted grading at scale',
          '<b>Turnitin AI Score:</b> AI-generated kina সেটি চিহ্নিত করে',
        ],
      },
      {
        h2: '৫. ব্যক্তিগতকৃত feedback letter',
        paragraphs: [
          'প্রতি ছাত্রের জন্য আলাদা feedback লেখা প্রায় অসম্ভব। AI workflow:',
        ],
        list: [
          'প্রতি student-এর performance Google Sheet-এ লিখুন (name, scores, observation)',
          'ChatGPT-এ row paste করুন: "এই data থেকে অভিভাবকের জন্য একটি ১৫০-শব্দের feedback letter বানাও বাংলায়, encouraging কিন্তু honest tone-এ"',
          '৪০ জন student-এর জন্য ৪০ মিনিটে সব letter ready',
        ],
      },
      {
        h2: '৬. পড়াশোনা সংক্রান্ত ভিডিও — শিক্ষাদানে দৃশ্যমান উদাহরণ',
        list: [
          '<b>Khanmigo (Khan Academy AI):</b> ছাত্রদের জন্য AI tutor; teachers free access',
          '<b>NotebookLM:</b> পাঠ্য বই upload → audio overview (পডকাস্ট-style)',
          '<b>Synthesia / HeyGen:</b> AI-narrated explainer video',
        ],
      },
      {
        h2: '৭. ছাত্রদের individual support',
        paragraphs: [
          'প্রতি ছাত্রের আলাদা doubt-এ সময় দেওয়া কঠিন। AI tutor:',
        ],
        list: [
          'ক্লাসে ChatGPT-এর Custom GPT বানিয়ে দিন (only your subject)',
          'ছাত্ররা ক্লাসের বাইরে নিজে নিজেই প্রশ্ন করবে',
          'আপনি sample conversation review করতে পারবেন',
        ],
      },
      {
        h2: '৮. Administrative কাজ',
        list: [
          '<b>Parent meeting summary:</b> মিটিং recording → Whisper → ChatGPT summary',
          '<b>Email draft:</b> অভিভাবকের ইমেইল reply ৩০ সেকেন্ডে',
          '<b>Report card comment:</b> bulk generation Google Sheet + ChatGPT API',
          '<b>Schedule planning:</b> ChatGPT-কে timetable optimize করতে বলুন',
        ],
      },
      {
        h2: 'বাংলাদেশি স্কুল-কলেজে practical workflow (সপ্তাহভিত্তিক)',
        list: [
          '<b>রবিবার:</b> পরের সপ্তাহের lesson plan (১ ঘণ্টা ChatGPT-এ)',
          '<b>সোমবার:</b> Quiz ও worksheet তৈরি (৪৫ মিনিট)',
          '<b>মঙ্গলবার:</b> Gamma-তে presentation slide',
          '<b>বুধবার:</b> Student doubt session prep',
          '<b>বৃহস্পতিবার:</b> Grading + feedback letter',
          '<b>শুক্রবার:</b> Parent communication',
          '<b>মোট সাশ্রয়:</b> সাপ্তাহিক ৮-১৫ ঘণ্টা',
        ],
      },
      {
        h2: 'সতর্কতা ও নৈতিকতা',
        list: [
          'ছাত্রদের ব্যক্তিগত data (নাম, marks) AI-তে দেওয়ার আগে — school policy চেক',
          'AI evaluation human review-এর বিকল্প নয়',
          'ছাত্রদেরও AI use শেখান — তাদের অন্ধকারে রাখবেন না',
          'নিজের voice + character class-এ — AI দিয়ে replace করবেন না',
        ],
      },
      {
        h2: 'উপসংহার',
        paragraphs: [
          'AI শিক্ষকের প্রতিদ্বন্দ্বী নয়, সহকারী। এটি repetitive কাজ থেকে আপনাকে মুক্ত করে — যাতে আপনি ছাত্রদের সাথে আরো মানবিক সংযোগ তৈরি করতে পারেন। আজকেই একটি টুল (ChatGPT) দিয়ে আগামী সপ্তাহের একটা lesson plan বানান। এক সপ্তাহে আপনি যে সময় বাঁচাবেন — সেটাই AI-এর প্রকৃত মূল্য।',
        ],
      },
    ],
    related: [
      { href: '/blog/ai-education-bangladesh/', label: 'AI Education গাইড' },
      { href: '/blog/best-ai-tools-for-students-bangladesh/', label: 'ছাত্রদের জন্য AI টুলস' },
      { href: '/notebooklm/', label: 'NotebookLM' },
      { href: '/blog/notebooklm-diye-porashona-students-bangla-guide/', label: 'NotebookLM দিয়ে পড়াশোনা' },
    ],
  },

  // 10 — Perplexity vs ChatGPT
  {
    slug: 'perplexity-vs-chatgpt-bangla-research-konti-bhalo',
    title: 'Perplexity vs ChatGPT বাংলা — Research-এর জন্য কোনটি ভালো? (২০২৬)',
    description: 'Perplexity AI এবং ChatGPT — দুটোই powerful। কিন্তু research, fact-finding ও citation-এর জন্য কোনটি ভালো? Bangla user-এর প্রেক্ষাপটে দাম, accuracy, source quality-এর সম্পূর্ণ তুলনা।',
    keywords: 'Perplexity vs ChatGPT, Perplexity bangla, AI research tool, ChatGPT search, Perplexity Pro, AI citation',
    sections: [
      {
        h2: 'ভূমিকা',
        paragraphs: [
          'কেউ ChatGPT খোলে কোনো প্রশ্ন জিজ্ঞেস করতে। কেউ Perplexity খোলে। দুটোই AI chatbot, কিন্তু core philosophy আলাদা। একটি জেনারেটিভ — সব কিছু নিজে বলে। অন্যটি research-driven — উৎস থেকে কথা বলে।',
          'বাংলাদেশের ছাত্র, journalist, researcher, content writer — সবার জন্য এই গাইডে আমরা দেখাব কোনটি কখন ব্যবহার করবেন।',
        ],
      },
      {
        h2: 'মূল পার্থক্য — এক বাক্যে',
        list: [
          '<b>ChatGPT:</b> "AI যা জানে তা বলে" — training data + browsing',
          '<b>Perplexity:</b> "AI কী খুঁজে পেল তা বলে" — live web search সবসময়',
        ],
      },
      {
        h2: 'Citation ও সূত্র — সবচেয়ে বড় পার্থক্য',
        paragraphs: [
          'Perplexity প্রতিটি কথার পাশে number citation দেয় ([1], [2], [3]) — যেগুলো hover করলে আসল source দেখা যায়। ChatGPT-এর citation না থাকা মানে — fact-check ব্যবহারকারীকে আলাদাভাবে করতে হয়।',
        ],
        list: [
          '<b>Academic/journalism কাজে:</b> Perplexity অপরিহার্য',
          '<b>Casual conversation, creative writing:</b> ChatGPT যথেষ্ট',
        ],
      },
      {
        h2: '৭টি ক্ষেত্রে head-to-head',
        subs: [
          {
            h3: '১. Research / Fact-finding',
            paragraphs: [
              '<b>বিজয়ী: Perplexity</b> — live sources, citation, recency।',
            ],
          },
          {
            h3: '২. Creative writing',
            paragraphs: [
              '<b>বিজয়ী: ChatGPT</b> — কল্পনাশক্তি ও language flow better।',
            ],
          },
          {
            h3: '৩. Coding',
            paragraphs: [
              '<b>বিজয়ী: ChatGPT (GPT-4o বা o1)</b> — Perplexity-ও পারে কিন্তু focused tool না।',
            ],
          },
          {
            h3: '৪. Recent news / current events',
            paragraphs: [
              '<b>বিজয়ী: Perplexity</b> — real-time search; ChatGPT-ও browsing করে কিন্তু slower।',
            ],
          },
          {
            h3: '৫. Math / reasoning',
            paragraphs: [
              '<b>বিজয়ী: ChatGPT</b> (o1/o3 reasoning model)।',
            ],
          },
          {
            h3: '৬. Long-form analysis',
            paragraphs: [
              '<b>বিজয়ী: ChatGPT</b> — context window বড়, deep dive ভালো।',
            ],
          },
          {
            h3: '৭. Academic paper search',
            paragraphs: [
              '<b>বিজয়ী: Perplexity (with Academic focus)</b> — scholarly source filter।',
            ],
          },
        ],
      },
      {
        h2: 'দাম comparison',
        list: [
          '<b>Perplexity Free:</b> Unlimited basic searches, ৫টা Pro Search/day',
          '<b>Perplexity Pro ($২০/মাস):</b> Unlimited Pro Search, GPT-4o/Claude 3.5/Sonnet 4 access, file upload',
          '<b>ChatGPT Free:</b> GPT-4o mini unlimited, GPT-4o limited',
          '<b>ChatGPT Plus ($২০/মাস):</b> GPT-4o, o1, Sora, image gen',
          '<b>Best value:</b> দুটোই একসাথে $৪০/মাস — সিরিয়াস researcher-দের জন্য',
        ],
      },
      {
        h2: 'বাংলা use case-ভিত্তিক সুপারিশ',
        list: [
          '<b>ছাত্র (থিসিস, paper):</b> Perplexity Pro (citation দরকার)',
          '<b>Journalist / blogger:</b> Perplexity (live news) + ChatGPT (drafting)',
          '<b>Content writer:</b> ChatGPT (creativity, speed)',
          '<b>Programmer:</b> ChatGPT (coding focus)',
          '<b>সাধারণ knowledge curiosity:</b> Perplexity free tier-ই যথেষ্ট',
          '<b>Business analyst:</b> Perplexity (market data)',
        ],
      },
      {
        h2: 'Perplexity-র বিশেষ ফিচার যা অনেকে জানেন না',
        list: [
          '<b>Spaces:</b> নির্দিষ্ট topic-এর জন্য কাস্টম assistant; specific source-এ search করতে বলা যায়',
          '<b>Academic Focus:</b> শুধু scholarly source থেকে',
          '<b>Reddit Focus:</b> Reddit threads থেকে',
          '<b>Page generation:</b> Topic দিলে complete article সব citation সহ',
          '<b>File upload:</b> PDF/image upload করে প্রশ্ন',
          '<b>Voice answer:</b> Audio response',
        ],
      },
      {
        h2: 'বাংলায় কতটা ভালো?',
        paragraphs: [
          'দুটোই বাংলা-তে কাজ করে, কিন্তু:',
        ],
        list: [
          '<b>Perplexity:</b> বাংলায় প্রশ্ন → answer বাংলায়, কিন্তু sources প্রায়ই ইংরেজি (BD-এর বাংলা site কম index-এ)',
          '<b>ChatGPT:</b> বাংলায় সাবলীল উত্তর, কিন্তু source verification নেই',
          '<b>সর্বোত্তম:</b> বাংলায় প্রশ্ন করুন, ইংরেজিতে answer চাইলে specify করুন — দুটোই সক্ষম',
        ],
      },
      {
        h2: 'বাংলাদেশ থেকে অ্যাক্সেস',
        list: [
          'দুটোই VPN ছাড়া কাজ করে',
          'Perplexity signup: Google login (সহজ)',
          'Payment: International card দরকার (দারাজ virtual card কাজ করে)',
          'Perplexity Pro মাঝে মাঝে discount দেয় (annual plan $২০০ থেকে $১২০)',
        ],
      },
      {
        h2: 'উপসংহার',
        paragraphs: [
          'Perplexity এবং ChatGPT প্রতিদ্বন্দ্বী নয় — সহযোগী। একটি research-এর জন্য, অন্যটি creation-এর জন্য। আজকের একটি research task নিন — Perplexity-তে চেষ্টা করুন; পরের creative writing — ChatGPT-তে। তিন দিনের মধ্যে workflow ঠিক হবে। দুটো tool master করলে আপনি একজন researcher-content creator-এর সর্বোচ্চ productivity পাবেন।',
        ],
      },
    ],
    related: [
      { href: '/perplexity-ai/', label: 'Perplexity AI টুল পেজ' },
      { href: '/blog/perplexity-ai-bangla-guide/', label: 'Perplexity AI বাংলা গাইড' },
      { href: '/chatgpt/', label: 'ChatGPT' },
      { href: '/blog/claude-vs-chatgpt-bangladeshe-konti-bhalo/', label: 'Claude vs ChatGPT' },
    ],
  },
];
