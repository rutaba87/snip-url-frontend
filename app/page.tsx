/**
 * NEXT.JS CONCEPT: page.jsx
 *
 * Any file named `page.jsx` inside `app/` becomes a ROUTE automatically.
 * app/page.jsx          →  localhost:3000/
 * app/about/page.jsx    →  localhost:3000/about
 * app/blog/[id]/page.jsx →  localhost:3000/blog/123   (dynamic route)
 *
 * NO <BrowserRouter>, NO react-router-dom. The folder IS the route.
 *
 * This is a SERVER COMPONENT. That means we can fetch data directly
 * inside the component using async/await — no useEffect, no useState.
 * Next.js runs this on the server and sends the ready HTML to the browser.
 *
 * The interactive parts (ShortenBox, LinksList) are Client Components
 * imported below. Server components CAN render client components inside them.
 */

import { getStats, getLinks } from "@/lib/api";
// @/ is a Next.js path alias for the project root — set in jsconfig.json
// Much cleaner than ../../lib/api

import StatsRow from "../components/StatsRow";
import ShortenBox from "../components/ShortenBox";
import LinksList from "../components/LinksList";
import styles from "./page.module.css";

// ✅ async function — only works in Server Components
// Next.js will call this on every request (or cache it, see below)
export default async function HomePage() {
  // Fetching data directly in the component — no useEffect needed!
  // Next.js runs this on the server before sending HTML to the browser.
  const [stats, links] = await Promise.all([
    getStats(),
    getLinks(),
  ]);

  return (
    <main className={styles.main}>
      <div className={styles.header}>
        <div className={styles.dot} />
        <h1 className={styles.title}>Snip</h1>
        <span className={styles.subtitle}>url shortener</span>
      </div>

      {/* Server component — receives data as props, no fetching inside */}
      <StatsRow initialStats={stats} />

      {/* Client component — handles the input, POST request, clipboard */}
      <ShortenBox />

      {/* Client component — handles the list, delete, refresh */}
      <LinksList initialLinks={links} />
    </main>
  );
}