import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { RedditMention } from '../types';

interface AnalyticsViewProps {
    mentions: RedditMention[];
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ mentions }) => {
  // Process data for charts
  const mentionsByHour = new Array(24).fill(0).map((_, i) => ({ hour: `${i}:00`, count: 0 }));
  
  mentions.forEach(m => {
      const hour = new Date(m.timestamp).getHours();
      mentionsByHour[hour].count++;
  });

  const sentimentData = [
      { name: 'Positive', value: mentions.filter(m => m.sentiment === 'positive').length },
      { name: 'Negative', value: mentions.filter(m => m.sentiment === 'negative').length },
      { name: 'Neutral', value: mentions.filter(m => m.sentiment === 'neutral').length },
  ];

  return (
    <div className="space-y-6">
        <h2 className="text-2xl font-bold text-slate-900">Performance Analytics</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <h3 className="text-lg font-bold text-slate-800 mb-6">Activity (Last 24h)</h3>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={mentionsByHour}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                            <XAxis dataKey="hour" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} />
                            <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} />
                            <Tooltip 
                                cursor={{fill: '#f1f5f9'}}
                                contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                            />
                            <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                 <h3 className="text-lg font-bold text-slate-800 mb-6">Sentiment Distribution</h3>
                 <div className="grid grid-cols-3 gap-4 h-64 content-center">
                    <div className="text-center p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                        <div className="text-3xl font-bold text-emerald-600 mb-2">{sentimentData[0].value}</div>
                        <div className="text-sm font-semibold text-emerald-800">Positive</div>
                    </div>
                    <div className="text-center p-4 bg-slate-50 rounded-xl border border-slate-100">
                        <div className="text-3xl font-bold text-slate-600 mb-2">{sentimentData[2].value}</div>
                        <div className="text-sm font-semibold text-slate-800">Neutral</div>
                    </div>
                    <div className="text-center p-4 bg-rose-50 rounded-xl border border-rose-100">
                        <div className="text-3xl font-bold text-rose-600 mb-2">{sentimentData[1].value}</div>
                        <div className="text-sm font-semibold text-rose-800">Negative</div>
                    </div>
                 </div>
            </div>
        </div>
    </div>
  );
};