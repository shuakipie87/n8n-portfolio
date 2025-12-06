# 📊 SonsMonitor Dashboard - App Overview

## Purpose

**SonsMonitor** is a real-time Reddit monitoring dashboard designed to track and analyze brand mentions across Reddit. It specifically targets discussions related to **Sons.co.uk** (a hair loss treatment company) by scraping subreddits for relevant keywords and presenting them in an organized, actionable format.

---

## What Problem Does It Solve?

For brands and marketing teams, keeping track of what people say about your product on Reddit is crucial for:
- **Reputation Management** - Identify negative sentiment early
- **Customer Support** - Find users who need help or have questions
- **Market Research** - Understand customer pain points and preferences
- **Competitor Analysis** - See how you're compared to competitors
- **Engagement Opportunities** - Find organic moments to engage with the community

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    React Frontend (Vite)                     │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐          │
│  │  Dashboard  │  │  Analytics  │  │  Settings   │          │
│  │    View     │  │    View     │  │    View     │          │
│  └─────────────┘  └─────────────┘  └─────────────┘          │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼  HTTP REST API
┌─────────────────────────────────────────────────────────────┐
│                  Python Flask Backend                        │
│      ┌──────────────────┐    ┌──────────────────┐           │
│      │  /api/scrape     │    │  /api/mentions   │           │
│      │  POST - Trigger  │    │  GET - Retrieve  │           │
│      │  scraping        │    │  all mentions    │           │
│      └──────────────────┘    └──────────────────┘           │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼  PRAW (Reddit API Wrapper)
┌─────────────────────────────────────────────────────────────┐
│                       Reddit API                             │
│                  (Posts & Comments)                          │
└─────────────────────────────────────────────────────────────┘
```

---

## Core Features

### 🖥️ Dashboard View
- **Live Mentions Feed** - Real-time display of Reddit posts/comments matching your keywords
- **Status Indicators** - Shows whether monitoring is active
- **Manual Scrape Button** - Trigger an immediate scrape
- **Auto-polling** - Automatically fetches new mentions at configured intervals

### 📈 Analytics View
- Sentiment analysis visualization
- Mention trends over time
- Subreddit distribution

### ⚙️ Settings View
- **Target Subreddit** - Configure which subreddit(s) to monitor (e.g., `tressless`)
- **Keywords** - Define keywords to track (e.g., `sons.co.uk`, `sons hair`)
- **Email Recipients** - Configure who receives alerts
- **Check Interval** - Set polling frequency (in minutes)
- **Active Toggle** - Enable/disable monitoring

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React + TypeScript |
| **Bundler** | Vite |
| **Styling** | Tailwind CSS |
| **Backend** | Python Flask |
| **Reddit API** | PRAW (Python Reddit API Wrapper) |
| **CORS** | Flask-CORS |

---

## Key Files

| File | Description |
|------|-------------|
| `App.tsx` | Main React component, handles state and API calls |
| `server.py` | Flask backend with Reddit scraping logic |
| `types.ts` | TypeScript interfaces (RedditMention, ScraperConfig) |
| `constants.ts` | Default configuration and mock data |
| `components/Dashboard.tsx` | Main dashboard UI |
| `components/AnalyticsView.tsx` | Analytics visualization |
| `components/SettingsView.tsx` | Configuration panel |
| `components/MentionsFeed.tsx` | Displays list of mentions |
| `components/Sidebar.tsx` | Navigation sidebar |
| `components/StatusCard.tsx` | Status display cards |

---

## Data Flow

1. **User configures** subreddit and keywords in Settings
2. **Frontend sends** POST request to `/api/scrape` with config
3. **Backend (PRAW)** queries Reddit API for recent posts
4. **Backend filters** posts matching keywords
5. **Backend stores** mentions in memory
6. **Frontend fetches** mentions from `/api/mentions`
7. **Dashboard displays** mentions with sentiment, author, timestamp

---

## API Endpoints

### `POST /api/scrape`
**Request Body:**
```json
{
  "subreddit": "tressless",
  "keywords": ["sons.co.uk", "sons hair"]
}
```
**Response:**
```json
{
  "status": "success",
  "new_count": 3
}
```

### `GET /api/mentions`
**Response:** Array of RedditMention objects
```json
[
  {
    "id": "abc123",
    "type": "post",
    "author": "username",
    "subreddit": "tressless",
    "title": "Post title",
    "body": "Post content...",
    "url": "https://reddit.com/...",
    "timestamp": 1701830400000,
    "sentiment": "neutral",
    "isNew": true
  }
]
```

---

## Getting Started

### Prerequisites
- Node.js (for React frontend)
- Python 3.x (for Flask backend)
- Reddit API credentials

### Setup Steps

1. **Install Frontend Dependencies**
   ```bash
   npm install
   ```

2. **Install Backend Dependencies**
   ```bash
   pip install flask flask-cors praw
   ```

3. **Configure Reddit API**
   - Get API credentials from [Reddit Apps](https://www.reddit.com/prefs/apps)
   - Edit `server.py` with your `CLIENT_ID` and `CLIENT_SECRET`

4. **Start Backend**
   ```bash
   python server.py
   ```

5. **Start Frontend**
   ```bash
   npm run dev
   ```

6. **Access Dashboard** at `http://localhost:5173`

---

## Future Enhancements (Suggested)

- [ ] Persistent storage (database instead of in-memory)
- [ ] Email notifications for new mentions
- [ ] AI-powered sentiment analysis
- [ ] Comment scraping (currently only posts)
- [ ] Multi-subreddit monitoring
- [ ] Historical trend analytics
- [ ] Export mentions to CSV/PDF

---

## Notes

- Mentions are stored **in-memory** and reset on server restart
- Default monitoring targets the `tressless` subreddit (hair loss community)
- The app includes mock data for testing without Reddit API credentials
