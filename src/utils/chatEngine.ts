import { CompanyData, ChatMessage } from '../types';

let messageIdCounter = 0;

export function createMessage(role: 'user' | 'assistant' | 'system', content: string): ChatMessage {
  return {
    id: `msg-${++messageIdCounter}-${Date.now()}`,
    role,
    content,
    timestamp: new Date(),
  };
}

function findRelevantChunks(query: string, data: CompanyData): string[] {
  const chunks: string[] = [];
  const lower = query.toLowerCase();

  const sectionMap: Record<string, string[]> = {
    overview: [data.summary, data.description, `Industry: ${data.industry}`, `Founded: ${data.founded}`, `Scale: ${data.scale}`, `Employees: ${data.employees}`],
    offerings: data.offerings.map(o => `Offering: ${o}`),
    projects: data.projects.map(p => `Project: ${p}`),
    news: data.recentNews.map(n => `News: ${n}`),
    expansion: data.expansionPlans.map(e => `Expansion: ${e}`),
    announcements: data.announcements.map(a => `Announcement: ${a}`),
    leadership: data.leadership.map(l => `Leader: ${l}`),
    locations: data.locations.map(l => `Location: ${l}`),
    challenges: data.challenges.map(c => `Challenge: ${c.challenge} - ${c.reason}. Evidence: ${c.evidence.join(', ')}`),
    ai: data.aiOpportunities.map(o => `AI Opportunity: ${o.solution} for ${o.challenge} (Score: ${o.totalScore}/100). ${o.description}`),
    fulltext: data.fullExtract ? data.fullExtract.split('\n').filter((p: string) => p.trim().length > 20).slice(0, 10) : [],
  };

  const keywords: Record<string, string[]> = {
    overview: ['what does', 'what is', 'who is', 'about', 'overview', 'company', 'tell me about', 'describe', 'summary'],
    offerings: ['offering', 'product', 'service', 'sell', 'provide', 'business model', 'what do they'],
    projects: ['project', 'development', 'property', 'building', 'construction', 'portfolio'],
    news: ['news', 'recent', 'latest', 'development', 'current', 'happening', 'update'],
    expansion: ['expansion', 'growth', 'future', 'plan', 'strategy', 'next', 'expand', 'scale'],
    announcements: ['announcement', 'launch', 'new', 'initiative', 'partnership', 'commitment'],
    leadership: ['leadership', 'leader', 'ceo', 'founder', 'management', 'team', 'executive', 'director'],
    locations: ['location', 'city', 'where', 'presence', 'office', 'operate', 'geography'],
    challenges: ['challenge', 'problem', 'risk', 'issue', 'difficulty', 'obstacle', 'concern', 'threat'],
    ai: ['ai', 'artificial intelligence', 'opportunity', 'technology', 'recommend', 'solution', 'machine learning', 'automat'],
  };

  for (const [section, kws] of Object.entries(keywords)) {
    if (kws.some(kw => lower.includes(kw))) {
      if (sectionMap[section]) {
        chunks.push(...sectionMap[section]);
      }
    }
  }

  if (chunks.length === 0) {
    // Search the full Wikipedia extract for relevant paragraphs
    if (data.fullExtract) {
      const paragraphs = data.fullExtract.split('\n').filter((p: string) => p.trim().length > 30);
      const queryWords = query.toLowerCase().split(/\s+/).filter((w: string) => w.length > 3);
      const relevant = paragraphs.filter((p: string) => {
        const pLower = p.toLowerCase();
        return queryWords.some((w: string) => pLower.includes(w));
      });
      if (relevant.length > 0) {
        chunks.push(...relevant.slice(0, 4));
      }
    }
    // Fallback to overview chunks
    if (chunks.length === 0) {
      chunks.push(...sectionMap.overview.slice(0, 3));
      chunks.push(...sectionMap.news.slice(0, 2));
    }
  }

  return chunks.slice(0, 8);
}

function generateResponse(query: string, data: CompanyData): string {
  const chunks = findRelevantChunks(query, data);
  const lower = query.toLowerCase();

  // Direct answer patterns
  if (lower.includes('what does') && (lower.includes('do') || lower.includes('company'))) {
    return `**${data.name}** is a ${data.scale.toLowerCase()} company in the ${data.industry.toLowerCase()} sector.\n\n${data.summary}\n\n**Key Facts:**\n• Founded: ${data.founded}\n• Scale: ${data.scale}\n• Employees: ${data.employees}\n• Presence in ${data.locations.length}+ cities including ${data.locations.slice(0, 4).join(', ')}\n\n**Core Offerings:** ${data.offerings.slice(0, 4).join(', ')}`;
  }

  if (lower.includes('recent') || lower.includes('latest') || lower.includes('news') || lower.includes('development')) {
    return `Here are the recent developments for **${data.name}**:\n\n${data.recentNews.map((n, i) => `${i + 1}. ${n}`).join('\n')}\n\n**Recent Announcements:**\n${data.announcements.map(a => `• ${a}`).join('\n')}`;
  }

  if (lower.includes('expansion') || lower.includes('growth') || lower.includes('future') || lower.includes('plan')) {
    return `**${data.name}'s Expansion Plans:**\n\n${data.expansionPlans.map((e, i) => `${i + 1}. ${e}`).join('\n')}\n\nThe company is actively pursuing growth in both existing and new markets, with a focus on geographic expansion and digital transformation initiatives.`;
  }

  if (lower.includes('challenge') || lower.includes('problem') || lower.includes('risk')) {
    return `Based on our analysis, here are the key challenges for **${data.name}**:\n\n${data.challenges.map((c, i) => `**${i + 1}. ${c.challenge}** [${c.severity.toUpperCase()} priority]\n   Reason: ${c.reason}\n   Evidence: ${c.evidence.slice(0, 2).join('; ')}`).join('\n\n')}\n\nThese challenges present significant opportunities for AI-driven solutions to create competitive advantage.`;
  }

  if (lower.includes('ai') || lower.includes('opportunity') || lower.includes('recommend') || lower.includes('solution')) {
    return `**AI Opportunities for ${data.name}:**\n\n${data.aiOpportunities.map((o, i) => `**${i + 1}. ${o.solution}** (Score: ${o.totalScore}/100)\n   → Addresses: ${o.challenge}\n   → Impact: ${o.impact}/100 | Feasibility: ${o.feasibility}/100 | Urgency: ${o.urgency}/100\n   → ${o.description}`).join('\n\n')}`;
  }

  if (lower.includes('offering') || lower.includes('product') || lower.includes('service') || lower.includes('business')) {
    return `**${data.name}'s Business Offerings:**\n\n${data.offerings.map((o, i) => `${i + 1}. **${o}**`).join('\n')}\n\n**Notable Projects:**\n${data.projects.slice(0, 4).map(p => `• ${p}`).join('\n')}`;
  }

  if (lower.includes('leadership') || lower.includes('ceo') || lower.includes('founder') || lower.includes('management')) {
    return `**${data.name} Leadership Team:**\n\n${data.leadership.map((l, i) => `${i + 1}. ${l}`).join('\n')}`;
  }

  if (lower.includes('location') || lower.includes('where') || lower.includes('city') || lower.includes('presence')) {
    return `**${data.name} operates across ${data.locations.length}+ locations:**\n\n${data.locations.map((l, i) => `${i + 1}. ${l}`).join('\n')}\n\nThe company continues to expand its geographic footprint with planned entries into new markets.`;
  }

  // General RAG-style response using full extract
  if (data.fullExtract && chunks.length > 0) {
    // Find the most relevant paragraphs from the full extract
    const queryWords = query.toLowerCase().split(/\s+/).filter(w => w.length > 3);
    const paragraphs = data.fullExtract.split('\n').filter(p => p.trim().length > 30);
    const relevantParagraphs = paragraphs.filter(p => {
      const pLower = p.toLowerCase();
      return queryWords.some(w => pLower.includes(w));
    }).slice(0, 3);

    if (relevantParagraphs.length > 0) {
      return `Based on Wikipedia's article about **${data.name}**:\n\n${relevantParagraphs.map(p => `> ${p.trim()}`).join('\n\n')}\n\n*Source: Wikipedia & Wikidata (retrieved via RAG pipeline)*`;
    }
  }

  return `Based on the available information about **${data.name}**:\n\n${chunks.slice(0, 5).map(c => `• ${c}`).join('\n')}\n\n*This response was generated using RAG (Retrieval-Augmented Generation) from ${data.name}'s knowledge base (sourced from Wikipedia & Wikidata). You can ask me about specific topics like offerings, challenges, AI opportunities, expansion plans, or leadership for more detailed insights.*`;
}

export function getChatResponse(query: string, data: CompanyData): string {
  return generateResponse(query, data);
}

export function getInitialMessage(data: CompanyData): string {
  const hasWikipedia = !!data.wikipediaUrl;
  const hasWebsite = !!data.websiteData?.scraped;
  let dataSourceDesc: string;
  if (hasWikipedia && hasWebsite) {
    dataSourceDesc = `I've fetched real-time data for **${data.name}** from Wikipedia, Wikidata, and the company website, and built a comprehensive knowledge base.`;
  } else if (hasWebsite) {
    dataSourceDesc = `I've scraped **${data.name}**'s company website (${data.websiteData?.pagesScraped} pages) and built a comprehensive knowledge base from the website content.`;
  } else if (hasWikipedia) {
    dataSourceDesc = `I've fetched data for **${data.name}** from Wikipedia and Wikidata, and built a comprehensive knowledge base.`;
  } else {
    dataSourceDesc = `I've built a knowledge base for **${data.name}** using available data.`;
  }

  return `👋 Welcome! I'm the **StrategicAI Assistant** for **${data.name}**.\n\n${dataSourceDesc} I can help you with:\n\n• 📊 **Company Overview** — What does the company do?\n• 🏢 **Business Information** — Offerings, projects, and developments\n• ⚠️ **Challenges** — Potential business risks and obstacles\n• 🤖 **AI Opportunities** — Strategic AI recommendations\n• 🎯 **Expansion Plans** — Growth strategy and future direction\n\n*Data sourced from ${[hasWikipedia ? 'Wikipedia' : '', hasWikipedia ? 'Wikidata' : '', hasWebsite ? 'Company Website' : ''].filter(Boolean).join(', ') || 'available sources'} (all free APIs)*\n\nJust ask me anything, or use the quick action buttons below!`;
}
