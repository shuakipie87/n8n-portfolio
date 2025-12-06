import React from 'react';
import { ExternalLink, MessageSquare, Bot, ThumbsUp, ThumbsDown, Minus, Trash2 } from 'lucide-react';
import { RedditMention } from '../types';
import { analyzeSentiment } from '../services/geminiService';
import { SentimentFilter } from './Dashboard';

interface MentionsFeedProps {
  mentions: RedditMention[];
  filter: SentimentFilter;
  onUpdateMention: (id: string, updates: Partial<RedditMention>) => void;
  onDismiss: (id: string) => void;
}

export const MentionsFeed: React.FC<MentionsFeedProps> = ({ mentions, filter, onUpdateMention, onDismiss }) => {
  
  const handleAnalyze = async (mention: RedditMention) => {
    onUpdateMention(mention.id, { sentiment: 'analyzing' });
    const result = await analyzeSentiment(mention.body);
    onUpdateMention(mention.id, { 
      sentiment: result.sentiment,
      aiAnalysis: result.analysis 
    });
  };

  const handleDismiss = (id: string) => {
      if (window.confirm("Are you sure you want to dismiss this mention? It will be removed from your feed.")) {
          onDismiss(id);
      }
  };

  const getSentimentIcon = (sentiment?: string) => {
    switch (sentiment) {
      case 'positive': return <ThumbsUp className="text-emerald-500" size={16} />;
      case 'negative': return <ThumbsDown className="text-rose-500" size={16} />;
      case 'neutral': return <Minus className="text-slate-400" size={16} />;
      case 'analyzing': return <div className="w-4 h-4 rounded-full border-2 border-slate-300 border-t-indigo-600 animate-spin"></div>;
      default: return <Bot className="text-slate-400" size={16} />;
    }
  };

  const filteredMentions = mentions.filter(m => {
    if (filter === 'all') return true;
    return m.sentiment === filter;
  });

  if (filteredMentions.length === 0) {
    return (
        <div className="flex flex-col items-center justify-center p-12 bg-white rounded-2xl border border-slate-200 shadow-sm min-h-[400px]">
            <div className="bg-slate-50 p-4 rounded-full mb-4">
                <MessageSquare className="text-slate-300" size={48} />
            </div>
            <h3 className="text-lg font-semibold text-slate-700">No mentions found</h3>
            <p className="text-slate-500">Try adjusting your filters or wait for new data.</p>
        </div>
    );
  }

  return (
    <div className="space-y-4">
      {filteredMentions.map((mention) => (
        <div 
            key={mention.id} 
            className={`bg-white rounded-xl p-5 shadow-sm border transition-all hover:shadow-md ${mention.isNew ? 'border-indigo-200 ring-2 ring-indigo-50 animate-pulse-once' : 'border-slate-200'}`}
        >
          <div className="flex justify-between items-start mb-3">
            <div className="flex items-center gap-2 flex-wrap">
                <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wide ${mention.type === 'post' ? 'bg-blue-50 text-blue-600' : 'bg-slate-100 text-slate-600'}`}>
                    {mention.type}
                </span>
                <span className="text-sm text-slate-500">
                    Posted by <span className="font-medium text-slate-700">u/{mention.author}</span> in <span className="font-medium text-slate-700">r/{mention.subreddit}</span>
                </span>
                <span className="text-xs text-slate-400">• {new Date(mention.timestamp).toLocaleTimeString()}</span>
            </div>
            <div className="flex items-center gap-2">
                 {mention.sentiment && (
                    <div className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full border
                        ${mention.sentiment === 'positive' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 
                          mention.sentiment === 'negative' ? 'bg-rose-50 text-rose-700 border-rose-100' : 
                          'bg-slate-50 text-slate-600 border-slate-100'}`}>
                        {getSentimentIcon(mention.sentiment)}
                        <span className="capitalize">{mention.sentiment}</span>
                    </div>
                 )}
                 <a 
                    href={mention.url} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="text-slate-400 hover:text-indigo-600 transition-colors p-1"
                >
                    <ExternalLink size={18} />
                 </a>
            </div>
          </div>

          {mention.title && (
            <h4 className="font-bold text-slate-900 text-lg mb-2">{mention.title}</h4>
          )}
          
          <p className="text-slate-600 leading-relaxed text-sm mb-4 bg-slate-50 p-3 rounded-lg border border-slate-100 font-mono text-xs">
            {mention.body.length > 300 ? `${mention.body.substring(0, 300)}...` : mention.body}
          </p>

          <div className="flex items-center justify-between pt-2 border-t border-slate-50">
            {mention.aiAnalysis ? (
                <div className="flex items-start gap-2 text-sm text-indigo-800 bg-indigo-50 p-2 rounded flex-1 mr-4">
                    <Bot size={16} className="mt-0.5 flex-shrink-0" />
                    <span><strong>AI Insight:</strong> {mention.aiAnalysis}</span>
                </div>
            ) : (
                <button 
                    onClick={() => handleAnalyze(mention)}
                    disabled={mention.sentiment === 'analyzing'}
                    className="flex items-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 px-3 py-1.5 rounded-lg transition-colors"
                >
                    <Bot size={16} />
                    {mention.sentiment === 'analyzing' ? 'Analyzing...' : 'Analyze Sentiment'}
                </button>
            )}
            
            <button 
                onClick={() => handleDismiss(mention.id)}
                className="flex items-center gap-1 text-sm text-slate-400 hover:text-rose-600 hover:bg-rose-50 px-3 py-1.5 rounded-lg transition-colors font-medium"
            >
                <Trash2 size={16} />
                Dismiss
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};