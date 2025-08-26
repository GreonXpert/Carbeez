// services/gemini.js
// NOTE: You need to set up environment variables for Expo.
// Create a file named .env in your root directory and add:
// REACT_APP_GEMINI_API_KEY="YOUR_API_KEY"
// Then, install `expo-constants` by running `npm install expo-constants`
// And access it in your app via `Constants.expoConfig.extra.apiKey` after configuring `app.config.js`.
// For simplicity in this guide, we will hardcode it, but DO NOT do this in production.

import { GoogleGenerativeAI } from "@google/generative-ai";
import Constants from 'expo-constants';

// !! IMPORTANT !!
// Replace this with your actual API key for testing.
// For production, use environment variables with Expo.
const API_KEY = Constants.expoConfig.extra.API_KEY;

                
if (!API_KEY || API_KEY === "YOUR_GEMINI_API_KEY") {
  console.warn("Please add your Gemini API Key to your .env file");
}

const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });

// ... (The rest of your gemini.js file remains exactly the same)

// Robust topic guard (regex-based)
const ALLOW_PATTERNS = [
  /\bghg\b/i,
  /\bgreenhouse\s+gas(es)?\b/i,
  /\bemission(s)?\b/i,
  /\bcarbon\s+(footprint(ing)?|account(ing)?|inventory|emission|reduction)\b/i,
  /\bcarbon\b/i,
  /\bscope\s*[1-3]\b/i,
  /\bscopes?\s*[1-3]\b/i,
  /\bghg\s*protocol\b/i,
  /\biso\s*14064(?:-1)?\b/i,
  /\bverification|assurance|audit(ing)?\b/i,
  /\btco2e\b/i,
  /\bco2e\b/i,
];

const BLOCK_PATTERNS = [
  /\b(recipe|movie|song|lyrics?|coding\s+interview|crypto|stock|trading|politics?|celebrity|football|ipl|game\s*cheat|medical\s+diagnosis|legal\s+advice)\b/i,
];

export function isGHGQuestion(text = "") {
  const allowed = ALLOW_PATTERNS.some((re) => re.test(text));
  const blocked = BLOCK_PATTERNS.some((re) => re.test(text));
  return allowed && !blocked;
}

export function explainGuard(text = "") {
  return {
    allowedBy: ALLOW_PATTERNS.filter((re) => re.test(text)).map(String),
    blockedBy: BLOCK_PATTERNS.filter((re) => re.test(text)).map(String),
  };
}

export function buildAccessTrace(userText = "") {
  const t = userText.toLowerCase();
  const trace = [
    { id: "std_ghgp", title: "GHG Protocol Corporate Standard", type: "standard" },
    { id: "std_iso", title: "ISO 14064-1:2018", type: "standard" },
  ];
  if (/\bverify|assurance|audit|evidence|qa\/?qc\b/.test(t))
    trace.push({ id: "verify", title: "Verification Readiness", type: "assurance" });

  return trace;
}

function systemInstructions() {
  return `
You are Carbeez, an AI Carbon Consultant. Only answer questions related to:
- GHG inventory design and calculation (Scopes 1, 2, 3)
- Emissions accounting concepts, data, factors, and assumptions
- Verification readiness and audit evidence for GHG inventories

If the user's question is not in that scope, refuse and say you only answer GHG inventory / Scope 1–3 / verification topics.

Follow GHG Protocol Corporate Standard, Scope 2 Guidance, Scope 3 Standard, and ISO 14064-1:2018. Be concise, structured, and audit-ready. Default units to tCO₂e. Avoid legal advice.
`;
}

export async function getGeminiResponse(userPrompt) {
  const prompt = `${systemInstructions()}\n\nUser: ${userPrompt}`;
  const result = await model.generateContent(prompt);
  return result.response.text();
}

const SMALL_TALK_PATTERNS = [
    /\b(hi|hello|hey|yo)\b/i,
    /\b(who\s+are\s+you|who\s*r u)\b/i,
    /\b(what\s+can\s+you\s+do|what\s+do\s+you\s+do|what\s+will\s+you\s+do)\b/i,
    /\b(help|start|getting\s+started|intro(duction)?)\b/i,
];

export function isSmallTalk(text = "") {
  return SMALL_TALK_PATTERNS.some((re) => re.test(text));
}

export function smallTalkResponse() {
  return `# Hi, I’m **Carbeez** 👋

I’m your AI Carbon Consultant. I help with **GHG inventories** (Scopes **1, 2, 3**) and **verification readiness** in line with the **GHG Protocol** and **ISO 14064-1:2018**.

**To get started, please share:**
- Organization Name
- Reporting Year(s) & Base Year
- Consolidation Approach (e.g., operational control)
- Sites/facilities & Sector
- Preferred GWP set (e.g., IPCC AR5/AR6)`;

}
/**
 * Checks user input and returns an appropriate response.
 * - If the input is small talk, returns a canned response.
 * - Otherwise, gets a response from the Gemini model.
 */
export async function sendMessage(userInput) {
  if (isSmallTalk(userInput)) {
    return smallTalkResponse();
  }
  // The Gemini model itself is instructed by the system prompt
  // to only answer GHG-related questions.
  return getGeminiResponse(userInput);
}



export default getGeminiResponse;