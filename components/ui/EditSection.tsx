"use client";

import { ReactNode } from "react";
import { useEdit } from "@/context/EditContext";

interface Props {
  label: string;
  children: ReactNode;
}

export function EditSection({ label, children }: Props) {
  const { isEditing } = useEdit();

  if (!isEditing) return <>{children}</>;

  return (
    <div className="relative mx-3 my-2 rounded-2xl border border-dashed border-accent/[0.15]">
      {/* Section label badge */}
      <div className="absolute -top-px left-6 -translate-y-1/2 z-10 pointer-events-none">
        <span className="inline-flex items-center gap-1.5 text-[9px] font-mono tracking-[0.2em] uppercase bg-[#141210] px-2 py-0.5 text-accent/60">
          <span className="w-1 h-1 rounded-full bg-accent/60 inline-block" />
          {label}
        </span>
      </div>
      {children}
    </div>
  );
}
