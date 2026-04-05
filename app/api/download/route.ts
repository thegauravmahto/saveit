import { createJob } from "@/lib/downloads";
import { startDownload } from "@/lib/ytdlp";

export async function POST(request: Request) {
  try {
    const { url, format, title } = await request.json();

    if (!url || typeof url !== "string") {
      return Response.json({ error: "URL is required" }, { status: 400 });
    }

    if (format !== "mp4" && format !== "mp3") {
      return Response.json(
        { error: "Format must be mp4 or mp3" },
        { status: 400 }
      );
    }

    const job = createJob(url, format, title || "Download");
    startDownload(job.id, url, format);

    return Response.json({ id: job.id });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to start download";
    return Response.json({ error: message }, { status: 500 });
  }
}
