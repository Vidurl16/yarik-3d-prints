import { NextRequest, NextResponse } from "next/server";

// PUDO API base URL — confirm with Yarik once business API account is active
const PUDO_BASE = "https://api.pudo.co.za/v1";

export async function GET(req: NextRequest) {
  const apiKey = process.env.PUDO_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "PUDO_API_KEY not configured" }, { status: 503 });
  }

  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search") ?? "";

  if (search.length < 2) {
    return NextResponse.json({ lockers: [] });
  }

  try {
    const res = await fetch(
      `${PUDO_BASE}/lockers?search=${encodeURIComponent(search)}`,
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          Accept: "application/json",
        },
        next: { revalidate: 3600 }, // cache locker list for 1h
      }
    );

    if (!res.ok) {
      const text = await res.text();
      console.error("[PUDO] Locker fetch failed:", res.status, text);
      return NextResponse.json({ error: "PUDO API error", status: res.status }, { status: 502 });
    }

    const data = await res.json();
    // Normalise: PUDO may return { lockers: [...] } or a raw array
    const lockers = Array.isArray(data) ? data : (data.lockers ?? data.data ?? []);
    return NextResponse.json({ lockers });
  } catch (err) {
    console.error("[PUDO] Network error:", err);
    return NextResponse.json({ error: "Failed to reach PUDO API" }, { status: 502 });
  }
}
