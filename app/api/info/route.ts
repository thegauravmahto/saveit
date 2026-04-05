import { getVideoInfo } from "@/lib/ytdlp";

export async function POST(request: Request) {
  try {
    const { url } = await request.json();

    if (!url || typeof url !== "string") {
      return Response.json({ error: "URL is required" }, { status: 400 });
    }

    const info = await getVideoInfo(url);
    return Response.json(info);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to get video info";
    return Response.json({ error: message }, { status: 500 });
  }
}
