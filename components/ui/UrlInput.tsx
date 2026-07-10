"use client";

import { useState, useEffect } from "react";
import { useEdit } from "@/context/EditContext";

export function UrlInput({ value, field }: { value: string; field: string }) {
  const { updateField } = useEdit();
  const [local, setLocal] = useState(value);

  // Sync when Supabase data loads after mount
  useEffect(() => { setLocal(value); }, [value]);

  return (
    <input
      type="text"
      value={local}
      onChange={(e) => setLocal(e.target.value)}
      onBlur={() => { if (local !== value) updateField(field, local); }}
      placeholder="https://..."
      className="text-xs bg-transparent border-b border-border focus:border-accent/60 outline-none text-text placeholder:text-muted/30 w-full pb-0.5 transition-colors"
    />
  );
}
