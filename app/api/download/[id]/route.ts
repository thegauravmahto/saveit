import { getJob } from "@/lib/downloads";
import fs from "fs";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const job = getJob(id);

  if (!job) {
    return Response.json({ error: "Job not found" }, { status: 404 });
  }

  // Check if file download is requested
  const url = new URL(request.url);
  const wantsFile = url.searchParams.get("file") === "true";

  if (wantsFile && job.status === "complete" && job.filePath) {
    if (!fs.existsSync(job.filePath)) {
      return Response.json({ error: "File no longer available" }, { status: 410 });
    }

    const fileBuffer = fs.readFileSync(job.filePath);
    const ext = job.format === "mp3" ? "mp3" : "mp4";
    const safeTitle = job.title.replace(/[^a-zA-Z0-9\s\-_]/g, "").trim() || "download";
    const contentType = ext === "mp3" ? "audio/mpeg" : "video/mp4";

    return new Response(fileBuffer, {
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename="${safeTitle}.${ext}"`,
        "Content-Length": String(fileBuffer.length),
      },
    });
  }

  return Response.json({
    id: job.id,
    status: job.status,
    progress: job.progress,
    title: job.title,
    format: job.format,
    filename: job.filename,
    fileSize: job.fileSize,
    error: job.error,
  });
}
