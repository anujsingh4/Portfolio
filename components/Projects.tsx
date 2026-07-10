"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Pin, PinOff, Trash2 } from "lucide-react";
import Link from "next/link";
import { useEdit } from "@/context/EditContext";
import { Editable } from "@/components/ui/Editable";
import { EditSection } from "@/components/ui/EditSection";

export default function Projects() {
  const { data, isEditing, updateField, togglePin, removeProject } =
    useEdit();
  const { projects } = data;
  const [hovered, setHovered] = useState<string | null>(null);

  const pinnedCount = projects.filter((p) => p.pinned).length;

  // Always show pinned only on home — manage all from /projects
  const displayed = projects.filter((p) => p.pinned);

  return (
    <EditSection label="Projects">
    <section id="projects" className="py-24 px-6 max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between mb-12"
      >
        <span className="text-xs text-muted tracking-widest uppercase">
          Selected Work
        </span>
        <Link
          href="/projects"
          className="text-xs text-muted hover:text-text transition-colors flex items-center gap-1 group"
        >
          {isEditing ? "Manage all" : "View all"}
          <ArrowUpRight
            size={11}
            className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
          />
        </Link>
      </motion.div>

      <div className="border-t border-border">
        {displayed.map((p, displayIdx) => {
          const originalIndex = projects.findIndex((proj) => proj.id === p.id);
          const num = String(
            isEditing ? originalIndex + 1 : displayIdx + 1
          ).padStart(2, "0");

          return (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: displayIdx * 0.08 }}
              onMouseEnter={() => !isEditing && setHovered(p.id)}
              onMouseLeave={() => !isEditing && setHovered(null)}
              className="border-b border-border py-8"
            >
              <div className="flex items-start gap-6 md:gap-10">
                {/* Number */}
                <span
                  className={`text-xs font-medium pt-1 shrink-0 transition-colors duration-300 ${
                    hovered === p.id ? "text-accent" : "text-muted"
                  } ${isEditing && p.pinned ? "text-accent" : ""}`}
                >
                  {num}
                </span>

                <div className="flex-1 min-w-0">
                  {/* Title row */}
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <h3
                      className={`text-xl md:text-2xl font-semibold tracking-tight transition-colors duration-300 ${
                        hovered === p.id ? "text-accent" : "text-text"
                      }`}
                    >
                      <Editable
                        value={p.title}
                        field={`projects.${originalIndex}.title`}
                      />
                    </h3>

                    <div className="flex items-center gap-2 shrink-0 pt-1">
                      {isEditing ? (
                        <>
                          {/* Pin toggle */}
                          <button
                            onClick={() => togglePin(p.id)}
                            title={
                              p.pinned
                                ? "Unpin from home"
                                : pinnedCount >= 3
                                ? "Max 3 pinned"
                                : "Pin to home"
                            }
                            className={`p-1.5 rounded-md transition-colors ${
                              p.pinned
                                ? "text-accent bg-accent/10 hover:bg-accent/20"
                                : pinnedCount >= 3
                                ? "text-muted/30 cursor-not-allowed"
                                : "text-muted hover:text-text hover:bg-surface"
                            }`}
                          >
                            {p.pinned ? (
                              <Pin size={14} />
                            ) : (
                              <PinOff size={14} />
                            )}
                          </button>

                          {/* Delete */}
                          <button
                            onClick={() => removeProject(p.id)}
                            className="p-1.5 rounded-md text-muted hover:text-red-400 hover:bg-red-400/10 transition-colors"
                            title="Delete project"
                          >
                            <Trash2 size={14} />
                          </button>
                        </>
                      ) : (
                        <>
                          <a
                            href={p.live}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-1 text-xs text-muted hover:text-text transition-colors"
                          >
                            Live <ArrowUpRight size={11} />
                          </a>
                          <a
                            href={p.code}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-1 text-xs text-muted hover:text-text transition-colors"
                          >
                            Code <ArrowUpRight size={11} />
                          </a>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Description */}
                  <Editable
                    value={p.description}
                    field={`projects.${originalIndex}.description`}
                    block
                    className="text-sm text-muted leading-relaxed mb-4 max-w-2xl"
                  />

                  {/* Tech */}
                  <Editable
                    value={p.tech}
                    field={`projects.${originalIndex}.tech`}
                    className="text-xs text-muted/60 tracking-wide"
                  />

                  {/* URL inputs in edit mode */}
                  {isEditing && (
                    <div className="mt-4 flex flex-col gap-1.5 max-w-sm">
                      <label className="flex items-center gap-3">
                        <span className="text-[10px] text-muted uppercase tracking-wider w-10 shrink-0">
                          Live
                        </span>
                        <input
                          type="text"
                          defaultValue={p.live}
                          onBlur={(e) =>
                            updateField(
                              `projects.${originalIndex}.live`,
                              e.target.value
                            )
                          }
                          placeholder="https://..."
                          className="text-xs bg-transparent border-b border-border focus:border-accent/60 outline-none text-text placeholder:text-muted/30 w-full pb-0.5 transition-colors"
                        />
                      </label>
                      <label className="flex items-center gap-3">
                        <span className="text-[10px] text-muted uppercase tracking-wider w-10 shrink-0">
                          Code
                        </span>
                        <input
                          type="text"
                          defaultValue={p.code}
                          onBlur={(e) =>
                            updateField(
                              `projects.${originalIndex}.code`,
                              e.target.value
                            )
                          }
                          placeholder="https://..."
                          className="text-xs bg-transparent border-b border-border focus:border-accent/60 outline-none text-text placeholder:text-muted/30 w-full pb-0.5 transition-colors"
                        />
                      </label>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {isEditing && (
        <Link
          href="/projects"
          className="mt-6 flex items-center justify-center gap-2 text-xs text-muted hover:text-text border border-dashed border-border hover:border-muted/40 rounded-lg px-4 py-3 w-full transition-colors"
        >
          Manage all projects →
        </Link>
      )}
    </section>
    </EditSection>
  );
}
