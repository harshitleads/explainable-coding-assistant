import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://explainable-coding-assistant.vercel.app"),
  title: "Explainable AI | Trust Through Transparency",
  description:
    "Paste your original code and the AI suggestion. Get back the rationale, tradeoffs, and what to verify before you accept.",
  icons: {
    icon: "/favicon.png",
  },
  openGraph: {
    title: "Explainable AI | Trust Through Transparency",
    description:
      "Paste your original code and the AI suggestion. Get back the rationale, tradeoffs, and what to verify before you accept.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Explainable AI — Should you accept this suggestion?",
      },
    ],
    url: "https://explainable-coding-assistant.vercel.app",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Explainable AI | Trust Through Transparency",
    description:
      "Paste your original code and the AI suggestion. Get back the rationale, tradeoffs, and what to verify before you accept.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" style={{ colorScheme: "dark" }}>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
