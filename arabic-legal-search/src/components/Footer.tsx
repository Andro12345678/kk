"use client";

import { Scale } from "lucide-react";

export function Footer() {
  return (
    <footer
      className="mt-16 border-t border-[var(--border-color)]
      bg-[var(--bg-secondary)] py-8"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Brand */}
          <div className="flex items-center gap-2">
            <Scale className="w-4 h-4 text-[var(--gold-primary)]" />
            <span className="text-sm font-semibold text-[var(--text-secondary)]">
              المنصة القانونية
            </span>
          </div>

          {/* Disclaimer */}
          <p className="text-xs text-[var(--text-muted)] text-center max-w-md">
            هذه المنصة للإرشاد والتوعية القانونية فقط ولا تُغني عن الاستشارة القانونية
            المتخصصة. للقضايا المهمة، تواصل مع محامٍ مرخص.
          </p>

          {/* Tech Stack */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-[var(--text-muted)]">
              مدعوم بـ
            </span>
            <span
              className="text-xs font-semibold px-2 py-0.5 rounded
              bg-gradient-to-l from-blue-500/10 to-purple-500/10
              border border-blue-500/20 text-blue-600 dark:text-blue-400"
            >
              Gemini AI
            </span>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="mt-6 pt-4 border-t border-[var(--border-color)] text-center">
          <p className="text-xs text-[var(--text-muted)]">
            © {new Date().getFullYear()} المنصة القانونية · جميع الحقوق محفوظة
          </p>
        </div>
      </div>
    </footer>
  );
}
