// GLM-5.1 LLM Integration for Intelligent Data Extraction
// Supports Zhipu AI (open.bigmodel.cn) and OpenRouter (openrouter.ai)
// Both use OpenAI-compatible API format
//
// To use:
// 1. Get a free API key from https://open.bigmodel.cn (Zhipu AI) — offers free trial credits
// 2. Or get a key from https://openrouter.ai — has free GLM models
// 3. Enter the key in the StrategicAI settings panel

export interface LLMConfig {
  provider: 'zhipu' | 'openrouter';
  apiKey: string;
  model: string;
}

export interface ExtractedCompanyInfo {
  companyName: string;
  industry: string;
  description: string;
  founded: string;
  headquarters: string;
  employees: string;
  offerings: string[];
  projects: string[];
  recentNews: string[];
  expansionPlans: string[];
  leadership: string[];
  locations: string[];
  stats: string[];
  websiteSummary: string;
}

const ZHIPU_BASE = 'https://open.bigmodel.cn/api/paas/v4';
const OPENROUTER_BASE = 'https://openrouter.ai/api/v1';

// CORS proxy for browser-based API calls
const CORS_PROXIES = [
  '', // Try direct first
  'https://corsproxy.io/?',
];

function getBaseUrl(config: LLMConfig): string {
  return config.provider === 'zhipu' ? ZHIPU_BASE : OPENROUTER_BASE;
}

function getHeaders(config: LLMConfig): Record<string, string> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${config.apiKey}`,
  };

  if (config.provider === 'openrouter') {
    headers['HTTP-Referer'] = window.location.origin;
    headers['X-Title'] = 'StrategicAI';
  }

  return headers;
}

async function callLLM(config: LLMConfig, messages: { role: string; content: string }[]): Promise<string> {
  const baseUrl = getBaseUrl(config);
  const url = `${baseUrl}/chat/completions`;

  const body = {
    model: config.model,
    messages,
    temperature: 0.3,
    max_tokens: 4096,
  };

  // Try direct call first, then CORS proxy if needed
  for (const proxy of CORS_PROXIES) {
    try {
      const fetchUrl = proxy ? `${proxy}${encodeURIComponent(url)}` : url;
      const response = await fetch(fetchUrl, {
        method: 'POST',
        headers: getHeaders(config),
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.warn(`LLM API returned ${response.status}: ${errorText}`);
        if (response.status === 0 || response.status === 403) {
          // Likely CORS error, try next proxy
          continue;
        }
        throw new Error(`API Error ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content || '';

      if (!content) {
        throw new Error('Empty response from LLM');
      }

      return content;
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      if (errorMsg.includes('Failed to fetch') || errorMsg.includes('NetworkError') || errorMsg.includes('CORS')) {
        console.warn(`CORS blocked for ${proxy || 'direct'}, trying next proxy...`);
        continue;
      }
      throw err;
    }
  }

  throw new Error('Could not reach LLM API. This may be a CORS issue. Try using OpenRouter as your provider, or run the app with a backend proxy.');
}

const EXTRACTION_PROMPT = `You are a company intelligence extraction agent. Analyze the provided website content and extract structured company information.

IMPORTANT: Return ONLY a valid JSON object with these exact fields. No markdown, no explanation, just JSON.

{
  "companyName": "The official company name",
  "industry": "The industry/sector the company operates in",
  "description": "A 2-3 sentence description of what the company does, based on the website content",
  "founded": "Year founded if mentioned, otherwise 'N/A'",
  "headquarters": "City/location of headquarters if mentioned, otherwise 'N/A'",
  "employees": "Number of employees or employee range if mentioned, otherwise 'N/A'",
  "offerings": ["List of products/services/offerings mentioned on the website"],
  "projects": ["List of notable projects/properties/products mentioned"],
  "recentNews": ["Key developments, announcements, or news mentioned"],
  "expansionPlans": ["Any expansion, growth, or future plans mentioned"],
  "leadership": ["Names and titles of leaders/founders/executives mentioned"],
  "locations": ["Cities/regions where the company operates"],
  "stats": ["Key statistics mentioned like '300+ Projects', '39+ Years', etc."],
  "websiteSummary": "A comprehensive 3-5 sentence summary of the company based on all website content"
}

Extract as much accurate information as possible. If something is not mentioned, use an empty array [] or 'N/A'. Do NOT fabricate information.`;

/**
 * Extract structured company data from website content using GLM-5.1
 */
export async function extractCompanyInfoWithLLM(
  websiteContent: string,
  config: LLMConfig
): Promise<ExtractedCompanyInfo | null> {
  try {
    // Truncate content to avoid token limits (keep first ~6000 chars)
    const truncatedContent = websiteContent.slice(0, 6000);

    const messages = [
      { role: 'system', content: EXTRACTION_PROMPT },
      {
        role: 'user',
        content: `Analyze the following company website content and extract structured information:\n\n${truncatedContent}`
      }
    ];

    console.log('[LLM] Sending request to', config.provider, 'model:', config.model);
    const response = await callLLM(config, messages);

    // Parse the JSON response
    let jsonStr = response.trim();

    // Remove markdown code blocks if present
    if (jsonStr.startsWith('```')) {
      jsonStr = jsonStr.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
    }

    const parsed = JSON.parse(jsonStr);

    // Validate and return
    return {
      companyName: parsed.companyName || 'Unknown',
      industry: parsed.industry || 'Diversified',
      description: parsed.description || '',
      founded: parsed.founded || 'N/A',
      headquarters: parsed.headquarters || 'N/A',
      employees: parsed.employees || 'N/A',
      offerings: Array.isArray(parsed.offerings) ? parsed.offerings : [],
      projects: Array.isArray(parsed.projects) ? parsed.projects : [],
      recentNews: Array.isArray(parsed.recentNews) ? parsed.recentNews : [],
      expansionPlans: Array.isArray(parsed.expansionPlans) ? parsed.expansionPlans : [],
      leadership: Array.isArray(parsed.leadership) ? parsed.leadership : [],
      locations: Array.isArray(parsed.locations) ? parsed.locations : [],
      stats: Array.isArray(parsed.stats) ? parsed.stats : [],
      websiteSummary: parsed.websiteSummary || '',
    };
  } catch (err) {
    console.error('[LLM] Extraction failed:', err);
    return null;
  }
}

/**
 * Generate AI-powered chat response using GLM-5.1
 */
export async function generateChatResponse(
  query: string,
  companyContext: string,
  config: LLMConfig
): Promise<string | null> {
  try {
    const messages = [
      {
        role: 'system',
        content: `You are the StrategicAI Assistant, an expert company intelligence analyst. Answer questions about the company based on the provided context. If the context doesn't contain the answer, say so honestly. Be concise but thorough. Use bullet points for lists.`
      },
      {
        role: 'user',
        content: `Company Context:\n${companyContext.slice(0, 4000)}\n\nQuestion: ${query}`
      }
    ];

    const response = await callLLM(config, messages);
    return response;
  } catch (err) {
    console.error('[LLM] Chat response failed:', err);
    return null;
  }
}

/**
 * Available GLM models per provider
 */
export const AVAILABLE_MODELS = {
  zhipu: [
    { id: 'glm-5.1', name: 'GLM-5.1 (Latest, Most Capable)', free: false },
    { id: 'glm-4-flash', name: 'GLM-4 Flash (Free Tier)', free: true },
    { id: 'glm-4-air', name: 'GLM-4 Air (Fast)', free: false },
  ],
  openrouter: [
    { id: 'zhipu-ai/glm-4-flash:free', name: 'GLM-4 Flash (Free)', free: true },
    { id: 'zhipu-ai/glm-4.5-air', name: 'GLM-4.5 Air', free: false },
    { id: 'zhipu-ai/glm-4.7-flash', name: 'GLM-4.7 Flash', free: false },
  ],
};
