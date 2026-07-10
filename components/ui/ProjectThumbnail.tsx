"use client";

import { useState, useEffect, useRef } from "react";

interface Props {
  live: string;
  code: string;
}

export function ProjectThumbnail({ live, code }: Props) {
  const url = live !== "#" ? live : code !== "#" ? code : null;
  const [src, setSrc] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
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
          .then((d) => { if (d.image) setSrc(d.image); else setFailed(true); })
          .catch(() => setFailed(true));
      },
      { rootMargin: "200px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [url]);

  if (!url || failed) return null;

  return (
    <div
      ref={ref}
      className="hidden lg:flex shrink-0 w-[200px] h-[120px] rounded-lg border border-border overflow-hidden bg-surface relative"
    >
      {/* Skeleton — always present behind the image until it loads */}
      {!loaded && (
        <div className="absolute inset-0 bg-surface animate-pulse" />
      )}

      {src && (
        <img
          src={src}
          alt=""
          className={`absolute inset-0 w-full h-full object-cover object-top transition-opacity duration-500 ${loaded ? "opacity-100" : "opacity-0"}`}
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
        />
      )}
    </div>
  );
}
