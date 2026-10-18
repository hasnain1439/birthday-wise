"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Gift, Sparkles } from "lucide-react";
import { sfx } from "@/lib/sound";

/** First screen on load: a single button that opens the birthday cake. */
export function WelcomeOverlay({ open, onEnter }: { open: boolean; onEnter: () => void }) {
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby="welcome-title"
          className="fixed inset-0 z-[70] flex items-center justify-center overflow-hidden bg-bg px-4"
          exit={{ opacity: 0, scale: 1.08, filter: "blur(10px)" }}
          transition={{ duration: 0.6 }}
        >
          <div aria-hidden className="absolute inset-0 bg-grid" />
          <div aria-hidden className="absolute top-1/2 left-1/2 h-[36rem] w-[36rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/25 blur-[140px]" />
          <div aria-hidden className="rays absolute top-1/2 left-1/2 size-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-70" />

          <div className="relative text-center">
            <motion.div
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 14, delay: 0.2 }}
              className="mx-auto flex size-28 items-center justify-center rounded-3xl bg-gradient-to-br from-primary via-rose to-gold shadow-[0_20px_60px_-10px_rgb(168_85_247/0.9)]"
            >
              <motion.span animate={{ rotate: [0, -12, 12, -8, 0], y: [0, -6, 0] }} transition={{ duration: 1.2, repeat: Infinity, repeatDelay: 1 }}>
                <Gift className="size-14 text-white" />
              </motion.span>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-8 flex items-center justify-center gap-2 font-mono text-xs tracking-[0.3em] text-primary-bright uppercase"
            >
              <Sparkles className="size-3.5" /> A surprise is waiting <Sparkles className="size-3.5" />
            </motion.p>
            <motion.h1
              id="welcome-title"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.65 }}
              className="mt-3 text-4xl font-bold tracking-tight sm:text-6xl"
            >
              Hey <span className="text-gradient-hero font-serif font-normal italic">Usama</span>,
              <br />
              this one&apos;s for you.
            </motion.h1>

            <motion.button
              type="button"
              autoFocus
              onClick={() => {
                sfx.pop();
                sfx.sparkle(10);
                onEnter();
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.96 }}
              className="group relative mt-10 inline-flex items-center gap-3 overflow-hidden rounded-2xl bg-gradient-to-r from-primary via-rose to-gold px-8 py-4 text-lg font-semibold text-white shadow-[0_18px_50px_-12px_rgb(168_85_247/0.9)]"
            >
              <span aria-hidden className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
              <Gift className="relative size-6" />
              <span className="relative">Open your surprise</span>
            </motion.button>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.3 }} className="mt-4 text-sm text-muted">
              🔊 Turn your sound on
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
