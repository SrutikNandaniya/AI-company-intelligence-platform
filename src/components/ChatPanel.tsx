import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, CompanyData, InsightType } from '../types';
import { getChatResponse, getInitialMessage, createMessage } from '../utils/chatEngine';
import { Send, Bot, User, Sparkles } from 'lucide-react';

interface ChatPanelProps {
  data: CompanyData;
  onInsightClick: (insight: InsightType) => void;
}

const QUICK_ACTIONS = [
  { label: '📊 Overview', insight: 'overview' as InsightType, query: 'What does the company do?' },
  { label: '🏢 Business', insight: 'business' as InsightType, query: 'What are the business offerings and recent news?' },
  { label: '⚠️ Challenges', insight: 'challenges' as InsightType, query: 'What challenges may the company face?' },
  { label: '🤖 AI Ops', insight: 'ai-opportunities' as InsightType, query: 'What AI opportunities exist for this company?' },
];

const ChatPanel: React.FC<ChatPanelProps> = ({ data, onInsightClick }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      const welcomeMsg = createMessage('assistant', getInitialMessage(data));
      setMessages([welcomeMsg]);
    }
  }, [data]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (text?: string) => {
    const query = text || input.trim();
    if (!query) return;

    const userMsg = createMessage('user', query);
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Simulate RAG processing delay
    await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 1200));

    const response = getChatResponse(query, data);
    const assistantMsg = createMessage('assistant', response);
    setMessages(prev => [...prev, assistantMsg]);
    setIsTyping(false);
  };

  const handleQuickAction = (action: { insight: InsightType; query: string }) => {
    onInsightClick(action.insight);
    handleSend(action.query);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const renderMarkdown = (text: string) => {
    return text.split('\n').map((line, i) => {
      // Bold
      const parts = line.split(/(\*\*[^*]+\*\*)/g);
      const rendered = parts.map((part, j) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={j} className="text-white font-semibold">{part.slice(2, -2)}</strong>;
        }
        return <span key={j}>{part}</span>;
      });

      if (line.startsWith('• ') || line.startsWith('→ ')) {
        return <div key={i} className="ml-2 flex items-start gap-1"><span>{line.charAt(0)}</span><span>{rendered.slice(1)}</span></div>;
      }
      if (line.match(/^\d+\.\s/)) {
        return <div key={i} className="ml-2">{rendered}</div>;
      }
      if (line.trim() === '') {
        return <br key={i} />;
      }
      return <div key={i}>{rendered}</div>;
    });
  };

  return (
    <div className="flex flex-col h-full bg-slate-900/60 backdrop-blur-xl rounded-2xl border border-slate-700/50 shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 px-5 py-4 border-b border-slate-700/50 bg-slate-800/50">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-white font-semibold text-sm">RAG Chatbot</h3>
            <p className="text-slate-400 text-xs">Wikipedia + Wikidata + Company Website + RAG</p>
          </div>
          <div className="ml-auto flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-emerald-400 text-xs font-medium">Online</span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 scrollbar-thin">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.role === 'assistant' && (
              <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center">
                <Bot className="w-4 h-4 text-cyan-400" />
              </div>
            )}
            <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
              msg.role === 'user'
                ? 'bg-cyan-600/80 text-white rounded-tr-md'
                : 'bg-slate-800 text-slate-300 rounded-tl-md border border-slate-700/50'
            }`}>
              {renderMarkdown(msg.content)}
            </div>
            {msg.role === 'user' && (
              <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-blue-500/20 border border-blue-500/30 flex items-center justify-center">
                <User className="w-4 h-4 text-blue-400" />
              </div>
            )}
          </div>
        ))}

        {isTyping && (
          <div className="flex gap-3 justify-start">
            <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center">
              <Bot className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="bg-slate-800 border border-slate-700/50 rounded-2xl rounded-tl-md px-4 py-3">
              <div className="flex gap-1.5">
                <div className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Actions */}
      <div className="flex-shrink-0 px-5 py-3 border-t border-slate-700/30">
        <div className="flex gap-2 flex-wrap">
          {QUICK_ACTIONS.map((action, i) => (
            <button
              key={i}
              onClick={() => handleQuickAction(action)}
              className="px-3 py-1.5 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg border border-slate-600/50 hover:border-cyan-500/50 transition-all duration-200 hover:shadow-lg hover:shadow-cyan-500/10"
            >
              {action.label}
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="flex-shrink-0 px-5 py-4 border-t border-slate-700/50 bg-slate-800/30">
        <div className="flex gap-3 items-end">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about the company..."
            rows={1}
            className="flex-1 bg-slate-800 border border-slate-600/50 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 resize-none transition-all"
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || isTyping}
            className="flex-shrink-0 w-11 h-11 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 flex items-center justify-center text-white hover:from-cyan-400 hover:to-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatPanel;
