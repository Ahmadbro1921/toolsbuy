# AI Hub — Production-Oriented AI Tools Directory Platform

AI Hub is a modern, full-stack artificial intelligence directory platform built with **Next.js App Router (React 18, TypeScript)**, **Tailwind CSS**, **Supabase PostgreSQL & Supabase Auth**, modular **AI provider adapters (Google Gemini / OpenAI)**, and **transactional email notifications (Resend)**.

Designed with a **free-first deployment architecture**, AI Hub can be completely hosted and operated on free tiers without any mandatory paid services.

---

## Architecture Overview

```
                    ┌─────────────────────────┐
                    │    Next.js App Router   │
                    │  (Server Actions + SSR) │
                    └───────────┬─────────────┘
                                │
        ┌───────────────────────┼───────────────────────┐
        ▼                       ▼                       ▼
┌───────────────┐       ┌───────────────┐       ┌───────────────┐
│ Supabase Auth │       │ Supabase Post-│       │ Modular AI    │
│  & RLS Policy │       │  greSQL (SQL) │       │ Provider Engine│
└───────────────┘       └───────────────┘       └───────┬───────┘
                                                        │
                                ┌───────────────────────┴───────┐
                                ▼                               ▼
                         Google Gemini                     OpenAI API
```

### Key Architectural Highlights
1. **Defense-in-Depth Security**: Row Level Security (RLS) enabled on all 10 PostgreSQL tables, complemented by server-side JWT verification and role checks (`requireAdmin()`).
2. **SSRF Protection Engine**: Pre-flight validation on all submitted URLs blocking RFC1918 private IPv4 CIDRs, loopbacks (`127.0.0.1`), IPv6 unique local, and cloud metadata endpoints (`169.254.169.254`).
3. **Zero-Config Development Fallback**: Works immediately out of the box with realistic seed tools, categories, and audit logs. Automatically switches to live Supabase PostgreSQL when `.env.local` contains Supabase credentials.
4. **Modular AI Engine**: Pluggable provider adapter (`GeminiProvider`, `OpenAIProvider`, `MockAIProvider`) for metadata drafting, SEO suggestions, and feature summarization with strict review-before-publish workflows.
5. **Transactional Email Engine**: Pluggable email adapter (`ResendAdapter`, `MockEmailAdapter`) supporting welcome notifications, admin activation requests, and account suspensions.

---

## 1. Quick Start (Local Development)

### Prerequisites
- Node.js 18+ or 20+ (Node 24 LTS verified)
- npm 10+

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Configure Environment
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

### Step 3: Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 2. Default Demo & Evaluation Accounts

During local evaluation or testing, you can log in with:

| Role | Email | Password | Access Level |
|---|---|---|---|
| **Administrator** | `admin@aihub.local` | `AdminPassword2026!` | Full Admin Panel (`/admin`), Tool CRUD, User Activations, Site Settings |
| **Standard User** | `user@aihub.local` | `UserPassword2026!` | Dashboard (`/dashboard`), Favorites, Outbound Click History |
| **Pending User** | `pending@aihub.local` | `PendingPassword2026!` | Read-only mode awaiting administrator activation approval |

*Tip: A floating Quick Role Switcher is visible at the bottom-right corner during development to test different role states instantly.*

---

## 3. Database Schema & Supabase Setup (Free Tier)

Supabase offers a free PostgreSQL database tier with up to 500MB storage and 50,000 monthly active users.

### Step 1: Create a Free Supabase Project
1. Navigate to [https://supabase.com](https://supabase.com) and create a free project.
2. Note your **Project URL**, **Anon Public Key**, and **Service Role Key** under **Project Settings > API**.

### Step 2: Apply Database Migrations
1. Open the Supabase **SQL Editor**.
2. Paste and execute the contents of `supabase/migrations/20241023_init.sql`.
   - This creates all 10 core tables:
     - `profiles`
     - `user_roles`
     - `categories`
     - `tools`
     - `favorites`
     - `tool_usage_events`
     - `activation_requests`
     - `site_settings`
     - `integration_status`
     - `audit_logs`
   - Configures PostgreSQL RLS policies, performance indexes, and the `on_auth_user_created` trigger.
3. Paste and execute `supabase/seed.sql` to populate initial categories and verified tools.

### Step 3: Configure `.env.local`
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
```

---

## 4. Secure Initial Administrator Provisioning

To prevent unauthorized privilege escalation, administrators **cannot** be promoted from the signup form or client-side code.

Run the secure CLI provisioning script on your server or terminal:
```bash
node scripts/setup-admin.js admin@yourdomain.com StrongAdminPass123!
```

This script:
1. Provisions the user via Supabase Auth Admin API using `SUPABASE_SERVICE_ROLE_KEY`.
2. Inserts/upserts an entry with `role = 'admin'` into `public.user_roles`.
3. Records an immutable audit log entry in `public.audit_logs`.

---

## 5. AI Integration Configuration (Free / Low Cost)

AI Hub includes modular AI generation to suggest tool descriptions, category tags, and SEO metadata.

### Google Gemini (Recommended Free Tier)
- Google AI Studio provides 15 free requests per minute for `gemini-1.5-flash`.
- Obtain an API key from [https://aistudio.google.com](https://aistudio.google.com).
- Add to `.env.local`:
  ```env
  AI_PROVIDER=gemini
  AI_API_KEY=your_gemini_api_key_here
  AI_MODEL_NAME=gemini-1.5-flash
  ```

### OpenAI API
- If you prefer OpenAI, set:
  ```env
  AI_PROVIDER=openai
  AI_API_KEY=sk-your-openai-api-key
  AI_MODEL_NAME=gpt-4o-mini
  ```

*Note: If no API key is provided, the platform operates normally without errors and displays an honest setup indicator in the admin panel.*

---

## 6. Transactional Email Configuration (Resend Free Tier)

Resend provides 3,000 free emails per month and 100 emails/day on their free tier.

1. Sign up at [https://resend.com](https://resend.com) and obtain an API key.
2. In `.env.local`, configure:
   ```env
   EMAIL_PROVIDER=resend
   RESEND_API_KEY=re_your_api_key_here
   EMAIL_FROM_ADDRESS="AI Hub <notifications@yourdomain.com>"
   ADMIN_NOTIFICATION_EMAIL="admin@yourdomain.com"
   ```
3. In local development or without an API key, set `EMAIL_PROVIDER=mock`. Notifications will be formatted and logged safely to the terminal console.

---

## 7. Account Activation Workflow

AI Hub supports both instant activation and manual review policies:

1. **Auto Activation (Default)**: Users register, receive a welcome email, and immediately access their personal bookmarks and click history.
2. **Manual Approval Mode**: Can be toggled on in `/admin/settings`.
   - When enabled, new users are placed in `pending` status.
   - An activation request is logged in `activation_requests`.
   - The administrator is emailed an alert notification.
   - The administrator reviews, approves, or rejects the request in `/admin/users`.
   - On approval, the user's status updates to `active` and an approval email is dispatched.

---

## 8. Free-First Deployment Guide (Vercel)

1. **Push to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "feat: AI Hub production directory platform"
   git remote add origin https://github.com/yourusername/ai-hub.git
   git push -u origin main
   ```
2. **Deploy on Vercel**:
   - Go to [https://vercel.com/new](https://vercel.com/new) and import your GitHub repository.
   - Framework preset: **Next.js**.
   - Add environment variables from `.env.local` (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `AI_API_KEY`, etc.).
   - Click **Deploy**.
3. **Run Initial Admin Script**:
   Once deployed, run `node scripts/setup-admin.js` with your production environment variables to initialize the production admin.

---

## 9. Automated Testing

Run the included automated test suite:
```bash
npm test
```

This verifies:
- SSRF protections & RFC1918 private IP blocking
- Zod schema input validations
- Sliding-window rate limiter under load
- AI provider adapters & unconfigured state reporting
- Transactional email delivery handling
- Data store queries, mutations, favorites, and click tracking

---

## 10. Troubleshooting Guide

| Issue | Cause | Solution |
|---|---|---|
| `Cannot connect to Supabase` | Placeholder credentials in `.env.local` | Update `NEXT_PUBLIC_SUPABASE_URL` and keys in `.env.local`, or run in local mock store mode. |
| `Permission denied on /admin` | Current user does not have `admin` role in `user_roles` | Run `npm run setup:admin` to grant administrative privileges to your user ID. |
| `SSRF Error on Tool Submission` | Target URL resolves to a loopback or private network | Ensure the submitted tool website is a publicly accessible domain with valid HTTP/HTTPS scheme. |
| `Rate limit exceeded` | Too many requests in 60s sliding window | Wait 60 seconds for the sliding rate limiter window to reset. |

---

## License
MIT License. Built for high performance, accessibility, and transparency.
