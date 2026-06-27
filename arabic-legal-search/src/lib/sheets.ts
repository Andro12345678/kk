import { google } from "googleapis";
import type { LegalRow } from "@/types";

/**
 * The Google Sheet ID is read exclusively from the environment variable.
 * Sheet URL: https://docs.google.com/spreadsheets/d/16Y68mr-ZaMHXWFYZxdb3WnUdmON2X8Sc8ykmE2GqdZQ/edit
 * The ID (16Y68mr-ZaMHXWFYZxdb3WnUdmON2X8Sc8ykmE2GqdZQ) must be set in
 * GOOGLE_SHEET_ID inside .env.local (local) or Vercel Environment Variables (production).
 *
 * Columns expected in Sheet1 (with header row):
 *   A: ID
 *   B: Question
 *   C: Keywords
 *   D: LegalAnswer
 */

function buildGoogleAuth() {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const rawKey = process.env.GOOGLE_PRIVATE_KEY;

  if (!email) {
    throw new Error(
      "[Sheets] GOOGLE_SERVICE_ACCOUNT_EMAIL is not set. " +
        "Add it to .env.local or Vercel Environment Variables."
    );
  }

  if (!rawKey) {
    throw new Error(
      "[Sheets] GOOGLE_PRIVATE_KEY is not set. " +
        "Add it to .env.local or Vercel Environment Variables."
    );
  }

  // Vercel stores the key with literal \n — normalise both cases.
  const privateKey = rawKey.replace(/\\n/g, "\n");

  return new google.auth.GoogleAuth({
    credentials: {
      client_email: email,
      private_key: privateKey,
    },
    scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
  });
}

/**
 * Fetch every data row from the Google Sheet.
 * Called on every search request so the admin's latest edits
 * are reflected immediately — no cache, no stale data.
 */
export async function fetchSheetData(): Promise<LegalRow[]> {
  const sheetId = process.env.GOOGLE_SHEET_ID;

  if (!sheetId) {
    throw new Error(
      "[Sheets] GOOGLE_SHEET_ID is not set. " +
        "Add it to .env.local or Vercel Environment Variables. " +
        "Value should be: 16Y68mr-ZaMHXWFYZxdb3WnUdmON2X8Sc8ykmE2GqdZQ"
    );
  }

  const auth = buildGoogleAuth();
  const sheets = google.sheets({ version: "v4", auth });

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: sheetId,   // ← always from env var, never hardcoded
    range: "A:D",     // columns A(ID) B(Question) C(Keywords) D(LegalAnswer)
  });

  const rows = response.data.values;

  if (!rows || rows.length < 2) {
    // No data rows (only header or completely empty sheet)
    return [];
  }

  const data: LegalRow[] = [];

  // Row 0 is the header — skip it and parse from row 1 onward
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];

    // Guard: skip rows that are missing required fields
    if (!row || row.length < 4) continue;

    const [id, question, keywords, legalAnswer] = row;

    if (!id || !question || !legalAnswer) continue;

    data.push({
      id: String(id).trim(),
      question: String(question).trim(),
      keywords: String(keywords ?? "").trim(),
      legalAnswer: String(legalAnswer).trim(),
    });
  }

  return data;
}
