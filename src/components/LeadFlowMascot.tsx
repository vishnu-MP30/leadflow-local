"use client";

import { motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";

interface LeadFlowMascotProps {
  className?: string;
  activeStage?: number;
}

export function LeadFlowMascot({ className = "", activeStage = -1 }: LeadFlowMascotProps) {
  const reduce = useReducedMotion();
  const [isBlinking, setIsBlinking] = useState(false);

  // Random blink logic
  useEffect(() => {
    if (reduce) return;
    const blinkLoop = () => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 150);
      
      const nextBlink = 3000 + Math.random() * 4000;
      setTimeout(blinkLoop, nextBlink);
    };
    
    const timeout = setTimeout(blinkLoop, 2000);
    return () => clearTimeout(timeout);
  }, [reduce]);

  // Stage reaction animations
  const reactionVariants = {
    idle: { rotate: 0, y: 0, scale: 1 },
    research: { rotate: -8, y: -2, scale: 1.05, transition: { type: "spring" as const, stiffness: 400, damping: 15 } },
    draft: { rotate: 8, y: 2, scale: 1.05, transition: { type: "spring" as const, stiffness: 400, damping: 15 } },
    reply: { rotate: 0, y: -4, scale: 1.05, transition: { type: "spring" as const, stiffness: 400, damping: 15 } },
    meeting: { rotate: 0, y: -8, scale: 1.1, transition: { type: "spring" as const, bounce: 0.6, duration: 0.5 } }
  };

  const getStageState = () => {
    switch (activeStage) {
      case 0: return "research";
      case 1: return "draft";
      case 2: return "reply";
      case 3: return "meeting";
      default: return "idle";
    }
  };

  const currentState = getStageState();

  const floatAnimation = reduce ? {} : {
    y: ["-5%", "5%", "-5%"],
    transition: {
      duration: 3.5,
      repeat: Infinity,
      ease: "easeInOut" as const
    }
  };

  return (
    <motion.div 
      className={`relative ${className}`}
      animate={floatAnimation}
      aria-hidden="true"
    >
      <motion.div
        className="w-full h-full"
        animate={reduce ? "idle" : currentState}
        variants={reactionVariants}
      >
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-md">
          {/* Floating base shadow/ring */}
          <ellipse cx="50" cy="85" rx="16" ry="3" fill="#EAF0FF" />
          
          {/* Antennas */}
          <line x1="28" y1="20" x2="22" y2="8" stroke="#17243A" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="72" y1="20" x2="78" y2="8" stroke="#17243A" strokeWidth="2.5" strokeLinecap="round" />
          
          {/* Body Base */}
          <path d="M 30 55 Q 50 95 70 55 Z" fill="#FFFFFF" stroke="#17243A" strokeWidth="3" strokeLinejoin="round" />
          
          {/* Chest Accent Triangle */}
          <path d="M 44 60 L 56 60 L 50 70 Z" fill="none" stroke="#185ADB" strokeWidth="2" strokeLinejoin="round" />
          
          {/* Arm Left */}
          <path d="M 32 55 Q 22 65 26 75 Q 30 70 32 60" fill="#FFFFFF" stroke="#17243A" strokeWidth="2.5" strokeLinecap="round" />
          
          {/* Arm Right */}
          <path d="M 68 55 Q 78 65 74 75 Q 70 70 68 60" fill="#FFFFFF" stroke="#17243A" strokeWidth="2.5" strokeLinecap="round" />

          {/* Head */}
          <ellipse cx="50" cy="38" rx="34" ry="24" fill="#FFFFFF" stroke="#17243A" strokeWidth="3" />
          
          {/* Ears */}
          <rect x="12" y="28" width="6" height="18" rx="3" fill="#E6EEFF" stroke="#17243A" strokeWidth="2.5" />
          <rect x="82" y="28" width="6" height="18" rx="3" fill="#E6EEFF" stroke="#17243A" strokeWidth="2.5" />
          
          {/* Visor / Face Screen */}
          <path d="M 20 34 Q 50 24 80 34 Q 82 46 50 50 Q 18 46 20 34 Z" fill="#17243A" />

          {/* Forehead Blue Accent */}
          <path d="M 36 24 Q 50 20 64 24" fill="none" stroke="#185ADB" strokeWidth="2" strokeLinecap="round" />

          {/* Smile */}
          <path d="M 46 56 Q 50 58 54 56" fill="none" stroke="#17243A" strokeWidth="1.5" strokeLinecap="round" />

          {/* Eyes */}
          <motion.ellipse 
            cx="38" 
            cy="38" 
            rx="5" 
            ry="7" 
            fill="#E6EEFF" 
            stroke="#185ADB"
            strokeWidth="1.5"
            animate={{ scaleY: isBlinking ? 0.1 : 1 }}
            transition={{ duration: 0.1 }}
          />
          <motion.ellipse 
            cx="62" 
            cy="38" 
            rx="5" 
            ry="7" 
            fill="#E6EEFF" 
            stroke="#185ADB"
            strokeWidth="1.5"
            animate={{ scaleY: isBlinking ? 0.1 : 1 }}
            transition={{ duration: 0.1 }}
          />
        </svg>
      </motion.div>
    </motion.div>
  );
}
