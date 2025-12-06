import React, { useState, useEffect, useCallback } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { AnalyticsView } from './components/AnalyticsView';
import { SettingsView } from './components/SettingsView';
import { ViewState, ScraperConfig, RedditMention } from './types';
import { DEFAULT_CONFIG } from './constants';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.DASHBOARD);
  const [config, setConfig] = useState<ScraperConfig>(DEFAULT_CONFIG);
  const [mentions, setMentions] = useState<RedditMention[]>([]);
  const [lastChecked, setLastChecked] = useState<Date>(new Date());
  const [isBackendConnected, setIsBackendConnected] = useState<boolean>(true);

  // Connects to Python Backend
  const performScrape = useCallback(async () => {
    try {
      // 1. Trigger the scraper on the backend with current config
      const scrapeResponse = await fetch('http://localhost:5000/api/scrape', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subreddit: config.subreddit,
          keywords: config.keywords
        })
      });

      if (!scrapeResponse.ok) {
        console.warn("Scrape request returned non-200 status");
        // Don't throw here, we might still be able to get existing mentions
      }

      // 2. Fetch the updated list of mentions
      const mentionsResponse = await fetch('http://localhost:5000/api/mentions');

      if (mentionsResponse.ok) {
        const data: RedditMention[] = await mentionsResponse.json();

        // Simple merge to update list
        setMentions(data);
        setLastChecked(new Date());
        setIsBackendConnected(true);
      } else {
        console.error("Failed to fetch mentions list");
        setIsBackendConnected(false);
      }
    } catch (error) {
      console.error("Error connecting to backend API:", error);
      setIsBackendConnected(false);
    }
  }, [config.subreddit, config.keywords]);

  // Polling Logic
  useEffect(() => {
    if (!config.isActive) return;

    // Perform an initial scrape when active
    performScrape();

    // Set up the polling interval
    const intervalId = setInterval(() => {
      performScrape();
    }, config.checkInterval * 60 * 1000);

    return () => clearInterval(intervalId);
  }, [config.isActive, config.checkInterval, performScrape]);

  const handleToggleActive = () => {
    setConfig(prev => ({ ...prev, isActive: !prev.isActive }));
  };

  const handleUpdateMention = (id: string, updates: Partial<RedditMention>) => {
    setMentions(prev => prev.map(m => m.id === id ? { ...m, ...updates } : m));
  };

  const handleDismissMention = (id: string) => {
    setMentions(prev => prev.filter(m => m.id !== id));
  };

  const handleManualScrape = () => {
    performScrape();
  };

  const renderContent = () => {
    switch (currentView) {
      case ViewState.DASHBOARD:
        return (
          <>
            {!isBackendConnected && (
              <div className="bg-amber-50 border-l-4 border-amber-500 p-4 mb-4 rounded-r shadow-sm animate-fade-in">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-amber-700 font-bold">
                      Backend Connection Failed
                    </p>
                    <p className="text-sm text-amber-700 mt-1">
                      Ensure the Python server is running: <code>python server.py</code> on port 5000.
                    </p>
                    <button
                      onClick={performScrape}
                      className="mt-2 text-xs font-semibold text-amber-800 underline hover:text-amber-900"
                    >
                      Retry Connection
                    </button>
                  </div>
                </div>
              </div>
            )}
            <Dashboard
              config={config}
              mentions={mentions}
              lastChecked={lastChecked}
              onToggleActive={handleToggleActive}
              onUpdateMention={handleUpdateMention}
              onDismissMention={handleDismissMention}
              onManualScrape={handleManualScrape}
            />
          </>
        );
      case ViewState.ANALYTICS:
        return <AnalyticsView mentions={mentions} />;
      case ViewState.SETTINGS:
        return <SettingsView config={config} onSave={setConfig} />;
      default:
        return <div>View not found</div>;
    }
  };

  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // ... (existing logic)

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar
        currentView={currentView}
        onChangeView={(view) => {
          setCurrentView(view);
          setIsMobileSidebarOpen(false);
        }}
        isOpen={isMobileSidebarOpen}
        onClose={() => setIsMobileSidebarOpen(false)}
      />

      <main className={`
        flex-1 transition-all duration-300 ease-in-out
        md:ml-64 p-4 md:p-8
      `}>
        <div className="max-w-6xl mx-auto">
          {/* Mobile Header */}
          <div className="md:hidden flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsMobileSidebarOpen(true)}
                className="p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <span className="font-bold text-slate-800 text-lg">SonsMonitor</span>
            </div>
            {/* Mobile Status Indicator (Simplified) */}
            <div className={`w-3 h-3 rounded-full ${config.isActive ? 'bg-emerald-500' : 'bg-slate-300'}`}></div>
          </div>

          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default App;
