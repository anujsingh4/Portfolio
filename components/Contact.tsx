"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Send, Check, AlertCircle } from "lucide-react";
import { useEdit } from "@/context/EditContext";
import { Editable } from "@/components/ui/Editable";
import { EditSection } from "@/components/ui/EditSection";

type FormState = "idle" | "loading" | "success" | "error";

function ContactForm() {
  const [state, setState] = useState<FormState>("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("loading");
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      setState("success");
      form.reset();
    } else {
      setState("error");
    }
  }

  if (state === "success") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-start gap-3 py-8"
      >
        <div className="w-9 h-9 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center">
          <Check size={16} className="text-accent" />
        </div>
        <p className="text-sm text-text">Message sent.</p>
        <p className="text-xs text-muted">I'll get back to you within a day.</p>
        <button
          onClick={() => setState("idle")}
          className="text-xs text-muted/50 hover:text-muted transition-colors mt-1"
        >
          Send another
        </button>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] text-muted uppercase tracking-widest">Name</label>
          <input
            name="name"
            required
            placeholder="Your name"
            className="bg-surface/60 border border-border rounded-lg px-3.5 py-2.5 text-sm text-text placeholder:text-muted/30 outline-none focus:border-accent/40 transition-colors"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] text-muted uppercase tracking-widest">Email</label>
          <input
            name="email"
            type="email"
            required
            placeholder="your@email.com"
            className="bg-surface/60 border border-border rounded-lg px-3.5 py-2.5 text-sm text-text placeholder:text-muted/30 outline-none focus:border-accent/40 transition-colors"
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-[10px] text-muted uppercase tracking-widest">Message</label>
        <textarea
          name="message"
          required
          rows={4}
          placeholder="What's on your mind?"
          className="bg-surface/60 border border-border rounded-lg px-3.5 py-2.5 text-sm text-text placeholder:text-muted/30 outline-none focus:border-accent/40 transition-colors resize-none"
        />
      </div>

      {state === "error" && (
        <p className="flex items-center gap-2 text-xs text-red-400">
          <AlertCircle size={12} />
          Something went wrong. Try emailing me directly.
        </p>
      )}

      <button
        type="submit"
        disabled={state === "loading"}
        className="self-start flex items-center gap-2 text-sm px-5 py-2.5 rounded-full bg-accent/10 border border-accent/30 text-accent hover:bg-accent/20 hover:border-accent/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {state === "loading" ? (
          <span className="w-3.5 h-3.5 border border-accent/40 border-t-accent rounded-full animate-spin" />
        ) : (
          <Send size={13} />
        )}
        {state === "loading" ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}

export default function Contact() {
  const { data, isEditing } = useEdit();
  const { contact, hero } = data;

  const links = [
    { label: "Email",    field: "hero.email",           value: hero.email,           href: `mailto:${hero.email}`,              external: false },
    { label: "GitHub",   field: "hero.githubHandle",    value: hero.githubHandle,    href: `https://${hero.githubHandle}`,      external: true  },
    { label: "LinkedIn", field: "hero.linkedinHandle",  value: hero.linkedinHandle,  href: `https://${hero.linkedinHandle}`,    external: true  },
  ];

  return (
    <EditSection label="Contact">
      <section id="contact" className="py-24 px-6 max-w-5xl mx-auto">
        <div className="border-t border-border pt-20 pb-12">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-xs text-muted tracking-widest uppercase mb-16"
          >
            Contact
          </motion.p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
            {/* Left — headline + links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight mb-4">
                <Editable value={contact.line1} field="contact.line1" />
                <br />
                <span className="text-accent">
                  <Editable value={contact.line2} field="contact.line2" />
                </span>
              </h2>

              <Editable
                value={contact.subtext}
                field="contact.subtext"
                block
                className="text-muted text-sm leading-relaxed mb-10 max-w-xs"
              />

              <div className="flex flex-col gap-3">
                {links.map(({ label, field, value, href, external }) => (
                  <div key={label} className="group inline-flex items-center gap-2 text-sm text-muted w-fit">
                    <span className="text-xs text-muted/40 w-16 shrink-0 tracking-wide">{label}</span>
                    {isEditing ? (
                      <Editable value={value} field={field} className="text-text/80 hover:text-text transition-colors" />
                    ) : (
                      <a
                        href={href}
                        target={external ? "_blank" : undefined}
                        rel={external ? "noreferrer" : undefined}
                        className="hover:text-text transition-colors inline-flex items-center gap-1"
                      >
                        {value}
                        <ArrowUpRight size={13} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Right — form */}
            {!isEditing && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              >
                <ContactForm />
              </motion.div>
            )}
          </div>

          <p className="mt-24 text-[11px] text-muted/30 tracking-wide">
            © 2026 Anuj Singh
          </p>
        </div>
      </section>
    </EditSection>
  );
}
