# AI Automation Workflow Portfolio

This collection contains 16 portfolio-safe n8n workflow exports covering AI-assisted routing, operations, lead management, alerts, approvals, and multi-system synchronization.

The workflows demonstrate production-oriented patterns rather than isolated demos:

- Webhook and scheduled ingestion
- Input validation and normalization
- LLM classification through OpenRouter or Anthropic-compatible APIs
- Confidence gates and deterministic fallback paths
- Human approval steps
- Error handling and operational alerts
- Airtable, Google Sheets, Gmail, Slack, Discord, calendar, and VOIP integrations
- Environment-variable based secret management

## Featured Workflows

### 1. Apex Auto Electric - AI Diagnostic Routing

Classifies automotive service tickets, checks confidence and high-voltage urgency, then routes work to specialized queues and technician records.

- Patterns: webhook intake, AI classification, confidence gate, category routing
- Integrations: Anthropic-compatible API, Slack, Google Sheets
- File: `workflows/apex-auto-electric-ai-diagnostic-routing.json`

### 2. NomadCounsel - Lead Triage and Attorney Approval

Routes legal leads by risk, pauses high-risk cases for partner approval, and records approved, rejected, and standard leads through separate paths.

- Patterns: risk classification, human-in-the-loop approval, wait/resume, audit logging
- Integrations: Slack, email, Google Sheets
- File: `workflows/nomadcounsel-lead-triage-attorney-approval.json`

### 3. Pixel and Pillar - Contractor Offboarding

Monitors contractor end dates and coordinates HR, DevOps, logistics, account security, asset recovery, and AI-personalized offboarding checklists.

- Patterns: scheduled monitoring, staged routing, data-source switching, AI content generation
- Integrations: Google Sheets, Airtable, OpenRouter, Gmail, Slack
- File: `workflows/pixel-pillar-contractor-offboarding.json`

### 4. Peak Performance Prep - SAT Lead Capture

Validates student diagnostic requests, uses AI to classify service tiers, creates CRM records, and sends tailored parent and tutor notifications.

- Patterns: validation, AI enrichment, failure-specific alerts, multi-recipient messaging
- Integrations: OpenRouter, Airtable, Gmail, Slack
- File: `workflows/peak-performance-sat-lead-capture.json`

### 5. Fairweather Marine - High-Value Claims Triage

Validates marine insurance claims, classifies urgency and value, immediately alerts the claims team, and records every outcome.

- Patterns: AI triage, urgent path, durable logging, storage-failure escalation
- Integrations: OpenRouter, Slack, Gmail, Airtable
- File: `workflows/fairweather-marine-claims-triage.json`

### 6. Lichen and Grime - Chemical and PSI Assistant

Transforms field-service form submissions into safety-focused pressure-washing recommendations and keeps a recommendation and error audit trail.

- Patterns: AI safety assistant, structured response parsing, audit logging, global error path
- Integrations: OpenRouter, Google Sheets, Gmail, Discord
- File: `workflows/lichen-grime-chemical-psi-assistant.json`

### 7. HighPoint Trades - Job Status Monitor

Monitors service jobs, validates customer data, checks weather using a cache-aware path, and sends priority-specific customer and crew notifications.

- Patterns: polling, validation, cache TTL, external API fallback, priority routing, rate limiting
- Integrations: Google Sheets, OpenWeatherMap, Gmail, Slack
- File: `workflows/highpoint-trades-job-status-monitor.json`

### 8. BrightSmile Dental - Staff Credentialing Sync

Synchronizes cleared candidates from recruitment records into the staff system and routes notifications to the correct clinic manager.

- Patterns: scheduled sync, normalization, validation, status routing, location routing, audit records
- Integrations: Google Sheets, Airtable, Slack
- File: `workflows/brightsmile-staff-credentialing-sync.json`

### 9. Coastal Breezes - After-Hours Triage

Receives after-hours property calls, checks urgency, looks up the on-call technician, alerts responders, and logs non-emergency cases for morning review.

- Patterns: VOIP webhook, urgency routing, on-call lookup, missing-technician error path
- Integrations: Airtable, Slack, Google Sheets, Gmail
- File: `workflows/coastal-breezes-after-hours-triage.json`

### 10. Midnight Paws - After-Hours VOIP Triage

Separates daytime and after-hours calls, sends the appropriate SMS response, logs the lead, and acknowledges the VOIP provider.

- Patterns: time-aware routing, SMS response, lead logging, webhook acknowledgement
- Integrations: Twilio-compatible API, Google Sheets
- File: `workflows/midnight-paws-after-hours-voip-triage.json`

### 11. Gilded Page and Quill - Restoration Prep

Detects restoration consultations from a calendar, extracts preparation details, prevents duplicate preparation blocks, and creates follow-up events.

- Patterns: calendar trigger, data extraction, duplicate prevention, conditional event creation
- Integrations: Google Calendar
- File: `workflows/gilded-page-quill-restoration-prep.json`

### 12. Gilded Key - Property Showing Sync

Builds property-showing timestamps, identifies VIP clients, and creates differentiated calendar events.

- Patterns: spreadsheet trigger, timestamp normalization, VIP routing
- Integrations: Google Sheets, Google Calendar
- File: `workflows/gilded-key-property-showing-sync.json`

### 13. Steeped and Seeded - Monthly Tasting Box

Routes new subscriptions by tasting-box type and generates AI preparation notes for tea, juice, and mixed subscriptions.

- Patterns: data validation, product routing, AI-generated fulfillment notes
- Integrations: Google Sheets, OpenRouter, Discord
- File: `workflows/steeped-seeded-monthly-tasting-box.json`

### 14. Bistro Sync - Reservation and Allergy Alert

Normalizes reservations, isolates allergy-sensitive bookings, alerts restaurant staff, merges processing paths, and upserts the daily service record.

- Patterns: webhook intake, allergy gate, branch merge, idempotent CRM update
- Integrations: Slack, Airtable
- File: `workflows/bistro-sync-reservation-allergy-alert.json`

### 15. SwiftCare Pediatrics - Results Routing

Separates normal from abnormal or pending results and coordinates parent and nursing-team notifications.

- Patterns: status routing, guarded notification, clinical-team escalation
- Integrations: Google Sheets, Gmail, Slack
- File: `workflows/swiftcare-pediatrics-results-routing.json`

### 16. Automation Control - Website Lead Intake

Provides a compact website lead pipeline with webhook ingestion, normalization, internal email notification, and a structured success response.

- Patterns: webhook intake, payload normalization, immediate alert, API response
- Integrations: Gmail
- File: `workflows/automation-control-website-lead-intake.json`

## Import and Configure

1. Download the desired JSON file.
2. In n8n, choose **Import from File**.
3. Reconnect credentials for each integration.
4. Replace placeholder resource IDs, webhook URLs, phone numbers, and email addresses.
5. Configure environment variables required by HTTP Request nodes.
6. Run each branch with test data before activating the workflow.

Common environment variables include:

```text
OPENROUTER_API_KEY
ANTHROPIC_API_KEY
API_TOKEN
GOOGLE_API_KEY
AWS_ACCESS_KEY_ID
```

The exact variables required depend on the selected workflow.

## Security

These exports are intentionally disabled and sanitized for public portfolio use. The repository versions exclude:

- n8n credential references
- Pinned execution data and sample personal data
- Instance and workflow runtime metadata
- Live Slack and Discord webhook tokens
- Inline API keys and bearer tokens
- Live Google Sheets and Airtable resource identifiers

Use `scripts/sanitize_n8n_exports.py` before publishing future n8n exports. Public workflow files are examples and must be configured with your own test credentials before execution.

## Author

Joshua Dingcong

- Portfolio: https://joshuaedingcong.web.app
- GitHub: https://github.com/shuakipie87
