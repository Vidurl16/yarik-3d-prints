import { NextRequest, NextResponse } from "next/server";

// PUDO API — The Courier Guy locker network
// Docs: https://api-pudo.co.za
// Auth: api_key query param (format: {accountId}|{apiKey})
const PUDO_BASE = "https://api-pudo.co.za";

interface PudoRawLocker {
  code: string;
  name: string;
  address?: string;
  place?: { town?: string; postalCode?: string };
  openinghours?: Array<{ day: string; open_time: string; close_time: string }>;
}

function normalise(raw: PudoRawLocker) {
  const firstHour = raw.openinghours?.[0];
  const hours = firstHour
    ? `${firstHour.day} ${firstHour.open_time.slice(0, 5)}–${firstHour.close_time.slice(0, 5)}`
    : undefined;
  return {
    id: raw.code,
    name: raw.name,
    address: raw.address,
    city: raw.place?.town,
    hours,
  };
}

export async function GET(req: NextRequest) {
  const apiKey = process.env.PUDO_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "PUDO_API_KEY not configured" }, { status: 503 });
  }

  const { searchParams } = new URL(req.url);
  const search = (searchParams.get("search") ?? "").toLowerCase().trim();

  if (search.length < 2) {
    return NextResponse.json({ lockers: [] });
  }

  try {
    // PUDO returns all lockers — no server-side search param supported.
    // We cache the full list for 1 h and filter here.
    const res = await fetch(
      `${PUDO_BASE}/lockers-data?api_key=${encodeURIComponent(apiKey)}`,
      {
        headers: { Accept: "application/json" },
        next: { revalidate: 3600 },
      }
    );

    if (!res.ok) {
      const text = await res.text();
      let pudoMessage: string | undefined;
      try { pudoMessage = JSON.parse(text)?.message; } catch { /* not JSON */ }
      console.error("[PUDO] Locker fetch failed:", res.status, text);
      return NextResponse.json(
        { error: "PUDO API error", status: res.status, detail: pudoMessage ?? text.slice(0, 200) },
        { status: 502 }
      );
    }

    const data = await res.json();
    const raw: PudoRawLocker[] = Array.isArray(data) ? data : (data.lockers ?? data.data ?? []);

    const lockers = raw
      .filter((l) => {
        const haystack = [l.name, l.address, l.place?.town].join(" ").toLowerCase();
        return haystack.includes(search);
      })
      .slice(0, 20)
      .map(normalise);

    return NextResponse.json({ lockers });
  } catch (err) {
    console.error("[PUDO] Network error:", err);
    return NextResponse.json({ error: "Failed to reach PUDO API" }, { status: 502 });
  }
}
