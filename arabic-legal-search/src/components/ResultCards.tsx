"use client";

import { useState } from "react";
import { Scale, Brain, Copy, Check, ChevronDown, ChevronUp } from "lucide-react";
import type { SearchResponse } from "@/types";

interface ResultCardsProps {
  result: NonNullable<SearchResponse["result"]>;
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for browsers without clipboard API
      const textarea = document.createElement("textarea");
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg
        border border-[var(--border-color)] text-[var(--text-muted)]
        hover:border-[var(--gold-primary)] hover:text-[var(--gold-primary)]
        transition-all duration-200 active:scale-95"
      aria-label="نسخ النص"
    >
      {copied ? (
        <>
          <Check className="w-3 h-3" />
          <span>تم النسخ</span>
        </>
      ) : (
        <>
          <Copy className="w-3 h-3" />
          <span>نسخ</span>
        </>
      )}
    </button>
  );
}

function ScoreBadge({ score }: { score: number }) {
  const getScoreClass = () => {
    if (score >= 80) return "score-high";
    if (score >= 60) return "score-medium";
    return "score-low";
  };

  const getScoreLabel = () => {
    if (score >= 80) return "تطابق ممتاز";
    if (score >= 60) return "تطابق جيد";
    return "تطابق جزئي";
  };

  return (
    <span
      className={`inline-flex items-center gap-1 text-xs font-medium
        px-2.5 py-1 rounded-full ${getScoreClass()}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {getScoreLabel()} ({score}%)
    </span>
  );
}

function ExpandableText({
  text,
  maxLines = 8,
}: {
  text: string;
  maxLines?: number;
}) {
  const [expanded, setExpanded] = useState(false);
  const lines = text.split("\n");
  const isLong = lines.length > maxLines || text.length > 600;

  if (!isLong) {
    return (
      <p className="legal-text text-[var(--text-primary)] leading-loose whitespace-pre-wrap">
        {text}
      </p>
    );
  }

  return (
    <div>
      <div
        className={`relative overflow-hidden transition-all duration-500 ${
          expanded ? "max-h-none" : "max-h-48"
        }`}
      >
        <p className="legal-text text-[var(--text-primary)] leading-loose whitespace-pre-wrap">
          {text}
        </p>
        {!expanded && (
          <div
            className="absolute bottom-0 left-0 right-0 h-20
            bg-gradient-to-t from-[var(--bg-card)] to-transparent"
          />
        )}
      </div>
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-1.5 mt-3 text-sm font-medium
          text-[var(--gold-primary)] hover:text-[var(--gold-dark)]
          transition-colors duration-200"
      >
        {expanded ? (
          <>
            <ChevronUp className="w-4 h-4" />
            <span>عرض أقل</span>
          </>
        ) : (
          <>
            <ChevronDown className="w-4 h-4" />
            <span>عرض المزيد</span>
          </>
        )}
      </button>
    </div>
  );
}

export function ResultCards({ result }: ResultCardsProps) {
  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 stagger-children">
      {/* Match info banner */}
      <div
        className="flex items-center justify-between flex-wrap gap-3
        px-5 py-3 rounded-xl bg-[var(--bg-secondary)]
        border border-[var(--border-color)]"
      >
        <div className="flex items-center gap-2 text-sm text-[var(--text-muted)]">
          <span className="ornament">❋</span>
          <span>
            أقرب سؤال مطابق:{" "}
            <strong className="text-[var(--text-secondary)]">
              {result.matchedQuestion}
            </strong>
          </span>
        </div>
        <ScoreBadge score={result.score} />
      </div>

      {/* Card 1 - Legal Answer */}
      <div
        className="rounded-2xl border border-[var(--border-color)]
        bg-[var(--bg-card)] overflow-hidden
        shadow-lg card-hover animate-slide-up"
        style={{ animationDelay: "0.1s" }}
      >
        {/* Card Header */}
        <div
          className="flex items-center justify-between px-6 py-4
          border-b border-[var(--border-color)]
          bg-gradient-to-l from-[var(--bg-secondary)] to-transparent"
        >
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center
              bg-gradient-to-br from-[var(--gold-primary)] to-[var(--gold-dark)]
              shadow-md"
            >
              <Scale className="w-5 h-5 text-white" strokeWidth={2} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[var(--text-primary)] font-display">
                الإجابة القانونية
              </h2>
              <p className="text-xs text-[var(--text-muted)]">
                النص القانوني الرسمي
              </p>
            </div>
          </div>
          <CopyButton text={result.legalAnswer} />
        </div>

        {/* Card Content */}
        <div className="px-6 py-5">
          {/* Decorative top border */}
          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px bg-gradient-to-l from-[var(--gold-primary)] to-transparent opacity-30" />
            <span className="text-[var(--gold-primary)] text-lg ornament">
              ◈
            </span>
            <div className="flex-1 h-px bg-gradient-to-r from-[var(--gold-primary)] to-transparent opacity-30" />
          </div>

          <ExpandableText text={result.legalAnswer} />

          {/* Source note */}
          <div
            className="mt-5 flex items-center gap-2 text-xs text-[var(--text-muted)]
            pt-4 border-t border-[var(--border-color)]"
          >
            <span className="ornament text-sm">⚖</span>
            <span>
              هذا النص القانوني معروض كما هو من قاعدة المعرفة دون تعديل.
            </span>
          </div>
        </div>
      </div>

      {/* Card 2 - AI Explanation */}
      <div
        className="rounded-2xl border border-[var(--border-color)]
        bg-[var(--bg-card)] overflow-hidden
        shadow-lg card-hover animate-slide-up"
        style={{ animationDelay: "0.2s" }}
      >
        {/* Card Header */}
        <div
          className="flex items-center justify-between px-6 py-4
          border-b border-[var(--border-color)]
          bg-gradient-to-l from-[var(--bg-secondary)] to-transparent"
        >
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center
              bg-gradient-to-br from-indigo-500 to-purple-600
              shadow-md"
            >
              <Brain className="w-5 h-5 text-white" strokeWidth={2} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[var(--text-primary)] font-display">
                الشرح بالمصري
              </h2>
              <p className="text-xs text-[var(--text-muted)]">
                شرح مبسط بالذكاء الاصطناعي
              </p>
            </div>
          </div>
          <CopyButton text={result.aiExplanation} />
        </div>

        {/* AI Badge */}
        <div className="px-6 pt-4 pb-1">
          <span
            className="inline-flex items-center gap-1.5 text-xs font-medium
            px-3 py-1 rounded-full
            bg-gradient-to-l from-indigo-500/10 to-purple-500/10
            border border-indigo-500/20 text-indigo-600 dark:text-indigo-400"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
            مولّد بالذكاء الاصطناعي Gemini
          </span>
        </div>

        {/* Card Content */}
        <div className="px-6 py-5">
          {/* Decorative top border */}
          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px bg-gradient-to-l from-indigo-500 to-transparent opacity-30" />
            <span className="text-indigo-500 text-lg ornament">◈</span>
            <div className="flex-1 h-px bg-gradient-to-r from-indigo-500 to-transparent opacity-30" />
          </div>

          <ExpandableText text={result.aiExplanation} />

          {/* Disclaimer */}
          <div
            className="mt-5 flex items-start gap-2 text-xs text-[var(--text-muted)]
            pt-4 border-t border-[var(--border-color)]"
          >
            <span className="text-amber-500 mt-0.5 flex-shrink-0">⚠</span>
            <span>
              هذا الشرح للتوضيح فقط ولا يُعدّ استشارة قانونية. للقضايا المهمة،
              يُنصح بالتواصل مع محامٍ متخصص.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
