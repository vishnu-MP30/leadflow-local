# LeadFlow AI — Technical Product Requirements Document

**Product:** LeadFlow AI — Intelligent Sales Outreach Automation Platform
**Version:** 1.1 (Revised) | **Status:** Draft for Review | **Date:** May 2026
**Audience:** Engineering, Design, QA, Product
**LLM:** Gemini 2.5 Flash (Google AI Studio)

> **v1.1 Revision Notes:** LinkedIn integration strategy revised. Unipile replaced with Apify (pay-per-use, no monthly minimum). Proxycurl removed — shut down July 2025 after LinkedIn lawsuit. LinkedIn DM sending architecture updated to cookie-session approach via Apify Actors. Risk section expanded. Cost estimates updated.

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Problem Statement](#2-problem-statement)
3. [Goals & Success Metrics](#3-goals--success-metrics)
4. [Tech Stack & API Selection](#4-tech-stack--api-selection)
5. [LinkedIn Integration Strategy](#5-linkedin-integration-strategy)
6. [System Architecture](#6-system-architecture)
7. [Database Schema](#7-database-schema)
8. [Feature Specifications](#8-feature-specifications)
9. [API Endpoint Design](#9-api-endpoint-design)
10. [Job Queue Architecture](#10-job-queue-architecture)
11. [Settings Page UX Specification](#11-settings-page-ux-specification)
12. [Security Considerations](#12-security-considerations)
13. [Deployment Architecture](#13-deployment-architecture)
14. [Development Roadmap](#14-development-roadmap)
15. [Open Questions & Decisions Needed](#15-open-questions--decisions-needed)
- [Appendix A — API Free Tier & Cost Reference](#appendix-a--api-free-tier--cost-reference)
- [Appendix B — LinkedIn Cookie Extraction Guide](#appendix-b--linkedin-cookie-extraction-guide)
- [Appendix C — Gemini Prompt Templates](#appendix-c--gemini-prompt-templates)

---

## 1. Executive Summary

LeadFlow AI is a white-label, SaaS-ready sales outreach automation platform built for B2B software companies. It automates the complete lifecycle — from LinkedIn lead import through multi-channel outreach, AI-personalized follow-ups, response handling, calendar booking, and intelligent lead drop logic — with every touchpoint orchestrated by a **Gemini 2.5 Flash** AI agent.

The platform is built as a **product** (not a workflow configuration tool), designed to be sold to clients or white-labeled. Clients connect their own API credentials via a **Settings page**, upload lead lists from Excel or Google Drive, and the system runs fully autonomously.

> **Core Value Proposition:** A single platform that takes a raw list of LinkedIn profile URLs and converts them into booked sales calls — with zero manual intervention after setup.

### v1.1 Key Change — LinkedIn Strategy

The original v1.0 proposed Unipile ($55/month minimum after a 7-day trial) as the LinkedIn layer. After research, this has been replaced with **Apify** — a pay-per-use cloud scraping platform with a free $5 credit tier, no monthly minimums, and dedicated LinkedIn Actors for profile scraping, DM sending, and inbox reading. This reduces the LinkedIn infrastructure cost from a fixed $55+/month to approximately **$5–$20/month** at typical campaign volumes, with the client supplying their own `li_at` session cookie.

---

## 2. Problem Statement

Sales teams waste 40–60% of their time on repetitive outreach tasks: researching leads, writing personalized messages, scheduling follow-ups, and managing non-responders. Existing tools either:

- Require heavy manual configuration (n8n, Make) and technical skill to operate
- Are all-in-one CRMs that lock users into their ecosystem (HubSpot, Salesforce)
- Only handle one channel (email-only or LinkedIn-only)
- Lack intelligent drop logic — they spam leads indefinitely or require manual cleanup
- Are expensive at low volumes (Unipile, Phantombuster both require $55–$69/month minimums)

LeadFlow AI solves this by providing a fully autonomous, multi-channel outreach agent that respects lead dignity, adapts messaging intelligently at each touchpoint, and knows exactly when to stop.

---

## 3. Goals & Success Metrics

### 3.1 Product Goals

- Automate 100% of the repetitive outreach cycle after initial lead upload
- Support multi-channel outreach: LinkedIn DM + Email running in parallel
- Personalize every message using AI — no generic templates
- Enforce a configurable lead lifecycle with a hard drop at 25 days of no response
- Provide clients a self-serve Settings page to plug in their own API keys and LinkedIn cookie
- Be deployable as a standalone SaaS product or white-labeled for resale
- Keep infrastructure costs under $30/month at seed-scale (≤500 leads/month)

### 3.2 Success Metrics

| Metric | Target | Measurement |
|---|---|---|
| Lead enrichment success rate | >75% emails found | `emails_found / leads_imported` |
| LinkedIn DM delivery rate | >90% | DMs sent vs. Actor success reports |
| Message personalization score | >4/5 user rating | In-app feedback per campaign |
| Follow-up delivery rate | 100% | Scheduled jobs vs. delivered jobs |
| Response detection latency | <4 hours | Reply timestamp vs. detection timestamp |
| 25-day drop accuracy | 100% | Leads dropped on schedule vs. manually verified |
| Platform uptime | 99.5% | Uptime monitoring dashboard |
| LinkedIn account health | 0 bans per month | Client account status monitoring |

---

## 4. Tech Stack & API Selection

All external APIs are chosen for their **free or freemium tier** to minimize initial cost. The client provides their own API keys via the Settings page, so per-client costs scale naturally without affecting platform margins.

### 4.1 External API Registry

| Category | Chosen Service | Free / Entry Tier | Why Chosen |
|---|---|---|---|
| **LinkedIn Profile Scraping** | **Apify** — LinkedIn Profile Scraper Actor | **$5 free credit/month**, then ~$0.01/profile PAYG | Pay-per-use; no monthly minimum; full REST API; profiles including bio, headline, company |
| **LinkedIn DM Sending** | **Apify** — Send DM for LinkedIn Actor | Included in Apify credits (~$0.10–0.50 per run) | Programmatic DM via `li_at` cookie; supports personalization variables; randomized delays |
| **LinkedIn Inbox Reading** | **Apify** — LinkedIn Chat/Message Scraper Actor | Included in Apify credits | Polls inbox for new replies; returns full conversation thread; REST API |
| **LinkedIn Connection Requests** | **Apify** — LinkedIn Connection Request Actor | Included in Apify credits | Send connection requests (required before DMing non-1st-degree connections) |
| **Email Finder (primary)** | **Apollo.io** | Free: 50 email exports/month with API | Most generous free tier; company enrichment data included; full REST API |
| **Email Finder (fallback)** | **Hunter.io** | Free: 25 searches/month | High accuracy; domain-based search; GDPR compliant |
| **Email Sending** | **Brevo (Sendinblue)** | **300 emails/day forever**, no credit card | Permanent free tier (9,000/mo); open/click/bounce/reply webhooks; full REST API |
| **LLM / AI Agent** | **Gemini 2.5 Flash** | **1,500 req/day free** on Google AI Studio | Specified by client; fast; cost-efficient for structured JSON generation |
| **Database** | **Supabase (PostgreSQL)** | Free: 500MB DB, 1GB storage, 50K MAU | Managed Postgres + Auth + Storage + Realtime; open source |
| **Job Queue / Redis** | **Upstash Redis** | Free: **10,000 commands/day**, 256MB, persistent | Serverless Redis; BullMQ compatible; no cold starts |
| **File Storage** | **Supabase Storage** | 1GB free (included in Supabase) | Pitch deck uploads; same client as database |
| **Calendar Booking** | **Calendly API** | Free basic: embeds + booking webhooks | Most widely adopted; free plan supports webhook events |
| **Google Calendar** | **Google Calendar API** | Free (Google OAuth 2.0) | Direct invite creation for warm leads who respond positively |
| **Email Verification** | **Reoon Email Verifier** | 100 free verifications/day | Reduces bounce rate; affordable paid tier at scale |

### 4.2 Why Apify Over Unipile

| Criteria | Unipile | Apify |
|---|---|---|
| **Monthly minimum cost** | $55/mo (10 accounts) | $0 ($5 free credits, then PAYG) |
| **Cost at 500 leads/month** | $55 (fixed) | ~$5–15 (500 profile lookups + DM runs) |
| **Cost at 5,000 leads/month** | $55+ | ~$50–100 |
| **Free tier** | 7-day trial only, CC not required | Permanent $5/month free credits |
| **DM sending** | ✅ Yes (session-based) | ✅ Yes (via `li_at` cookie, Actor) |
| **Profile scraping** | ✅ Yes | ✅ Yes (full profile data) |
| **Inbox reading** | ✅ Yes (polling) | ✅ Yes (Actor-based polling) |
| **Account risk approach** | Cookie + proxy routing | User's own session cookie |
| **Programmable via REST API** | ✅ Yes | ✅ Yes (full Actor REST API) |
| **Lock-in / commitment** | Monthly subscription | None — pure PAYG |
| **Proxycurl comparison** | — | Proxycurl shut down July 2025 (LinkedIn lawsuit) |

### 4.3 Core Application Stack

| Layer | Technology | Justification |
|---|---|---|
| Frontend | Next.js 14 (App Router) + TypeScript | SSR + API routes in one; best DX for SaaS dashboards |
| UI Components | Tailwind CSS + shadcn/ui | Unstyled accessible components; rapid development; open source |
| Backend API | Node.js + Express + TypeScript | Consistent JS/TS stack; large ecosystem; easy team onboarding |
| Job Scheduler | BullMQ (Node.js) | Redis-backed queue; delayed jobs; exponential backoff; open source |
| Database ORM | Prisma ORM | Type-safe DB access; auto-generated migrations; excellent DX |
| Auth | Supabase Auth + JWT | Built-in with Supabase; supports multi-tenant (one account per client) |
| Real-time updates | Supabase Realtime (WebSocket) | Live lead status updates in dashboard without polling |
| Email Templates | React Email | Code-based templates; version-controlled; testable with Jest |
| API Key Encryption | AES-256-GCM (Node.js `crypto`) | All credentials encrypted at rest before database storage |
| Deployment | Docker + Railway.app | Free-tier hosting; Git-based CD; easy container deploys |

---

## 5. LinkedIn Integration Strategy

> This section is new in v1.1 and addresses the most technically complex part of the platform.

### 5.1 The LinkedIn API Problem

LinkedIn's official API is partner-gated, requires enterprise agreements, and returns almost no useful data (only basic OAuth profile info: name and email). All meaningful profile data, DM capabilities, and inbox access require an unofficial approach.

**All LinkedIn automation tools** — Unipile, PhantomBuster, Apify Actors — work by authenticating as the user via their session cookie (`li_at`), not through LinkedIn's official API. The difference between providers is primarily:
- **Where the browser session runs** (their servers vs. user's machine)
- **Pricing model** (monthly subscription vs. pay-per-use)
- **Rate limiting and safety features** built in

Apify Actors run in Apify's cloud infrastructure using the client's own `li_at` cookie, meaning LinkedIn sees activity from the client's own account — the same as if the client were doing it manually, but automated.

### 5.2 How `li_at` Cookie Authentication Works

The `li_at` cookie is LinkedIn's primary session authentication token. It is:
- Extracted once from the client's browser (one-time setup, ~2 minutes)
- Stored encrypted in our database per user
- Passed to Apify Actors in each job payload
- Valid for 1 year unless manually revoked or LinkedIn detects unusual activity
- Tied to the client's specific LinkedIn account and all its permissions

The Settings page provides a step-by-step guide for extracting this cookie (see Appendix B).

### 5.3 Apify Actor Architecture for LinkedIn

We use **four distinct Apify Actors**, each called via Apify's REST API:

```
Actor 1: linkedin-profile-scraper
  Input:  [ linkedin_url_1, linkedin_url_2, ... ]
  Output: { name, headline, company, location, bio, profile_id }
  Cost:   ~$0.01 per profile
  When:   Enrichment phase (Day 0)

Actor 2: addeus/send-dm (LinkedIn DM Sender)
  Input:  { profileUrl, message, li_at_cookie }
  Output: { success: true/false, threadId }
  Cost:   ~$0.05–0.15 per run (depends on execution time)
  When:   Day 1 outreach, Follow-ups where LinkedIn channel is used

Actor 3: data-link-miner/linkedin-network-connection-request
  Input:  { profileUrl, note, li_at_cookie }
  Output: { success: true/false }
  Cost:   Minimal
  When:   Before DM to non-1st-degree connections (if connection needed)

Actor 4: saswave/linkedin-chat-message-scraper
  Input:  { li_at_cookie, filterUnread: true }
  Output: [ { threadId, messages[], participants[] } ]
  Cost:   ~$0.02–0.05 per run (polls all unread threads)
  When:   Reply monitoring (every 4 hours)
```

### 5.4 1st Degree vs. Non-1st Degree Leads

This is an important distinction that affects the outreach flow:

| Scenario | Can DM directly? | Action |
|---|---|---|
| Lead is a 1st-degree connection | ✅ Yes | Send DM immediately |
| Lead is 2nd/3rd degree | ❌ No | Send connection request with a short note first; DM available after acceptance |
| Lead accepted connection request | ✅ Yes | DM queued and sent |
| Lead ignored connection request >5 days | — | Rely on email channel only; no DM sent |

The platform detects connection degree during profile scraping (returned in Apify Actor output) and routes accordingly.

### 5.5 Rate Limits & Account Safety

LinkedIn enforces platform-level limits regardless of which automation tool you use:

| Action | LinkedIn Safe Limit | LeadFlow AI Default | Configurable? |
|---|---|---|---|
| Connection requests | 20–30/day (weekly: ~100) | 15/day | Yes (Settings) |
| Direct messages | 30–50/day | 20/day | Yes (Settings) |
| Profile views | 80–100/day | 50/day | Yes (Settings) |
| Inbox polling | No limit | Every 4 hours | No |

**Safety measures built in:**
- All Apify DM Actors include randomized delays (45–180 seconds between sends)
- Sends are scheduled only during business hours (9am–5pm client timezone)
- No weekend sends for LinkedIn (weekday-only)
- Daily counters tracked in Redis; jobs reschedule rather than exceed limits
- Client notified via dashboard warning if approaching daily limit

### 5.6 Important Disclaimer for Platform Users

> ⚠️ **LinkedIn ToS:** Automated messaging and scraping violate LinkedIn's User Agreement. By using LeadFlow AI's LinkedIn features, clients accept full responsibility for their LinkedIn account activity. The platform includes rate limiting and human-like delays to minimize detection risk, but cannot guarantee accounts will not be restricted. Clients should use a dedicated sales LinkedIn account rather than their primary personal account. This disclaimer must be displayed prominently during onboarding and acknowledged before LinkedIn features are enabled.

---

## 6. System Architecture

### 6.1 High-Level Overview

LeadFlow AI consists of four logical services, all containerized:

| Service | Responsibility | Tech |
|---|---|---|
| **Web App** | Dashboard, Settings, Campaign management, Analytics | Next.js 14 |
| **API Server** | REST endpoints, auth, business logic, webhook receivers | Node.js + Express |
| **Worker Service** | BullMQ job consumers: enrichment, outreach, follow-up, monitoring | BullMQ Workers |
| **Scheduler Cron** | Daily follow-up sweep, inbox polling trigger, day-25 check | node-cron |

### 6.2 Data Flow — Step by Step

1. **Client uploads** an Excel/CSV or shares a Google Drive link with LinkedIn profile URLs.
2. **API Server** parses the file, creates `Lead` records in PostgreSQL with `status: imported`.
3. **Enrichment Job** queued in BullMQ:
   - Calls **Apify LinkedIn Profile Scraper** Actor with the LinkedIn URL
   - Checks connection degree (1st vs. 2nd/3rd degree)
   - Calls **Apollo.io** API to find email; falls back to **Hunter.io** if no result
   - Verifies email via **Reoon** if confidence score <0.8
   - Stores profile data. Status → `enriched` or `enrichment_failed`
4. **AI Personalization Job** calls Gemini 2.5 Flash with profile data. Generates LinkedIn DM copy, email subject + body, and an internal personalization hook. Status → `ready`.
5. **Outreach Job (Day 1):** Checks connection degree:
   - If 1st-degree: calls Apify `send-dm` Actor → DM sent. Calls Brevo API → email sent with pitch deck link.
   - If 2nd/3rd-degree: calls Apify connection request Actor first → then DM queued pending acceptance. Email sent immediately.
   - Status → `contacted`. First contact timestamp logged.
6. **Connection Request Monitor** (daily, for pending connections): checks if connection was accepted → queues DM if yes. If not accepted after 5 days → LinkedIn DM dropped, email-only for remaining follow-ups.
7. **Response Monitor** (every 4 hours): Calls Apify inbox scraper Actor to poll for new LinkedIn messages. Listens on Brevo webhooks for email replies. If reply detected → status: `responded`.
8. **Follow-up Scheduler** (daily cron): For each `contacted` lead with no response, checks `days_since_first_contact`. Triggers follow-up jobs at Day 4, 10, 18, 25.
9. **Response Handling** (when reply detected): Gemini reads the lead's reply + full conversation context, drafts a contextual reply with a Calendly booking link. Shown in dashboard for 1-click human approval before sending.
10. **Day 25 Drop:** If still no response, sends graceful closing note. Status → `dropped`. All automation halted permanently for this lead.

### 6.3 Lead State Machine

```
imported → enriching → enriched → personalizing → ready → contacted
                ↓                                     ↓          ↓
        enrichment_failed               connection_pending   following_up (×3)
                                                ↓                    ↓
                                     connection_accepted      responded ←──── (any channel)
                                                                  ↓
                                                         meeting_booked [terminal]

                                                           dropped [terminal]
                                                           opted_out [terminal]
```

| State | Trigger | Next State(s) |
|---|---|---|
| `imported` | Row parsed from file | `enriching` |
| `enriching` | Enrichment job started | `enriched` or `enrichment_failed` |
| `enriched` | Profile data + email found | `personalizing` |
| `personalizing` | AI generating message copy | `ready` |
| `ready` | Messages ready, awaiting send window | `contacted` or `connection_pending` |
| `connection_pending` | Connection request sent to non-1st-degree lead | `connection_accepted` or `contacted` (email only if no acceptance in 5 days) |
| `connection_accepted` | Lead accepted connection request | `contacted` |
| `contacted` | Day 1 outreach sent | `responded` or `following_up` |
| `following_up` | Follow-up sent (Day 4/10/18) | `responded`, `following_up`, or `dropped` |
| `responded` | Reply detected (any channel) | `meeting_booked` or `nurturing` |
| `meeting_booked` | Calendly booking webhook confirmed | **[terminal]** |
| `dropped` | Day 25 reached, no response | **[terminal]** |
| `enrichment_failed` | Email not found after Apollo + Hunter | **[terminal — notify user]** |
| `opted_out` | Unsubscribe detected (any channel) | **[terminal — immediate halt]** |

---

## 7. Database Schema

### Table: `users`

```sql
id              UUID        PRIMARY KEY DEFAULT gen_random_uuid()
email           TEXT        UNIQUE NOT NULL
company_name    TEXT
plan            TEXT        DEFAULT 'free'   -- free | pro | enterprise
created_at      TIMESTAMPTZ DEFAULT NOW()
updated_at      TIMESTAMPTZ DEFAULT NOW()
```

### Table: `api_credentials`

```sql
id                    UUID        PRIMARY KEY DEFAULT gen_random_uuid()
user_id               UUID        REFERENCES users(id) ON DELETE CASCADE
service               TEXT        NOT NULL
                                  -- apify | apollo | hunter | brevo | gemini
                                  -- calendly | google | reoon
encrypted_api_key     TEXT        NOT NULL   -- AES-256-GCM encrypted
encrypted_api_secret  TEXT                   -- secondary credential if needed
metadata              JSONB                  -- service-specific config
                                  -- e.g. { actor_ids: {...}, calendly_url, send_window }
is_valid              BOOLEAN     DEFAULT false
last_verified_at      TIMESTAMPTZ
created_at            TIMESTAMPTZ DEFAULT NOW()
```

### Table: `linkedin_sessions`

```sql
-- Separate table for LinkedIn cookies (higher sensitivity, separate access control)
id                    UUID        PRIMARY KEY DEFAULT gen_random_uuid()
user_id               UUID        REFERENCES users(id) ON DELETE CASCADE
encrypted_li_at       TEXT        NOT NULL   -- AES-256-GCM encrypted li_at cookie value
account_name          TEXT                   -- LinkedIn display name (shown in UI)
account_linkedin_url  TEXT                   -- LinkedIn profile URL of this account
connection_degree_1st INT                    -- count of 1st-degree connections
is_active             BOOLEAN     DEFAULT true
last_used_at          TIMESTAMPTZ
expires_approx_at     TIMESTAMPTZ            -- estimated 1-year expiry from creation
created_at            TIMESTAMPTZ DEFAULT NOW()
```

### Table: `campaigns`

```sql
id               UUID        PRIMARY KEY DEFAULT gen_random_uuid()
user_id          UUID        REFERENCES users(id) ON DELETE CASCADE
linkedin_session_id UUID     REFERENCES linkedin_sessions(id)  -- which LI account to use
name             TEXT        NOT NULL
pitch_deck_url   TEXT                   -- Supabase Storage URL (link in email body)
pitch_deck_filename TEXT               -- display name for the file
status           TEXT        DEFAULT 'draft'   -- draft | active | paused | completed
settings         JSONB                  -- {
                                        --   follow_up_days: [4, 10, 18, 25],
                                        --   drop_day: 25,
                                        --   timezone: "Asia/Kolkata",
                                        --   send_on_weekends: false,
                                        --   email_window: { start: "08:00", end: "18:00" },
                                        --   linkedin_window: { start: "09:00", end: "17:00" },
                                        --   daily_dm_limit: 20,
                                        --   daily_connection_limit: 15,
                                        --   daily_email_limit: 250,
                                        --   auto_approve_replies: false,
                                        --   send_connection_request_first: true
                                        -- }
created_at       TIMESTAMPTZ DEFAULT NOW()
updated_at       TIMESTAMPTZ DEFAULT NOW()
```

### Table: `leads`

```sql
id                       UUID        PRIMARY KEY DEFAULT gen_random_uuid()
campaign_id              UUID        REFERENCES campaigns(id) ON DELETE CASCADE
user_id                  UUID        REFERENCES users(id)
linkedin_url             TEXT        NOT NULL
full_name                TEXT
headline                 TEXT
company                  TEXT
location                 TEXT
linkedin_connection_degree TEXT      -- first | second | third | unknown
linkedin_profile_id      TEXT        -- LinkedIn internal profile ID (from Apify)
email                    TEXT
email_confidence         FLOAT       -- 0.0–1.0 from Apollo/Hunter
email_source             TEXT        -- apollo | hunter | manual
email_verified           BOOLEAN     DEFAULT false  -- from Reoon verification
status                   TEXT        DEFAULT 'imported'
connection_requested_at  TIMESTAMPTZ
connection_accepted_at   TIMESTAMPTZ
first_contact_at         TIMESTAMPTZ
last_touch_at            TIMESTAMPTZ
responded_at             TIMESTAMPTZ
responded_channel        TEXT        -- linkedin | email
dropped_at               TIMESTAMPTZ
follow_up_count          INT         DEFAULT 0
enrichment_data          JSONB       -- raw profile snapshot from Apify Actor
generated_messages       JSONB       -- { linkedin_dm, email_subject, email_body, hook }
notes                    TEXT
created_at               TIMESTAMPTZ DEFAULT NOW()
updated_at               TIMESTAMPTZ DEFAULT NOW()
```

### Table: `outreach_messages`

```sql
id              UUID        PRIMARY KEY DEFAULT gen_random_uuid()
lead_id         UUID        REFERENCES leads(id) ON DELETE CASCADE
type            TEXT        -- initial_dm | initial_email | connection_request
                            -- follow_up_1 | follow_up_2 | follow_up_3
                            -- closing_note | ai_reply | manual
channel         TEXT        -- linkedin | email
subject         TEXT
body            TEXT
sent_at         TIMESTAMPTZ
opened_at       TIMESTAMPTZ   -- from Brevo webhook
clicked_at      TIMESTAMPTZ
replied_at      TIMESTAMPTZ
external_id     TEXT          -- Brevo message_id or Apify run_id for DMs
apify_run_id    TEXT          -- Track Apify Actor run for DM jobs
status          TEXT          -- queued | sent | delivered | opened | replied | bounced | failed
error_detail    TEXT
```

### Table: `apify_jobs`

```sql
-- Tracks every Apify Actor invocation for cost monitoring and debugging
id              UUID        PRIMARY KEY DEFAULT gen_random_uuid()
user_id         UUID        REFERENCES users(id)
lead_id         UUID        REFERENCES leads(id)
actor_id        TEXT        -- e.g. "addeus/send-dm"
run_id          TEXT        -- Apify run ID
purpose         TEXT        -- profile_scrape | dm_send | inbox_poll | connection_request
status          TEXT        -- started | succeeded | failed | timed_out
compute_units   FLOAT       -- returned by Apify (for cost tracking)
cost_usd        FLOAT       -- estimated cost
started_at      TIMESTAMPTZ
finished_at     TIMESTAMPTZ
output_summary  JSONB       -- key output fields
error           TEXT
```

### Table: `jobs`

```sql
id           UUID        PRIMARY KEY DEFAULT gen_random_uuid()
queue        TEXT        -- enrichment | personalization | outreach | follow_up
                         -- monitor_linkedin | ai_reply | closing_note
lead_id      UUID        REFERENCES leads(id)
status       TEXT        -- queued | running | completed | failed | retrying
attempts     INT         DEFAULT 0
max_attempts INT         DEFAULT 3
error        TEXT
payload      JSONB
scheduled_at TIMESTAMPTZ
started_at   TIMESTAMPTZ
completed_at TIMESTAMPTZ
```

---

## 8. Feature Specifications

### 8.1 Lead Import

#### Excel / CSV Upload
- Accepted formats: `.xlsx`, `.xls`, `.csv`
- Required column: `linkedin_url` (case-insensitive header, auto-detected)
- Optional columns: `full_name`, `company`, `notes` (pre-fills if present)
- Max rows per upload: 1,000 (Pro plan: 10,000)
- Duplicate detection: if `linkedin_url` already exists in campaign → skip and report
- Validation: URL must match `linkedin.com/in/` pattern; invalid rows flagged with row number

#### Google Drive Import
- User pastes a Google Drive sharing link (Sheet or Excel file)
- Backend fetches via Google Drive API with read-only OAuth scope
- Same parsing logic applies. Re-import is idempotent (deduplication prevents duplicates)

### 8.2 Settings Page

The Settings page is the configuration hub. All API keys and the LinkedIn session cookie are stored **AES-256-GCM encrypted**. Keys are never returned to the frontend after saving — only masked indicators and validation status badges are shown.

#### Settings Sections

| Section | Contents |
|---|---|
| **Account Overview** | Plan badge, usage meters (emails this month, DMs sent, leads processed, Apify credits used, storage) |
| **LinkedIn Session** | li_at cookie input with extraction guide; linked account name shown after validation; account health indicator |
| **Email Finder** | Apollo.io API key (primary) + Hunter.io API key (fallback) |
| **Email Verification** | Reoon Email Verifier API key; toggle to enable/disable verification step |
| **Email Sending (Brevo)** | API key, sender name, sender email (must be a verified domain in Brevo) |
| **AI Engine (Gemini)** | Google AI Studio API key, model selector, temperature slider (0.3–0.9) |
| **Apify** | Apify API token; Actor ID configuration (defaults pre-filled); credit balance display |
| **Pitch Decks** | Upload PDF/PPTX to Supabase Storage; manage multiple; set default per campaign |
| **Calendar** | Calendly API key + scheduling URL; Google Calendar OAuth toggle |
| **Outreach Rules** | Email send window, LinkedIn send window, daily limits per channel, weekend toggle |
| **Compliance & Risk** | ToS acknowledgment for LinkedIn automation; unsubscribe footer text; data retention setting |

#### LinkedIn Session Card (Special Treatment)

The LinkedIn session card has a more detailed UX than standard API key cards due to its sensitivity:

```
┌─────────────────────────────────────────────────────────────────────┐
│  LinkedIn Session                               ● Connected          │
│                                                                      │
│  Account: Sarah Johnson (linkedin.com/in/sarah-johnson)              │
│  Cookie expires approx: May 2027                                     │
│  Connection degree 1st count: ~1,240 connections                     │
│                                                                      │
│  li_at cookie  [••••••••••••••••••••xxxx              ]  [Validate] │
│                                                                      │
│  ⚠ This cookie gives access to your LinkedIn account. Store it      │
│    securely. Rotate it every 6 months for account safety.           │
│                                                                      │
│  [📋 How to extract your li_at cookie]          [Remove] [  Save  ] │
│                                                                      │
│  ⚖ By enabling LinkedIn features, you accept our Terms of Use       │
│    and take responsibility for your account's automation activity.  │
└─────────────────────────────────────────────────────────────────────`
```

### 8.3 AI Personalization Engine (Gemini 2.5 Flash)

Called once per lead during `personalizing` state. Receives structured profile context and returns a JSON object:

| Output Field | Description | Constraint |
|---|---|---|
| `linkedin_dm` | Casual, first-person DM referencing their specific role/company. For connection request note variant: must be ≤300 chars | Max 280 chars (300 for connection note) |
| `connection_note` | Short note sent with connection request if lead is non-1st-degree | Max 300 chars (LinkedIn limit) |
| `email_subject` | Non-spammy subject — no emoji, no ALL CAPS, no `Re:` | Max 60 chars |
| `email_body` | Professional body with natural personalization; pitch deck as a link; CTA is a question | Max 400 words |
| `personalization_hook` | Internal note: why this lead is a good fit (QA and dashboard display) | Max 100 chars |

**Sparse data fallback:** If bio and headline are missing → company-level personalization. If company also missing → lead marked `enrichment_failed`, user notified.

### 8.4 Follow-up Sequence Logic

Follow-up messages are **AI-generated fresh at send time** — not pre-generated at Day 1. Each follow-up prompt instructs Gemini to take a new angle and explicitly not to repeat prior messaging.

| Touch | Day | Angle / Tone | Email | LinkedIn DM |
|---|---|---|---|---|
| Initial outreach | 1 | Personalized intro + pitch deck link | ✅ | ✅ (if 1st-degree or accepted) |
| Follow-up 1 | 4 | Gentle nudge: "didn't want this to get buried" | ✅ | ❌ |
| Follow-up 2 | 10 | Value angle: stat, case study, or insight | ✅ | ✅ (if LI channel available) |
| Follow-up 3 | 18 | Direct ask: "Would 15 mins this week work?" | ✅ | ❌ |
| Closing note | 25 | Graceful exit; door open for future | ✅ | ✅ |

> **AI instruction:** Every follow-up prompt explicitly instructs Gemini to be respectful, avoid pressure, and write as if it's a distinct human touchpoint — not a drip sequence. The AI is given the prior messages as context with the instruction: *"Do not repeat any point already made. Take a completely new angle."*

### 8.5 Response Detection

#### Email Replies (Brevo Webhooks)
- Brevo POSTs to `/api/webhooks/brevo` for: `opened`, `clicked`, `replied`, `unsubscribed`, `bounced`, `spam`
- `replied` → status: `responded`; AI reply job queued
- `unsubscribed` / `spam` → status: `opted_out`; **all automation halted immediately**
- `bounced` → email marked invalid; Hunter.io fallback lookup queued; if none found → `enrichment_failed`
- All webhook payloads verified via HMAC-SHA256 signature

#### LinkedIn Replies (Apify Inbox Polling)
- Every 4 hours: BullMQ triggers an Apify `linkedin-chat-message-scraper` Actor run
- Actor uses the client's `li_at` cookie to read all unread conversation threads
- New messages in threads matching sent DMs → `responded` state transition
- Actor run cost: ~$0.02–0.05 per poll (amortized across all active leads in the campaign)
- Cost is tracked in `apify_jobs` table for the monthly usage dashboard

#### AI Reply Generation (On Response Detected)
- Gemini receives: lead's reply text + full prior conversation + lead profile
- Generates a natural reply: acknowledges response, answers questions, includes Calendly link
- Default: reply shown in dashboard for **1-click human approval** (human-in-the-loop, v1 default)
- `auto_approve_replies: true` campaign setting enables automatic sending (opt-in)
- NLP intent detection: if lead reply contains "not interested" / "unsubscribe" / "stop" → `opted_out`

### 8.6 Campaign Dashboard

| View | Data Shown |
|---|---|
| **Campaign Overview** | Total leads by status (donut chart), active campaign count, response rate %, booking rate %, Apify credit usage this month |
| **Lead Table** | Sortable/filterable: name, company, status badge, connection degree icon, last touch date, channel, follow-up # |
| **Lead Detail Drawer** | Full timeline: enrichment, connection request, DMs, emails — all sent/received; AI-generated copy visible; manual override option |
| **Activity Feed** | Real-time Supabase stream: "Jane Smith replied on LinkedIn", "Follow-up 2 sent to 45 leads", "3 leads accepted connection request" |
| **Analytics** | Open rate, click rate, reply rate, booking rate — by campaign, by follow-up day, by channel |
| **LinkedIn Health** | Daily DM count vs. limit, daily connection requests vs. limit, session cookie status, last poll time |

---

## 9. API Endpoint Design

All endpoints prefixed `/api/v1`. Auth via Supabase JWT in `Authorization: Bearer <token>`.

### 9.1 Campaigns

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/campaigns` | List all campaigns for authenticated user |
| `POST` | `/campaigns` | Create new campaign |
| `GET` | `/campaigns/:id` | Campaign detail with aggregate stats |
| `PATCH` | `/campaigns/:id` | Update name, settings, pitch deck |
| `POST` | `/campaigns/:id/pause` | Pause all automation |
| `POST` | `/campaigns/:id/resume` | Resume paused campaign |
| `DELETE` | `/campaigns/:id` | Soft-delete (retains lead data) |

### 9.2 Leads

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/campaigns/:id/leads` | Paginated list with filters (`status`, `search`, `sort`, `channel`) |
| `POST` | `/campaigns/:id/leads/import` | Upload Excel/CSV (`multipart/form-data`) |
| `POST` | `/campaigns/:id/leads/import-drive` | Import from Google Drive URL |
| `GET` | `/campaigns/:id/leads/:leadId` | Full lead detail + message timeline |
| `PATCH` | `/campaigns/:id/leads/:leadId` | Manual status override, add notes |
| `POST` | `/campaigns/:id/leads/:leadId/retry` | Retry enrichment for failed lead |
| `POST` | `/campaigns/:id/leads/:leadId/approve-reply` | Approve AI-drafted reply for sending |
| `POST` | `/campaigns/:id/leads/:leadId/opt-out` | Manually mark lead as opted out |
| `DELETE` | `/campaigns/:id/leads/:leadId` | Remove lead from campaign |

### 9.3 Settings

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/settings/credentials` | List services + validation status (keys masked) |
| `PUT` | `/settings/credentials/:service` | Save or update credential |
| `POST` | `/settings/credentials/:service/test` | Live validation API call |
| `DELETE` | `/settings/credentials/:service` | Remove credential |
| `GET` | `/settings/linkedin-sessions` | List saved LinkedIn sessions |
| `POST` | `/settings/linkedin-sessions` | Add new LinkedIn session (li_at cookie) |
| `DELETE` | `/settings/linkedin-sessions/:id` | Remove LinkedIn session |
| `POST` | `/settings/linkedin-sessions/:id/validate` | Test li_at cookie validity via Apify |
| `POST` | `/settings/pitch-deck` | Upload pitch deck to Supabase Storage |
| `GET` | `/settings/pitch-decks` | List uploaded pitch decks |
| `DELETE` | `/settings/pitch-decks/:id` | Delete pitch deck file |

### 9.4 Analytics

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/analytics/overview` | Platform-wide stats |
| `GET` | `/analytics/campaigns/:id` | Per-campaign: rates by follow-up day and channel |
| `GET` | `/analytics/campaigns/:id/timeline` | Daily event counts for chart rendering |
| `GET` | `/analytics/usage` | Apify credit usage, email volume, API call counts |

### 9.5 Webhooks (Inbound — Signature Verified, No Auth Header)

| Method | Endpoint | Source |
|---|---|---|
| `POST` | `/webhooks/brevo` | Email events: opened, replied, bounced, unsubscribed, spam |
| `POST` | `/webhooks/calendly` | Meeting booked: `invitee.created` |
| `POST` | `/webhooks/google-calendar` | Calendar change push notifications |

---

## 10. Job Queue Architecture

BullMQ + Upstash Redis. Each queue has independent concurrency, retry, and backoff config.

| Queue Name | Triggered By | Concurrency | Retry | Timeout |
|---|---|---|---|---|
| `enrichment` | Lead import complete | 5 parallel | 3× exp. backoff | 60s |
| `personalization` | Enrichment complete | 10 parallel | 2× | 60s |
| `connection-request` | Personalisation complete + non-1st-degree lead | 2 parallel (rate-limited) | 1× | 30s |
| `outreach-day1` | Personalisation complete + send window | 3 parallel (rate-limited) | 1× | 30s |
| `follow-up` | Daily cron follow-up sweep | 3 parallel | 2× | 30s |
| `monitor-linkedin` | Every 4-hour cron | 1 (sequential per user) | 3× | 180s |
| `monitor-connections` | Daily cron | 2 parallel | 2× | 60s |
| `ai-reply` | Response detected | 5 parallel | 2× | 90s |
| `closing-note` | Day-25 cron check | 3 parallel | 2× | 30s |

### 10.1 Rate Limiting Architecture

All send jobs check Redis counters before dispatching:

```
Key: rate:{user_id}:linkedin_dm:{YYYY-MM-DD}   → max: 20 (configurable)
Key: rate:{user_id}:linkedin_conn:{YYYY-MM-DD} → max: 15 (configurable)
Key: rate:{user_id}:email:{YYYY-MM-DD}         → max: 250 (Brevo buffer)
Key: rate:{user_id}:apify_runs:{YYYY-MM-DD}    → tracked for cost display
```

If a daily limit is hit, the job is rescheduled with `delay` to the next send window opening, not dropped.

### 10.2 Cron Schedule

```
Every 4 hours   → LinkedIn inbox polling (monitor-linkedin queue) — one run per active user
Daily  07:00am  → Follow-up sweep: all active leads, check due follow-ups by days_since_contact
Daily  07:30am  → Connection request monitor: check pending invitations for acceptance
Daily  07:45am  → Day-25 drop check: identify and queue closing notes
Daily  08:00am  → Send window opens; Redis rate counters reset to 0
Hourly          → Apify credit balance check; warn user if balance < $2
```

### 10.3 Apify Actor Call Pattern

Apify Actors are called asynchronously. The BullMQ worker:

1. Calls `POST https://api.apify.com/v2/acts/{actor_id}/runs` with payload (including `li_at` cookie decrypted from DB)
2. Receives `run_id` in response; stores in `apify_jobs` table
3. Polls `GET /runs/{run_id}` every 10s until `status: SUCCEEDED` or `FAILED` (max 5 minutes)
4. Fetches output from `GET /runs/{run_id}/dataset/items`
5. Processes result; updates `leads` and `outreach_messages` tables
6. Records `compute_units` and estimated cost in `apify_jobs`

---

## 11. Settings Page UX Specification

### 11.1 Page Layout

Left-navigation tabbed layout with these tabs:

1. **Overview** — Account info, plan badge, all usage meters
2. **LinkedIn** — Session cookie management, account health, ToS acknowledgment
3. **Email Finder** — Apollo.io (primary) + Hunter.io (fallback) + Reoon verification
4. **Email Sending** — Brevo API + sender identity
5. **AI Engine** — Gemini API key + model + temperature
6. **Apify** — API token + Actor IDs + credit balance
7. **Pitch Decks** — Upload, manage, set default
8. **Calendar** — Calendly + Google Calendar OAuth
9. **Outreach Rules** — Windows, limits, follow-up days, weekend toggle
10. **Compliance** — ToS acknowledgment, unsubscribe footer, data retention, LinkedIn disclaimer

### 11.2 Standard API Key Card

```
┌─────────────────────────────────────────────────────┐
│  [Logo]  Service Name                  ● Connected   │
│                                                      │
│  API Key   [••••••••••••••••••••xxxx    ]  [Test]   │
│                                                      │
│  Last verified: 12 May 2026, 3:42pm       [Remove]  │
│                                          [  Save  ]  │
└─────────────────────────────────────────────────────`
```

States: Not configured (grey) → Saved/Unverified (yellow) → Valid (green) → Invalid (red, error shown)

### 11.3 Apify Card (Extended)

The Apify card shows additional info since it covers multiple Actors:

```
┌────────────────────────────────────────────────────────────────┐
│  Apify                                         ● Connected      │
│                                                                  │
│  API Token  [••••••••••••••••xxxx                ]   [Test]    │
│                                                                  │
│  Credit balance:  $3.82 remaining   [↻ Refresh]                 │
│  ⚠ Low balance — top up Apify account to continue automation    │
│                                                                  │
│  Actor Configuration (pre-filled, editable):                    │
│  Profile Scraper  [ apify/linkedin-profile-scraper    ]         │
│  DM Sender        [ addeus/send-dm                    ]         │
│  Inbox Scraper    [ saswave/linkedin-chat-message...  ]         │
│  Connection Req.  [ data-link-miner/linkedin-network  ]         │
│                                                                  │
│  This month: 142 Actor runs | Est. cost: $1.42         [Save]  │
└────────────────────────────────────────────────────────────────`
```

---

## 12. Security Considerations

### 12.1 Credential Storage

- All API keys and the `li_at` LinkedIn cookie encrypted at rest using **AES-256-GCM** before database INSERT
- Master encryption key in environment variable `ENCRYPTION_SECRET` — never in the database
- Frontend never receives raw credentials — only masked representations
- `li_at` cookie stored in a separate `linkedin_sessions` table with stricter access control
- Backend decrypts credentials in memory only for the duration of the outbound API call

### 12.2 li_at Cookie Security

- The `li_at` cookie grants full access to the client's LinkedIn account — treat it as a high-value secret
- Passed to Apify Actor in the job payload over HTTPS; never logged in plaintext
- Rotation reminder displayed in Settings: "Last used 30+ days ago — consider refreshing your cookie"
- Automatic expiry warning 30 days before estimated 1-year expiration
- If an Apify Actor run returns a 401 (session expired) → alert user immediately, pause all LinkedIn jobs

### 12.3 Authentication & Multi-tenancy

- Supabase **Row Level Security (RLS)** on all tables — users only access their own rows
- JWT verified on every API request; `user_id` extracted from token claims
- All queries include `WHERE user_id = $1` as a hard filter even with RLS (defense in depth)
- `linkedin_sessions` table: separate RLS policy, only the owning user can read/write

### 12.4 Webhook Security

- Brevo: HMAC-SHA256 signature verification on `X-Brevo-Signature` header
- Calendly: `signing_secret` verification
- All inbound webhook endpoints rate-limited to 100 req/min per IP
- Replay protection: `event_id` stored in Redis for 24 hours; duplicates rejected

### 12.5 Compliance

> ⚠️ **CAN-SPAM / GDPR:** Every outbound email must include a physical sender address, one-click unsubscribe link, and clear sender identity. Unsubscribe events must immediately halt all future automation for that lead. Clients are legally responsible for establishing legitimate interest grounds for contacting leads in their jurisdiction.
>
> **LinkedIn:** Clients must acknowledge the LinkedIn automation disclaimer before enabling LinkedIn features. The platform includes built-in rate limits and human-like delays, but cannot guarantee accounts will not be restricted by LinkedIn.

---

## 13. Deployment Architecture

### 13.1 Repository Structure (Monorepo)

```
/leadflow-ai
  /apps
    /web              — Next.js 14 frontend (Vercel)
    /api              — Node.js + Express API server (Railway)
    /worker           — BullMQ worker process (Railway)
  /packages
    /database         — Prisma schema, migrations, seed scripts
    /types            — Shared TypeScript interfaces and enums
    /ai               — Gemini prompt templates + API client wrapper
    /email            — React Email templates (follow-ups, closing notes)
    /crypto           — AES-256-GCM encrypt/decrypt utilities
    /apify            — Apify Actor client wrappers + polling logic
  /docker
    Dockerfile.api
    Dockerfile.worker
    docker-compose.yml           — local development
    docker-compose.prod.yml
  /scripts
    seed.ts
    migrate.sh
  .env.example
  turbo.json
```

### 13.2 Environment Variables

| Variable | Description | Source |
|---|---|---|
| `DATABASE_URL` | Supabase PostgreSQL connection string | Supabase → Settings → Database |
| `SUPABASE_URL` | Supabase project URL | Supabase dashboard |
| `SUPABASE_ANON_KEY` | Frontend auth key | Supabase dashboard |
| `SUPABASE_SERVICE_KEY` | Backend admin key (never exposed to frontend) | Supabase dashboard |
| `UPSTASH_REDIS_URL` | BullMQ Redis URL | Upstash console |
| `UPSTASH_REDIS_TOKEN` | Upstash auth token | Upstash console |
| `ENCRYPTION_SECRET` | AES-256 master key for all credential encryption | `openssl rand -hex 32` |
| `NEXT_PUBLIC_APP_URL` | Frontend base URL | Deployment URL (Vercel) |
| `BREVO_WEBHOOK_SECRET` | Brevo webhook HMAC verification | Brevo dashboard |
| `CALENDLY_SIGNING_SECRET` | Calendly webhook signing secret | Calendly API settings |
| `GOOGLE_OAUTH_CLIENT_ID` | Google Drive + Calendar OAuth | Google Cloud Console |
| `GOOGLE_OAUTH_CLIENT_SECRET` | Google OAuth secret | Google Cloud Console |

### 13.3 Hosting — Free / Low-Cost Tiers

| Service | Platform | Free / Entry Tier |
|---|---|---|
| Next.js Frontend | **Vercel** | Free: unlimited deploys, 100GB bandwidth/month |
| API Server | **Railway.app** | $5 credit/month (~500 hours); easy paid upgrade |
| Worker Service | **Railway.app** | Same container as API or separate $5/mo service |
| Database + Auth | **Supabase** | Free: 500MB DB, 1GB storage, 2 projects |
| Redis / Job Queue | **Upstash** | Free: 10,000 commands/day, 256MB |
| File Storage | **Supabase Storage** | Free: 1GB (included) |
| LinkedIn + Scraping | **Apify** | Free: $5 credit/month; PAYG beyond |

**Estimated total platform operating cost at seed scale (≤500 leads/month): ~$10–25/month**
(vs. $55+/month with Unipile)

---

## 14. Development Roadmap

| Phase | Duration | Deliverables |
|---|---|---|
| **Phase 1: Foundation** | Week 1–2 | Monorepo + Turborepo setup, Supabase schema + RLS, Prisma migrations, Supabase Auth, AES-256 encryption utility, Settings page UI skeleton, Excel/CSV parser + lead import API |
| **Phase 2: Enrichment** | Week 3 | Apify LinkedIn Profile Scraper integration, Apollo.io + Hunter.io email finder with fallback, Reoon email verification step, enrichment BullMQ queue + workers, lead status transitions, basic dashboard table |
| **Phase 3: AI + Day 1 Outreach** | Week 4–5 | Gemini 2.5 Flash client + all prompt templates, personalization queue + worker, Apify DM Sender Actor integration, connection degree detection + request flow, Brevo email send with pitch deck link, rate limiting + send window logic |
| **Phase 4: Follow-up Engine** | Week 6 | Follow-up BullMQ queue, daily cron trigger, Day 4/10/18/25 logic, AI follow-up generation with angle variation, closing note generation, `opted_out` handling, follow-up count tracking |
| **Phase 5: Response Handling** | Week 7 | Brevo webhook receiver + HMAC verification, email reply detection, Apify inbox polling (4-hour cron), AI reply generation with human approval UI, Calendly webhook + `meeting_booked` state, Google Calendar OAuth |
| **Phase 6: Dashboard & Analytics** | Week 8 | Campaign overview with charts, analytics page (rates by day/channel), activity feed via Supabase Realtime, lead detail drawer with full timeline, LinkedIn health panel in Settings, Apify credit monitoring |
| **Phase 7: QA & Hardening** | Week 9–10 | End-to-end test suite, LinkedIn rate limit edge case testing, security audit (encryption, RLS, webhooks, li_at handling), GDPR compliance review, error handling + alerting, staging deploy, load testing |
| **Phase 8: Launch** | Week 11 | Production deploy, monitoring setup, onboarding flow with LinkedIn ToS acknowledgment, API documentation, ops runbook |

**Estimated total: 11 weeks to production-ready v1.0**

---

## 15. Open Questions & Decisions Needed

| # | Question | Owner | Priority |
|---|---|---|---|
| 1 | **AI reply approval:** Manual (human-in-the-loop) or automatic by default? **Recommendation:** Manual for v1, auto-approve as opt-in per campaign in v2 | Product | **High** |
| 2 | **Multiple LinkedIn accounts per user** (e.g. one per sales rep): The `linkedin_sessions` table supports this. Should campaigns allow selecting which LinkedIn session to use? | Product | Medium |
| 3 | **Google Drive import** requires Google OAuth. Include in v1 or defer to v2? | Engineering | Medium |
| 4 | **Apify Actor reliability:** Community Actors (addeus/send-dm etc.) may have reliability issues or be deprecated. Should we build a custom Apify Actor? This is a ~1-week engineering investment but gives full control | Engineering | **High** |
| 5 | **Pitch deck delivery:** As a PDF attachment (increases spam score) or as a tracked Supabase Storage URL? **Recommendation:** Link in email body — trackable, avoids spam filters, works with Brevo open tracking | Engineering | **High** |
| 6 | **Brevo daily limit (300/day) breach:** When exceeded mid-campaign, reschedule to next send window (recommended) or warn user and pause? | Engineering | **High** |
| 7 | **li_at cookie refresh UX:** When cookie expires, user must re-extract manually. Build a browser extension to automate this, or keep it manual? Browser extension is a ~2-week add-on | Product | Medium |
| 8 | **Connection request note vs. InMail:** For non-1st-degree leads, we send a connection request with a note (free). LinkedIn also has InMail (paid, Sales Navigator). Should we support InMail as a premium option? | Product | Low |
| 9 | **Custom Apify Actor development:** Should we build and publish our own LinkedIn Actor on Apify (open-source, self-maintained) rather than depending on third-party community Actors? Better reliability, but adds maintenance burden | Engineering | Medium |
| 10 | **White-label requirements:** Custom domain, branding, email sender domain per client? This significantly expands the Settings page scope | Business | Medium |

---

## Appendix A — API Free Tier & Cost Reference

### Free Tier Limits

| Service | Free Limit | At-Limit Behavior | Paid Upgrade |
|---|---|---|---|
| **Apify** | $5 credit/month (≈500 profile lookups OR ≈100 DM Actor runs) | Actors fail with "Insufficient credits"; dashboard warning | PAYG: $0.01/profile, $0.05–0.15/DM run |
| **Apollo.io** | 50 email exports/month via API | Enrichment pauses; dashboard warning | $49/mo Starter (1,000 credits) |
| **Hunter.io** | 25 searches/month (fallback only) | Falls through to `enrichment_failed` if Apollo also exhausted | $49/mo Starter |
| **Brevo** | 300 emails/day (9,000/mo), permanently free | Job rescheduled to next day; daily meter in dashboard | $9/mo for 20,000/mo |
| **Reoon** | 100 verifications/day | Skip verification; send with raw Apollo/Hunter confidence score | ~$5/mo for 2,000/mo |
| **Gemini 2.5 Flash** | 1,500 req/day on AI Studio | BullMQ retries with exp. backoff; alert if queue stalls | Google Cloud AI pricing (~$0.075/1M tokens input) |
| **Supabase** | 500MB DB, 1GB storage | Writes fail; upgrade required | $25/mo Pro |
| **Upstash Redis** | 10,000 commands/day | Queue operations fail gracefully; jobs may not schedule | $0.20 per 100K commands |
| **Calendly** | Basic free plan with webhooks | Advanced features (routing, teams) require upgrade | $10/mo Standard |

### Cost Comparison: Apify vs. Unipile vs. PhantomBuster

| Scenario | Apify (PAYG) | Unipile | PhantomBuster |
|---|---|---|---|
| 100 leads/month | ~$1–3 | $55 minimum | $69 minimum |
| 500 leads/month | ~$5–15 | $55 | $69 |
| 2,000 leads/month | ~$20–50 | $55 | $69–159 |
| 10,000 leads/month | ~$100–200 | $110–200 (more accounts) | $159–439 |
| **Free tier** | ✅ $5/mo forever | ❌ 7-day trial only | ❌ 14-day trial only |
| **Monthly commitment** | ❌ None | ✅ Required | ✅ Required |

---

## Appendix B — LinkedIn Cookie Extraction Guide

This guide is shown to the user in the Settings page LinkedIn card when they click "How to extract your li_at cookie".

### Step-by-Step (Chrome / Edge / Brave)

1. Open [linkedin.com](https://www.linkedin.com) and log in to the account you want to use for outreach
2. Press `F12` (or right-click → Inspect) to open DevTools
3. Click the **Application** tab in the DevTools panel
4. In the left sidebar, expand **Cookies** → click `https://www.linkedin.com`
5. In the cookie list, find the row where **Name** is `li_at`
6. Click that row → the full cookie **Value** appears at the bottom of the panel
7. Copy the entire value (it starts with `AQE...` and is several hundred characters long)
8. Paste it into the LinkedIn Session field in LeadFlow AI Settings
9. Click **Validate** — the platform will verify the cookie is active and fetch your account name

### Important Notes

- The `li_at` cookie is valid for approximately **1 year** from when LinkedIn issues it
- It grants full access to your LinkedIn account — treat it like a password
- If LinkedIn logs you out or you clear cookies, a new `li_at` will be issued on next login
- **Use a dedicated sales LinkedIn account**, not your primary personal profile
- LinkedIn may occasionally prompt for re-verification if it detects unusual activity — this generates a new `li_at` cookie and invalidates the old one. Update it in Settings when this happens

### Firefox

1. Press `F12` → **Storage** tab → **Cookies** → `https://www.linkedin.com`
2. Find `li_at` → copy the **Value** column

---

## Appendix C — Gemini Prompt Templates

### C.1 Day 1 — Initial Outreach (1st-degree connection)

```
SYSTEM:
You are a senior B2B sales copywriter. Be concise, warm, and human.
Never use "I hope this email finds you well" or filler openers.
Reference the lead's actual role or company — never be generic.
Output ONLY a valid JSON object. No markdown fences. No preamble.

USER:
Lead Name: {{full_name}}
Title: {{headline}}
Company: {{company}}
LinkedIn Bio Excerpt (max 150 chars): {{bio_snippet}}
Our Product: {{product_one_liner}}
Pitch Deck Link: {{pitch_deck_url}}

Output this exact JSON:
{
  "linkedin_dm": "<max 280 chars. Casual. References their role or company.>",
  "email_subject": "<max 60 chars. No emoji. No RE:. Curiosity or value-led.>",
  "email_body": "<3–4 short paragraphs. Natural personalization. Pitch deck linked inline. Ends with a simple question CTA.>",
  "personalization_hook": "<max 100 chars. Internal: why this lead is a good fit.>"
}
```

### C.2 Day 1 — Connection Request Note (non-1st-degree leads)

```
SYSTEM:
You are writing a LinkedIn connection request note. It must be under 300 characters.
Be warm, mention why you're reaching out, don't pitch immediately.
Output ONLY a JSON object with one key.

USER:
Lead Name: {{full_name}}
Title: {{headline}}
Company: {{company}}
Our Product: {{product_one_liner}}

Output:
{ "connection_note": "<under 300 chars. Warm intro. Why connecting. No pitch.>" }
```

### C.3 Follow-up Messages (Day 4, 10, 18)

```
SYSTEM:
You are writing a follow-up to a B2B prospect who has not replied.
Be respectful. Never guilt-trip or create pressure.
Take a completely different angle from prior messages.
Output ONLY valid JSON.

USER:
Lead Name: {{full_name}}
Title: {{headline}}
Company: {{company}}
Days since first contact: {{days_elapsed}}
Follow-up number: {{follow_up_number}}  (1=Day4, 2=Day10, 3=Day18)
Angle: {{angle}}  (nudge | value | direct-ask)
Prior messages summary: {{prior_messages_summary}}

DO NOT repeat any point already made.

Output:
{
  "email_subject": "<references time elapsed naturally, not pushy>",
  "email_body": "<2–3 paragraphs max. {{angle}} tone. Single simple CTA.>",
  "linkedin_dm": "<optional — only include for follow-up 2; max 200 chars>"
}
```

### C.4 Day 25 — Closing Note

```
SYSTEM:
Write a graceful closing message to a prospect who has not responded in 25 days.
Tone: warm, understanding, zero guilt. Leave the door fully open for the future.
Never say "last chance" or create any urgency.
Output ONLY valid JSON.

USER:
Lead Name: {{full_name}}
Company: {{company}}
Total touches sent: {{total_touches}}

This message MUST include this sentiment (reworded naturally):
"Looks like the timing might not be right — completely understand."
And must close with a genuine, warm invitation to reconnect in the future.

Output:
{
  "email_subject": "<warm, final, zero pressure>",
  "email_body": "<2 short paragraphs. Graceful exit. Future door open.>",
  "linkedin_dm": "<max 200 chars. Same warmth. Casual tone.>"
}
```

### C.5 AI Reply Generation (On Response Detected)

```
SYSTEM:
You are writing a reply on behalf of a B2B sales professional.
The prospect has replied to outreach. Respond naturally, acknowledge their message,
answer any questions they raised, and smoothly offer to book a short call.
Match their energy and tone. Do not be overly formal.
If their reply indicates they are not interested, do not reply — return opted_out: true.
Output ONLY valid JSON.

USER:
Lead Name: {{full_name}}
Their reply: {{lead_reply_text}}
Our prior message: {{our_last_message_body}}
Full conversation context: {{conversation_history}}
Calendly link: {{calendly_url}}
Channel: {{channel}}  (linkedin | email)
Sender name: {{sender_name}}

Output:
{
  "opted_out": false,
  "reply_body": "<natural reply. Acknowledges their message. Answers questions. Offers Calendly link naturally. Signed with sender name.>",
  "reply_subject": "<only if channel=email: keep as RE: of prior subject line>"
}
```

---

*LeadFlow AI — Technical PRD v1.1 | Confidential & Internal Use Only*
*Last revised: May 2026*
*AIRIZZ CONSULTANCY SERVICES PRIVATE LIMITED*
