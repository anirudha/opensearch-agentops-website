import { useState, useEffect } from 'react';

const taglines = [
  // Observe (cyan)
  { label: 'Observe', text: 'Traces, logs, metrics—one place, zero blind spots', color: 'text-cyan-400' },
  { label: 'Observe', text: 'Your agents aren\'t black boxes anymore', color: 'text-cyan-400' },
  { label: 'Observe', text: 'Debug in minutes, not days', color: 'text-cyan-400' },
  // Evaluate (emerald)
  { label: 'Evaluate', text: 'Catch regressions before your users do', color: 'text-emerald-400' },
  { label: 'Evaluate', text: 'Vibes aren\'t a test strategy', color: 'text-emerald-400' },
  { label: 'Evaluate', text: 'Ship only what passes', color: 'text-emerald-400' },
  // Refine (amber)
  { label: 'Refine', text: 'Better prompts from real data, not guesswork', color: 'text-amber-400' },
  { label: 'Refine', text: 'Stop guessing. Start measuring, Labelling', color: 'text-amber-400' },
  { label: 'Refine', text: 'Every failure is a training signal', color: 'text-amber-400' },
  // Alert (orange)
  { label: 'Alert', text: 'Anomalies caught. Alerts sent. You sleep.', color: 'text-orange-400' },
  { label: 'Alert', text: 'Know before your users complain', color: 'text-orange-400' },
  { label: 'Alert', text: 'The right signal. The right time. Nothing else.', color: 'text-orange-400' },
];

export function CyclingTagline() {
  const [index, setIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % taglines.length);
        setIsVisible(true);
      }, 400);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const current = taglines[index];

  return (
    <div className="h-8 flex items-center relative">
      <span className={`${current.color} text-sm font-semibold uppercase tracking-wide`}>
        {current.label}
      </span>
      <div className="absolute left-[85px] top-0 h-full flex items-center overflow-hidden w-[400px]">
        <span
          className={`text-slate-400 whitespace-nowrap transition-all duration-500 ease-in-out ${
            isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'
          }`}
        >
          {current.text}
        </span>
      </div>
    </div>
  );
}
