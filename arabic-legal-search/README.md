# ⚖️ Arabic Legal Search Platform — المنصة القانونية

Production-ready intelligent legal search engine for Egyptian law.
**Database:** Google Sheets only — no Firebase, no MongoDB, no SQL.

---

## 🔗 Connected Google Sheet

**URL:** https://docs.google.com/spreadsheets/d/16Y68mr-ZaMHXWFYZxdb3WnUdmON2X8Sc8ykmE2GqdZQ/edit

**Sheet ID (pre-filled in `.env.example`):**
```
16Y68mr-ZaMHXWFYZxdb3WnUdmON2X8Sc8ykmE2GqdZQ
```

The app reads this sheet on **every search request** — no cache, no stale data.
The administrator only needs to edit the sheet; changes are live instantly.

---

## ✨ Features

| Feature | Detail |
|---|---|
| 🧠 Semantic Search | Gemini `text-embedding-004` understands meaning, not keywords |
| ⚖️ Legal Answer | Exact text from Google Sheets — never modified |
| 🇪🇬 AI Explanation | Gemini Flash rewrites answer in clear Egyptian Arabic |
| 🌙 Dark / Light Mode | Full theme support with smooth transitions |
| 📱 RTL & Responsive | Beautiful on mobile and desktop |
| ⚡ Next.js 14 | App Router, Server Components, 30-second API timeout |

---

## 📊 Google Sheet Structure

Row 1 must be the header row. Data starts at Row 2.

| Column A | Column B | Column C | Column D |
|---|---|---|---|
| ID | Question | Keywords | LegalAnswer |
| 1 | ما ميعاد الطعن بالاستئناف؟ | طعن، استئناف، ميعاد | وفقاً للمادة 227... |

---

## 🔐 Environment Variables

| Variable | Description |
|---|---|
| `GOOGLE_SHEET_ID` | Pre-filled: `16Y68mr-ZaMHXWFYZxdb3WnUdmON2X8Sc8ykmE2GqdZQ` |
| `GOOGLE_SERVICE_ACCOUNT_EMAIL` | From your service account JSON → `client_email` |
| `GOOGLE_PRIVATE_KEY` | From your service account JSON → `private_key` |
| `GEMINI_API_KEY` | From https://aistudio.google.com/app/apikey |

---

## 🚀 Quick Start

```bash
# 1. Install
npm install

# 2. Configure
cp .env.example .env.local
# Fill in GOOGLE_SERVICE_ACCOUNT_EMAIL, GOOGLE_PRIVATE_KEY, GEMINI_API_KEY

# 3. Run
npm run dev
# Open http://localhost:3000
```

---

## 🏗️ How It Works

```
User types a question in Arabic
        ↓
Gemini text-embedding-004
(converts the question to a semantic vector)
        ↓
Google Sheets API
(fetches all rows from the live sheet)
        ↓
Cosine similarity
(finds the closest matching Question+Keywords)
        ↓
Gemini Flash
(rewrites the LegalAnswer in Egyptian Arabic)
        ↓
Two cards displayed:
  ⚖️ Card 1 — الإجابة القانونية (exact text, never modified)
  🧠 Card 2 — الشرح بالمصري (AI explanation)
```

---

## 📁 Project Structure

```
src/
├── app/
│   ├── api/search/route.ts   ← Main API endpoint
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx              ← Home page
├── components/
│   ├── ErrorMessage.tsx
│   ├── Footer.tsx
│   ├── Header.tsx
│   ├── LoadingAnimation.tsx
│   ├── ResultCards.tsx       ← The two result cards
│   ├── SearchBar.tsx
│   ├── ThemeProvider.tsx
│   └── ThemeToggle.tsx
├── lib/
│   ├── gemini.ts             ← Embeddings + AI explanation
│   └── sheets.ts             ← Google Sheets reader
└── types/index.ts
```

---

## 📖 Full Deployment Guide

See **[DEPLOYMENT.md](./DEPLOYMENT.md)** for the complete 13-step guide covering:
- Getting a Gemini API key
- Creating a Google Service Account
- Sharing the sheet
- Where exactly to paste each credential locally and in Vercel
- Common errors and fixes

---

## 🛡️ Security

- All credentials are in environment variables — zero hardcoding
- Service account has **read-only** access
- API routes validate and sanitize all input
- `.gitignore` excludes `.env.local` and `.env`
