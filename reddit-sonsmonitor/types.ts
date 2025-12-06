export interface RedditMention {
  id: string;
  type: 'post' | 'comment';
  author: string;
  subreddit: string;
  title?: string;
  body: string;
  url: string;
  timestamp: number; // Unix timestamp
  sentiment?: 'positive' | 'negative' | 'neutral' | 'analyzing';
  aiAnalysis?: string;
  isNew?: boolean;
}

export interface ScraperConfig {
  subreddit: string;
  keywords: string[];
  emailRecipients: string[];
  checkInterval: number; // in minutes
  isActive: boolean;
}

export enum ViewState {
  DASHBOARD = 'DASHBOARD',
  ANALYTICS = 'ANALYTICS',
  SETTINGS = 'SETTINGS',
}