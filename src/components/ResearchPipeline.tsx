import React, { useState, useEffect } from 'react';
import { PIPELINE_STAGES } from '../types';
import { Check, Loader2, Circle } from 'lucide-react';

interface ResearchPipelineProps {
  isAnalyzing: boolean;
  currentStage: number;
  onComplete: () => void;
}

const ResearchPipeline: React.FC<ResearchPipelineProps> = ({ isAnalyzing, currentStage, onComplete }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isAnalyzing) return;
    
    if (currentStage >= PIPELINE_STAGES.length) {
      const timer = setTimeout(onComplete, 500);
      return () => clearTimeout(timer);
    }

    const stage = PIPELINE_STAGES[currentStage];
    const interval = 50;
    const steps = stage.duration / interval;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      setProgress(Math.min((step / steps) * 100, 100));
      if (step >= steps) {
        clearInterval(timer);
      }
    }, interval);

    return () => clearInterval(timer);
  }, [isAnalyzing, currentStage, onComplete]);

  if (!isAnalyzing) return null;

  return (
    <div className="w-full max-w-4xl mx-auto my-8">
      <div className="bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-8 shadow-2xl">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-white mb-2">🔍 Research Pipeline</h2>
          <p className="text-slate-400">Fetching data from Wikipedia, Wikidata & Company Website</p>
        </div>

        <div className="space-y-4">
          {PIPELINE_STAGES.map((stage, index) => {
            const isCompleted = index < currentStage;
            const isCurrent = index === currentStage;

            return (
              <div key={stage.id} className={`flex items-center gap-4 transition-all duration-500 ${
                isCurrent ? 'scale-[1.02]' : ''
              }`}>
                <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 ${
                  isCompleted ? 'bg-emerald-500/20 border border-emerald-500' :
                  isCurrent ? 'bg-cyan-500/20 border border-cyan-500 animate-pulse' :
                  'bg-slate-800 border border-slate-600'
                }`}>
                  {isCompleted ? (
                    <Check className="w-5 h-5 text-emerald-400" />
                  ) : isCurrent ? (
                    <Loader2 className="w-5 h-5 text-cyan-400 animate-spin" />
                  ) : (
                    <Circle className="w-5 h-5 text-slate-500" />
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{stage.icon}</span>
                      <span className={`font-semibold ${
                        isCompleted ? 'text-emerald-400' :
                        isCurrent ? 'text-cyan-300' :
                        'text-slate-500'
                      }`}>
                        {stage.label}
                      </span>
                    </div>
                    {isCurrent && (
                      <span className="text-xs text-cyan-400 font-mono">{Math.round(progress)}%</span>
                    )}
                    {isCompleted && (
                      <span className="text-xs text-emerald-400 font-mono">✓ Complete</span>
                    )}
                  </div>
                  <p className={`text-sm ${
                    isCurrent ? 'text-slate-300' : 'text-slate-500'
                  }`}>
                    {stage.description}
                  </p>
                  {isCurrent && (
                    <div className="mt-2 w-full bg-slate-700 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-100"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {currentStage >= PIPELINE_STAGES.length && (
          <div className="mt-6 text-center animate-fade-in">
            <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 rounded-full px-6 py-3">
              <Check className="w-5 h-5 text-emerald-400" />
              <span className="text-emerald-400 font-semibold">Analysis Complete — AI Ready</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResearchPipeline;
