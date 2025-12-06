## Backend (API)

* Objective: Create a backend API Node.js (Express) that:
  * Accepts POST requests containing the form data (name, email, company, message).
  * Validates the data to ensure it meets the necessary format.
  * Sends the data to n8n for further processing (e.g., email notification).

    Technologies:Node.js (Express).

    Expected Outcome: A backend that processes form data and forwards it to n8n via 		 an HTTP request for further automation.

3. n8n Workflow Automation

* Objective: Set up an n8n workflow to automate the following tasks:
  Trigger: The workflow should trigger when a new lead is submitted via the backend (e.g., via a webhook or HTTP request).
  * Email Notification: Once the lead is received, n8n should send an email notification to the sales team with the lead’s details.
  * Use SendGrid, Mailgun, or SMTP for email integration.
  * Optional: Store the lead data in a simple database (e.g., Google Sheets, Airtable, or MySQL) through n8n.

## Backend - `lead-gen-backend`

**Technology:** Node.js, Express, SQLite

**Purpose:** Accepts form submissions, stores in DB, triggers `n8n` webhook.

---

### Setup Instructions

#### Install Dependencies

cd lead-gen-backend
npm install

### Environment Variables

    Create a`.env` file in the root:

    PORT=5000

    Use either the production or test n8n webhook

    N8N_WEBHOOK_URL=https://puneetharajkr.app.n8n.cloud/webhook/lead


### Run Backend Server

    npm start

>    server runs on `http://localhost:5000`

---

### How it Works

* Receives `POST` request at `/api/leads`.
* Stores the lead into `SQLite` database.
* Forwards the same data to your `n8n` workflow using webhook URL.

### POST Endpoint

    POST /api/leads
	Content-Type: application/json

    {
 	 "name": "John Doe",
  	"email": "john@example.com",
 	 "company": "ABC Corp",
 	 "message": "Interested in demo"
	}


## 📁 Folder Structure

lead-gen-backend/
├── db/
│   └── database.js           # SQLite DB setup
├── routes/
│   └── leads.js              # Route to handle lead submission
├── .env                      # Config variables
├── leads.db                  # SQLite database file
├── server.js                 # Express server entry
├── package.json
└── README.md



## 3. Automation - `n8n Workflow`

**Goal:** Send lead info via Email using SMTP (Gmail or custom)

---

## n8n Webhook Setup

####  Trigger (Webhook node)

* Method: `POST`
* URL: `/webhook/lead`

#### 🔄 Set Node (Map incoming body)

> Use `Manual Mapping` and add values as:

* **This ensures proper extraction.**
  Name: {{ $json["body"]["name"] || "" }}
  Email: {{ $json["body"]["email"] || "" }}
  Company: {{ $json["body"]["company"] || "" }}
  Message: {{ $json["body"]["message"] || "" }}

  in value in expression mode

---



---

#### Email Node

* SMTP credentials: Use your own or Gmail SMTP
* Set **Text field** (Expression mode) as:

    Name: {{ $json["name"] }}
	Email: {{ $json["email"] }}
	Company: {{ $json["company"] }}
	Message: {{ $json["message"] }}

>     No backticks. Keep it in**plain text** .

---

### Sample Email Output

    Name: Puneeth Raj
	Email: puneeth@example.com
	Company: Error Technologies
	Message: I’m interested in your services.

---

### Test Your Workflow

1. Run frontend form
2. Backend stores in DB
3. Backend hits n8n webhook
4. n8n sends formatted email

   You should receive email with all data filled.

---

### Deployment Checklist

* React app hosted (e.g., Netlify)

* Backend deployed (e.g., Render, Railway)
* `hah .env` URLs updated accordingly
* n8n production webhook used
