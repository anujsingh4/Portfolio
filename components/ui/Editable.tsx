"use client";

import { useRef, useEffect } from "react";
import { useEdit } from "@/context/EditContext";

function EditableCore({
  value,
  field,
  className,
  block,
  onSave,
}: {
  value: string;
  field: string;
  className?: string;
  block?: boolean;
  onSave: (field: string, value: string) => void;
}) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ref = useRef<any>(null);

  useEffect(() => {
    if (ref.current && document.activeElement !== ref.current) {
      ref.current.textContent = value;
    }
  }, [value]);

  const sharedProps = {
    ref,
    contentEditable: true,
    suppressContentEditableWarning: true,
    onKeyDown: (e: React.KeyboardEvent) => {
      if (!block && e.key === "Enter") {
        e.preventDefault();
        (e.currentTarget as HTMLElement).blur();
      }
    },
    onBlur: (e: React.FocusEvent) => {
      const text = (e.currentTarget as HTMLElement).textContent ?? "";
      onSave(field, text);
    },
    className: `${className ?? ""} outline-none cursor-text underline underline-offset-[3px] decoration-accent/40 decoration-[1px] focus:decoration-accent/80`,
  };

  return block ? <div {...sharedProps} /> : <span {...sharedProps} />;
}

export function Editable({
  value,
  field,
  className = "",
  block = false,
}: {
  value: string;
  field: string;
  className?: string;
  block?: boolean;
}) {
  const { isEditing, updateField } = useEdit();

  if (!isEditing) {
    return block ? (
      <div className={className}>{value}</div>
    ) : (
      <span className={className}>{value}</span>
    );
  }

  return (
    <EditableCore
      value={value}
      field={field}
      className={className}
      block={block}
      onSave={updateField}
    />
  );
}
