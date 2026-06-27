"use client";

import { ThemeToggle } from "./ThemeToggle";
import { Scale } from "lucide-react";

export function Header() {
  return (
    <header
      className="sticky top-0 z-50 w-full
      border-b border-[var(--border-color)]
      bg-[var(--bg-primary)]/90 backdrop-blur-md
      transition-all duration-300"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a
            href="/"
            className="flex items-center gap-3 group"
            aria-label="الصفحة الرئيسية"
          >
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center
              bg-gradient-to-br from-[var(--gold-primary)] to-[var(--gold-dark)]
              shadow-md group-hover:shadow-lg group-hover:shadow-[var(--shadow-color)]
              transition-shadow duration-300"
            >
              <Scale className="w-5 h-5 text-white" strokeWidth={2} />
            </div>
            <div className="hidden sm:block">
              <span className="text-base font-bold text-[var(--text-primary)] font-display leading-none">
                المنصة القانونية
              </span>
              <p className="text-xs text-[var(--text-muted)] leading-none mt-0.5">
                البحث الذكي في القانون المصري
              </p>
            </div>
          </a>

          {/* Nav */}
          <nav className="flex items-center gap-3">
            <span
              className="hidden md:flex items-center gap-1.5 text-xs
              text-[var(--text-muted)] px-3 py-1.5 rounded-lg
              bg-[var(--bg-secondary)] border border-[var(--border-color)]"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              مدعوم بـ Gemini AI
            </span>
            <ThemeToggle />
          </nav>
        </div>
      </div>
    </header>
  );
}
