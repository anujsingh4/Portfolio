"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Download, Upload, Trash2, Loader } from "lucide-react";
import { useEdit } from "@/context/EditContext";
import { Editable } from "@/components/ui/Editable";
import { EditSection } from "@/components/ui/EditSection";

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay, ease: [0.25, 0.1, 0.25, 1] },
});

function ResumeManager() {
  const { data, setResumeUrl } = useEdit();
  const [status, setStatus] = useState<"idle" | "uploading" | "deleting">("idle");
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setStatus("uploading");
    const form = new FormData();
    form.append("file", file);
    const res = await fetch("/api/resume", { method: "POST", body: form });
    const json = await res.json();
    if (res.ok) setResumeUrl(json.url);
    setStatus("idle");
    if (inputRef.current) inputRef.current.value = "";
  }

  async function handleDelete() {
    if (!confirm("Remove resume from the site?")) return;
    setStatus("deleting");
    await fetch("/api/resume", { method: "DELETE" });
    setResumeUrl("");
    setStatus("idle");
  }

  const busy = status !== "idle";

  return (
    <div className="flex items-center gap-2">
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf"
        className="hidden"
        onChange={handleUpload}
      />
      <button
        onClick={() => inputRef.current?.click()}
        disabled={busy}
        className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border border-dashed border-accent/40 text-accent/70 hover:text-accent hover:border-accent/70 transition-colors disabled:opacity-40"
      >
        {status === "uploading" ? <Loader size={11} className="animate-spin" /> : <Upload size={11} />}
        {data.resumeUrl ? "Replace PDF" : "Upload PDF"}
      </button>
      {data.resumeUrl && (
        <button
          onClick={handleDelete}
          disabled={busy}
          className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border border-dashed border-red-400/30 text-red-400/50 hover:text-red-400 hover:border-red-400/60 transition-colors disabled:opacity-40"
        >
          {status === "deleting" ? <Loader size={11} className="animate-spin" /> : <Trash2 size={11} />}
          Remove
        </button>
      )}
    </div>
  );
}

export default function Hero() {
  const { data, isEditing } = useEdit();
  const { hero } = data;

  const socials = [
    { label: "GitHub",   field: "hero.githubHandle", value: hero.githubHandle, href: `https://${hero.githubHandle}` },
    { label: "LinkedIn", field: "hero.linkedinHandle", value: hero.linkedinHandle, href: `https://${hero.linkedinHandle}` },
    { label: "Email",    field: "hero.email", value: hero.email, href: `mailto:${hero.email}` },
  ];

  const resumeHref = data.resumeUrl || "/resume.pdf";

  return (
    <EditSection label="Hero">
      <section
        id="about"
        className="min-h-screen flex flex-col justify-between px-6 pt-28 pb-12 max-w-5xl mx-auto"
      >
        <motion.div
          {...fade(0.1)}
          className="flex items-center justify-between text-xs text-muted tracking-widest uppercase"
        >
          <Editable value={hero.role} field="hero.role" />
          <Editable value={hero.college} field="hero.college" />
        </motion.div>

        <div className="my-auto py-16">
          <div className="overflow-hidden">
            <motion.h1
              initial={{ y: "110%" }}
              animate={{ y: 0 }}
              transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="text-[clamp(4.5rem,14vw,12rem)] font-bold leading-[0.9] tracking-tighter text-text"
            >
              <Editable value={hero.firstName} field="hero.firstName" />
            </motion.h1>
          </div>
          <div className="overflow-hidden">
            <motion.h1
              initial={{ y: "110%" }}
              animate={{ y: 0 }}
              transition={{ duration: 0.9, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="text-[clamp(4.5rem,14vw,12rem)] font-bold leading-[0.9] tracking-tighter text-accent"
            >
              <Editable value={hero.lastName} field="hero.lastName" />
            </motion.h1>
          </div>

          <motion.div
            {...fade(0.7)}
            className="mt-10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6"
          >
            <Editable
              value={hero.bio}
              field="hero.bio"
              block
              className="text-muted max-w-sm leading-relaxed text-sm md:text-base"
            />

            <div className="flex flex-col items-end gap-3 shrink-0">
              <div className="flex items-center gap-6 flex-wrap justify-end">
                {socials.map(({ label, href }) => (
                  <a
                    key={label}
                    href={isEditing ? undefined : href}
                    target={!isEditing && label !== "Email" ? "_blank" : undefined}
                    rel="noreferrer"
                    className="group flex items-center gap-1 text-sm text-muted hover:text-text transition-colors"
                  >
                    {label}
                    {!isEditing && (
                      <ArrowUpRight size={13} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    )}
                  </a>
                ))}
                {!isEditing && (data.resumeUrl || true) && (
                  <a
                    href={resumeHref}
                    download
                    target="_blank"
                    rel="noreferrer"
                    className="group flex items-center gap-1.5 text-sm px-4 py-1.5 rounded-full bg-accent/10 border border-accent/30 text-accent hover:bg-accent/20 hover:border-accent/50 transition-colors"
                  >
                    <Download size={12} className="group-hover:-translate-y-0.5 transition-transform" />
                    Resume
                  </a>
                )}
              </div>

              {isEditing && <ResumeManager />}
            </div>
          </motion.div>
        </div>

        <motion.div
          {...fade(1.1)}
          className="flex items-center gap-3 text-xs text-muted tracking-widest uppercase"
        >
          <div className="w-8 h-px bg-border" />
          <span>Scroll to explore</span>
        </motion.div>
      </section>
    </EditSection>
  );
}
