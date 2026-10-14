const CLAUDE_API = 'https://api.anthropic.com/v1/messages';
const MODEL = 'claude-sonnet-4-20250514';

async function callClaude(
  systemPrompt: string,
  userContent: string,
  apiKey: string
): Promise<string> {
  const res = await fetch(CLAUDE_API, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 1024,
      system: systemPrompt,
      messages: [{ role: 'user', content: userContent }],
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { error?: { message?: string } }).error?.message || `Claude API error: ${res.status}`);
  }

  const data = await res.json() as { content: { text: string }[] };
  return data.content[0].text;
}

// Feature 1 — Chat Summarizer
export async function summarizeChat(conversation: string, apiKey: string): Promise<string> {
  const system = `You are a chat summarizer for a Web3 messaging app on BOT Chain. Summarize the conversation into 3-5 concise bullet points. Focus on decisions, action items, DePIN/AI tasks, and key topics discussed. Be brief and direct. Return bullet points using • character.`;
  return callClaude(system, conversation, apiKey);
}

// Feature 2 — Smart Replies
export async function getSmartReplies(lastMessage: string, apiKey: string): Promise<string[]> {
  const system = `You are a smart reply generator for a Web3/blockchain community messaging app on BOT Chain. Given an incoming message, generate exactly 4 short, context-aware reply suggestions. Format your response as a JSON array of strings only with no markdown. Replies should be natural, community-appropriate, and under 20 words each.`;
  const result = await callClaude(system, lastMessage, apiKey);
  try {
    const cleaned = result.replace(/```json|```/g, '').trim();
    return JSON.parse(cleaned) as string[];
  } catch {
    return ['Got it!', 'Sounds good!', 'Tell me more.', 'Thanks for sharing!'];
  }
}

// Feature 3 — Translation
export const SUPPORTED_LANGUAGES = [
  'Yoruba', 'Igbo', 'Hausa', 'Pidgin English',
  'Swahili', 'French', 'Arabic', 'English'
];

export async function translateMessage(
  message: string,
  targetLanguage: string,
  apiKey: string
): Promise<string> {
  const system = `You are a translator. Translate the given message into the requested language. Return ONLY the translated text, nothing else. Supported languages: Yoruba, Igbo, Hausa, Pidgin English, Swahili, French, Arabic, English.`;
  return callClaude(system, `Translate to ${targetLanguage}: ${message}`, apiKey);
}

// Feature 4 — Spam & Scam Detection
export interface SpamResult {
  verdict: 'SAFE' | 'SUSPICIOUS' | 'SPAM';
  confidence: number;
  reason: string;
}

export async function detectSpam(message: string, apiKey: string): Promise<SpamResult> {
  const system = `You are a crypto security analyst for BOT Chain and EVM applications. Analyze the given message for phishing, rug pulls, fake BOT airdrops, malicious permit signatures, drainers, or social engineering. Respond ONLY with a JSON object (no markdown): { "verdict": "SAFE" | "SUSPICIOUS" | "SPAM", "confidence": 0-100, "reason": "string max 20 words" }`;
  const result = await callClaude(system, message, apiKey);
  try {
    const cleaned = result.replace(/```json|```/g, '').trim();
    return JSON.parse(cleaned) as SpamResult;
  } catch {
    return { verdict: 'SAFE', confidence: 50, reason: 'Unable to analyze message.' };
  }
}

// Feature 5 — BOT Identity & Agent OS Assistant
export async function findBotIdentity(description: string, apiKey: string): Promise<string> {
  const system = `You are an expert identity assistant for BOT Chain (EVM Layer 1 for DePIN & AI) and ERC-8004 Agent OS. The user will describe a person, project, or autonomous AI Agent they are looking for or want to register. Suggest the most suitable .bot domain name, EVM address format, or ERC-8004 metadata attributes on BOT Chain. Be concise and practical.`;
  return callClaude(system, description, apiKey);
}

// Backward-compatibility alias
export const findBNSIdentity = findBotIdentity;
