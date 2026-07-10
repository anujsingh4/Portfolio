"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowUpRight, Pin, PinOff, Trash2, Plus } from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { useEdit } from "@/context/EditContext";
import { Editable } from "@/components/ui/Editable";

export default function ProjectsPage() {
  const { data, isEditing, updateField, togglePin, addProject, removeProject } = useEdit();
  const { projects } = data;
  const [hovered, setHovered] = useState<string | null>(null);
  const pinnedCount = projects.filter((p) => p.pinned).length;

  return (
    <>
      <Navbar />
      <main className="min-h-screen max-w-5xl mx-auto px-6 pt-24 pb-24">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-20 pt-10"
        >
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-text transition-colors mb-12 group"
          >
            <ArrowLeft size={13} className="group-hover:-translate-x-0.5 transition-transform" />
            Home
          </Link>

          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-xs text-muted tracking-widest uppercase mb-4">Work</p>
              <h1 className="text-5xl md:text-7xl font-bold tracking-tighter leading-[0.9]">
                All<br />
                <span className="text-accent">Projects.</span>
              </h1>
            </div>
            {isEditing && (
              <p className="text-xs text-muted pb-2 shrink-0">
                <span className={pinnedCount >= 3 ? "text-accent" : "text-text"}>
                  {pinnedCount}
                </span>
                <span className="text-muted">/3 pinned to home</span>
              </p>
            )}
          </div>
        </motion.div>

        {/* Projects list */}
        <div className="border-t border-border">
          {projects.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: i * 0.06 }}
              onMouseEnter={() => !isEditing && setHovered(p.id)}
              onMouseLeave={() => !isEditing && setHovered(null)}
              className="border-b border-border py-8 group"
            >
              <div className="flex items-start gap-6 md:gap-10">
                {/* Number */}
                <span
                  className={`text-xs font-mono pt-1.5 shrink-0 w-6 transition-colors duration-300 ${
                    p.pinned ? "text-accent" : hovered === p.id ? "text-accent" : "text-muted"
                  }`}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>

                <div className="flex-1 min-w-0">
                  {/* Title row */}
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex items-center gap-3 flex-wrap">
                      <h2
                        className={`text-xl md:text-2xl font-semibold tracking-tight transition-colors duration-300 ${
                          hovered === p.id ? "text-accent" : "text-text"
                        }`}
                      >
                        <Editable value={p.title} field={`projects.${i}.title`} />
                      </h2>
                      {!isEditing && p.pinned && (
                        <span className="text-[10px] text-accent/50 border border-accent/20 rounded-full px-2 py-0.5 tracking-wide">
                          featured
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 shrink-0 pt-1">
                      {isEditing ? (
                        <>
                          <button
                            onClick={() => togglePin(p.id)}
                            title={p.pinned ? "Unpin from home" : pinnedCount >= 3 ? "Max 3 pinned" : "Pin to home"}
                            className={`p-1.5 rounded-md transition-colors ${
                              p.pinned
                                ? "text-accent bg-accent/10 hover:bg-accent/20"
                                : pinnedCount >= 3
                                ? "text-muted/30 cursor-not-allowed"
                                : "text-muted hover:text-text hover:bg-surface"
                            }`}
                          >
                            {p.pinned ? <Pin size={14} /> : <PinOff size={14} />}
                          </button>
                          <button
                            onClick={() => removeProject(p.id)}
                            className="p-1.5 rounded-md text-muted hover:text-red-400 hover:bg-red-400/10 transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                        </>
                      ) : (
                        <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          {p.live !== "#" && (
                            <a
                              href={p.live}
                              target="_blank"
                              rel="noreferrer"
                              className="flex items-center gap-1 text-xs text-muted hover:text-text transition-colors"
                            >
                              Live <ArrowUpRight size={11} />
                            </a>
                          )}
                          {p.code !== "#" && (
                            <a
                              href={p.code}
                              target="_blank"
                              rel="noreferrer"
                              className="flex items-center gap-1 text-xs text-muted hover:text-text transition-colors"
                            >
                              Code <ArrowUpRight size={11} />
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Description */}
                  <Editable
                    value={p.description}
                    field={`projects.${i}.description`}
                    block
                    className="text-sm text-muted leading-relaxed mb-4 max-w-2xl"
                  />

                  {/* Tech */}
                  <Editable
                    value={p.tech}
                    field={`projects.${i}.tech`}
                    className="text-xs text-muted/50 tracking-wide"
                  />

                  {/* URL inputs in edit mode */}
                  {isEditing && (
                    <div className="mt-4 flex flex-col gap-1.5 max-w-sm">
                      <label className="flex items-center gap-3">
                        <span className="text-[10px] text-muted uppercase tracking-wider w-10 shrink-0">Live</span>
                        <input
                          type="text"
                          defaultValue={p.live}
                          onBlur={(e) => updateField(`projects.${i}.live`, e.target.value)}
                          placeholder="https://..."
                          className="text-xs bg-transparent border-b border-border focus:border-accent/60 outline-none text-text placeholder:text-muted/30 w-full pb-0.5 transition-colors"
                        />
                      </label>
                      <label className="flex items-center gap-3">
                        <span className="text-[10px] text-muted uppercase tracking-wider w-10 shrink-0">Code</span>
                        <input
                          type="text"
                          defaultValue={p.code}
                          onBlur={(e) => updateField(`projects.${i}.code`, e.target.value)}
                          placeholder="https://..."
                          className="text-xs bg-transparent border-b border-border focus:border-accent/60 outline-none text-text placeholder:text-muted/30 w-full pb-0.5 transition-colors"
                        />
                      </label>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Add project */}
        {isEditing && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={addProject}
            className="mt-6 flex items-center gap-2 text-sm text-muted hover:text-text border border-dashed border-border hover:border-muted/40 rounded-lg px-4 py-3 w-full justify-center transition-colors"
          >
            <Plus size={14} />
            Add project
          </motion.button>
        )}
      </main>
    </>
  );
}
