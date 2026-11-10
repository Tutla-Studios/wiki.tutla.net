import { revalidatePath } from "next/cache"
import { clearGithubCache } from "@/lib/github"

// Refresh GitHub-synced content immediately instead of waiting for the
// 1-hour revalidation window. Requires the REVALIDATE_SECRET env variable.
//   curl -X POST "https://wiki.tutla.net/api/revalidate?secret=..."
// Can be used as a GitHub webhook URL (push events) on a synced repository.

export const dynamic = "force-dynamic"

async function handle(req: Request) {
  const secret = process.env.REVALIDATE_SECRET
  const given = new URL(req.url).searchParams.get("secret")
  if (!secret || given !== secret) return Response.json({ ok: false, error: "unauthorized" }, { status: 401 })

  clearGithubCache()
  revalidatePath("/", "layout") // every page, plus their cached GitHub fetches
  return Response.json({ ok: true, revalidated: Date.now() })
}

export const GET = handle
export const POST = handle
