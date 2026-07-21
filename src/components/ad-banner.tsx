'use client';

import { useEffect, useRef } from 'react';

export default function AdBanner({ slot }: { slot?: string }) {
  const adContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!adContainerRef.current) return;

    // Clear previous elements if any
    adContainerRef.current.innerHTML = '';

    const atOptionsScript = document.createElement('script');
    atOptionsScript.type = 'text/javascript';
    atOptionsScript.innerHTML = `
      atOptions = {
        'key' : '926c8530b037aace1b78689e5b0c2621',
        'format' : 'iframe',
        'height' : 90,
        'width' : 728,
        'params' : {}
      };
    `;

    const invokeScript = document.createElement('script');
    invokeScript.type = 'text/javascript';
    invokeScript.src = 'https://www.highperformanceformat.com/926c8530b037aace1b78689e5b0c2621/invoke.js';

    adContainerRef.current.appendChild(atOptionsScript);
    adContainerRef.current.appendChild(invokeScript);
  }, []);

  return (
    <div className="w-full flex justify-center items-center my-4 min-h-[90px]">
      <div ref={adContainerRef} id="adsterra-banner-728x90" />
    </div>
  );
}
