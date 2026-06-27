"use client";

const LOADING_STEPS = [
  { icon: "🔍", text: "جاري البحث في قاعدة المعرفة القانونية..." },
  { icon: "🧠", text: "تحليل سؤالك بالذكاء الاصطناعي..." },
  { icon: "⚖️", text: "استرجاع الإجابة القانونية الأنسب..." },
  { icon: "✍️", text: "إعداد الشرح بالعربية المصرية..." },
];

interface LoadingAnimationProps {
  currentStep?: number;
}

export function LoadingAnimation({ currentStep = 0 }: LoadingAnimationProps) {
  const step = LOADING_STEPS[currentStep % LOADING_STEPS.length];

  return (
    <div className="flex flex-col items-center justify-center py-16 animate-fade-in">
      {/* Scales of Justice Animation */}
      <div className="relative mb-8">
        {/* Outer ring */}
        <div
          className="w-24 h-24 rounded-full border-4 border-[var(--border-color)]
          border-t-[var(--gold-primary)] animate-spin"
          style={{ animationDuration: "1.2s" }}
        />

        {/* Inner ring - counter spin */}
        <div
          className="absolute inset-3 w-18 h-18 rounded-full border-4 border-transparent
          border-b-[var(--gold-primary)] animate-spin"
          style={{
            animationDuration: "0.8s",
            animationDirection: "reverse",
            width: "calc(100% - 24px)",
            height: "calc(100% - 24px)",
          }}
        />

        {/* Center icon */}
        <div
          className="absolute inset-0 flex items-center justify-center text-3xl float-anim"
          style={{ animationDelay: "0s" }}
        >
          {step.icon}
        </div>
      </div>

      {/* Step text */}
      <p
        className="text-[var(--text-secondary)] text-base font-arabic text-center
        animate-pulse-slow max-w-xs"
      >
        {step.text}
      </p>

      {/* Progress dots */}
      <div className="flex gap-2 mt-6">
        {LOADING_STEPS.map((_, idx) => (
          <div
            key={idx}
            className={`rounded-full transition-all duration-500 ${
              idx === currentStep % LOADING_STEPS.length
                ? "w-6 h-2.5 bg-[var(--gold-primary)]"
                : "w-2.5 h-2.5 bg-[var(--border-color)]"
            }`}
          />
        ))}
      </div>

      {/* Decorative shimmer bars */}
      <div className="mt-10 w-full max-w-lg space-y-3">
        {[100, 85, 65].map((width, idx) => (
          <div
            key={idx}
            className="h-3 rounded-full shimmer-effect"
            style={{
              width: `${width}%`,
              animationDelay: `${idx * 0.3}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
