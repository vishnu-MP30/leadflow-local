import { Navbar } from "@/components/Navbar";
import { SmoothScroll } from "@/components/SmoothScroll";
import { SpringCursorTrail } from "@/components/SpringCursorTrail";
import { Hero } from "@/components/Hero";
import { LogoWall } from "@/components/LogoWall";
import { Features } from "@/components/Features";
import { SecurityCompliance } from "@/components/SecurityCompliance";
import { FeatureStory } from "@/components/FeatureStory";
import { HowItWorks } from "@/components/HowItWorks";
import { WorkflowFaq } from "@/components/WorkflowFaq";
import { LandingCore3D } from "@/components/landing3d/LandingCore3D";
import { Stats } from "@/components/Stats";
import { Testimonials } from "@/components/Testimonials";
import { Pricing } from "@/components/Pricing";
import { CTA } from "@/components/CTA";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-[#0B0A0F] text-white selection:bg-[#D93D94] selection:text-white">
      {/* SMOOTH SCROLL CONTROLLER (Lenis for below-hero page navigation) */}
      <SmoothScroll />

      {/* SPRING-PHYSICS CURSOR TRAIL (Active in Pipeline Engine and downstream sections) */}
      <SpringCursorTrail />

      {/* LAYER B: DOM CONTENT LAYOUT (z-index: 10 / 20) */}
      <Navbar />

      <main className="relative z-10">
        {/* SECTION 1: HERO VIEW (Dark Canvas, Transparent backdrop) */}
        <Hero />

        {/* Social Proof Monochromatic Grid */}
        <LogoWall />

        {/* SECTION 2: DENSE METRICS & FEATURE MAPPING (Sliding Light Container Card) */}
        <Features />

        {/* SECTION 3: COMPLIANCE, SECURITY & TRUST BLOCK (Return to Dark Canvas) */}
        <SecurityCompliance />

        {/* SECTION 4: THE LEADFLOW PIPELINE ENGINE (Pinned Feature Story Scrollytelling) */}
        <FeatureStory />

        {/* HOW IT WORKS (Autonomous Architecture) */}
        <HowItWorks />

        {/* ── WORKFLOW & TRANSITION (ROUNDED PAVILION FLOATING OVER PRIMARY PURPLE) ── */}
        <div className="relative pt-10 sm:pt-16 pb-6 sm:pb-10 bg-gradient-to-b from-[#0B0A0F] via-[#140518] to-[#18051E]">
          {/* WORKFLOW & FAQ (From Prospect to Pipeline in 3 Steps + Accordion FAQs) */}
          <WorkflowFaq />
        </div>

        {/* ── 3D STRUCTURE THEME: METRICS, TESTIMONIALS & PRICING (UNIFIED ROTATING 3D CORE) ── */}
        <div className="relative overflow-hidden bg-[#18051E]">
          {/* Centered Rotating 3D Concentric Structure Backdrop with Atmospheric Aubergine Glow */}
          <LandingCore3D scale={0.78} />

          {/* STATS & METRICS */}
          <Stats />

          {/* TESTIMONIALS */}
          <Testimonials />

          {/* PRICING */}
          <Pricing />
        </div>

        {/* CTA */}
        <CTA />
      </main>

      <Footer />
    </div>
  );
}
