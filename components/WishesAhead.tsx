"use client";

import { motion } from "framer-motion";
import { CodeXml, HeartPulse, Mountain, Sun, Trophy, Users, type LucideIcon } from "lucide-react";
import { OpenCakeButton } from "@/components/OpenCakeButton";
import { SectionHeading } from "@/components/SectionHeading";

const NOTES: { icon: LucideIcon; tag: string; title: string; body: string; tone: string }[] = [
  { icon: HeartPulse, tag: "feat", title: "Health & happiness", body: "Unlimited uptime for your smile, zero downtime for your health.", tone: "text-rose bg-rose/10" },
  { icon: Trophy, tag: "feat", title: "Big wins", body: "Every goal you set this year merged on the first try.", tone: "text-gold bg-gold/10" },
  { icon: CodeXml, tag: "perf", title: "Clean code, calm mind", body: "Green builds, clear reviews and problems that solve themselves.", tone: "text-cyan bg-cyan/10" },
  { icon: Users, tag: "feat", title: "Great people", body: "Friends and family who make every release worth celebrating.", tone: "text-primary-bright bg-primary/10" },
  { icon: Mountain, tag: "feat", title: "New adventures", body: "Fresh experiences, new places and memories worth keeping.", tone: "text-gold bg-gold/10" },
  { icon: Sun, tag: "fix", title: "Bright days", body: "Patched: stress. Removed: worries. Added: more good days.", tone: "text-rose bg-rose/10" },
];

export function WishesAhead() {
  return (
    <section id="wishes-ahead" className="relative mx-auto max-w-6xl scroll-mt-24 px-4 py-20 sm:py-28">
      <SectionHeading
        eyebrow="// CHANGELOG.md"
        title="Release notes for"
        accent="the year ahead."
        description="What we're wishing for in Usama's next version."
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {NOTES.map((n, i) => (
          <motion.article
            key={n.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: (i % 3) * 0.08 }}
            whileHover={{ y: -6 }}
            className="glass group rounded-2xl p-6 transition-colors hover:border-white/20"
          >
            <div className="flex items-center justify-between">
              <span className={`flex size-11 items-center justify-center rounded-xl ${n.tone}`}>
                <n.icon className="size-5" />
              </span>
              <span className="font-mono text-[11px] text-muted">{n.tag}:</span>
            </div>
            <h3 className="mt-5 text-lg font-semibold">{n.title}</h3>
            <p className="mt-1.5 text-sm text-pretty text-muted">{n.body}</p>
          </motion.article>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.6 }}
        className="relative mt-16 overflow-hidden rounded-3xl border border-primary/30 bg-gradient-to-br from-primary/20 via-rose/10 to-gold/10 px-6 py-12 text-center sm:py-16"
      >
        <div aria-hidden className="rays absolute top-1/2 left-1/2 size-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-60" />
        <h3 className="relative text-3xl font-bold tracking-tight text-balance sm:text-4xl">
          The candles are <span className="font-serif font-normal italic text-gradient-gold">still burning.</span>
        </h3>
        <p className="relative mx-auto mt-3 max-w-md text-muted">Make a wish and blow them out — a little surprise is waiting.</p>
        <OpenCakeButton label="Open the cake" className="relative mt-8" />
      </motion.div>
    </section>
  );
}
