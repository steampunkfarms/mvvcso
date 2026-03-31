'use client';

import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';

interface StatConfig {
  valueKey: string;
  labelKey: string;
  numericValue: number;
  suffix: string;
}

const stats: StatConfig[] = [
  { valueKey: 'impact_years', labelKey: 'impact_years_label', numericValue: 50, suffix: '+' },
  { valueKey: 'impact_residents', labelKey: 'impact_residents_label', numericValue: 300, suffix: '+' },
  { valueKey: 'impact_board', labelKey: 'impact_board_label', numericValue: 7, suffix: '' },
  { valueKey: 'impact_volunteer', labelKey: 'impact_volunteer_label', numericValue: 100, suffix: '%' },
];

export function ImpactStats() {
  const t = useTranslations('home');

  return (
    <section className="py-(--section-padding) bg-gold-50">
      <div className="max-w-(--container-max) mx-auto px-(--container-padding)">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-(--text-primary)">
          {t('impact_title')}
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((stat) => (
            <AnimatedStat
              key={stat.valueKey}
              target={stat.numericValue}
              suffix={stat.suffix}
              label={t(stat.labelKey)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function AnimatedStat({
  target,
  suffix,
  label,
}: {
  target: number;
  suffix: string;
  label: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          animateCount(target, setCount);
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [target, hasAnimated]);

  return (
    <div ref={ref}>
      <div className="text-4xl md:text-5xl font-bold text-gold-400 mb-2">
        {count}
        {suffix}
      </div>
      <div className="text-sm text-(--text-secondary)">{label}</div>
    </div>
  );
}

function animateCount(
  target: number,
  setCount: (n: number) => void,
) {
  const duration = 1500;
  const steps = 40;
  const stepTime = duration / steps;
  let current = 0;

  const interval = setInterval(() => {
    current++;
    const progress = current / steps;
    // Ease-out curve
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = Math.round(eased * target);
    setCount(value);

    if (current >= steps) {
      clearInterval(interval);
      setCount(target);
    }
  }, stepTime);
}
