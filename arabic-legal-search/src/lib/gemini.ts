import { GoogleGenerativeAI } from "@google/generative-ai";
import type { LegalRow, SearchResult } from "@/types";

function getGeminiClient(): GoogleGenerativeAI {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error(
      "[Gemini] GEMINI_API_KEY is not set. " +
        "Get a free key at https://aistudio.google.com/app/apikey and " +
        "add it to .env.local or Vercel Environment Variables."
    );
  }

  return new GoogleGenerativeAI(apiKey);
}

/**
 * Generate a semantic embedding vector for the given text.
 * Uses Gemini text-embedding-004 model.
 */
export async function generateEmbedding(text: string): Promise<number[]> {
  const genAI = getGeminiClient();

  const model = genAI.getGenerativeModel({
    model: "text-embedding-004",
  });

  const result = await model.embedContent(text);

  return result.embedding.values;
}
/**
 * Dot-product cosine similarity between two equal-length vectors.
 * Returns a value in [-1, 1]; higher = more similar.
 */
function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length || a.length === 0) return 0;

  let dot = 0, normA = 0, normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }

  const denom = Math.sqrt(normA) * Math.sqrt(normB);
  return denom === 0 ? 0 : dot / denom;
}

/**
 * Semantic search over all sheet rows.
 *
 * Steps:
 *  1. Embed the user's query.
 *  2. Embed "question + keywords" for every row in parallel.
 *  3. Return the row with the highest cosine similarity.
 *
 * Data is always freshly fetched from Google Sheets by the caller —
 * this function never caches rows.
 */
export async function semanticSearch(
  userQuery: string,
  rows: LegalRow[]
): Promise<SearchResult | null> {
  if (rows.length === 0) return null;

  // Embed query and all rows concurrently for speed
  const [queryEmbedding, ...rowEmbeddings] = await Promise.all([
    generateEmbedding(userQuery),
    ...rows.map((row) =>
      generateEmbedding(`${row.question} ${row.keywords}`.trim())
    ),
  ]);

  let bestScore = -Infinity;
  let bestIndex = -1;

  for (let i = 0; i < rowEmbeddings.length; i++) {
    const score = cosineSimilarity(queryEmbedding, rowEmbeddings[i]);
    if (score > bestScore) {
      bestScore = score;
      bestIndex = i;
    }
  }

  if (bestIndex === -1) return null;

  return {
    row: rows[bestIndex],
    score: bestScore,
  };
}

/**
 * Ask Gemini Flash to rewrite the legal answer in clear Egyptian Arabic.
 *
 * Rules enforced in the system prompt:
 *  - Never change legal meaning
 *  - Never invent information
 *  - No personal legal opinions
 *  - Explain difficult legal terms
 *  - White Arabic only (no Franco, no slang)
 *  - Respectful Egyptian dialect
 */
export async function generateAIExplanation(legalAnswer: string): Promise<string> {
  const genAI = getGeminiClient();

  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    generationConfig: {
      temperature: 0.3,
      maxOutputTokens: 1500,
    },
  });

  const chat = model.startChat({
    history: [
      {
        role: "user",
        parts: [
          {
            text: `أنت مساعد قانوني متخصص في شرح النصوص القانونية المصرية للمواطنين العاديين.

مهمتك الوحيدة:
- اقرأ النص القانوني الذي سيُعطى لك بعناية شديدة.
- أعِد كتابته بالعربية المصرية الرسمية المفهومة للمواطن العادي.
- اشرح كل مصطلح قانوني صعب بلغة بسيطة بين قوسين.

القواعد الصارمة — لا استثناء:
1. لا تغير المعنى القانوني أبداً ولو كلمة واحدة.
2. لا تخترع أي معلومة لم تُذكر في النص الأصلي.
3. لا تُضف رأياً قانونياً شخصياً.
4. احتفظ بجميع الأرقام والمواعيد ونصوص المواد القانونية كما هي تماماً.
5. استخدم العربية الفصحى المصرية المبسطة حصراً.
6. ممنوع الفرانكو، ممنوع العامية الغير رسمية.
7. الأسلوب محترم ومهذب دائماً.`,
          },
        ],
      },
      {
        role: "model",
        parts: [
          {
            text: "حسناً، أنا جاهز. أرسل إليّ النص القانوني وسأشرحه بوضوح تام مع الحفاظ الكامل على معناه القانوني الدقيق.",
          },
        ],
      },
    ],
  });

  const result = await chat.sendMessage(
    `النص القانوني المطلوب شرحه:\n\n${legalAnswer}`
  );

  return result.response.text().trim();
}
