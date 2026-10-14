import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";

export const metadata: Metadata = {
  title: "LeadFlow AI — Intelligent Sales Outreach Automation",
  description:
    "Transform raw LinkedIn profiles into booked sales calls with zero manual intervention. AI-powered multi-channel outreach that respects lead dignity.",
  keywords: [
    "sales automation",
    "LinkedIn outreach",
    "AI sales",
    "lead generation",
    "B2B sales",
    "outreach automation",
  ],
  openGraph: {
    title: "LeadFlow AI — Intelligent Sales Outreach Automation",
    description:
      "Transform raw LinkedIn profiles into booked sales calls with zero manual intervention.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${GeistSans.variable} ${GeistMono.variable} ${GeistSans.className} h-full antialiased`}
    >
      <body
        suppressHydrationWarning
        className="min-h-full flex flex-col font-sans bg-[#0B0A0F] text-white"
      >
        {children}
      </body>
    </html>
  );
}
