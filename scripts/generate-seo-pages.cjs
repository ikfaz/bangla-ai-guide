const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const lastmod = "2026-03-05";

const linkPool = [
  ["index.html", "à¦¬à¦¾à¦‚à¦²à¦¾ AI à¦—à¦¾à¦‡à¦¡ à¦¹à§‹à¦®"],
  ["submit.html", "à¦¨à¦¤à§à¦¨ à¦Ÿà§à¦² à¦¸à¦¾à¦¬à¦®à¦¿à¦Ÿ à¦•à¦°à§à¦¨"],
  ["ai-tools-bangladesh-bengali.html", "Bangla AI tools directory"],
  ["chatgpt-bangladesh-theke-bebohar.html", "ChatGPT Bangladesh guide"],
  ["ai-tools-bdt-price-2026-bangladesh.html", "AI tools BDT price 2026"],
  ["bkash-diye-ai-tools-kena-jay.html", "bKash à¦¦à¦¿à¦¯à¦¼à§‡ AI tools à¦•à§‡à¦¨à¦¾"],
  ["vpn-chara-ai-tools-bangladesh.html", "VPN à¦›à¦¾à¦¡à¦¼à¦¾ AI tools Bangladesh"],
];

const mediumPages = [
  {
    slug: "ai-tools-bangladesh-bengali",
    primary: "Bangla AI tools directory",
    title: "Bangla AI tools directory | à¦¬à¦¾à¦‚à¦²à¦¾ AI à¦—à¦¾à¦‡à¦¡",
    description: "Bangla AI tools directory: à¦¬à¦¾à¦‚à¦²à¦¾à¦¦à§‡à¦¶à§‡ à¦¬à§à¦¯à¦¬à¦¹à¦¾à¦°à¦¯à§‹à¦—à§à¦¯ AI à¦Ÿà§à¦²à¦¸, BDT price, payment method à¦à¦¬à¦‚ VPN reality à¦¨à¦¿à¦¯à¦¼à§‡ practical resource hubà¥¤",
    h1: "Bangla AI tools directory: à¦¬à¦¾à¦‚à¦²à¦¾à¦¦à§‡à¦¶à§‡à¦° à¦œà¦¨à§à¦¯ à¦•à¦¿à¦‰à¦°à§‡à¦Ÿà§‡à¦¡ AI resource",
    schemaType: "faq",
    quick: ["à¦à¦‡ à¦ªà§‡à¦œà¦Ÿà¦¿ à¦¬à¦¾à¦‚à¦²à¦¾ AI à¦—à¦¾à¦‡à¦¡à§‡à¦° central directory hubà¥¤", "Bangla readability + English search intent à¦à¦•à¦¸à¦¾à¦¥à§‡ à¦°à¦¾à¦–à¦¾ à¦¹à¦¯à¦¼à§‡à¦›à§‡à¥¤", "à¦²à¦•à§à¦·à§à¦¯: à¦¬à¦¾à¦‚à¦²à¦¾à¦¦à§‡à¦¶à¦¿ user-à¦¦à§‡à¦° à¦¦à§à¦°à§à¦¤ à¦¸à¦ à¦¿à¦• tool à¦¨à¦¿à¦°à§à¦¬à¦¾à¦šà¦¨à¥¤"],
    use: ["Content, coding, image, productivity use-case à¦§à¦°à§‡ tool shortlist à¦•à¦°à§à¦¨à¥¤", "à¦¸à¦¬ category à¦¥à§‡à¦•à§‡ à¦à¦•à¦¸à¦¾à¦¥à§‡ paid tool à¦¨à¦¾ à¦¨à¦¿à¦¯à¦¼à§‡ phased adoption à¦•à¦°à§à¦¨à¥¤", "Monthly re-test à¦•à¦°à§‡ access à¦“ quality à¦¯à¦¾à¦šà¦¾à¦‡ à¦•à¦°à§à¦¨à¥¤"],
    pay: ["USD price à¦¥à§‡à¦•à§‡ BDT estimate à¦•à¦°à§‡ budget cap à¦°à¦¾à¦–à§à¦¨à¥¤", "bKash/card route à¦†à¦—à§‡ à¦¯à¦¾à¦šà¦¾à¦‡ à¦•à¦°à§à¦¨à¥¤", "Low-value subscription à¦¬à¦¾à¦¦ à¦¦à¦¿à¦¯à¦¼à§‡ stack lean à¦°à¦¾à¦–à§à¦¨à¥¤"],
    vpn: ["VPN-free tool daily à¦•à¦¾à¦œà§‡ à¦¬à§‡à¦¶à¦¿ stableà¥¤", "Policy change à¦¹à¦²à§‡ access behavior à¦¬à¦¦à¦²à¦¾à¦¤à§‡ à¦ªà¦¾à¦°à§‡à¥¤", "Backup workflow à¦¥à¦¾à¦•à¦²à§‡ production risk à¦•à¦®à§‡à¥¤"],
    steps: ["Step 1: use-case list à¦•à¦°à§à¦¨à¥¤", "Step 2: free benchmark à¦šà¦¾à¦²à¦¾à¦¨à¥¤", "Step 3: cost-output score à¦¦à¦¿à¦¨à¥¤", "Step 4: best tools shortlist à¦•à¦°à§à¦¨à¥¤", "Step 5: quarterly stack refresh à¦•à¦°à§à¦¨à¥¤"],
    table: [["Use Case", "Starter Stack", "Budget"], ["Content", "LLM + editor", "à§³à§¦-à§³à§¨,à§¨à§¦à§¦"], ["Coding", "AI IDE + chat", "à§³à§¦-à§³à§«,à§«à§¦à§¦"], ["Creator", "Image + voice", "à§³à§¦-à§³à§¬,à§«à§¦à§¦"]],
    faq: [["Bangla AI tools directory à¦•à§€?", "à¦¬à¦¾à¦‚à¦²à¦¾à¦¦à§‡à¦¶-à¦•à§‡à¦¨à§à¦¦à§à¦°à¦¿à¦• à¦Ÿà§à¦² à¦“ à¦—à¦¾à¦‡à¦¡à§‡à¦° à¦•à¦¿à¦‰à¦°à§‡à¦Ÿà§‡à¦¡ à¦¤à¦¾à¦²à¦¿à¦•à¦¾à¥¤"], ["à¦¸à¦¬ à¦Ÿà§à¦² à¦•à¦¿ à¦à¦•à¦‡à¦­à¦¾à¦¬à§‡ à¦•à¦¾à¦œ à¦•à¦°à§‡?", "à¦¨à¦¾, access/payment toolà¦­à§‡à¦¦à§‡ à¦­à¦¿à¦¨à§à¦¨à¥¤"], ["à¦•à§‹à¦¨ frequency-à¦¤à§‡ update à¦•à¦°à¦¬?", "à¦¸à¦¾à¦ªà§à¦¤à¦¾à¦¹à¦¿à¦• content, à¦®à¦¾à¦¸à¦¿à¦• compatibility checkà¥¤"], ["Beginner à¦•à§€à¦­à¦¾à¦¬à§‡ à¦¶à§à¦°à§ à¦•à¦°à¦¬à§‡?", "à¦à¦•à¦Ÿà¦¿ use-case à¦¦à¦¿à¦¯à¦¼à§‡ free stack à¦¶à§à¦°à§ à¦•à¦°à§à¦¨à¥¤"]],
    outbound: ["à¦¬à¦¾à¦‚à¦²à¦¾ AI à¦—à¦¾à¦‡à¦¡ à¦¹à§‹à¦®", "https://banglaaiguide.com/"],
  },
  {
    slug: "chatgpt-bangladesh-theke-bebohar",
    primary: "ChatGPT Bangladesh",
    title: "ChatGPT Bangladesh | à¦¬à¦¾à¦‚à¦²à¦¾ AI à¦—à¦¾à¦‡à¦¡",
    description: "ChatGPT Bangladesh setup, prompt workflow, BDT cost planning à¦à¦¬à¦‚ à¦¬à¦¾à¦‚à¦²à¦¾à¦¦à§‡à¦¶ à¦¥à§‡à¦•à§‡ à¦¬à§à¦¯à¦¬à¦¹à¦¾à¦°à¦¯à§‹à¦—à§à¦¯à¦¤à¦¾ à¦¨à¦¿à¦¯à¦¼à§‡ practical à¦—à¦¾à¦‡à¦¡à¥¤",
    h1: "ChatGPT Bangladesh: à¦¬à¦¾à¦‚à¦²à¦¾à¦¦à§‡à¦¶ à¦¥à§‡à¦•à§‡ à¦¬à§à¦¯à¦¬à¦¹à¦¾à¦° à¦•à¦°à¦¾à¦° à¦ªà§‚à¦°à§à¦£ à¦—à¦¾à¦‡à¦¡",
    schemaType: "article",
    quick: ["à¦à¦‡ à¦ªà§‡à¦œà¦Ÿà¦¿ ChatGPT Bangladesh search intent target à¦•à¦°à§‡ retarget à¦•à¦°à¦¾à¥¤", "à¦¬à¦¾à¦‚à¦²à¦¾à¦¦à§‡à¦¶à¦¿ user-à¦à¦° setup, pricing à¦à¦¬à¦‚ workflow question à¦«à§‹à¦•à¦¾à¦¸ à¦•à¦°à¦¾ à¦¹à¦¯à¦¼à§‡à¦›à§‡à¥¤", "à¦²à¦•à§à¦·à§à¦¯: repeatable à¦“ safe usageà¥¤"],
    use: ["Client communication, research, draft writing à¦à¦¬à¦‚ coding support-à¦ ChatGPT à¦•à¦¾à¦°à§à¦¯à¦•à¦°à¥¤", "à¦¬à¦¾à¦‚à¦²à¦¾ output à¦­à¦¾à¦²à§‹ à¦ªà§‡à¦¤à§‡ context + format prompt-à¦ à¦¦à¦¿à¦¨à¥¤", "Reusable prompts à¦°à¦¾à¦–à¦²à§‡ à¦•à¦¾à¦œ à¦¦à§à¦°à§à¦¤ à¦¹à¦¯à¦¼à¥¤"],
    pay: ["Free plan à¦¦à¦¿à¦¯à¦¼à§‡ à¦¶à§à¦°à§ à¦•à¦°à§‡ value à¦¬à§à¦à§‡ paid plan à¦¨à¦¿à¦¨à¥¤", "BDT conversion à¦§à¦°à§‡ à¦®à¦¾à¦¸à¦¿à¦• budget à¦°à¦¾à¦–à§à¦¨à¥¤", "Team use à¦¹à¦²à§‡ shared prompt library à¦°à¦¾à¦–à§à¦¨à¥¤"],
    vpn: ["Stable login pattern account safety à¦¬à¦¾à¦¡à¦¼à¦¾à¦¯à¦¼à¥¤", "Frequent region switching à¦à¦¡à¦¼à¦¿à¦¯à¦¼à§‡ à¦šà¦²à§à¦¨à¥¤", "Policy-compliant usage à¦¦à§€à¦°à§à¦˜à¦®à§‡à¦¯à¦¼à¦¾à¦¦à¦¿ stability à¦¦à§‡à¦¯à¦¼à¥¤"],
    steps: ["Step 1: account setup à¦¸à¦®à§à¦ªà¦¨à§à¦¨ à¦•à¦°à§à¦¨à¥¤", "Step 2: à§©à¦Ÿà¦¿ default prompt template à¦¬à¦¾à¦¨à¦¾à¦¨à¥¤", "Step 3: feedback loop à¦°à¦¾à¦–à§à¦¨à¥¤", "Step 4: reusable instruction snippets à¦°à¦¾à¦–à§à¦¨à¥¤", "Step 5: weekly output review à¦•à¦°à§à¦¨à¥¤"],
    table: [["Task", "Prompt Focus", "Outcome"], ["Blog draft", "Audience + outline", "Faster draft"], ["Client email", "Tone + action", "Clear reply"], ["Code help", "Error + context", "Actionable fix"]],
    faq: [["ChatGPT Bangladesh à¦¥à§‡à¦•à§‡ à¦¬à§à¦¯à¦¬à¦¹à¦¾à¦° à¦•à¦°à¦¤à§‡ extra setup à¦²à¦¾à¦—à§‡?", "à¦¸à¦¾à¦§à¦¾à¦°à¦£à¦¤ standard signup à¦¯à¦¥à§‡à¦·à§à¦Ÿà¥¤"], ["à¦¬à¦¾à¦‚à¦²à¦¾ output à¦•à¦¿ à¦­à¦¾à¦²à§‹?", "Detailed instruction à¦¦à¦¿à¦²à§‡ à¦­à¦¾à¦² output à¦ªà¦¾à¦“à¦¯à¦¼à¦¾ à¦¯à¦¾à¦¯à¦¼à¥¤"], ["Free plan à¦•à¦¿ à¦•à¦¾à¦°à§à¦¯à¦•à¦°?", "à¦¹à§à¦¯à¦¾à¦, à¦¶à§à¦°à§à¦¤à§‡ validation-à¦à¦° à¦œà¦¨à§à¦¯ à¦¯à¦¥à§‡à¦·à§à¦Ÿà¥¤"], ["Freelancer à¦•à§€à¦­à¦¾à¦¬à§‡ à¦¬à§à¦¯à¦¬à¦¹à¦¾à¦° à¦•à¦°à¦¬à§‡?", "Proposal, research, comms, draft automation-à¦à¥¤"]],
    outbound: ["ChatGPT à¦–à§à¦²à§à¦¨", "https://chat.openai.com"],
  },
  {
    slug: "ai-tools-for-freelancers-bangladesh",
    primary: "AI tools for freelancers Bangladesh",
    title: "AI tools for freelancers Bangladesh | à¦¬à¦¾à¦‚à¦²à¦¾ AI à¦—à¦¾à¦‡à¦¡",
    description: "AI tools for freelancers Bangladesh: à¦ªà§à¦°à¦ªà§‹à¦œà¦¾à¦², à¦°à¦¿à¦¸à¦¾à¦°à§à¦š, à¦¡à§‡à¦²à¦¿à¦­à¦¾à¦°à¦¿ à¦…à¦Ÿà§‹à¦®à§‡à¦¶à¦¨ à¦à¦¬à¦‚ BDT à¦¬à¦¾à¦œà§‡à¦Ÿà§‡ practical à¦Ÿà§à¦² à¦¸à§à¦Ÿà§à¦¯à¦¾à¦•à¥¤",
    h1: "AI tools for freelancers Bangladesh: à¦•à¦¾à¦œà§‡à¦° à¦œà¦¨à§à¦¯ à¦¬à¦¾à¦¸à§à¦¤à¦¬ à¦¸à§à¦Ÿà§à¦¯à¦¾à¦•",
    schemaType: "faq",
    quick: ["Freelancer-à¦¦à§‡à¦° à¦œà¦¨à§à¦¯ AI à¦Ÿà§à¦²à¦¸ à¦®à¦¾à¦¨à§‡ à¦¸à¦°à¦¾à¦¸à¦°à¦¿ output speed à¦¬à§ƒà¦¦à§à¦§à¦¿à¥¤", "à¦à¦‡ à¦—à¦¾à¦‡à¦¡à§‡ à¦¬à¦¾à¦‚à¦²à¦¾à¦¦à§‡à¦¶à¦¿ à¦«à§à¦°à¦¿à¦²à§à¦¯à¦¾à¦¨à§à¦¸ workflow à¦…à¦¨à§à¦¯à¦¾à¦¯à¦¼à§€ à¦¬à§à¦¯à¦¬à¦¹à¦¾à¦°à¦¯à§‹à¦—à§à¦¯ stack à¦¦à§‡à¦¯à¦¼à¦¾ à¦¹à¦¯à¦¼à§‡à¦›à§‡à¥¤", "à¦²à¦•à§à¦·à§à¦¯: à¦•à¦® à¦–à¦°à¦šà§‡ à¦¬à§‡à¦¶à¦¿ deliverableà¥¤"],
    use: ["Proposal, client reply, brief analysis à¦à¦¬à¦‚ delivery polish-à¦ AI à¦Ÿà§à¦²à¦¸ high leverage à¦¦à§‡à¦¯à¦¼à¥¤", "Use-case à¦§à¦°à§‡ stack à¦¸à¦¾à¦œà¦¾à¦²à§‡ tool overlap à¦•à¦®à§‡à¥¤", "Weekly review à¦•à¦°à¦²à§‡ low-value tool à¦¬à¦¾à¦¦ à¦¦à§‡à¦¯à¦¼à¦¾ à¦¸à¦¹à¦œ à¦¹à¦¯à¦¼à¥¤"],
    pay: ["à¦à¦•à¦Ÿà¦¿ paid + free helper model à¦¶à§à¦°à§à¦¤à§‡ à¦¸à¦¬à¦šà§‡à¦¯à¦¼à§‡ à¦•à¦¾à¦°à§à¦¯à¦•à¦°à¥¤", "USD price à¦•à§‡ BDT conversion à¦•à¦°à§‡ monthly cap à¦°à¦¾à¦–à§à¦¨à¥¤", "Renewal reminder à¦¨à¦¾ à¦°à¦¾à¦–à¦²à§‡ à¦…à¦ªà§à¦°à¦¯à¦¼à§‹à¦œà¦¨à§€à¦¯à¦¼ à¦–à¦°à¦š à¦¬à¦¾à¦¡à¦¼à§‡à¥¤"],
    vpn: ["VPN-free tool à¦¹à¦²à§‡ daily client work-à¦ friction à¦•à¦®à§‡à¥¤", "Access unstable tool deadline miss à¦•à¦°à¦¾à¦¤à§‡ à¦ªà¦¾à¦°à§‡à¥¤", "VPN-required flow à¦¹à¦²à§‡ backup stack à¦°à¦¾à¦–à§à¦¨à¥¤"],
    steps: ["Step 1: time-consuming 3à¦Ÿà¦¿ task à¦²à¦¿à¦–à§à¦¨à¥¤", "Step 2: à¦ªà§à¦°à¦¤à¦¿à¦Ÿà¦¿ task-à¦ à¦à¦•à¦Ÿà¦¿ core AI tool à¦¦à¦¿à¦¨à¥¤", "Step 3: à§§à§ª à¦¦à¦¿à¦¨à§‡à¦° benchmark à¦•à¦°à§à¦¨à¥¤", "Step 4: quality+speed score à¦•à¦°à§à¦¨à¥¤", "Step 5: ROI à¦¦à§‡à¦–à§‡ final stack à¦°à¦¾à¦–à§à¦¨à¥¤"],
    table: [["Task", "Tool Type", "Outcome"], ["Proposal", "LLM", "Faster response"], ["Research", "AI Search", "Better insights"], ["Delivery", "Editor AI", "Cleaner output"]],
    faq: [["Freelancer-à¦à¦° à¦ªà§à¦°à¦¥à¦® paid tool à¦•à§‹à¦¨à¦Ÿà¦¿?", "à¦¸à¦¾à¦§à¦¾à¦°à¦£à¦¤ à¦à¦•à¦Ÿà¦¿ à¦¶à¦•à§à¦¤à¦¿à¦¶à¦¾à¦²à§€ LLMà¥¤"], ["Free tool à¦¦à¦¿à¦¯à¦¼à§‡à¦‡ à¦•à¦¿ à¦•à¦¾à¦œ à¦¹à¦¯à¦¼?", "à¦¹à§à¦¯à¦¾à¦, à¦¶à§à¦°à§à¦¤à§‡ à¦¬à§‡à¦¶à¦¿à¦°à¦­à¦¾à¦— à¦•à¦¾à¦œ à¦¹à¦¯à¦¼à¥¤"], ["Budget cap à¦•à¦¤?", "à¦¶à§à¦°à§à¦¤à§‡ à¦†à¦¯à¦¼à§‡à¦° à§«-à§§à§¦%à¥¤"], ["à¦¸à¦¬ à¦Ÿà§à¦² à¦•à¦¿ monthly à¦¨à§‡à¦¬?", "à¦¨à¦¾, value à¦¨à¦¾ à¦ªà§‡à¦²à§‡ à¦¬à¦¾à¦¦ à¦¦à¦¿à¦¨à¥¤"]],
    outbound: ["ChatGPT à¦–à§à¦²à§à¦¨", "https://chat.openai.com"],
  },
  {
    slug: "best-ai-tools-for-content-creators-bangladesh",
    primary: "best AI tools for content creators",
    title: "best AI tools for content creators | à¦¬à¦¾à¦‚à¦²à¦¾ AI à¦—à¦¾à¦‡à¦¡",
    description: "best AI tools for content creators in Bangladesh: idea à¦¥à§‡à¦•à§‡ publish à¦ªà¦°à§à¦¯à¦¨à§à¦¤ creator workflow stack, BDT budget à¦à¦¬à¦‚ tool selection guideà¥¤",
    h1: "best AI tools for content creators: à¦¬à¦¾à¦‚à¦²à¦¾à¦¦à§‡à¦¶à¦¿ creator stack",
    schemaType: "faq",
    quick: ["Creator workflow-à¦ AI à¦¸à¦¬à¦šà§‡à¦¯à¦¼à§‡ à¦¬à§‡à¦¶à¦¿ à¦•à¦¾à¦œ à¦¦à§‡à¦¯à¦¼ ideation à¦“ production speed-à¦à¥¤", "Platform à¦…à¦¨à§à¦¯à¦¾à¦¯à¦¼à§€ stack à¦†à¦²à¦¾à¦¦à¦¾ à¦¹à¦“à¦¯à¦¼à¦¾ à¦¦à¦°à¦•à¦¾à¦°à¥¤", "à¦à¦‡ à¦ªà§‡à¦œà§‡ à¦¬à¦¾à¦‚à¦²à¦¾à¦¦à§‡à¦¶à¦¿ creator-à¦¦à§‡à¦° à¦œà¦¨à§à¦¯ practical setup à¦¦à§‡à¦¯à¦¼à¦¾ à¦¹à¦¯à¦¼à§‡à¦›à§‡à¥¤"],
    use: ["Topic ideation, script, thumbnail concept à¦à¦¬à¦‚ caption-à¦ AI à¦¸à¦®à¦¾à¦¨à¦­à¦¾à¦¬à§‡ usefulà¥¤", "Small team à¦¹à¦²à§‡ role-based tool à¦¨à¦¿à¦°à§à¦¬à¦¾à¦šà¦¨ à¦•à¦°à§à¦¨à¥¤", "Template library à¦°à¦¾à¦–à¦²à§‡ consistent output à¦ªà¦¾à¦“à¦¯à¦¼à¦¾ à¦¯à¦¾à¦¯à¦¼à¥¤"],
    pay: ["One premium + two free model à¦…à¦¨à§‡à¦• creator-à¦à¦° à¦œà¦¨à§à¦¯ à¦¯à¦¥à§‡à¦·à§à¦Ÿà¥¤", "BDT per content à¦¹à¦¿à¦¸à¦¾à¦¬ à¦•à¦°à§à¦¨à¥¤", "Irregular income à¦¹à¦²à§‡ monthly plan saferà¥¤"],
    vpn: ["Publishing week-à¦ unstable tool à¦¬à¦¡à¦¼ à¦à§à¦à¦•à¦¿à¥¤", "VPN-free tools primary pipeline-à¦ à¦°à¦¾à¦–à§à¦¨à¥¤", "Risky tool experimentation-à¦ à¦¸à§€à¦®à¦¾à¦¬à¦¦à§à¦§ à¦°à¦¾à¦–à§à¦¨à¥¤"],
    steps: ["Step 1: pipeline à¦²à¦¿à¦–à§à¦¨ (ideaâ†’scriptâ†’assetâ†’publish)à¥¤", "Step 2: à¦ªà§à¦°à¦¤à¦¿à¦Ÿà¦¿ stage-à¦ core AI tool à¦¦à¦¿à¦¨à¥¤", "Step 3: à§§à§¦à¦Ÿà¦¿ content test à¦•à¦°à§à¦¨à¥¤", "Step 4: CTR/watch-time à¦¦à§‡à¦–à§‡ tune à¦•à¦°à§à¦¨à¥¤", "Step 5: best workflow template à¦•à¦°à§à¦¨à¥¤"],
    table: [["Stage", "Tool Type", "KPI"], ["Ideation", "LLM/Search", "Topic quality"], ["Production", "Script + Voice", "Time saved"], ["Packaging", "Image + Copy", "CTR"]],
    faq: [["Beginner creator à¦•à§‹à¦¨ stack à¦¨à§‡à¦¬à§‡?", "LLM + free image tool + editorà¥¤"], ["Premium à¦•à¦¿ à¦¦à¦°à¦•à¦¾à¦°?", "à¦¸à¦¬ à¦¸à¦®à¦¯à¦¼ à¦¨à¦¯à¦¼à¥¤"], ["AI content monetization-safe?", "Policy-compliant à¦¹à¦²à§‡à¥¤"], ["Budget planning à¦•à§€à¦­à¦¾à¦¬à§‡?", "Per-video cost track à¦•à¦°à§‡à¥¤"]],
    outbound: ["Canva Magic Studio", "https://www.canva.com/magic-studio/"],
  },
  {
    slug: "free-ai-tools-2026-bangladesh",
    primary: "free AI tools 2026 Bangladesh",
    title: "free AI tools 2026 Bangladesh | à¦¬à¦¾à¦‚à¦²à¦¾ AI à¦—à¦¾à¦‡à¦¡",
    description: "free AI tools 2026 Bangladesh: à¦«à§à¦°à¦¿ à¦Ÿà§à¦²à¦¸ à¦¦à¦¿à¦¯à¦¼à§‡ à¦¬à¦¾à¦¸à§à¦¤à¦¬ à¦•à¦¾à¦œ, limit management, upgrade trigger à¦à¦¬à¦‚ budget-saving workflow à¦¬à¦¾à¦‚à¦²à¦¾à¦¯à¦¼à¥¤",
    h1: "free AI tools 2026 Bangladesh: à¦«à§à¦°à¦¿ à¦¸à§à¦Ÿà§à¦¯à¦¾à¦•à§‡ à¦•à¦¾à¦œà§‡à¦° à¦«à¦²",
    schemaType: "faq",
    quick: ["à¦«à§à¦°à¦¿ AI à¦Ÿà§à¦²à¦¸ à¦¦à¦¿à¦¯à¦¼à§‡ 2026-à¦à¦“ practical workflow à¦¸à¦®à§à¦­à¦¬à¥¤", "Limit-aware strategy à¦¨à¦¾ à¦¥à¦¾à¦•à¦²à§‡ free stack à¦­à§‡à¦™à§‡ à¦¯à¦¾à¦¯à¦¼à¥¤", "à¦à¦‡ à¦—à¦¾à¦‡à¦¡à§‡ à¦¬à¦¾à¦‚à¦²à¦¾à¦¦à§‡à¦¶à¦¿ user-à¦à¦° à¦œà¦¨à§à¦¯ tested approach à¦¦à§‡à¦¯à¦¼à¦¾ à¦¹à¦¯à¦¼à§‡à¦›à§‡à¥¤"],
    use: ["Students, starter freelancer à¦à¦¬à¦‚ small business-à¦ free tools high ROI à¦¦à§‡à¦¯à¦¼à¥¤", "Credit/message cap track à¦•à¦°à¦¾ à¦œà¦°à§à¦°à¦¿à¥¤", "Single tool dependency à¦à¦¡à¦¼à¦¿à¦¯à¦¼à§‡ combo stack à¦°à¦¾à¦–à§à¦¨à¥¤"],
    pay: ["Bottleneck à¦ªà§à¦°à¦®à¦¾à¦£à¦¿à¦¤ à¦¹à¦²à§‡ à¦¤à¦¬à§‡à¦‡ paid upgrade à¦¨à¦¿à¦¨à¥¤", "BDT conversion à¦§à¦°à§‡ savings à¦¹à¦¿à¦¸à¦¾à¦¬ à¦•à¦°à§à¦¨à¥¤", "à¦…à¦ªà§à¦°à¦¯à¦¼à§‹à¦œà¦¨à§€à¦¯à¦¼ upgrade à¦à¦¡à¦¼à¦¾à¦¤à§‡ monthly review à¦•à¦°à§à¦¨à¥¤"],
    vpn: ["Free tool policy à¦¦à§à¦°à§à¦¤ à¦¬à¦¦à¦²à¦¾à¦¤à§‡ à¦ªà¦¾à¦°à§‡, monthly check à¦•à¦°à§à¦¨à¥¤", "VPN-required à¦¹à¦²à§‡ backup free option à¦°à¦¾à¦–à§à¦¨à¥¤", "VPN-free tools daily use habit à¦¤à§ˆà¦°à¦¿ à¦•à¦°à§‡à¥¤"],
    steps: ["Step 1: 3à¦Ÿà¦¿ core à¦•à¦¾à¦œ à¦ à¦¿à¦• à¦•à¦°à§à¦¨à¥¤", "Step 2: à¦ªà§à¦°à¦¤à¦¿ à¦•à¦¾à¦œà§‡ 2à¦Ÿà¦¿ free tool shortlist à¦•à¦°à§à¦¨à¥¤", "Step 3: à§§à§ª à¦¦à¦¿à¦¨à§‡à¦° usage log à¦°à¦¾à¦–à§à¦¨à¥¤", "Step 4: output quality score à¦•à¦°à§à¦¨à¥¤", "Step 5: à¦¦à¦°à¦•à¦¾à¦° à¦¹à¦²à§‡ only one paid upgrade à¦¨à¦¿à¦¨à¥¤"],
    table: [["Category", "Free Option", "Limit"], ["LLM", "Chat tier", "Message cap"], ["Image", "Free credits", "Monthly cap"], ["Coding", "IDE assist", "Feature lock"]],
    faq: [["à¦«à§à¦°à¦¿ stack à¦•à¦¿ client à¦•à¦¾à¦œà§‡ à¦šà¦²à§‡?", "à¦¹à§à¦¯à¦¾à¦, QA à¦•à¦°à¦²à§‡ à¦šà¦²à§‡à¥¤"], ["à¦•à¦–à¦¨ paid à¦¹à¦“à¦¯à¦¼à¦¾ à¦‰à¦šà¦¿à¦¤?", "Limit business impact à¦•à¦°à¦²à§‡à¥¤"], ["à¦¸à¦¬ free tool à¦•à¦¿ stable?", "à¦¨à¦¾, retest à¦¦à¦°à¦•à¦¾à¦°à¥¤"], ["Free-first strategy à¦•à¦¿ à¦Ÿà§‡à¦•à¦¸à¦‡?", "à¦¹à§à¦¯à¦¾à¦, structured à¦¹à¦²à§‡à¥¤"]],
    outbound: ["Perplexity free", "https://www.perplexity.ai"],
  },
  {
    slug: "ai-image-generator-free-bangladesh",
    primary: "AI image generator free Bangladesh",
    title: "AI image generator free Bangladesh | à¦¬à¦¾à¦‚à¦²à¦¾ AI à¦—à¦¾à¦‡à¦¡",
    description: "AI image generator free Bangladesh à¦—à¦¾à¦‡à¦¡: prompt workflow, free credit strategy, output QA à¦à¦¬à¦‚ creator-ready visual production à¦¬à¦¾à¦‚à¦²à¦¾à¦¯à¦¼à¥¤",
    h1: "AI image generator free Bangladesh: free visual workflow",
    schemaType: "article",
    quick: ["Free image generator à¦¦à¦¿à¦¯à¦¼à§‡ social visual à¦¦à§à¦°à§à¦¤ à¦¤à§ˆà¦°à¦¿ à¦•à¦°à¦¾ à¦¯à¦¾à¦¯à¦¼à¥¤", "Prompt template à¦¨à¦¾ à¦¥à¦¾à¦•à¦²à§‡ quality inconsistent à¦¹à¦¯à¦¼à¥¤", "à¦à¦‡ à¦—à¦¾à¦‡à¦¡à§‡ concept à¦¥à§‡à¦•à§‡ publish-ready flow à¦¦à§‡à¦¯à¦¼à¦¾ à¦†à¦›à§‡à¥¤"],
    use: ["Thumbnail, ad concept, blog cover à¦à¦¬à¦‚ social post visual-à¦ free tools à¦•à¦¾à¦°à§à¦¯à¦•à¦°à¥¤", "A/B prompt testing à¦•à¦°à¦²à§‡ output improve à¦¹à¦¯à¦¼à¥¤", "Publish à¦†à¦—à§‡ manual QA à¦œà¦°à§à¦°à¦¿à¥¤"],
    pay: ["Free credit à¦¶à§‡à¦· à¦¹à¦²à§‡ production plan à¦¬à¦¾à¦¨à¦¾à¦¨à¥¤", "Client à¦•à¦¾à¦œà§‡ premium fallback à¦°à¦¾à¦–à§à¦¨à¥¤", "BDT per asset à¦¹à¦¿à¦¸à¦¾à¦¬ à¦•à¦°à§à¦¨à¥¤"],
    vpn: ["Region issue à¦†à¦—à§‡ test à¦•à¦°à§à¦¨à¥¤", "VPN-dependent tool à¦•à§‡ primary stack à¦•à¦°à¦¬à§‡à¦¨ à¦¨à¦¾à¥¤", "Stable tool à¦¦à¦¿à¦¯à¦¼à§‡ prompt library à¦¬à¦¾à¦¨à¦¾à¦¨à¥¤"],
    steps: ["Step 1: visual brief à¦²à¦¿à¦–à§à¦¨à¥¤", "Step 2: à§§à§¦à¦Ÿà¦¿ prompt variation à¦šà¦¾à¦²à¦¾à¦¨à¥¤", "Step 3: best outputs refine à¦•à¦°à§à¦¨à¥¤", "Step 4: editor-à¦ final touch à¦¦à¦¿à¦¨à¥¤", "Step 5: policy/license check à¦•à¦°à§‡ publish à¦•à¦°à§à¦¨à¥¤"],
    table: [["Goal", "Workflow", "Result"], ["Thumbnail", "Prompt + overlay", "Clickable asset"], ["Ad concept", "Batch gen", "Idea direction"], ["Blog cover", "Template style", "Brand consistency"]],
    faq: [["Free image tool commercial use à¦¹à¦¬à§‡?", "License terms à¦¦à§‡à¦–à§‡ à¦¬à§à¦¯à¦¬à¦¹à¦¾à¦° à¦•à¦°à§à¦¨à¥¤"], ["Prompt à¦•à§‡à¦®à¦¨ à¦²à¦¿à¦–à¦¬?", "Style+subject+format à¦¸à§à¦ªà¦·à§à¦Ÿ à¦¦à¦¿à¦¨à¥¤"], ["Beginner à¦•à§‹à¦¥à¦¾ à¦¥à§‡à¦•à§‡ à¦¶à§à¦°à§?", "Simple template à¦¦à¦¿à¦¯à¦¼à§‡ iterative test à¦•à¦°à§à¦¨à¥¤"], ["à¦¸à¦¬ à¦•à¦¾à¦œà§‡ premium à¦²à¦¾à¦—à¦¬à§‡?", "à¦¨à¦¾, use-case basedà¥¤"]],
    outbound: ["Adobe Firefly", "https://firefly.adobe.com"],
  },
  {
    slug: "best-ai-coding-tools-for-beginners-bangladesh",
    primary: "best AI coding tools for beginners",
    title: "best AI coding tools for beginners | à¦¬à¦¾à¦‚à¦²à¦¾ AI à¦—à¦¾à¦‡à¦¡",
    description: "best AI coding tools for beginners in Bangladesh: à¦¶à§‡à¦–à¦¾ + project build-à¦à¦° à¦œà¦¨à§à¦¯ beginner-safe AI coding workflow, cost planning à¦à¦¬à¦‚ tool selectionà¥¤",
    h1: "best AI coding tools for beginners: à¦¬à¦¾à¦‚à¦²à¦¾à¦¦à§‡à¦¶à¦¿ learner guide",
    schemaType: "faq",
    quick: ["AI coding tool beginner-à¦¦à§‡à¦° à¦¶à§‡à¦–à¦¾à¦° à¦—à¦¤à¦¿ à¦¬à¦¾à¦¡à¦¼à¦¾à¦¯à¦¼à¥¤", "Blind copy à¦•à¦°à¦²à§‡ dependency à¦¬à¦¾à¦¡à¦¼à§‡à¥¤", "à¦à¦‡ à¦—à¦¾à¦‡à¦¡à§‡ learning-first setup à¦¦à§‡à¦¯à¦¼à¦¾ à¦¹à¦¯à¦¼à§‡à¦›à§‡à¥¤"],
    use: ["Concept explanation, debugging à¦à¦¬à¦‚ starter project scaffold-à¦ AI usefulà¥¤", "Problem statement à¦²à¦¿à¦–à§‡ prompt à¦¦à¦¿à¦²à§‡ à¦¨à¦¿à¦°à§à¦­à§à¦²à¦¤à¦¾ à¦¬à¦¾à¦¡à¦¼à§‡à¥¤", "Generated code test à¦›à¦¾à¦¡à¦¼à¦¾ merge à¦•à¦°à¦¬à§‡à¦¨ à¦¨à¦¾à¥¤"],
    pay: ["Free tier + one low-cost tool à¦¦à¦¿à¦¯à¦¼à§‡ à¦¶à§à¦°à§ à¦•à¦°à§à¦¨à¥¤", "Daily usage stable à¦¹à¦²à§‡ paid evaluate à¦•à¦°à§à¦¨à¥¤", "BDT budget cap maintain à¦•à¦°à§à¦¨à¥¤"],
    vpn: ["Stable IDE access learning momentum à¦§à¦°à§‡ à¦°à¦¾à¦–à§‡à¥¤", "VPN issue à¦¬à§‡à¦¶à¦¿ à¦¹à¦²à§‡ alternate tool à¦°à¦¾à¦–à§à¦¨à¥¤", "Policy-safe usage long-term à¦¦à¦°à¦•à¦¾à¦°à¥¤"],
    steps: ["Step 1: language goal à¦ à¦¿à¦• à¦•à¦°à§à¦¨à¥¤", "Step 2: à¦ªà§à¦°à¦¤à¦¿à¦¦à¦¿à¦¨ à§§à¦Ÿà¦¿ coding problem AI à¦¸à¦¹ solve à¦•à¦°à§à¦¨à¥¤", "Step 3: generated code à¦¨à¦¿à¦œà§‡ explain à¦•à¦°à§à¦¨à¥¤", "Step 4: tests à¦²à¦¿à¦–à§‡ validate à¦•à¦°à§à¦¨à¥¤", "Step 5: weekly mini-project build à¦•à¦°à§à¦¨à¥¤"],
    table: [["Stage", "Tool", "Benefit"], ["Concept", "AI Tutor", "Clarity"], ["Build", "AI IDE", "Speed"], ["Debug", "Error Explainer", "Direction"]],
    faq: [["AI à¦¦à¦¿à¦¯à¦¼à§‡ à¦¶à¦¿à¦–à¦¬ à¦¨à¦¾à¦•à¦¿ manual?", "à¦¦à§à¦Ÿà§‹ à¦®à¦¿à¦¶à¦¿à¦¯à¦¼à§‡ à¦¶à¦¿à¦–à§à¦¨à¥¤"], ["AI code copy safe?", "à¦¨à¦¾, review+test à¦¬à¦¾à¦§à§à¦¯à¦¤à¦¾à¦®à§‚à¦²à¦•à¥¤"], ["Beginner budget à¦•à¦¤?", "Free-first modelà¥¤"], ["à¦•à¦–à¦¨ paid coding tool?", "Productivity gain à¦ªà§à¦°à¦®à¦¾à¦£à¦¿à¦¤ à¦¹à¦²à§‡à¥¤"]],
    outbound: ["GitHub Copilot", "https://github.com/features/copilot"],
  },
  {
    slug: "ai-tools-for-youtube-bangladesh",
    primary: "AI tools for YouTube Bangladesh",
    title: "AI tools for YouTube Bangladesh | à¦¬à¦¾à¦‚à¦²à¦¾ AI à¦—à¦¾à¦‡à¦¡",
    description: "AI tools for YouTube Bangladesh: script, thumbnail, voice à¦à¦¬à¦‚ publish optimization workflow-à¦à¦° à¦œà¦¨à§à¦¯ practical creator guide à¦¬à¦¾à¦‚à¦²à¦¾à¦¯à¦¼à¥¤",
    h1: "AI tools for YouTube Bangladesh: creator production stack",
    schemaType: "faq",
    quick: ["YouTube workflow-à¦ AI à¦¸à¦¬à¦šà§‡à¦¯à¦¼à§‡ à¦¬à§‡à¦¶à¦¿ à¦•à¦¾à¦œ à¦¦à§‡à¦¯à¦¼ speed à¦“ consistency-à¦¤à§‡à¥¤", "à¦à¦‡ à¦ªà§‡à¦œà§‡ à¦¬à¦¾à¦‚à¦²à¦¾à¦¦à§‡à¦¶à¦¿ creator use-case à¦§à¦°à§‡ tool mapping à¦•à¦°à¦¾ à¦¹à¦¯à¦¼à§‡à¦›à§‡à¥¤", "à¦²à¦•à§à¦·à§à¦¯: quality à¦¬à¦œà¦¾à¦¯à¦¼ à¦°à§‡à¦–à§‡ à¦¦à§à¦°à§à¦¤ publishà¥¤"],
    use: ["Topic research, hook writing, script drafting, thumbnail à¦à¦¬à¦‚ subtitle-à¦ AI à¦¬à§à¦¯à¦¬à¦¹à¦¾à¦° à¦•à¦°à§à¦¨à¥¤", "Template-driven pipeline à¦›à¦¾à¦¡à¦¼à¦¾ long-term consistency à¦•à¦ à¦¿à¦¨à¥¤", "Analytics feedback loop à¦¦à¦¿à¦¯à¦¼à§‡ prompt à¦‰à¦¨à§à¦¨à¦¤ à¦•à¦°à§à¦¨à¥¤"],
    pay: ["Start with free + one paid core tool.", "Per-video BDT cost track à¦•à¦°à§à¦¨à¥¤", "Growth stable à¦¹à¦²à§‡ advanced plan à¦¨à¦¿à¦¨à¥¤"],
    vpn: ["Upload week-à¦ access fail à¦¹à¦²à§‡ schedule à¦¨à¦·à§à¦Ÿ à¦¹à¦¯à¦¼à¥¤", "VPN-free tools primary pipeline à¦°à¦¾à¦–à§à¦¨à¥¤", "Risky tools experiment-only à¦°à¦¾à¦–à§à¦¨à¥¤"],
    steps: ["Step 1: niche topic bank à¦¤à§ˆà¦°à¦¿ à¦•à¦°à§à¦¨à¥¤", "Step 2: script outline AI à¦¦à¦¿à¦¯à¦¼à§‡ à¦•à¦°à§à¦¨à¥¤", "Step 3: thumbnail concept batch à¦¬à¦¾à¦¨à¦¾à¦¨à¥¤", "Step 4: voice/subtitle finalize à¦•à¦°à§à¦¨à¥¤", "Step 5: CTR + retention à¦¦à§‡à¦–à§‡ iterate à¦•à¦°à§à¦¨à¥¤"],
    table: [["Stage", "AI Type", "KPI"], ["Research", "LLM/Search", "Topic relevance"], ["Production", "Script+Voice", "Publish speed"], ["Packaging", "Title+Thumb AI", "CTR"]],
    faq: [["YouTube creator-à¦à¦° à¦ªà§à¦°à¦¥à¦® AI tool à¦•à§‹à¦¨à¦Ÿà¦¿?", "Script à¦¸à¦¹à¦¾à¦¯à¦¼à¦• LLMà¥¤"], ["AI voice monetization-safe?", "Policy à¦®à§‡à¦¨à§‡ à¦¬à§à¦¯à¦¬à¦¹à¦¾à¦° à¦•à¦°à§à¦¨à¥¤"], ["Daily upload-à¦ AI à¦¦à¦°à¦•à¦¾à¦°?", "Consistency-à¦à¦° à¦œà¦¨à§à¦¯ à¦–à§à¦¬ usefulà¥¤"], ["Budget à¦•à¦® à¦¹à¦²à§‡?", "Free stack à¦¦à¦¿à¦¯à¦¼à§‡ à¦¶à§à¦°à§ à¦•à¦°à§à¦¨à¥¤"]],
    outbound: ["YouTube Studio", "https://studio.youtube.com"],
  },
];

function faqSchema(url, faq) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    inLanguage: "bn-BD",
    url,
    mainEntity: faq.map(([q, a]) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  };
}

function articleSchema(url, page) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: page.h1,
    description: page.description,
    inLanguage: "bn-BD",
    url,
    mainEntityOfPage: url,
    author: { "@type": "Organization", name: "à¦¬à¦¾à¦‚à¦²à¦¾ AI à¦—à¦¾à¦‡à¦¡" },
    publisher: { "@type": "Organization", name: "à¦¬à¦¾à¦‚à¦²à¦¾ AI à¦—à¦¾à¦‡à¦¡" },
    datePublished: lastmod,
    dateModified: lastmod,
  };
}

function renderTable(rows) {
  const [head, ...body] = rows;
  return `<div class="seo-table-wrap"><table class="seo-table"><thead><tr>${head.map((x) => `<th>${x}</th>`).join("")}</tr></thead><tbody>${body.map((row) => `<tr>${row.map((x) => `<td>${x}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`;
}

function renderPage(page) {
  const file = `${page.slug}.html`;
  const url = `https://banglaaiguide.com/${file}`;
  const schema = page.schemaType === "article" ? articleSchema(url, page) : faqSchema(url, page.faq);
  const related = [...linkPool, ...mediumPages.map((p) => [`${p.slug}.html`, p.primary])]
    .filter(([href], idx, arr) => arr.findIndex((x) => x[0] === href) === idx && href !== file)
    .slice(0, 6)
    .map(([href, text]) => `<li><a href="${href}">${text}</a></li>`)
    .join("");

  return `<!DOCTYPE html>
<html lang="bn">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <link rel="icon" type="image/png" href="/favicon-96x96.png" sizes="96x96" />
  <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
  <link rel="shortcut icon" href="/favicon.ico" />
  <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
  <meta name="apple-mobile-web-app-title" content="MyWebSite" />
  <link rel="manifest" href="/site.webmanifest" />
  <meta name="theme-color" content="#059669" />
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-X760BSGQCC"></script>
  <script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-X760BSGQCC');</script>
  <title>${page.title}</title>
  <meta name="description" content="${page.description}" />
  <link rel="canonical" href="${url}" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;500;600;700&family=Syne:wght@500;700;800&display=swap" />
  <link href="https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;500;600;700&family=Syne:wght@500;700;800&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="css/style.css" />
  <script type="application/ld+json">${JSON.stringify(schema)}</script>
  <script src="js/seo-pages.js" defer></script>
</head>
<body data-page-slug="${page.slug}">
  <header class="navbar" id="top"><div class="container navbar-inner"><a href="index.html" class="logo" aria-label="à¦¬à¦¾à¦‚à¦²à¦¾ AI à¦—à¦¾à¦‡à¦¡ à¦¹à§‹à¦®"><img class="logo-mark" src="/favicon.svg" alt="বাংলা AI গাইড লোগো" width="28" height="28" decoding="async" /><span class="logo-text">বাংলা AI গাইড</span></a><button class="hamburger" id="hamburgerBtn" type="button" aria-expanded="false" aria-controls="mobileMenu" aria-label="à¦®à§‡à¦¨à§ à¦Ÿà¦—à¦² à¦•à¦°à§à¦¨"><span></span><span></span><span></span></button><div class="nav-desktop"><nav class="nav-links" aria-label="à¦ªà§à¦°à¦§à¦¾à¦¨ à¦¨à§à¦¯à¦¾à¦­à¦¿à¦—à§‡à¦¶à¦¨"><a href="index.html#toolsSection">à¦Ÿà§à¦²à¦¸ à¦¦à§‡à¦–à§à¦¨</a><a href="index.html#categoryTabs">à¦•à§à¦¯à¦¾à¦Ÿà¦¾à¦—à¦°à¦¿</a><a href="index.html#newsletter">à¦¨à¦¿à¦‰à¦œà¦²à§‡à¦Ÿà¦¾à¦°</a></nav><a href="submit.html" class="btn btn-primary">à¦Ÿà§à¦² à¦¸à¦¾à¦¬à¦®à¦¿à¦Ÿ à¦•à¦°à§à¦¨</a></div></div><div class="mobile-menu" id="mobileMenu" aria-hidden="true"><a href="index.html#toolsSection">à¦Ÿà§à¦²à¦¸ à¦¦à§‡à¦–à§à¦¨</a><a href="index.html#categoryTabs">à¦•à§à¦¯à¦¾à¦Ÿà¦¾à¦—à¦°à¦¿</a><a href="index.html#newsletter">à¦¨à¦¿à¦‰à¦œà¦²à§‡à¦Ÿà¦¾à¦°</a><a href="submit.html" class="btn btn-primary mobile-cta">à¦Ÿà§à¦² à¦¸à¦¾à¦¬à¦®à¦¿à¦Ÿ à¦•à¦°à§à¦¨</a></div></header>
  <main class="seo-main">
    <article class="container seo-article-page">
      <nav class="breadcrumb" aria-label="Breadcrumb"><a href="index.html">à¦¹à§‹à¦®</a><span>&gt;</span><span>${page.primary}</span></nav>
      <h1>${page.h1}</h1>
      ${page.quick.map((x) => `<p class="seo-lead">${x}</p>`).join("")}
      <section class="seo-block"><h2>à¦¬à¦¾à¦‚à¦²à¦¾à¦¦à§‡à¦¶à§‡ à¦¬à§à¦¯à¦¬à¦¹à¦¾à¦°à¦¯à§‹à¦—à§à¦¯à¦¤à¦¾</h2>${page.use.map((x) => `<p>${x}</p>`).join("")}</section>
      <section class="seo-block"><h2>Payment/Price Context (BDT + bKash)</h2>${page.pay.map((x) => `<p>${x}</p>`).join("")}</section>
      <section class="seo-block"><h2>VPN Requirement Reality</h2>${page.vpn.map((x) => `<p>${x}</p>`).join("")}</section>
      <section class="seo-block"><h2>Step-by-step à¦¬à§à¦¯à¦¬à¦¹à¦¾à¦° à¦ªà¦¦à§à¦§à¦¤à¦¿</h2><ol class="seo-steps">${page.steps.map((x) => `<li>${x}</li>`).join("")}</ol></section>
      <section class="seo-block"><h2>à¦¦à§à¦°à§à¦¤ à¦¤à§à¦²à¦¨à¦¾à¦®à§‚à¦²à¦• à¦Ÿà§‡à¦¬à¦¿à¦²</h2>${renderTable(page.table)}</section>
      <section class="seo-block"><h2>FAQ</h2>${page.faq.map(([q, a]) => `<article class="seo-faq-item"><h3>${q}</h3><p>${a}</p></article>`).join("")}</section>
      <section class="seo-cta-block"><h2>à¦ªà¦°à¦¬à¦°à§à¦¤à§€ à¦§à¦¾à¦ª</h2><p>à¦†à¦°à¦“ AI resource à¦¦à§‡à¦–à¦¤à§‡ index-à¦ à¦¯à¦¾à¦¨ à¦…à¦¥à¦¬à¦¾ à¦¨à¦¤à§à¦¨ tool submit à¦•à¦°à§à¦¨à¥¤</p><div class="seo-cta-actions"><a class="btn btn-primary" data-cluster-cta="index" href="index.html">à¦¸à¦¬ à¦Ÿà§à¦² à¦¦à§‡à¦–à§à¦¨</a><a class="btn btn-ghost" data-cluster-cta="submit" href="submit.html">à¦Ÿà§à¦² à¦¸à¦¾à¦¬à¦®à¦¿à¦Ÿ à¦•à¦°à§à¦¨</a><a class="btn btn-ghost" data-outbound-affiliate="true" href="${page.outbound[1]}" target="_blank" rel="nofollow noopener noreferrer">${page.outbound[0]}</a></div></section>
      <section class="seo-block"><h2>Bangladesh AI Resources</h2><ul class="seo-links-list">${related}</ul></section>
    </article>
  </main>
  <footer class="site-footer"><div class="container footer-inner"><p class="footer-brand"><img class="logo-mark" src="/favicon.svg" alt="বাংলা AI গাইড লোগো" width="20" height="20" decoding="async" /><span>বাংলা AI গাইড</span></p><p>Â© à§¨à§¦à§¨à§¬ à¦¬à¦¾à¦‚à¦²à¦¾ AI à¦—à¦¾à¦‡à¦¡ Â· à¦¬à¦¾à¦‚à¦²à¦¾à¦¦à§‡à¦¶à§‡à¦° à¦œà¦¨à§à¦¯ à¦¤à§ˆà¦°à¦¿</p><nav class="footer-links" aria-label="à¦«à§à¦Ÿà¦¾à¦° à¦²à¦¿à¦‚à¦•"><a href="submit.html">à¦Ÿà§à¦² à¦¸à¦¾à¦¬à¦®à¦¿à¦Ÿ</a><a href="index.html#newsletter">à¦¬à¦¿à¦œà§à¦žà¦¾à¦ªà¦¨</a><a href="privacy.html">à¦ªà§à¦°à¦¾à¦‡à¦­à§‡à¦¸à¦¿</a><a href="index.html#newsletter">à¦¯à§‹à¦—à¦¾à¦¯à§‹à¦—</a></nav></div></footer>
</body>
</html>`;
}

for (const page of mediumPages) {
  fs.writeFileSync(path.join(root, `${page.slug}.html`), renderPage(page), "utf8");
}

console.log(`Generated ${mediumPages.length} medium SEO pages`);

