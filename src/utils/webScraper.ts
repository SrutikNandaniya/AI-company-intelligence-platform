// Jina AI Reader — Free Web Scraping API (no API key needed for read endpoint)
// https://jina.ai/reader/
//
// Usage: prepend https://r.jina.ai/ to any URL to get clean markdown content
// Example: https://r.jina.ai/https://www.prestigeconstructions.com/about-us

const JINA_READER_BASE = 'https://r.jina.ai/';

export interface WebsiteData {
  homepageContent: string;
  aboutContent: string;
  newsContent: string;
  projectsContent: string;
  offerings: string[];
  projects: string[];
  recentNews: string[];
  expansionPlans: string[];
  announcements: string[];
  aboutText: string[];
  statsFromWebsite: string[];
  leadershipFromWebsite: string[];
  locationsFromWebsite: string[];
  websiteUrl: string;
  pagesScraped: number;
  totalContentLength: number;
}

async function fetchFromJina(url: string): Promise<string> {
  try {
    const response = await fetch(`${JINA_READER_BASE}${encodeURIComponent(url)}`, {
      headers: {
        'Accept': 'text/plain',
      },
    });
    if (!response.ok) {
      console.warn(`Jina Reader returned ${response.status} for ${url}`);
      return '';
    }
    return await response.text();
  } catch (err) {
    console.error(`Jina Reader fetch failed for ${url}:`, err);
    return '';
  }
}

function cleanMarkdown(markdown: string): string {
  if (!markdown) return '';
  return markdown
    // Remove cookie consent sections
    .replace(/Cookie Settings[\s\S]*?(?=\n#{1,3}\s|\n#|$)/gi, '')
    .replace(/We use cookies[\s\S]*?(?=\n#{1,3}\s|\n#|$)/gi, '')
    .replace(/Manage Consent[\s\S]*?(?=\n#{1,3}\s|\n#|$)/gi, '')
    // Remove image markdown (keep alt text)
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1')
    // Remove links (keep text)
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    // Remove HTML tags
    .replace(/<[^>]+>/g, '')
    // Remove excessive whitespace
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

/**
 * Try to scrape a specific page path from the company website
 */
async function tryScrapePage(baseUrl: string, paths: string[]): Promise<{ content: string; path: string }> {
  const normalizedBase = baseUrl.replace(/\/+$/, '');

  for (const path of paths) {
    const url = `${normalizedBase}${path}`;
    const content = await fetchFromJina(url);
    if (content && content.length > 200) {
      return { content: cleanMarkdown(content), path };
    }
  }

  return { content: '', path: '' };
}

/**
 * Extract offerings/services from website content
 */
function extractOfferings(content: string): string[] {
  const offerings: string[] = [];

  // Look for navigation links that indicate offerings (Residential, Commercial, etc.)
  const navPatterns = [
    /(?:residential|apartments?|villas?|plots?|flats?)/gi,
    /(?:commercial|offices?|retail|shops?)/gi,
    /(?:hospitality|hotels?|resorts?)/gi,
    /(?:rental|leasing)/gi,
    /(?:industrial|warehousing|logistics)/gi,
    /(?:consulting|advisory|services)/gi,
    /(?:software|platform|saas|cloud)/gi,
    /(?:manufacturing|production)/gi,
    /(?:insurance|banking|financial)/gi,
    /(?:healthcare|pharma|medical)/gi,
    /(?:education|training|learning)/gi,
    /(?:energy|solar|renewable|power)/gi,
    /(?:construction|infrastructure|engineering)/gi,
  ];

  const seen = new Set<string>();
  for (const pattern of navPatterns) {
    const matches = content.match(pattern);
    if (matches) {
      for (const match of matches) {
        const normalized = match.charAt(0).toUpperCase() + match.slice(1).toLowerCase();
        if (!seen.has(normalized.toLowerCase())) {
          seen.add(normalized.toLowerCase());
          offerings.push(normalized);
        }
      }
    }
  }

  // Look for section headers that indicate offerings
  const headerPattern = /^#{1,4}\s+(.+)$/gm;
  let headerMatch;
  while ((headerMatch = headerPattern.exec(content)) !== null) {
    const header = headerMatch[1].trim();
    // Filter out generic headers
    const skip = ['about', 'contact', 'footer', 'cookie', 'privacy', 'terms', 'careers', 'blog', 'news', 'home', 'menu', 'navigation', 'search', 'login', 'signup', 'subscribe', 'newsletter', 'faq', 'help', 'support', 'follow', 'social'];
    if (header.length > 3 && header.length < 60 && !skip.some(s => header.toLowerCase().includes(s))) {
      if (!seen.has(header.toLowerCase())) {
        seen.add(header.toLowerCase());
        offerings.push(header);
      }
    }
  }

  return offerings.slice(0, 10);
}

/**
 * Extract project names from website content
 */
function extractProjects(content: string, companyName: string): string[] {
  const projects: string[] = [];

  // Look for project names that include the company name or common project patterns
  const companyBase = companyName.split(/\s+/)[0]; // e.g., "Prestige" from "Prestige Group"
  const projectPattern = new RegExp(
    `(?:${companyBase}|The)\\s+([A-Z][a-zA-Z]+(?:\\s+[A-Z][a-zA-Z]+)*)`,
    'g'
  );

  let match;
  const seen = new Set<string>();
  while ((match = projectPattern.exec(content)) !== null) {
    const projectName = match[0].trim();
    // Filter out navigation items and generic phrases
    const skipWords = ['Group', 'Ltd', 'Limited', 'Inc', 'Corp', 'Company', 'Enterprises', 'India', 'About', 'Contact', 'Careers', 'Blog', 'News'];
    if (projectName.length > 5 && projectName.length < 60 && !skipWords.some(w => projectName === `${companyBase} ${w}`)) {
      if (!seen.has(projectName.toLowerCase())) {
        seen.add(projectName.toLowerCase());
        projects.push(projectName);
      }
    }
  }

  // Also look for project names in link text patterns
  const linkTextPattern = /(?:Prestige|Adani|Sobha|DLF|Godrej|Brigade|Tata|Infosys|Wipro|Reliance|Mahindra|Bajaj|HDFC|ICICI|L&T|Shapoorji|Oberoi|Lodha|Brigade|Piramal|Prestige)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/g;
  while ((match = linkTextPattern.exec(content)) !== null) {
    const projectName = match[0].trim();
    if (projectName.length > 5 && projectName.length < 60 && !seen.has(projectName.toLowerCase())) {
      seen.add(projectName.toLowerCase());
      projects.push(projectName);
    }
  }

  return projects.slice(0, 15);
}

/**
 * Extract news/announcements from website content
 */
function extractNews(content: string): string[] {
  const news: string[] = [];

  // Split into paragraphs and look for news-like sentences
  const paragraphs = content.split(/\n\n+/).map(p => p.trim()).filter(p => p.length > 30 && p.length < 300);

  const newsIndicators = [
    'announced', 'launched', 'inaugurated', 'opened', 'signed', 'partnered',
    'invested', 'acquired', 'merged', 'expanding', 'expansion', 'growth',
    'new project', 'new development', 'milestone', 'achievement', 'award',
    'recognition', 'certified', 'approved', 'completed', 'delivered',
    'upcoming', 'planned', 'future', 'pipeline', 'strategic',
  ];

  for (const para of paragraphs) {
    if (newsIndicators.some(ind => para.toLowerCase().includes(ind))) {
      // Clean up the paragraph
      const cleaned = para.replace(/^#{1,4}\s+/, '').replace(/^[•\-*]\s+/, '').trim();
      if (cleaned.length > 20 && cleaned.length < 300) {
        news.push(cleaned);
      }
    }
    if (news.length >= 8) break;
  }

  return news;
}

/**
 * Extract about/overview text from website content
 */
function extractAboutText(content: string): string[] {
  const aboutTexts: string[] = [];

  // Look for paragraphs that describe the company
  const paragraphs = content.split(/\n\n+/).map(p => p.trim()).filter(p => p.length > 50 && p.length < 500);

  const aboutIndicators = [
    'founded', 'established', 'since', 'leading', 'pioneer', 'premier',
    'committed', 'mission', 'vision', 'values', 'legacy', 'over the',
    'has grown', 'one of the', 'among the', 'recognized', 'reputed',
  ];

  for (const para of paragraphs) {
    if (aboutIndicators.some(ind => para.toLowerCase().includes(ind))) {
      const cleaned = para.replace(/^#{1,4}\s+/, '').trim();
      if (cleaned.length > 30) {
        aboutTexts.push(cleaned);
      }
    }
    if (aboutTexts.length >= 5) break;
  }

  return aboutTexts;
}

/**
 * Extract stats/numbers from website content (e.g., "300+ Projects Completed")
 */
function extractStats(content: string): string[] {
  const stats: string[] = [];

  // Look for patterns like "300+ Projects", "200+ Mn. Sq. Ft.", "39+ Years"
  const statPattern = /(\d[\d,]*\+?\s*(?:Mn\.?|Bn\.?|Cr\.?|Lakh|Crore)?\s*(?:Sq\.?\s*(?:Ft|ft|Meter|m)|Years?|Projects?|Employees?|Cities?|Locations?|Countries?|Clients?|Customers?|Awards?|Offices?|Delivered|Completed|Underway|Ongoing|Planned|Acres|Units|Homes|Towers|Buildings?))/gi;

  let match;
  while ((match = statPattern.exec(content)) !== null) {
    const stat = match[0].trim();
    if (stat.length > 3 && !stats.includes(stat)) {
      stats.push(stat);
    }
    if (stats.length >= 10) break;
  }

  return stats;
}

/**
 * Extract leadership names from website content
 */
function extractLeadership(content: string): string[] {
  const leaders: string[] = [];

  // Look for common leadership patterns
  const patterns = [
    /(?:CMD|Chairman|MD|CEO|Managing Director|Founder|Co-founder|Director|President|CFO|CTO|COO|VP)[\s:]+(?:is\s+)?([A-Z][a-z]+(?:\s+[A-Z][a-z]+){1,3})/g,
    /(?:led by|founded by|headed by|spearheaded by)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+){1,3})/g,
  ];

  let match;
  const seen = new Set<string>();
  for (const pattern of patterns) {
    while ((match = pattern.exec(content)) !== null) {
      const name = match[1].trim();
      if (name.length > 4 && name.split(' ').length >= 2 && !seen.has(name.toLowerCase())) {
        seen.add(name.toLowerCase());
        leaders.push(name);
      }
    }
  }

  return leaders.slice(0, 6);
}

/**
 * Extract location names from website content
 */
function extractLocations(content: string): string[] {
  const locations: string[] = [];

  const knownCities = [
    'Mumbai', 'Delhi', 'Bangalore', 'Bengaluru', 'Hyderabad', 'Chennai',
    'Kolkata', 'Pune', 'Ahmedabad', 'Jaipur', 'Lucknow', 'Kochi',
    'Coimbatore', 'Indore', 'Bhopal', 'Patna', 'Nagpur', 'Goa',
    'Mangalore', 'Mysore', 'Chandigarh', 'Noida', 'Gurgaon', 'Gurugram',
    'Thiruvananthapuram', 'Calicut', 'Kozhikode', 'Vizag', 'Visakhapatnam',
    'Surat', 'Vadodara', 'Bhubaneswar', 'Guwahati', 'Dehradun',
    'New York', 'London', 'Singapore', 'Dubai', 'San Francisco',
    'Tokyo', 'Shanghai', 'Beijing', 'Sydney', 'Melbourne',
    'Toronto', 'Berlin', 'Paris', 'Amsterdam', 'Delhi-NCR',
  ];

  const seen = new Set<string>();
  for (const city of knownCities) {
    if (content.includes(city) && !seen.has(city.toLowerCase())) {
      seen.add(city.toLowerCase());
      locations.push(city);
    }
  }

  return locations;
}

/**
 * Main function: Scrape company website and extract structured data
 */
export async function scrapeCompanyWebsite(websiteUrl: string, companyName: string): Promise<WebsiteData> {
  const result: WebsiteData = {
    homepageContent: '',
    aboutContent: '',
    newsContent: '',
    projectsContent: '',
    offerings: [],
    projects: [],
    recentNews: [],
    expansionPlans: [],
    announcements: [],
    aboutText: [],
    statsFromWebsite: [],
    leadershipFromWebsite: [],
    locationsFromWebsite: [],
    websiteUrl,
    pagesScraped: 0,
    totalContentLength: 0,
  };

  if (!websiteUrl || websiteUrl === 'Not available') {
    return result;
  }

  try {
    // Normalize URL
    let baseUrl = websiteUrl;
    if (!baseUrl.startsWith('http')) {
      baseUrl = `https://${baseUrl}`;
    }
    baseUrl = baseUrl.replace(/\/+$/, '');

    // Step 1: Scrape homepage
    console.log(`[WebScraper] Scraping homepage: ${baseUrl}`);
    const homepage = await fetchFromJina(baseUrl);
    if (homepage) {
      result.homepageContent = cleanMarkdown(homepage);
      result.pagesScraped++;
      result.totalContentLength += result.homepageContent.length;
    }

    // Step 2: Try to scrape About page
    const aboutPaths = ['/about-us', '/about', '/company', '/who-we-are', '/our-story', '/aboutus'];
    console.log(`[WebScraper] Looking for About page...`);
    const aboutResult = await tryScrapePage(baseUrl, aboutPaths);
    if (aboutResult.content) {
      result.aboutContent = aboutResult.content;
      result.pagesScraped++;
      result.totalContentLength += result.aboutContent.length;
      console.log(`[WebScraper] Found About page at: ${aboutResult.path}`);
    }

    // Step 3: Try to scrape News/Press page
    const newsPaths = ['/news', '/press-releases', '/media', '/newsroom', '/blog', '/updates', '/insights'];
    console.log(`[WebScraper] Looking for News page...`);
    const newsResult = await tryScrapePage(baseUrl, newsPaths);
    if (newsResult.content) {
      result.newsContent = newsResult.content;
      result.pagesScraped++;
      result.totalContentLength += result.newsContent.length;
      console.log(`[WebScraper] Found News page at: ${newsResult.path}`);
    }

    // Step 4: Try to scrape Projects page (for real estate/construction companies)
    const projectPaths = ['/projects', '/residential-projects', '/our-projects', '/portfolio', '/work', '/properties'];
    console.log(`[WebScraper] Looking for Projects page...`);
    const projectsResult = await tryScrapePage(baseUrl, projectPaths);
    if (projectsResult.content) {
      result.projectsContent = projectsResult.content;
      result.pagesScraped++;
      result.totalContentLength += result.projectsContent.length;
      console.log(`[WebScraper] Found Projects page at: ${projectsResult.path}`);
    }

    // Step 5: Parse all collected content
    const allContent = [result.homepageContent, result.aboutContent, result.newsContent, result.projectsContent].filter(Boolean).join('\n\n');

    if (allContent.length > 0) {
      // Extract offerings
      const homepageOfferings = extractOfferings(result.homepageContent);
      const aboutOfferings = extractOfferings(result.aboutContent);
      result.offerings = [...new Set([...homepageOfferings, ...aboutOfferings])].slice(0, 10);

      // Extract projects
      const homepageProjects = extractProjects(result.homepageContent, companyName);
      const projectsPageProjects = extractProjects(result.projectsContent, companyName);
      result.projects = [...new Set([...homepageProjects, ...projectsPageProjects])].slice(0, 15);

      // Extract news
      const newsFromNewsPage = extractNews(result.newsContent);
      const newsFromAbout = extractNews(result.aboutContent);
      const newsFromHomepage = extractNews(result.homepageContent);
      result.recentNews = [...new Set([...newsFromNewsPage, ...newsFromAbout, ...newsFromHomepage])].slice(0, 8);

      // Extract expansion plans from news and about content
      const expansionFromNews = extractNews(result.newsContent).filter(
        n => n.toLowerCase().includes('expand') || n.toLowerCase().includes('growth') || n.toLowerCase().includes('new market') || n.toLowerCase().includes('launch')
      );
      result.expansionPlans = expansionFromNews.slice(0, 5);

      // Extract about text
      result.aboutText = extractAboutText(result.aboutContent || result.homepageContent);

      // Extract stats
      result.statsFromWebsite = extractStats(result.aboutContent || result.homepageContent);

      // Extract leadership
      result.leadershipFromWebsite = extractLeadership(result.aboutContent || result.homepageContent);

      // Extract locations
      result.locationsFromWebsite = extractLocations(allContent);

      console.log(`[WebScraper] Extracted: ${result.offerings.length} offerings, ${result.projects.length} projects, ${result.recentNews.length} news items, ${result.statsFromWebsite.length} stats`);
    }

    return result;
  } catch (err) {
    console.error('[WebScraper] Failed to scrape company website:', err);
    return result;
  }
}
