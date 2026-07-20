'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import clsx from 'clsx';

type AdSlot = 'top' | 'inline' | 'bottom';

interface AdBannerProps {
  slot: AdSlot;
  className?: string;
}

const slotConfig = {
  top: {
    height: 'h-24',
    label: 'Top Banner Ad — 728×90',
    responsive: true,
  },
  inline: {
    height: 'h-20',
    label: 'Inline Ad — High Visibility',
    responsive: false,
  },
  bottom: {
    height: 'h-28',
    label: 'Bottom Banner Ad — 970×250',
    responsive: true,
  },
} as const;

export function AdBanner({ slot, className }: AdBannerProps) {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const config = slotConfig[slot];
  const isDark = theme === 'dark';

  return (
    <div
      className={clsx(
        'w-full rounded-xl border-2 border-dashed flex items-center justify-center overflow-hidden transition-colors',
        config.height,
        isDark
          ? 'border-white/10 bg-white/[0.02]'
          : 'border-black/10 bg-black/[0.02]',
        className
      )}
      role="complementary"
      aria-label="Advertisement"
    >
      {/* ---- Replace this block with your real AdSense code ---- */}
      <div className="flex flex-col items-center gap-1 text-center px-4">
        <span
          className={clsx(
            'text-[10px] font-semibold uppercase tracking-widest',
            isDark ? 'text-white/20' : 'text-black/20'
          )}
        >
          {config.label}
        </span>
        {slot === 'top' && (
          <span
            className={clsx(
              'hidden sm:inline text-[11px]',
              isDark ? 'text-white/15' : 'text-black/15'
            )}
          >
            AdSense ID: ca-pub-XXXXXXXXXXXXXXXX
          </span>
        )}
      </div>
      {/* ---- End placeholder ---- */}
    </div>
  );
}
