import { RedditMention, ScraperConfig } from './types';

export const MOCK_MENTIONS: RedditMention[] = [
  {
    id: 't3_1',
    type: 'post',
    author: 'hairloss_warrior',
    subreddit: 'tressless',
    title: 'Has anyone tried Sons.co.uk instead of manual prescription?',
    body: 'I usually go to my GP but the convenience of Sons seems good. Is the price worth it compared to generic finasteride? Their packaging looks nice but results matter more.',
    url: '#',
    timestamp: Date.now() - 3600000 * 2,
    sentiment: 'neutral'
  },
  {
    id: 't1_1',
    type: 'comment',
    author: 'balding_eagle99',
    subreddit: 'tressless',
    body: 'I have been using Sons for 3 months. The delivery is reliable but honestly, it is the same minoxidil you can get cheaper elsewhere. Convenience fee basically.',
    url: '#',
    timestamp: Date.now() - 3600000 * 5,
    sentiment: 'neutral'
  },
  {
    id: 't3_2',
    type: 'post',
    author: 'throwaway_scalp',
    subreddit: 'tressless',
    title: 'Sons subscription cancellation nightmare?',
    body: 'Just a warning, I tried to cancel my Sons subscription and they made it really difficult. Has anyone else had this issue?',
    url: '#',
    timestamp: Date.now() - 3600000 * 24,
    sentiment: 'negative'
  }
];

export const DEFAULT_CONFIG: ScraperConfig = {
  subreddit: 'tressless',
  keywords: ['sons.co.uk', 'sons hair', 'use sons', 'using sons'],
  emailRecipients: ['marketing@sons.co.uk'],
  checkInterval: 5,
  isActive: true
};

// Simulation helpers
const RANDOM_USERS = ['crypto_king', 'hair_today', 'regrowth_journey', 'derma_roller_guy'];
const RANDOM_TITLES = [
    'Comparison: Sons vs Hims vs Manual',
    'Is the Sons shampoo worth it?',
    '6 Month update using Sons full package',
    'Cheaper alternatives to Sons?'
];
const RANDOM_BODIES = [
    'Just started using Sons yesterday. The packaging is premium.',
    'Sons is actually quite decent value if you get the full plan.',
    'Avoid Sons, support is non-existent.',
    'Can I mix Sons minoxidil with other brands?'
];

export const generateMockMention = (config: ScraperConfig): RedditMention => {
    const isPost = Math.random() > 0.5;
    return {
        id: `gen_${Date.now()}`,
        type: isPost ? 'post' : 'comment',
        author: RANDOM_USERS[Math.floor(Math.random() * RANDOM_USERS.length)],
        subreddit: config.subreddit,
        title: isPost ? RANDOM_TITLES[Math.floor(Math.random() * RANDOM_TITLES.length)] : undefined,
        body: RANDOM_BODIES[Math.floor(Math.random() * RANDOM_BODIES.length)],
        url: '#',
        timestamp: Date.now(),
        isNew: true
    };
};