"use client";

import { motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";

const stats = [
  { value: 74, suffix: "%", label: "Lead enrichment rate", suffixColor: "#D93D94" },
  { value: 33, suffix: "%", label: "Average response rate", suffixColor: "#F452AF" },
  { value: 3, suffix: " hrs", label: "Reply detection speed", suffixColor: "#D93D94" },
  { value: 24, suffix: " days", label: "Pipeline cycle reduction", suffixColor: "#F452AF" },
];

function AnimatedCounter({
  value,
  suffix,
  suffixColor,
  inView,
}: {
  value: number;
  suffix: string;
  suffixColor: string;
  inView: boolean;
}) {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (!inView || hasAnimated) return;
    if (reduce) {
      setCount(value);
      setHasAnimated(true);
      return;
    }

    const duration = 1500;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const start = Math.floor(eased * value);
      setCount(start);
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setHasAnimated(true);
      }
    };
    requestAnimationFrame(animate);
  }, [inView, value, reduce, hasAnimated]);

  return (
    <span>
      <span className="text-white font-extrabold">{count}</span>
      <span style={{ color: suffixColor }} className="text-3xl md:text-4xl font-extrabold ml-0.5">
        {suffix}
      </span>
    </span>
  );
}

export function Stats() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} className="relative py-20 bg-transparent text-white z-10 border-y border-white/10">
      <div className="max-w-[var(--max-width)] mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 text-center">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={reduce ? false : { opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="p-6 rounded-2xl bg-[#0B0A0F]/60 backdrop-blur-md border border-white/10 hover:border-[#D93D94]/30 transition-all duration-300"
            >
              <div className="font-sans font-bold text-4xl sm:text-5xl tracking-tight">
                <AnimatedCounter
                  value={stat.value}
                  suffix={stat.suffix}
                  suffixColor={stat.suffixColor}
                  inView={inView}
                />
              </div>
              <p className="mt-2.5 font-mono font-medium text-xs tracking-wider uppercase text-slate-400">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
