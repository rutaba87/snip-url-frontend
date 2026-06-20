const BACKEND = "https://snip-url-backend.vercel.app/api";

// ─── Stats ───────────────────────────────────────────────────────────────────
export async function getStats() {
  try {
    const res = await fetch(`${BACKEND}/stats`, {
      // Next.js fetch is extended with caching options.
      // { cache: "no-store" }  = always fresh (like useEffect fetch)
      // { next: { revalidate: 60 } } = refetch every 60 seconds (ISR)
      // default = cache forever (static)
      //
      // For a dashboard that should always be up-to-date:
      cache: "no-store",
    });
    if (!res.ok) throw new Error("Failed to fetch stats");
    return res.json();
  } catch {
    return { totalLinks: 0, totalClicks: 0, todayClicks: 0 };
  }
}

// ─── All links ────────────────────────────────────────────────────────────────
export async function getLinks() {
  try {
    const res = await fetch(`${BACKEND}/links`, { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch links");
    return res.json();
  } catch {
    return [];
  }
}

// ─── Shorten ─────────────────────────────────────────────────────────────────
// Called from a Client Component, so regular fetch (no Next.js caching needed)
export async function shortenUrl(originalUrl) {
  const res = await fetch(`${BACKEND}/shorten`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ originalUrl }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to shorten");
  return data;
}

// ─── Delete ──────────────────────────────────────────────────────────────────
export async function deleteLink(id) {
  const res = await fetch(`${BACKEND}/links/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete");
}