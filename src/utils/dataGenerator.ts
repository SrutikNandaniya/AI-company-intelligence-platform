import { CompanyData, Challenge, AIOpportunity } from '../types';
import { RawCompanyData, parseExtractSections } from './wikiApi';
import { WebsiteData } from './webScraper';

function generateChallenges(data: RawCompanyData): Challenge[] {
  const challenges: Challenge[] = [];
  const industry = data.industry.toLowerCase();
  const locations = data.locations;
  const hasMultipleLocations = locations.length > 2;
  // Employee count check for scale determination is handled below
  const hasSubsidiaries = data.subsidiaries.length > 0;

  if (industry.includes('real estate') || industry.includes('construction') || industry.includes('property')) {
    challenges.push(
      {
        challenge: 'Lead Management & Conversion',
        reason: 'Operating across multiple cities creates high inquiry volume with inconsistent follow-up processes',
        evidence: [
          `Active presence in ${locations.length}+ cities: ${locations.slice(0, 4).join(', ')}`,
          'High inquiry volume from multiple marketing channels',
          'Growing sales funnel complexity with diverse product offerings',
          'Seasonal demand fluctuations requiring dynamic resource allocation'
        ],
        severity: 'high'
      },
      {
        challenge: 'Project Coordination & Timeline Management',
        reason: 'Multiple concurrent projects across geographies increase operational complexity and delay risks',
        evidence: [
          `Operating across ${locations.length}+ geographic locations`,
          'Cross-functional dependencies between design, procurement, and construction',
          'Supply chain disruptions affecting material availability',
          'Regulatory compliance varying across state jurisdictions'
        ],
        severity: 'high'
      },
      {
        challenge: 'Customer Experience Consistency',
        reason: 'Growing customer base with diverse expectations across different project segments',
        evidence: [
          'Varied customer demographics from luxury to mid-segment',
          'Post-sale service requests increasing with project portfolio',
          'Maintaining brand consistency across all touchpoints',
          'Managing expectations during project delivery timelines'
        ],
        severity: 'medium'
      },
      {
        challenge: 'Cost Optimization & Margin Pressure',
        reason: 'Rising input costs and competitive pricing pressure impacting profitability',
        evidence: [
          'Raw material cost escalation in construction sector',
          'Competitive land acquisition driving up input costs',
          'Regulatory changes increasing compliance costs',
          'Customer demand for premium amenities at competitive prices'
        ],
        severity: 'medium'
      }
    );
  } else if (industry.includes('technology') || industry.includes('software') || industry.includes('it')) {
    challenges.push(
      {
        challenge: 'Talent Retention & Skill Gaps',
        reason: 'Rapid technology evolution demands continuous upskilling in a competitive job market',
        evidence: [
          'High attrition rate in key technology roles',
          'Emerging technology skills shortage in AI/ML and cloud',
          'Competition from global tech companies for top talent',
          'Increasing cost of skilled workforce acquisition'
        ],
        severity: 'high'
      },
      {
        challenge: 'Product Innovation Velocity',
        reason: 'Market demands faster feature delivery while maintaining quality and security',
        evidence: [
          'Competitor release cycles shortening continuously',
          'Customer expectations for continuous feature updates',
          'Technical debt slowing development velocity',
          'Security compliance requirements increasing complexity'
        ],
        severity: 'high'
      },
      {
        challenge: 'Scalable Infrastructure',
        reason: 'Growing user base requiring elastic and cost-efficient infrastructure',
        evidence: [
          'Peak load capacity requirements growing annually',
          'Multi-region deployment complexity',
          'Infrastructure cost optimization without performance impact',
          'Compliance requirements across different geographies'
        ],
        severity: 'medium'
      }
    );
  } else if (industry.includes('pharma') || industry.includes('health')) {
    challenges.push(
      {
        challenge: 'Regulatory Compliance',
        reason: 'Evolving global and local regulatory requirements demand continuous adaptation',
        evidence: [
          'Multiple regulatory frameworks across markets',
          'Clinical trial compliance and documentation',
          'Quality control standards increasingly stringent',
          'Post-market surveillance requirements'
        ],
        severity: 'high'
      },
      {
        challenge: 'R&D Pipeline Management',
        reason: 'Long development cycles with high failure rates require efficient pipeline optimization',
        evidence: [
          'Average 10-12 year drug development timeline',
          'High R&D expenditure with uncertain returns',
          'Patent cliffs threatening revenue streams',
          'Competition from generic manufacturers'
        ],
        severity: 'high'
      },
      {
        challenge: 'Supply Chain Resilience',
        reason: 'Global supply chain dependencies create vulnerabilities in drug manufacturing',
        evidence: [
          'API sourcing concentration in specific regions',
          'Cold chain logistics complexity',
          'Raw material quality assurance challenges',
          'Demand forecasting for critical medications'
        ],
        severity: 'medium'
      }
    );
  } else if (industry.includes('bank') || industry.includes('financial') || industry.includes('insur')) {
    challenges.push(
      {
        challenge: 'Digital Transformation & Legacy Systems',
        reason: 'Traditional banking infrastructure needs modernization while maintaining stability',
        evidence: [
          'Legacy core banking systems limiting agility',
          'Customer expectation for seamless digital experience',
          'Fintech competition eroding traditional market share',
          'Data integration across siloed systems'
        ],
        severity: 'high'
      },
      {
        challenge: 'Risk Management & Fraud Detection',
        reason: 'Sophisticated fraud patterns and evolving risk landscape require intelligent monitoring',
        evidence: [
          'Increasing cyber threats and phishing attacks',
          'Real-time transaction monitoring challenges',
          'Regulatory reporting requirements expanding',
          'Cross-border transaction risk assessment'
        ],
        severity: 'high'
      },
      {
        challenge: 'Customer Retention',
        reason: 'Low switching costs and intense competition from digital-first providers',
        evidence: [
          'Rising customer acquisition costs',
          'Digital-native competitors offering superior UX',
          'Personalization expectations increasing',
          'Multi-channel service consistency challenges'
        ],
        severity: 'medium'
      }
    );
  }

  // Common challenges for all companies
  if (hasMultipleLocations) {
    challenges.push({
      challenge: 'Operational Coordination Across Locations',
      reason: `Presence in ${locations.length}+ locations creates coordination complexity`,
      evidence: [
        `Operations spanning: ${locations.slice(0, 5).join(', ')}`,
        'Inconsistent processes across regional offices',
        'Communication delays between locations',
        'Local regulatory compliance variations'
      ],
      severity: 'medium'
    });
  }

  if (hasSubsidiaries) {
    challenges.push({
      challenge: 'Subsidiary Integration & Governance',
      reason: `Managing ${data.subsidiaries.length} subsidiaries requires unified governance framework`,
      evidence: [
        `Subsidiaries: ${data.subsidiaries.slice(0, 3).join(', ')}${data.subsidiaries.length > 3 ? ' and more' : ''}`,
        'Data silos between parent and subsidiary operations',
        'Inconsistent technology platforms across entities',
        'Compliance and reporting standardization needs'
      ],
      severity: 'medium'
    });
  }

  challenges.push({
    challenge: 'Data-Driven Decision Making',
    reason: 'Legacy systems and fragmented data sources prevent real-time insights',
    evidence: [
      'Siloed data across departments',
      'Manual reporting processes with delays',
      'Limited predictive analytics capabilities',
      'Inconsistent data formats across the organization'
    ],
    severity: 'high'
  });

  return challenges.slice(0, 6);
}

function generateAIOpportunities(challenges: Challenge[]): AIOpportunity[] {
  const opportunities: AIOpportunity[] = [];

  const solutionMap: Record<string, { solution: string; description: string; impact: number; feasibility: number; urgency: number }> = {
    'Lead Management & Conversion': {
      solution: 'AI Lead Scoring & Prioritization',
      description: 'Machine learning model that scores leads based on engagement patterns, demographics, and behavioral signals, enabling sales teams to focus on highest-conversion prospects.',
      impact: 95, feasibility: 92, urgency: 96
    },
    'Project Coordination & Timeline Management': {
      solution: 'Predictive Project Analytics',
      description: 'AI-powered project management system that predicts delays, optimizes resource allocation, and provides early warning signals for potential timeline risks.',
      impact: 88, feasibility: 85, urgency: 90
    },
    'Customer Experience Consistency': {
      solution: 'AI Customer Experience Platform',
      description: 'Intelligent chatbot and sentiment analysis system that provides 24/7 customer support, proactively identifies dissatisfaction, and ensures consistent brand experience.',
      impact: 90, feasibility: 94, urgency: 85
    },
    'Cost Optimization & Margin Pressure': {
      solution: 'AI-Driven Cost Optimization Engine',
      description: 'Predictive analytics platform for cost forecasting, procurement optimization, and margin analysis across all projects and business units.',
      impact: 85, feasibility: 80, urgency: 88
    },
    'Data-Driven Decision Making': {
      solution: 'Enterprise AI Analytics Hub',
      description: 'Centralized AI analytics platform that unifies data across departments, provides real-time dashboards, and generates actionable insights with natural language queries.',
      impact: 93, feasibility: 88, urgency: 95
    },
    'Talent Retention & Skill Gaps': {
      solution: 'AI Talent Intelligence Platform',
      description: 'Predictive attrition modeling, personalized learning path recommendations, and skill gap analysis powered by AI to proactively retain and develop talent.',
      impact: 88, feasibility: 85, urgency: 90
    },
    'Product Innovation Velocity': {
      solution: 'AI-Assisted Development Platform',
      description: 'AI code assistant, automated testing, and intelligent CI/CD pipeline that accelerates development cycles while maintaining quality and security standards.',
      impact: 92, feasibility: 88, urgency: 91
    },
    'Scalable Infrastructure': {
      solution: 'AI Infrastructure Optimizer',
      description: 'Intelligent auto-scaling and resource optimization system that predicts load patterns, pre-provisions capacity, and optimizes cloud spend in real-time.',
      impact: 86, feasibility: 92, urgency: 82
    },
    'Regulatory Compliance': {
      solution: 'AI Compliance Monitoring System',
      description: 'Automated compliance monitoring and reporting system that tracks regulatory changes, audits processes, and generates compliance documentation in real-time.',
      impact: 91, feasibility: 84, urgency: 95
    },
    'R&D Pipeline Management': {
      solution: 'AI Drug Discovery & Pipeline Optimizer',
      description: 'ML models for drug candidate identification, clinical trial optimization, and pipeline prioritization to accelerate R&D cycles and reduce failure rates.',
      impact: 94, feasibility: 72, urgency: 93
    },
    'Supply Chain Resilience': {
      solution: 'AI Supply Chain Intelligence',
      description: 'Predictive supply chain analytics with demand forecasting, supplier risk assessment, and automated alternative sourcing recommendations.',
      impact: 89, feasibility: 86, urgency: 90
    },
    'Digital Transformation & Legacy Systems': {
      solution: 'AI-Powered Digital Transformation Engine',
      description: 'Intelligent assessment and migration platform that analyzes legacy systems, prioritizes modernization efforts, and automates data migration with quality assurance.',
      impact: 90, feasibility: 82, urgency: 94
    },
    'Risk Management & Fraud Detection': {
      solution: 'AI Fraud Detection & Risk Engine',
      description: 'Real-time fraud detection using pattern recognition, anomaly detection, and behavioral analysis to identify suspicious transactions before they cause damage.',
      impact: 96, feasibility: 90, urgency: 97
    },
    'Customer Retention': {
      solution: 'Predictive Churn Prevention System',
      description: 'ML models that identify at-risk customers before they churn, trigger automated retention workflows, and provide personalized offers to improve lifetime value.',
      impact: 94, feasibility: 90, urgency: 93
    },
    'Operational Coordination Across Locations': {
      solution: 'AI Operations Coordination Platform',
      description: 'Intelligent workflow orchestration across locations with real-time dashboards, automated escalation, and predictive resource balancing.',
      impact: 87, feasibility: 88, urgency: 85
    },
    'Subsidiary Integration & Governance': {
      solution: 'AI Governance & Integration Platform',
      description: 'Unified data platform with automated compliance monitoring, standardized reporting, and intelligent integration layer for multi-entity governance.',
      impact: 84, feasibility: 80, urgency: 82
    },
  };

  for (const challenge of challenges) {
    const mapped = solutionMap[challenge.challenge];
    if (mapped) {
      opportunities.push({
        challenge: challenge.challenge,
        solution: mapped.solution,
        impact: mapped.impact,
        feasibility: mapped.feasibility,
        urgency: mapped.urgency,
        totalScore: Math.round((mapped.impact + mapped.feasibility + mapped.urgency) / 3),
        description: mapped.description
      });
    } else {
      const baseImpact = 75 + Math.floor(Math.random() * 20);
      const baseFeasibility = 70 + Math.floor(Math.random() * 25);
      const baseUrgency = 70 + Math.floor(Math.random() * 25);
      opportunities.push({
        challenge: challenge.challenge,
        solution: `AI Solution for ${challenge.challenge}`,
        impact: baseImpact,
        feasibility: baseFeasibility,
        urgency: baseUrgency,
        totalScore: Math.round((baseImpact + baseFeasibility + baseUrgency) / 3),
        description: `AI-powered solution designed to address ${challenge.challenge.toLowerCase()} through intelligent automation, predictive analytics, and data-driven decision support.`
      });
    }
  }

  return opportunities.sort((a, b) => b.totalScore - a.totalScore);
}

function generateCEOPitch(name: string, industry: string, rawData: RawCompanyData, challenges: Challenge[], opportunities: AIOpportunity[]): string {
  const topOpportunities = opportunities.slice(0, 3);
  const topChallenges = challenges.filter(c => c.severity === 'high').slice(0, 3);

  const foundedText = rawData.founded !== 'N/A' ? `Since its founding in ${rawData.founded},` : 'As a leading player in its sector,';
  const locationText = rawData.headquarters.length > 0 ? `headquartered in ${rawData.headquarters[0]}` : 'with a growing presence';
  const founderText = rawData.founders.length > 0 ? `founded by ${rawData.founders.join(' and ')}` : '';

  return `Dear CEO of ${name},

I hope this letter finds you well. After conducting a thorough analysis of ${name} and the broader ${industry.toLowerCase()} landscape using our AI-powered intelligence platform, I've identified strategic opportunities where artificial intelligence can significantly accelerate your company's growth and operational efficiency.

CURRENT LANDSCAPE
${foundedText} ${name} has established itself as a key player in the ${industry.toLowerCase()} sector${founderText ? ', ' + founderText : ''}. The company, ${locationText}, operates across ${rawData.locations.length}+ locations with a growing portfolio that presents both significant opportunities and operational complexities.

Our research draws from publicly available data including Wikipedia, Wikidata, and other authoritative sources to provide an evidence-based assessment.

KEY CHALLENGES IDENTIFIED
${topChallenges.map((c, i) => `${i + 1}. ${c.challenge}: ${c.reason}`).join('\n')}

STRATEGIC AI RECOMMENDATIONS
Based on our analysis, we recommend the following AI initiatives, ranked by impact and feasibility:

${topOpportunities.map((o, i) => `${i + 1}. ${o.solution} (Impact Score: ${o.totalScore}/100)
   → Addresses: ${o.challenge}
   → ${o.description}`).join('\n\n')}

PROJECTED IMPACT
Implementing these AI solutions can deliver:
• 30-40% improvement in operational efficiency
• 25-35% reduction in customer response time
• 15-25% increase in lead conversion rates
• 20-30% cost savings in process automation
• Enhanced data-driven decision making across all departments

IMPLEMENTATION ROADMAP
Phase 1 (Months 1-3): Quick Wins — Deploy ${topOpportunities[0]?.solution || 'AI Analytics'} for immediate ROI
Phase 2 (Months 4-6): Scale — Expand AI capabilities to ${topOpportunities[1]?.solution || 'additional areas'}
Phase 3 (Months 7-12): Transform — Full AI integration with ${topOpportunities[2]?.solution || 'enterprise platform'}

We believe ${name} is uniquely positioned to leverage AI as a competitive advantage. The combination of your market presence, growing data assets, and operational scale creates an ideal foundation for AI-driven transformation.

I would welcome the opportunity to discuss these recommendations in detail and explore how we can partner to unlock ${name}'s full AI potential.

Best regards,
StrategicAI Analysis Engine`;
}

/**
 * Build a CompanyData object from raw Wikipedia/Wikidata data.
 * This is the main function that transforms API data into the app's internal format.
 */
export function buildCompanyData(rawData: RawCompanyData, websiteData?: WebsiteData): CompanyData {
  // Parse the full extract for structured sections
  const sections = parseExtractSections(rawData.fullExtract);

  const hasWebsiteData = websiteData && websiteData.pagesScraped > 0;

  // Build leadership list — merge Wikipedia + website data
  const leadership: string[] = [];
  if (rawData.founders.length > 0) {
    rawData.founders.forEach(f => leadership.push(`${f} — Founder`));
  }
  if (rawData.ceo.length > 0) {
    rawData.ceo.forEach(c => leadership.push(`${c} — CEO`));
  }
  // Add leadership from Wikipedia text parsing
  leadership.push(...sections.leadership.slice(0, 3));
  // Add leadership from website
  if (hasWebsiteData && websiteData.leadershipFromWebsite.length > 0) {
    websiteData.leadershipFromWebsite.forEach(l => {
      if (!leadership.some(existing => existing.toLowerCase().includes(l.toLowerCase()))) {
        leadership.push(l);
      }
    });
  }
  if (leadership.length === 0) {
    leadership.push('Information not available from public sources');
  }

  // Build offerings — prioritize website data, then Wikipedia, then defaults
  let offerings: string[];
  if (hasWebsiteData && websiteData.offerings.length > 0) {
    offerings = websiteData.offerings;
  } else if (sections.offerings.length > 0) {
    offerings = sections.offerings;
  } else {
    offerings = generateDefaultOfferings(rawData.industry);
  }

  // Build projects — merge Wikipedia + website data
  let projects: string[];
  if (hasWebsiteData && websiteData.projects.length > 0) {
    projects = [...new Set([...websiteData.projects, ...sections.projects])].slice(0, 15);
  } else if (sections.projects.length > 0) {
    projects = sections.projects;
  } else {
    projects = [];
  }

  // Build recent news — merge Wikipedia + website data
  let recentNews: string[];
  if (hasWebsiteData && websiteData.recentNews.length > 0) {
    const wikiNews = extractNewsFromText(rawData.fullExtract);
    recentNews = [...new Set([...websiteData.recentNews, ...wikiNews])].slice(0, 8);
  } else {
    recentNews = extractNewsFromText(rawData.fullExtract);
  }

  // Build expansion plans — merge Wikipedia + website data
  let expansionPlans: string[];
  if (hasWebsiteData && websiteData.expansionPlans.length > 0) {
    const wikiPlans = extractExpansionFromText(rawData.fullExtract, rawData.locations);
    expansionPlans = [...new Set([...websiteData.expansionPlans, ...wikiPlans])].slice(0, 6);
  } else {
    expansionPlans = extractExpansionFromText(rawData.fullExtract, rawData.locations);
  }

  // Build announcements from website
  let announcements: string[];
  if (hasWebsiteData && websiteData.recentNews.length > 0) {
    announcements = websiteData.recentNews.slice(0, 4);
  } else {
    announcements = [];
  }

  // Merge locations from all sources
  const allLocations = [...new Set([
    ...rawData.locations,
    ...rawData.headquarters,
    ...(hasWebsiteData ? websiteData.locationsFromWebsite : []),
  ])];
  // Deduplicate similar city names
  const uniqueLocations: string[] = [];
  const seenLower = new Set<string>();
  for (const loc of allLocations) {
    if (!seenLower.has(loc.toLowerCase())) {
      seenLower.add(loc.toLowerCase());
      uniqueLocations.push(loc);
    }
  }

  // Generate challenges, opportunities, and CEO pitch based on real data
  const challenges = generateChallenges(rawData);
  const aiOpportunities = generateAIOpportunities(challenges);
  const ceoPitch = generateCEOPitch(rawData.name, rawData.industry, rawData, challenges, aiOpportunities);

  // Build a more descriptive description — use website about text if available
  let description = rawData.summary;
  if (hasWebsiteData && websiteData.aboutText.length > 0) {
    description = websiteData.aboutText[0];
  } else if (!description || description.length < 50) {
    description = `${rawData.name} is a company in the ${rawData.industry} sector`;
    if (rawData.headquarters.length > 0) description += ` headquartered in ${rawData.headquarters[0]}`;
    if (rawData.founded !== 'N/A') description += `, founded in ${rawData.founded}`;
    if (rawData.founders.length > 0) description += ` by ${rawData.founders.join(' and ')}`;
    description += '.';
  }

  // Determine scale
  let scale = 'Enterprise';
  if (rawData.employees !== 'N/A') {
    const empNum = parseInt(rawData.employees.replace(/[^0-9]/g, ''));
    if (empNum > 10000) scale = 'Large Enterprise';
    else if (empNum > 1000) scale = 'Mid-to-Large Enterprise';
    else if (empNum > 100) scale = 'Mid-size Enterprise';
    else scale = 'Small-to-Mid Enterprise';
  }

  // Build a richer summary using all available data
  let summary = rawData.summary || description;
  if (hasWebsiteData && websiteData.aboutText.length > 0 && (!summary || summary.length < 100)) {
    summary = websiteData.aboutText.slice(0, 2).join(' ');
  }

  // Use website URL if we have it, otherwise Wikipedia's
  const finalWebsite = (hasWebsiteData && websiteData.websiteUrl) ? websiteData.websiteUrl : (rawData.website || 'Not available');

  return {
    name: rawData.name,
    industry: rawData.industry !== 'N/A' ? rawData.industry : 'Diversified',
    scale,
    locations: uniqueLocations.length > 0 ? uniqueLocations : rawData.headquarters,
    employees: rawData.employees !== 'N/A' ? rawData.employees : 'Not publicly available',
    founded: rawData.founded !== 'N/A' ? rawData.founded : 'Not available',
    website: finalWebsite,
    summary,
    description,
    offerings,
    projects,
    recentNews,
    expansionPlans,
    announcements,
    leadership,
    customerReviews: [],
    challenges,
    aiOpportunities,
    ceoPitch,
    wikipediaUrl: rawData.wikipediaUrl,
    thumbnail: rawData.thumbnail,
    wikidataId: rawData.wikidataId,
    fullExtract: rawData.fullExtract,
    websiteData: hasWebsiteData ? {
      scraped: true,
      pagesScraped: websiteData.pagesScraped,
      totalContentLength: websiteData.totalContentLength,
      websiteUrl: websiteData.websiteUrl,
      statsFromWebsite: websiteData.statsFromWebsite,
    } : undefined,
  };
}

function generateDefaultOfferings(industry: string): string[] {
  const ind = industry.toLowerCase();
  if (ind.includes('real estate') || ind.includes('construction') || ind.includes('property')) {
    return ['Residential Development', 'Commercial Properties', 'Retail Spaces', 'Integrated Townships', 'Office Complexes'];
  }
  if (ind.includes('technology') || ind.includes('software') || ind.includes('it')) {
    return ['Software Products', 'Cloud Services', 'IT Consulting', 'Digital Solutions', 'Platform Services'];
  }
  if (ind.includes('pharma') || ind.includes('health')) {
    return ['Pharmaceutical Products', 'Drug Development', 'Clinical Research', 'Medical Devices', 'Healthcare Solutions'];
  }
  if (ind.includes('bank') || ind.includes('financial')) {
    return ['Banking Services', 'Loans & Credit', 'Investment Products', 'Insurance', 'Digital Banking'];
  }
  if (ind.includes('energy') || ind.includes('power')) {
    return ['Power Generation', 'Energy Distribution', 'Renewable Energy', 'Oil & Gas', 'Energy Trading'];
  }
  if (ind.includes('conglomerate')) {
    return ['Diversified Business Operations', 'Strategic Investments', 'Portfolio Management', 'Cross-Sector Services'];
  }
  return ['Core Products & Services', 'Premium Solutions', 'Digital Platforms', 'Consulting Services'];
}

function extractNewsFromText(text: string): string[] {
  const news: string[] = [];
  if (!text) return news;

  // Extract sentences that sound like news/developments
  const sentences = text.split(/[.!?]+/).map(s => s.trim()).filter(s => s.length > 30 && s.length < 200);

  // Look for sentences with indicators of recent developments
  const newsIndicators = ['expanded', 'launched', 'acquired', 'merged', 'announced', 'opened', 'signed', 'partnered', 'invested', 'developing', 'new', 'growth', 'recently', 'latest', 'inaugurated'];

  for (const sentence of sentences) {
    if (newsIndicators.some(ind => sentence.toLowerCase().includes(ind))) {
      news.push(sentence + '.');
    }
    if (news.length >= 6) break;
  }

  // If we couldn't find news-like sentences, use the first few substantial sentences
  if (news.length === 0) {
    for (const sentence of sentences.slice(0, 4)) {
      news.push(sentence + '.');
    }
  }

  return news.slice(0, 6);
}

function extractExpansionFromText(text: string, locations: string[]): string[] {
  const plans: string[] = [];
  if (!text) return plans;

  // Extract sentences about expansion
  const sentences = text.split(/[.!?]+/).map(s => s.trim()).filter(s => s.length > 20 && s.length < 200);
  const expansionIndicators = ['expanding', 'expansion', 'planning', 'growth', 'new market', 'entering', 'diversif', 'future', 'upcoming', 'pipeline', 'target'];

  for (const sentence of sentences) {
    if (expansionIndicators.some(ind => sentence.toLowerCase().includes(ind))) {
      plans.push(sentence + '.');
    }
    if (plans.length >= 5) break;
  }

  if (locations.length > 1) {
    plans.push(`Geographic expansion across ${locations.length}+ locations including ${locations.slice(0, 4).join(', ')}`);
  }

  return plans.slice(0, 5);
}

/**
 * Build CompanyData when only a website URL is provided (no Wikipedia/Wikidata).
 * This extracts everything from the website scrape results.
 */
export function buildCompanyDataFromWebsite(websiteData: WebsiteData, url: string): CompanyData {
  // Derive company name from URL
  let companyName = '';
  try {
    const hostname = new URL(url.startsWith('http') ? url : `https://${url}`).hostname;
    // Remove www. and TLD
    companyName = hostname.replace(/^www\./, '').replace(/\.(com|in|co\.in|org|net|io|ai|dev|biz|info|co\.uk|co|me|cc|tv)$/i, '');
    // Capitalize words
    companyName = companyName.split(/[.\-_]/).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  } catch {
    companyName = url;
  }

  // Derive industry from website content
  const allContent = [websiteData.homepageContent, websiteData.aboutContent, websiteData.newsContent, websiteData.projectsContent].filter(Boolean).join(' ');
  const industry = deriveIndustryFromContent(allContent);

  // Build description from about text
  let description = '';
  if (websiteData.aboutText.length > 0) {
    description = websiteData.aboutText.slice(0, 3).join(' ');
  } else if (websiteData.homepageContent) {
    // Take the first substantial paragraph from homepage
    const paragraphs = websiteData.homepageContent.split('\n\n').filter((p: string) => p.trim().length > 50 && p.trim().length < 500);
    description = paragraphs[0]?.trim() || `${companyName} is a company in the ${industry} sector.`;
  } else {
    description = `${companyName} is a company in the ${industry} sector.`;
  }

  // Build summary (shorter version of description)
  const summary = websiteData.aboutText.length > 0
    ? websiteData.aboutText[0]
    : description.slice(0, 300) + (description.length > 300 ? '...' : '');

  // Extract founding year from about text
  const foundedMatch = allContent.match(/[Ff]ound(?:ed)?\s+(?:in|by)\s+(\d{4})/);
  const founded = foundedMatch ? foundedMatch[1] : 'Not available from website';

  // Build offerings
  const offerings = websiteData.offerings.length > 0
    ? websiteData.offerings
    : generateDefaultOfferings(industry);

  // Build locations
  const locations = websiteData.locationsFromWebsite.length > 0
    ? websiteData.locationsFromWebsite
    : [];

  // Build leadership
  const leadership = websiteData.leadershipFromWebsite.length > 0
    ? websiteData.leadershipFromWebsite
    : ['Not available from website'];

  // Create a synthetic RawCompanyData for challenge generation
  const syntheticRaw: RawCompanyData = {
    name: companyName,
    summary,
    fullExtract: allContent,
    description,
    founded,
    industry,
    headquarters: locations.slice(0, 2),
    employees: 'Not available from website',
    website: url.startsWith('http') ? url : `https://${url}`,
    founders: [],
    ceo: [],
    parentOrg: '',
    subsidiaries: [],
    locations,
    type: '',
    country: '',
  };

  const challenges = generateChallenges(syntheticRaw);
  const aiOpportunities = generateAIOpportunities(challenges);
  const ceoPitch = generateCEOPitch(companyName, industry, syntheticRaw, challenges, aiOpportunities);

  return {
    name: companyName,
    industry,
    scale: 'Enterprise',
    locations,
    employees: 'Not available from website',
    founded,
    website: url.startsWith('http') ? url : `https://${url}`,
    summary,
    description,
    offerings,
    projects: websiteData.projects,
    recentNews: websiteData.recentNews,
    expansionPlans: websiteData.expansionPlans,
    announcements: websiteData.recentNews.slice(0, 4),
    leadership,
    customerReviews: [],
    challenges,
    aiOpportunities,
    ceoPitch,
    wikipediaUrl: undefined,
    thumbnail: undefined,
    wikidataId: undefined,
    fullExtract: allContent,
    websiteData: websiteData.pagesScraped > 0 ? {
      scraped: true,
      pagesScraped: websiteData.pagesScraped,
      totalContentLength: websiteData.totalContentLength,
      websiteUrl: websiteData.websiteUrl,
      statsFromWebsite: websiteData.statsFromWebsite,
    } : undefined,
  };
}

function deriveIndustryFromContent(content: string): string {
  const text = content.toLowerCase();

  const industryKeywords: [string[], string][] = [
    [['real estate', 'property', 'construction', 'housing', 'developer', 'infrastructure', 'apartment', 'villa', 'flat', 'plot'], 'Real Estate & Construction'],
    [['technology', 'software', 'it ', 'information technology', 'tech company', 'digital', 'saas', 'cloud', 'platform'], 'Technology & Software'],
    [['pharmaceutical', 'pharma', 'drug', 'healthcare', 'biotech', 'medical'], 'Pharmaceuticals & Healthcare'],
    [['bank', 'banking', 'financial', 'insurance', 'fintech', 'investment', 'loan'], 'Banking & Financial Services'],
    [['automobile', 'automotive', 'auto ', 'motor', 'vehicle', 'ev ', 'car '], 'Automotive'],
    [['retail', 'e-commerce', 'ecommerce', 'consumer goods', 'fmcg', 'supermarket', 'store'], 'Retail & Consumer Goods'],
    [['energy', 'power', 'solar', 'wind', 'oil', 'gas', 'petroleum', 'renewable'], 'Energy & Power'],
    [['food', 'beverage', 'restaurant', 'brewery', 'dairy', 'organic'], 'Food & Beverage'],
    [['education', 'edtech', 'learning', 'university', 'training', 'school', 'course'], 'Education & EdTech'],
    [['telecom', 'telecommunication', 'wireless', '5g', 'broadband'], 'Telecommunications'],
    [['media', 'entertainment', 'film', 'broadcasting', 'publishing', 'gaming', 'content'], 'Media & Entertainment'],
    [['logistics', 'shipping', 'courier', 'supply chain', 'transport', 'cargo'], 'Logistics & Transportation'],
    [['mining', 'steel', 'cement', 'metal', 'mineral'], 'Mining & Materials'],
    [['agriculture', 'agritech', 'farming', 'crop', 'agri'], 'Agriculture'],
    [['conglomerate', 'diversified', 'multinational conglomerate'], 'Conglomerate'],
    [['hospitality', 'hotel', 'tourism', 'travel', 'resort'], 'Hospitality & Tourism'],
    [['aerospace', 'defense', 'defence', 'aviation'], 'Aerospace & Defense'],
    [['consulting', 'advisory', 'professional services', 'audit'], 'Consulting & Professional Services'],
  ];

  for (const [keywords, industry] of industryKeywords) {
    if (keywords.some((kw: string) => text.includes(kw))) {
      return industry;
    }
  }

  return 'Diversified';
}
