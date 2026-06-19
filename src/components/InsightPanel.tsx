import React, { useState } from 'react';
import { CompanyData, InsightType } from '../types';
import {
  BarChart3, Building2, AlertTriangle, Bot, Target, FileText,
  Download, ChevronRight, TrendingUp, Shield, Zap, Clock,
  Eye, CheckCircle2, ArrowRight
} from 'lucide-react';

interface InsightPanelProps {
  data: CompanyData;
  activeInsight: InsightType;
  onInsightClick: (insight: InsightType) => void;
}

const INSIGHT_BUTTONS: { type: InsightType; label: string; icon: React.ReactNode; color: string }[] = [
  { type: 'overview', label: 'Company Overview', icon: <BarChart3 className="w-4 h-4" />, color: 'cyan' },
  { type: 'business', label: 'Business Information', icon: <Building2 className="w-4 h-4" />, color: 'blue' },
  { type: 'challenges', label: 'Business Challenges', icon: <AlertTriangle className="w-4 h-4" />, color: 'amber' },
  { type: 'ai-opportunities', label: 'AI Opportunities', icon: <Bot className="w-4 h-4" />, color: 'purple' },
  { type: 'impact-scoring', label: 'Impact Scoring', icon: <Target className="w-4 h-4" />, color: 'emerald' },
  { type: 'ceo-pitch', label: 'CEO Pitch', icon: <FileText className="w-4 h-4" />, color: 'rose' },
];

const colorMap: Record<string, { bg: string; border: string; text: string; glow: string; gradient: string }> = {
  cyan: { bg: 'bg-cyan-500/10', border: 'border-cyan-500/30', text: 'text-cyan-400', glow: 'shadow-cyan-500/10', gradient: 'from-cyan-500 to-cyan-600' },
  blue: { bg: 'bg-blue-500/10', border: 'border-blue-500/30', text: 'text-blue-400', glow: 'shadow-blue-500/10', gradient: 'from-blue-500 to-blue-600' },
  amber: { bg: 'bg-amber-500/10', border: 'border-amber-500/30', text: 'text-amber-400', glow: 'shadow-amber-500/10', gradient: 'from-amber-500 to-amber-600' },
  purple: { bg: 'bg-purple-500/10', border: 'border-purple-500/30', text: 'text-purple-400', glow: 'shadow-purple-500/10', gradient: 'from-purple-500 to-purple-600' },
  emerald: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', text: 'text-emerald-400', glow: 'shadow-emerald-500/10', gradient: 'from-emerald-500 to-emerald-600' },
  rose: { bg: 'bg-rose-500/10', border: 'border-rose-500/30', text: 'text-rose-400', glow: 'shadow-rose-500/10', gradient: 'from-rose-500 to-rose-600' },
};

function SeverityBadge({ severity }: { severity: string }) {
  const colors: Record<string, string> = {
    high: 'bg-red-500/20 text-red-400 border-red-500/30',
    medium: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    low: 'bg-green-500/20 text-green-400 border-green-500/30',
  };
  return (
    <span className={`px-2 py-0.5 text-xs font-semibold rounded-full border ${colors[severity] || colors.low}`}>
      {severity.toUpperCase()}
    </span>
  );
}

function ScoreBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="text-slate-400">{label}</span>
        <span className="text-white font-semibold">{value}/100</span>
      </div>
      <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${color} transition-all duration-1000`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

function OverviewPanel({ data }: { data: CompanyData }) {
  const stats = [
    { label: 'Industry', value: data.industry, icon: <Building2 className="w-4 h-4" /> },
    { label: 'Scale', value: data.scale, icon: <TrendingUp className="w-4 h-4" /> },
    { label: 'Founded', value: data.founded, icon: <Clock className="w-4 h-4" /> },
    { label: 'Employees', value: data.employees, icon: <Shield className="w-4 h-4" /> },
    { label: 'Website', value: data.website, icon: <Eye className="w-4 h-4" /> },
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Data Source Badge */}
      <div className="flex items-center gap-2 flex-wrap">
        {data.wikipediaUrl && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-xs text-emerald-400">
            ✅ Wikipedia & Wikidata
          </span>
        )}
        {data.websiteData?.scraped && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-500/10 border border-purple-500/20 rounded-lg text-xs text-purple-400">
            🌐 Company Website ({data.websiteData.pagesScraped} pages scraped)
          </span>
        )}
        {!data.wikipediaUrl && !data.websiteData?.scraped && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-700/50 border border-slate-600/30 rounded-lg text-xs text-slate-400">
            📊 Data from available sources
          </span>
        )}
        {data.wikipediaUrl && (
          <a href={data.wikipediaUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-lg text-xs text-blue-400 hover:bg-blue-500/20 transition-colors">
            🔗 Wikipedia ↗
          </a>
        )}
        {data.website && data.website !== 'Not available' && data.website !== 'Not available from website' && (
          <a href={data.website.startsWith('http') ? data.website : `https://${data.website}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-violet-500/10 border border-violet-500/20 rounded-lg text-xs text-violet-400 hover:bg-violet-500/20 transition-colors">
            🌐 Company Website ↗
          </a>
        )}
        {data.wikidataId && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800/50 border border-slate-700/30 rounded-lg text-xs text-slate-500">
            Wikidata: {data.wikidataId}
          </span>
        )}
      </div>

      <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-5">
        <div className="flex items-start gap-4">
          {data.thumbnail && (
            <div className="flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border border-slate-600/30 bg-slate-700/30">
              <img src={data.thumbnail} alt={`${data.name} logo`} className="w-full h-full object-contain" />
            </div>
          )}
          <div className="flex-1">
            <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-cyan-400" /> Company Summary
            </h3>
            <p className="text-slate-300 leading-relaxed">{data.description}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              {stat.icon}
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider">{stat.label}</p>
              <p className={`font-semibold text-sm ${stat.value === 'Not available' || stat.value === 'Not publicly available' ? 'text-slate-500 italic' : 'text-white'}`}>{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {data.locations.length > 0 && (
        <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-5">
          <h4 className="text-sm font-semibold text-slate-300 mb-3 uppercase tracking-wider">Locations ({data.locations.length})</h4>
          <div className="flex flex-wrap gap-2">
            {data.locations.map((loc) => (
              <span key={loc} className="px-3 py-1.5 bg-slate-700/50 rounded-lg text-slate-300 text-xs border border-slate-600/30">
                📍 {loc}
              </span>
            ))}
          </div>
        </div>
      )}

      {data.websiteData?.statsFromWebsite && data.websiteData.statsFromWebsite.length > 0 && (
        <div className="bg-slate-800/50 rounded-xl border border-purple-500/20 p-5">
          <h4 className="text-sm font-semibold text-purple-300 mb-3 uppercase tracking-wider flex items-center gap-2">
            <Eye className="w-4 h-4" /> From Company Website
          </h4>
          <div className="grid grid-cols-2 gap-2">
            {data.websiteData.statsFromWebsite.map((stat, i) => (
              <div key={i} className="bg-purple-500/5 border border-purple-500/10 rounded-lg px-3 py-2.5 text-center">
                <span className="text-purple-300 text-sm font-semibold">{stat}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-5">
        <h4 className="text-sm font-semibold text-slate-300 mb-3 uppercase tracking-wider">Leadership</h4>
        <div className="space-y-2">
          {data.leadership.map((leader) => (
            <div key={leader} className="flex items-center gap-2 text-slate-300 text-sm">
              <div className="w-6 h-6 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-400 text-xs">👤</div>
              {leader}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function BusinessPanel({ data }: { data: CompanyData }) {
  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex items-center gap-2 flex-wrap">
        {data.wikipediaUrl ? (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-lg text-xs text-blue-400">📖 Wikipedia</span>
        ) : null}
        {data.websiteData?.scraped ? (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-500/10 border border-purple-500/20 rounded-lg text-xs text-purple-400">🌐 Company Website</span>
        ) : (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-700/50 border border-slate-600/30 rounded-lg text-xs text-slate-400">📊 Available Sources</span>
        )}
      </div>

      <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-5">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Building2 className="w-5 h-5 text-blue-400" /> Core Offerings
        </h3>
        {data.offerings.length > 0 ? (
          <div className="grid gap-2">
            {data.offerings.map((offering) => (
              <div key={offering} className="flex items-center gap-3 p-3 bg-slate-700/30 rounded-lg border border-slate-600/20 hover:border-blue-500/30 transition-colors">
                <CheckCircle2 className="w-4 h-4 text-blue-400 flex-shrink-0" />
                <span className="text-slate-300 text-sm">{offering}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-slate-500 text-sm italic">No specific offerings found. The company's industry is {data.industry}.</p>
        )}
      </div>

      {data.projects.length > 0 && (
        <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-5">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-blue-400" /> Notable Projects
          </h3>
          <div className="flex flex-wrap gap-2">
            {data.projects.map((project) => (
              <span key={project} className="px-3 py-2 bg-blue-500/10 border border-blue-500/20 rounded-lg text-blue-300 text-sm">{project}</span>
            ))}
          </div>
        </div>
      )}

      {data.recentNews.length > 0 && (
        <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-5">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-400" /> Key Information
          </h3>
          <div className="space-y-3">
            {data.recentNews.map((news, i) => (
              <div key={i} className="flex items-start gap-3 p-3 bg-slate-700/20 rounded-lg">
                <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 text-xs font-bold flex-shrink-0">{i + 1}</div>
                <span className="text-slate-300 text-sm leading-relaxed">{news}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {data.expansionPlans.length > 0 && (
        <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-5">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <ArrowRight className="w-5 h-5 text-emerald-400" /> Expansion & Growth
          </h3>
          <div className="space-y-3">
            {data.expansionPlans.map((plan, i) => (
              <div key={i} className="flex items-start gap-3 p-3 bg-emerald-500/5 border border-emerald-500/10 rounded-lg">
                <span className="text-emerald-400 text-sm">🚀</span>
                <span className="text-slate-300 text-sm leading-relaxed">{plan}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {data.announcements.length > 0 && (
        <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-5">
          <h3 className="text-lg font-bold text-white mb-4">📢 Announcements</h3>
          <div className="space-y-2">
            {data.announcements.map((ann, i) => (
              <div key={i} className="p-3 bg-slate-700/20 rounded-lg text-slate-300 text-sm">• {ann}</div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ChallengesPanel({ data }: { data: CompanyData }) {
  const [expandedChallenge, setExpandedChallenge] = useState<number | null>(null);

  return (
    <div className="space-y-4 animate-fadeIn">
      <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-4 mb-2">
        <p className="text-amber-300 text-sm">
          <AlertTriangle className="w-4 h-4 inline mr-1" />
          Challenge Detection powered by AI analysis of company data, market conditions, and growth trajectory
        </p>
      </div>

      {data.challenges.map((challenge, i) => (
        <div
          key={i}
          className={`bg-slate-800/50 rounded-xl border transition-all duration-300 cursor-pointer ${
            expandedChallenge === i ? 'border-amber-500/50 shadow-lg shadow-amber-500/5' : 'border-slate-700/50 hover:border-amber-500/30'
          }`}
          onClick={() => setExpandedChallenge(expandedChallenge === i ? null : i)}
        >
          <div className="p-5">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="text-white font-semibold">{challenge.challenge}</h4>
                  <SeverityBadge severity={challenge.severity} />
                </div>
                <p className="text-slate-400 text-sm">{challenge.reason}</p>
              </div>
              <ChevronRight className={`w-5 h-5 text-slate-500 transition-transform ${expandedChallenge === i ? 'rotate-90' : ''}`} />
            </div>

            {expandedChallenge === i && (
              <div className="mt-4 pt-4 border-t border-slate-700/50">
                <div className="bg-amber-500/5 rounded-lg border border-amber-500/10 p-4">
                  <h5 className="text-amber-400 text-xs font-semibold uppercase tracking-wider mb-3 flex items-center gap-2">
                    <Eye className="w-3.5 h-3.5" /> Evidence Panel
                  </h5>
                  <div className="space-y-2">
                    {challenge.evidence.map((ev, j) => (
                      <div key={j} className="flex items-start gap-2 text-sm">
                        <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 flex-shrink-0" />
                        <span className="text-slate-300">{ev}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

function AIOpportunitiesPanel({ data }: { data: CompanyData }) {
  return (
    <div className="space-y-4 animate-fadeIn">
      <div className="bg-purple-500/5 border border-purple-500/20 rounded-xl p-4 mb-2">
        <p className="text-purple-300 text-sm">
          <Bot className="w-4 h-4 inline mr-1" />
          AI opportunities generated based on identified challenges, industry patterns, and feasibility analysis
        </p>
      </div>

      {data.aiOpportunities.map((opp, i) => (
        <div key={i} className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-5 hover:border-purple-500/30 transition-all">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg flex-shrink-0 shadow-lg shadow-purple-500/20">
              {i + 1}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="text-white font-semibold">{opp.solution}</h4>
                <span className="px-2 py-0.5 bg-purple-500/20 text-purple-300 text-xs rounded-full border border-purple-500/30 font-semibold">
                  Score: {opp.totalScore}
                </span>
              </div>
              <p className="text-slate-400 text-xs mb-2">
                Addresses: <span className="text-amber-400">{opp.challenge}</span>
              </p>
              <p className="text-slate-300 text-sm leading-relaxed">{opp.description}</p>
              <div className="mt-3 grid grid-cols-3 gap-3">
                <ScoreBar label="Impact" value={opp.impact} color="from-cyan-500 to-blue-500" />
                <ScoreBar label="Feasibility" value={opp.feasibility} color="from-emerald-500 to-green-500" />
                <ScoreBar label="Urgency" value={opp.urgency} color="from-amber-500 to-orange-500" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function ImpactScoringPanel({ data }: { data: CompanyData }) {
  const sorted = [...data.aiOpportunities].sort((a, b) => b.totalScore - a.totalScore);

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-4">
        <p className="text-emerald-300 text-sm">
          <Target className="w-4 h-4 inline mr-1" />
          Impact Score = (Impact + Feasibility + Urgency) / 3 — Higher score = Higher priority
        </p>
      </div>

      <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-5">
        <h3 className="text-white font-bold mb-5">AI Impact Score Ranking</h3>
        <div className="space-y-4">
          {sorted.map((opp, i) => {
            const widthPercent = (opp.totalScore / 100) * 100;
            const gradientColors = [
              'from-cyan-500 to-blue-500',
              'from-purple-500 to-indigo-500',
              'from-emerald-500 to-teal-500',
              'from-amber-500 to-orange-500',
              'from-rose-500 to-pink-500',
            ];
            return (
              <div key={i} className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="text-white text-sm font-medium">{opp.solution}</span>
                  <span className="text-white text-sm font-bold">{opp.totalScore}</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r ${gradientColors[i % gradientColors.length]} transition-all duration-1000 ease-out`}
                    style={{ width: `${widthPercent}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-slate-500">
                  <span>Impact: {opp.impact}</span>
                  <span>Feasibility: {opp.feasibility}</span>
                  <span>Urgency: {opp.urgency}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-5 overflow-x-auto">
        <h3 className="text-white font-bold mb-4">Solution Comparison Matrix</h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-700">
              <th className="text-left text-slate-400 pb-3 pr-4 font-medium">Solution</th>
              <th className="text-center text-cyan-400 pb-3 px-3 font-medium">Impact</th>
              <th className="text-center text-emerald-400 pb-3 px-3 font-medium">Feasibility</th>
              <th className="text-center text-amber-400 pb-3 px-3 font-medium">Urgency</th>
              <th className="text-center text-white pb-3 pl-3 font-medium">Total</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((opp, i) => (
              <tr key={i} className="border-b border-slate-700/30">
                <td className="text-slate-300 py-2.5 pr-4">{opp.solution}</td>
                <td className="text-center py-2.5 px-3"><span className="text-cyan-400 font-semibold">{opp.impact}</span></td>
                <td className="text-center py-2.5 px-3"><span className="text-emerald-400 font-semibold">{opp.feasibility}</span></td>
                <td className="text-center py-2.5 px-3"><span className="text-amber-400 font-semibold">{opp.urgency}</span></td>
                <td className="text-center py-2.5 pl-3">
                  <span className={`font-bold px-2.5 py-1 rounded-full text-xs ${
                    opp.totalScore >= 90 ? 'bg-emerald-500/20 text-emerald-400' :
                    opp.totalScore >= 80 ? 'bg-cyan-500/20 text-cyan-400' :
                    'bg-amber-500/20 text-amber-400'
                  }`}>
                    {opp.totalScore}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function CEOPitchPanel({ data }: { data: CompanyData }) {
  return (
    <div className="space-y-4 animate-fadeIn">
      <div className="bg-rose-500/5 border border-rose-500/20 rounded-xl p-4">
        <p className="text-rose-300 text-sm">
          <FileText className="w-4 h-4 inline mr-1" />
          Auto-generated CEO pitch based on comprehensive company analysis, challenge identification, and AI opportunity mapping
        </p>
      </div>

      <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-6">
        <div className="prose prose-invert max-w-none">
          {data.ceoPitch.split('\n').map((line, i) => {
            if (line.trim() === '') return <br key={i} />;
            if (line.startsWith('Dear')) return <h3 key={i} className="text-white text-lg font-semibold mt-0">{line}</h3>;
            if (line === line.toUpperCase() && line.trim().length > 3 && !line.startsWith('•') && !line.startsWith('→') && isNaN(Number(line.charAt(0)))) {
              return <h4 key={i} className="text-cyan-400 font-bold mt-4 mb-2 text-sm uppercase tracking-wider">{line}</h4>;
            }
            if (line.startsWith('•')) {
              return <div key={i} className="flex items-start gap-2 text-slate-300 ml-2 my-1"><span className="text-cyan-400">•</span><span>{line.substring(1).trim()}</span></div>;
            }
            if (line.startsWith('→')) {
              return <div key={i} className="flex items-start gap-2 text-slate-400 ml-4 my-1 text-sm"><ArrowRight className="w-3.5 h-3.5 text-cyan-400 mt-0.5 flex-shrink-0" /><span>{line.substring(1).trim()}</span></div>;
            }
            if (/^\d+\./.test(line)) {
              return <div key={i} className="flex items-start gap-2 text-slate-300 ml-2 my-1"><span className="text-cyan-400 font-semibold">{line.match(/^(\d+\.)/)?.[1]}</span><span>{line.replace(/^\d+\.\s*/, '')}</span></div>;
            }
            if (line.startsWith('Phase')) {
              return <div key={i} className="text-emerald-400 font-semibold mt-3 ml-2">{line}</div>;
            }
            if (line.startsWith('Best regards')) {
              return <div key={i} className="text-slate-400 mt-4 italic">{line}</div>;
            }
            return <p key={i} className="text-slate-300 my-1">{line}</p>;
          })}
        </div>
      </div>
    </div>
  );
}

const InsightPanel: React.FC<InsightPanelProps> = ({ data, activeInsight, onInsightClick }) => {
  const handleExportPDF = async () => {
    const { generatePDFReport } = await import('../utils/pdfGenerator');
    generatePDFReport(data);
  };

  return (
    <div className="flex flex-col h-full bg-slate-900/60 backdrop-blur-xl rounded-2xl border border-slate-700/50 shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 px-5 py-4 border-b border-slate-700/50 bg-slate-800/50">
        <div className="flex items-center justify-between">
          <h3 className="text-white font-bold text-sm">💡 Strategic Insights</h3>
          <button
            onClick={handleExportPDF}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 rounded-lg border border-emerald-500/30 hover:border-emerald-500/50 text-xs font-semibold transition-all"
          >
            <Download className="w-3.5 h-3.5" /> 📄 Export PDF
          </button>
        </div>
      </div>

      {/* Insight Buttons */}
      <div className="flex-shrink-0 px-4 py-3 border-b border-slate-700/30 bg-slate-800/20">
        <div className="grid grid-cols-3 gap-2">
          {INSIGHT_BUTTONS.map((btn) => {
            const colors = colorMap[btn.color];
            const isActive = activeInsight === btn.type;
            return (
              <button
                key={btn.type}
                onClick={() => onInsightClick(btn.type)}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-xs font-medium transition-all duration-200 border ${
                  isActive
                    ? `${colors.bg} ${colors.text} ${colors.border} shadow-lg ${colors.glow}`
                    : 'bg-slate-800/50 text-slate-400 border-slate-700/30 hover:bg-slate-700/50 hover:text-slate-300'
                }`}
              >
                {btn.icon}
                <span className="truncate">{btn.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-5 scrollbar-thin">
        {activeInsight === 'overview' && <OverviewPanel data={data} />}
        {activeInsight === 'business' && <BusinessPanel data={data} />}
        {activeInsight === 'challenges' && <ChallengesPanel data={data} />}
        {activeInsight === 'ai-opportunities' && <AIOpportunitiesPanel data={data} />}
        {activeInsight === 'impact-scoring' && <ImpactScoringPanel data={data} />}
        {activeInsight === 'ceo-pitch' && <CEOPitchPanel data={data} />}
        {!activeInsight && (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-16 h-16 rounded-2xl bg-slate-800/50 border border-slate-700/50 flex items-center justify-center mb-4">
              <Target className="w-8 h-8 text-slate-500" />
            </div>
            <h4 className="text-slate-300 font-semibold mb-2">Select an Insight Module</h4>
            <p className="text-slate-500 text-sm max-w-xs">Click any button above to explore strategic insights about {data.name}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default InsightPanel;
