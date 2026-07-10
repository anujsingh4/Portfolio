import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("url");
  if (!url || url === "#" || !url.startsWith("http")) {
    return NextResponse.json({ image: null });
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);

    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; Googlebot/2.1)",
        Accept: "text/html,application/xhtml+xml",
      },
      next: { revalidate: 86400 },
    });
    clearTimeout(timeout);

    if (!res.ok) {
      // Site unreachable — still return a screenshot fallback
      return NextResponse.json(
        { image: `https://image.thum.io/get/width/600/crop/400/${url}` },
        { headers: { "Cache-Control": "public, max-age=86400, s-maxage=86400" } }
      );
    }

    const html = await res.text();

    // og:image or twitter:image, both attribute orderings
    const match =
      html.match(/<meta[^>]+property=["']og:image["'][^>]*content=["']([^"']+)["']/i) ||
      html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i) ||
      html.match(/<meta[^>]+name=["']twitter:image["'][^>]*content=["']([^"']+)["']/i) ||
      html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+name=["']twitter:image["']/i);

    let image = match?.[1] ?? null;

    // Resolve root-relative URLs
    if (image && image.startsWith("/")) {
      const base = new URL(url);
      image = `${base.origin}${image}`;
    }

    // No og:image — fall back to a real screenshot via thum.io
    if (!image) {
      image = `https://image.thum.io/get/width/600/crop/400/${url}`;
    }

    return NextResponse.json({ image }, {
      headers: {
        "Cache-Control": "public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800",
      },
    });
  } catch {
    // Network error — still try thum.io
    return NextResponse.json(
      { image: `https://image.thum.io/get/width/600/crop/400/${url}` },
      { headers: { "Cache-Control": "public, max-age=3600, s-maxage=3600" } }
    );
  }
}
