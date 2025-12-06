
import praw
from flask import Flask, jsonify, request
from flask_cors import CORS
import datetime

app = Flask(__name__)
CORS(app)

# ---------------- CONFIGURATION ----------------
# TODO: PASTE YOUR REDDIT CREDS HERE
REDDIT_CLIENT_ID = 'YOUR_ACTUAL_CLIENT_ID'
REDDIT_CLIENT_SECRET = 'YOUR_ACTUAL_CLIENT_SECRET'
REDDIT_USER_AGENT = 'SonsMonitor/1.0'
# -----------------------------------------------

# In-memory storage for mentions (resets on restart)
mentions = []

def get_reddit_instance():
    return praw.Reddit(
        client_id=REDDIT_CLIENT_ID,
        client_secret=REDDIT_CLIENT_SECRET,
        user_agent=REDDIT_USER_AGENT
    )

@app.route('/api/scrape', methods=['POST'])
def scrape():
    data = request.json
    subreddit_name = data.get('subreddit', 'all')
    
    # Ensure keywords is a list
    keywords = data.get('keywords', [])
    if isinstance(keywords, str):
        keywords = [keywords]
    keywords = [k.lower() for k in keywords]

    if not keywords:
        return jsonify({"message": "No keywords provided"}), 400

    print(f"Scraping r/{subreddit_name} for {keywords}...")

    try:
        reddit = get_reddit_instance()
        subreddit = reddit.subreddit(subreddit_name)
        
        # Scrape recent posts (limit 25 for speed)
        # Note: In a real app, you might also check 'comments' via subreddit.comments()
        count_found = 0
        
        for submission in subreddit.new(limit=50):
            # content to search
            title = submission.title or ""
            body = submission.selftext or ""
            search_text = (title + " " + body).lower()
            
            # Check for matches
            if any(k in search_text for k in keywords):
                # Avoid duplicates by ID
                if not any(m['id'] == submission.id for m in mentions):
                    mention = {
                        'id': submission.id,
                        'type': 'post',
                        'author': str(submission.author),
                        'subreddit': str(submission.subreddit),
                        'title': title,
                        'body': body[:300] + '...' if len(body) > 300 else body,
                        'url': submission.url,
                        # Javascript Date expects milliseconds, PRAW gives seconds
                        'timestamp': int(submission.created_utc * 1000), 
                        'sentiment': 'analyzing',
                        'isNew': True
                    }
                    mentions.insert(0, mention)
                    count_found += 1
        
        print(f"Found {count_found} new matches.")
        return jsonify({"status": "success", "new_count": count_found})

    except Exception as e:
        print(f"Error scraping: {e}")
        # Return 500 but with JSON so frontend can handle it nicely if needed
        return jsonify({"error": str(e)}), 500

@app.route('/api/mentions', methods=['GET'])
def get_mentions():
    # Return sorted by timestamp desc
    sorted_mentions = sorted(mentions, key=lambda x: x['timestamp'], reverse=True)
    return jsonify(sorted_mentions)

@app.route('/', methods=['GET'])
def index():
    return "SonsMonitor Backend is Running! use /api/scrape or /api/mentions"

if __name__ == '__main__':
    print("Starting Flask server on http://localhost:5000")
    print("Remember to update REDDIT_CLIENT_ID and REDDIT_CLIENT_SECRET in this file!")
    app.run(port=5000, debug=True)
