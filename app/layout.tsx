/**
 * NEXT.JS CONCEPT: layout.jsx
 *
 * This is the ROOT SHELL of your entire app.
 * Every page is wrapped inside this automatically — you never import it manually.
 *
 * In React (Vite), you'd put fonts/global stuff in main.jsx or index.html.
 * In Next.js, it lives HERE.
 *
 * The `metadata` export is Next.js magic — it sets <title> and <meta> tags
 * automatically. No react-helmet needed.
 *
 * This is a SERVER COMPONENT by default (no "use client").
 * It renders once on the server and never re-renders.
 */

import { Syne, JetBrains_Mono } from "next/font/google";
// next/font/google = built-in font optimization. Fonts load faster,
// no layout shift, no external requests from the browser.
import "./globals.css";

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",       // exposes as a CSS variable
  weight: ["400", "500", "600", "700"],
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500"],
});

// Next.js reads this export and injects the right <title> and <meta> tags
export const metadata = {
  title: "Snip — URL Shortener",
  description: "Shorten, track, and manage your links.",
};

export default function RootLayout({ children }) {
  // `children` = whatever page.jsx renders
  // Next.js passes it here automatically
  return (
    <html lang="en" className={`${syne.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  );
}