import React, { useState } from 'react';
import { Save, Plus, X, AlertCircle } from 'lucide-react';
import { ScraperConfig } from '../types';

interface SettingsViewProps {
  config: ScraperConfig;
  onSave: (newConfig: ScraperConfig) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ config, onSave }) => {
  const [localConfig, setLocalConfig] = useState<ScraperConfig>(config);
  const [newKeyword, setNewKeyword] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [subredditError, setSubredditError] = useState<string>('');

  const validateSubreddit = (name: string) => {
      const regex = /^[A-Za-z0-9_]{3,21}$/;
      if (name.length === 0) return "Subreddit name cannot be empty";
      if (!regex.test(name)) return "Invalid format: 3-21 chars, alphanumeric & underscore only";
      return "";
  };

  const handleSubredditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      setLocalConfig({...localConfig, subreddit: val});
      setSubredditError(validateSubreddit(val));
  };

  const handleAddKeyword = () => {
    if (newKeyword && !localConfig.keywords.includes(newKeyword)) {
      setLocalConfig(prev => ({ ...prev, keywords: [...prev.keywords, newKeyword] }));
      setNewKeyword('');
    }
  };

  const handleRemoveKeyword = (kw: string) => {
    setLocalConfig(prev => ({ ...prev, keywords: prev.keywords.filter(k => k !== kw) }));
  };
  
  const handleAddEmail = () => {
    if (newEmail && !localConfig.emailRecipients.includes(newEmail)) {
      setLocalConfig(prev => ({ ...prev, emailRecipients: [...prev.emailRecipients, newEmail] }));
      setNewEmail('');
    }
  };

  const handleRemoveEmail = (em: string) => {
    setLocalConfig(prev => ({ ...prev, emailRecipients: prev.emailRecipients.filter(e => e !== em) }));
  };

  const handleSave = () => {
      const error = validateSubreddit(localConfig.subreddit);
      if (error) {
          setSubredditError(error);
          return;
      }
      onSave(localConfig);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Configuration</h2>
        
        <div className="grid gap-8">
            {/* Target Settings */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold text-slate-800 border-b border-slate-100 pb-2">Targeting</h3>
                
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Target Subreddit</label>
                    <div className="flex items-center gap-2">
                        <span className="text-slate-400 font-bold text-lg">r/</span>
                        <div className="flex-1">
                            <input 
                                type="text" 
                                value={localConfig.subreddit}
                                onChange={handleSubredditChange}
                                className={`w-full p-2 border rounded-lg focus:ring-2 outline-none transition-colors ${
                                    subredditError 
                                    ? 'border-rose-300 focus:ring-rose-200 focus:border-rose-500 bg-rose-50' 
                                    : 'border-slate-300 focus:ring-indigo-500 focus:border-indigo-500'
                                }`}
                            />
                        </div>
                    </div>
                    {subredditError && (
                        <div className="flex items-center gap-1.5 mt-2 text-sm text-rose-600">
                            <AlertCircle size={14} />
                            <span>{subredditError}</span>
                        </div>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Keywords</label>
                    <div className="flex gap-2 mb-2">
                        <input 
                            type="text" 
                            value={newKeyword}
                            onChange={(e) => setNewKeyword(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleAddKeyword()}
                            placeholder="Add a phrase to track..."
                            className="flex-1 p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                        />
                        <button onClick={handleAddKeyword} className="bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-700">
                            <Plus size={20} />
                        </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {localConfig.keywords.map(kw => (
                            <span key={kw} className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
                                {kw}
                                <button onClick={() => handleRemoveKeyword(kw)} className="text-slate-400 hover:text-rose-500"><X size={14} /></button>
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            {/* Notification Settings */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold text-slate-800 border-b border-slate-100 pb-2">Notifications</h3>
                 <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Email Recipients</label>
                    <div className="flex gap-2 mb-2">
                        <input 
                            type="email" 
                            value={newEmail}
                            onChange={(e) => setNewEmail(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleAddEmail()}
                            placeholder="name@company.com"
                            className="flex-1 p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                        />
                        <button onClick={handleAddEmail} className="bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-700">
                            <Plus size={20} />
                        </button>
                    </div>
                    <div className="flex flex-col gap-2">
                        {localConfig.emailRecipients.map(em => (
                            <div key={em} className="flex justify-between items-center bg-slate-50 p-2 rounded border border-slate-100">
                                <span className="text-slate-600 text-sm">{em}</span>
                                <button onClick={() => handleRemoveEmail(em)} className="text-slate-400 hover:text-rose-500"><X size={16} /></button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            
            {/* Polling Settings */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold text-slate-800 border-b border-slate-100 pb-2">Scraper Frequency</h3>
                <div>
                     <label className="block text-sm font-medium text-slate-700 mb-1">Poll Interval (Minutes)</label>
                     <input 
                        type="number" 
                        min={1}
                        max={60}
                        value={localConfig.checkInterval}
                        onChange={(e) => setLocalConfig({...localConfig, checkInterval: parseInt(e.target.value) || 5})}
                        className="w-full p-2 border border-slate-300 rounded-lg"
                     />
                     <p className="text-xs text-slate-500 mt-1">Recommended: 5 minutes to avoid hitting Reddit API rate limits.</p>
                </div>
            </div>

        </div>

        <div className="mt-8 flex justify-end">
            <button 
                onClick={handleSave}
                disabled={!!subredditError}
                className={`flex items-center gap-2 px-8 py-3 rounded-xl font-bold transition-all shadow-lg ${
                    subredditError 
                    ? 'bg-slate-300 text-slate-500 cursor-not-allowed shadow-none' 
                    : 'bg-slate-900 text-white hover:bg-slate-800'
                }`}
            >
                <Save size={18} />
                Save Changes
            </button>
        </div>
      </div>
    </div>
  );
};