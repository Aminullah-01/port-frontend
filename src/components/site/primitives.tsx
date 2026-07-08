import { motion, useInView } from "motion/react";
import { useEffect, useRef, useState, type ReactNode } from "react";

export function SectionHeading({ eyebrow, title, description }: { eyebrow?: string; title: string; description?: string }) {
  const isMultiline = description && description.includes("\n");
  return (
    <div className={`mx-auto ${isMultiline ? "max-w-3xl" : "max-w-2xl"} text-center`}>
      {eyebrow && (
        <div className="mb-4 inline-flex items-center rounded-full border bg-card/50 px-3 py-1 text-xs font-medium text-muted-foreground">
          {eyebrow}
        </div>
      )}
      <h2 className="text-3xl font-black tracking-tight sm:text-4xl md:text-5xl">
        {title}
      </h2>
      {description && (
        <p className={`mt-4 text-base text-muted-foreground sm:text-lg whitespace-pre-line ${isMultiline ? "text-left" : ""}`}>
          {description}
        </p>
      )}
    </div>
  );
}

export function FadeIn({ children, delay = 0, className }: { children: ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const start = performance.now();
    const dur = 1400;
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / dur);
      setN(Math.floor(to * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to]);
  return <span ref={ref}>{n}{suffix}</span>;
}

export function TypingText({ words, className }: { words: string[]; className?: string }) {
  const [i, setI] = useState(0);
  const [text, setText] = useState("");
  const [del, setDel] = useState(false);

  useEffect(() => {
    const w = words[i % words.length];
    const delay = del ? 50 : 90;
    const t = setTimeout(() => {
      if (!del) {
        setText(w.slice(0, text.length + 1));
        if (text.length + 1 === w.length) setTimeout(() => setDel(true), 1200);
      } else {
        setText(w.slice(0, text.length - 1));
        if (text.length - 1 === 0) { setDel(false); setI((v) => v + 1); }
      }
    }, delay);
    return () => clearTimeout(t);
  }, [text, del, i, words]);

  return <span className={className}>{text}<span className="ml-1 inline-block h-[1em] w-[2px] animate-pulse bg-current align-middle" /></span>;
}

export function AnimatedBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-hero" />
      <div className="absolute -top-40 -left-20 h-96 w-96 rounded-full bg-primary/20 blur-3xl animate-blob" />
      <div className="absolute top-40 -right-20 h-[28rem] w-[28rem] rounded-full bg-accent/20 blur-3xl animate-blob" style={{ animationDelay: "5s" }} />
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(circle, currentColor 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
    </div>
  );
}
