import type { Metadata } from "next";
import { Orbitron, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import MotionProvider from "@/components/MotionProvider";
import { ThemeProvider } from "@/lib/ThemeContext";

const orbitron = Orbitron({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-orbitron",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "TWH Academy — Technical White Hat",
  description: "Learn Computers From Zero To Ethical Hacking Like Never Before.",
  keywords: ["ethical hacking", "cybersecurity", "TWH", "Technical White Hat", "hacking course"],
  authors: [{ name: "Afsar Ali — Technical White Hat" }],
  openGraph: {
    title: "TWH Academy",
    description: "Learn Computers From Zero To Ethical Hacking Like Never Before.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "TWH Academy",
    description: "Learn Computers From Zero To Ethical Hacking Like Never Before.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${orbitron.variable} ${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="antialiased min-h-screen" style={{ background: "var(--t-bg)", color: "var(--t-text)" }}>
        <ThemeProvider>
          <MotionProvider>
            <Navbar />
            {children}
          </MotionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
