"use client";

import { useSyncExternalStore } from "react";
import { motion } from "framer-motion";
import { Cake, Volume2, VolumeX } from "lucide-react";
import { useCake } from "@/components/Providers";
import { soundStore } from "@/lib/sound";

const LINKS = [
  { href: "#numbers", label: "Stats" },
  { href: "#terminal", label: "Terminal" },
  { href: "#wishes-ahead", label: "Wishes" },
  { href: "#wishes", label: "Guestbook" },
];

export function Nav() {
  const muted = useSyncExternalStore(soundStore.subscribe, soundStore.getSnapshot, soundStore.getServerSnapshot);
  const { openCake } = useCake();

  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed inset-x-0 top-0 z-50 px-4 pt-3 sm:pt-4"
    >
      <nav className="glass mx-auto flex max-w-5xl items-center justify-between gap-2 rounded-2xl px-4 py-2.5">
        <a href="#top" className="font-mono text-sm font-semibold tracking-tight">
          <span className="text-primary-bright">~/</span>usama<span className="text-gold">.bday</span>
        </a>
        <ul className="hidden items-center gap-1 md:flex">
          {LINKS.map((l) => (
            <li key={l.href}>
              <a href={l.href} className="rounded-lg px-3 py-1.5 text-sm text-muted transition-colors hover:bg-white/5 hover:text-fg">
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={soundStore.toggle}
            aria-label={muted ? "Unmute sound effects" : "Mute sound effects"}
            aria-pressed={!muted}
            className="rounded-lg border border-line p-2 text-muted transition-colors hover:border-primary/50 hover:text-fg"
          >
            {muted ? <VolumeX className="size-4" /> : <Volume2 className="size-4 text-primary-bright" />}
          </button>
          <button
            type="button"
            onClick={openCake}
            className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-primary to-rose px-3 py-1.5 text-sm font-semibold text-white"
          >
            <Cake className="size-4" /> Cake
          </button>
        </div>
      </nav>
    </motion.header>
  );
}
