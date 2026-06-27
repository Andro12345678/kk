"use client";

import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-10 h-10 rounded-full bg-transparent border border-transparent" />
    );
  }

  const isDark = theme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="relative w-10 h-10 rounded-full flex items-center justify-center
        border border-[var(--border-color)] bg-[var(--bg-card)]
        hover:border-[var(--gold-primary)] hover:shadow-lg
        transition-all duration-300 group overflow-hidden"
      aria-label={isDark ? "تفعيل الوضع النهاري" : "تفعيل الوضع الليلي"}
      title={isDark ? "الوضع النهاري" : "الوضع الليلي"}
    >
      <span className="absolute inset-0 rounded-full bg-gradient-to-br from-[var(--gold-primary)] to-transparent opacity-0 group-hover:opacity-10 transition-opacity duration-300" />

      {isDark ? (
        <Sun
          className="w-4 h-4 text-[var(--gold-primary)] transition-transform duration-300 group-hover:rotate-12"
          strokeWidth={2}
        />
      ) : (
        <Moon
          className="w-4 h-4 text-[var(--text-secondary)] transition-transform duration-300 group-hover:-rotate-12"
          strokeWidth={2}
        />
      )}
    </button>
  );
}
