"use client";

import { useState, useRef, useEffect } from "react";
import { Search, X, Loader2 } from "lucide-react";

interface SearchBarProps {
  onSearch: (query: string) => void;
  isLoading: boolean;
  disabled?: boolean;
}

const EXAMPLE_QUERIES = [
  "امتى اقدر اطعن في القرار؟",
  "ميعاد الطعن بالاستئناف كام يوم؟",
  "ازاي اعمل تظلم من قرار إداري؟",
  "لو القرار ظالم اعمل إيه؟",
  "حق الدفاع عن النفس في القانون",
];

export function SearchBar({ onSearch, isLoading, disabled }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Cycle through example queries as placeholder
  useEffect(() => {
    if (isFocused || query) return;
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % EXAMPLE_QUERIES.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [isFocused, query]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() && !isLoading && !disabled) {
      onSearch(query.trim());
    }
  };

  const handleClear = () => {
    setQuery("");
    inputRef.current?.focus();
  };

  const handleExampleClick = (example: string) => {
    setQuery(example);
    setTimeout(() => onSearch(example), 100);
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Main search form */}
      <form onSubmit={handleSubmit} className="relative">
        <div
          className={`relative flex items-center rounded-2xl border-2 transition-all duration-300
            bg-[var(--bg-card)] shadow-lg
            ${
              isFocused
                ? "border-[var(--gold-primary)] shadow-[0_0_30px_var(--glow-color)]"
                : "border-[var(--border-color)] hover:border-[var(--gold-primary)] hover:shadow-xl"
            }`}
        >
          {/* Search Icon */}
          <div className="flex items-center justify-center w-14 h-14 flex-shrink-0">
            {isLoading ? (
              <Loader2
                className="w-5 h-5 text-[var(--gold-primary)] animate-spin"
                strokeWidth={2.5}
              />
            ) : (
              <Search
                className={`w-5 h-5 transition-colors duration-200 ${
                  isFocused
                    ? "text-[var(--gold-primary)]"
                    : "text-[var(--text-muted)]"
                }`}
                strokeWidth={2.5}
              />
            )}
          </div>

          {/* Input */}
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={
              isFocused ? "اكتب سؤالك القانوني هنا..." : EXAMPLE_QUERIES[placeholderIndex]
            }
            disabled={isLoading || disabled}
            className="flex-1 h-14 bg-transparent outline-none text-[var(--text-primary)]
              placeholder:text-[var(--text-muted)] text-base font-arabic
              disabled:opacity-50 disabled:cursor-not-allowed
              transition-opacity duration-200"
            dir="rtl"
            autoComplete="off"
            aria-label="ابحث عن سؤالك القانوني"
          />

          {/* Clear button */}
          {query && !isLoading && (
            <button
              type="button"
              onClick={handleClear}
              className="w-8 h-8 flex items-center justify-center rounded-full
                text-[var(--text-muted)] hover:text-[var(--text-primary)]
                hover:bg-[var(--bg-secondary)] transition-all duration-200 mx-1"
              aria-label="مسح النص"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          {/* Search Button */}
          <button
            type="submit"
            disabled={!query.trim() || isLoading || disabled}
            className="flex items-center gap-2 m-2 px-5 py-3 rounded-xl
              bg-gradient-to-l from-[var(--gold-primary)] to-[var(--gold-dark)]
              text-white font-semibold text-sm
              hover:shadow-lg hover:shadow-[var(--shadow-color)]
              disabled:opacity-40 disabled:cursor-not-allowed
              transition-all duration-200 active:scale-95
              whitespace-nowrap"
            aria-label="ابحث"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="hidden sm:inline">جاري البحث...</span>
              </>
            ) : (
              <>
                <Search className="w-4 h-4" />
                <span className="hidden sm:inline">ابحث</span>
              </>
            )}
          </button>
        </div>

        {/* Glow line at bottom when focused */}
        <div
          className={`absolute -bottom-px left-8 right-8 h-0.5 rounded-full
            bg-gradient-to-l from-transparent via-[var(--gold-primary)] to-transparent
            transition-opacity duration-300
            ${isFocused ? "opacity-100" : "opacity-0"}`}
        />
      </form>

      {/* Example queries */}
      <div className="mt-5 flex flex-wrap gap-2 justify-center">
        <span className="text-xs text-[var(--text-muted)] self-center">
          أمثلة:
        </span>
        {EXAMPLE_QUERIES.slice(0, 3).map((example, idx) => (
          <button
            key={idx}
            onClick={() => handleExampleClick(example)}
            disabled={isLoading || disabled}
            className="text-xs px-3 py-1.5 rounded-full
              border border-[var(--border-color)]
              text-[var(--text-secondary)] bg-[var(--bg-secondary)]
              hover:border-[var(--gold-primary)] hover:text-[var(--gold-primary)]
              hover:bg-[var(--bg-card)]
              transition-all duration-200 disabled:opacity-50
              disabled:cursor-not-allowed"
          >
            {example}
          </button>
        ))}
      </div>
    </div>
  );
}
