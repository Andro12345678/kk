import { NextRequest, NextResponse } from "next/server";
import { fetchSheetData } from "@/lib/sheets";
import { semanticSearch, generateAIExplanation } from "@/lib/gemini";
import type { SearchResponse } from "@/types";

/**
 * Minimum cosine similarity (0–1) required to accept a match.
 * Below this threshold we tell the user no relevant answer was found.
 */
const SIMILARITY_THRESHOLD = 0.4;

export async function POST(request: NextRequest) {
  try {
    // ── 1. Parse & validate request body ──────────────────────────────
    const body = await request.json().catch(() => ({}));
    const { query } = body as { query?: unknown };

    if (!query || typeof query !== "string") {
      return NextResponse.json<SearchResponse>(
        { success: false, error: "الرجاء إدخال سؤال للبحث." },
        { status: 400 }
      );
    }

    const trimmed = query.trim();

    if (trimmed.length < 2) {
      return NextResponse.json<SearchResponse>(
        { success: false, error: "الرجاء إدخال سؤال أطول للحصول على نتائج دقيقة." },
        { status: 400 }
      );
    }

    if (trimmed.length > 500) {
      return NextResponse.json<SearchResponse>(
        { success: false, error: "السؤال طويل جداً. الرجاء اختصاره في 500 حرف أو أقل." },
        { status: 400 }
      );
    }

    // ── 2. Fetch latest data from Google Sheet ─────────────────────────
    // Every request fetches fresh data so admin edits are instant.
    const rows = await fetchSheetData();

    if (rows.length === 0) {
      return NextResponse.json<SearchResponse>(
        {
          success: false,
          error:
            "لا توجد بيانات في قاعدة المعرفة القانونية حالياً. " +
            "تأكد أن جدول البيانات يحتوي على صفوف تحت صف العناوين.",
        },
        { status: 404 }
      );
    }

    // ── 3. Semantic search via Gemini Embeddings ───────────────────────
    const match = await semanticSearch(trimmed, rows);

    if (!match) {
      return NextResponse.json<SearchResponse>(
        {
          success: false,
          error: "تعذّر إجراء البحث. حاول مرة أخرى.",
        },
        { status: 500 }
      );
    }

    if (match.score < SIMILARITY_THRESHOLD) {
      return NextResponse.json<SearchResponse>(
        {
          success: false,
          error:
            "لم يتم العثور على إجابة قانونية مطابقة لسؤالك. " +
            "حاول إعادة صياغة السؤال أو استخدم مصطلحات قانونية محددة.",
        },
        { status: 404 }
      );
    }

    // ── 4. Generate AI explanation in Egyptian Arabic ──────────────────
    const aiExplanation = await generateAIExplanation(match.row.legalAnswer);

    // ── 5. Return both cards ───────────────────────────────────────────
    return NextResponse.json<SearchResponse>({
      success: true,
      result: {
        legalAnswer: match.row.legalAnswer,      // exact text from sheet — never modified
        aiExplanation,                            // Gemini Flash rewrite
        matchedQuestion: match.row.question,
        score: Math.round(match.score * 100),
      },
    });

  } catch (err: unknown) {
    console.error("[/api/search] Unhandled error:", err);

    const msg = err instanceof Error ? err.message : String(err);

    // ── Known Google / Gemini error patterns ──────────────────────────
    if (msg.includes("PERMISSION_DENIED")) {
      return NextResponse.json<SearchResponse>(
        {
          success: false,
          error:
            "خطأ في الصلاحيات: تأكد من مشاركة جدول البيانات مع حساب الخدمة (Service Account).",
        },
        { status: 403 }
      );
    }

    if (msg.includes("RESOURCE_EXHAUSTED") || msg.includes("429")) {
      return NextResponse.json<SearchResponse>(
        {
          success: false,
          error: "تجاوزت حد الطلبات المسموح به. انتظر دقيقة ثم حاول مجدداً.",
        },
        { status: 429 }
      );
    }

    if (msg.includes("GOOGLE_SHEET_ID") || msg.includes("GOOGLE_SERVICE_ACCOUNT") || msg.includes("GEMINI_API_KEY")) {
      return NextResponse.json<SearchResponse>(
        {
          success: false,
          error:
            "خطأ في الإعدادات: متغيرات البيئة غير مكتملة. راجع ملف .env.local أو إعدادات Vercel.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json<SearchResponse>(
      {
        success: false,
        error: "حدث خطأ غير متوقع. الرجاء المحاولة مرة أخرى.",
      },
      { status: 500 }
    );
  }
}
