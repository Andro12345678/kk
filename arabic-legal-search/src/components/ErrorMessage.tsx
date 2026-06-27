"use client";

import { AlertCircle, RefreshCw } from "lucide-react";

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

export function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  return (
    <div
      className="w-full max-w-2xl mx-auto animate-scale-in"
      role="alert"
      aria-live="polite"
    >
      <div
        className="rounded-2xl border border-red-200 dark:border-red-900/50
        bg-red-50 dark:bg-red-950/20 p-6
        flex flex-col items-center text-center gap-4"
      >
        {/* Icon */}
        <div
          className="w-14 h-14 rounded-full flex items-center justify-center
          bg-red-100 dark:bg-red-900/30"
        >
          <AlertCircle
            className="w-7 h-7 text-red-500 dark:text-red-400"
            strokeWidth={1.5}
          />
        </div>

        {/* Message */}
        <div>
          <h3 className="text-base font-semibold text-red-700 dark:text-red-400 mb-1">
            لم يتم العثور على نتيجة
          </h3>
          <p className="text-sm text-red-600/80 dark:text-red-400/70 font-arabic leading-relaxed">
            {message}
          </p>
        </div>

        {/* Suggestions */}
        <div
          className="w-full p-4 rounded-xl bg-white/50 dark:bg-white/5
          border border-red-200/50 dark:border-red-900/30 text-right"
        >
          <p className="text-xs font-semibold text-red-600 dark:text-red-400 mb-2">
            نصائح للحصول على نتائج أفضل:
          </p>
          <ul className="text-xs text-red-600/70 dark:text-red-400/60 space-y-1.5 font-arabic">
            <li className="flex items-start gap-2">
              <span className="mt-0.5 flex-shrink-0">•</span>
              <span>حاول إعادة صياغة السؤال بكلمات مختلفة</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 flex-shrink-0">•</span>
              <span>استخدم مصطلحات قانونية إذا كنت تعرفها</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 flex-shrink-0">•</span>
              <span>اسأل عن موضوع محدد (مثل: ميعاد الطعن، التظلم الإداري...)</span>
            </li>
          </ul>
        </div>

        {/* Retry button */}
        {onRetry && (
          <button
            onClick={onRetry}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl
              border border-red-300 dark:border-red-700
              text-red-600 dark:text-red-400 text-sm font-medium
              hover:bg-red-100 dark:hover:bg-red-900/30
              transition-all duration-200 active:scale-95"
          >
            <RefreshCw className="w-4 h-4" />
            <span>حاول مرة أخرى</span>
          </button>
        )}
      </div>
    </div>
  );
}
