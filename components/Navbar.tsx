"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const links = [
  { label: "Work", href: "#projects", id: "projects" },
  { label: "Stack", href: "#skills", id: "skills" },
  { label: "Contact", href: "#contact", id: "contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const sections = links.map((l) => document.getElementById(l.id)).filter(Boolean) as HTMLElement[];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <motion.header
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-0 left-0 right-0 z-50 px-4 pt-3.5"
      >
        <div
          className={`max-w-5xl mx-auto flex items-center justify-between transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            scrolled
              ? "px-5 py-2.5 rounded-full border border-border bg-[#1A1816]/90 backdrop-blur-md shadow-[0_4px_24px_rgba(0,0,0,0.35)]"
              : "px-2 py-4"
          }`}
        >
          {/* Logo */}
          <a
            href="#"
            className="group flex items-center gap-2.5 shrink-0"
          >
            <span
              className={`w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-bold tracking-tight transition-colors duration-300 ${
                scrolled
                  ? "bg-accent/15 text-accent"
                  : "bg-border/60 text-text/70 group-hover:bg-accent/15 group-hover:text-accent"
              }`}
            >
              A
            </span>
            <span
              className={`text-sm font-medium tracking-wide transition-all duration-300 ${
                scrolled ? "text-text/70 text-xs" : "text-text"
              }`}
            >
              {scrolled ? "Anuj Singh" : "Anuj Singh"}
            </span>
          </a>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className={`relative text-sm px-3.5 py-1.5 rounded-full transition-colors duration-200 ${
                  active === l.id
                    ? "text-text"
                    : "text-muted hover:text-text"
                }`}
              >
                {active === l.id && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-full bg-border/60"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="relative">{l.label}</span>
              </a>
            ))}
          </nav>

          {/* Right CTA */}
          <a
            href="mailto:anujswork1@gmail.com"
            className={`hidden md:flex items-center gap-1.5 text-sm transition-colors duration-200 shrink-0 ${
              scrolled
                ? "text-muted hover:text-accent text-xs"
                : "text-muted hover:text-accent"
            }`}
          >
            <span
              className="w-1.5 h-1.5 rounded-full bg-accent/70 animate-pulse"
            />
            Available
          </a>

          {/* Mobile hamburger */}
          <button
            onClick={() => setOpen((o) => !o)}
            className="md:hidden flex flex-col gap-[5px] p-1.5 rounded-lg hover:bg-border/40 transition-colors"
            aria-label="Menu"
          >
            <motion.span
              animate={open ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }}
              transition={{ duration: 0.2 }}
              className="block w-4.5 h-px bg-text origin-center"
              style={{ width: 18 }}
            />
            <motion.span
              animate={open ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
              transition={{ duration: 0.15 }}
              className="block h-px bg-text"
              style={{ width: 18 }}
            />
            <motion.span
              animate={open ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }}
              transition={{ duration: 0.2 }}
              className="block h-px bg-text origin-center"
              style={{ width: 18 }}
            />
          </button>
        </div>
      </motion.header>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-4 top-[70px] z-40 rounded-2xl border border-border bg-[#1A1816]/95 backdrop-blur-md overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.4)] md:hidden"
          >
            <div className="flex flex-col p-3 gap-1">
              {links.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className={`text-sm px-4 py-3 rounded-xl transition-colors ${
                    active === l.id
                      ? "text-text bg-border/60"
                      : "text-muted hover:text-text hover:bg-border/30"
                  }`}
                >
                  {l.label}
                </a>
              ))}
              <div className="h-px bg-border mx-1 my-1" />
              <a
                href="mailto:anujswork1@gmail.com"
                onClick={() => setOpen(false)}
                className="text-sm px-4 py-3 rounded-xl text-muted hover:text-accent hover:bg-border/30 transition-colors flex items-center gap-2"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-accent/70" />
                anujswork1@gmail.com
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
