"use client";

import { useRef, useEffect } from "react";

interface AdBannerProps {
  slot: "top" | "inline" | "sidebar";
}

export default function AdBanner({ slot }: AdBannerProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "//pl30458916.effectivecpmnetwork.com/8c/4c/7a/8c4c7ac62b5c5de7acfcb03c03e5b5be.js";
    script.async = true;

    containerRef.current.appendChild(script);

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
    };
  }, []);

  return (
    <div className="flex justify-center items-center min-h-[90px]">
      <div
        ref={containerRef}
        className="ad-container"
        style={{ width: "728px", maxWidth: "100%", height: "90px" }}
      />
    </div>
  );
}
