"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col justify-between px-6 pt-28 pb-12 max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="text-xs text-muted tracking-widest uppercase"
      >
        404
      </motion.div>

      <div className="my-auto">
        <div className="overflow-hidden">
          <motion.h1
            initial={{ y: "110%" }}
            animate={{ y: 0 }}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-[clamp(4.5rem,14vw,12rem)] font-bold leading-[0.9] tracking-tighter text-text"
          >
            Lost.
          </motion.h1>
        </div>

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-muted max-w-sm leading-relaxed text-sm md:text-base mt-10 mb-10"
        >
          This page doesn't exist. Might have been moved, deleted, or never built in the first place.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <Link
            href="/"
            className="group inline-flex items-center gap-1.5 text-sm text-muted hover:text-text transition-colors"
          >
            <span className="w-5 h-px bg-muted/40 group-hover:w-8 group-hover:bg-text transition-all duration-300" />
            Back home
            <ArrowUpRight size={13} className="opacity-0 group-hover:opacity-100 transition-opacity" />
          </Link>
        </motion.div>
      </div>

      <div className="flex items-center gap-3 text-xs text-muted/30 tracking-widest uppercase">
        <div className="w-8 h-px bg-border" />
        <span>Anuj Singh</span>
      </div>
    </main>
  );
}
