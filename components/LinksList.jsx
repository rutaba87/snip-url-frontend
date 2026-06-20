"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteLink } from "@/lib/api";
import styles from "./LinksList.module.css";

function getDomain(url) {
  try { return new URL(url).hostname.replace("www.", "").slice(0, 2).toUpperCase(); }
  catch { return "??"; }
}

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export default function LinksList({ initialLinks = [] }) {
  // Seed local state with server-fetched data
  const [links, setLinks] = useState(initialLinks);
  const [deleting, setDeleting] = useState(null);
  const router = useRouter();

  const handleDelete = async (id) => {
    setDeleting(id);
    // Optimistic update — remove immediately from UI
    setLinks((prev) => prev.filter((l) => l._id !== id));

    try {
      await deleteLink(id);
      // Sync server state (re-runs the server component's data fetch)
      router.refresh();
    } catch {
      // If the delete failed, router.refresh() will restore the correct list
      router.refresh();
    }
    setDeleting(null);
  };

  if (links.length === 0) {
    return (
      <div className={styles.empty}>
        <p>No links yet. Shorten one above.</p>
      </div>
    );
  }

  const BACKEND_URL = "https://snip-url-backend.vercel.app/api";

  return (
    <div>
      <div className={styles.sectionHeader}>
        <span className={styles.sectionTitle}>Recent links</span>
        <span className={styles.count}>{links.length} link{links.length !== 1 ? "s" : ""}</span>
      </div>

      <div className={styles.list}>
        {links.map((link) => (
          <div key={link._id} className={styles.card}>
            <div className={styles.favicon}>{getDomain(link.originalUrl)}</div>

            <div className={styles.info}>
              <div className={styles.original}>{link.originalUrl}</div>
              <div className={styles.short}>
                {BACKEND_URL}/{link.shortCode}
              </div>
            </div>

            <div className={styles.meta}>
              <span className={`${styles.badge} ${link.clicks > 0 ? styles.hot : ""}`}>
                {link.clicks} {link.clicks === 1 ? "click" : "clicks"}
              </span>
              <span className={styles.ago}>{timeAgo(link.createdAt)}</span>
              <button
                className={styles.deleteBtn}
                onClick={() => handleDelete(link._id)}
                disabled={deleting === link._id}
                aria-label="Delete link"
              >
                ×
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}