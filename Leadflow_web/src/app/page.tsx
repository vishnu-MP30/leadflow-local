import { Navbar } from "@/components/Navbar";
import { SmoothScroll } from "@/components/SmoothScroll";
import { Hero } from "@/components/Hero";
import { LogoWall } from "@/components/LogoWall";
import { Features } from "@/components/Features";
import { SecurityCompliance } from "@/components/SecurityCompliance";
import { PipelineVelocity } from "@/components/PipelineVelocity";
import { HowItWorks } from "@/components/HowItWorks";
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
        
        {/* CONTINUOUS PIPELINE VELOCITY (High-Speed Engine Telemetry) */}
        <PipelineVelocity />
        
        {/* HOW IT WORKS (Autonomous Architecture) */}
        <HowItWorks />
        
        {/* STATS & METRICS */}
        <Stats />
        
        {/* TESTIMONIALS */}
        <Testimonials />
        
        {/* PRICING */}
        <Pricing />
        
        {/* CTA */}
        <CTA />
      </main>

      <Footer />
    </div>
  );
}
