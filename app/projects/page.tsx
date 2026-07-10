"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowUpRight, Pin, PinOff, Trash2, Plus, Github, X, Loader, Star } from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { useEdit } from "@/context/EditContext";
import { Editable } from "@/components/ui/Editable";
import { UrlInput } from "@/components/ui/UrlInput";

interface GhRepo {
  name: string;
  description: string;
  code: string;
  live: string;
  language: string;
  topics: string[];
  stars: number;
}

function prettify(name: string) {
  return name.replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function GitHubImporter() {
  const { data, addProject } = useEdit();
  const [open, setOpen] = useState(false);
  const [repos, setRepos] = useState<GhRepo[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const existingCodes = new Set(data.projects.map((p) => p.code));
  const username = data.hero.githubHandle.replace(/^github\.com\//, "").split("/")[0];

  async function fetchRepos() {
    setLoading(true);
    setError("");
    const res = await fetch(`/api/github?username=${username}`);
    if (!res.ok) { setError("Couldn't fetch repos. Check your GitHub handle."); setLoading(false); return; }
    setRepos(await res.json());
    setLoading(false);
    setOpen(true);
  }

  function toggle(name: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(name) ? next.delete(name) : next.add(name);
      return next;
    });
  }

  function importSelected() {
    repos
      .filter((r) => selected.has(r.name))
      .forEach((r) => {
        const tech = [r.language, ...r.topics].filter(Boolean).join(" · ");
        addProject({
          title: prettify(r.name),
          description: r.description || "Add a description for this project.",
          tech: tech || "See repo",
          live: r.live || "#",
          code: r.code,
        });
      });
    setSelected(new Set());
    setOpen(false);
  }

  return (
    <>
      <button
        onClick={fetchRepos}
        disabled={loading}
        className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border border-border text-muted hover:text-text hover:border-muted/40 transition-colors disabled:opacity-50"
      >
        {loading ? <Loader size={11} className="animate-spin" /> : <Github size={11} />}
        Import from GitHub
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ ease: [0.16, 1, 0.3, 1], duration: 0.35 }}
              className="fixed inset-x-4 top-16 bottom-16 md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-[560px] z-50 bg-[#1A1816] border border-border rounded-2xl flex flex-col overflow-hidden shadow-2xl"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-border shrink-0">
                <div>
                  <p className="text-sm font-medium text-text">Import from GitHub</p>
                  <p className="text-xs text-muted mt-0.5">{username} · {repos.length} public repos</p>
                </div>
                <button onClick={() => setOpen(false)} className="text-muted hover:text-text transition-colors">
                  <X size={16} />
                </button>
              </div>

              {/* Repo list */}
              <div className="flex-1 overflow-y-auto py-2">
                {error && <p className="text-xs text-red-400 px-5 py-3">{error}</p>}
                {repos.map((r) => {
                  const already = existingCodes.has(r.code);
                  const checked = selected.has(r.name);
                  return (
                    <button
                      key={r.name}
                      onClick={() => !already && toggle(r.name)}
                      disabled={already}
                      className={`w-full text-left px-5 py-3.5 border-b border-border/50 flex items-start gap-3 transition-colors ${
                        already ? "opacity-40 cursor-not-allowed" :
                        checked ? "bg-accent/5" : "hover:bg-surface/60"
                      }`}
                    >
                      <div className={`mt-0.5 w-4 h-4 rounded border shrink-0 flex items-center justify-center transition-colors ${
                        checked ? "bg-accent border-accent" : "border-border"
                      }`}>
                        {checked && <svg viewBox="0 0 10 8" className="w-2.5 h-2.5 fill-bg"><path d="M1 4l2.5 2.5L9 1"/></svg>}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm text-text font-medium">{r.name}</span>
                          {already && <span className="text-[10px] text-muted border border-border rounded-full px-1.5 py-0.5">added</span>}
                          {r.stars > 0 && (
                            <span className="flex items-center gap-0.5 text-[10px] text-muted">
                              <Star size={9} /> {r.stars}
                            </span>
                          )}
                        </div>
                        {r.description && <p className="text-xs text-muted mt-0.5 line-clamp-2">{r.description}</p>}
                        {r.language && <p className="text-[10px] text-muted/50 mt-1">{r.language}</p>}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Footer */}
              <div className="px-5 py-4 border-t border-border flex items-center justify-between shrink-0">
                <span className="text-xs text-muted">
                  {selected.size > 0 ? `${selected.size} selected` : "Select repos to import"}
                </span>
                <button
                  onClick={importSelected}
                  disabled={selected.size === 0}
                  className="flex items-center gap-1.5 text-sm px-4 py-2 rounded-full bg-accent/10 border border-accent/30 text-accent hover:bg-accent/20 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Plus size={13} />
                  Import {selected.size > 0 ? `(${selected.size})` : ""}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

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

          <div className="flex items-end justify-between gap-4 flex-wrap">
            <div>
              <p className="text-xs text-muted tracking-widest uppercase mb-4">Work</p>
              <h1 className="text-5xl md:text-7xl font-bold tracking-tighter leading-[0.9]">
                All<br />
                <span className="text-accent">Projects.</span>
              </h1>
            </div>
            <div className="flex items-center gap-3 pb-2 flex-wrap">
              {isEditing && <GitHubImporter />}
              {isEditing && (
                <p className="text-xs text-muted">
                  <span className={pinnedCount >= 3 ? "text-accent" : "text-text"}>{pinnedCount}</span>
                  <span className="text-muted">/3 pinned to home</span>
                </p>
              )}
            </div>
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
                <span className={`text-xs font-mono pt-1.5 shrink-0 w-6 transition-colors duration-300 ${
                  p.pinned ? "text-accent" : hovered === p.id ? "text-accent" : "text-muted"
                }`}>
                  {String(i + 1).padStart(2, "0")}
                </span>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex items-center gap-3 flex-wrap">
                      <h2 className={`text-xl md:text-2xl font-semibold tracking-tight transition-colors duration-300 ${
                        hovered === p.id ? "text-accent" : "text-text"
                      }`}>
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
                              p.pinned ? "text-accent bg-accent/10 hover:bg-accent/20"
                              : pinnedCount >= 3 ? "text-muted/30 cursor-not-allowed"
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
                            <a href={p.live} target="_blank" rel="noreferrer"
                              className="flex items-center gap-1 text-xs text-muted hover:text-text transition-colors">
                              Live <ArrowUpRight size={11} />
                            </a>
                          )}
                          {p.code !== "#" && (
                            <a href={p.code} target="_blank" rel="noreferrer"
                              className="flex items-center gap-1 text-xs text-muted hover:text-text transition-colors">
                              Code <ArrowUpRight size={11} />
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  <Editable value={p.description} field={`projects.${i}.description`} block
                    className="text-sm text-muted leading-relaxed mb-4 max-w-2xl" />
                  <Editable value={p.tech} field={`projects.${i}.tech`}
                    className="text-xs text-muted/50 tracking-wide" />

                  {isEditing && (
                    <div className="mt-4 flex flex-col gap-1.5 max-w-sm">
                      <label className="flex items-center gap-3">
                        <span className="text-[10px] text-muted uppercase tracking-wider w-10 shrink-0">Live</span>
                        <UrlInput value={p.live} field={`projects.${i}.live`} />
                      </label>
                      <label className="flex items-center gap-3">
                        <span className="text-[10px] text-muted uppercase tracking-wider w-10 shrink-0">Code</span>
                        <UrlInput value={p.code} field={`projects.${i}.code`} />
                      </label>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {isEditing && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => addProject()}
            className="mt-6 flex items-center gap-2 text-sm text-muted hover:text-text border border-dashed border-border hover:border-muted/40 rounded-lg px-4 py-3 w-full justify-center transition-colors"
          >
            <Plus size={14} />
            Add project manually
          </motion.button>
        )}
      </main>
    </>
  );
}
