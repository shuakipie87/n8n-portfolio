import React from 'react';
import { Play, Pause, Clock, RefreshCw, Zap } from 'lucide-react';
import { ScraperConfig } from '../types';

interface StatusCardProps {
  config: ScraperConfig;
  lastChecked: Date;
  mentionsCount: number;
  onToggle: () => void;
  onManualScrape: () => void;
}

// ... imports

export const StatusCard: React.FC<StatusCardProps> = ({ config, lastChecked, mentionsCount, onToggle, onManualScrape }) => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-6 transition-all hover:shadow-md">
      <div className="flex flex-col sm:flex-row items-center gap-6 w-full md:w-auto text-center sm:text-left">
        <div className={`
            relative w-16 h-16 rounded-2xl flex items-center justify-center transition-colors
            ${config.isActive ? 'bg-emerald-100/50 text-emerald-600' : 'bg-slate-100 text-slate-400'}
        `}>
          {config.isActive && (
            <span className="absolute top-0 right-0 -mt-1 -mr-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
          )}
          {config.isActive ? <RefreshCw className="animate-spin-slow" size={32} /> : <Pause size={32} />}
        </div>

        <div className="flex-1">
          <div className="flex items-center justify-center sm:justify-start gap-3 mb-1">
            <h2 className="text-xl font-bold text-slate-900">
              {config.isActive ? 'Monitoring Active' : 'Monitoring Paused'}
            </h2>
            {config.isActive && (
              <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full border border-emerald-200 shadow-sm">
                LIVE
              </span>
            )}
          </div>
          <p className="text-slate-500 text-sm max-w-md mx-auto sm:mx-0">
            Scanning <strong>r/{config.subreddit}</strong> for: <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-indigo-50 text-indigo-600 border border-indigo-100">{config.keywords.slice(0, 3).join(', ')}{config.keywords.length > 3 && '...'}</span>
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8 w-full md:w-auto border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-8">

        {/* Improved Last Check UI */}
        <div className="flex items-center gap-3 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100">
          <div className="p-2 bg-white rounded-lg shadow-sm text-slate-400">
            <Clock size={16} />
          </div>
          <div className="text-left">
            <div className="text-[10px] uppercase tracking-wider font-bold text-slate-400 leading-tight">Last Check</div>
            <div className="text-sm font-bold text-slate-800 leading-tight">
              {lastChecked.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        </div>

        <div className="text-center px-2">
          <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-0.5">Mentions</div>
          <div className="text-2xl font-bold text-indigo-600 leading-none">{mentionsCount}</div>
        </div>

        <div className="flex gap-3 w-full sm:w-auto justify-center">
          {config.isActive && (
            <button
              onClick={onManualScrape}
              className="flex items-center justify-center w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 hover:bg-indigo-100 border border-indigo-200 transition-all hover:scale-105 active:scale-95"
              title="Run Check Now"
            >
              <Zap size={20} className="fill-current" />
            </button>
          )}

          <button
            onClick={onToggle}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold transition-all active:scale-95 ${config.isActive
                ? 'bg-white text-rose-500 hover:bg-rose-50 border-2 border-rose-100 hover:border-rose-200'
                : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg shadow-emerald-200 hover:shadow-emerald-300'
              }`}
          >
            {config.isActive ? <><Pause size={18} /> Stop</> : <><Play size={18} /> Start Monitoring</>}
          </button>
        </div>
      </div>
    </div>
  );
};