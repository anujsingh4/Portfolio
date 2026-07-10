import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const username = req.nextUrl.searchParams.get("username");
  if (!username) return NextResponse.json({ error: "username required" }, { status: 400 });

  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
  if (process.env.GITHUB_TOKEN) {
    headers["Authorization"] = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  const res = await fetch(
    `https://api.github.com/users/${username}/repos?sort=updated&per_page=50&type=public`,
    { headers, next: { revalidate: 300 } }
  );

  if (!res.ok) {
    return NextResponse.json({ error: "GitHub API error" }, { status: res.status });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const repos = (await res.json()) as any[];

  return NextResponse.json(
    repos
      .filter((r) => !r.fork)
      .map((r) => ({
        name: r.name,
        description: r.description ?? "",
        code: r.html_url,
        live: r.homepage ?? "",
        language: r.language ?? "",
        topics: (r.topics ?? []) as string[],
        stars: r.stargazers_count as number,
        updatedAt: r.updated_at as string,
      }))
  );
}
