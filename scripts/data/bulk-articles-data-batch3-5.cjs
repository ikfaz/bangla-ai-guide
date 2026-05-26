/* Batch 3 — part 5/5 — Industry use cases (41-42) + BD locale exam/skill (43-50) */

module.exports = [
  // 41 — Travel Agency
  {
    slug: 'ai-diye-travel-agency-bangladesh-guide',
    title: 'AI দিয়ে Travel Agency Business — বাংলাদেশি ভ্রমণ ব্যবসার জন্য গাইড',
    description: 'বাংলাদেশি travel agency-র জন্য AI কীভাবে itinerary design, customer inquiry, hotel booking, visa documentation-কে স্বয়ংক্রিয় করতে পারে? Practical workflow ও tool selection।',
    keywords: 'AI travel agency, travel business AI, itinerary AI, AI tourism bangladesh, AI booking automation',
    sections: [
      {
        h2: 'ভূমিকা',
        paragraphs: [
          'বাংলাদেশের travel industry post-COVID দ্রুত recover করছে। কিন্তু margin সংকুচিত, customer expectation বেশি, এবং Skyscanner/Booking-এর মতো platform-এর সাথে compete করতে হয়। AI ছোট agency-কে বড় agency-র mostly capability দিতে পারে।',
        ],
      },
      {
        h2: '১. Custom itinerary design',
        list: [
          '<b>ChatGPT/Claude:</b> Customer brief → day-by-day itinerary',
          '<b>Prompt:</b> "Design a 5-day Bangkok itinerary for Bangladeshi family of 4, budget BDT 80,000 total"',
          '<b>Iterate:</b> Local tip, halal food, family-friendly activity যোগ',
          '<b>Output:</b> PDF brochure (Canva)',
        ],
      },
      {
        h2: '২. Customer inquiry automation',
        list: [
          '<b>WhatsApp chatbot:</b> ManyChat + ChatGPT API',
          '<b>FAQ:</b> Visa requirement, package price, hotel option',
          '<b>Lead qualification:</b> AI screens budget, dates, group size',
          '<b>Human handoff:</b> Complex query → agent',
        ],
      },
      {
        h2: '৩. Visa application support',
        list: [
          'ChatGPT-এ "List documents required for Schengen visa from Bangladesh"',
          'Application form filling guide',
          'Cover letter draft (Bangla → English)',
          'Bank statement analysis script',
        ],
      },
      {
        h2: '৪. Hotel & flight booking automation',
        list: [
          'Skyscanner API + AI compare best deal',
          'Hotel.com + Booking.com price-track',
          'Auto-alert if price drops',
          'Customer specific filter (halal kitchen, beach view)',
        ],
      },
      {
        h2: '৫. Social media marketing',
        list: [
          '<b>Daily destination post:</b> ChatGPT + Midjourney photo',
          '<b>Reel scripts:</b> AI generated',
          '<b>Hashtag research:</b> AI suggest',
          '<b>Customer testimonial collage:</b> Canva AI',
        ],
      },
      {
        h2: '৬. Post-trip engagement',
        list: [
          'Thank you email AI-personalized',
          'Review request automated',
          'Future trip suggestion based on past',
          'Referral program management',
        ],
      },
      {
        h2: '৭. Multilingual capability',
        list: [
          'Bangla, English, Arabic customer base',
          'Live translation in chat',
          'Multi-language brochure',
          'Voice support (mobile users)',
        ],
      },
      {
        h2: 'বাংলাদেশি travel agency-র জন্য AI roadmap',
        list: [
          '<b>Month 1:</b> ChatGPT for itinerary writing (agent productivity)',
          '<b>Month 2:</b> WhatsApp chatbot for FAQ',
          '<b>Month 3:</b> Visual marketing pipeline',
          '<b>Month 4-6:</b> Inquiry-to-booking funnel automation',
        ],
      },
      {
        h2: 'উপসংহার',
        paragraphs: [
          'Travel business-এ "personal touch" সবচেয়ে গুরুত্বপূর্ণ — AI সেটাই বাড়িয়ে দিতে পারে repetitive task automate করে। আপনার পরের client inquiry-তে ChatGPT-এ এক itinerary বানিয়ে দেখুন।',
        ],
      },
    ],
    related: [
      { href: '/blog/ai-customer-service-bangladesh/', label: 'AI Customer Service' },
      { href: '/blog/ai-diye-facebook-page-chalano-bangla/', label: 'AI দিয়ে FB পেজ' },
      { href: '/chatgpt/', label: 'ChatGPT' },
      { href: '/canva-ai/', label: 'Canva AI' },
    ],
  },

  // 42 — Real Estate
  {
    slug: 'ai-diye-real-estate-bproperty-listing-bangla',
    title: 'AI দিয়ে Real Estate ও Property Listing — বাংলাদেশের জন্য গাইড',
    description: 'বাংলাদেশি real estate professional-দের জন্য AI — listing description, virtual tour, lead nurture, market analysis। Bproperty, Bikroy ও নিজস্ব site-এ implement করার practical গাইড।',
    keywords: 'AI real estate bangla, Bproperty AI, property listing AI, real estate agent AI, Bikroy AI',
    sections: [
      {
        h2: 'ভূমিকা',
        paragraphs: [
          'বাংলাদেশের real estate market — Bproperty, Bikroy থেকে Facebook group পর্যন্ত। Property agent ও developer-দের প্রতিদিন listing লেখা, photo edit, customer reply, follow-up — অনেক repetitive কাজ। AI এই সব ৫০-৭০% দ্রুত করতে পারে।',
        ],
      },
      {
        h2: '১. Property listing description',
        list: [
          'ChatGPT prompt: "Write an attractive Bangla property listing for a 3-bedroom Dhanmondi apartment, 1500 sqft, [features]. Include emotional hook, key features, neighborhood pros."',
          'Multi-language: একই listing English + বাংলা',
          'SEO keyword integration',
          'Length variation: short (Bikroy 200 word) vs detailed (own site 800 word)',
        ],
      },
      {
        h2: '২. Property photography enhancement',
        list: [
          '<b>Photoroom:</b> Background cleanup',
          '<b>Sky AI replacement:</b> দুর্দান্ত sunny sky',
          '<b>HDR auto-merge:</b> Dim interior brighten',
          '<b>Virtual staging:</b> Empty room → furnished (Roomstyler AI)',
        ],
      },
      {
        h2: '৩. Virtual tour ও 3D',
        list: [
          'Matterport AI scan',
          'Smartphone-based: Polycam, Scaniverse',
          'AI-narrated walkthrough video',
          'Embed on listing page',
        ],
      },
      {
        h2: '৪. Lead nurturing',
        list: [
          'WhatsApp chatbot: schedule visit, send brochure',
          'Auto-reply on inquiry (24/7 availability)',
          'Lead scoring (serious vs window shopper)',
          'Follow-up sequence automation',
        ],
      },
      {
        h2: '৫. Market analysis',
        list: [
          'Comparable sale analysis (ChatGPT + spreadsheet)',
          'Neighborhood trend report',
          'ROI calculation tool',
          'Buyer affordability scenarios',
        ],
      },
      {
        h2: '৬. Legal document support',
        list: [
          'Sale deed template review',
          'Lease agreement variation',
          'Heir certificate guidance',
          'Khatian/RS understanding',
          'Always with lawyer verification',
        ],
      },
      {
        h2: '৭. Investor presentation (developer-দের জন্য)',
        list: [
          'Gamma AI: project pitch deck',
          'Financial model: Excel + AI',
          'Market opportunity narrative',
          'Investor email outreach',
        ],
      },
      {
        h2: 'বাংলাদেশি real estate agent-এর জন্য workflow',
        list: [
          '<b>Listing day:</b> Photo edit + AI description + multi-platform post',
          '<b>Inquiry response:</b> WhatsApp template + AI personalize',
          '<b>Site visit:</b> Mobile recording → later AI summary for follow-up',
          '<b>Negotiation:</b> ChatGPT script practice',
          '<b>Close:</b> Document checklist + email confirm',
        ],
      },
      {
        h2: 'Bproperty/Bikroy-এ AI feature',
        list: [
          'Bproperty Match AI: buyer preference matching',
          'Smart pricing recommendations',
          'Promoted listing optimization',
          'Future: AR property preview',
        ],
      },
      {
        h2: 'উপসংহার',
        paragraphs: [
          'Real estate business relationship-driven, কিন্তু operation-এ এত repetitive task — AI সেগুলোই accelerate করছে। আজই একটা listing AI দিয়ে rewrite করুন; engagement difference নিজেই দেখুন।',
        ],
      },
    ],
    related: [
      { href: '/blog/ai-product-photography-ecommerce-bangla-guide/', label: 'AI Photography' },
      { href: '/blog/ai-diye-facebook-page-chalano-bangla/', label: 'FB পেজ AI' },
      { href: '/chatgpt/', label: 'ChatGPT' },
      { href: '/canva-ai/', label: 'Canva AI' },
    ],
  },

  // 43 — BCS Preparation
  {
    slug: 'ai-diye-bcs-preparation-sompurno-bangla-guide',
    title: 'AI দিয়ে BCS প্রস্তুতি — Preliminary, Written, Viva সম্পূর্ণ গাইড',
    description: 'BCS Cadre হতে চান? ChatGPT, NotebookLM, Perplexity দিয়ে BCS Preliminary (MCQ), Written ও Viva প্রস্তুতি কীভাবে নেবেন? Practical study workflow ও tool selection।',
    keywords: 'AI BCS preparation, BCS ChatGPT, BCS study AI, BCS bangla, government job AI',
    sections: [
      {
        h2: 'ভূমিকা',
        paragraphs: [
          'BCS — বাংলাদেশের সবচেয়ে প্রতিযোগিতাপূর্ণ পরীক্ষা। প্রতি seat-এ ৩০০+ candidate। তিন স্তর: Prelims (২০০ MCQ), Written (৯০০ marks), Viva (২০০ marks)। AI আপনার দুই বছরের preparation-কে আরো focused, efficient করতে পারে।',
        ],
      },
      {
        h2: 'Preliminary — MCQ অনুশীলন',
        list: [
          '<b>ChatGPT:</b> "Bangladesh history থেকে ২০টি MCQ তৈরি করো, ১৯৭১ Liberation War-এর উপর। সঠিক উত্তর + ব্যাখ্যা সহ"',
          '<b>NotebookLM:</b> NCTB book + reference PDF upload → quiz generation',
          '<b>Daily routine:</b> ৫০ MCQ AI-generated practice',
          '<b>Weak area identify:</b> AI track-এর সাথে',
        ],
      },
      {
        h2: 'Subject-wise AI strategy',
        list: [
          '<b>Bangladesh Affairs:</b> NCTB Class IX-X-এর book NotebookLM-এ',
          '<b>International:</b> Perplexity recent events',
          '<b>Bangla literature:</b> Author bio quiz',
          '<b>English:</b> ChatGPT grammar drill',
          '<b>Math:</b> Step-by-step solution AI explanation',
          '<b>General Science:</b> Concept simplification',
          '<b>ICT:</b> Current tech terms',
        ],
      },
      {
        h2: 'Written (লিখিত) — Essay ও comprehension',
        list: [
          '<b>Essay outline:</b> ChatGPT-এ topic দিন, structure দেবে',
          '<b>Sample essay:</b> AI write করে — পরে নিজে rewrite (essay-writing skill build)',
          '<b>Comprehension:</b> Bangla/English passage AI extract',
          '<b>Translation:</b> Bangla-English-Bangla rotation practice',
          '<b>Mathematical reasoning:</b> Word problem AI solve + explain',
        ],
      },
      {
        h2: 'Current affairs daily update',
        list: [
          '<b>Perplexity daily:</b> "Today\'s top 10 Bangladesh news"',
          '<b>Custom GPT:</b> দৈনিক বাংলা সংবাদ summary',
          '<b>Monthly compilation:</b> AI helps organize',
          '<b>Connection making:</b> "What was the historical context of [event]?"',
        ],
      },
      {
        h2: 'Viva voce প্রস্তুতি',
        list: [
          '<b>ChatGPT roleplay:</b> "তুমি একজন BCS viva board member। আমাকে আমার background দিয়ে questions কর। আমি Computer Science background থেকে।"',
          '<b>Behavioral practice:</b> "Tell me about yourself" — multiple variation',
          '<b>Subject knowledge:</b> Random topic deep dive',
          '<b>Bangla speaking:</b> Voice mode practice',
          '<b>Mock interview:</b> Recording + self-review',
        ],
      },
      {
        h2: 'Study routine — AI-enhanced',
        list: [
          '<b>সকাল ৬-৮:</b> Reading (book) + AI quiz',
          '<b>সকাল ১০-১২:</b> Subject-deep study + Perplexity research',
          '<b>বিকাল ৪-৬:</b> Writing practice + AI feedback',
          '<b>সন্ধ্যা ৭-৯:</b> Current affairs + AI summarize',
          '<b>রাত ১০-১১:</b> NotebookLM audio overview (relax mode)',
        ],
      },
      {
        h2: 'Specific resource',
        list: [
          'NCTB textbooks (Classes 6-12) PDF',
          'Bangladesh Constitution full text',
          'Daily newspaper (Prothom Alo, Star) RSS',
          'Past BCS questions PDF',
          'Reference books (MP3 series, Oracle)',
        ],
      },
      {
        h2: 'মনে রাখার কৌশল',
        list: [
          'Spaced repetition (Anki + AI deck)',
          'Mind map (ChatGPT generate)',
          'Mnemonic creation AI',
          'Story-based memory (events → narrative)',
          'Visual recall (AI image)',
        ],
      },
      {
        h2: 'সতর্কতা',
        list: [
          'AI সব answer 100% সঠিক না — verify',
          'Bangladesh-specific data sometimes outdated',
          'নিজে বই পড়া replace করবে না — supplement',
          'Past papers solve হাতে — speed build জরুরি',
        ],
      },
      {
        h2: 'উপসংহার',
        paragraphs: [
          'BCS-এ আজকের সফল candidate গুরুত্বপূর্ণ ভাবে AI-utilize করছেন। আপনিও আজই ChatGPT + NotebookLM combination শুরু করুন। ২ বছরের consistent study + AI accelerator = cadre হওয়ার সবচেয়ে modern পথ।',
        ],
      },
    ],
    related: [
      { href: '/blog/notebooklm-diye-porashona-students-bangla-guide/', label: 'NotebookLM ছাত্রদের' },
      { href: '/blog/chatgpt-prompt-bangla-50-collection/', label: '৫০ Bangla Prompts' },
      { href: '/chatgpt/', label: 'ChatGPT' },
      { href: '/perplexity-ai/', label: 'Perplexity AI' },
    ],
  },

  // 44 — SSC/HSC Preparation
  {
    slug: 'ai-diye-ssc-hsc-preparation-bangla-guide',
    title: 'AI দিয়ে SSC ও HSC প্রস্তুতি — সম্পূর্ণ বাংলা গাইড ২০২৬',
    description: 'SSC ও HSC পরীক্ষার্থীদের জন্য AI tool কীভাবে study, MCQ practice, math solve, essay writing-এ সাহায্য করবে? Subject-wise practical workflow।',
    keywords: 'AI SSC preparation, AI HSC, ChatGPT student bangla, board exam AI, SSC math AI',
    sections: [
      {
        h2: 'ভূমিকা',
        paragraphs: [
          'SSC/HSC বাংলাদেশের ১৫-১৮ বছরের ছাত্রছাত্রীর প্রথম "high-stakes" পরীক্ষা। ৫-৬ subject, ২ বছর preparation। AI এই দীর্ঘ journey-কে অনেক সহনীয় ও effective করতে পারে।',
        ],
      },
      {
        h2: 'Subject-wise approach',
        subs: [
          {
            h3: 'Physics, Chemistry, Math',
            list: [
              '<b>ChatGPT:</b> Concept explanation বাংলায়',
              '<b>Problem solve:</b> Step-by-step solution',
              '<b>Wolfram + ChatGPT:</b> Math verification',
              '<b>Daily practice:</b> AI generates new problems',
            ],
          },
          {
            h3: 'Biology',
            list: [
              'Diagram explanation',
              'Process flowchart AI generate',
              'Memorization technique (mnemonic)',
              'Quiz from each chapter',
            ],
          },
          {
            h3: 'Bangla',
            list: [
              'রচনা outline সাজানো',
              'কবিতা ও গল্পের explanation',
              'ব্যাকরণ exercise',
              'অনুবাদ practice (English→Bangla)',
            ],
          },
          {
            h3: 'English',
            list: [
              'Paragraph writing assist',
              'Grammar drill',
              'Translation practice',
              'Application/letter format',
              'Reading comprehension Q-bank',
            ],
          },
          {
            h3: 'ICT',
            list: [
              'HTML/Python concept বাংলায়',
              'Code debugging help',
              'Database concept',
              'Past paper MCQ',
            ],
          },
        ],
      },
      {
        h2: 'NCTB book + NotebookLM workflow',
        list: [
          'প্রতি subject-এর NCTB PDF NotebookLM-এ',
          '"Chapter 3 থেকে quiz তৈরি করো" — instant quiz',
          'Audio overview — পথে শুনুন',
          'Connection making across chapters',
        ],
      },
      {
        h2: 'Daily study routine',
        list: [
          '<b>সকাল ৬-৮:</b> Hard subject (Math/Physics) — AI help with stuck problem',
          '<b>স্কুল/কলেজ:</b> Note-taking',
          '<b>বিকাল ৪-৬:</b> Easier subject review + AI MCQ',
          '<b>সন্ধ্যা ৭-৯:</b> Homework + AI guidance',
          '<b>রাত ৯-১০:</b> Revision + tomorrow plan',
        ],
      },
      {
        h2: 'Past papers',
        list: [
          'AI explains how to approach each question type',
          'Time management practice',
          'Common mistake identification',
          'Board-wise pattern recognition',
        ],
      },
      {
        h2: 'Exam stress management',
        list: [
          'AI চাট সংগী — stress কমানোর কথা',
          'Mindfulness exercise (AI guided)',
          'Sleep schedule advise',
          'Motivation message',
        ],
      },
      {
        h2: 'অভিভাবকদের জন্য',
        list: [
          'AI দিয়ে নিজের সন্তানের পড়ার progress check',
          'Subject-specific guidance',
          'Career counseling resource',
          'Anxious moments-এ AI counsellor',
        ],
      },
      {
        h2: 'সতর্কতা',
        list: [
          '<b>AI কখনো শিক্ষকের বিকল্প না</b>',
          'Homework AI-তে copy করা — শেখার বিরোধী',
          'Verify formulas with NCTB',
          'Screen time balance',
        ],
      },
      {
        h2: 'উপসংহার',
        paragraphs: [
          'আজকের SSC/HSC ছাত্র AI-native generation। দেরি না করে সঠিক ব্যবহার শিখুন — শেখার গতি ও আনন্দ দুটোই বাড়বে। NCTB-এর সাথে ChatGPT-কে partner করুন।',
        ],
      },
    ],
    related: [
      { href: '/blog/best-ai-tools-for-students-bangladesh/', label: 'ছাত্রদের জন্য AI টুলস' },
      { href: '/blog/notebooklm-diye-porashona-students-bangla-guide/', label: 'NotebookLM' },
      { href: '/blog/shikkharthider-jonno-ai-tools-ekti-bishodito-nirdeshika/', label: 'শিক্ষার্থী AI গাইড' },
      { href: '/chatgpt/', label: 'ChatGPT' },
    ],
  },

  // 45 — IELTS
  {
    slug: 'ai-diye-ielts-preparation-bangla-guide',
    title: 'AI দিয়ে IELTS প্রস্তুতি — সব ৪ Module-এ Band 7+ পাওয়ার গাইড',
    description: 'IELTS Listening, Reading, Writing, Speaking সব module-এ AI কীভাবে আপনার score বাড়াবে? ChatGPT, ElevenLabs, Speeko — বাংলাদেশি IELTS candidate-দের জন্য সম্পূর্ণ workflow।',
    keywords: 'AI IELTS bangla, IELTS preparation, ChatGPT IELTS, IELTS speaking AI, IELTS writing AI',
    sections: [
      {
        h2: 'ভূমিকা',
        paragraphs: [
          'IELTS Band 7+ পাওয়া অনেক ছাত্রের কাছেই কঠিন — বিশেষ করে Writing ও Speaking-এ। AI feedback ২৪/৭ available, expensive tutor-এর alternative, এবং unlimited practice opportunity দেয়।',
        ],
      },
      {
        h2: 'Writing Task 1 ও 2',
        list: [
          '<b>ChatGPT band scoring:</b> আপনার essay paste → AI gives estimated band + improvement',
          '<b>Sample essay:</b> Topic দিন, AI band 8-9 sample',
          '<b>Vocabulary upgrade:</b> "C1 level synonym" suggest',
          '<b>Structure check:</b> Intro, body para, conclusion alignment',
          '<b>Grammar:</b> Grammarly + ChatGPT',
        ],
      },
      {
        h2: 'Speaking',
        list: [
          '<b>ChatGPT voice mode:</b> Real conversation practice',
          '<b>Part 1, 2, 3 simulation:</b> "Be my IELTS examiner"',
          '<b>Cue card practice:</b> 1 min prep + 2 min speak',
          '<b>Fluency feedback:</b> AI analyzes',
          '<b>Pronunciation:</b> Speeko, ELSA Speak (AI pronunciation app)',
          '<b>Recording self-review:</b> Voice memo → AI transcript + critique',
        ],
      },
      {
        h2: 'Reading',
        list: [
          '<b>Practice passage:</b> AI generates similar style',
          '<b>Question type strategy:</b> Each type-এর approach',
          '<b>Vocabulary boost:</b> Daily 20 academic word with example',
          '<b>Timing practice:</b> AI tracks read speed',
        ],
      },
      {
        h2: 'Listening',
        list: [
          '<b>Cambridge book audio:</b> Native practice',
          '<b>Accent variety:</b> AI suggest UK/AU/NZ podcasts',
          '<b>Transcript review:</b> Mistake identification',
          '<b>Note-taking skill:</b> AI-generated audio + practice',
          '<b>Map/diagram labeling:</b> Practice with AI feedback',
        ],
      },
      {
        h2: 'Daily routine — 3 month plan',
        list: [
          '<b>Month 1:</b> Foundation — vocabulary, grammar, all 4 module assessment',
          '<b>Month 2:</b> Skill build — daily 2 hour, AI feedback heavy',
          '<b>Month 3:</b> Mock test (2/week) + final polish',
        ],
      },
      {
        h2: 'AI tools specifically for IELTS',
        list: [
          '<b>IELTS Pro (app):</b> AI band scoring',
          '<b>e2Language AI:</b> Practice platform',
          '<b>Magoosh:</b> Personalized study',
          '<b>BestMyTest:</b> Mock exam AI scoring',
        ],
      },
      {
        h2: 'বাংলাদেশি candidate-দের জন্য specific tips',
        list: [
          'Mother-tongue interference accent কমান',
          'Bangla-English direct translation এড়ান (especially writing)',
          'Topic familiarity: education, family, technology — culturally adapt',
          'Confident tone: AI helps practice assertion in English',
        ],
      },
      {
        h2: 'Cost-effective study plan',
        list: [
          'ChatGPT Plus ($২০/মাস) — সব কাজ',
          'ELSA Speak Pro ($৭/মাস) — pronunciation specific',
          'Cambridge practice book (used) — ৳৩০০-৫০০',
          'Total monthly: ৳৩,০০০-৪,০০০ (tutor-এর চেয়ে ১/১০)',
        ],
      },
      {
        h2: 'সতর্কতা',
        list: [
          'AI score 100% accurate না — directional only',
          'Examiner human, AI mimic-এ ভিন্নতা থাকতে পারে',
          'Real mock test (British Council/IDP) at least ১-২ দিন',
          'Speaking-এ live partner-ও দরকার (AI alongside)',
        ],
      },
      {
        h2: 'উপসংহার',
        paragraphs: [
          'IELTS preparation-এ AI আপনার unlimited practice partner। আজই ChatGPT voice mode-এ একটি Speaking Part 2 try করুন। Daily 30-minute practice → 3 month-এ ০.৫-১ band improve realistic।',
        ],
      },
    ],
    related: [
      { href: '/chatgpt/', label: 'ChatGPT' },
      { href: '/blog/best-ai-tools-for-students-bangladesh/', label: 'Students AI' },
      { href: '/elevenlabs/', label: 'ElevenLabs' },
      { href: '/blog/ai-diye-mock-interview-job-prostuti-bangla/', label: 'Mock Interview' },
    ],
  },

  // 46 — University Admission
  {
    slug: 'ai-diye-university-admission-prostuti-bangla',
    title: 'AI দিয়ে University Admission প্রস্তুতি — ভর্তি পরীক্ষার বাংলা গাইড',
    description: 'বাংলাদেশের পাবলিক ও প্রাইভেট ভার্সিটির ভর্তি পরীক্ষার জন্য AI কীভাবে practice, MCQ, time management-এ সাহায্য করবে? DU, BUET, IBA, MIST সহ practical strategy।',
    keywords: 'AI university admission, DU admission AI, BUET admission, university preparation bangla, varsity admission AI',
    sections: [
      {
        h2: 'ভূমিকা',
        paragraphs: [
          'বাংলাদেশের ভার্সিটি ভর্তি পরীক্ষা — DU, BUET, RU, JU, IBA, MIST — প্রতিটি ২০-৪০x competition। ৩-৪ মাসের intense preparation। AI আপনার এই preparation-কে structured ও data-driven করতে পারে।',
        ],
      },
      {
        h2: 'Test-wise strategy',
        subs: [
          {
            h3: 'DU (ক, খ, গ, ঘ, চ Unit)',
            list: [
              'ক Unit (Science): Physics, Chemistry, Biology/Math',
              'খ Unit: Bangla, English, GK',
              'গ Unit (Business): Bangla, English, Math, GK',
              'AI-prep: Subject-wise daily target + MCQ',
            ],
          },
          {
            h3: 'BUET',
            list: [
              'Math, Physics, Chemistry — top priority',
              'Difficult MCQ practice',
              'Past papers AI analyze',
              'Conceptual depth — AI explanation',
            ],
          },
          {
            h3: 'IBA, MBA Admission',
            list: [
              'Quant: GMAT-style, AI explanation',
              'Verbal: Critical reasoning practice',
              'Writing: AI feedback',
              'Mock interview practice',
            ],
          },
          {
            h3: 'MIST, Medical, Dental',
            list: [
              'Subject-specific MCQ',
              'Time management drill',
              'Quick recall mnemonic',
            ],
          },
        ],
      },
      {
        h2: 'Day-by-day study workflow',
        list: [
          '<b>সকাল ৫-৭:</b> Hard subject + AI explain stuck topic',
          '<b>৯-১২:</b> MCQ practice (২০০-৩০০/দিন)',
          '<b>বিকাল ৪-৬:</b> Weak area focus',
          '<b>সন্ধ্যা ৭-৯:</b> Revision + AI quiz',
          '<b>রাত:</b> Past paper analyze',
        ],
      },
      {
        h2: 'Past paper analysis',
        list: [
          'AI helps identify recurring topics',
          'Difficulty distribution',
          'Time-per-question average',
          'Common trap detection',
          'Year-by-year trend',
        ],
      },
      {
        h2: 'Mock test ও time management',
        list: [
          'Self-mock weekly',
          'AI feedback on wrong answer pattern',
          'Speed-accuracy balance',
          'Anxiety management',
          'Real exam simulation',
        ],
      },
      {
        h2: 'Personal statement / SoP (for foreign + IBA)',
        list: [
          'ChatGPT draft → personalize heavily',
          'Why this university? — research-based',
          'Goal alignment',
          'Word limit adhere',
          'Multiple iteration',
        ],
      },
      {
        h2: 'Stress management',
        list: [
          'Exam anxiety — AI counselor talk',
          'Healthy sleep schedule',
          'Family pressure handling tip',
          'Daily motivation message',
        ],
      },
      {
        h2: 'Backup planning',
        list: [
          'Multiple ভার্সিটি apply — AI tracker',
          'Private university option research',
          'Foreign opportunity comparison',
          'Decision framework AI assist',
        ],
      },
      {
        h2: 'উপসংহার',
        paragraphs: [
          'University ভর্তি একটি race, কিন্তু distance race। Daily AI-assisted study ৩ মাস consistent — performance ১৫-৩০% boost সম্ভব। আজই start করুন।',
        ],
      },
    ],
    related: [
      { href: '/blog/ai-diye-bcs-preparation-sompurno-bangla-guide/', label: 'BCS প্রস্তুতি' },
      { href: '/blog/ai-diye-ssc-hsc-preparation-bangla-guide/', label: 'SSC/HSC' },
      { href: '/chatgpt/', label: 'ChatGPT' },
      { href: '/blog/best-ai-tools-for-students-bangladesh/', label: 'Student AI' },
    ],
  },

  // 47 — Bangla writing improvement
  {
    slug: 'ai-diye-bangla-likha-improve-guide',
    title: 'AI দিয়ে বাংলা লেখা উন্নত করুন — Writer-দের জন্য সম্পূর্ণ গাইড',
    description: 'বাংলা লেখার দুর্বলতা — ব্যাকরণ, বানান, structure, style — কীভাবে AI দিয়ে কাটিয়ে উঠবেন? Writer, blogger, journalist, student-দের জন্য practical workflow।',
    keywords: 'bangla writing AI, bangla grammar AI, bangla likha improve, bangla writing tool, AI bangla editor',
    sections: [
      {
        h2: 'ভূমিকা',
        paragraphs: [
          'বাংলায় ভালো লেখা — সাবলীল ভাষা, সঠিক ব্যাকরণ, attractive style — শিল্প এবং দক্ষতা দুটোই। AI আপনার দুর্বলতা চিহ্নিত করতে পারে, sample ভালো লেখা দেখাতে পারে, এবং unlimited practice opportunity দেয়।',
        ],
      },
      {
        h2: '১. ব্যাকরণ ও বানান',
        list: [
          '<b>ChatGPT:</b> "এই অনুচ্ছেদে [paste] ব্যাকরণগত ভুল চিহ্নিত করো এবং সঠিক version দাও"',
          '<b>Bangla autocorrect tools:</b> Bornoful, BanglaWord — supplement',
          '<b>Common mistakes:</b> ণ-ন, শ-ষ-স, যুক্তাক্ষর',
          '<b>Practice:</b> AI generates wrong sentences → আপনি correct',
        ],
      },
      {
        h2: '২. বাক্যগঠন (sentence structure)',
        list: [
          'একঘেয়ে structure ভাঙা',
          'সক্রিয় ও কর্মবাচ্য variation',
          'ছোট বড় বাক্য mix',
          'AI rewrite suggestion',
          'Sahitya-vs-চলিত balance',
        ],
      },
      {
        h2: '৩. শব্দভাণ্ডার (vocabulary)',
        list: [
          '<b>ChatGPT:</b> "এই শব্দের ৫টি বাংলা প্রতিশব্দ এবং কোনটি কোন context-এ ব্যবহার্য"',
          'সাহিত্যিক বাংলা শব্দ শেখা',
          'অনুবাদে natural choice',
          'নতুন বাংলা পরিভাষা',
        ],
      },
      {
        h2: '৪. Style ও tone',
        list: [
          'সাংবাদিক style (objective)',
          'সাহিত্যিক (rich imagery)',
          'Academic (precise)',
          'Conversational blog',
          'AI mimic-এ practice',
        ],
      },
      {
        h2: '৫. Long-form content',
        list: [
          'Story arc — AI structure suggest',
          'Article outline',
          'Chapter break',
          'Climax build',
          'Pacing review',
        ],
      },
      {
        h2: '৬. বাংলা SEO content (blogger-এর জন্য)',
        list: [
          'Keyword research (Google trends bangla)',
          'Title formula AI-assisted',
          'Meta description-এ bangla',
          'Heading hierarchy',
          'Internal linking',
        ],
      },
      {
        h2: '৭. লেখার ব্যায়াম (writing exercise)',
        list: [
          '<b>Daily 200 words:</b> AI gives prompt, you write, AI feedback',
          '<b>Imitation:</b> Favorite writer-এর style copy practice',
          '<b>Translation:</b> English → Bangla → English (rotation)',
          '<b>One topic, multiple styles</b>',
        ],
      },
      {
        h2: 'বাংলা-specific AI tools',
        list: [
          '<b>Bangla Speech:</b> Voice-to-text bangla',
          '<b>Google Docs voice typing</b> (Bangla works)',
          '<b>Quillbot:</b> বাংলা সাপোর্ট limited',
          '<b>Avro keyboard + ChatGPT</b> = সবচেয়ে effective combo',
        ],
      },
      {
        h2: 'প্রকৃত উদাহরণ workflow',
        list: [
          'নিজে ১ম draft লিখুন',
          'ChatGPT-তে paste: "ব্যাকরণ check করো"',
          'সংশোধনগুলো accept/reject',
          '"এই অনুচ্ছেদ আরো রোমাঞ্চকর করো" — style upgrade',
          'অন্য কারো (real human) দ্বারা final read',
        ],
      },
      {
        h2: 'উপসংহার',
        paragraphs: [
          'AI বাংলা লেখার শিক্ষক না — কিন্তু feedback giver, sample provider, practice partner। আপনার চিন্তা ও কণ্ঠস্বর অনন্য থাকবে; AI শুধু polish-এ সাহায্য করবে। আজকের কোনো পুরোনো লেখা AI-তে paste করে review চান।',
        ],
      },
    ],
    related: [
      { href: '/blog/ai-diye-content-writing-banglay-shikhun/', label: 'Content Writing' },
      { href: '/blog/ai-diye-blog-lekha-seo-friendly-article-ekti-sompurno-guide/', label: 'AI Blog Writing' },
      { href: '/chatgpt/', label: 'ChatGPT' },
      { href: '/grammarly-er-bikalpo/', label: 'Grammarly বিকল্প' },
    ],
  },

  // 48 — Prompt Engineering
  {
    slug: 'prompt-engineering-bangla-sompurno-guide',
    title: 'Prompt Engineering সম্পূর্ণ বাংলা গাইড — ChatGPT/Claude থেকে Best Output',
    description: 'AI থেকে অসাধারণ output পাওয়ার রহস্য — prompt engineering। নিয়ম, framework (RACE, CO-STAR), advanced technique, ও বাংলায় practical উদাহরণ।',
    keywords: 'prompt engineering bangla, ChatGPT prompt tips, AI prompt guide, prompt framework, advanced prompting',
    sections: [
      {
        h2: 'Prompt Engineering কী?',
        paragraphs: [
          'একই AI tool — একজনের output ভালো, অন্যজনের সাধারণ। পার্থক্য prompt-এ। Prompt Engineering হলো AI-কে সঠিকভাবে instruct করার বিজ্ঞান (এবং কিছুটা শিল্প)। এই গাইডে শিখবেন — কীভাবে এক prompt আপনার output ১০× ভালো করে।',
        ],
      },
      {
        h2: 'মৌলিক ৬ Element-এর prompt',
        list: [
          '<b>Role:</b> "তুমি একজন senior copywriter..."',
          '<b>Task:</b> "একটি Facebook ad copy লেখো..."',
          '<b>Context:</b> "আমার product একটি bangla learning app..."',
          '<b>Format:</b> "৬০ শব্দে, emotional hook দিয়ে শুরু..."',
          '<b>Examples:</b> "যেমন: \'Don\'t learn English. Master it.\'..."',
          '<b>Constraints:</b> "এড়াও cliché, no emoji"',
        ],
      },
      {
        h2: 'জনপ্রিয় Framework',
        subs: [
          {
            h3: 'RACE Framework',
            list: [
              '<b>R</b>ole — AI-কে কী হতে বলছেন',
              '<b>A</b>ction — কী করতে',
              '<b>C</b>ontext — পরিস্থিতি',
              '<b>E</b>xample/Expectation — output sample',
            ],
          },
          {
            h3: 'CO-STAR Framework',
            list: [
              '<b>C</b>ontext',
              '<b>O</b>bjective',
              '<b>S</b>tyle',
              '<b>T</b>one',
              '<b>A</b>udience',
              '<b>R</b>esponse format',
            ],
          },
        ],
      },
      {
        h2: 'Advanced Techniques',
        list: [
          '<b>Chain-of-Thought:</b> "ধাপে ধাপে চিন্তা করো, প্রতিটি ধাপ ব্যাখ্যা সহ"',
          '<b>Few-shot learning:</b> ২-৩টা example দিয়ে pattern শেখান',
          '<b>Role-play:</b> "তুমি একজন interviewer, আমি candidate..."',
          '<b>Self-critique:</b> "এই answer-এর দুর্বলতা চিহ্নিত করো এবং উন্নত version দাও"',
          '<b>Persona:</b> "একজন ৬৫ বছর বয়সী cardiologist হিসেবে উত্তর দাও"',
          '<b>Tree of thought:</b> "৩টি সম্ভাব্য approach সমান বিচার করো"',
        ],
      },
      {
        h2: 'Common ভুল',
        list: [
          'খুব ছোট prompt ("এই বিষয়ে কিছু লেখো")',
          'Format specify না করা',
          'উদাহরণ না দেওয়া',
          'Context skip',
          'Iterate না করা',
          'এক prompt-এ অনেক কাজ',
        ],
      },
      {
        h2: 'Bangla prompting tips',
        list: [
          'বাংলা context + English instruction mix সবচেয়ে effective',
          'উদাহরণ: "Write in Bangla. ৪০০ word blog post on [topic]"',
          'বাংলা output চাইলে output ভাষা specify',
          'Technical term ইংরেজি রাখুন (translation awkward)',
          'বাংলা style: "চলিত" vs "সাধু" specify',
        ],
      },
      {
        h2: 'Iterative prompting',
        list: [
          'First output → "এটাকে আরো emotional করো"',
          '"৩০% সংক্ষিপ্ত করো"',
          '"আরও specific example যোগ করো"',
          '"Tone professional-এ change করো"',
          '"Critique এই output-এর সাথে"',
        ],
      },
      {
        h2: 'Best prompt library তৈরি',
        list: [
          'Notion/Google Doc-এ আপনার সেরা prompt save',
          'Use-case-ভিত্তিক organize',
          'Result note (কোন AI-এ কেমন)',
          'Team-এর সাথে share',
          'নিজের custom GPT তৈরি repetitive কাজে',
        ],
      },
      {
        h2: 'Model-specific tips',
        list: [
          '<b>ChatGPT:</b> Structured prompt লাভ',
          '<b>Claude:</b> XML tag use করে কাজ specify কার্যকর',
          '<b>Gemini:</b> Long context-এ best',
          '<b>Perplexity:</b> Query-style direct',
        ],
      },
      {
        h2: 'উপসংহার',
        paragraphs: [
          'AI-এর সাথে কাজ করা = AI-কে শেখানো কীভাবে কাজ করতে হবে। Prompt engineering শিখলে — আপনি AI dependent নন, AI আপনার শক্তিশালী সহকারী। আজকের একটি কাজে এই framework apply করে দেখুন।',
        ],
      },
    ],
    related: [
      { href: '/blog/chatgpt-prompt-bangla-50-collection/', label: '৫০ Bangla Prompts' },
      { href: '/chatgpt/', label: 'ChatGPT' },
      { href: '/claude/', label: 'Claude AI' },
      { href: '/gemini/', label: 'Gemini' },
    ],
  },

  // 49 — Personal Brand
  {
    slug: 'ai-diye-personal-brand-banano-bangla',
    title: 'AI দিয়ে Personal Brand গড়ুন — LinkedIn, X, YouTube বাংলা গাইড',
    description: 'বাংলাদেশি প্রফেশনালদের জন্য AI ব্যবহার করে LinkedIn, X (Twitter), YouTube-এ personal brand গড়ার সম্পূর্ণ workflow। Niche, content, consistency, monetization।',
    keywords: 'personal brand AI bangla, LinkedIn AI bangla, AI thought leadership, personal branding, X Twitter AI',
    sections: [
      {
        h2: 'ভূমিকা',
        paragraphs: [
          '২০২৬-এ "personal brand" শুধু influencer-এর জন্য না — যেকোনো professional-এর career capital। ভালো personal brand মানে — interview ছাড়াই job offer, freelance client inbound, speaking engagement, এমনকি startup co-founder খুঁজে পাওয়া।',
        ],
      },
      {
        h2: 'প্রথম ধাপ: Niche define',
        list: [
          'ChatGPT-এ: "I work as [job]. My expertise areas: [list]. Help me identify a personal brand niche that\'s narrow enough to dominate but broad enough for content"',
          'উদাহরণ: "AI in Bangladesh SME"; "RMG digital transformation"; "Bangla content marketing"',
          'Test: ৩ মাস in niche stay করতে পারবেন কিনা',
        ],
      },
      {
        h2: 'Content pillar (৩-৫টি)',
        list: [
          'প্রতি pillar = topic theme',
          'উদাহরণ AI Niche-এর: "AI tool reviews", "Case study", "Industry trend", "Tutorial", "Opinion"',
          'AI ব্রেইনস্টর্ম: "Given my niche, suggest 5 content pillars with weekly post ideas"',
          'প্রতি সপ্তাহে প্রতিটি pillar থেকে ১টা',
        ],
      },
      {
        h2: 'LinkedIn (B2B professional)',
        list: [
          '<b>Post frequency:</b> ৩-৫/সপ্তাহ',
          '<b>Format:</b> ১৫০০-২৫০০ character + visual',
          '<b>AI workflow:</b> Topic → ChatGPT outline → personalize → image (Canva AI)',
          '<b>Engagement:</b> Daily ৩০ মিনিট comment + reply',
          '<b>Long-form article:</b> মাসে ১-২ (deeper authority)',
        ],
      },
      {
        h2: 'X / Twitter (rapid thoughts)',
        list: [
          '<b>Post frequency:</b> ১-৩/দিন',
          '<b>Threads:</b> ১/সপ্তাহ deep dive',
          '<b>AI workflow:</b> ChatGPT generates 10 tweet ideas weekly',
          '<b>Bangla audience:</b> Bangla + English mix',
          '<b>Grok:</b> Real-time topic catch',
        ],
      },
      {
        h2: 'YouTube (long-form authority)',
        list: [
          '<b>Frequency:</b> Weekly সেরা',
          '<b>AI workflow:</b> Topic research (Perplexity) → script (ChatGPT) → thumbnail (Canva AI/Midjourney) → caption (Whisper)',
          '<b>Repurpose:</b> Long video → Opus Clip → shorts',
          '<b>Bangla niche-এ low competition</b>',
        ],
      },
      {
        h2: 'Consistency tools',
        list: [
          'Buffer / Hootsuite for scheduling',
          'Notion for content calendar',
          'AI for batch creation (Sunday ২ ঘণ্টা — পুরো সপ্তাহের content)',
          'Automation: Zapier/Make for cross-post',
        ],
      },
      {
        h2: 'Engagement strategy',
        list: [
          'Top 100 in niche follow + engage',
          'Comment thoughtful (AI helps draft)',
          'DM relationship build',
          'Newsletter (Substack, Beehiiv)',
          'Community (Discord/WhatsApp group)',
        ],
      },
      {
        h2: 'Monetization paths',
        list: [
          'Inbound freelance/consulting client',
          'Speaking gigs',
          'Course creation',
          'Affiliate marketing',
          'Sponsored content',
          'Book deal',
          'Job offer (higher salary leverage)',
        ],
      },
      {
        h2: '৯০-দিন launch plan',
        list: [
          '<b>Day 1-7:</b> Niche, pillar define + profile optimize',
          '<b>Day 8-30:</b> Daily LinkedIn post + X engagement',
          '<b>Day 31-60:</b> First YouTube video + newsletter start',
          '<b>Day 61-90:</b> Cross-platform amplification + DM 50 people in niche',
        ],
      },
      {
        h2: 'উপসংহার',
        paragraphs: [
          'Personal brand দ্রুত build হয় না — কিন্তু AI consistency-কে অনেক সহজ করে। আজকের একটি post করুন (যেকোনো platform-এ)। ৯০ দিন consistent করলে — career trajectory পাল্টে যাবে।',
        ],
      },
    ],
    related: [
      { href: '/blog/ai-diye-content-writing-banglay-shikhun/', label: 'Content Writing' },
      { href: '/blog/ai-diye-youtube-video-toiri-sompurno-guide/', label: 'YouTube AI' },
      { href: '/canva-ai/', label: 'Canva AI' },
      { href: '/chatgpt/', label: 'ChatGPT' },
    ],
  },

  // 50 — Data Visualization
  {
    slug: 'ai-diye-data-visualization-bangla-guide',
    title: 'AI দিয়ে Data Visualization — বাংলায় Chart, Infographic, Dashboard',
    description: 'কোনো design skill ছাড়াই AI দিয়ে কীভাবে professional chart, infographic, dashboard বানাবেন? ChatGPT Data Analyst, Flourish, Napkin AI — analyst ও marketer-দের জন্য সম্পূর্ণ গাইড।',
    keywords: 'AI data visualization, chart AI bangla, infographic AI, dashboard AI, data viz tool',
    sections: [
      {
        h2: 'ভূমিকা',
        paragraphs: [
          'Data এক জিনিস, data communicate করা আরেক। Excel-এর সাধারণ chart আজকের audience-কে impress করে না। AI এখন complex visualization-কেও easy করে দিয়েছে।',
        ],
      },
      {
        h2: '১. ChatGPT Data Analyst (Code Interpreter)',
        list: [
          'ChatGPT Plus-এ available',
          'CSV upload → "Visualize monthly sales trend, with breakdown by product category"',
          'AI Python code লিখে chart generate',
          'Iteration: "Make it bar chart instead", "Add labels"',
          'Export PNG/SVG',
        ],
      },
      {
        h2: '২. Flourish (interactive)',
        list: [
          'flourish.studio',
          'Template-based: bar race, sankey, map',
          'AI suggestion (data → best chart type)',
          'Embed in website (interactive)',
          'Free tier-এ public projects',
        ],
      },
      {
        h2: '৩. Napkin AI (text-to-visual)',
        list: [
          'Concept text লিখুন → AI multiple visual representation suggest',
          'Mind map, flowchart, diagram',
          'Brand styling apply',
          'Direct presentation-এ paste',
        ],
      },
      {
        h2: '৪. Tableau / Power BI + AI',
        list: [
          'Tableau Pulse — AI-driven insight',
          'Power BI Copilot — natural language query',
          'Enterprise-grade',
          'Bangladesh-এ corporate-এ adoption বাড়ছে',
        ],
      },
      {
        h2: '৫. Infographic specific',
        list: [
          '<b>Canva Magic Design:</b> Topic দিন → infographic ready',
          '<b>Piktochart:</b> Template + AI',
          '<b>Venngage:</b> Business infographic',
          '<b>Visme:</b> Multi-purpose',
        ],
      },
      {
        h2: 'বাংলাদেশি use case',
        list: [
          '<b>Marketing report:</b> Monthly insight visual',
          '<b>Academic thesis:</b> Survey data chart',
          '<b>NGO impact report:</b> Donor presentation',
          '<b>Newsletter:</b> Newsletter-friendly graphic',
          '<b>Pitch deck:</b> Investor-ready visual',
        ],
      },
      {
        h2: 'Best practices',
        list: [
          '<b>One message per chart</b> — overload না',
          '<b>Color discipline:</b> 2-3 main color',
          '<b>Annotation:</b> Direct attention',
          '<b>Title-এ insight, not just topic</b>',
          '<b>Mobile readability:</b> 50% audience phone-এ দেখে',
        ],
      },
      {
        h2: 'Bangla-specific tip',
        list: [
          'Bangla font (Hind Siliguri) chart label-এ',
          'Number: bangla numeral consideration',
          'Bangladesh map: BBS-source data',
          'Color: cultural sensitivity',
        ],
      },
      {
        h2: 'workflow উদাহরণ — monthly business report',
        list: [
          'Sales data CSV ready',
          'ChatGPT Code Interpreter → ৪টা key chart',
          'Napkin AI → executive summary visual',
          'Canva-তে combine → 1-page PDF report',
          'Total time: ৩০ মিনিট (manual: ৩-৪ ঘণ্টা)',
        ],
      },
      {
        h2: 'উপসংহার',
        paragraphs: [
          'Data visualization হোক simple ও সুন্দর। AI সেটা সম্ভব করেছে। আজকের কোনো একটা spreadsheet নিয়ে ChatGPT-তে paste করে chart চান। আপনার manager/client-এর reaction-এ পার্থক্য দেখবেন।',
        ],
      },
    ],
    related: [
      { href: '/blog/ai-data-analysis-bangla/', label: 'AI Data Analysis' },
      { href: '/blog/ai-diye-excel-kaj-bangla-guide/', label: 'AI Excel' },
      { href: '/canva-ai/', label: 'Canva AI' },
      { href: '/blog/ai-presentation-maker-bangladesh/', label: 'AI Presentation' },
    ],
  },
];
