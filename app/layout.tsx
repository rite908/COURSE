import type { Metadata } from "next";
import "./globals.css";

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
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800;900&family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-bg-primary text-white antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
