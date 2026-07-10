"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Pencil, Check, X } from "lucide-react";
import { useEdit } from "@/context/EditContext";

const EDIT_PASSWORD = process.env.NEXT_PUBLIC_EDIT_PASSWORD ?? "anuj2026";

export default function EditBar() {
  const { isEditing, toggleEdit } = useEdit();
  const [showModal, setShowModal] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Apply/remove the dot-grid background on the body
  useEffect(() => {
    if (isEditing) {
      document.body.setAttribute("data-editing", "true");
    } else {
      document.body.removeAttribute("data-editing");
    }
    return () => document.body.removeAttribute("data-editing");
  }, [isEditing]);

  useEffect(() => {
    if (showModal) setTimeout(() => inputRef.current?.focus(), 50);
  }, [showModal]);

  const openModal = () => {
    setPassword("");
    setError(false);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setPassword("");
    setError(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === EDIT_PASSWORD) {
      closeModal();
      toggleEdit();
    } else {
      setError(true);
      setPassword("");
      inputRef.current?.focus();
    }
  };

  const handleEditClick = () => {
    if (isEditing) toggleEdit();
    else openModal();
  };

  return (
    <>
      {/* ── Editor toolbar ─────────────────────────────── */}
      <AnimatePresence>
        {isEditing && (
          <motion.div
            initial={{ y: -56 }}
            animate={{ y: 0 }}
            exit={{ y: -56 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="fixed top-0 left-0 right-0 z-[200] h-14 bg-[#1C1A17] border-b border-accent/20 flex items-center px-6 gap-6"
          >
            {/* Mode badge */}
            <div className="flex items-center gap-2 shrink-0">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span className="text-xs font-mono tracking-widest text-accent uppercase">
                Editing
              </span>
            </div>

            <div className="w-px h-4 bg-border shrink-0" />

            {/* Hint */}
            <p className="text-xs text-muted hidden sm:block">
              Click any underlined text to edit · changes save automatically
            </p>

            {/* Spacer */}
            <div className="flex-1" />

            {/* Done */}
            <button
              onClick={toggleEdit}
              className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent text-bg text-xs font-semibold hover:opacity-90 transition-opacity"
            >
              <Check size={12} />
              Done editing
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Floating toggle ─────────────────────────────── */}
      <motion.button
        onClick={handleEditClick}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.8, duration: 0.4 }}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        className={`fixed bottom-6 right-6 z-[100] flex items-center gap-2 px-4 py-2.5 rounded-full border text-sm transition-colors duration-200 ${
          isEditing
            ? "bg-accent text-bg border-accent font-semibold"
            : "bg-surface border-border text-muted hover:text-text hover:border-muted/40"
        }`}
      >
        {isEditing ? <Check size={14} /> : <Pencil size={14} />}
        {isEditing ? "Done" : "Edit page"}
      </motion.button>

      {/* ── Password modal ──────────────────────────────── */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-[300] flex items-center justify-center bg-black/70 backdrop-blur-sm px-4"
            onClick={closeModal}
          >
            <motion.form
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              onSubmit={handleSubmit}
              className="w-full max-w-sm bg-surface border border-border rounded-2xl p-7 flex flex-col gap-5"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-text font-semibold text-base mb-1">
                    Enter password
                  </h3>
                  <p className="text-muted text-xs">Required to edit this page.</p>
                </div>
                <button
                  type="button"
                  onClick={closeModal}
                  className="p-1 text-muted hover:text-text transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="flex flex-col gap-1.5">
                <input
                  ref={inputRef}
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError(false);
                  }}
                  onKeyDown={(e) => e.key === "Escape" && closeModal()}
                  placeholder="Password"
                  className={`w-full bg-bg border rounded-lg px-4 py-2.5 text-sm text-text placeholder:text-muted/40 outline-none transition-colors ${
                    error
                      ? "border-red-500/50 focus:border-red-500/70"
                      : "border-border focus:border-muted/50"
                  }`}
                />
                <AnimatePresence>
                  {error && (
                    <motion.p
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="text-xs text-red-400/80"
                    >
                      Incorrect password. Try again.
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 py-2.5 rounded-lg border border-border text-muted text-sm hover:text-text transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-lg bg-accent text-bg text-sm font-semibold hover:opacity-90 transition-opacity"
                >
                  Unlock
                </button>
              </div>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
