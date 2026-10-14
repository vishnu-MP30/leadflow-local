"use client";

import { motion, useReducedMotion } from "motion/react";
import { Quotes, Star } from "@phosphor-icons/react/dist/ssr";

const testimonials = [
  {
    quote:
      "We replaced three disparate tools and two SDRs worth of manual research. LeadFlow doubled our outbound conversion rate in our first 30 days.",
    name: "Priya Sharma",
    role: "VP Sales, CloudSync",
    stats: "+142% CONVERSION",
  },
  {
    quote:
      "The AI follow-ups genuinely sound human and context-aware. Prospects frequently reply asking which member of our sales leadership wrote the note.",
    name: "James Ortiz",
    role: "Head of Growth, Paylix",
    stats: "38% REPLY RATE",
  },
  {
    quote:
      "Setting up took under 15 minutes. Our very first automated campaign generated 14 qualified executive meetings from 200 targeted enterprise accounts.",
    name: "Elena Marsh",
    role: "Founder, Reachbase",
    stats: "$420K PIPELINE",
  },
];

export function Testimonials() {
  const reduce = useReducedMotion();

  return (
    <section className="relative z-10 py-28 md:py-36 bg-transparent text-white overflow-hidden">
      <div className="max-w-[var(--max-width)] mx-auto px-6">
        {/* Header */}
        <div className="max-w-2xl mb-16 md:mb-20">
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#D93D94]/30 bg-[#1F102E]/60 backdrop-blur-md mb-4"
          >
            <span className="w-2 h-2 rounded-full bg-[#D93D94]" />
            <span className="font-mono font-medium text-xs tracking-wider uppercase text-white">
              VERIFIED CUSTOMER IMPACT
            </span>
          </motion.div>

          <motion.h2
            initial={reduce ? false : { opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="font-sans font-bold text-3xl md:text-4xl lg:text-5xl tracking-tight text-white text-balance"
          >
            Teams close more pipeline,{" "}
            <span className="text-[#D93D94]">not more busywork</span>.
          </motion.h2>
        </div>

        {/* 3-column testimonial grid with dark obsidian cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {testimonials.map((t, idx) => (
            <motion.div
              key={t.name}
              initial={reduce ? false : { opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: idx * 0.1, ease: "easeOut" }}
              className="p-8 rounded-3xl bg-[#0B0A0F]/70 backdrop-blur-xl border border-white/10 hover:border-[#D93D94]/40 hover:shadow-[0_15px_35px_-10px_rgba(217,61,148,0.25)] transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-10 h-10 rounded-xl bg-[#1F102E] border border-[#D93D94]/30 flex items-center justify-center text-[#D93D94]">
                    <Quotes size={22} weight="fill" />
                  </div>
                  <span className="font-mono font-medium text-xs tracking-wider uppercase text-[#D93D94] bg-[#1F102E]/80 border border-[#D93D94]/30 px-3 py-1 rounded-full">
                    {t.stats}
                  </span>
                </div>

                <p className="font-sans font-normal text-base leading-relaxed text-slate-300 italic">
                  "{t.quote}"
                </p>
              </div>

              <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between">
                <div>
                  <div className="font-sans font-bold text-sm text-white group-hover:text-[#D93D94] transition-colors">
                    {t.name}
                  </div>
                  <div className="font-sans font-normal text-xs text-slate-400 mt-0.5">{t.role}</div>
                </div>

                <div className="flex items-center gap-1 text-[#D93D94]">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={13} weight="fill" />
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
