import React from 'react';
import { Download, ArrowLeft } from 'lucide-react';

interface DocumentationProps {
  onClose: () => void;
}

const Documentation: React.FC<DocumentationProps> = ({ onClose }) => {
  const handleDownloadPDF = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Screen-only header */}
      <div className="print:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
        <button onClick={onClose} className="flex items-center gap-2 text-gray-600 hover:text-gray-900 text-sm font-medium">
          <ArrowLeft className="w-4 h-4" /> Back to App
        </button>
        <h1 className="text-lg font-bold text-gray-900">StrategicAI — Project Documentation</h1>
        <button onClick={handleDownloadPDF} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
          <Download className="w-4 h-4" /> Save as PDF
        </button>
      </div>

      {/* Printable document */}
      <div className="max-w-4xl mx-auto px-8 py-20 print:py-8 print:px-12">
        <div className="print:block">
          {/* Title Page */}
          <div className="mb-16 text-center print:mb-12">
            <div className="inline-flex items-center gap-3 mb-6">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                <span className="text-white text-2xl font-bold">S</span>
              </div>
            </div>
            <h1 className="text-4xl font-black text-gray-900 mb-2">StrategicAI</h1>
            <p className="text-xl text-blue-600 font-semibold mb-4">AI-Powered Company Intelligence & Recommendation Platform</p>
            <div className="h-1 w-32 bg-gradient-to-r from-cyan-500 to-blue-600 mx-auto mb-6" />
            <p className="text-gray-500">Comprehensive Project Documentation</p>
            <p className="text-gray-400 text-sm mt-2">Version 2.0 — June 2026</p>
          </div>

          {/* Table of Contents */}
          <div className="mb-12 p-6 bg-gray-50 rounded-xl border border-gray-200">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Table of Contents</h2>
            <ol className="space-y-2 text-gray-700">
              <li><span className="font-semibold">1.</span> Executive Summary</li>
              <li><span className="font-semibold">2.</span> Problem Statement & Motivation</li>
              <li><span className="font-semibold">3.</span> Approach & Solution</li>
              <li><span className="font-semibold">4.</span> System Architecture</li>
              <li><span className="font-semibold">5.</span> Data Sources & AI Tools Used</li>
              <li><span className="font-semibold">6.</span> How It Works — Step by Step</li>
              <li><span className="font-semibold">7.</span> Key Features</li>
              <li><span className="font-semibold">8.</span> Challenges Faced & Solutions</li>
              <li><span className="font-semibold">9.</span> GLM-5.1 Integration Guide</li>
              <li><span className="font-semibold">10.</span> Technical Stack</li>
              <li><span className="font-semibold">11.</span> Future Roadmap</li>
            </ol>
          </div>

          {/* Section 1 */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b-2 border-blue-600 pb-2">1. Executive Summary</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              <strong>StrategicAI</strong> is an AI-powered company intelligence platform that enables users to research any company in the world and receive strategic business recommendations powered by artificial intelligence. The platform combines real-time data from Wikipedia, Wikidata, and company websites to build a comprehensive knowledge base, then uses AI analysis to identify business challenges and recommend AI-driven solutions.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              Unlike traditional company research tools that simply generate a static report, StrategicAI provides an <strong>interactive chatbot</strong> that lets users ask questions about the company, an <strong>evidence-based challenge detector</strong> that identifies business risks with supporting evidence, an <strong>AI opportunity generator</strong> that recommends specific AI solutions ranked by impact, and a <strong>CEO pitch generator</strong> that creates an executive-ready strategic recommendation letter.
            </p>
            <div className="p-4 bg-blue-50 border-l-4 border-blue-500 rounded-r-lg">
              <p className="text-blue-800 text-sm font-medium">Key Differentiator: Most company analysis tools stop at generating a report. StrategicAI goes further — it builds a RAG (Retrieval-Augmented Generation) knowledge base that users can chat with, identifies specific challenges with evidence, and recommends targeted AI solutions with impact scoring.</p>
            </div>
          </section>

          {/* Section 2 */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b-2 border-blue-600 pb-2">2. Problem Statement & Motivation</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              When business consultants, strategists, or students need to analyze a company, they typically face these problems:
            </p>
            <ul className="space-y-2 mb-4">
              <li className="flex items-start gap-2 text-gray-700"><span className="text-red-500 font-bold">✗</span> <span><strong>Manual research is slow</strong> — Searching Wikipedia, company websites, news articles, and databases takes hours.</span></li>
              <li className="flex items-start gap-2 text-gray-700"><span className="text-red-500 font-bold">✗</span> <span><strong>Data is scattered</strong> — Company information exists across Wikipedia, official websites, news sites, and databases, but nothing brings it all together.</span></li>
              <li className="flex items-start gap-2 text-gray-700"><span className="text-red-500 font-bold">✗</span> <span><strong>No strategic analysis</strong> — Most tools show data but don't tell you what it means for the business or what AI can do about it.</span></li>
              <li className="flex items-start gap-2 text-gray-700"><span className="text-red-500 font-bold">✗</span> <span><strong>Not all companies are on Wikipedia</strong> — Many companies, especially smaller or newer ones, don't have Wikipedia articles. This means traditional research methods fail entirely for these companies.</span></li>
              <li className="flex items-start gap-2 text-gray-700"><span className="text-red-500 font-bold">✗</span> <span><strong>Fake/generated data</strong> — Many AI tools fabricate company information when they don't have real data, leading to inaccurate and misleading results.</span></li>
            </ul>
            <p className="text-gray-700 leading-relaxed">
              StrategicAI was built to solve all of these problems by providing <strong>real, verified data</strong> from multiple sources, <strong>intelligent analysis</strong> powered by AI, and <strong>actionable recommendations</strong> — all in one platform.
            </p>
          </section>

          {/* Section 3 */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b-2 border-blue-600 pb-2">3. Approach & Solution</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              StrategicAI uses a <strong>multi-source data fusion</strong> approach — instead of relying on a single data source, it combines information from three independent sources and merges them intelligently:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="p-4 bg-cyan-50 border border-cyan-200 rounded-xl">
                <h4 className="font-bold text-cyan-800 mb-2">🏢 Option A: Company Name</h4>
                <ol className="text-sm text-cyan-700 space-y-1 list-decimal ml-4">
                  <li>Search Wikipedia for company article</li>
                  <li>Fetch structured data from Wikidata</li>
                  <li>Find company website from Wikidata</li>
                  <li>Scrape company website for real-time data</li>
                  <li>Merge all sources into knowledge base</li>
                </ol>
              </div>
              <div className="p-4 bg-purple-50 border border-purple-200 rounded-xl">
                <h4 className="font-bold text-purple-800 mb-2">🌐 Option B: Company Website</h4>
                <ol className="text-sm text-purple-700 space-y-1 list-decimal ml-4">
                  <li>Scrape company website homepage</li>
                  <li>Crawl /about, /news, /projects pages</li>
                  <li>Extract offerings, projects, stats</li>
                  <li>Optional: Use GLM-5.1 for AI extraction</li>
                  <li>Build knowledge base from website data</li>
                </ol>
              </div>
            </div>

            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl mb-4">
              <h4 className="font-bold text-yellow-800 mb-2">💡 Why Two Options?</h4>
              <p className="text-sm text-yellow-700">
                Not all companies have Wikipedia articles. Small businesses, startups, and regional companies may not meet Wikipedia's notability criteria. By providing a direct website input option, StrategicAI can analyze <strong>any company in the world</strong> — as long as they have a website. This ensures 100% coverage regardless of the company's size or Wikipedia presence.
              </p>
            </div>

            <p className="text-gray-700 leading-relaxed">
              Once data is collected from these sources, the system builds a <strong>Vector Knowledge Base</strong> using the BAAI/bge-small-en-v1.5 embedding model and ChromaDB vector database. This enables a <strong>RAG (Retrieval-Augmented Generation) chatbot</strong> that can answer questions about the company without hallucination — every answer is grounded in the actual data retrieved from real sources.
            </p>
          </section>

          {/* Section 4 */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b-2 border-blue-600 pb-2">4. System Architecture</h2>
            <div className="p-6 bg-gray-50 rounded-xl border border-gray-200 font-mono text-sm text-gray-700 overflow-x-auto">
              <pre>{`
┌─────────────────────────────────────────────────────────┐
│                    USER INPUT                            │
│          Company Name  OR  Company Website URL           │
└──────────┬──────────────────────┬───────────────────────┘
           │                      │
     ┌─────▼─────┐        ┌─────▼──────┐
     │  OPTION A  │        │  OPTION B   │
     │ Name Input │        │ Website URL │
     └─────┬─────┘        └─────┬──────┘
           │                      │
   ┌───────▼────────┐    ┌──────▼────────┐
   │  WIKIPEDIA API  │    │  JINA AI       │
   │  Article Search │    │  READER API    │
   │  Full Extract   │    │  (r.jina.ai)   │
   └───────┬────────┘    │  Scrape Website│
           │             └──────┬────────┘
   ┌───────▼────────┐           │
   │  WIKIDATA API   │           │
   │  Structured Data│           │
   │  Founded, HQ,   │           │
   │  Industry, CEO  │           │
   └───────┬────────┘           │
           │                    │
   ┌───────▼────────┐           │
   │  WEBSITE SCRAPE │           │
   │  (via Jina AI)  │           │
   │  Home, About,   │           │
   │  News, Projects │           │
   └───────┬────────┘           │
           │                    │
           │    ┌───────────────▼────────┐
           │    │  GLM-5.1 LLM (Optional) │
           │    │  Intelligent Extraction  │
           │    │  Structured Data Output  │
           │    └───────────────┬────────┘
           │                    │
     ┌─────▼────────────────────▼─────┐
     │       DATA MERGE & CLEANING     │
     │  Deduplicate, validate, merge   │
     └───────────────┬─────────────────┘
                     │
     ┌───────────────▼─────────────────┐
     │       VECTOR KNOWLEDGE BASE      │
     │  BAAI/bge-small-en-v1.5          │
     │  ChromaDB Vector Store           │
     └───────────────┬─────────────────┘
                     │
           ┌─────────▼─────────┐
           │   RAG CHATBOT      │
           │   Chat with Data   │
           └─────────┬─────────┘
                     │
     ┌───────────────▼─────────────────┐
     │       AI ANALYSIS ENGINE         │
     │  Challenge Detection             │
     │  AI Opportunity Generator        │
     │  Impact Scoring                  │
     │  CEO Pitch Generator             │
     └───────────────┬─────────────────┘
                     │
     ┌───────────────▼─────────────────┐
     │           OUTPUT DASHBOARD        │
     │  📊 Overview  │ ⚠ Challenges     │
     │  🏢 Business  │ 🤖 AI Opportunities│
     │  🎯 Scoring   │ 📄 CEO Pitch       │
     │  💬 RAG Chat  │ 📥 Export Report    │
     └─────────────────────────────────┘
              `}</pre>
            </div>
          </section>

          {/* Section 5 */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b-2 border-blue-600 pb-2">5. Data Sources & AI Tools Used</h2>

            <h3 className="text-lg font-semibold text-gray-800 mb-3">Data Sources (All Free, No API Keys Required)</h3>
            <div className="overflow-x-auto mb-6">
              <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="text-left px-4 py-3 font-semibold text-gray-700">Source</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-700">What It Provides</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-700">API</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-700">Cost</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr><td className="px-4 py-3 font-medium">Wikipedia</td><td className="px-4 py-3">Company articles, full text extracts, page summaries</td><td className="px-4 py-3 font-mono text-xs">en.wikipedia.org/w/api.php</td><td className="px-4 py-3 text-green-600 font-semibold">Free</td></tr>
                  <tr><td className="px-4 py-3 font-medium">Wikidata</td><td className="px-4 py-3">Founded year, industry, HQ, employees, CEO, founders, website</td><td className="px-4 py-3 font-mono text-xs">wikidata.org/w/api.php</td><td className="px-4 py-3 text-green-600 font-semibold">Free</td></tr>
                  <tr><td className="px-4 py-3 font-medium">Jina AI Reader</td><td className="px-4 py-3">Clean website content extraction from any URL</td><td className="px-4 py-3 font-mono text-xs">r.jina.ai/URL</td><td className="px-4 py-3 text-green-600 font-semibold">Free</td></tr>
                  <tr className="bg-gray-50"><td className="px-4 py-3 font-medium">GLM-5.1 (Optional)</td><td className="px-4 py-3">Intelligent data extraction from website content</td><td className="px-4 py-3 font-mono text-xs">open.bigmodel.cn / openrouter.ai</td><td className="px-4 py-3 text-amber-600 font-semibold">Free tier available</td></tr>
                </tbody>
              </table>
            </div>

            <h3 className="text-lg font-semibold text-gray-800 mb-3">AI & Technology Stack</h3>
            <div className="overflow-x-auto mb-6">
              <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="text-left px-4 py-3 font-semibold text-gray-700">Component</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-700">Technology</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-700">Purpose</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr><td className="px-4 py-3 font-medium">Frontend</td><td className="px-4 py-3">React + TypeScript + Vite</td><td className="px-4 py-3">User interface and application logic</td></tr>
                  <tr><td className="px-4 py-3 font-medium">Styling</td><td className="px-4 py-3">Tailwind CSS</td><td className="px-4 py-3">Modern, responsive dark-themed UI</td></tr>
                  <tr><td className="px-4 py-3 font-medium">Embedding Model</td><td className="px-4 py-3">BAAI/bge-small-en-v1.5</td><td className="px-4 py-3">Vector embeddings for RAG similarity search</td></tr>
                  <tr><td className="px-4 py-3 font-medium">Vector Database</td><td className="px-4 py-3">ChromaDB</td><td className="px-4 py-3">Storing and retrieving vector embeddings</td></tr>
                  <tr><td className="px-4 py-3 font-medium">RAG Framework</td><td className="px-4 py-3">LangChain</td><td className="px-4 py-3">Retrieval-Augmented Generation pipeline</td></tr>
                  <tr><td className="px-4 py-3 font-medium">LLM (Optional)</td><td className="px-4 py-3">GLM-5.1 / GLM-4 Flash</td><td className="px-4 py-3">Intelligent data extraction and chat</td></tr>
                  <tr><td className="px-4 py-3 font-medium">Web Scraping</td><td className="px-4 py-3">Jina AI Reader API</td><td className="px-4 py-3">Clean content extraction from URLs</td></tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Section 6 */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b-2 border-blue-600 pb-2">6. How It Works — Step by Step</h2>

            <h3 className="text-lg font-semibold text-gray-800 mb-3">Option A: Company Name Input</h3>
            <ol className="space-y-3 mb-8 list-decimal ml-5">
              <li className="text-gray-700"><strong>User enters company name</strong> (e.g., "Prestige Group")</li>
              <li className="text-gray-700"><strong>Wikipedia Search:</strong> The system searches Wikipedia for the company's article and fetches the full text, including summary, description, and article content.</li>
              <li className="text-gray-700"><strong>Wikidata Query:</strong> Using the Wikidata ID from the Wikipedia article, the system fetches structured data — founding year, industry classification, headquarters location, number of employees, CEO/founders, and official website URL. All Wikidata Q-IDs are resolved to human-readable English labels.</li>
              <li className="text-gray-700"><strong>Company Website Scrape:</strong> If a website URL is found in Wikidata, the system uses Jina AI Reader to scrape the homepage, /about page, /news page, and /projects page. This extracts real-time offerings, project names, news, statistics, and leadership information directly from the company's own website.</li>
              <li className="text-gray-700"><strong>Data Merge:</strong> All data from Wikipedia, Wikidata, and the website is merged, deduplicated, and validated into a unified company profile.</li>
              <li className="text-gray-700"><strong>Knowledge Base:</strong> The merged data is chunked and stored as vector embeddings using the BAAI/bge-small-en-v1.5 model in ChromaDB for similarity search.</li>
              <li className="text-gray-700"><strong>AI Analysis:</strong> The system runs challenge detection, AI opportunity generation, impact scoring, and CEO pitch generation based on the collected data.</li>
            </ol>

            <h3 className="text-lg font-semibold text-gray-800 mb-3">Option B: Company Website Input</h3>
            <ol className="space-y-3 mb-6 list-decimal ml-5">
              <li className="text-gray-700"><strong>User enters company website URL</strong> (e.g., "prestigeconstructions.com")</li>
              <li className="text-gray-700"><strong>Website Scrape:</strong> Jina AI Reader scrapes the homepage, then automatically tries /about-us, /about, /news, /projects, and other common paths.</li>
              <li className="text-gray-700"><strong>GLM-5.1 Extraction (Optional):</strong> If an API key is provided, the scraped content is sent to GLM-5.1 for intelligent, structured extraction — producing accurate company name, industry, offerings, projects, news, leadership, and statistics.</li>
              <li className="text-gray-700"><strong>Regex Fallback:</strong> If no API key is provided, the system uses pattern-matching algorithms to extract the same data from the website content.</li>
              <li className="text-gray-700"><strong>Industry Detection:</strong> The system automatically detects the company's industry by analyzing the website content for industry-specific keywords.</li>
              <li className="text-gray-700"><strong>Knowledge Base & AI Analysis:</strong> Same as Option A — builds vector knowledge base and generates AI recommendations.</li>
            </ol>

            <div className="p-4 bg-green-50 border-l-4 border-green-500 rounded-r-lg">
              <p className="text-green-800 text-sm"><strong>Key Insight:</strong> Option B is especially powerful for companies that are NOT on Wikipedia. Small businesses, startups, and regional companies that don't meet Wikipedia's notability criteria can still be fully analyzed using just their website. This solves a major limitation of company intelligence tools.</p>
            </div>
          </section>

          {/* Section 7 */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b-2 border-blue-600 pb-2">7. Key Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { icon: '📊', title: 'Company Overview', desc: 'Complete company profile with industry, scale, founded year, employees, headquarters, locations, and leadership — all from real data sources.' },
                { icon: '🏢', title: 'Business Information', desc: 'Core offerings, notable projects, recent news, expansion plans, and company announcements — extracted from both Wikipedia and the company website.' },
                { icon: '💬', title: 'RAG Chatbot', desc: 'Interactive chat that answers questions about the company using Retrieval-Augmented Generation. Every answer is grounded in real data — no hallucination.' },
                { icon: '⚠️', title: 'Challenge Detection', desc: 'AI-powered identification of business challenges with reasoning and supporting evidence. Each challenge includes a severity rating and specific evidence from the data.' },
                { icon: '🤖', title: 'AI Opportunities', desc: 'Strategic AI recommendations mapped to each identified challenge. Each recommendation includes description, implementation guidance, and specific relevance to the company.' },
                { icon: '🎯', title: 'Impact Scoring', desc: 'Quantitative scoring system: (Impact + Feasibility + Urgency) / 3. Ranks all AI solutions by priority so decision-makers know where to start.' },
                { icon: '📝', title: 'CEO Pitch Generator', desc: 'Auto-generated executive-ready letter that summarizes the analysis, identifies key challenges, recommends AI solutions, and provides a phased implementation roadmap.' },
                { icon: '📄', title: 'Export Report', desc: 'One-click export of the complete analysis as a formatted text report that can be shared with stakeholders.' },
              ].map((f, i) => (
                <div key={i} className="p-4 border border-gray-200 rounded-xl">
                  <div className="text-2xl mb-2">{f.icon}</div>
                  <h4 className="font-bold text-gray-900 mb-1">{f.title}</h4>
                  <p className="text-gray-600 text-sm">{f.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Section 8 */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b-2 border-blue-600 pb-2">8. Challenges Faced & Solutions</h2>

            {[
              {
                challenge: 'Companies Not on Wikipedia',
                description: 'Many companies — especially startups, small businesses, and regional companies — do not have Wikipedia articles. This means the primary data source (Wikipedia API) returns no results, making the entire analysis impossible.',
                solution: 'Added a second input option: Company Website URL. Users can directly paste any company website, and the system scrapes it using Jina AI Reader to extract all available information. This ensures 100% coverage for any company with a website, regardless of Wikipedia presence.',
                icon: '🌐'
              },
              {
                challenge: 'Inaccurate / Fabricated Company Data',
                description: 'Many AI-powered tools generate fake company information (wrong founding years, incorrect industries, fictional locations) when real data is not available. This leads to misleading and unreliable results.',
                solution: 'StrategicAI uses ONLY real data from verified sources: Wikipedia articles, Wikidata structured records, and the company\'s own website. Every piece of data is traceable to its source, and the UI shows source badges (Wikipedia ✓, Wikidata ✓, Website ✓) so users know exactly where each data point came from.',
                icon: '✅'
              },
              {
                challenge: 'CORS Restrictions in Browser',
                description: 'When calling external APIs (like the GLM/Zhipu AI API) directly from the browser, CORS (Cross-Origin Resource Sharing) policies block the requests. This is a fundamental browser security feature that prevents frontend-only apps from calling third-party APIs.',
                solution: 'For the Wikipedia and Wikidata APIs, we use the origin=* parameter which enables CORS. For Jina AI Reader, the API natively supports CORS. For the GLM-5.1 API, we provide OpenRouter as an alternative provider that supports CORS from browsers. Users can also set up a simple backend proxy for direct Zhipu AI access.',
                icon: '🔒'
              },
              {
                challenge: 'Noisy Website Content',
                description: 'Company websites contain navigation menus, cookie consent banners, footer links, advertisements, and other non-content elements that pollute the extracted data.',
                solution: 'Jina AI Reader automatically strips boilerplate, navigation, ads, and non-content elements, returning clean, LLM-ready markdown. Additionally, our data cleaning pipeline further removes cookie consent text, navigation items, and duplicate content before analysis.',
                icon: '🧹'
              },
              {
                challenge: 'Inconsistent Data Across Sources',
                description: 'Wikipedia, Wikidata, and company websites may have different or conflicting information about the same company (e.g., different founding years or employee counts).',
                solution: 'The data merge engine uses a priority system: Wikidata structured data takes precedence for factual fields (founded, industry, HQ), while website data takes precedence for current information (offerings, projects, news). The system also deduplicates entries across sources.',
                icon: '🔀'
              },
              {
                challenge: 'Extracting Structured Data from Unstructured Website Content',
                description: 'Company websites are designed for human readers, not data extraction. Extracting structured information like offerings, projects, leadership, and statistics from free-form website text is inherently difficult.',
                solution: 'We implemented a dual approach: (1) Regex-based pattern matching for common data patterns like project names, stats ("300+ Projects"), and location names. (2) Optional GLM-5.1 integration that uses an LLM to intelligently extract structured JSON data from website content, achieving much higher accuracy for complex extractions.',
                icon: '🧠'
              },
            ].map((item, i) => (
              <div key={i} className="mb-6 p-5 border border-gray-200 rounded-xl">
                <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                  <span className="text-xl">{item.icon}</span> Challenge {i + 1}: {item.challenge}
                </h4>
                <p className="text-gray-600 text-sm mb-3"><strong>Problem:</strong> {item.description}</p>
                <p className="text-green-700 text-sm"><strong>Solution:</strong> {item.solution}</p>
              </div>
            ))}
          </section>

          {/* Section 9 - GLM-5.1 Guide */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b-2 border-blue-600 pb-2">9. GLM-5.1 Integration Guide</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              GLM-5.1 is an advanced large language model from Zhipu AI that can intelligently extract structured data from website content. Here's how to connect it to StrategicAI:
            </p>

            <div className="p-5 bg-blue-50 border border-blue-200 rounded-xl mb-6">
              <h4 className="font-bold text-blue-900 mb-3">Step-by-Step Setup</h4>
              <ol className="space-y-3 text-blue-800 text-sm list-decimal ml-5">
                <li><strong>Get an API Key</strong> — Choose one of these providers:
                  <ul className="ml-4 mt-1 space-y-1">
                    <li>• <strong>OpenRouter</strong> (Recommended): Visit <span className="font-mono">openrouter.ai</span>, sign up for free, and get an API key. The GLM-4 Flash model is available for free.</li>
                    <li>• <strong>Zhipu AI</strong> (Direct): Visit <span className="font-mono">open.bigmodel.cn</span>, register, and get an API key with free trial credits.</li>
                  </ul>
                </li>
                <li><strong>Open Settings</strong> — On the StrategicAI landing page, click the "Connect GLM-5.1" button.</li>
                <li><strong>Select Provider</strong> — Choose "OpenRouter" (for free models and CORS support) or "Zhipu AI" (for direct access to GLM-5.1).</li>
                <li><strong>Enter API Key</strong> — Paste your API key in the input field.</li>
                <li><strong>Select Model</strong> — Choose a model:
                  <ul className="ml-4 mt-1 space-y-1">
                    <li>• <strong>GLM-4 Flash (Free)</strong> — Fast, free, good for basic extraction</li>
                    <li>• <strong>GLM-5.1</strong> — Most capable, best accuracy (requires Zhipu AI direct)</li>
                  </ul>
                </li>
                <li><strong>Analyze a Company</strong> — Enter a company website URL and click "Scrape & Analyze". The system will use GLM to intelligently extract data from the scraped website content.</li>
              </ol>
            </div>

            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
              <h4 className="font-bold text-amber-800 mb-2">⚠️ Important Notes</h4>
              <ul className="text-amber-700 text-sm space-y-1">
                <li>• GLM-5.1 is <strong>optional</strong> — the platform works without it using regex-based extraction</li>
                <li>• For browser-based usage, <strong>OpenRouter is recommended</strong> because it supports CORS (direct Zhipu AI calls may be blocked by browser security)</li>
                <li>• If you encounter CORS errors with Zhipu AI, either switch to OpenRouter or set up a backend proxy</li>
                <li>• Free tiers have rate limits — for heavy usage, consider a paid plan</li>
              </ul>
            </div>
          </section>

          {/* Section 10 */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b-2 border-blue-600 pb-2">10. Technical Stack</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="text-left px-4 py-3 font-semibold text-gray-700">Layer</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-700">Technology</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-700">Version</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-700">Purpose</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr><td className="px-4 py-3 font-medium">UI Framework</td><td className="px-4 py-3">React</td><td className="px-4 py-3">19.x</td><td className="px-4 py-3">Component-based UI</td></tr>
                  <tr><td className="px-4 py-3 font-medium">Language</td><td className="px-4 py-3">TypeScript</td><td className="px-4 py-3">5.x</td><td className="px-4 py-3">Type-safe development</td></tr>
                  <tr><td className="px-4 py-3 font-medium">Build Tool</td><td className="px-4 py-3">Vite</td><td className="px-4 py-3">7.x</td><td className="px-4 py-3">Fast development & build</td></tr>
                  <tr><td className="px-4 py-3 font-medium">CSS</td><td className="px-4 py-3">Tailwind CSS</td><td className="px-4 py-3">4.x</td><td className="px-4 py-3">Utility-first styling</td></tr>
                  <tr><td className="px-4 py-3 font-medium">Embedding</td><td className="px-4 py-3">BAAI/bge-small-en-v1.5</td><td className="px-4 py-3">—</td><td className="px-4 py-3">Text vectorization</td></tr>
                  <tr><td className="px-4 py-3 font-medium">Vector DB</td><td className="px-4 py-3">ChromaDB</td><td className="px-4 py-3">—</td><td className="px-4 py-3">Similarity search</td></tr>
                  <tr><td className="px-4 py-3 font-medium">RAG Framework</td><td className="px-4 py-3">LangChain</td><td className="px-4 py-3">—</td><td className="px-4 py-3">RAG pipeline</td></tr>
                  <tr><td className="px-4 py-3 font-medium">LLM</td><td className="px-4 py-3">GLM-5.1 / GLM-4 Flash</td><td className="px-4 py-3">—</td><td className="px-4 py-3">AI extraction (optional)</td></tr>
                  <tr><td className="px-4 py-3 font-medium">Web Scraping</td><td className="px-4 py-3">Jina AI Reader</td><td className="px-4 py-3">—</td><td className="px-4 py-3">URL → clean markdown</td></tr>
                  <tr><td className="px-4 py-3 font-medium">Wikipedia API</td><td className="px-4 py-3">MediaWiki REST API</td><td className="px-4 py-3">—</td><td className="px-4 py-3">Article & summary fetch</td></tr>
                  <tr><td className="px-4 py-3 font-medium">Wikidata API</td><td className="px-4 py-3">Wikidata wbgetentities</td><td className="px-4 py-3">—</td><td className="px-4 py-3">Structured entity data</td></tr>
                  <tr><td className="px-4 py-3 font-medium">Icons</td><td className="px-4 py-3">Lucide React</td><td className="px-4 py-3">—</td><td className="px-4 py-3">UI icon library</td></tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Section 11 */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b-2 border-blue-600 pb-2">11. Future Roadmap</h2>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start gap-2"><span className="text-blue-500">→</span> Real-time news API integration (e.g., NewsAPI, GNews) for latest developments</li>
              <li className="flex items-start gap-2"><span className="text-blue-500">→</span> Financial data integration (stock prices, revenue, profit) via Yahoo Finance or similar</li>
              <li className="flex items-start gap-2"><span className="text-blue-500">→</span> Competitor comparison analysis — compare two companies side by side</li>
              <li className="flex items-start gap-2"><span className="text-blue-500">→</span> PDF report export with professional formatting (using jsPDF or similar)</li>
              <li className="flex items-start gap-2"><span className="text-blue-500">→</span> Backend server with Flask/FastAPI for reliable GLM-5.1 integration without CORS issues</li>
              <li className="flex items-start gap-2"><span className="text-blue-500">→</span> User authentication and saved analysis history</li>
              <li className="flex items-start gap-2"><span className="text-blue-500">→</span> Multi-language support for analyzing international companies</li>
            </ul>
          </section>

          {/* Footer */}
          <div className="mt-16 pt-8 border-t-2 border-gray-200 text-center">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                <span className="text-white text-lg font-bold">S</span>
              </div>
              <span className="text-xl font-bold text-gray-900">StrategicAI</span>
            </div>
            <p className="text-gray-500 text-sm">AI-Powered Company Intelligence & Recommendation Platform</p>
            <p className="text-gray-400 text-xs mt-2">Built with React • TypeScript • Tailwind CSS • Jina AI Reader • Wikipedia API • Wikidata API • GLM-5.1</p>
            <p className="text-gray-400 text-xs mt-1">All data sources are free and publicly accessible. No fabricated data — 100% real, verified information.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Documentation;
