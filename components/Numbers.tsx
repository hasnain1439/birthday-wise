"use client";

import { useEffect, useRef, useState } from "react";
import { animate, motion, useInView } from "framer-motion";
import { Bug, CalendarHeart, Clock, Coffee, type LucideIcon } from "lucide-react";
import { SectionHeading } from "@/components/SectionHeading";

const STATS: { icon: LucideIcon; value: number | null; suffix?: string; label: string; tone: string }[] = [
  { icon: CalendarHeart, value: 365, label: "days shipped this year", tone: "text-primary-bright" },
  { icon: Clock, value: 8760, label: "hours of being awesome", tone: "text-gold" },
  { icon: Coffee, value: null, label: "cups of chai & coffee", tone: "text-rose" },
  { icon: Bug, value: 0, label: "bugs in the birthday build", tone: "text-cyan" },
];

function Counter({ to }: { to: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const c = animate(0, to, { duration: 1.8, ease: "easeOut", onUpdate: (v) => setN(Math.round(v)) });
    return () => c.stop();
  }, [inView, to]);

  return <span ref={ref}>{n.toLocaleString("en-US")}</span>;
}

export function Numbers() {
  return (
    <section id="numbers" className="relative mx-auto max-w-6xl scroll-mt-24 px-4 py-20 sm:py-28">
      <SectionHeading eyebrow="// analytics" title="Another year," accent="by the numbers." />
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {STATS.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            whileHover={{ y: -6 }}
            className="glass rounded-2xl p-5 sm:p-6"
          >
            <s.icon className={`size-6 ${s.tone}`} />
            <div className="mt-4 text-3xl font-bold tracking-tight tabular-nums sm:text-5xl">
              {s.value === null ? "∞" : <Counter to={s.value} />}
            </div>
            <p className="mt-1 text-sm text-muted">{s.label}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
