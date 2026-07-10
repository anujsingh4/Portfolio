"use client";

import { useState, useRef, KeyboardEvent } from "react";
import { motion } from "framer-motion";
import { Plus, X, Trash2 } from "lucide-react";
import { useEdit } from "@/context/EditContext";
import { Editable } from "@/components/ui/Editable";
import { EditSection } from "@/components/ui/EditSection";

function TagEditor({
  items,
  rowIndex,
}: {
  items: string[];
  rowIndex: number;
}) {
  const { updateField } = useEdit();
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  function commit(newItems: string[]) {
    updateField(`skills.${rowIndex}.items`, newItems.join(" · "));
  }

  function addTag(raw: string) {
    const tag = raw.trim();
    if (!tag || items.includes(tag)) return;
    commit([...items, tag]);
    setInput("");
  }

  function removeTag(tag: string) {
    commit(items.filter((t) => t !== tag));
  }

  function onKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(input);
    } else if (e.key === "Backspace" && input === "" && items.length > 0) {
      removeTag(items[items.length - 1]);
    }
  }

  return (
    <div
      className="flex flex-wrap gap-1.5 min-h-[36px] cursor-text"
      onClick={() => inputRef.current?.focus()}
    >
      {items.map((tag) => (
        <span
          key={tag}
          className="inline-flex items-center gap-1 text-xs text-text/70 bg-border/50 rounded-md px-2 py-1"
        >
          {tag}
          <button
            onClick={(e) => { e.stopPropagation(); removeTag(tag); }}
            className="text-muted/50 hover:text-red-400 transition-colors"
          >
            <X size={10} />
          </button>
        </span>
      ))}
      <input
        ref={inputRef}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={onKeyDown}
        onBlur={() => { if (input.trim()) addTag(input); }}
        placeholder={items.length === 0 ? "Type and press Enter…" : "+"}
        className="text-xs bg-transparent outline-none text-text placeholder:text-muted/30 min-w-[80px] flex-1"
      />
    </div>
  );
}

export default function Skills() {
  const { data, isEditing, updateField, addSkillRow, removeSkillRow } = useEdit();
  const { skills, education } = data;

  return (
    <EditSection label="Skills & Stack">
      <section id="skills" className="py-24 px-6 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-14"
        >
          <span className="text-xs text-muted tracking-widest uppercase">
            Tech Stack
          </span>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {skills.map((row, i) => {
            const items = row.items
              .split("·")
              .map((s) => s.trim())
              .filter(Boolean);

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.07 }}
                className="rounded-xl border border-border bg-surface/40 p-5"
              >
                <div className="flex items-center justify-between mb-4">
                  {isEditing ? (
                    <input
                      defaultValue={row.label}
                      onBlur={(e) => updateField(`skills.${i}.label`, e.target.value)}
                      className="text-[10px] font-mono tracking-[0.2em] uppercase text-muted bg-transparent outline-none border-b border-transparent focus:border-accent/40 transition-colors w-full"
                    />
                  ) : (
                    <p className="text-[10px] font-mono tracking-[0.2em] uppercase text-muted">
                      {row.label}
                    </p>
                  )}
                  {isEditing && (
                    <button
                      onClick={() => removeSkillRow(i)}
                      className="text-muted/30 hover:text-red-400 transition-colors ml-2 shrink-0"
                      title="Remove category"
                    >
                      <Trash2 size={12} />
                    </button>
                  )}
                </div>

                {isEditing ? (
                  <TagEditor items={items} rowIndex={i} />
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {items.map((item) => (
                      <span
                        key={item}
                        className="text-xs text-text/60 bg-border/40 rounded-md px-2.5 py-1"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                )}
              </motion.div>
            );
          })}

          {/* Add category button — edit mode only */}
          {isEditing && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={addSkillRow}
              className="rounded-xl border border-dashed border-border hover:border-muted/40 bg-transparent p-5 flex items-center justify-center gap-2 text-xs text-muted hover:text-text transition-colors min-h-[80px]"
            >
              <Plus size={13} />
              Add category
            </motion.button>
          )}
        </div>

        {/* Education */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, delay: 0.3 }}
          className="mt-4"
        >
          <div className="rounded-xl border border-border bg-surface/40 p-5 flex flex-wrap items-baseline gap-x-5 gap-y-1">
            <p className="text-[10px] font-mono tracking-[0.2em] uppercase text-muted w-full mb-2">
              Education
            </p>
            <Editable
              value={education.text}
              field="education.text"
              className="text-sm text-text/70"
            />
            <Editable
              value={education.year}
              field="education.year"
              className="text-xs text-muted"
            />
          </div>
        </motion.div>
      </section>
    </EditSection>
  );
}
