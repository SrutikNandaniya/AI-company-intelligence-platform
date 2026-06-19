export interface Challenge {
  challenge: string;
  reason: string;
  evidence: string[];
  severity: 'high' | 'medium' | 'low';
}

export interface AIOpportunity {
  challenge: string;
  solution: string;
  impact: number;
  feasibility: number;
  urgency: number;
  totalScore: number;
  description: string;
}

export interface CompanyData {
  name: string;
  industry: string;
  scale: string;
  locations: string[];
  employees: string;
  founded: string;
  website: string;
  summary: string;
  description: string;
  offerings: string[];
  projects: string[];
  recentNews: string[];
  expansionPlans: string[];
  announcements: string[];
  leadership: string[];
  customerReviews: string[];
  challenges: Challenge[];
  aiOpportunities: AIOpportunity[];
  ceoPitch: string;
  wikipediaUrl?: string;
  thumbnail?: string;
  wikidataId?: string;
  fullExtract?: string;
  websiteData?: {
    scraped: boolean;
    pagesScraped: number;
    totalContentLength: number;
    websiteUrl: string;
    statsFromWebsite: string[];
  };
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  isTyping?: boolean;
}

export type InsightType = 'overview' | 'business' | 'challenges' | 'ai-opportunities' | 'impact-scoring' | 'ceo-pitch' | null;

export interface PipelineStage {
  id: number;
  label: string;
  description: string;
  icon: string;
  duration: number;
}

export const PIPELINE_STAGES: PipelineStage[] = [
  { id: 1, label: 'Source Fetch', description: 'Fetching data from Wikipedia & Wikidata (or company website if URL provided)', icon: '🔍', duration: 2500 },
  { id: 2, label: 'Structured Data', description: 'Extracting structured data: founded, industry, HQ, employees, founders', icon: '🏛️', duration: 2000 },
  { id: 3, label: 'Website Scrape', description: 'Scraping company website via Jina AI Reader for offerings, projects & news', icon: '🌐', duration: 3000 },
  { id: 4, label: 'Data Merge', description: 'Parsing and merging data from all sources (Wikipedia, Wikidata, website)', icon: '🧹', duration: 1200 },
  { id: 5, label: 'Knowledge Base', description: 'Building structured company knowledge base from all verified sources', icon: '📚', duration: 1200 },
  { id: 6, label: 'Vector Store', description: 'Creating embeddings (BAAI/bge-small-en-v1.5) and storing in ChromaDB', icon: '🗄️', duration: 1000 },
  { id: 7, label: 'AI Analysis', description: 'Running strategic analysis, challenge detection, and recommendation engine', icon: '🤖', duration: 1500 },
];
