import { Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="mx-auto max-w-6xl px-4 pt-10 pb-12">
      <div className="flex flex-col items-center gap-4 border-t border-line pt-10 text-center">
        <p className="font-serif text-3xl italic text-gradient-gold sm:text-4xl">Happy Birthday, Usama 🎂</p>
        <p className="max-w-md text-sm text-muted">May this year be your best release yet — full of joy, success and people who love you.</p>
        <p className="flex items-center gap-1.5 font-mono text-xs text-white/30">
          made with <Heart className="size-3.5 fill-rose text-rose" /> by friends · built with Next.js
        </p>
      </div>
    </footer>
  );
}
