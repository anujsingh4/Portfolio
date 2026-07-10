"use client";

import { useState, useEffect, useRef } from "react";

interface Props {
  live: string;
  code: string;
}

export function ProjectThumbnail({ live, code }: Props) {
  const url = live !== "#" ? live : code !== "#" ? code : null;
  const [src, setSrc] = useState<string | null | "loading">("loading");
  const ref = useRef<HTMLDivElement>(null);
  const fetched = useRef(false);

  useEffect(() => {
    if (!url || fetched.current) return;
    const el = ref.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || fetched.current) return;
        fetched.current = true;
        obs.disconnect();
        fetch(`/api/og-preview?url=${encodeURIComponent(url)}`)
          .then((r) => r.json())
          .then((d) => setSrc(d.image ?? null))
          .catch(() => setSrc(null));
      },
      { rootMargin: "200px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [url]);

  if (!url) return null;

  return (
    <div
      ref={ref}
      className="hidden lg:block shrink-0 w-[200px] h-[120px] rounded-lg border border-border overflow-hidden bg-surface"
    >
      {src === "loading" ? (
        <div className="w-full h-full bg-surface animate-pulse" />
      ) : src ? (
        <img
          src={src}
          alt=""
          className="w-full h-full object-cover opacity-0 transition-opacity duration-500"
          onLoad={(e) => ((e.target as HTMLImageElement).style.opacity = "1")}
          onError={() => setSrc(null)}
        />
      ) : (
        // Fallback: stylized placeholder with domain name
        <div className="w-full h-full flex items-center justify-center">
          <span className="text-[10px] text-muted/40 font-mono truncate px-3 text-center">
            {new URL(url).hostname.replace("www.", "")}
          </span>
        </div>
      )}
    </div>
  );
}
