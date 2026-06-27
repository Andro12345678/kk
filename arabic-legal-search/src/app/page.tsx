"use client";

import { useState, useEffect, useRef } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SearchBar } from "@/components/SearchBar";
import { ResultCards } from "@/components/ResultCards";
import { LoadingAnimation } from "@/components/LoadingAnimation";
import { ErrorMessage } from "@/components/ErrorMessage";
import type { SearchResponse } from "@/types";

const DECORATIVE_QUESTIONS = [
  "ما هي مواعيد الطعن القضائي؟",
  "كيف أتظلم من قرار إداري؟",
  "ما هي حقوقي أمام المحكمة؟",
  "متى يسقط الحق في التقاضي؟",
];

export default function HomePage() {
  const [result, setResult] = useState<SearchResponse["result"] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [lastQuery, setLastQuery] = useState<string>("");
  const [hasSearched, setHasSearched] = useState(false);

  const resultsRef = useRef<HTMLDivElement>(null);
  const loadingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Cycle loading steps during search
  useEffect(() => {
    if (isLoading) {
      setLoadingStep(0);
      loadingIntervalRef.current = setInterval(() => {
        setLoadingStep((prev) => prev + 1);
      }, 2500);
    } else {
      if (loadingIntervalRef.current) {
        clearInterval(loadingIntervalRef.current);
        loadingIntervalRef.current = null;
      }
    }

    return () => {
      if (loadingIntervalRef.current) {
        clearInterval(loadingIntervalRef.current);
      }
    };
  }, [isLoading]);

  // Scroll to results when they appear
  useEffect(() => {
    if ((result || error) && resultsRef.current) {
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 200);
    }
  }, [result, error]);

  const handleSearch = async (query: string) => {
    setIsLoading(true);
    setResult(null);
    setError(null);
    setLastQuery(query);
    setHasSearched(true);

    try {
      const response = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });

      const data: SearchResponse = await response.json();

      if (data.success && data.result) {
        setResult(data.result);
      } else {
        setError(
          data.error ||
            "حدث خطأ غير متوقع. الرجاء المحاولة مرة أخرى."
        );
      }
    } catch {
      setError(
        "تعذّر الاتصال بالخادم. تأكد من اتصالك بالإنترنت وحاول مرة أخرى."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    if (lastQuery) {
      handleSearch(lastQuery);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[var(--bg-primary)]">
      <Header />

      <main className="flex-1 w-full">
        {/* Hero Section */}
        <section
          className={`relative w-full overflow-hidden transition-all duration-700
          ${hasSearched ? "py-8" : "py-16 sm:py-24"}`}
        >
          {/* Background decorations */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {/* Gold gradient blob - top right */}
            <div
              className="absolute -top-24 -right-24 w-96 h-96 rounded-full
              bg-gradient-radial from-[var(--gold-primary)]/10 to-transparent
              blur-3xl"
            />
            {/* Gold gradient blob - bottom left */}
            <div
              className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full
              bg-gradient-radial from-[var(--gold-primary)]/8 to-transparent
              blur-3xl"
            />

            {/* Subtle arabesque pattern */}
            <div
              className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
              style={{
                backgroundImage: `repeating-linear-gradient(
                  45deg,
                  var(--gold-primary) 0px,
                  var(--gold-primary) 1px,
                  transparent 1px,
                  transparent 20px
                )`,
              }}
            />
          </div>

          <div className="relative max-w-5xl mx-auto px-4 sm:px-6">
            {/* Hero text - only shown before search */}
            {!hasSearched && (
              <div className="text-center mb-12 animate-fade-in">
                {/* Ornamental header */}
                <div className="flex items-center justify-center gap-4 mb-6">
                  <div className="h-px w-16 bg-gradient-to-l from-[var(--gold-primary)] to-transparent" />
                  <span className="text-[var(--gold-primary)] text-2xl ornament float-anim">
                    ❋
                  </span>
                  <div className="h-px w-16 bg-gradient-to-r from-[var(--gold-primary)] to-transparent" />
                </div>

                <h1 className="text-4xl sm:text-5xl font-bold font-display text-[var(--text-primary)] mb-4 leading-tight">
                  ابحث عن{" "}
                  <span className="text-gradient-gold">حقوقك القانونية</span>
                </h1>

                <p className="text-lg text-[var(--text-secondary)] max-w-xl mx-auto font-arabic leading-relaxed">
                  اكتب سؤالك بأي صياغة تريد، وسيفهمه الذكاء الاصطناعي ويجيبك
                  بالإجابة القانونية الصحيحة.
                </p>

                {/* Stats row */}
                <div className="flex items-center justify-center gap-8 mt-8">
                  {[
                    { icon: "🧠", label: "بحث دلالي ذكي" },
                    { icon: "⚖️", label: "إجابات قانونية دقيقة" },
                    { icon: "🇪🇬", label: "شرح بالعربية المصرية" },
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      className="flex flex-col items-center gap-1"
                    >
                      <span className="text-2xl">{item.icon}</span>
                      <span className="text-xs text-[var(--text-muted)] hidden sm:block">
                        {item.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Compact header after search */}
            {hasSearched && (
              <div className="text-center mb-6 animate-slide-down">
                <h1 className="text-2xl font-bold font-display text-[var(--text-primary)]">
                  <span className="text-gradient-gold">المنصة القانونية</span>
                </h1>
              </div>
            )}

            {/* Search Bar */}
            <div className="animate-slide-up">
              <SearchBar
                onSearch={handleSearch}
                isLoading={isLoading}
                disabled={isLoading}
              />
            </div>

            {/* Floating example questions - only before first search */}
            {!hasSearched && (
              <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl mx-auto animate-fade-in">
                {DECORATIVE_QUESTIONS.map((question, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSearch(question)}
                    className="group flex items-center gap-3 p-4 rounded-xl text-right
                      border border-[var(--border-color)] bg-[var(--bg-card)]
                      hover:border-[var(--gold-primary)]
                      hover:shadow-lg hover:shadow-[var(--shadow-color)]
                      transition-all duration-300"
                    style={{ animationDelay: `${idx * 0.1}s` }}
                  >
                    <span
                      className="w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center
                      bg-[var(--bg-secondary)] group-hover:bg-[var(--gold-primary)]/10
                      text-sm transition-colors duration-300"
                    >
                      ❓
                    </span>
                    <span className="text-sm text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors duration-300 text-right flex-1">
                      {question}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Results Section */}
        <section ref={resultsRef} className="w-full">
          {isLoading && (
            <div className="max-w-5xl mx-auto px-4 sm:px-6 pb-16">
              <LoadingAnimation currentStep={loadingStep} />
            </div>
          )}

          {!isLoading && error && (
            <div className="max-w-5xl mx-auto px-4 sm:px-6 pb-16">
              <ErrorMessage message={error} onRetry={handleRetry} />
            </div>
          )}

          {!isLoading && result && (
            <div className="max-w-5xl mx-auto px-4 sm:px-6 pb-16">
              {/* Search result label */}
              <div className="flex items-center gap-3 mb-6">
                <div className="flex-1 h-px bg-[var(--border-color)]" />
                <span className="text-sm text-[var(--text-muted)] flex items-center gap-2">
                  <span className="text-[var(--gold-primary)] ornament">◈</span>
                  نتائج البحث
                </span>
                <div className="flex-1 h-px bg-[var(--border-color)]" />
              </div>

              <ResultCards result={result} />
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
