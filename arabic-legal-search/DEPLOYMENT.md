# 🚀 DEPLOYMENT GUIDE — Arabic Legal Search Platform

**Total setup time: ~25 minutes.**

This guide shows exactly where to paste each credential, step by step.

---

## OVERVIEW — 4 Credentials You Need

| Variable | What It Is | Where You Get It |
|---|---|---|
| `GOOGLE_SHEET_ID` | Already set → `16Y68mr-ZaMHXWFYZxdb3WnUdmON2X8Sc8ykmE2GqdZQ` | Pre-filled from your sheet URL |
| `GOOGLE_SERVICE_ACCOUNT_EMAIL` | Service account email | Google Cloud Console |
| `GOOGLE_PRIVATE_KEY` | Service account private key | Google Cloud Console |
| `GEMINI_API_KEY` | Gemini AI API key | Google AI Studio |

---

## STEP 1 — Get Your Gemini API Key

1. Open **https://aistudio.google.com/app/apikey**
2. Sign in with your Google account
3. Click **"Create API Key"**
4. Choose an existing project or create a new one
5. Click **"Create API key in existing project"**
6. You will see a key like: `AIzaSyABC123...`
7. **Copy it now** — you will paste it as `GEMINI_API_KEY`

---

## STEP 2 — Create a Google Cloud Project

*(Skip if you already have a project)*

1. Open **https://console.cloud.google.com/**
2. Click the project dropdown at the top of the page
3. Click **"New Project"**
4. Enter any name (e.g., `legal-platform`) → Click **"Create"**
5. Select the new project from the dropdown

---

## STEP 3 — Enable the Google Sheets API

1. Open **https://console.cloud.google.com/apis/library**
2. Make sure your project is selected
3. Search for: **Google Sheets API**
4. Click on the result → Click **"Enable"**
5. Wait 10 seconds until it says "API enabled"

---

## STEP 4 — Create a Service Account

1. Open **https://console.cloud.google.com/iam-admin/serviceaccounts**
2. Make sure your project is selected
3. Click **"+ Create Service Account"**
4. Fill in:
   - **Name:** `sheet-reader`
   - **ID:** auto-filled
   - **Description:** Reads the legal knowledge sheet
5. Click **"Create and Continue"**
6. Skip the "Grant access" step → Click **"Continue"**
7. Click **"Done"**

---

## STEP 5 — Download the Private Key JSON

1. On the Service Accounts list, click the account you just created
2. Click the **"Keys"** tab
3. Click **"Add Key"** → **"Create new key"**
4. Choose **JSON** → Click **"Create"**
5. A file downloads automatically (e.g., `legal-platform-abc123.json`)
6. Open that file in a text editor — it looks like this:

```json
{
  "type": "service_account",
  "project_id": "legal-platform",
  "client_email": "sheet-reader@legal-platform.iam.gserviceaccount.com",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEv...(long key)...\n-----END PRIVATE KEY-----\n",
  ...
}
```

From this file, copy two values:

| Field in JSON | Becomes this env variable |
|---|---|
| `client_email` | `GOOGLE_SERVICE_ACCOUNT_EMAIL` |
| `private_key` | `GOOGLE_PRIVATE_KEY` |

---

## STEP 6 — Share Your Google Sheet with the Service Account

Your sheet is:
**https://docs.google.com/spreadsheets/d/16Y68mr-ZaMHXWFYZxdb3WnUdmON2X8Sc8ykmE2GqdZQ/edit**

1. Open that sheet
2. Click **"Share"** (top-right green button)
3. In the "Add people and groups" box, paste your **`client_email`**
   - Example: `sheet-reader@legal-platform.iam.gserviceaccount.com`
4. Set the role to **"Viewer"**
5. **Uncheck "Notify people"** (service accounts have no inbox)
6. Click **"Share"**

✅ The app can now read your sheet.

---

## STEP 7 — Set Up Environment Variables Locally

1. In your project folder, run:
   ```bash
   cp .env.example .env.local
   ```

2. Open `.env.local` and fill in **exactly** like this:

```env
# Pre-filled — do not change
GOOGLE_SHEET_ID=16Y68mr-ZaMHXWFYZxdb3WnUdmON2X8Sc8ykmE2GqdZQ

# Paste from the JSON file → "client_email"
GOOGLE_SERVICE_ACCOUNT_EMAIL=sheet-reader@legal-platform.iam.gserviceaccount.com

# Paste from the JSON file → "private_key"
# Keep the double quotes. The \n characters must stay as \n (not real newlines)
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvAIBADA...\n-----END PRIVATE KEY-----\n"

# Paste your Gemini key from Step 1
GEMINI_API_KEY=AIzaSyABC123XYZ...
```

3. Test it:
   ```bash
   npm install
   npm run dev
   ```
   Open `http://localhost:3000` and type any legal question.

---

## STEP 8 — Upload to GitHub

```bash
# From inside the project folder:
git init
git add .
git commit -m "feat: Arabic Legal Search Platform"
```

Then:
1. Open **https://github.com/new**
2. Repository name: `arabic-legal-search`
3. Set to **Private** (your env vars are not in the code, but still safer)
4. Do NOT check "Add a README" (you already have one)
5. Click **"Create repository"**
6. Run these commands (replace YOUR_USERNAME):

```bash
git remote add origin https://github.com/YOUR_USERNAME/arabic-legal-search.git
git branch -M main
git push -u origin main
```

---

## STEP 9 — Deploy to Vercel

1. Open **https://vercel.com/new**
2. Click **"Continue with GitHub"** and sign in
3. Find your `arabic-legal-search` repo → Click **"Import"**
4. Vercel auto-detects Next.js — do not change the build settings
5. **Before clicking Deploy**, expand **"Environment Variables"** at the bottom

---

## STEP 10 — Paste Environment Variables in Vercel

In the Vercel import screen, add these **4 variables** one by one:

### Variable 1
- **Name:** `GOOGLE_SHEET_ID`
- **Value:** `16Y68mr-ZaMHXWFYZxdb3WnUdmON2X8Sc8ykmE2GqdZQ`

### Variable 2
- **Name:** `GOOGLE_SERVICE_ACCOUNT_EMAIL`
- **Value:** paste your `client_email` from the JSON file
- **Example:** `sheet-reader@legal-platform.iam.gserviceaccount.com`

### Variable 3
- **Name:** `GOOGLE_PRIVATE_KEY`
- **Value:** paste the entire `private_key` from the JSON file
- Include everything from `-----BEGIN PRIVATE KEY-----` to `-----END PRIVATE KEY-----`
- Vercel handles multiline values correctly in its UI

### Variable 4
- **Name:** `GEMINI_API_KEY`
- **Value:** paste your key from Step 1
- **Example:** `AIzaSyABC123XYZ...`

After adding all 4, click **"Deploy"**.

---

## STEP 11 — After Deployment

Once deployed, Vercel gives you a URL like:
`https://arabic-legal-search-xyz.vercel.app`

Test it by typing a legal question in Arabic. You should see:
- **Card 1:** الإجابة القانونية (exact text from your sheet)
- **Card 2:** الشرح بالمصري (AI explanation in Egyptian Arabic)

---

## STEP 12 — Updating Environment Variables Later

If you need to change a variable after deployment:

1. Go to **https://vercel.com/dashboard**
2. Click your project
3. Go to **Settings → Environment Variables**
4. Click the **edit (pencil)** icon next to the variable
5. Update the value → Click **"Save"**
6. Go to **Deployments** tab → Click the three dots on the latest → **"Redeploy"**

---

## STEP 13 — Updating Your Google Sheet

The app reads **live data on every search**. No redeploy needed.

To update your legal database:
1. Open **https://docs.google.com/spreadsheets/d/16Y68mr-ZaMHXWFYZxdb3WnUdmON2X8Sc8ykmE2GqdZQ/edit**
2. Add, edit, or delete rows
3. Changes are live instantly on the next user search

**Sheet structure reminder:**

| A (ID) | B (Question) | C (Keywords) | D (LegalAnswer) |
|---|---|---|---|
| 1 | ما ميعاد الطعن؟ | طعن، استئناف، ميعاد | وفقاً للمادة 227... |
| 2 | كيف أتظلم؟ | تظلم، قرار إداري | يحق للمواطن... |

---

## 🔴 Common Errors and Fixes

### ❌ "خطأ في الصلاحيات" (PERMISSION_DENIED)
**Cause:** Sheet not shared with the service account.
**Fix:** Go to Step 6 — share the sheet with your `client_email`.

---

### ❌ "متغيرات البيئة غير مكتملة"
**Cause:** One or more env variables are missing.
**Fix:**
- Local: check `.env.local` has all 4 variables
- Vercel: check Settings → Environment Variables has all 4 variables

---

### ❌ "Invalid private key" or JWT error
**Cause:** `GOOGLE_PRIVATE_KEY` format issue.
**Fix:**
- The key must start with `-----BEGIN PRIVATE KEY-----`
- In `.env.local` it must be in double quotes with `\n` (not real newlines)
- In Vercel UI you can paste with real newlines — Vercel handles it

---

### ❌ "لا توجد بيانات" (empty sheet error)
**Cause:** Sheet has no data rows, or column names are different.
**Fix:**
- Row 1 must be exactly: `ID | Question | Keywords | LegalAnswer`
- There must be at least one data row starting at Row 2

---

### ❌ "تجاوزت حد الطلبات" (429 / Rate limit)
**Cause:** Gemini free tier limit reached.
**Fix:** Wait 1 minute. Or upgrade at https://aistudio.google.com.

---

### ❌ Vercel build fails
**Cause:** Missing `node_modules` or TypeScript error.
**Fix:**
```bash
rm -rf node_modules package-lock.json
npm install
npm run build   # must succeed locally before pushing
```

---

### ❌ "لم يتم العثور على إجابة" for all questions
**Cause:** Similarity score below threshold, or embeddings mismatch.
**Fix:**
- Make sure Column B has real Arabic questions
- Add more synonyms to Column C (Keywords)
- Lower `SIMILARITY_THRESHOLD` in `src/app/api/search/route.ts` from `0.4` to `0.3`

---

*Follow all steps in order and your platform will be live and fully connected to your Google Sheet within 25 minutes.*
