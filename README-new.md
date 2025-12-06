# 📊 SonsMonitor — Reddit Brand Mention Monitoring Dashboard

SonsMonitor is a full-stack web application designed to track and analyze brand mentions across Reddit in real time.  
It is built for marketing teams, founders, and product managers who want to monitor discussions related to **Sons.co.uk** or any other keyword on Reddit.

---

## 🚀 Features

### 🔍 Real-Time Reddit Monitoring  
- Tracks brand mentions across posts and comments  
- Keyword-based filtering (e.g., `sons`, `sons.co.uk`, `hair loss treatment`)  
- Multi-subreddit monitoring  
- Manual “Scrape Now” trigger  

### 📊 Analytics Dashboard  
- Sentiment breakdown  
- Mention trends over time  
- Subreddit distribution charts  

### 📨 Alerts & Notifications *(Future)*  
- Email alerts for new mentions  
- Priority tagging for high-impact posts  

### ⚙️ Configurable Settings  
- Custom keywords  
- Select target subreddits  
- Polling frequency  
- Toggle monitoring on/off  

---

## 🛠 Tech Stack

### Frontend
- React (TypeScript)
- Vite
- Tailwind CSS

### Backend
- Python Flask  
- Flask-CORS  
- PRAW (Python Reddit API Wrapper)

---

## 📡 API Endpoints

### `POST /api/scrape`
Trigger a new Reddit scrape.

Example:
```json
{
  "subreddit": "tressless",
  "keywords": ["sons", "sons.co.uk"]
}
GET /api/mentions
Retrieve all stored mentions.

Response example:

json
Copy code
[
  {
    "id": "abc123",
    "type": "post",
    "author": "username",
    "subreddit": "tressless",
    "title": "Post title",
    "body": "Content...",
    "url": "https://reddit.com/...",
    "timestamp": 1701830400000,
    "sentiment": "neutral",
    "isNew": true
  }
]
🏗 Architecture
scss
Copy code
React Frontend (Vite)
   │
   ▼
Flask REST API
   │
   ▼
PRAW → Reddit API
A PNG diagram is provided in the next message.

🧪 Running Locally
Backend
bash
Copy code
pip install flask flask-cors praw
python server.py
Frontend
bash
Copy code
npm install
npm run dev
Visit:
👉 http://localhost:5173/

🔐 Reddit API Configuration
Edit server.py:

python
Copy code
CLIENT_ID = "your_id"
CLIENT_SECRET = "your_secret"
USER_AGENT = "SonsMonitor/1.0"
🛤 Roadmap
 Database persistence

 Advanced AI sentiment analysis

 Multi-subreddit dashboards

 Scheduled background scraping

 CSV/PDF export

 Email notifications

📄 License
MIT License.

🤝 Contributing
Pull requests are welcome.
For major changes, please open an issue first.

📬 Contact
For issues or integration support, contact:

Developer: Joshua Dingcong
Email: joshuadngcong@gmail.com