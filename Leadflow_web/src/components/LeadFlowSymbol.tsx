"use client";

interface LeadFlowSymbolProps {
  className?: string;
}

export function LeadFlowSymbol({ className = "w-12 h-12" }: LeadFlowSymbolProps) {
  return (
    <svg
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="lfFunnelGrad" x1="20%" y1="0%" x2="80%" y2="100%">
          <stop offset="0%" stopColor="#185ADB" />
          <stop offset="70%" stopColor="#1448B0" />
          <stop offset="100%" stopColor="#0F3585" />
        </linearGradient>
        <linearGradient id="lfArrowGrad" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#FEB43D" />
          <stop offset="60%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#D97706" />
        </linearGradient>
        <linearGradient id="lfRimGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#60A5FA" />
          <stop offset="100%" stopColor="#185ADB" />
        </linearGradient>
      </defs>

      {/* Funnel Body (Conical Sections) */}
      <path
        d="M 22 34 L 40 76 L 68 76 L 86 34 Z"
        fill="url(#lfFunnelGrad)"
      />
      
      {/* Lower Funnel Tip */}
      <polygon
        points="43,80 54,102 65,80"
        fill="#0F2C6E"
      />

      {/* Top Oval Rim */}
      <ellipse
        cx="54"
        cy="34"
        rx="34"
        ry="10.5"
        fill="url(#lfRimGrad)"
      />
      <ellipse
        cx="54"
        cy="34"
        rx="28"
        ry="7.5"
        fill="#0D1E42"
        opacity="0.9"
      />

      {/* Orbiting Curved Arrow looping around the funnel cone */}
      <path
        d="M 18 84 C 18 94, 86 96, 92 84 C 95 78, 86 70, 72 68"
        stroke="url(#lfArrowGrad)"
        strokeWidth="6"
        strokeLinecap="round"
        fill="none"
      />
      {/* Arrowhead */}
      <polygon
        points="96,73 99,88 84,85"
        fill="#FEB43D"
      />
    </svg>
  );
}
