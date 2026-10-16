// Palette definitions for 3D Tunnel & Hero Theme
// Perfectly aligned with the Marquee section (LogoWall.tsx):
// Deep plum, rich orchid facets (#4A0E3C, #8E1C6B), deep black-plum (#0B0A0F), and glowing seam rays (#D93D94)

export const PALETTE = {
  bgDeep: 0x0b0a0f,       // #0B0A0F - Marquee section base black
  plumDark: 0x1a071e,     // #1A071E - Deep plum shadow
  plumMid: 0x2d0b2b,      // #2D0B2B - Mid plum tone from marquee
  plumRich: 0x4a0e3c,     // #4A0E3C - Vibrant marquee plum facet
  orchidAccent: 0x8e1c6b, // #8E1C6B - Bright marquee orchid slice
  ribbonBlack: 0x100414,  // #100414 - Sleek dark black layer for alternating contrast
  magenta400: 0xd93d94,   // #D93D94 - Marquee glowing seam ray & gate rings
  magenta300: 0xff66cc,   // #FF66CC - Light magenta beam pulse tail
  lavenderHead: 0xffffff, // #FFFFFF - Pure white beam pulse head
  ctaPink: 0xff3388,      // #FF3388 - Existing site CTA pink
} as const;

export const PALETTE_HEX = {
  bgDeep: '#0b0a0f',
  plumDark: '#1a071e',
  plumMid: '#2d0b2b',
  plumRich: '#4a0e3c',
  orchidAccent: '#8e1c6b',
  ribbonBlack: '#100414',
  magenta400: '#d93d94',
  magenta300: '#ff66cc',
  ctaPink: '#ff3388',
} as const;

