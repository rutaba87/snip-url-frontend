/**
 * NEXT.JS CONCEPT: Server Component (no "use client")
 *
 * StatsRow is a pure display component — it just renders numbers.
 * No useState, no onClick, no browser APIs.
 * So it stays a Server Component — smaller JS bundle, faster page.
 *
 * It receives `initialStats` as a prop from page.jsx (which fetched the data).
 * The data flow is:  server fetch in page.jsx → prop → display here.
 *
 * Compare to React/Vite where you'd fetch inside a useEffect in this
 * component itself. In Next.js, fetch up in the server component and
 * pass down as props. Cleaner separation.
 */

import styles from "./StatsRow.module.css";

export default function StatsRow({ initialStats = {} }) {
  const { totalLinks = 0, totalClicks = 0, todayClicks = 0 } = initialStats;

  return (
    <div className={styles.row}>
      <div className={styles.stat}>
        <div className={styles.label}>Total links</div>
        <div className={styles.value}>{totalLinks}</div>
      </div>
      <div className={styles.stat}>
        <div className={styles.label}>Total clicks</div>
        <div className={`${styles.value} ${styles.accent}`}>{totalClicks}</div>
      </div>
      <div className={styles.stat}>
        <div className={styles.label}>Today</div>
        <div className={styles.value}>{todayClicks}</div>
      </div>
    </div>
  );
}