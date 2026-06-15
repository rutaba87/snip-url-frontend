"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { shortenUrl } from "@/lib/api";
import styles from "./ShortenBox.module.css";

// Simple URL validator — rejects base64 blobs, empty strings, plain text
function isValidUrl(str) {
  try {
    const url = new URL(str);
    // must be http or https — not data:, blob:, javascript:, etc.
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export default function ShortenBox() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const router = useRouter();

  const shorten = async () => {
    const trimmed = url.trim();

    // ── Client-side validation ──────────────────────────────
    if (!trimmed) {
      setError("Please enter a URL.");
      return;
    }

    if (!isValidUrl(trimmed)) {
      setError("Please enter a valid URL starting with http:// or https://");
      return;
    }
    // ────────────────────────────────────────────────────────

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const data = await shortenUrl(trimmed);
      setResult(data);
      setUrl("");
      router.refresh();
    } catch (e) {
      setError(e.message);
    }

    setLoading(false);
  };

  const copy = () => {
    navigator.clipboard.writeText(result.shortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={styles.box}>
      <div className={styles.inputRow}>
        <input
          className={`${styles.input} ${error ? styles.inputError : ""}`}
          type="text"           // changed from "url" — browser "url" type
                                // doesn't block data: URIs and causes
                                // inconsistent paste behaviour across browsers.
                                // We validate manually with isValidUrl() above.
          placeholder="https://your-long-url.com/goes/here"
          value={url}
          onChange={(e) => {
            setUrl(e.target.value);
            if (error) setError(""); // clear error as user types
          }}
          onKeyDown={(e) => e.key === "Enter" && shorten()}
          onPaste={(e) => {
            // Intercept paste — if it looks like base64/binary data, block it
            const pasted = e.clipboardData.getData("text");
            if (pasted.startsWith("data:")) {
              e.preventDefault();
              setError("That looks like image data, not a URL.");
            }
          }}
        />
        <button
          className={styles.btn}
          onClick={shorten}
          disabled={loading || !url.trim()}
        >
          {loading ? "..." : "Shorten"}
        </button>
      </div>

      {result && (
        <div className={styles.resultBar}>
          <span className={styles.resultUrl}>{result.shortUrl}</span>
          <button
            className={`${styles.copyBtn} ${copied ? styles.copied : ""}`}
            onClick={copy}
          >
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
      )}

      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
}