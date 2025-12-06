# 🚀 Set Up Guide: Reddit Live Monitor

This guide explains how to connect your **SonsMonitor React Dashboard** to the live Reddit API using a Python backend.

## Prerequisites

1.  **Python 3.x** installed.
2.  **Node.js** installed (for the React app).
3.  A **Reddit Account**.

---

## Step 1: Get Reddit API Credentials

To scrape Reddit, you need an API key.

1.  Go to [https://www.reddit.com/prefs/apps](https://www.reddit.com/prefs/apps).
2.  Click **"Create Another App"** (or "are you a developer? create an app").
3.  Fill in the form:
    *   **Name**: `SonsMonitor`
    *   **App type**: Select **script** (IMPORTANT).
    *   **Redirect URI**: `http://localhost:8080` (This won't be used, but is required).
4.  Click **Create app**.
5.  Note down two things:
    *   **Client ID**: The string appearing just under the app name (e.g., `nU2...`).
    *   **Client Secret**: The string labeled "secret".

---

## Step 2: Configure and Run the Server

1.  **Install Python Dependencies**
    Open your terminal and run:
    ```bash
    pip install flask flask-cors praw
    ```

2.  **Edit `server.py`**
    Open the `server.py` file in your code editor.
    Locate the configuration section near the top and replace the placeholders with your actual Reddit credentials:

    ```python
    REDDIT_CLIENT_ID = 'YOUR_ACTUAL_CLIENT_ID'
    REDDIT_CLIENT_SECRET = 'YOUR_ACTUAL_CLIENT_SECRET'
    REDDIT_USER_AGENT = 'SonsMonitor/1.0'
    ```

3.  **Start the Server**
    Run the server in your terminal:
    ```bash
    python server.py
    ```
    You should see: `Starting Flask server on http://localhost:5000`

---

## Step 3: Run the Dashboard

1.  Ensure your React app is running (usually automatic in this environment, or via `npm start`).
2.  The dashboard will automatically try to connect to `http://localhost:5000`.
3.  If successful, the amber "Backend Connection Failed" warning will disappear.

## Step 4: Test It

1.  Go to the **Settings** tab in the dashboard.
2.  Ensure the **Target Subreddit** is set to something active (e.g., `tressless` or `all` for testing).
3.  Add common keywords to track (e.g., `hair`, `loss`, `minoxidil`).
4.  Go back to the **Live Monitor** tab.
5.  Click the **Lightning Bolt** icon (Manual Scrape) next to the "Start/Stop" button.
6.  Watch your terminal running `server.py` to see the scraping logs.
7.  New mentions should appear in your feed!

---

## Troubleshooting

*   **"Backend Connection Failed"**: Make sure `python server.py` is running and port 5000 is not blocked.
*   **"Reddit credentials not configured"**: Double-check you pasted the correct Client ID and Secret into `server.py`.
*   **No mentions appearing**: Try a popular subreddit (like `pics` or `askreddit`) and a common keyword (like `the`) just to verify the pipe is working, then switch back to your niche targets.
