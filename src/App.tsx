import React, { useState, useCallback } from 'react';
import { CompanyData, InsightType } from './types';
import { PIPELINE_STAGES } from './types';
import { buildCompanyData, buildCompanyDataFromWebsite } from './utils/dataGenerator';
import { fetchCompanyData } from './utils/wikiApi';
import { scrapeCompanyWebsite } from './utils/webScraper';
import { extractCompanyInfoWithLLM, LLMConfig } from './utils/llmExtractor';
import { generatePDFReport } from './utils/pdfGenerator';
import ResearchPipeline from './components/ResearchPipeline';
import ChatPanel from './components/ChatPanel';
import InsightPanel from './components/InsightPanel';
import Documentation from './components/Documentation';
import {
  Search, Sparkles, Brain, Database, Cpu, ArrowRight,
  AlertTriangle, Target, FileText, Download, Globe, Building2,
  Key, Settings, BookOpen
} from 'lucide-react';

type InputMode = 'name' | 'website';

function App() {
  const [inputMode, setInputMode] = useState<InputMode>('name');
  const [companyName, setCompanyName] = useState('');
  const [companyWebsite, setCompanyWebsite] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentStage, setCurrentStage] = useState(0);
  const [companyData, setCompanyData] = useState<CompanyData | null>(null);
  const [activeInsight, setActiveInsight] = useState<InsightType>(null);
  const [showDashboard, setShowDashboard] = useState(false);
  const [showDocs, setShowDocs] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // LLM Configuration
  const [showSettings, setShowSettings] = useState(false);
  const [llmProvider, setLlmProvider] = useState<'zhipu' | 'openrouter'>('openrouter');
  const [llmApiKey, setLlmApiKey] = useState('');
  const [llmModel, setLlmModel] = useState('zhipu-ai/glm-4-flash:free');

  const getLLMConfig = useCallback((): LLMConfig | null => {
    if (!llmApiKey.trim()) return null;
    return { provider: llmProvider, apiKey: llmApiKey.trim(), model: llmModel };
  }, [llmProvider, llmApiKey, llmModel]);

  const canAnalyze = inputMode === 'name'
    ? companyName.trim().length > 0
    : companyWebsite.trim().length > 0;

  const handleAnalyze = useCallback(async () => {
    if (!canAnalyze) return;

    setIsAnalyzing(true);
    setCurrentStage(0);
    setShowDashboard(false);
    setCompanyData(null);
    setActiveInsight(null);
    setErrorMessage('');

    try {
      if (inputMode === 'website') {
        // ===== WEBSITE-ONLY FLOW =====
        let url = companyWebsite.trim();
        if (!url.startsWith('http')) url = `https://${url}`;

        // Stage 0-1: Scrape company website
        setCurrentStage(0);
        console.log('[Pipeline] Scraping company website:', url);
        const websiteData = await scrapeCompanyWebsite(url, '');

        // Stage 2-3: LLM-powered extraction (if API key provided)
        setCurrentStage(2);
        const llmConfig = getLLMConfig();
        let llmExtracted = null;
        if (llmConfig && websiteData.totalContentLength > 0) {
          console.log('[Pipeline] Using GLM for intelligent extraction...');
          const allContent = [websiteData.homepageContent, websiteData.aboutContent, websiteData.newsContent, websiteData.projectsContent].filter(Boolean).join('\n\n');
          try {
            llmExtracted = await extractCompanyInfoWithLLM(allContent, llmConfig);
            if (llmExtracted) {
              console.log('[Pipeline] GLM extraction successful');
            }
          } catch (llmErr) {
            console.warn('[Pipeline] GLM extraction failed, using regex fallback:', llmErr);
          }
        }

        // Stage 3-4: Data Cleaning
        setCurrentStage(3);
        await new Promise(resolve => setTimeout(resolve, 400));

        // Stage 4-5: Knowledge Base
        setCurrentStage(4);
        let builtData = buildCompanyDataFromWebsite(websiteData, url);

        // Enhance with LLM data if available
        if (llmExtracted) {
          builtData = {
            ...builtData,
            name: llmExtracted.companyName !== 'Unknown' ? llmExtracted.companyName : builtData.name,
            industry: llmExtracted.industry !== 'Diversified' ? llmExtracted.industry : builtData.industry,
            description: llmExtracted.description || builtData.description,
            summary: llmExtracted.websiteSummary || builtData.summary,
            founded: llmExtracted.founded !== 'N/A' ? llmExtracted.founded : builtData.founded,
            offerings: llmExtracted.offerings.length > 0 ? llmExtracted.offerings : builtData.offerings,
            projects: [...new Set([...llmExtracted.projects, ...builtData.projects])].slice(0, 15),
            recentNews: llmExtracted.recentNews.length > 0 ? llmExtracted.recentNews : builtData.recentNews,
            expansionPlans: llmExtracted.expansionPlans.length > 0 ? llmExtracted.expansionPlans : builtData.expansionPlans,
            leadership: llmExtracted.leadership.length > 0 ? llmExtracted.leadership : builtData.leadership,
            locations: [...new Set([...llmExtracted.locations, ...builtData.locations])],
          };
        }
        await new Promise(resolve => setTimeout(resolve, 400));

        // Stage 5-6: Vector Store
        setCurrentStage(5);
        await new Promise(resolve => setTimeout(resolve, 300));

        // Stage 6-7: AI Analysis
        setCurrentStage(6);
        await new Promise(resolve => setTimeout(resolve, 500));

        setCompanyData(builtData);
        setCurrentStage(PIPELINE_STAGES.length);
        await new Promise(resolve => setTimeout(resolve, 600));
        setIsAnalyzing(false);
        setShowDashboard(true);

      } else {
        // ===== NAME-BASED FLOW (Wikipedia + Wikidata + Website) =====
        setCurrentStage(0);
        const rawData = await fetchCompanyData(companyName.trim());

        // Stage 2-3: Website Scraping via Jina AI Reader
        setCurrentStage(2);
        let websiteData = null;
        if (rawData.website && rawData.website !== 'Not available') {
          console.log('[Pipeline] Scraping company website:', rawData.website);
          websiteData = await scrapeCompanyWebsite(rawData.website, companyName.trim());
        }

        // Stage 3-4: Data Cleaning & Knowledge Base
        setCurrentStage(3);
        await new Promise(resolve => setTimeout(resolve, 500));

        // Stage 4-5: Knowledge Base Building
        setCurrentStage(4);
        const builtData = buildCompanyData(rawData, websiteData || undefined);
        await new Promise(resolve => setTimeout(resolve, 500));

        // Stage 5-6: Vector Store
        setCurrentStage(5);
        await new Promise(resolve => setTimeout(resolve, 300));

        // Stage 6-7: AI Analysis
        setCurrentStage(6);
        await new Promise(resolve => setTimeout(resolve, 500));

        setCompanyData(builtData);
        setCurrentStage(PIPELINE_STAGES.length);
        await new Promise(resolve => setTimeout(resolve, 600));
        setIsAnalyzing(false);
        setShowDashboard(true);
      }
    } catch (err) {
      console.error('Analysis failed:', err);
      setErrorMessage(inputMode === 'website'
        ? 'Failed to scrape website. Please check the URL and try again.'
        : 'Failed to analyze company. Please try again with a different name.');
      setIsAnalyzing(false);
    }
  }, [inputMode, companyName, companyWebsite, canAnalyze]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleAnalyze();
  };

  const resetAll = () => {
    setShowDashboard(false);
    setCompanyData(null);
    setCompanyName('');
    setCompanyWebsite('');
    setActiveInsight(null);
    setErrorMessage('');
  };

  // ===== DOCUMENTATION PAGE =====
  if (showDocs) {
    return <Documentation onClose={() => setShowDocs(false)} />;
  }

  // ===== LANDING PAGE =====
  if (!showDashboard && !isAnalyzing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/3 rounded-full blur-3xl" />
        </div>

        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)',
          backgroundSize: '60px 60px'
        }} />

        <div className="relative z-10 min-h-screen flex flex-col">
          {/* Header */}
          <header className="px-8 py-6">
            <div className="max-w-7xl mx-auto flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white tracking-tight">StrategicAI</h1>
                <p className="text-xs text-slate-500">AI-Powered Company Intelligence</p>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 flex flex-col items-center justify-center px-6 pb-20">
            <div className="max-w-3xl w-full text-center">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/20 rounded-full px-4 py-1.5 mb-8">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span className="text-cyan-400 text-xs font-medium">Wikipedia + Wikidata + Company Website Scraping</span>
              </div>

              {/* Title */}
              <h2 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
                Company Intelligence
                <br />
                <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Powered by AI
                </span>
              </h2>

              {/* Subtitle */}
              <p className="text-slate-400 text-lg mb-6 max-w-2xl mx-auto leading-relaxed">
                Enter a <strong className="text-white">company name</strong> to search Wikipedia &amp; Wikidata, or paste a <strong className="text-white">company website URL</strong> to scrape directly. We build a vector knowledge base and generate strategic AI recommendations.
              </p>

              {/* GLM-5.1 Settings Toggle */}
              <div className="flex items-center justify-center gap-3 mb-8">
                <button
                  onClick={() => setShowSettings(!showSettings)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium border transition-all ${
                    llmApiKey.trim()
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                      : 'bg-slate-800/50 border-slate-700/30 text-slate-400 hover:text-white'
                  }`}
                >
                  <Key className="w-3.5 h-3.5" />
                  {llmApiKey.trim() ? '✅ GLM-5.1 Connected' : '🔗 Connect GLM-5.1 (Optional)'}
                </button>
                <button
                  onClick={() => setShowDocs(true)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium bg-slate-800/50 border border-slate-700/30 text-slate-400 hover:text-white transition-all"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  Project Documentation
                </button>
              </div>

              {/* Settings Panel */}
              {showSettings && (
                <div className="max-w-xl mx-auto mb-8 p-5 bg-slate-800/60 border border-slate-700/50 rounded-xl text-left">
                  <h4 className="text-white font-semibold text-sm mb-4 flex items-center gap-2">
                    <Settings className="w-4 h-4" /> GLM-5.1 LLM Configuration
                  </h4>
                  <p className="text-slate-400 text-xs mb-4">
                    Connect a GLM model to enable AI-powered intelligent data extraction from company websites. Without this, the system uses regex-based extraction (still works well). Get your API key from <a href="https://openrouter.ai" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:text-cyan-300 underline">OpenRouter</a> (free) or <a href="https://open.bigmodel.cn" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:text-cyan-300 underline">Zhipu AI</a>.
                  </p>

                  <div className="space-y-3">
                    {/* Provider Selection */}
                    <div>
                      <label className="text-slate-300 text-xs font-medium mb-1 block">Provider</label>
                      <div className="flex gap-2">
                        <button
                          onClick={() => { setLlmProvider('openrouter'); setLlmModel('zhipu-ai/glm-4-flash:free'); }}
                          className={`px-3 py-1.5 text-xs rounded-lg border transition-all ${
                            llmProvider === 'openrouter' ? 'bg-purple-500/20 text-purple-400 border-purple-500/30' : 'bg-slate-700/30 text-slate-400 border-slate-600/30'
                          }`}
                        >
                          OpenRouter (Free models available)
                        </button>
                        <button
                          onClick={() => { setLlmProvider('zhipu'); setLlmModel('glm-4-flash'); }}
                          className={`px-3 py-1.5 text-xs rounded-lg border transition-all ${
                            llmProvider === 'zhipu' ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30' : 'bg-slate-700/30 text-slate-400 border-slate-600/30'
                          }`}
                        >
                          Zhipu AI (Direct)
                        </button>
                      </div>
                    </div>

                    {/* API Key */}
                    <div>
                      <label className="text-slate-300 text-xs font-medium mb-1 block">API Key</label>
                      <input
                        type="password"
                        value={llmApiKey}
                        onChange={(e) => setLlmApiKey(e.target.value)}
                        placeholder={llmProvider === 'openrouter' ? 'sk-or-...' : 'Your Zhipu AI API key'}
                        className="w-full bg-slate-900/50 border border-slate-600/50 rounded-lg px-3 py-2 text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/30"
                      />
                      <p className="text-slate-500 text-xs mt-1">
                        {llmProvider === 'openrouter'
                          ? <>Get free key at <a href="https://openrouter.ai" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:text-cyan-300 underline">openrouter.ai</a> — free GLM-4 Flash model available</>
                          : <>Get key at <a href="https://open.bigmodel.cn" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:text-cyan-300 underline">open.bigmodel.cn</a> — free trial credits available</>}
                      </p>
                    </div>

                    {/* Model Selection */}
                    <div>
                      <label className="text-slate-300 text-xs font-medium mb-1 block">Model</label>
                      <select
                        value={llmModel}
                        onChange={(e) => setLlmModel(e.target.value)}
                        className="w-full bg-slate-900/50 border border-slate-600/50 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/30"
                      >
                        {llmProvider === 'openrouter' ? (
                          <>
                            <option value="zhipu-ai/glm-4-flash:free">GLM-4 Flash (Free)</option>
                            <option value="zhipu-ai/glm-4.5-air">GLM-4.5 Air</option>
                            <option value="zhipu-ai/glm-4.7-flash">GLM-4.7 Flash</option>
                          </>
                        ) : (
                          <>
                            <option value="glm-4-flash">GLM-4 Flash (Free Tier)</option>
                            <option value="glm-4-air">GLM-4 Air</option>
                            <option value="glm-5.1">GLM-5.1 (Most Capable)</option>
                          </>
                        )}
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Input Mode Toggle */}
              <div className="flex justify-center mb-6">
                <div className="inline-flex items-center bg-slate-800/80 rounded-xl border border-slate-700/50 p-1 gap-1">
                  <button
                    onClick={() => setInputMode('name')}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                      inputMode === 'name'
                        ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 shadow-lg shadow-cyan-500/10'
                        : 'text-slate-400 hover:text-slate-300 border border-transparent'
                    }`}
                  >
                    <Building2 className="w-4 h-4" />
                    Company Name
                  </button>
                  <button
                    onClick={() => setInputMode('website')}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                      inputMode === 'website'
                        ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30 shadow-lg shadow-purple-500/10'
                        : 'text-slate-400 hover:text-slate-300 border border-transparent'
                    }`}
                  >
                    <Globe className="w-4 h-4" />
                    Company Website
                  </button>
                </div>
              </div>

              {/* Search Bars */}
              {inputMode === 'name' ? (
                <div className="relative max-w-xl mx-auto mb-4">
                  <div className="flex items-center bg-slate-800/80 backdrop-blur-xl rounded-2xl border border-slate-700/50 shadow-2xl shadow-cyan-500/5 p-2 focus-within:border-cyan-500/50 focus-within:shadow-cyan-500/10 transition-all">
                    <div className="flex items-center gap-3 px-4 flex-1">
                      <Search className="w-5 h-5 text-slate-500" />
                      <input
                        type="text"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="e.g., Google, Tata Motors, Prestige Group, Infosys"
                        className="flex-1 bg-transparent text-white text-base placeholder-slate-500 focus:outline-none py-3"
                      />
                    </div>
                    <button
                      onClick={handleAnalyze}
                      disabled={!companyName.trim()}
                      className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-xl hover:from-cyan-400 hover:to-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 text-sm"
                    >
                      <Cpu className="w-4 h-4" />
                      Analyze
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="relative max-w-xl mx-auto mb-4">
                  <div className="flex items-center bg-slate-800/80 backdrop-blur-xl rounded-2xl border border-slate-700/50 shadow-2xl shadow-purple-500/5 p-2 focus-within:border-purple-500/50 focus-within:shadow-purple-500/10 transition-all">
                    <div className="flex items-center gap-3 px-4 flex-1">
                      <Globe className="w-5 h-5 text-slate-500" />
                      <input
                        type="text"
                        value={companyWebsite}
                        onChange={(e) => setCompanyWebsite(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="e.g., prestigeconstructions.com, adanirealty.com"
                        className="flex-1 bg-transparent text-white text-base placeholder-slate-500 focus:outline-none py-3"
                      />
                    </div>
                    <button
                      onClick={handleAnalyze}
                      disabled={!companyWebsite.trim()}
                      className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-violet-600 text-white font-semibold rounded-xl hover:from-purple-400 hover:to-violet-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 text-sm"
                    >
                      <Cpu className="w-4 h-4" />
                      Scrape & Analyze
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Data source indicators */}
              <div className="flex items-center justify-center gap-3 mb-12">
                <span className="text-xs text-slate-500">Data sources:</span>
                {inputMode === 'name' ? (
                  <>
                    <span className="px-2.5 py-1 bg-slate-800/50 border border-slate-700/30 rounded text-xs text-slate-400">Wikipedia</span>
                    <span className="px-2.5 py-1 bg-slate-800/50 border border-slate-700/30 rounded text-xs text-slate-400">Wikidata</span>
                    <span className="px-2.5 py-1 bg-purple-500/10 border border-purple-500/20 rounded text-xs text-purple-400">🌐 Company Website</span>
                  </>
                ) : (
                  <>
                    <span className="px-2.5 py-1 bg-purple-500/10 border border-purple-500/20 rounded text-xs text-purple-400">🌐 Homepage</span>
                    <span className="px-2.5 py-1 bg-purple-500/10 border border-purple-500/20 rounded text-xs text-purple-400">📄 About Page</span>
                    <span className="px-2.5 py-1 bg-purple-500/10 border border-purple-500/20 rounded text-xs text-purple-400">📰 News Page</span>
                    <span className="px-2.5 py-1 bg-purple-500/10 border border-purple-500/20 rounded text-xs text-purple-400">🏗️ Projects Page</span>
                  </>
                )}
                <span className="px-2.5 py-1 bg-slate-800/50 border border-slate-700/30 rounded text-xs text-slate-400">100% Free</span>
              </div>

              {/* Mode description */}
              <div className="max-w-lg mx-auto mb-12">
                {inputMode === 'name' ? (
                  <div className="p-4 bg-cyan-500/5 border border-cyan-500/10 rounded-xl text-left">
                    <h4 className="text-cyan-400 text-sm font-semibold mb-2 flex items-center gap-2">
                      <Building2 className="w-4 h-4" /> Company Name Mode
                    </h4>
                    <ul className="text-slate-400 text-xs space-y-1.5">
                      <li className="flex items-start gap-2"><span className="text-cyan-400">1.</span> Searches Wikipedia for company article &amp; summary</li>
                      <li className="flex items-start gap-2"><span className="text-cyan-400">2.</span> Fetches structured data from Wikidata (founded, industry, HQ, employees, founders)</li>
                      <li className="flex items-start gap-2"><span className="text-cyan-400">3.</span> Scrapes company website (found via Wikidata) for offerings, projects, news, stats</li>
                      <li className="flex items-start gap-2"><span className="text-cyan-400">4.</span> Merges all data → builds knowledge base → generates AI recommendations</li>
                    </ul>
                  </div>
                ) : (
                  <div className="p-4 bg-purple-500/5 border border-purple-500/10 rounded-xl text-left">
                    <h4 className="text-purple-400 text-sm font-semibold mb-2 flex items-center gap-2">
                      <Globe className="w-4 h-4" /> Website URL Mode
                    </h4>
                    <ul className="text-slate-400 text-xs space-y-1.5">
                      <li className="flex items-start gap-2"><span className="text-purple-400">1.</span> Scrapes the company website homepage via Jina AI Reader</li>
                      <li className="flex items-start gap-2"><span className="text-purple-400">2.</span> Crawls /about, /news, /projects, and other sub-pages</li>
                      <li className="flex items-start gap-2"><span className="text-purple-400">3.</span> Extracts offerings, projects, stats, leadership, news from real website content</li>
                      <li className="flex items-start gap-2"><span className="text-purple-400">4.</span> All data comes directly from the company's own website — maximum accuracy</li>
                    </ul>
                  </div>
                )}
              </div>

              {/* Error message */}
              {errorMessage && (
                <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
                  {errorMessage}
                </div>
              )}

              {/* Pipeline Preview */}
              <div className="grid grid-cols-4 md:grid-cols-7 gap-3 max-w-3xl mx-auto">
                {PIPELINE_STAGES.map((stage) => (
                  <div key={stage.id} className="flex flex-col items-center gap-2 p-3 bg-slate-800/40 rounded-xl border border-slate-700/30">
                    <span className="text-2xl">{stage.icon}</span>
                    <span className="text-slate-400 text-xs font-medium text-center leading-tight">{stage.label}</span>
                  </div>
                ))}
              </div>

              {/* Features */}
              <div className="mt-16 grid grid-cols-2 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
                {[
                  { icon: <Database className="w-5 h-5" />, title: 'Real Data from 3 Sources', desc: 'Wikipedia, Wikidata, and company website — no fake data' },
                  { icon: <Globe className="w-5 h-5" />, title: 'Website Scraping', desc: 'Jina AI Reader scrapes company website for real offerings & projects' },
                  { icon: <Brain className="w-5 h-5" />, title: 'RAG Chatbot', desc: 'Chat with real company data — no hallucination' },
                  { icon: <AlertTriangle className="w-5 h-5" />, title: 'Challenge Detection', desc: 'Identify risks with reasoning & evidence' },
                  { icon: <Target className="w-5 h-5" />, title: 'Impact Scoring', desc: 'Impact × Feasibility × Urgency analysis' },
                  { icon: <FileText className="w-5 h-5" />, title: 'CEO Pitch Generator', desc: 'One-click executive-ready pitch' },
                ].map((feature, i) => (
                  <div key={i} className="p-4 bg-slate-800/30 rounded-xl border border-slate-700/30 text-left hover:border-cyan-500/20 transition-colors">
                    <div className="text-cyan-400 mb-2">{feature.icon}</div>
                    <h4 className="text-white text-sm font-semibold mb-1">{feature.title}</h4>
                    <p className="text-slate-500 text-xs leading-relaxed">{feature.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </main>

          {/* Footer */}
          <footer className="px-8 py-6 border-t border-slate-800/50">
            <div className="max-w-7xl mx-auto flex items-center justify-between text-xs text-slate-600">
              <span>StrategicAI — AI-Powered Company Intelligence & Recommendation Platform</span>
              <span>Wikipedia • Wikidata • Jina AI Reader • BAAI/bge-small-en-v1.5</span>
            </div>
          </footer>
        </div>
      </div>
    );
  }

  // ===== ANALYZING (Pipeline) PAGE =====
  if (isAnalyzing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/3 right-1/3 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 min-h-screen flex flex-col">
          <header className="px-8 py-6">
            <div className="max-w-7xl mx-auto flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white tracking-tight">StrategicAI</h1>
                <p className="text-xs text-slate-500">Analyzing: {inputMode === 'name' ? companyName : companyWebsite}</p>
              </div>
              <div className="ml-auto flex items-center gap-2 text-xs text-cyan-400">
                <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                {inputMode === 'name' ? 'Fetching from Wikipedia, Wikidata & Website...' : 'Scraping company website pages...'}
              </div>
            </div>
          </header>

          <main className="flex-1 flex items-center justify-center px-6">
            <ResearchPipeline
              isAnalyzing={isAnalyzing}
              currentStage={currentStage}
              onComplete={() => {}}
            />
          </main>
        </div>
      </div>
    );
  }

  // ===== DASHBOARD =====
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/3 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/3 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <header className="px-6 py-4 border-b border-slate-800/50 bg-slate-950/50 backdrop-blur-xl">
          <div className="max-w-[1600px] mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                <Brain className="w-4 h-4 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-white tracking-tight">StrategicAI</h1>
                <p className="text-xs text-slate-500">AI-Powered Company Intelligence</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-slate-800/50 rounded-lg px-3 py-2 border border-slate-700/30">
                <div className="w-2 h-2 rounded-full bg-emerald-400" />
                <span className="text-white text-sm font-medium">{companyData?.name}</span>
                <span className="text-slate-500 text-xs">• {companyData?.industry}</span>
              </div>
              {/* Data source badges */}
              <div className="hidden md:flex items-center gap-2 text-xs text-slate-500">
                {companyData?.wikipediaUrl && (
                  <span className="px-2 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded text-emerald-400">Wikipedia ✓</span>
                )}
                {companyData?.wikidataId && (
                  <span className="px-2 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded text-emerald-400">Wikidata ✓</span>
                )}
                {companyData?.websiteData?.scraped && (
                  <span className="px-2 py-1 bg-purple-500/10 border border-purple-500/20 rounded text-purple-400">🌐 Website ✓</span>
                )}
              </div>
              <button
                onClick={resetAll}
                className="px-4 py-2 bg-slate-800/50 hover:bg-slate-700/50 text-slate-400 hover:text-white rounded-lg border border-slate-700/30 text-xs font-medium transition-all"
              >
                ← New Analysis
              </button>
            </div>
          </div>
        </header>

        {/* Main Dashboard */}
        <main className="flex-1 p-6 overflow-hidden">
          <div className="max-w-[1600px] mx-auto h-full grid grid-cols-1 lg:grid-cols-5 gap-6" style={{ minHeight: 'calc(100vh - 120px)' }}>
            <div className="lg:col-span-2 flex flex-col" style={{ minHeight: '600px' }}>
              <ChatPanel data={companyData!} onInsightClick={setActiveInsight} />
            </div>
            <div className="lg:col-span-3 flex flex-col" style={{ minHeight: '600px' }}>
              <InsightPanel data={companyData!} activeInsight={activeInsight} onInsightClick={setActiveInsight} />
            </div>
          </div>
        </main>

        {/* Bottom Action Bar */}
        <div className="px-6 py-4 border-t border-slate-800/50 bg-slate-950/50 backdrop-blur-xl">
          <div className="max-w-[1600px] mx-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-slate-500 text-xs font-medium mr-2">Quick Actions:</span>
                {[
                  { label: '📊 Overview', insight: 'overview' as InsightType },
                  { label: '🏢 Business', insight: 'business' as InsightType },
                  { label: '⚠️ Challenges', insight: 'challenges' as InsightType },
                  { label: '🤖 AI Ops', insight: 'ai-opportunities' as InsightType },
                  { label: '🎯 Impact', insight: 'impact-scoring' as InsightType },
                  { label: '🎯 CEO Pitch', insight: 'ceo-pitch' as InsightType },
                ].map((action) => (
                  <button
                    key={action.insight}
                    onClick={() => setActiveInsight(action.insight)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all duration-200 ${
                      activeInsight === action.insight
                        ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30'
                        : 'bg-slate-800/50 text-slate-400 border-slate-700/30 hover:bg-slate-700/50 hover:text-white'
                    }`}
                  >
                    {action.label}
                  </button>
                ))}
              </div>
              <button
                onClick={() => {
                  if (companyData) {
                    generatePDFReport(companyData);
                  }
                }}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 rounded-lg border border-emerald-500/30 hover:border-emerald-500/50 text-xs font-semibold transition-all"
              >
                <Download className="w-3.5 h-3.5" /> 📄 Download PDF Report
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
