import React, { useState } from 'react';
import { Filter } from 'lucide-react';
import { StatusCard } from './StatusCard';
import { MentionsFeed } from './MentionsFeed';
import { RedditMention, ScraperConfig } from '../types';

interface DashboardProps {
    config: ScraperConfig;
    mentions: RedditMention[];
    lastChecked: Date;
    onToggleActive: () => void;
    onUpdateMention: (id: string, updates: Partial<RedditMention>) => void;
    onDismissMention: (id: string) => void;
    onManualScrape: () => void;
}

export type SentimentFilter = 'all' | 'positive' | 'negative' | 'neutral';

export const Dashboard: React.FC<DashboardProps> = ({
    config,
    mentions,
    lastChecked,
    onToggleActive,
    onUpdateMention,
    onDismissMention,
    onManualScrape
}) => {
    const [filter, setFilter] = useState<SentimentFilter>('all');

    const FilterButton = ({ type, label }: { type: SentimentFilter, label: string }) => (
        <button
            onClick={() => setFilter(type)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filter === type
                    ? 'bg-slate-800 text-white shadow-md'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
        >
            {label}
        </button>
    );

    return (
        <div className="space-y-6">
            <StatusCard
                config={config}
                lastChecked={lastChecked}
                mentionsCount={mentions.length}
                onToggle={onToggleActive}
                onManualScrape={onManualScrape}
            />

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                    Latest Mentions
                </h3>

                <div className="flex flex-wrap items-center gap-2 bg-slate-100 p-1 rounded-xl w-full sm:w-auto overflow-x-auto">
                    <div className="px-3 text-slate-400 hidden sm:block">
                        <Filter size={16} />
                    </div>
                    <FilterButton type="all" label="All" />
                    <FilterButton type="positive" label="Positive" />
                    <FilterButton type="neutral" label="Neutral" />
                    <FilterButton type="negative" label="Negative" />
                </div>
            </div>

            <MentionsFeed
                mentions={mentions}
                filter={filter}
                onUpdateMention={onUpdateMention}
                onDismiss={onDismissMention}
            />
        </div>
    );
};