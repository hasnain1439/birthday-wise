import { seeded } from "@/lib/random";

const rand = seeded(7);
const SPARKS = Array.from({ length: 28 }, () => ({
  left: rand() * 100,
  top: rand() * 100,
  size: 1 + rand() * 2.5,
  delay: rand() * 6,
  duration: 4 + rand() * 6,
  color: rand() > 0.66 ? "var(--gold)" : rand() > 0.5 ? "var(--rose)" : "var(--primary-bright)",
}));

const BALLOONS = [
  { left: "4%", top: "22%", size: 34, color: "var(--primary)", delay: "0s" },
  { left: "91%", top: "16%", size: 28, color: "var(--rose)", delay: "1.4s" },
  { left: "84%", top: "62%", size: 36, color: "var(--gold)", delay: "2.6s" },
  { left: "9%", top: "74%", size: 26, color: "var(--cyan)", delay: "1.9s" },
];

/** Fixed ambient backdrop: grid, glows, sparks and floating balloons. */
export function Background() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-grid" />
      <div className="absolute -top-40 left-1/2 h-[42rem] w-[42rem] -translate-x-1/2 rounded-full bg-primary/20 blur-[140px]" />
      <div className="absolute top-1/3 -left-40 h-[30rem] w-[30rem] rounded-full bg-rose/10 blur-[120px]" />
      <div className="absolute bottom-0 -right-40 h-[32rem] w-[32rem] rounded-full bg-gold/10 blur-[130px]" />
      {SPARKS.map((s, i) => (
        <span
          key={i}
          className="animate-float absolute rounded-full"
          style={{
            left: `${s.left}%`,
            top: `${s.top}%`,
            width: s.size,
            height: s.size,
            background: s.color,
            boxShadow: `0 0 ${s.size * 4}px ${s.color}`,
            opacity: 0.6,
            animation: `float ${s.duration}s ease-in-out ${s.delay}s infinite`,
          }}
        />
      ))}
      {BALLOONS.map((b, i) => (
        <span
          key={i}
          className="animate-float absolute hidden flex-col items-center opacity-40 md:flex"
          style={{ left: b.left, top: b.top, animation: `rise 8s ease-in-out ${b.delay} infinite` }}
        >
          <span
            className="rounded-[50%_50%_48%_48%/55%_55%_45%_45%]"
            style={{
              width: b.size,
              height: b.size * 1.2,
              background: `radial-gradient(circle at 30% 30%, #fff8, ${b.color} 45%)`,
            }}
          />
          <span className="h-12 w-px bg-white/30" />
        </span>
      ))}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,var(--bg)_100%)]" />
    </div>
  );
}
