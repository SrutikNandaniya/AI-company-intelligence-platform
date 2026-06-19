// Wikipedia & Wikidata API Integration
// All APIs are free, no API keys required

const WIKI_BASE = 'https://en.wikipedia.org';
const WIKI_REST = 'https://en.wikipedia.org/api/rest_v1';
const WIKIDATA_BASE = 'https://www.wikidata.org/w/api.php';

// ========== Types ==========

interface WikiSearchResult {
  title: string;
  pageid: number;
  snippet: string;
}

interface WikiSummary {
  title: string;
  extract: string;
  description: string;
  thumbnail?: { source: string; width: number; height: number };
  wikibase_item?: string;
  content_urls?: {
    desktop: { page: string };
  };
}

interface WikiFullExtract {
  title: string;
  extract: string;
  pageid: number;
}

interface WikidataEntity {
  id: string;
  labels: Record<string, { language: string; value: string }>;
  descriptions: Record<string, { language: string; value: string }>;
  claims: Record<string, WikiClaim[]>;
}

interface WikiClaim {
  mainsnak: {
    snaktype: string;
    property: string;
    datavalue?: {
      value: unknown;
      type: string;
    };
  };
  rank: string;
  qualifiers?: Record<string, unknown>;
}

interface WikiPageInfo {
  title: string;
  extract: string;
  pageid: number;
}

export interface RawCompanyData {
  name: string;
  summary: string;
  fullExtract: string;
  description: string;
  thumbnail?: string;
  wikipediaUrl?: string;
  wikidataId?: string;
  founded: string;
  industry: string;
  headquarters: string[];
  employees: string;
  website: string;
  founders: string[];
  ceo: string[];
  parentOrg: string;
  subsidiaries: string[];
  locations: string[];
  type: string;
  country: string;
}

// ========== API Calls ==========

async function fetchJSON(url: string): Promise<unknown> {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  return response.json();
}

/** Search Wikipedia for company pages */
export async function searchWikipedia(query: string): Promise<WikiSearchResult[]> {
  try {
    const url = `${WIKI_BASE}/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&format=json&origin=*&srlimit=5`;
    const data = await fetchJSON(url) as { query?: { search?: WikiSearchResult[] } };
    return data?.query?.search || [];
  } catch (err) {
    console.error('Wikipedia search failed:', err);
    return [];
  }
}

/** Get Wikipedia page summary */
async function getPageSummary(title: string): Promise<WikiSummary | null> {
  try {
    const url = `${WIKI_REST}/page/summary/${encodeURIComponent(title)}`;
    const data = await fetchJSON(url) as WikiSummary;
    return data;
  } catch (err) {
    console.error('Wikipedia summary failed:', err);
    return null;
  }
}

/** Get full Wikipedia page extract */
async function getPageExtract(title: string): Promise<WikiFullExtract | null> {
  try {
    const url = `${WIKI_BASE}/w/api.php?action=query&prop=extracts&exintro=0&explaintext=1&titles=${encodeURIComponent(title)}&format=json&origin=*`;
    const data = await fetchJSON(url) as { query?: { pages?: Record<string, WikiPageInfo> } };
    const pages = data?.query?.pages;
    if (!pages) return null;
    const pageId = Object.keys(pages)[0];
    const page = pages[pageId];
    if (!page || pageId === '-1') return null;
    return { title: page.title, extract: page.extract, pageid: page.pageid };
  } catch (err) {
    console.error('Wikipedia extract failed:', err);
    return null;
  }
}

/** Get Wikidata entity */
async function getWikidataEntity(qId: string): Promise<WikidataEntity | null> {
  try {
    const url = `${WIKIDATA_BASE}?action=wbgetentities&ids=${encodeURIComponent(qId)}&format=json&props=labels|descriptions|claims&origin=*`;
    const data = await fetchJSON(url as string) as { entities?: Record<string, WikidataEntity> };
    return data?.entities?.[qId] || null;
  } catch (err) {
    console.error('Wikidata entity failed:', err);
    return null;
  }
}

/** Resolve Wikidata Q IDs to English labels */
async function resolveQIds(qIds: string[]): Promise<Record<string, string>> {
  if (qIds.length === 0) return {};
  try {
    // Batch up to 50 IDs per request
    const batches: string[][] = [];
    for (let i = 0; i < qIds.length; i += 50) {
      batches.push(qIds.slice(i, i + 50));
    }

    const results: Record<string, string> = {};
    for (const batch of batches) {
      const url = `${WIKIDATA_BASE}?action=wbgetentities&ids=${batch.join('|')}&format=json&props=labels&languages=en&origin=*`;
      const data = await fetchJSON(url) as { entities?: Record<string, { labels?: Record<string, { value: string }> }> };
      if (data?.entities) {
        for (const [id, entity] of Object.entries(data.entities)) {
          results[id] = entity?.labels?.en?.value || id;
        }
      }
    }
    return results;
  } catch (err) {
    console.error('Q ID resolution failed:', err);
    return {};
  }
}

// ========== Data Extraction Helpers ==========

function extractTimeValue(claim: WikiClaim): string {
  try {
    const timeVal = (claim.mainsnak.datavalue?.value as { time?: string })?.time;
    if (!timeVal) return '';
    // Format: "+1986-00-00T00:00:00Z" or "+2005-03-15T00:00:00Z"
    const match = timeVal.match(/^[+-]?(\d{4})-(\d{2})-(\d{2})/);
    if (!match) return '';
    const year = match[1];
    const month = match[2];
    if (month === '00') return year;
    return `${year}`;
  } catch {
    return '';
  }
}

function extractEntityIds(claims: WikiClaim[]): string[] {
  return claims
    .filter(c => c.mainsnak.snaktype === 'value' && c.mainsnak.datavalue?.type === 'wikibase-entityid')
    .map(c => ((c.mainsnak.datavalue?.value as { id?: string })?.id || ''))
    .filter(Boolean)
    .filter((v, i, a) => a.indexOf(v) === i); // deduplicate
}

function extractStringValue(claim: WikiClaim): string {
  try {
    return (claim.mainsnak.datavalue?.value as string) || '';
  } catch {
    return '';
  }
}

function extractQuantityValue(claim: WikiClaim): string {
  try {
    const val = claim.mainsnak.datavalue?.value as { amount?: string; unit?: string };
    if (!val?.amount) return '';
    const amount = parseFloat(val.amount);
    if (isNaN(amount)) return '';
    if (amount >= 1000000) return `${(amount / 1000000).toFixed(1)}M`;
    if (amount >= 1000) return `${(amount / 1000).toFixed(0)},${String(Math.round(amount)).slice(-3)}`;
    return String(Math.round(amount));
  } catch {
    return '';
  }
}

// ========== Main Function ==========

/**
 * Fetches real company data from Wikipedia and Wikidata.
 * This function performs the following steps:
 * 1. Search Wikipedia for the company page
 * 2. Get the Wikipedia page summary (short description)
 * 3. Get the full Wikipedia article extract
 * 4. Get Wikidata structured data (founded, industry, HQ, employees, etc.)
 * 5. Resolve all Wikidata Q IDs to readable English labels
 * 6. Return structured company data
 */
export async function fetchCompanyData(companyName: string): Promise<RawCompanyData> {
  const fallback: RawCompanyData = {
    name: companyName,
    summary: `${companyName} is a company. Detailed information could not be retrieved from Wikipedia.`,
    fullExtract: '',
    description: 'Company',
    founded: 'N/A',
    industry: 'N/A',
    headquarters: [],
    employees: 'N/A',
    website: '',
    founders: [],
    ceo: [],
    parentOrg: '',
    subsidiaries: [],
    locations: [],
    type: '',
    country: '',
  };

  try {
    // Step 1: Search Wikipedia
    const searchResults = await searchWikipedia(companyName);
    if (searchResults.length === 0) {
      console.warn('No Wikipedia results found for:', companyName);
      return fallback;
    }

    const bestResult = searchResults[0];
    const pageTitle = bestResult.title;

    // Step 2: Get Wikipedia summary
    const summary = await getPageSummary(pageTitle);
    if (!summary) {
      console.warn('Could not get Wikipedia summary for:', pageTitle);
      return fallback;
    }

    // Step 3: Get full Wikipedia extract
    const fullExtractData = await getPageExtract(pageTitle);
    const fullExtract = fullExtractData?.extract || summary.extract || '';

    // Step 4: Get Wikidata structured data
    let wikidataEntity: WikidataEntity | null = null;
    let wikidataId = summary.wikibase_item;

    if (wikidataId) {
      wikidataEntity = await getWikidataEntity(wikidataId);
    }

    // Step 5: Extract and resolve all Q IDs
    const qIdsToResolve: string[] = [];
    const extractedData: Partial<RawCompanyData> = {};

    if (wikidataEntity?.claims) {
      const claims = wikidataEntity.claims;

      // P571 - Inception/Founded
      if (claims.P571) {
        const foundedValues = claims.P571
          .filter(c => c.rank !== 'deprecated')
          .map(c => extractTimeValue(c))
          .filter(Boolean);
        if (foundedValues.length > 0) extractedData.founded = foundedValues[0];
      }

      // P452 - Industry
      if (claims.P452) {
        const industryIds = extractEntityIds(claims.P452.filter(c => c.rank !== 'deprecated'));
        qIdsToResolve.push(...industryIds);
      }

      // P159 - Headquarters location
      if (claims.P159) {
        const hqIds = extractEntityIds(claims.P159.filter(c => c.rank !== 'deprecated'));
        qIdsToResolve.push(...hqIds);
      }

      // P1128 - Number of employees
      if (claims.P1128) {
        const empValues = claims.P1128
          .filter(c => c.rank === 'preferred' || c.rank === 'normal')
          .sort((a, b) => {
            // Prefer preferred rank, then most recent
            if (a.rank === 'preferred') return -1;
            if (b.rank === 'preferred') return 1;
            return 0;
          })
          .map(c => extractQuantityValue(c))
          .filter(Boolean);
        if (empValues.length > 0) extractedData.employees = empValues[0];
      }

      // P856 - Official website
      if (claims.P856) {
        const websites = claims.P856
          .filter(c => c.rank !== 'deprecated')
          .map(c => extractStringValue(c))
          .filter(Boolean);
        if (websites.length > 0) extractedData.website = websites[0];
      }

      // P112 - Founded by
      if (claims.P112) {
        const founderIds = extractEntityIds(claims.P112.filter(c => c.rank !== 'deprecated'));
        qIdsToResolve.push(...founderIds);
      }

      // P169 - CEO
      if (claims.P169) {
        const ceoIds = extractEntityIds(claims.P169.filter(c => c.rank !== 'deprecated'));
        qIdsToResolve.push(...ceoIds);
      }

      // P17 - Country
      if (claims.P17) {
        const countryIds = extractEntityIds(claims.P17.filter(c => c.rank !== 'deprecated'));
        qIdsToResolve.push(...countryIds);
      }

      // P749 - Parent organization
      if (claims.P749) {
        const parentIds = extractEntityIds(claims.P749.filter(c => c.rank !== 'deprecated'));
        qIdsToResolve.push(...parentIds);
      }

      // P355 - Subsidiaries
      if (claims.P355) {
        const subIds = extractEntityIds(claims.P355.filter(c => c.rank !== 'deprecated').slice(0, 10));
        qIdsToResolve.push(...subIds);
      }

      // P31 - Instance of (type)
      if (claims.P31) {
        const typeIds = extractEntityIds(claims.P31.filter(c => c.rank !== 'deprecated'));
        qIdsToResolve.push(...typeIds);
      }

      // P276 - Location
      if (claims.P276) {
        const locIds = extractEntityIds(claims.P276.filter(c => c.rank !== 'deprecated'));
        qIdsToResolve.push(...locIds);
      }

      // P641 - Sport (skip)
      // P101 - Field of work
      if (claims.P101) {
        const fieldIds = extractEntityIds(claims.P101.filter(c => c.rank !== 'deprecated'));
        qIdsToResolve.push(...fieldIds);
      }

      // P2689 - Stock exchange listed on
      if (claims.P414) {
        const exchangeIds = extractEntityIds(claims.P414.filter(c => c.rank !== 'deprecated'));
        qIdsToResolve.push(...exchangeIds);
      }
    }

    // Step 6: Resolve Q IDs
    const resolvedLabels = await resolveQIds([...new Set(qIdsToResolve)]);

    // Step 7: Build the final data
    if (wikidataEntity?.claims) {
      const claims = wikidataEntity.claims;

      // Industry
      if (claims.P452) {
        const industries = extractEntityIds(claims.P452.filter(c => c.rank !== 'deprecated'))
          .map(id => resolvedLabels[id])
          .filter(Boolean);
        if (industries.length > 0) extractedData.industry = industries.join(', ');
      }

      // If no P452, try P101 (field of work)
      if (!extractedData.industry && claims.P101) {
        const fields = extractEntityIds(claims.P101.filter(c => c.rank !== 'deprecated'))
          .map(id => resolvedLabels[id])
          .filter(Boolean);
        if (fields.length > 0) extractedData.industry = fields.join(', ');
      }

      // Headquarters
      if (claims.P159) {
        const hqs = extractEntityIds(claims.P159.filter(c => c.rank !== 'deprecated'))
          .map(id => resolvedLabels[id])
          .filter(Boolean);
        if (hqs.length > 0) extractedData.headquarters = hqs;
      }

      // Founders
      if (claims.P112) {
        const founders = extractEntityIds(claims.P112.filter(c => c.rank !== 'deprecated'))
          .map(id => resolvedLabels[id])
          .filter(Boolean);
        if (founders.length > 0) extractedData.founders = founders;
      }

      // CEO
      if (claims.P169) {
        const ceos = extractEntityIds(claims.P169.filter(c => c.rank !== 'deprecated'))
          .map(id => resolvedLabels[id])
          .filter(Boolean);
        if (ceos.length > 0) extractedData.ceo = ceos;
      }

      // Country
      if (claims.P17) {
        const countries = extractEntityIds(claims.P17.filter(c => c.rank !== 'deprecated'))
          .map(id => resolvedLabels[id])
          .filter(Boolean);
        if (countries.length > 0) extractedData.country = countries[0];
      }

      // Parent organization
      if (claims.P749) {
        const parents = extractEntityIds(claims.P749.filter(c => c.rank !== 'deprecated'))
          .map(id => resolvedLabels[id])
          .filter(Boolean);
        if (parents.length > 0) extractedData.parentOrg = parents[0];
      }

      // Subsidiaries
      if (claims.P355) {
        const subs = extractEntityIds(claims.P355.filter(c => c.rank !== 'deprecated').slice(0, 8))
          .map(id => resolvedLabels[id])
          .filter(Boolean);
        if (subs.length > 0) extractedData.subsidiaries = subs;
      }

      // Type (instance of)
      if (claims.P31) {
        const types = extractEntityIds(claims.P31.filter(c => c.rank !== 'deprecated'))
          .map(id => resolvedLabels[id])
          .filter(Boolean);
        if (types.length > 0) extractedData.type = types.join(', ');
      }
    }

    // Extract locations from full text
    const locationsFromText = extractLocationsFromText(fullExtract, extractedData.headquarters || []);

    // Derive industry from description if still missing
    if (!extractedData.industry || extractedData.industry === 'N/A') {
      extractedData.industry = deriveIndustryFromText(summary.description || '', summary.extract || '');
    }

    // Build final result
    return {
      name: summary.title || companyName,
      summary: summary.extract || '',
      fullExtract: fullExtract,
      description: summary.description || '',
      thumbnail: summary.thumbnail?.source,
      wikipediaUrl: summary.content_urls?.desktop?.page,
      wikidataId: wikidataId,
      founded: extractedData.founded || extractFoundedFromText(fullExtract) || 'N/A',
      industry: extractedData.industry || 'N/A',
      headquarters: extractedData.headquarters || [],
      employees: extractedData.employees || 'N/A',
      website: extractedData.website || '',
      founders: extractedData.founders || extractFoundersFromText(fullExtract),
      ceo: extractedData.ceo || [],
      parentOrg: extractedData.parentOrg || '',
      subsidiaries: extractedData.subsidiaries || [],
      locations: locationsFromText,
      type: extractedData.type || '',
      country: extractedData.country || '',
    };
  } catch (err) {
    console.error('Failed to fetch company data:', err);
    return fallback;
  }
}

// ========== Text Parsing Helpers ==========

/** Extract locations mentioned in the article text */
function extractLocationsFromText(text: string, hqs: string[]): string[] {
  const locations = [...hqs];

  // Common Indian cities that might be mentioned
  const knownCities = [
    'Mumbai', 'Delhi', 'Bangalore', 'Bengaluru', 'Hyderabad', 'Chennai',
    'Kolkata', 'Pune', 'Ahmedabad', 'Jaipur', 'Lucknow', 'Kochi',
    'Coimbatore', 'Indore', 'Bhopal', 'Patna', 'Nagpur', 'Kochi',
    'Goa', 'Mangalore', 'Mysore', 'Chandigarh', 'Noida', 'Gurgaon',
    'Thiruvananthapuram', 'Calicut', 'Kozhikode', 'Vizag', 'Visakhapatnam',
    'Surat', 'Vadodara', 'Bhubaneswar', 'Guwahati', 'Dehradun',
    'New York', 'London', 'Singapore', 'Dubai', 'San Francisco',
    'Tokyo', 'Shanghai', 'Beijing', 'Sydney', 'Melbourne',
    'Toronto', 'Berlin', 'Paris', 'Amsterdam',
    'Delhi-NCR', 'National Capital Region',
  ];

  for (const city of knownCities) {
    if (text.toLowerCase().includes(city.toLowerCase()) && !locations.some(l => l.toLowerCase() === city.toLowerCase())) {
      locations.push(city);
    }
  }

  return locations.slice(0, 15);
}

/** Try to extract founding year from the article text */
function extractFoundedFromText(text: string): string {
  // Look for patterns like "founded in 1986", "established in 2005", "since 1990", etc.
  const patterns = [
    /[Ff]ound(?:ed)?\s+(?:in|by)\s+(\d{4})/,
    /[Ee]stablished\s+(?:in|by)\s+(\d{4})/,
    /[Ii]ncorporated\s+(?:in|by)\s+(\d{4})/,
    /[Ss]tarted\s+(?:in|by)\s+(\d{4})/,
    /[Bb]egan\s+(?:in|by)\s+(\d{4})/,
    /[Cc]reated\s+(?:in|by)\s+(\d{4})/,
    /(?:in|since)\s+(\d{4})\s+(?:by|and)/,
    /(\d{4})\s*–\s*present/,
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      const year = parseInt(match[1]);
      if (year >= 1600 && year <= new Date().getFullYear()) {
        return match[1];
      }
    }
  }

  return '';
}

/** Try to extract founder names from the article text */
function extractFoundersFromText(text: string): string[] {
  const founders: string[] = [];

  // Look for "founded by Name" patterns
  const patterns = [
    /[Ff]ound(?:ed)?\s+by\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/g,
    /[Ee]stablished\s+by\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/g,
  ];

  for (const pattern of patterns) {
    let match;
    while ((match = pattern.exec(text)) !== null) {
      const name = match[1].trim();
      // Filter out common false positives
      if (name.length > 3 && !['The', 'This', 'In', 'It', 'An', 'Is', 'Was', 'Has', 'Its', 'And'].includes(name.split(' ')[0])) {
        founders.push(name);
      }
    }
  }

  return [...new Set(founders)].slice(0, 3);
}

/** Derive industry from description or article text */
function deriveIndustryFromText(description: string, extract: string): string {
  const text = `${description} ${extract}`.toLowerCase();

  const industryKeywords: [string[], string][] = [
    [['real estate', 'property', 'construction', 'housing', 'developer', 'infrastructure'], 'Real Estate & Construction'],
    [['technology', 'software', 'it ', 'information technology', 'tech company', 'digital', 'saas'], 'Technology & Software'],
    [['pharmaceutical', 'pharma', 'drug', 'healthcare', 'biotech', 'medical device'], 'Pharmaceuticals & Healthcare'],
    [['bank', 'banking', 'financial', 'insurance', 'fintech', 'investment'], 'Banking & Financial Services'],
    [['automobile', 'automotive', 'auto ', 'motor', 'car ', 'vehicle', 'ev '], 'Automotive'],
    [['retail', 'e-commerce', 'ecommerce', 'consumer goods', 'fmcg', 'supermarket'], 'Retail & Consumer Goods'],
    [['energy', 'power', 'solar', 'wind', 'oil', 'gas', 'petroleum', 'renewable'], 'Energy & Power'],
    [['food', 'beverage', 'restaurant', 'brewery', 'dairy'], 'Food & Beverage'],
    [['education', 'edtech', 'learning', 'university', 'training'], 'Education & EdTech'],
    [['telecom', 'telecommunication', 'wireless', 'mobile operator'], 'Telecommunications'],
    [['media', 'entertainment', 'film', 'broadcasting', 'publishing', 'gaming'], 'Media & Entertainment'],
    [['logistics', 'shipping', 'courier', 'supply chain', 'transport'], 'Logistics & Transportation'],
    [['mining', 'steel', 'cement', 'metal', 'mineral'], 'Mining & Materials'],
    [['agriculture', 'agritech', 'farming', 'crop'], 'Agriculture'],
    [['conglomerate', 'diversified', 'multinational conglomerate'], 'Conglomerate'],
    [['hospitality', 'hotel', 'tourism', 'travel'], 'Hospitality & Tourism'],
    [['aerospace', 'defense', 'defence'], 'Aerospace & Defense'],
    [['consulting', 'advisory', 'professional services'], 'Consulting & Professional Services'],
  ];

  for (const [keywords, industry] of industryKeywords) {
    if (keywords.some((kw: string) => text.includes(kw))) {
      return industry;
    }
  }

  return 'Diversified';
}

/**
 * Parse the full Wikipedia extract into structured sections
 */
export function parseExtractSections(fullExtract: string): {
  offerings: string[];
  projects: string[];
  recentNews: string[];
  expansionPlans: string[];
  announcements: string[];
  customerReviews: string[];
  leadership: string[];
} {
  const result = {
    offerings: [] as string[],
    projects: [] as string[],
    recentNews: [] as string[],
    expansionPlans: [] as string[],
    announcements: [] as string[],
    customerReviews: [] as string[],
    leadership: [] as string[],
  };

  if (!fullExtract) return result;

  // Extract proper nouns that appear to be project/product names
  // Look for capitalized multi-word phrases
  const projectPattern = /(?:Prestige|Adani|Sobha|DLF|Godrej|Brigade|L&T|Tata|Infosys|Wipro|Reliance|Mahindra|Bajaj|HDFC|ICICI|IRB|Shapoorji)\s+([A-Z][a-zA-Z]+(?:\s+[A-Z][a-zA-Z]+)*)/g;
  const projects = new Set<string>();
  let match;
  while ((match = projectPattern.exec(fullExtract)) !== null) {
    const projectName = match[0].trim();
    if (projectName.length > 5 && projectName.length < 60) {
      projects.add(projectName);
    }
  }
  result.projects = [...projects].slice(0, 10);

  // Extract offerings from text patterns
  const offeringPatterns = [
    /(?:develops|provides|offers|specializes? in|focused on|engages? in|involved in|produces?|manufactures?|delivers?)\s+([^.]+(?:,\s*[^.]+)*)/gi,
  ];

  for (const pattern of offeringPatterns) {
    while ((match = pattern.exec(fullExtract)) !== null) {
      const text = match[1].trim();
      // Split by commas and "and"
      const items = text.split(/,\s*|\s+and\s+/).map(s => s.trim()).filter(s => s.length > 3 && s.length < 80);
      result.offerings.push(...items);
    }
  }
  result.offerings = [...new Set(result.offerings)].slice(0, 8);

  // Extract leadership from text
  const leaderPattern = /(?:CEO|chairman|managing director|founder|president|CFO|CTO|COO)[\s:]+(?:is\s+)?([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/gi;
  while ((match = leaderPattern.exec(fullExtract)) !== null) {
    const name = match[1].trim();
    if (name.length > 3 && name.split(' ').length >= 2) {
      result.leadership.push(`${match[0].split(/\s+/)[0].toUpperCase()}: ${name}`);
    }
  }

  return result;
}
