'use client';

import { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';

type AdSlot = 'top' | 'inline' | 'bottom';

interface AdBannerProps {
  slot: AdSlot;
  className?: string;
}

const slotConfig = {
  top: { height: 'min-h-[100px]' },
  inline: { height: 'min-h-[80px]' },
  bottom: { height: 'min-h-[110px]' },
} as const;

const BANNER_KEY = '926c8530b037aace1b78689e5b0c2621';

export function AdBanner({ slot, className }: AdBannerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!containerRef.current || loaded) return;
    if (typeof window === 'undefined') return;

    const container = containerRef.current;

    // Set atOptions globally
    (window as Record<string, unknown>).atOptions = {
      key: BANNER_KEY,
      format: 'iframe',
      height: 90,
      width: 728,
      params: {},
    };

    // Inject invoke.js
    const script = document.createElement('script');
    script.src = `https://www.highperformanceformat.com/${BANNER_KEY}/invoke.js`;
    script.async = true;
    script.onload = () => setLoaded(true);

    container.appendChild(script);

    return () => {
      if (container.contains(script)) {
        container.removeChild(script);
      }
    };
  }, [loaded]);

  return (
    <div
      ref={containerRef}
      className={clsx(
        'w-full flex items-center justify-center overflow-hidden',
        slotConfig[slot].height,
        className
      )}
      role="complementary"
      aria-label="Advertisement"
    />
  );
}
