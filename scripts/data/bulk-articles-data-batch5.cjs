/* Batch 5 — 20 articles: BD professions, Bangla utilities, emerging concepts (2026-05-26) */

module.exports = [
  // 1
  {
    slug: 'ai-diye-banker-financial-analyst-bangladesh',
    title: 'AI দিয়ে Banker ও Financial Analyst — বাংলাদেশি ব্যাংকারদের জন্য গাইড',
    description: 'বাংলাদেশের ব্যাংক, NBFI ও financial analyst-দের জন্য AI কীভাবে credit analysis, risk modeling, customer service ও compliance-এ সাহায্য করতে পারে — practical workflow।',
    keywords: 'AI banking bangladesh, banker AI tool, financial analyst AI, credit risk AI, AI fintech bangla',
    sections: [
      {
        h2: 'ভূমিকা',
        paragraphs: [
          'বাংলাদেশের ব্যাংকিং খাত — ৬১টি ব্যাংক + ৩৪টি NBFI। প্রতিদিন হাজারো credit application, KYC, compliance report। AI এই workload-এর ৪০-৬০% দ্রুত করতে পারে — accuracy compromise না করে।',
        ],
      },
      {
        h2: '১. Credit application analysis',
        list: [
          '<b>Document extraction:</b> ChatGPT/Claude-এ borrower-এর tax return, financial statement upload → key ratios auto-extract',
          '<b>Red flag detection:</b> "এই three years statement-এ unusual pattern চিহ্নিত করো"',
          '<b>Cross-reference:</b> Multiple bureau report compare',
          '<b>Drafting:</b> Credit memo first draft generate',
        ],
      },
      {
        h2: '২. Risk modeling',
        list: [
          '<b>Scenario analysis:</b> ChatGPT Code Interpreter-এ historical data → stress test',
          '<b>Default prediction:</b> Excel + AI formula assist',
          '<b>Sector exposure:</b> "RMG sector exposure এর top risks list"',
          '<b>Compliance:</b> Basel III, IFRS 9 reference + Q&A',
        ],
      },
      {
        h2: '৩. Customer service',
        list: [
          '<b>Bangla chatbot:</b> WhatsApp/Messenger-এ account balance, statement query',
          '<b>Email reply draft:</b> Customer complaint → professional Bangla response',
          '<b>FAQ automation:</b> branch hours, interest rates, product info',
          '<b>Sentiment analysis:</b> negative reviews early detection',
        ],
      },
      {
        h2: '৪. Compliance + AML',
        list: [
          '<b>Transaction monitoring narrative:</b> SAR draft assist',
          '<b>BFIU report:</b> structured data → narrative',
          '<b>Policy update summary:</b> central bank circular → 1-page brief',
          '<b>Internal training:</b> AI quiz module for staff',
        ],
      },
      {
        h2: '৫. Investment analyst use cases',
        list: [
          '<b>Earnings call summary:</b> 30-page transcript → 1-page brief',
          '<b>Sector report writing:</b> raw data → investment thesis',
          '<b>Comparable analysis:</b> multiple companies side-by-side',
          '<b>Market commentary:</b> daily update draft',
        ],
      },
      {
        h2: '৬. Practical AI tools stack',
        list: [
          '<b>Document analysis:</b> Claude (long PDF best)',
          '<b>Data analysis:</b> ChatGPT Code Interpreter',
          '<b>Email/communication:</b> ChatGPT/Gemini',
          '<b>Research:</b> Perplexity (citations)',
          '<b>Excel automation:</b> Copilot in Excel',
          '<b>Meeting transcription:</b> Otter (English), Notta (limited Bangla)',
        ],
      },
      {
        h2: '৭. Confidentiality + regulatory',
        list: [
          'Customer data NEVER paste into public AI',
          'Anonymize first (replace names with PERSON_1)',
          'On-premise/private deployment for sensitive: Bangladesh Bank requires',
          'Audit trail: AI suggestion logged',
          'Final decision: human banker — AI is assistant only',
        ],
      },
      {
        h2: '৮. Career edge — AI-skilled banker',
        list: [
          'CV-তে "AI-augmented credit analysis" highlight',
          'Internal training session conduct',
          'Process improvement project lead',
          'Promotion fast-track in banks adopting AI',
        ],
      },
      {
        h2: 'উপসংহার',
        paragraphs: [
          'বাংলাদেশের ব্যাংকিং খাত এখনো AI adoption-এ আস্তে। যে banker আজ AI workflow build করছেন, ৩-৫ বছরে তিনি analyst-vault leader। শুরু করুন এক spreadsheet automation দিয়ে, পরে scale।',
        ],
      },
    ],
    related: [
      { href: '/blog/ai-diye-accounting-bookkeeping-bangla-guide/', label: 'AI Accounting' },
      { href: '/blog/ai-diye-dse-stock-market-research-bangla-guide/', label: 'DSE Stock Research' },
      { href: '/blog/ai-diye-excel-kaj-bangla-guide/', label: 'AI Excel' },
      { href: '/microsoft-copilot/', label: 'Microsoft Copilot' },
    ],
  },

  // 2
  {
    slug: 'ai-diye-police-investigation-bangla',
    title: 'AI দিয়ে Police ও Law Enforcement — বাংলাদেশের জন্য Practical গাইড',
    description: 'বাংলাদেশের পুলিশ, RAB ও law enforcement-এ AI কীভাবে investigation report, evidence analysis, intelligence gathering-এ সাহায্য করতে পারে — practical use + ethical limits।',
    keywords: 'AI police bangladesh, law enforcement AI, investigation AI bangla, evidence analysis AI, police report AI',
    sections: [
      {
        h2: 'ভূমিকা',
        paragraphs: [
          'বাংলাদেশের পুলিশের কাজে document-heavy বহু process — GD, FIR, charge sheet, witness statement, court submission। AI এই administrative burden ৫০% কমাতে পারে, যাতে অফিসাররা actual investigation-এ বেশি সময় দিতে পারেন।',
        ],
      },
      {
        h2: '১. Report writing automation',
        list: [
          'Witness statement audio → AI transcription → Bangla report',
          'Incident notes → structured FIR draft',
          'Court submission narrative — formal Bangla',
          'Daily duty report summary',
          'Multi-witness statement compare → contradictions',
        ],
      },
      {
        h2: '২. Evidence analysis assist',
        list: [
          'Phone call log analysis (pattern, anomaly)',
          'Bank statement: transaction pattern, suspicious flows',
          'Social media: public post sentiment, network mapping',
          'Photo analysis: object recognition, timestamp verify',
          'Document forensics: signature mismatch detection',
        ],
      },
      {
        h2: '৩. Intelligence gathering',
        list: [
          'Open-source intelligence (OSINT) compile',
          'News aggregation: relevant case-related',
          'Translation: foreign language witness/document',
          'Cross-reference: multiple databases',
          'Pattern recognition: similar crime modus operandi',
        ],
      },
      {
        h2: '৪. Community policing',
        list: [
          'Bangla chatbot: citizen FAQ (process, station info)',
          'Social media engagement: community announcements',
          'Multi-language: foreign worker query',
          'Anonymous tip routing',
        ],
      },
      {
        h2: '৫. Training material',
        list: [
          'New recruit Q&A practice',
          'Case study summarization',
          'SOP quick reference',
          'Legal section quick lookup',
        ],
      },
      {
        h2: 'গুরুত্বপূর্ণ সতর্কতা ও সীমা',
        list: [
          'Confidential case info — public AI-তে কখনো না',
          'On-premise/government-cloud only sensitive data',
          'Bias: AI training-এ Western data — local context careful',
          'No autonomous decision: AI = assist, officer = decide',
          'Evidence chain: AI-processed data court-এ admissible কিনা — legal review',
          'Privacy: warrant ছাড়া surveillance illegal',
          'Citizen rights: AI-er ভুল-এ liability',
        ],
      },
      {
        h2: '৬. Practical workflow — daily case officer',
        list: [
          'সকাল: AI summary daily news + relevant cases',
          'Mid-day: witness statement record → AI Bangla transcript',
          'Lunch: FIR draft, supervisor review',
          'Bikal: Court submission narrative',
          'Sandhya: Daily report → AI compile',
        ],
      },
      {
        h2: '৭. Tools — what works for BD context',
        list: [
          '<b>Voice transcription:</b> Whisper (offline option), Otter.ai',
          '<b>Document analysis:</b> Claude (long form best)',
          '<b>Translation:</b> Google Translate + Claude verify',
          '<b>Photo:</b> Google Lens, ChatGPT vision',
          '<b>Drafting:</b> Bangla template + ChatGPT customize',
        ],
      },
      {
        h2: 'উপসংহার',
        paragraphs: [
          'বাংলাদেশের police force ১.২ লক্ষ+ অফিসার। প্রত্যেকে দৈনিক ১ ঘণ্টা administrative time বাঁচালে — collective ১.২ লক্ষ ঘণ্টা actual policing-এ যাবে। AI এই transformation-এর অস্ত্র — অফিসারদের প্রতিদ্বন্দ্বী নয়।',
        ],
      },
    ],
    related: [
      { href: '/blog/ai-diye-law-firm-legal-research-bangla-bangladesh/', label: 'AI Law Firm' },
      { href: '/blog/ai-diye-news-article-rewrite-bangla-guide/', label: 'News Rewrite' },
      { href: '/blog/whisper-ai-bangla-transcription-guide/', label: 'Whisper Transcription' },
      { href: '/claude/', label: 'Claude' },
    ],
  },

  // 3
  {
    slug: 'ai-diye-ngo-grant-writing-bangla',
    title: 'AI দিয়ে NGO ও Grant Writing — বাংলাদেশি NGO-দের জন্য সম্পূর্ণ গাইড',
    description: 'বাংলাদেশের NGO/CSO কীভাবে AI দিয়ে grant proposal লেখা, donor report, M&E, beneficiary stories তৈরি করতে পারে — proven workflow + template।',
    keywords: 'AI grant writing, NGO AI bangladesh, donor proposal AI, BRAC NGO AI, grant proposal template, AI fundraising',
    sections: [
      {
        h2: 'ভূমিকা',
        paragraphs: [
          'বাংলাদেশে ২০,০০০+ NGO — থেকে BRAC, ASA-র মতো giant, ছোট community organization পর্যন্ত। প্রত্যেকের লড়াই: ভালো proposal লেখা, donor report time-এ submit করা, beneficiary impact story collect করা।',
          'AI এই কাজের ৬০-৭০% দ্রুত করতে পারে — quality compromise না করে।',
        ],
      },
      {
        h2: '১. Grant proposal writing',
        list: [
          '<b>Concept note draft:</b> ChatGPT/Claude with master prompt — problem, solution, target, budget, M&E',
          '<b>Donor-specific tailoring:</b> "USAID format" vs "EU format" — AI structures',
          '<b>Theory of Change:</b> visual + narrative',
          '<b>Logical Framework (Logframe):</b> activities → outputs → outcomes → impact',
          '<b>Budget narrative:</b> line items justify',
        ],
      },
      {
        h2: '২. Master prompt — concept note',
        list: [
          '"Write a 2-page concept note for [donor] on [problem] in Bangladesh. Target: [population]. Budget: [\$X]. Duration: [Y months].<br>Include: Problem statement with stats, Proposed intervention (3 pillars), Expected outcomes (SMART), Budget breakdown, M&E framework, Sustainability plan, Why our organization. Tone: professional, evidence-based, urgent."',
        ],
      },
      {
        h2: '৩. Donor report automation',
        list: [
          'Quarterly report: activity log → narrative report',
          'Impact story: beneficiary quote + photo → 300-word story',
          'Financial narrative: spreadsheet → explanation',
          'Variance analysis: budget vs actual → reason',
          'Lesson learned: AI synthesize team notes',
        ],
      },
      {
        h2: '৪. M&E (Monitoring & Evaluation)',
        list: [
          'Survey design: indicators → questionnaire',
          'Survey analysis: responses → insights',
          'Baseline/endline comparison: AI synthesize',
          'Visual: AI suggest chart/infographic',
          'Outcome harvesting: stories → patterns',
        ],
      },
      {
        h2: '৫. Beneficiary stories — heart of NGO',
        list: [
          'Interview transcription: voice → Bangla text',
          'Bangla story writing: facts → narrative',
          'Photo selection AI: best image suggest',
          'Translation: Bangla story → English for international donor',
          'Sensitivity: AI সাহায্য, কিন্তু human verify before publish',
        ],
      },
      {
        h2: '৬. Multi-stakeholder communication',
        list: [
          'Government letter: formal Bangla',
          'Donor email: professional English',
          'Community notice: simple Bangla',
          'Press release: news-style',
          'Social media: engaging',
        ],
      },
      {
        h2: '৭. NGO-specific tool stack',
        list: [
          'Claude Pro: long proposal (best long-form)',
          'ChatGPT Plus: variety, fast',
          'Notion AI: project management + writing',
          'Otter.ai: meeting notes',
          'Canva AI: visual reports, infographics',
          'Gamma: presentation decks',
        ],
      },
      {
        h2: '৮. সতর্কতা',
        list: [
          'Beneficiary identification: AI-তে names/photos কখনো না',
          'Donor confidentiality: NDA respect',
          'Fact accuracy: AI hallucinate statistics — verify',
          'Cultural sensitivity: BD context AI miss করতে পারে',
          'Original work: heavy AI-use disclose appropriate',
        ],
      },
      {
        h2: 'উপসংহার',
        paragraphs: [
          'বাংলাদেশি NGO-দের impact ১০× বাড়াতে পারে — যদি admin time কমে, field time বাড়ে। AI সেই tradeoff সম্ভব করছে। আজকেই একটি grant proposal AI-assisted draft করে দেখুন — সময় ৫০%+ কমবে।',
        ],
      },
    ],
    related: [
      { href: '/blog/ai-diye-quotation-proposal-bangla-guide/', label: 'AI Proposal গাইড' },
      { href: '/blog/ai-diye-content-writing-banglay-shikhun/', label: 'Content Writing' },
      { href: '/claude/', label: 'Claude' },
      { href: '/gamma/', label: 'Gamma AI' },
    ],
  },

  // 4
  {
    slug: 'ai-diye-civil-engineer-construction-bangladesh',
    title: 'AI দিয়ে Civil Engineer ও Construction — বাংলাদেশি Engineer-দের গাইড',
    description: 'বাংলাদেশের civil engineer, contractor ও construction professional-দের জন্য AI — design, estimation, project management, code compliance — practical use cases।',
    keywords: 'AI civil engineer, construction AI bangladesh, BIM AI, structural AI, AI estimation, engineer productivity',
    sections: [
      {
        h2: 'ভূমিকা',
        paragraphs: [
          'বাংলাদেশের construction industry $30B+, civil engineer-এর কাজে — design, calculation, drawing, estimation, site management — সব time-intensive। AI এই কাজের ৩০-৫০% accelerate করতে পারে।',
        ],
      },
      {
        h2: '১. Design + calculation',
        list: [
          '<b>Beam/column sizing:</b> ChatGPT Code Interpreter — load → dimension',
          '<b>Foundation type recommendation:</b> soil report → foundation suggest',
          '<b>BNBC code lookup:</b> "BNBC 2020 minimum reinforcement for slab" — instant',
          '<b>Structural calculation verify:</b> manual calc + AI cross-check',
          '<b>Material optimization:</b> reduce wastage scenarios',
        ],
      },
      {
        h2: '২. Drawing + BIM',
        list: [
          '<b>AutoCAD plugins:</b> AI auto-layout, annotation',
          '<b>Revit AI:</b> family parameter, schedule auto-fill',
          '<b>Sketch to plan:</b> hand-drawn → digital (Photo to CAD apps)',
          '<b>Detail drawing:</b> typical detail generate from spec',
          '<b>Clash detection AI:</b> MEP + structural conflict identify',
        ],
      },
      {
        h2: '৩. Bill of Quantities (BoQ) + estimation',
        list: [
          'Excel + ChatGPT: schedule → BoQ',
          'Rate analysis automation',
          'Quotation comparison: 5 vendor → analysis',
          'Cost escalation projection',
          'Quantity takeoff from drawing (PlanGrid, AI tools)',
        ],
      },
      {
        h2: '৪. Project management',
        list: [
          'Gantt chart: tasks → AI sequence + dependencies',
          'Critical path identification',
          'Daily progress report: site notes → formal report',
          'Subcontractor management',
          'Material procurement timeline',
        ],
      },
      {
        h2: '৫. Code compliance — BNBC, RAJUK',
        list: [
          'BNBC 2020 reference Q&A',
          'RAJUK approval checklist',
          'Fire safety code lookup',
          'Setback calculation',
          'FAR/MGC calculation',
        ],
      },
      {
        h2: '৬. Quality control + safety',
        list: [
          'Concrete test result analysis',
          'Photo-based defect detection (apps)',
          'Safety incident report draft',
          'Toolbox talk Bangla preparation',
          'Site inspection checklist',
        ],
      },
      {
        h2: '৭. Client communication',
        list: [
          'Progress photo + AI caption',
          'Variation order justification',
          'EOT (extension of time) narrative',
          'Final account narrative',
          'Bangla → English client report',
        ],
      },
      {
        h2: '৮. Continuous learning',
        list: [
          'New code update summary',
          'Case study (failure analysis)',
          'Best practice from international project',
          'Software tutorial (Revit, ETABS, SAP2000)',
        ],
      },
      {
        h2: 'Tools — civil engineer-এর জন্য',
        list: [
          'ChatGPT Plus: general + calculation',
          'Claude Pro: long technical document',
          'AutoCAD AI plugins (newer versions)',
          'Revit Insight + Forma',
          'PlanRadar: site management AI',
          'ALICE Technologies: scheduling AI',
        ],
      },
      {
        h2: 'উপসংহার',
        paragraphs: [
          'AI কখনো structural engineer-এর প্রতিদ্বন্দ্বী হবে না — কিন্তু AI-equipped engineer যারা না, তাদের সরিয়ে দেবে। আপনার আজকের একটি repetitive task নিন (যেমন BoQ), AI দিয়ে করে দেখুন। প্রথম দিনেই ১-২ ঘণ্টা সাশ্রয়।',
        ],
      },
    ],
    related: [
      { href: '/blog/ai-diye-excel-kaj-bangla-guide/', label: 'AI Excel' },
      { href: '/blog/ai-diye-quotation-proposal-bangla-guide/', label: 'AI Proposal' },
      { href: '/chatgpt/', label: 'ChatGPT' },
      { href: '/claude/', label: 'Claude' },
    ],
  },

  // 5
  {
    slug: 'ai-diye-journalist-news-writer-bangla',
    title: 'AI দিয়ে Journalist ও News Writer — বাংলাদেশি সাংবাদিকদের গাইড',
    description: 'বাংলাদেশের সাংবাদিক, news anchor, editor-দের জন্য AI workflow — research, transcription, translation, fact-checking, headline, social media — ethical guidelines সহ।',
    keywords: 'AI journalism bangla, sangbadik AI, news writer AI, AI news, journalism AI bangladesh, news production AI',
    sections: [
      {
        h2: 'ভূমিকা',
        paragraphs: [
          'বাংলাদেশের ২০০+ daily newspaper, ৪০+ TV channel, হাজারো online portal — দৈনিক হাজারো news produce। AI সাংবাদিকতাকে replace করছে না, কিন্তু production speed ১০× করছে।',
        ],
      },
      {
        h2: '১. Story research + lead generation',
        list: [
          'Perplexity: deep research with citation',
          'Google Alert + AI summary daily digest',
          'Trending topic detection',
          'Source contact list (public)',
          'Background briefing dossier',
        ],
      },
      {
        h2: '২. Interview workflow',
        list: [
          'Recording → Whisper Bangla transcription',
          'Multi-language interview: AI translate',
          'Question preparation: AI suggest follow-ups',
          'Post-interview: AI synthesize key quotes',
          'Time-stamp generation for video',
        ],
      },
      {
        h2: '৩. News writing',
        list: [
          'Inverted pyramid structure: AI follows',
          '5W1H verification',
          'Quote integration',
          'Bilingual writing (Bangla + English)',
          'Style adherence (publication-specific)',
        ],
      },
      {
        h2: '৪. Headline + SEO',
        list: [
          '"5 click-worthy variants" prompt',
          'Bangla SEO keyword integration',
          'Social media-optimized version',
          'A/B test concept',
          'Length-specific (homepage, social, push)',
        ],
      },
      {
        h2: '৫. Fact-checking',
        list: [
          'Cross-reference 2-3 source minimum',
          'Date verification',
          'Quote authenticity',
          'Statistics validate',
          '<b>AI limitation:</b> hallucinate — verify with primary source',
        ],
      },
      {
        h2: '৬. Translation + localization',
        list: [
          'Foreign news → Bangla',
          'Bangla news → English (international audience)',
          'Quote translation maintain original meaning',
          'Cultural context add for local relevance',
        ],
      },
      {
        h2: '৭. Multimedia + distribution',
        list: [
          'Social media post auto-generate',
          'Newsletter summary daily',
          'YouTube description + tags',
          'Podcast show notes',
          'Twitter/X thread breakdown',
        ],
      },
      {
        h2: '৮. Ethical guidelines',
        list: [
          'AI-assisted ≠ AI-written — disclose when significant',
          'Source confidentiality — never expose in AI',
          'Photo provenance: AI-generated label clearly',
          'No AI fabrication of quotes',
          'Editorial judgment: AI never decides',
          'Bias check: AI mirrors training data bias',
        ],
      },
      {
        h2: 'BD context — local outlets',
        list: [
          'Prothom Alo, Daily Star — AI standards emerging',
          'New digital outlets — AI native',
          'Press Council BD guidelines (developing)',
          'Defamation law: AI-generated content liability question',
        ],
      },
      {
        h2: 'Tools stack',
        list: [
          'Perplexity Pro: research + citation',
          'Claude: long-form writing',
          'Whisper: Bangla transcription',
          'Grammarly: edit',
          'Otter: meeting/interview',
          'Canva: graphics',
          'Buffer: scheduling',
        ],
      },
      {
        h2: 'উপসংহার',
        paragraphs: [
          'সাংবাদিকতা মানে truth-telling — AI এই mission-কে scale করতে পারে যদি ethically ব্যবহৃত হয়। আপনার আজকের একটি interview transcription Whisper দিয়ে করুন, পরের article একটি সাবধানে AI-edit করুন। Productivity-এ পার্থক্য দেখবেন।',
        ],
      },
    ],
    related: [
      { href: '/blog/ai-diye-news-article-rewrite-bangla-guide/', label: 'News Rewrite' },
      { href: '/blog/whisper-ai-bangla-transcription-guide/', label: 'Whisper Transcription' },
      { href: '/perplexity-ai/', label: 'Perplexity' },
      { href: '/blog/ai-content-detector-bangla-bachte-paren-ki/', label: 'AI Detector' },
    ],
  },

  // 6
  {
    slug: 'ai-diye-bangla-typing-autocorrect-guide',
    title: 'AI দিয়ে Bangla Typing ও Autocorrect — দ্রুত নির্ভুল লেখার গাইড',
    description: 'AI দিয়ে কীভাবে বাংলা টাইপিং দ্রুত ও নির্ভুল করবেন? Avro, Bijoy, voice input, autocorrect, ChatGPT-এ বানান সংশোধন — practical workflow।',
    keywords: 'Bangla typing AI, bangla autocorrect, bangla voice typing, avro AI, bangla spelling check, bangla input',
    sections: [
      {
        h2: 'ভূমিকা',
        paragraphs: [
          'বাংলা টাইপিং — অনেকের কাছে এখনো ভোগান্তি। যুক্তাক্ষর, ণ-ন, শ-ষ-স — ভুল হয়েই থাকে। AI এই সমস্যা সমাধানে ৫টি উপায়ে সাহায্য করছে।',
        ],
      },
      {
        h2: '১. Voice input — সবচেয়ে দ্রুত',
        list: [
          '<b>Google Voice Typing:</b> Gboard-এ Bangla — accuracy ৯৫%+',
          '<b>Speech-to-text apps:</b> Mobile native',
          '<b>ChatGPT voice:</b> বাংলা বুঝে → text output',
          'Practice: ছোট sentence থেকে শুরু',
          'Background noise কম রাখুন',
        ],
      },
      {
        h2: '২. Avro Phonetic + autocorrect',
        list: [
          '<b>Avro Keyboard:</b> "ami" → "আমি" — phonetic',
          '<b>Word suggestion:</b> Avro built-in',
          '<b>Custom dictionary:</b> নিজের শব্দ add',
          '<b>Mobile:</b> Ridmik Keyboard',
          '<b>Tips:</b> শব্দ শেষে space দিন',
        ],
      },
      {
        h2: '৩. AI বানান সংশোধন',
        paragraphs: [
          'ChatGPT/Claude-এ master prompt:',
        ],
        list: [
          '"Correct any spelling and grammar errors in this Bangla text. Preserve the meaning and style. Output only the corrected version: [paste]"',
        ],
      },
      {
        h2: '৪. Handwriting → Digital',
        list: [
          'Google Lens: handwritten Bangla photo → text',
          'OCR apps: text extract',
          'AI cleanup: extracted text fix',
          'Daily journal digitize',
          'Old documents preservation',
        ],
      },
      {
        h2: '৫. Real-time correction তোলকাকাজে',
        list: [
          'Bornoful Spell Checker',
          'Google Docs Bangla spell check',
          'Microsoft Word Bangla dictionary',
          'Grammarly বাংলায় limited',
          'AI: most flexible',
        ],
      },
      {
        h2: '৬. সাধারণ ভুল ও AI সমাধান',
        list: [
          'ণ vs ন: AI rule-based correct',
          'শ vs ষ vs স: context-based',
          'যুক্তাক্ষর: AI auto-form',
          'কার চিহ্ন: position সঠিক',
          'বানান (one word vs two): context',
        ],
      },
      {
        h2: '৭. Workflow — দৈনিক Bangla writing',
        list: [
          'Voice typing (Gboard) → quick draft',
          'Avro keyboard → manual edit',
          'AI পাস করানো → spelling + grammar',
          'Final review → publish',
          '<b>Time saved:</b> typing time 50% reduction',
        ],
      },
      {
        h2: '৮. Tools comparison',
        list: [
          '<b>Avro:</b> ফ্রি, classic, desktop best',
          '<b>Ridmik:</b> mobile most popular',
          '<b>Gboard Bangla:</b> Google-backed, voice good',
          '<b>UniBijoy:</b> traditional, government use',
          '<b>SwiftKey Bangla:</b> AI suggestion',
        ],
      },
      {
        h2: 'উপসংহার',
        paragraphs: [
          'বাংলা typing-এ AI revolution এসেছে — voice + autocorrect দুটো combined ৭০% time save। যিনি দৈনিক ১,০০০+ শব্দ Bangla লেখেন, তিনি AI workflow adopt না করলে কাজ ৩x slow। আজকেই Gboard voice typing দিয়ে এক paragraph try করুন।',
        ],
      },
    ],
    related: [
      { href: '/blog/ai-diye-bangla-likha-improve-guide/', label: 'Bangla Writing Improve' },
      { href: '/blog/ai-diye-content-writing-banglay-shikhun/', label: 'AI Content Writing' },
      { href: '/chatgpt/', label: 'ChatGPT' },
      { href: '/grammarly-er-bikalpo/', label: 'Grammarly বিকল্প' },
    ],
  },

  // 7
  {
    slug: 'ai-diye-bangla-audio-text-transcription',
    title: 'AI দিয়ে Bangla Audio থেকে Text — সম্পূর্ণ Transcription গাইড',
    description: 'Bangla audio/recording থেকে কীভাবে AI দিয়ে accurate text পাবেন? Whisper, Otter, Notta, Google AI — tools comparison + practical workflow।',
    keywords: 'bangla audio to text, bangla transcription AI, Whisper bangla, audio text bangla, Otter bangla, voice to text',
    sections: [
      {
        h2: 'ভূমিকা',
        paragraphs: [
          'Interview, lecture, meeting, voice note — বাংলা audio-কে text-এ রূপান্তর করা এক সময় ঘণ্টার পর ঘণ্টা manual transcription। এখন AI ৫ মিনিটে একই কাজ করছে — accuracy ৯০%+।',
        ],
      },
      {
        h2: '১. OpenAI Whisper — সেরা ফ্রি option',
        list: [
          'বাংলা support: native',
          'Accuracy: ৯০-৯৫% clear audio-এ',
          'Free open-source — local install',
          'Cloud API: $0.006/minute',
          'Multiple model size — accuracy vs speed',
          'Output: SRT, VTT, plain text, JSON',
        ],
      },
      {
        h2: '২. Whisper কীভাবে ব্যবহার করবেন',
        list: [
          '<b>OpenAI Playground:</b> openai.com/whisper — API access',
          '<b>Hugging Face:</b> huggingface.co/openai/whisper-large-v3 — try free',
          '<b>Local install:</b> Python + pip install openai-whisper',
          '<b>Mobile apps:</b> WhisperBoard, AudioPen — wrap Whisper',
          '<b>Desktop apps:</b> MacWhisper, Whisper Transcription',
        ],
      },
      {
        h2: '৩. Other Bangla transcription tools',
        list: [
          '<b>Notta.ai:</b> Bangla support, 120-minute free',
          '<b>Otter.ai:</b> English-best, Bangla limited',
          '<b>Google Cloud Speech:</b> Bangla bn-BD native',
          '<b>Azure Speech:</b> Bangla supported',
          '<b>Sonix:</b> $10/hour, Bangla supported',
          '<b>Trint:</b> good accuracy',
        ],
      },
      {
        h2: '৪. Quality factors',
        list: [
          'Audio clarity: noise কম → accuracy বেশি',
          'Speaker count: one-speaker easiest',
          'Accent: standard Bangla > regional',
          'Speed: normal pace best',
          'Background music: avoid',
          'Mic quality: USB mic > phone speaker',
        ],
      },
      {
        h2: '৫. Workflow — interview transcription',
        list: [
          'Recording: phone voice recorder/USB mic',
          'Upload to Whisper (Hugging Face or paid)',
          'Receive raw text + timestamp',
          'AI cleanup: ChatGPT "Fix grammar + add punctuation"',
          'Speaker labels: manual add',
          'Final edit: 15-20 minutes for 1-hour audio',
        ],
      },
      {
        h2: '৬. Time + cost (1-hour Bangla audio)',
        list: [
          '<b>Manual:</b> 4-6 hours ($30-60 freelance)',
          '<b>Whisper local:</b> 5-15 min ($0)',
          '<b>Whisper API:</b> ~$0.36 ($0)',
          '<b>Notta/Otter:</b> Free-$8',
          '<b>Total time saved:</b> 90%+',
        ],
      },
      {
        h2: '৭. Common ভুল + ঠিক',
        list: [
          'Background noise → noise reduction first (Audacity)',
          'Multiple speakers overlap → cleanup post-AI',
          'Foreign words (English mixed) → Whisper handles well',
          'Technical jargon → custom vocabulary',
          'Long audio (>2 hours) → split into chunks',
        ],
      },
      {
        h2: '৮. Use cases',
        list: [
          'Journalist: interview',
          'Researcher: focus group',
          'Doctor: patient consultation note',
          'Lawyer: deposition',
          'Student: lecture',
          'Podcaster: episode',
          'YouTuber: subtitle generation',
        ],
      },
      {
        h2: 'উপসংহার',
        paragraphs: [
          'Bangla transcription আর "expensive" না — Whisper local free দিয়ে আজকেই unlimited transcription সম্ভব। ১-ঘণ্টা lecture যা ৪ ঘণ্টা type করতে হত, এখন ১৫ মিনিটে। সাংবাদিক, ছাত্র, গবেষক — সবার toolkit-এ Whisper অপরিহার্য।',
        ],
      },
    ],
    related: [
      { href: '/blog/whisper-ai-bangla-transcription-guide/', label: 'Whisper Deep Guide' },
      { href: '/blog/ai-bangla-voice-over-tts-guide/', label: 'Bangla Voice Over' },
      { href: '/otter-ai/', label: 'Otter AI' },
      { href: '/blog/otter-ai-bangla-meeting-transcript-guide/', label: 'Otter গাইড' },
    ],
  },

  // 8
  {
    slug: 'ai-diye-bangla-subtitle-caption-generate',
    title: 'AI দিয়ে Bangla Subtitle ও Caption — YouTube/Reel-এর জন্য গাইড',
    description: 'AI দিয়ে কীভাবে YouTube ভিডিও বা Reel-এ Bangla subtitle/caption auto-generate করবেন? CapCut, Whisper, Kapwing — সবচেয়ে accurate পদ্ধতি।',
    keywords: 'bangla subtitle AI, bangla caption auto, YouTube bangla subtitle, CapCut caption, video subtitle AI',
    sections: [
      {
        h2: 'ভূমিকা',
        paragraphs: [
          'YouTube ভিডিও বা Instagram Reel-এ Bangla caption — viewer engagement ৪০%+ বাড়ায়, accessibility বাড়ায়, এবং SEO boost করে। Manual caption দিনে ১-২ ঘণ্টা। AI ৫ মিনিটে।',
        ],
      },
      {
        h2: '১. CapCut AI — সবচেয়ে easy',
        list: [
          'Video upload → Auto Captions → Bangla select',
          'Accuracy 90%+ standard',
          'Style customize: font, color, position, animation',
          'Free mobile + web',
          'Export embedded বা SRT separate',
        ],
      },
      {
        h2: '২. YouTube Studio built-in',
        list: [
          'Upload video → "Subtitles" tab',
          'YouTube auto-generates Bangla',
          'Manual edit interface',
          'Multiple language version possible',
          'Free',
        ],
      },
      {
        h2: '৩. Whisper-based tools',
        list: [
          'Most accurate Bangla',
          'Output SRT/VTT/SSA',
          'Kapwing.com — Whisper-powered web',
          'Veed.io — easy edit',
          'Subtitle Edit — free desktop software',
        ],
      },
      {
        h2: '৪. Quality + best practices',
        list: [
          'Sentence break per caption (3-5 second display)',
          'Max 2 line per caption',
          'Center-align readable',
          'Background blur/box for contrast',
          'Animation: simple fade — distracting না',
          'Hind Siliguri বা Mukti font',
        ],
      },
      {
        h2: '৫. Style examples — different platforms',
        list: [
          '<b>YouTube long-form:</b> bottom center, white + black outline',
          '<b>Shorts/Reels:</b> middle-center, large bold, animated',
          '<b>TikTok:</b> trending style — colored, dynamic',
          '<b>Facebook video:</b> auto-play sound off — caption essential',
          '<b>LinkedIn:</b> professional minimal',
        ],
      },
      {
        h2: '৬. Multi-language workflow',
        list: [
          'Bangla auto-caption from voice',
          'English translation auto (Whisper)',
          'Hindi version possible',
          'Upload all to YouTube — language selector',
          'Multi-region audience',
        ],
      },
      {
        h2: '৭. SEO + accessibility',
        list: [
          'YouTube algorithm captions পড়ে — discovery boost',
          'Visually-impaired accessibility',
          'Hearing-impaired inclusion',
          'Public transport silent watching',
          'Search engine indexing',
        ],
      },
      {
        h2: '৮. Common ভুল',
        list: [
          'No proofreading — AI ভুল publish',
          'Too fast (skipping reading)',
          'Bad timing (off-sync)',
          'Awkward line break mid-word',
          'Overlapping with on-screen text',
        ],
      },
      {
        h2: 'উপসংহার',
        paragraphs: [
          'Bangla caption আর "next priority" না — minimum requirement যেকোনো serious creator-এর জন্য। CapCut auto-caption দিয়ে আজকের একটি video-তে subtitle যোগ করুন। Engagement-এ পার্থক্য পরবর্তী week-এ দেখবেন।',
        ],
      },
    ],
    related: [
      { href: '/blog/capcut-ai-bangla-video-edit-tutorial/', label: 'CapCut AI' },
      { href: '/blog/ai-diye-youtube-shorts-viral-bangla-guide/', label: 'YouTube Shorts Viral' },
      { href: '/blog/ai-diye-bangla-audio-text-transcription/', label: 'Audio Transcription' },
      { href: '/blog/ai-diye-youtube-video-toiri-sompurno-guide/', label: 'AI YouTube ভিডিও' },
    ],
  },

  // 9
  {
    slug: 'ai-diye-bangla-handwriting-ocr-guide',
    title: 'AI দিয়ে হাতের লেখা Bangla → Digital Text — OCR সম্পূর্ণ গাইড',
    description: 'হাতে লেখা বাংলা document/note কীভাবে AI দিয়ে digital text-এ রূপান্তর করবেন? Google Lens, ChatGPT vision, Bangla OCR tools — practical workflow।',
    keywords: 'bangla OCR, handwriting bangla AI, bangla scan to text, Google Lens bangla, bangla digitize',
    sections: [
      {
        h2: 'ভূমিকা',
        paragraphs: [
          'হাতে লেখা বাংলা document — দাদুর recipe, ক্লাসের note, পুরোনো চিঠি — digital করা ছিল কঠিন। AI vision technology-এ এই কাজ এখন ৩০ সেকেন্ডে।',
        ],
      },
      {
        h2: '১. Google Lens — সবচেয়ে accessible',
        list: [
          'Google Lens অ্যাপ download',
          'Photo upload বা সরাসরি camera',
          'Bangla auto-detect',
          'Text copy করে paste',
          'মোবাইল-এ already installed (Android most)',
          'Accuracy: handwriting 70-85%, printed 95%+',
        ],
      },
      {
        h2: '২. ChatGPT Vision — context-aware',
        list: [
          'Image upload to ChatGPT',
          '"এই হাতে লেখা বাংলা text type করো" prompt',
          'Context understand: paragraph, list, table',
          'Misread word — context থেকে guess',
          'Free tier-এ daily limit',
        ],
      },
      {
        h2: '৩. Bangla-specific OCR tools',
        list: [
          '<b>NanoNets:</b> Bangla OCR API',
          '<b>ABBYY FineReader:</b> Bangla support, paid',
          '<b>i2OCR:</b> Free online, Bangla available',
          '<b>OCR.space:</b> Free API',
          '<b>Tesseract OSS:</b> Bangla trained data',
        ],
      },
      {
        h2: '৪. Workflow — পুরোনো book/note',
        list: [
          'Good lighting + flat surface',
          'Page-by-page photo (high resolution)',
          'Google Lens-এ scan',
          'Copy to ChatGPT for cleanup',
          'Verify against original',
          '১০০ pages = ১ ঘণ্টা work',
        ],
      },
      {
        h2: '৫. Use cases — practical',
        list: [
          'পুরোনো recipe বই digitize',
          'Class note → searchable PDF',
          'Hand-written letter → email',
          'Doctor prescription read (verify-able)',
          'Survey form data entry',
          'Historical document preserve',
        ],
      },
      {
        h2: '৬. Accuracy improve',
        list: [
          'High-resolution photo (12MP+)',
          'Even lighting (avoid shadow)',
          'Flat page (no curve)',
          'Plain background',
          'One column at a time',
          'Tilt-correction before OCR',
        ],
      },
      {
        h2: '৭. Multi-step cleanup',
        list: [
          'Step 1: Google Lens (raw extraction)',
          'Step 2: ChatGPT (grammar + punctuation)',
          'Step 3: Manual review (proper noun, technical term)',
          'Step 4: Format (paragraph, list, heading)',
          'Step 5: Save (Word/Markdown/HTML)',
        ],
      },
      {
        h2: '৮. Specific challenges (handwriting)',
        list: [
          'যুক্তাক্ষর recognize difficult',
          'কার চিহ্ন position confusion',
          'Different হস্তাক্ষর style',
          'Smudged ink — fail',
          'Old document fading',
          'Solution: multiple OCR run + best result',
        ],
      },
      {
        h2: 'উপসংহার',
        paragraphs: [
          'বাংলা OCR বিপ্লবে — যে document কখনো digitize হত না, এখন ৫ মিনিটে searchable। পরিবারের পুরোনো recipe বা চিঠি — এই সপ্তাহান্তে digitize শুরু করুন। heritage preserved + practically useful।',
        ],
      },
    ],
    related: [
      { href: '/blog/ai-diye-bangla-likha-improve-guide/', label: 'Bangla Writing Improve' },
      { href: '/blog/ai-diye-bangla-translation-konti-bhalo-comparison/', label: 'Bangla Translation' },
      { href: '/chatgpt/', label: 'ChatGPT (Vision)' },
      { href: '/blog/notebooklm-diye-porashona-students-bangla-guide/', label: 'NotebookLM' },
    ],
  },

  // 10
  {
    slug: 'perplexity-pages-bangla-guide',
    title: 'Perplexity Pages বাংলা গাইড — Research থেকে Publication ১ ক্লিকে',
    description: 'Perplexity Pages কী, কীভাবে ব্যবহার করবেন? Research query → ready-to-publish article — citation সহ। বাংলাদেশি researcher, blogger-দের জন্য সম্পূর্ণ গাইড।',
    keywords: 'Perplexity Pages, Perplexity new feature, AI research publishing, AI article generation, citation-based AI',
    sections: [
      {
        h2: 'ভূমিকা — Pages কী?',
        paragraphs: [
          'Perplexity Pages — Perplexity-এর সাম্প্রতিক flagship feature। Search query করেন → Perplexity citation সহ comprehensive article generate করে → publish-ready format।',
          'Blogger, researcher, journalist-দের জন্য এটি game-changer।',
        ],
      },
      {
        h2: 'কী আলাদা — normal Perplexity থেকে',
        list: [
          '<b>Normal:</b> Q&A, citation, conversational',
          '<b>Pages:</b> Long-form structured article (1500-3000 word), heading-organized, ready to share',
          '<b>URL:</b> Each Page গেছে unique URL — share + index possible',
          '<b>Visual:</b> Image + chart auto-embedded',
          '<b>Edit:</b> Inline edit + collaborate',
        ],
      },
      {
        h2: 'কীভাবে শুরু করবেন',
        list: [
          'perplexity.ai → Pages tab',
          '"Create Page" → topic enter',
          'AI 30-60 seconds-এ research + draft',
          'Edit/refine inline',
          'Publish (public) বা private',
          'Share via URL',
        ],
      },
      {
        h2: 'Bangla content — কেমন কাজ?',
        list: [
          'Bangla query accept',
          'Output: English default, Bangla request করতে হবে',
          'Citation: BD news outlets relatively underrepresented',
          'Translation possible — Bangla version generate',
          'BD-specific data: limited (English source bias)',
        ],
      },
      {
        h2: 'Use cases — Top 8',
        list: [
          '<b>Blogger:</b> trending topic → SEO article',
          '<b>Researcher:</b> literature review',
          '<b>Student:</b> assignment first draft',
          '<b>Journalist:</b> background brief',
          '<b>Marketer:</b> content idea exploration',
          '<b>Teacher:</b> class material',
          '<b>Investor:</b> stock/company research',
          '<b>Newsletter writer:</b> daily digest',
        ],
      },
      {
        h2: 'Citation quality — comparison',
        list: [
          'Perplexity strict: only credible source',
          'Wikipedia + news outlets + research paper',
          'ChatGPT: no citation (without browsing)',
          'Claude: no citation by default',
          'Best for: academic-style writing',
        ],
      },
      {
        h2: 'Edit workflow',
        list: [
          'Initial draft 70% usable',
          'Sections add/remove',
          'Personal voice inject',
          'BD context add (AI miss)',
          'Image swap to relevant',
          'Final review + publish',
        ],
      },
      {
        h2: 'Pricing',
        list: [
          'Free tier: limited Pages/day',
          'Pro ($20/মাস): unlimited Pages, GPT-4o/Claude in Pages',
          'Compared to ChatGPT Plus: similar cost, different strengths',
          'BD value: research-heavy users-এর জন্য worth',
        ],
      },
      {
        h2: 'উপসংহার',
        paragraphs: [
          'Perplexity Pages — research-driven content creator-দের অস্ত্র। Blog post, newsletter, research brief — যে কাজে citation matter, এই tool unmatched। ফ্রি tier-এ আজকের একটি topic-এ Page তৈরি করুন।',
        ],
      },
    ],
    related: [
      { href: '/perplexity-ai/', label: 'Perplexity' },
      { href: '/blog/perplexity-ai-bangla-guide/', label: 'Perplexity বাংলা গাইড' },
      { href: '/blog/perplexity-vs-chatgpt-bangla-research-konti-bhalo/', label: 'Perplexity vs ChatGPT' },
      { href: '/blog/ai-diye-blog-lekha-seo-friendly-article-ekti-sompurno-guide/', label: 'AI Blog Writing' },
    ],
  },

  // 11
  {
    slug: 'notebooklm-audio-overview-bangla-guide',
    title: 'NotebookLM Audio Overview বাংলা গাইড — পডকাস্ট-স্টাইল AI Discussion',
    description: 'NotebookLM-এর Audio Overview feature — যেকোনো document থেকে দুই-host পডকাস্ট-স্টাইল conversation। বাংলা সাপোর্ট, ব্যবহার, ও creative use cases।',
    keywords: 'NotebookLM audio overview, NotebookLM podcast, AI podcast generation, document to audio, study audio bangla',
    sections: [
      {
        h2: 'ভূমিকা',
        paragraphs: [
          'Google NotebookLM-এর Audio Overview — সবচেয়ে চমকপ্রদ AI features-এর একটি। যেকোনো PDF/document upload করলে, AI দুজন host-এর মধ্যে একটি ১০-১৫ মিনিটের পডকাস্ট-স্টাইল conversation তৈরি করে।',
        ],
      },
      {
        h2: 'কী আলাদা',
        list: [
          '<b>Two-voice dialogue:</b> male + female AI host',
          '<b>Natural conversation:</b> question, answer, joke, "wait what"',
          '<b>10-15 minute typical:</b> document length-অনুযায়ী',
          '<b>Listen anywhere:</b> car, gym, walk',
          '<b>Free:</b> NotebookLM free tier-এ',
        ],
      },
      {
        h2: 'কীভাবে বানাবেন',
        list: [
          'notebooklm.google.com → new notebook',
          'Sources upload: PDF, Google Doc, web URL, YouTube, audio',
          'Notebook open → "Audio Overview" generate',
          '5-10 minutes processing',
          'Listen + download MP3',
        ],
      },
      {
        h2: 'বাংলা support',
        list: [
          '২০২৫ এর শেষে Bangla beta এসেছে',
          'Bangla document upload → English audio (default)',
          'Bangla audio: limited countries',
          'BD থেকে: typically works after settings change',
          'Quality: English better than Bangla currently',
        ],
      },
      {
        h2: 'Creative use cases',
        list: [
          '<b>Student:</b> textbook chapter → audio lecture',
          '<b>Lawyer:</b> contract → audio brief on commute',
          '<b>Doctor:</b> research paper → audio while exercising',
          '<b>Business:</b> board minutes → audio recap',
          '<b>Author:</b> book outline → audio brainstorm',
          '<b>Teacher:</b> course material → audio for students',
          '<b>Journalist:</b> interview → audio summary',
        ],
      },
      {
        h2: 'Audio customization',
        list: [
          '"Focus on chapter 3" — narrow scope',
          '"Make it 5-minute" — shorter',
          '"More technical depth" — academic',
          '"Simpler language" — accessible',
          '"Include disagreement between hosts" — debate-like',
          'Custom instructions text box',
        ],
      },
      {
        h2: 'Quality tips',
        list: [
          'High-quality source = better audio',
          'Multiple sources = richer discussion',
          'PDF text-based (not scanned image) ideal',
          'Avoid super-niche jargon (AI may misuse)',
          'Length: 5-50 pages source optimal',
        ],
      },
      {
        h2: 'Use case — full workflow example',
        paragraphs: [
          'Scenario: BCS prospective candidate, "Bangladesh Liberation War" study।',
        ],
        list: [
          'NCTB Class IX history chapter PDF upload',
          'Add reference book chapter',
          'Generate Audio Overview',
          'Daily commute: 30 minutes listen',
          'Notes mentally + jot key points',
          'এক সপ্তাহে — pasive learning solid',
        ],
      },
      {
        h2: 'Limit + privacy',
        list: [
          'Free tier: limited Audio Overview/day',
          'Plus paid: more generation',
          'Privacy: documents private to your account',
          'Length max: ~15 minute typical',
          'Voice options: limited',
        ],
      },
      {
        h2: 'উপসংহার',
        paragraphs: [
          'Audio Overview — passive learning tool যা ভাষাবিজ্ঞানীরাও impressed। আপনার এই সপ্তাহের একটি কঠিন PDF কে audio convert করে commute-এ শুনুন। সময় ব্যয়ের নতুন definition।',
        ],
      },
    ],
    related: [
      { href: '/notebooklm/', label: 'NotebookLM' },
      { href: '/blog/notebooklm-diye-porashona-students-bangla-guide/', label: 'NotebookLM ছাত্রদের' },
      { href: '/notebooklm-bangla-guide/', label: 'NotebookLM Pillar' },
      { href: '/blog/ai-diye-bcs-preparation-sompurno-bangla-guide/', label: 'BCS Preparation' },
    ],
  },

  // 12
  {
    slug: 'claude-computer-use-bangla-guide',
    title: 'Claude Computer Use বাংলা গাইড — AI আপনার Computer চালাবে (২০২৬)',
    description: 'Claude Computer Use — AI সরাসরি mouse, keyboard, screen control করে কাজ করে। কীভাবে ব্যবহার, কী safe, কী risky — বাংলা ব্যবহারকারীদের জন্য সম্পূর্ণ গাইড।',
    keywords: 'Claude Computer Use, AI computer control, agentic AI, AI automation, autonomous AI, Anthropic Computer Use',
    sections: [
      {
        h2: 'ভূমিকা — Computer Use কী?',
        paragraphs: [
          'Computer Use — Anthropic-এর Claude-কে দেওয়া ক্ষমতা যেখানে AI সরাসরি আপনার computer-এর screen দেখে, mouse + keyboard control করে কাজ করে। আপনি বলবেন "এই form fill করো", Claude নিজেই করবে।',
          '২০২৪-এ beta release, ২০২৬-এ Sonnet 4.6 + production-grade — entire computer "automate" করার নতুন paradigm।',
        ],
      },
      {
        h2: 'কী করতে পারে',
        list: [
          'Browser-এ navigate, form fill, button click',
          'Excel/Sheets — data entry, formula',
          'Email — read + reply + organize',
          'Multiple application switch',
          'File manager — find, organize',
          'Screen-reading — visual element identify',
          'Multi-step workflow execute',
        ],
      },
      {
        h2: 'অ্যাক্সেস + setup',
        list: [
          'Claude API key (Anthropic.com)',
          'Computer Use SDK: Python/Node',
          'Run in isolated environment (Docker recommended)',
          'Display passthrough (screen access)',
          'Initial setup: 15-30 minutes',
          'Pricing: pay-per-token + computer-use overhead',
        ],
      },
      {
        h2: 'Practical examples',
        subs: [
          {
            h3: 'Data entry',
            paragraphs: [
              'CSV file → AI opens Excel → enters each row → saves। 1-hour manual task → 10-15 minutes।',
            ],
          },
          {
            h3: 'Research compile',
            paragraphs: [
              'AI opens browser → searches 10 sites → screenshot key findings → compiles document। Research time: 4 hours → 30 minutes।',
            ],
          },
          {
            h3: 'Email management',
            paragraphs: [
              'AI reads inbox → categorizes → drafts replies for routine → flags important। 1 hour/day → 10 minutes review।',
            ],
          },
          {
            h3: 'Booking + scheduling',
            paragraphs: [
              'AI books flights, hotels, restaurants by criteria। Hours of comparison → minutes।',
            ],
          },
        ],
      },
      {
        h2: 'Bangladesh-specific use cases',
        list: [
          'Daraz price comparison + cart',
          'Bdjobs application filling (multiple)',
          'NBR tax form auto-fill',
          'Bangladesh Bank online services',
          'Multi-platform social media posting',
          'Government form (passport, NID)',
        ],
      },
      {
        h2: 'গুরুত্বপূর্ণ সতর্কতা',
        list: [
          '<b>Sandbox use:</b> isolated environment, never main computer',
          '<b>Sensitive data:</b> banking, passwords — avoid',
          '<b>Authorization:</b> AI cannot consent for you',
          '<b>Privacy:</b> screenshots sent to Anthropic',
          '<b>Hallucination:</b> AI sometimes wrong actions',
          '<b>Liability:</b> AI mistake = your responsibility',
          '<b>Audit log:</b> review every action initially',
        ],
      },
      {
        h2: 'Performance — কেমন ভালো?',
        list: [
          'Simple repetitive task: 95% success',
          'Multi-step with branching: 70-85%',
          'Complex new task: 50-70% (improving)',
          'Speed: human pace (3-5x slower than dedicated automation)',
          'Best ROI: high-volume repetitive',
        ],
      },
      {
        h2: 'বিকল্প — যেগুলো উন্নতিতে',
        list: [
          '<b>OpenAI Operator:</b> similar concept, ChatGPT integrated',
          '<b>Microsoft Copilot Studio:</b> business-focused',
          '<b>Zapier + AI:</b> simpler, less powerful',
          '<b>Make.com + AI:</b> visual workflow',
          '<b>RPA tools (UiPath):</b> traditional enterprise',
        ],
      },
      {
        h2: 'উপসংহার',
        paragraphs: [
          'Computer Use — agentic AI-এর সবচেয়ে practical implementation এ পর্যন্ত। আজকেই production-ready না, কিন্তু 2027-এ ব্যবসার automation standard হবে। যিনি এখন প্রস্তুত হচ্ছেন, তিনি early adopter advantage পাচ্ছেন।',
        ],
      },
    ],
    related: [
      { href: '/blog/claude-sonnet-4-6-bangla-guide/', label: 'Claude Sonnet 4.6' },
      { href: '/blog/claude-opus-4-7-bangla-guide/', label: 'Claude Opus 4.7' },
      { href: '/blog/manus-ai-bangla-guide/', label: 'Manus AI' },
      { href: '/blog/ai-agent-vs-chatbot-bangla-partho/', label: 'AI Agent vs Chatbot' },
    ],
  },

  // 13
  {
    slug: 'whisper-ai-bangla-transcription-guide',
    title: 'OpenAI Whisper বাংলা গাইড — ফ্রি Audio Transcription Master ২০২৬',
    description: 'OpenAI Whisper কী, কীভাবে install + ব্যবহার করবেন Bangla audio transcription-এ? Local + Cloud option, accuracy, practical workflow — সম্পূর্ণ গাইড।',
    keywords: 'Whisper AI bangla, OpenAI Whisper, free transcription, Whisper install, audio to text free, Whisper local',
    sections: [
      {
        h2: 'ভূমিকা',
        paragraphs: [
          'OpenAI Whisper — open-source speech-to-text model যা ৯৯টি ভাষায় (Bangla সহ) transcription করে। সবচেয়ে accurate ফ্রি option, এবং local install possible — privacy + cost benefit।',
        ],
      },
      {
        h2: 'Whisper model sizes',
        list: [
          '<b>tiny (39M):</b> Fast, less accurate',
          '<b>base (74M):</b> Good balance for casual',
          '<b>small (244M):</b> Better accuracy',
          '<b>medium (769M):</b> Recommended for Bangla',
          '<b>large-v3 (1.5B):</b> Best accuracy, requires GPU',
          '<b>large-v3-turbo:</b> Latest, fast + accurate',
        ],
      },
      {
        h2: '4 ways to use Whisper',
        subs: [
          {
            h3: '১. Hugging Face web (easiest)',
            list: [
              'huggingface.co/spaces/openai/whisper',
              'Audio upload → transcribe',
              'No install, no signup',
              'File size limited (~25MB)',
              'Free for casual use',
            ],
          },
          {
            h3: '২. OpenAI API (cloud)',
            list: [
              '$0.006/minute',
              'Fast (cloud GPU)',
              'API integration',
              'Up to 25MB per file',
              'No local resource',
            ],
          },
          {
            h3: '৩. Local install (Python)',
            list: [
              'pip install openai-whisper',
              'Free + unlimited',
              'Privacy: data never leaves computer',
              'GPU recommended for speed',
              'Cmd: <code>whisper audio.mp3 --language Bengali --model medium</code>',
            ],
          },
          {
            h3: '৪. Desktop apps (no-code)',
            list: [
              '<b>MacWhisper:</b> Mac native, $20',
              '<b>WhisperBoard:</b> iOS, free',
              '<b>Whisper Transcription:</b> Windows',
              '<b>AudioPen:</b> mobile + web',
            ],
          },
        ],
      },
      {
        h2: 'Bangla accuracy benchmark',
        list: [
          'Standard Bangla clear audio: 95%+',
          'Regional accent (Chittagong, Sylhet): 80-90%',
          'Mixed Banglish: 90%+',
          'Background noise: 70-85%',
          'Multiple speakers: 70-80% (without diarization)',
          'Music background: poor',
        ],
      },
      {
        h2: 'Practical workflow — interview',
        list: [
          'Phone recording high-quality (Voice Memos)',
          'Convert to MP3 if needed',
          'Run Whisper local (medium model)',
          '1-hour audio = 5-10 minutes processing',
          'Output: text + SRT timestamps',
          'Cleanup with ChatGPT',
          'Final document time: 30 minutes total',
        ],
      },
      {
        h2: 'Output formats',
        list: [
          'TXT — plain text',
          'SRT — subtitles with timestamps',
          'VTT — web video format',
          'JSON — programmatic',
          'TSV — spreadsheet-friendly',
        ],
      },
      {
        h2: 'Advanced — improving accuracy',
        list: [
          'Audio preprocessing: noise reduction (Audacity)',
          'Multiple audio channels separate',
          'Chunking long files',
          'Initial prompt with terms: <code>--initial_prompt "BD politics, RAJUK"</code>',
          'Voice activity detection (silero VAD)',
          'Custom vocabulary',
        ],
      },
      {
        h2: 'Use cases — top 8',
        list: [
          'Journalist interview',
          'Student lecture',
          'Podcast subtitle',
          'Doctor patient note',
          'Lawyer deposition',
          'Researcher focus group',
          'YouTube video caption',
          'Voice journal',
        ],
      },
      {
        h2: 'Alternative — when not Whisper',
        list: [
          'Real-time: Whisper is batch, use Deepgram/Otter',
          'Speaker labels: Whisper alone no, use combined tool',
          'Enterprise: Azure/GCP managed',
          'Very specific accent: train custom model',
        ],
      },
      {
        h2: 'উপসংহার',
        paragraphs: [
          'Whisper — open-source AI-এর crown jewel। বাংলা transcription আর paid service-এ আবদ্ধ না। আজকেই Hugging Face-এ ১টি Bangla audio test করুন; pro হলে local install. ৩-৫ ঘণ্টার কাজ ৫-১০ মিনিটে।',
        ],
      },
    ],
    related: [
      { href: '/blog/ai-diye-bangla-audio-text-transcription/', label: 'Bangla Transcription' },
      { href: '/blog/ai-diye-bangla-subtitle-caption-generate/', label: 'Bangla Subtitle' },
      { href: '/blog/otter-ai-bangla-meeting-transcript-guide/', label: 'Otter AI' },
      { href: '/blog/ai-diye-news-article-rewrite-bangla-guide/', label: 'News Rewrite' },
    ],
  },

  // 14
  {
    slug: 'ai-agent-vs-chatbot-bangla-partho',
    title: 'AI Agent vs Chatbot — পার্থক্য কী? বাংলা গাইড (২০২৬)',
    description: 'AI agent এবং chatbot এক জিনিস নয়। কী আলাদা, কোনটা কখন, business-এ কোনটা ব্যবহার? বাংলায় সহজ ব্যাখ্যা + practical examples।',
    keywords: 'AI agent vs chatbot, AI agent bangla, autonomous AI, agentic AI, chatbot vs agent',
    sections: [
      {
        h2: 'ভূমিকা',
        paragraphs: [
          '২০২৪-২৬-এ "AI agent" শব্দটি ব্যাপকভাবে ব্যবহৃত হচ্ছে। কিন্তু chatbot এর সাথে পার্থক্য অনেকেই জানেন না। এই গাইডে সহজ ভাষায় difference।',
        ],
      },
      {
        h2: 'Chatbot — কী?',
        list: [
          'Question → Answer mechanism',
          'Stateless বা limited memory',
          'No action — শুধু text reply',
          'Reactive — wait for user',
          'Predictable response',
          'উদাহরণ: ChatGPT casual conversation, customer service bot',
        ],
      },
      {
        h2: 'AI Agent — কী?',
        list: [
          'Goal-oriented — task-based',
          'Multi-step planning + execution',
          'Tool use — browser, API, code',
          'Autonomous — decisions নিতে পারে',
          'Long memory + state management',
          'Proactive — work without prompts',
          'উদাহরণ: Manus AI, Claude Computer Use, AutoGPT',
        ],
      },
      {
        h2: 'Side-by-side comparison',
        list: [
          '<b>Input:</b> Chatbot conversation; Agent task',
          '<b>Output:</b> Chatbot text; Agent action + result',
          '<b>Memory:</b> Chatbot session; Agent long-term',
          '<b>Tools:</b> Chatbot none/limited; Agent many',
          '<b>Time:</b> Chatbot instant; Agent minutes/hours',
          '<b>Risk:</b> Chatbot low; Agent higher',
          '<b>Use case:</b> Chatbot Q&A; Agent complex workflow',
        ],
      },
      {
        h2: 'Real examples — Chatbot',
        list: [
          'ChatGPT কথোপকথন (default mode)',
          'Customer support bot (predefined Q&A)',
          'Facebook page auto-reply (ManyChat)',
          'Voice assistant (Siri, Alexa) — partly chatbot',
        ],
      },
      {
        h2: 'Real examples — AI Agent',
        list: [
          '<b>Manus AI:</b> "Research top 10 SaaS, prepare comparison" — agent does it all',
          '<b>Claude Computer Use:</b> Mouse-keyboard control',
          '<b>Devin:</b> Autonomous software engineer',
          '<b>AutoGPT:</b> Self-prompting goal achieve',
          '<b>OpenAI Operator:</b> Browser-based task agent',
        ],
      },
      {
        h2: 'কোনটা কখন বেছে নেবেন?',
        list: [
          '<b>Chatbot ভাল:</b> simple Q&A, content generation, conversation',
          '<b>Agent ভাল:</b> Multi-step task, research compile, automation',
          '<b>Cost:</b> Chatbot সস্তা; Agent expensive',
          '<b>Beginner:</b> Chatbot শুরু; Agent advance',
        ],
      },
      {
        h2: 'Business use case',
        subs: [
          {
            h3: 'Chatbot business example',
            paragraphs: [
              'Daraz seller Facebook page। ManyChat + ChatGPT — customer "দাম কত" → bot reply। 24/7।',
            ],
          },
          {
            h3: 'Agent business example',
            paragraphs: [
              'Travel agency। Customer "Cox\'s Bazar 3 days 2 people" — Agent: hotel compare, flight book, itinerary generate, send to customer। ৩-৪ hours of human work → 30 minutes।',
            ],
          },
        ],
      },
      {
        h2: 'বাংলাদেশি context',
        list: [
          'Chatbot adoption: high — FB pages, WhatsApp Business',
          'Agent adoption: এখনো early',
          'SME use case: chatbot enough for now',
          'Enterprise/agency: agent emerging',
          'Future (3-5 years): agent mainstream',
        ],
      },
      {
        h2: 'কী শিখবেন প্রথমে?',
        list: [
          'Beginner: Chatbot — ChatGPT prompt engineering',
          'Intermediate: Custom GPT, ManyChat workflow',
          'Advanced: Claude Computer Use, Manus',
          'Expert: Build agents (Python + LLM APIs)',
        ],
      },
      {
        h2: 'উপসংহার',
        paragraphs: [
          'Chatbot = answer. Agent = action। দুটোর জায়গা ভিন্ন, কিন্তু overlapping। 2026-এ chatbot mature, agent এখনো evolving। SME-দের জন্য চ্যাটবট দিয়ে শুরু; বড় enterprise-এ agent pilot করতে পারে।',
        ],
      },
    ],
    related: [
      { href: '/blog/manus-ai-bangla-guide/', label: 'Manus AI' },
      { href: '/blog/claude-computer-use-bangla-guide/', label: 'Claude Computer Use' },
      { href: '/blog/ai-chatbot-business-bangladesh/', label: 'AI Chatbot Business' },
      { href: '/blog/mcp-model-context-protocol-bangla-guide/', label: 'MCP Protocol' },
    ],
  },

  // 15
  {
    slug: 'mcp-model-context-protocol-bangla-guide',
    title: 'MCP (Model Context Protocol) বাংলা গাইড — AI Tool Integration-এর Standard',
    description: 'MCP কী, Anthropic-এর Model Context Protocol কেন গুরুত্বপূর্ণ, কীভাবে AI tools একসাথে কাজ করানো যায় — developer ও power user-দের জন্য সম্পূর্ণ গাইড।',
    keywords: 'MCP protocol, Model Context Protocol, MCP bangla, AI integration standard, Anthropic MCP, AI tools connect',
    sections: [
      {
        h2: 'ভূমিকা — MCP কী?',
        paragraphs: [
          'Model Context Protocol (MCP) — Anthropic ২০২৪ সালে release করা open standard যা AI মডেলগুলোকে external tools, data sources, এবং services-এর সাথে connect করতে দেয়।',
          'সহজ ভাষায়: USB-এর মতো — যেকোনো AI মডেল যেকোনো MCP-compatible tool ব্যবহার করতে পারে।',
        ],
      },
      {
        h2: 'কেন MCP দরকার?',
        list: [
          '<b>Before MCP:</b> প্রতিটা AI tool integration custom — ChatGPT vs Claude vs Gemini আলাদা code',
          '<b>With MCP:</b> একবার লেখো, যেকোনো MCP-compatible AI ব্যবহার করতে পারে',
          '<b>Vendor neutral:</b> Anthropic open standard published',
          '<b>Ecosystem:</b> Hundreds of pre-built MCP servers',
        ],
      },
      {
        h2: 'কীভাবে কাজ করে',
        list: [
          'AI client (Claude, ChatGPT, etc.) ↔ MCP Server ↔ Resource (database, API, file)',
          'Protocol: JSON-RPC over stdio/HTTP',
          'Standardized: tool definition, resource access, prompt template',
          'Permission-based: user explicitly grants access',
        ],
      },
      {
        h2: 'Pre-built MCP servers (popular)',
        list: [
          '<b>Filesystem:</b> AI reads/writes local files',
          '<b>GitHub:</b> repo access, PR, issues',
          '<b>Postgres/SQLite:</b> database query',
          '<b>Google Drive:</b> docs/sheets/slides',
          '<b>Slack:</b> message history + send',
          '<b>Memory:</b> long-term storage',
          '<b>Brave Search:</b> web search',
          '<b>Puppeteer:</b> browser automation',
        ],
      },
      {
        h2: 'কীভাবে ব্যবহার করবেন (Claude Desktop)',
        list: [
          'claude.ai/desktop থেকে app install',
          'Settings → Developer → Edit Config',
          'JSON config-এ MCP server add',
          'Restart Claude',
          'Now Claude can use that tool!',
        ],
      },
      {
        h2: 'Example config',
        list: [
          '"mcpServers": { <br>"filesystem": { "command": "npx", "args": ["-y", "@modelcontextprotocol/server-filesystem", "/Users/me/Documents"] }, <br>"github": { "command": "npx", "args": ["-y", "@modelcontextprotocol/server-github"], "env": { "GITHUB_TOKEN": "ghp_..." } } <br>}',
        ],
      },
      {
        h2: 'Developer — own MCP server বানানো',
        list: [
          'SDK: Python/Node TypeScript',
          'Define: tools, resources, prompts',
          'Implement: standard protocol methods',
          'Test: with Claude Desktop',
          'Publish: GitHub + npm',
          '<b>Use case:</b> proprietary internal system → AI access',
        ],
      },
      {
        h2: 'Bangladesh use cases',
        list: [
          'Daraz seller: own product DB MCP → AI auto-list',
          'Hospital: patient record MCP (with privacy)',
          'Bank: internal report system MCP',
          'NGO: project tracker MCP',
          'Lawyer: case database MCP',
        ],
      },
      {
        h2: 'Security + privacy',
        list: [
          'Permission per tool — user controls',
          'Audit log of every action',
          'Local execution by default',
          'Sensitive data scope limit',
          'Token rotation best practice',
        ],
      },
      {
        h2: 'MCP vs alternatives',
        list: [
          '<b>vs OpenAI Function Calling:</b> OpenAI proprietary; MCP open',
          '<b>vs LangChain Tools:</b> LangChain library, MCP protocol',
          '<b>vs Zapier:</b> Zapier visual workflow, MCP code',
          '<b>vs OpenAPI:</b> OpenAPI describes API, MCP integrates LLM',
        ],
      },
      {
        h2: 'উপসংহার',
        paragraphs: [
          'MCP — AI-এর "USB"। Universal standard হলে productivity ১০x। Developer হলে আজই Claude Desktop-এ filesystem MCP enable করে দেখুন; AI সরাসরি আপনার project files access করছে। শুরু-পর্যায়ে আছে — early adopter advantage প্রচুর।',
        ],
      },
    ],
    related: [
      { href: '/claude/', label: 'Claude' },
      { href: '/blog/claude-computer-use-bangla-guide/', label: 'Claude Computer Use' },
      { href: '/blog/ai-agent-vs-chatbot-bangla-partho/', label: 'AI Agent vs Chatbot' },
      { href: '/claude-code/', label: 'Claude Code' },
    ],
  },

  // 16
  {
    slug: 'ai-chakri-jhuki-bangladesh-nirapotta',
    title: 'AI চাকরির ঝুঁকি ও নিরাপত্তা — বাংলাদেশি প্রেক্ষাপটে সম্পূর্ণ গাইড',
    description: 'AI কি বাংলাদেশের চাকরি কমাবে? কোন কোন পেশা ঝুঁকিতে, কোনগুলো নিরাপদ, কীভাবে নিজেকে protect করবেন — data-driven analysis।',
    keywords: 'AI job loss bangladesh, AI চাকরি ঝুঁকি, AI nirapotta, AI replacement bangla, future of work bangladesh',
    sections: [
      {
        h2: 'ভূমিকা',
        paragraphs: [
          'বাংলাদেশের ১.৭ কোটি+ working population। AI এই workforce-এ কী impact ফেলবে — চাকরি কেড়ে নেবে নাকি transform করবে — এই debate জরুরি।',
          'এই গাইডে data + reality — কোন পেশা ঝুঁকিতে, কোনগুলো safe, এবং future-proof কীভাবে হবেন।',
        ],
      },
      {
        h2: 'WEF, McKinsey reports কী বলছে',
        list: [
          'WEF 2025: ৪০% global jobs AI-disrupted by 2030',
          'McKinsey: 50% tasks automatable, jobs less so',
          'OECD: 27% jobs high-automation risk',
          'New roles: every replaced jobs-এর সাথে 1.5 নতুন',
          'Net effect: transformation, not elimination',
        ],
      },
      {
        h2: 'বাংলাদেশে high-risk পেশা',
        list: [
          '<b>Data entry:</b> 90% automatable',
          '<b>Customer support (basic):</b> 70% chatbot-able',
          '<b>Translation (literal):</b> 80% AI',
          '<b>Content writing (generic):</b> 60%',
          '<b>Basic graphic design (templates):</b> 50%',
          '<b>Telemarketing:</b> 70%',
          '<b>Bookkeeping:</b> 60%',
          '<b>Bank teller (in-person):</b> 50%',
        ],
      },
      {
        h2: 'বাংলাদেশে relatively safe পেশা',
        list: [
          'Healthcare delivery (doctor, nurse — human touch)',
          'Skilled trade (plumber, electrician)',
          'Teacher (especially primary)',
          'Therapist/counselor',
          'Hospitality (server, chef)',
          'Construction (manual)',
          'Local journalism (community)',
          'Religious leadership',
        ],
      },
      {
        h2: 'AI-augmented (not replaced) পেশা',
        list: [
          '<b>Doctor:</b> AI diagnosis support, prescription assist',
          '<b>Lawyer:</b> research + document drafting',
          '<b>Engineer:</b> design + calculation',
          '<b>Marketer:</b> analytics + content',
          '<b>Developer:</b> coding faster',
          '<b>Accountant:</b> reporting + audit',
          '<b>Teacher:</b> personalized learning',
        ],
      },
      {
        h2: 'নতুন পেশা (next 5-10 years)',
        list: [
          'AI prompt engineer',
          'AI ethics consultant',
          'Data labeler/curator',
          'AI trainer (RLHF)',
          'AI security specialist',
          'Bangla AI localizer',
          'AI-human integration specialist',
          'Chief AI Officer',
        ],
      },
      {
        h2: 'নিজেকে protect — 7 strategy',
        list: [
          '<b>১. AI literacy:</b> tool নিজে শিখুন',
          '<b>২. Human skill develop:</b> empathy, leadership, creativity',
          '<b>৩. Domain expertise deepen:</b> generalist vs specialist',
          '<b>৪. Cross-skill:</b> tech + domain combination',
          '<b>৫. AI-augment workflow:</b> productivity ১০x',
          '<b>৬. Niche down:</b> hyper-specific market',
          '<b>৭. Continuous learning:</b> 1 new tool/month',
        ],
      },
      {
        h2: 'বাংলাদেশের specific opportunities',
        list: [
          'Bangla AI training data labeler',
          'Local language AI specialist',
          'BD-context AI consultant for SMEs',
          'AI freelance servicing US/EU clients',
          'AI education content creator',
          'Government digital transformation',
        ],
      },
      {
        h2: 'Government + policy',
        list: [
          'ICT Division AI roadmap 2026-2030',
          'Workforce reskilling initiative',
          'IT graduate AI integration',
          'NGO + private partnership essential',
          'Bangladesh AI policy in draft',
        ],
      },
      {
        h2: 'উপসংহার',
        paragraphs: [
          'AI ভয়ের বিষয় না — preparation-এর বিষয়। যিনি AI ignore করবেন তিনি ঝুঁকিতে। যিনি AI master করবেন তিনি ১০x productive। আজকেই একটি AI tool শিখা শুরু করুন; এই সিদ্ধান্ত আপনার career-এর জন্য সবচেয়ে গুরুত্বপূর্ণ হতে পারে।',
        ],
      },
    ],
    related: [
      { href: '/blog/ai-diye-taka-income-2026-bangladesh/', label: 'AI দিয়ে ইনকাম' },
      { href: '/blog/ai-diye-personal-brand-banano-bangla/', label: 'Personal Brand' },
      { href: '/blog/best-ai-tools-for-students-bangladesh/', label: 'Students AI' },
      { href: '/bangla-ai-guide/', label: 'বাংলা AI গাইড' },
    ],
  },

  // 17
  {
    slug: 'ai-diye-professional-headshot-cv-photo-bangla',
    title: 'AI দিয়ে Professional Headshot ও CV Photo — ৫ মিনিটে Studio-Quality',
    description: 'AI দিয়ে কীভাবে professional headshot, CV photo, LinkedIn profile ছবি বানাবেন? Photo studio ছাড়া studio-quality ছবি — tools, prompts, workflow।',
    keywords: 'AI headshot, AI CV photo, professional photo AI, LinkedIn photo AI, AI portrait, headshot generator',
    sections: [
      {
        h2: 'ভূমিকা',
        paragraphs: [
          'Professional headshot — চাকরি, LinkedIn, freelance profile, business — সবখানে দরকার। Photo studio session ১,৫০০-৫,০০০ টাকা। AI এই কাজ ৫-১০ মিনিটে $5-$15-এ সম্ভব করেছে।',
        ],
      },
      {
        h2: 'AI Headshot tools (top 5)',
        list: [
          '<b>Headshot Pro (HeadshotPro):</b> $29, 100+ headshots, 1-2 hour',
          '<b>Aragon AI:</b> $19, 40 headshots, fast',
          '<b>Try It On AI:</b> $19, multiple style',
          '<b>Profile Bakery:</b> $19, 60 photos',
          '<b>Secta Labs:</b> $39, premium quality',
        ],
      },
      {
        h2: 'কীভাবে কাজ করে',
        list: [
          '15-30টা selfie upload (different angle, lighting)',
          'AI face train করে (১-২ ঘণ্টা)',
          'Generate options: corporate, casual, creative',
          'Download high-resolution photos',
          'Quality: professional studio comparable',
        ],
      },
      {
        h2: 'Best photos to upload',
        list: [
          'Variety: 5+ angles (front, side, slight tilt)',
          'Different lighting (natural, indoor)',
          'Various expression (smile, neutral, serious)',
          'Different clothes (1-2 outfit changes)',
          'No filter applied',
          'Avoid: group photo, sunglass, hat',
          'Resolution: minimum 1080p',
        ],
      },
      {
        h2: 'Style options',
        list: [
          '<b>Corporate:</b> Formal attire, neutral background',
          '<b>LinkedIn casual:</b> Smart-casual, slight smile',
          '<b>Tech/creative:</b> T-shirt, modern background',
          '<b>Author:</b> Bookshelf background, contemplative',
          '<b>Speaker:</b> Stage lighting, confident pose',
          '<b>Couple/family:</b> Group headshot possible',
        ],
      },
      {
        h2: 'Customization tips',
        list: [
          'Skin tone preservation',
          'Cultural attire option (panjabi, sari)',
          'Religious attire (hijab, etc.)',
          'Age appropriate',
          'Glasses optional',
          'Beard/facial hair maintain',
        ],
      },
      {
        h2: 'Bangladesh-specific use cases',
        list: [
          'Bdjobs profile professional',
          'LinkedIn for international clients',
          'Conference speaker bio photo',
          'Author book cover headshot',
          'YouTube channel thumbnail base',
          'Wedding bio data picture',
          'Corporate annual report',
        ],
      },
      {
        h2: 'AI Headshot vs Real Studio',
        list: [
          '<b>Cost:</b> AI $20 vs Studio ৳৩,০০০+',
          '<b>Time:</b> AI 1-2 hours vs Studio 3-day turnaround',
          '<b>Variety:</b> AI 50+ shots vs Studio 5-10',
          '<b>Quality:</b> AI 85-95% indistinguishable',
          '<b>Privacy:</b> AI photos cloud-stored consideration',
          '<b>Realism:</b> Real wins for crucial business',
        ],
      },
      {
        h2: 'Free + manual workflow',
        list: [
          'Phone selfie best one',
          'Photoroom: background change → studio',
          'Remini: face enhance + sharpen',
          'PhotoAI free trial',
          'Canva enhance + crop',
          '<b>Time:</b> 20-30 minutes',
          '<b>Cost:</b> Free',
          '<b>Result:</b> ~70% of paid AI',
        ],
      },
      {
        h2: 'Ethical considerations',
        list: [
          'AI-enhanced disclose (LinkedIn updates policy)',
          'Don\'t look unrecognizably different',
          'Skin smoothing: subtle, not unrealistic',
          'CV photo: should match actual appearance',
          'Photo manipulation declaration if asked',
        ],
      },
      {
        h2: 'উপসংহার',
        paragraphs: [
          'Professional headshot আর "luxury" না। AI দিয়ে যে কেউ $20-এ studio-quality। আপনার LinkedIn-এ যদি 5+ বছরের পুরোনো ছবি বা mobile selfie থাকে — এই সপ্তাহান্তে AI headshot generate করুন। Profile views ২x বাড়বে।',
        ],
      },
    ],
    related: [
      { href: '/blog/ai-resume-cv-maker-bangladesh/', label: 'AI CV Maker' },
      { href: '/blog/ai-diye-personal-brand-banano-bangla/', label: 'Personal Brand' },
      { href: '/blog/ai-photo-editing-bangladesh/', label: 'AI Photo Edit' },
      { href: '/blog/ai-diye-chakrir-cover-letter-bangla/', label: 'Cover Letter' },
    ],
  },

  // 18
  {
    slug: 'ai-diye-social-media-content-calendar-bangla',
    title: 'AI দিয়ে Social Media Content Calendar — ৩০ দিনের Plan ১ ঘণ্টায়',
    description: 'AI দিয়ে কীভাবে ৩০ দিনের social media calendar তৈরি করবেন? Facebook, Instagram, LinkedIn, TikTok — সব platform-এর জন্য post idea + schedule।',
    keywords: 'social media calendar AI, content calendar bangla, AI social media planner, 30 day content plan, social media planning',
    sections: [
      {
        h2: 'ভূমিকা',
        paragraphs: [
          'প্রতিদিন social media-তে কী post করব — এই প্রশ্ন creator/business owner-এর সবচেয়ে time-consuming অংশ। AI এই কাজ ৪-৫ ঘণ্টা থেকে ৬০ মিনিটে কমাতে পারে।',
        ],
      },
      {
        h2: 'AI master prompt — 30-day calendar',
        list: [
          '"Create 30-day social media content calendar for [niche/business]. Audience: [demographic]. Platforms: [FB/IG/TikTok/LinkedIn]. Goal: [awareness/sales/engagement].<br>Output table:<br>- Day | Platform | Format (post/reel/carousel/story) | Topic | Hook | Caption draft (Bangla) | Hashtags<br>Include: 5 educational, 8 engagement, 5 promotional, 5 personal/behind-scene, 4 user-generated, 3 trending. Themes per week."',
        ],
      },
      {
        h2: 'Calendar structure — proven pattern',
        list: [
          '<b>Monday:</b> Educational/Tip',
          '<b>Tuesday:</b> Behind-the-scenes',
          '<b>Wednesday:</b> Engagement (poll/question)',
          '<b>Thursday:</b> Promotional',
          '<b>Friday:</b> User-generated/testimonial',
          '<b>Saturday:</b> Entertaining/personality',
          '<b>Sunday:</b> Inspirational/recap',
        ],
      },
      {
        h2: 'Platform-specific adjustments',
        subs: [
          {
            h3: 'Facebook',
            list: [
              'Longer caption OK',
              'Mixed media: photo + Reel',
              '3-5 post/week',
              'Group cross-post',
              'Bangla audience focused',
            ],
          },
          {
            h3: 'Instagram',
            list: [
              'Reels 5+/week',
              'Carousel for education',
              'Story daily',
              'Lifestyle aesthetic',
              'Hashtag mix',
            ],
          },
          {
            h3: 'LinkedIn',
            list: [
              'Long-form post 2-3/week',
              'Document/PDF share',
              'Thought leadership',
              'Industry-specific',
              'English primarily',
            ],
          },
          {
            h3: 'TikTok',
            list: [
              'Daily Reels',
              'Trending audio',
              'Quick education/entertainment',
              'Young audience',
            ],
          },
        ],
      },
      {
        h2: 'Tools to execute calendar',
        list: [
          '<b>Planning:</b> Notion / Google Sheets',
          '<b>Scheduling:</b> Buffer, Hootsuite, Meta Business Suite',
          '<b>Design:</b> Canva AI bulk template',
          '<b>Video:</b> CapCut AI',
          '<b>Caption:</b> ChatGPT/Claude',
          '<b>Analytics:</b> native platform + Buffer',
        ],
      },
      {
        h2: 'Weekly batch production',
        list: [
          'Sunday: 7-day calendar AI generate',
          'Monday: Visual create (Canva)',
          'Tuesday: Reel/video record',
          'Wednesday: Edit + caption',
          'Thursday: Schedule (Buffer)',
          'Friday-Saturday: Engagement only',
          '<b>Time/week:</b> 4-6 hours total',
        ],
      },
      {
        h2: 'Content pillar strategy',
        list: [
          'Pick 3-5 core pillars',
          'Example boutique: Style tip, New arrival, Customer story, Behind-scene, Fashion trend',
          'Each post must fit a pillar',
          'Mix throughout week',
          'Audience knows what to expect',
        ],
      },
      {
        h2: 'Bangladesh-specific events calendar',
        list: [
          'Pohela Boishakh (April 14)',
          'Eid (twice yearly)',
          'Durga Puja (autumn)',
          'Victory Day (Dec 16)',
          'Independence Day (Mar 26)',
          'International Mother Language Day (Feb 21)',
          'Plan campaigns around',
        ],
      },
      {
        h2: 'Trend-jacking',
        list: [
          'Daily trending hashtag check',
          'Cricket match real-time',
          'Local news angle',
          'Viral video remix (creator only)',
          'Holiday-specific',
        ],
      },
      {
        h2: 'উপসংহার',
        paragraphs: [
          'Social media calendar — দীর্ঘমেয়াদী brand-building tool। AI দিয়ে barrier zero, কিন্তু consistency সবকিছু। আজকের একটি ঘণ্টা বরাদ্দ করে পরের ৩০ দিনের calendar তৈরি করুন। নভেম্বরে একই কাজ পুনরাবৃত্তি — অভ্যাস গড়ে উঠবে।',
        ],
      },
    ],
    related: [
      { href: '/blog/ai-diye-facebook-page-chalano-bangla/', label: 'AI Facebook পেজ' },
      { href: '/blog/ai-diye-instagram-business-bangladesh/', label: 'Instagram Business' },
      { href: '/blog/ai-diye-personal-brand-banano-bangla/', label: 'Personal Brand' },
      { href: '/canva-ai/', label: 'Canva AI' },
    ],
  },

  // 19
  {
    slug: 'ai-diye-excel-pivot-chart-advanced-bangla',
    title: 'AI দিয়ে Excel Pivot Table ও Chart — Advanced বাংলা গাইড',
    description: 'Excel-এ pivot table, complex chart, dashboard কীভাবে AI দিয়ে দ্রুত তৈরি করবেন? ChatGPT Code Interpreter + Copilot — practical examples।',
    keywords: 'AI Excel pivot, Excel chart AI, Excel dashboard, Copilot Excel, ChatGPT Excel advanced',
    sections: [
      {
        h2: 'ভূমিকা',
        paragraphs: [
          'Pivot table এবং complex chart — Excel-এর সবচেয়ে powerful এবং কঠিন feature। AI এই learning curve অর্ধেক করেছে।',
        ],
      },
      {
        h2: 'Pivot Table — AI workflow',
        list: [
          'Raw data screenshot/CSV ChatGPT-এ paste',
          'Prompt: "Create pivot table showing [rows] by [columns] with [values]. Step-by-step Excel instruction."',
          'AI gives: drag-drop instruction',
          'Manual execute: 30 seconds',
          'Refinement: filter, sort, grand total',
        ],
      },
      {
        h2: 'Complex pivot scenarios',
        list: [
          '<b>Multi-level rows:</b> "Category > Subcategory > Product" hierarchy',
          '<b>Calculated field:</b> profit margin, growth %',
          '<b>Slicer + filter:</b> interactive',
          '<b>Date grouping:</b> month/quarter/year',
          '<b>Top 10:</b> auto-filter best/worst',
        ],
      },
      {
        h2: 'Chart selection — which chart for what?',
        list: [
          '<b>Trend over time:</b> Line chart',
          '<b>Comparison categories:</b> Column/Bar',
          '<b>Part-to-whole:</b> Pie (small), Stacked bar (better)',
          '<b>Correlation:</b> Scatter',
          '<b>Geographic:</b> Map chart',
          '<b>Performance vs target:</b> Bullet/gauge',
          '<b>Distribution:</b> Histogram, Box plot',
          'AI prompt: "Which chart for [data type]?"',
        ],
      },
      {
        h2: 'ChatGPT Code Interpreter (Plus)',
        list: [
          'Excel/CSV upload directly',
          'Natural language analysis',
          '"Show me monthly trend with annotation for spike in March"',
          'Generates: actual chart image',
          'Download: Excel file with formula',
          'Magic: complex analysis 30 seconds',
        ],
      },
      {
        h2: 'Microsoft Copilot in Excel',
        list: [
          'M365 Copilot subscription ($20-30)',
          'Sidebar AI in Excel',
          '"Highlight top 5 outliers"',
          '"Add profit margin column"',
          '"Make this chart Bangladeshi flag colors"',
          'Native Excel — no copy-paste',
        ],
      },
      {
        h2: 'Dashboard creation',
        list: [
          'Plan: 4-6 key metric',
          'Source data sheet (clean)',
          'Pivot tables (one per metric)',
          'Charts (linked to pivots)',
          'Slicers (interactive filter)',
          'AI prompt: "Dashboard layout for [business type]"',
        ],
      },
      {
        h2: 'Bangladesh business examples',
        subs: [
          {
            h3: 'Restaurant',
            paragraphs: [
              'Daily sales pivot: dish category × day. Chart: weekly trend। Slicer: branch।',
            ],
          },
          {
            h3: 'RMG factory',
            paragraphs: [
              'Production: line × buyer × month. Defect rate chart. Efficiency dashboard।',
            ],
          },
          {
            h3: 'NGO',
            paragraphs: [
              'Beneficiary count: program × district × quarter. Spend vs budget chart।',
            ],
          },
          {
            h3: 'Freelancer',
            paragraphs: [
              'Income: client × month. Expense category pie. Net profit trend।',
            ],
          },
        ],
      },
      {
        h2: 'Common pitfalls + AI fix',
        list: [
          'Data not in table format → AI restructure',
          'Date format inconsistent → AI standardize',
          'Pivot showing #DIV/0 → AI explain + fix',
          'Chart too cluttered → AI simplify recommendation',
          'Performance slow large data → AI suggest Power Query',
        ],
      },
      {
        h2: 'Advanced — Power Query + AI',
        list: [
          'Data import (multiple sources)',
          'Transformation: merge, append, pivot',
          'AI helps M code (Power Query language)',
          'Refresh automation',
          'Combined with pivot = enterprise-grade',
        ],
      },
      {
        h2: 'উপসংহার',
        paragraphs: [
          'Pivot + chart skill — অফিসকর্মী থেকে CEO পর্যন্ত value-add। AI এই skill ১০× faster শেখাচ্ছে। আজকেই আপনার একটি real spreadsheet AI-এ paste করুন, "এই data থেকে dashboard বানাও" — AI পুরো workflow দেখাবে। ১ ঘণ্টা practice = lifetime skill।',
        ],
      },
    ],
    related: [
      { href: '/blog/ai-diye-excel-kaj-bangla-guide/', label: 'AI Excel Basic' },
      { href: '/blog/ai-diye-data-visualization-bangla-guide/', label: 'Data Visualization' },
      { href: '/blog/ai-diye-accounting-bookkeeping-bangla-guide/', label: 'AI Accounting' },
      { href: '/microsoft-copilot/', label: 'Microsoft Copilot' },
    ],
  },

  // 20
  {
    slug: 'ai-diye-business-plan-likha-bangla-guide',
    title: 'AI দিয়ে Business Plan লেখা — Startup ও SME-দের জন্য সম্পূর্ণ গাইড',
    description: 'AI দিয়ে কীভাবে professional business plan লিখবেন? Executive summary, market analysis, financial projections, marketing — investor-ready format। বাংলা + English উভয়।',
    keywords: 'AI business plan, business plan bangla, startup plan AI, SME business plan, investor pitch plan',
    sections: [
      {
        h2: 'ভূমিকা',
        paragraphs: [
          'Business plan — startup funding, bank loan, partnership — সবখানে প্রয়োজন। ৩০-৫০ পৃষ্ঠার document লিখতে ১-২ মাস। AI এই কাজ ১ সপ্তাহে possible — quality উন্নত।',
        ],
      },
      {
        h2: 'Business Plan structure (standard)',
        list: [
          '<b>১. Executive Summary</b> (1-2 page)',
          '<b>২. Business Description</b>',
          '<b>৩. Market Analysis</b>',
          '<b>৪. Organization & Management</b>',
          '<b>৫. Products/Services</b>',
          '<b>৬. Marketing & Sales Strategy</b>',
          '<b>৭. Financial Projections</b> (3-5 year)',
          '<b>৮. Funding Request</b>',
          '<b>৯. Appendix</b>',
        ],
      },
      {
        h2: 'Master prompt — full plan',
        list: [
          '"Write comprehensive business plan for [business name], [industry], [location: Bangladesh].<br>BUSINESS IDEA: [1-paragraph description]<br>TARGET CUSTOMER: [demographic]<br>UNIQUE VALUE: [what makes it unique]<br>FUNDING NEEDED: [\$X for Y purpose]<br>Output: All 9 standard sections. 25-40 pages. Investor-ready tone. Include sample financial projections. Bengali + English mixed where appropriate."',
        ],
      },
      {
        h2: 'Executive Summary — most important',
        list: [
          'Hook: "By 2030, [market] in Bangladesh will be ৳XB"',
          'Problem clear, Solution clear',
          'Traction (if any)',
          'Team strength',
          'Numbers: revenue projection, capital ask',
          'Why invest (return + impact)',
          '<b>Length:</b> 1-2 pages max',
        ],
      },
      {
        h2: 'Market Analysis (Bangladesh-specific)',
        list: [
          'TAM/SAM/SOM — Bangladesh + global if export',
          'Government data: BBS, NBR, BIDA',
          'Industry reports: LightCastle Partners, Dhaka Stock Exchange',
          'Competitor analysis: 5-10 players',
          'Customer survey (if conducted)',
          'Market trend 3-year',
        ],
      },
      {
        h2: 'Financial Projections',
        list: [
          'Revenue model: subscription/transaction/sale',
          'Year 1-5 projection',
          'Assumption table (customer count, price, etc.)',
          'Expense breakdown',
          'Break-even analysis',
          'Cash flow statement',
          'Sensitivity analysis',
          '<b>AI assist:</b> ChatGPT Code Interpreter → Excel model',
        ],
      },
      {
        h2: 'Marketing & Sales',
        list: [
          'Customer Acquisition Cost (CAC)',
          'Lifetime Value (LTV)',
          'Channels: digital, offline, partnership',
          'Bangladesh-specific: Facebook ads, bKash partnership',
          'Sales funnel',
          'Pricing strategy',
        ],
      },
      {
        h2: 'BD-specific sections',
        list: [
          'Regulatory: RJSC registration, trade license, VAT',
          'Bank account: corporate, FCC for international',
          'Tax: NBR, BIN, return',
          'Compliance: BIDA, BTRC (tech)',
          'Foreign investment: FDI route',
        ],
      },
      {
        h2: 'For different audiences',
        subs: [
          {
            h3: 'Bank loan',
            paragraphs: [
              'Focus: cash flow, collateral, repayment ability। Conservative projections।',
            ],
          },
          {
            h3: 'Angel investor',
            paragraphs: [
              'Focus: team, market size, exit strategy। Aggressive growth।',
            ],
          },
          {
            h3: 'VC fund',
            paragraphs: [
              'Focus: scalability, 10x return, network effects। Bold vision।',
            ],
          },
          {
            h3: 'Government grant',
            paragraphs: [
              'Focus: employment generation, social impact, export potential।',
            ],
          },
        ],
      },
      {
        h2: 'Tools beyond ChatGPT/Claude',
        list: [
          '<b>LivePlan:</b> business plan software',
          '<b>Gamma AI:</b> pitch deck from plan',
          '<b>Canva:</b> visual elements',
          '<b>Excel/Sheets:</b> financial model',
          '<b>Notion:</b> living document',
          '<b>DocSend:</b> tracked sharing',
        ],
      },
      {
        h2: 'Common mistakes (avoid)',
        list: [
          'Too long (50+ pages = unread)',
          'Hockey-stick projections (unrealistic)',
          'No competition mentioned',
          'Vague target customer',
          'Founder ego over team',
          'Missing risk analysis',
          'No use-of-funds breakdown',
        ],
      },
      {
        h2: '৭-day plan timeline',
        list: [
          'দিন 1: AI generate master draft',
          'দিন 2: Executive summary refine',
          'দিন 3: Market analysis BD data add',
          'দিন 4: Financial projections build',
          'দিন 5: Marketing + operations detail',
          'দিন 6: Mentor/peer feedback',
          'দিন 7: Final polish + PDF',
        ],
      },
      {
        h2: 'উপসংহার',
        paragraphs: [
          'Business plan — funding-এর key, কিন্তু আরো গুরুত্বপূর্ণভাবে founder-এর clarity tool। AI দিয়ে first draft দ্রুত — কিন্তু আপনার vision, market understanding, এবং execution capability সেটাই sole investor look। এই সপ্তাহের একটা ঘণ্টা বসুন; ১ মাসে investor-ready plan ready।',
        ],
      },
    ],
    related: [
      { href: '/blog/ai-diye-quotation-proposal-bangla-guide/', label: 'AI Proposal' },
      { href: '/blog/ai-diye-online-course-banano-bangla-guide/', label: 'Online Course' },
      { href: '/blog/ai-diye-dropshipping-business-bangladesh/', label: 'Dropshipping' },
      { href: '/gamma/', label: 'Gamma AI' },
    ],
  },
];
