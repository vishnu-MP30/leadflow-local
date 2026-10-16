"use client";

import { motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import { Check, ArrowRight, Sparkle } from "@phosphor-icons/react/dist/ssr";

const plans = [
  {
    name: "Starter",
    tag: "ENTRY TIER",
    price: "$19",
    period: "/MONTH",
    description: "For individual reps testing outbound workflows",
    features: [
      "500 verified leads per month",
      "LinkedIn + Email multi-channel outreach",
      "AI contextual dossier synthesis",
      "4-touch smart follow-up cadence",
      "Basic pipeline analytics",
    ],
    cta: "Start Free",
    featured: false,
  },
  {
    name: "Growth",
    tag: "REVENUE ENGINE",
    price: "$79",
    period: "/MONTH",
    description: "For revenue teams scaling outbound conversations",
    features: [
      "5,000 verified leads per month",
      "Priority smart send windows",
      "Advanced objection & intent classifier",
      "Autonomous meeting booking engine",
      "Full CRM two-way sync (HubSpot, Salesforce)",
      "Automated mailbox warmup & DNS defense",
    ],
    cta: "Start 14-Day Trial",
    featured: true,
  },
  {
    name: "Enterprise",
    tag: "CUSTOM INFRA",
    price: "Custom",
    period: "",
    description: "Multi-seat revenue engines and dedicated VPC infrastructure",
    features: [
      "Unlimited prospect enrichment",
      "Custom fine-tuned agent heuristics",
      "Dedicated IP pools & private VPC",
      "SAML 2.0 / SSO & RBAC permissions",
      "Custom integrations & webhook streams",
      "Dedicated solutions architect + 99.999% SLA",
    ],
    cta: "Contact Enterprise",
    featured: false,
  },
];

export function Pricing() {
  const reduce = useReducedMotion();

  return (
    <section id="pricing" className="relative z-10 py-28 md:py-36 bg-transparent text-white overflow-hidden">
      <div className="max-w-[var(--max-width)] mx-auto px-6">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 md:mb-20">
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#D93D94]/30 bg-[#1F102E]/60 backdrop-blur-md mb-4"
          >
            <Sparkle size={14} weight="fill" className="text-[#D93D94]" />
            <span className="font-mono font-medium text-xs tracking-wider uppercase text-white">
              TRANSPARENT VALUE
            </span>
          </motion.div>

          <motion.h2
            initial={reduce ? false : { opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="font-sans font-bold text-3xl md:text-4xl lg:text-5xl tracking-tight text-white text-balance"
          >
            Predictable pricing for{" "}
            <span className="text-[#D93D94] drop-shadow-[0_0_25px_rgba(217,61,148,0.6)]">
              unpredictable growth
            </span>.
          </motion.h2>

          <motion.p
            initial={reduce ? false : { opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
            className="mt-4 font-sans font-normal text-base text-slate-400"
          >
            Every plan includes autonomous account research, email deliverability warmup, and calendar booking.
          </motion.p>
        </div>

        {/* Pricing Cards Grid (Pure White Standout Cards) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch max-w-6xl mx-auto">
          {plans.map((plan, idx) => (
            <motion.div
              key={plan.name}
              initial={reduce ? false : { opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: idx * 0.1, ease: "easeOut" }}
              className={`relative bg-[#FFFFFF] text-[#0B1B3D] p-8 sm:p-9 rounded-[28px] sm:rounded-[32px] flex flex-col justify-between transition-all duration-300 ${
                plan.featured
                  ? "border-2 border-[#D93D94] shadow-[0_25px_60px_rgba(0,0,0,0.6),0_0_40px_rgba(217,61,148,0.35)] md:-translate-y-3 hover:-translate-y-4"
                  : "border border-slate-200/90 shadow-[0_20px_50px_rgba(0,0,0,0.45)] hover:-translate-y-1.5 hover:shadow-[0_25px_65px_rgba(0,0,0,0.55)] hover:border-slate-300"
              }`}
            >
              {plan.featured && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#D93D94] text-white font-mono font-bold text-[11px] px-4 py-1 rounded-full uppercase tracking-wider shadow-[0_4px_16px_rgba(217,61,148,0.5)] flex items-center gap-1.5 whitespace-nowrap z-20">
                  <Sparkle size={13} weight="fill" />
                  <span>MOST POPULAR</span>
                </div>
              )}

              <div>
                {/* Plan Header & Tier Tag */}
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-sans font-black text-2xl text-[#0B1B3D] tracking-tight">
                    {plan.name}
                  </h3>
                  <span
                    className={`font-mono text-[10px] tracking-wider uppercase px-2.5 py-0.5 rounded font-bold ${
                      plan.featured
                        ? "bg-[#FDF2F8] text-[#D93D94] border border-[#FBCFE8]"
                        : "bg-slate-100 text-[#64748B]"
                    }`}
                  >
                    {plan.tag}
                  </span>
                </div>

                <p className="font-sans font-normal text-xs text-[#64748B] mb-6 min-h-[32px] leading-relaxed">
                  {plan.description}
                </p>

                {/* Price & Currency */}
                <div className="flex items-baseline gap-1 pb-6 mb-6 border-b border-slate-100">
                  <span className="font-mono font-black text-4xl sm:text-5xl text-[#0B1B3D] tracking-tight">
                    {plan.price}
                  </span>
                  {plan.period && (
                    <span className="font-mono text-xs font-semibold text-[#64748B]">
                      {plan.period}
                    </span>
                  )}
                </div>

                {/* Features Included List */}
                <div className="space-y-3.5 mb-8">
                  <div
                    className={`font-mono font-bold text-xs uppercase tracking-wider ${
                      plan.featured ? "text-[#D93D94]" : "text-[#64748B]"
                    }`}
                  >
                    WHAT'S INCLUDED:
                  </div>
                  {plan.features.map((feat) => (
                    <div key={feat} className="flex items-start gap-3 font-sans font-normal text-xs sm:text-sm">
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                          plan.featured
                            ? "bg-[#FDF2F8] text-[#D93D94]"
                            : "bg-slate-100 text-[#0B1B3D]"
                        }`}
                      >
                        <Check size={12} weight="bold" />
                      </div>
                      <span className={plan.featured ? "text-[#0B1B3D] font-medium" : "text-[#334155]"}>
                        {feat}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action CTA Button */}
              <Link
                href="/contact"
                className={`font-sans w-full py-3.5 rounded-full text-center font-bold text-sm transition-all duration-200 flex items-center justify-center gap-2 group ${
                  plan.featured
                    ? "bg-[#D93D94] hover:bg-[#C52C82] text-white shadow-[0_8px_25px_rgba(217,61,148,0.45)] hover:shadow-[0_12px_35px_rgba(217,61,148,0.65)]"
                    : "bg-[#0B1B3D] hover:bg-[#16274E] text-white shadow-md hover:shadow-lg"
                }`}
              >
                <span>{plan.cta}</span>
                <ArrowRight size={14} weight="bold" className="transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
