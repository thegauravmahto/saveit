import { spawn } from "child_process";
import path from "path";
import fs from "fs";
import { updateJob } from "./downloads";

const DOWNLOAD_DIR = "/tmp/saveit";

// Ensure download directory exists
if (!fs.existsSync(DOWNLOAD_DIR)) {
  fs.mkdirSync(DOWNLOAD_DIR, { recursive: true });
}

export interface VideoInfo {
  title: string;
  thumbnail: string | null;
  duration: number | null;
  durationString: string | null;
  platform: string;
  url: string;
  formats: string[];
}

export async function getVideoInfo(url: string): Promise<VideoInfo> {
  return new Promise((resolve, reject) => {
    const proc = spawn("yt-dlp", ["--dump-json", "--no-warnings", url]);
    let stdout = "";
    let stderr = "";

    proc.stdout.on("data", (data) => {
      stdout += data.toString();
    });
    proc.stderr.on("data", (data) => {
      stderr += data.toString();
    });

    proc.on("close", (code) => {
      if (code !== 0) {
        reject(new Error(stderr || `yt-dlp exited with code ${code}`));
        return;
      }
      try {
        const info = JSON.parse(stdout);
        resolve({
          title: info.title || "Untitled",
          thumbnail: info.thumbnail || null,
          duration: info.duration || null,
          durationString: info.duration_string || null,
          platform: info.extractor_key || info.extractor || "Unknown",
          url,
          formats: ["mp4", "mp3"],
        });
      } catch {
        reject(new Error("Failed to parse video info"));
      }
    });

    proc.on("error", (err) => {
      reject(new Error(`Failed to run yt-dlp: ${err.message}`));
    });
  });
}

export function startDownload(
  jobId: string,
  url: string,
  format: "mp4" | "mp3"
): void {
  const outputTemplate = path.join(DOWNLOAD_DIR, `${jobId}.%(ext)s`);

  const args: string[] = ["--no-warnings", "--newline"];

  if (format === "mp3") {
    args.push(
      "--extract-audio",
      "--audio-format",
      "mp3",
      "--audio-quality",
      "0",
      "-o",
      outputTemplate
    );
  } else {
    args.push(
      "-f",
      "bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best",
      "--merge-output-format",
      "mp4",
      "-o",
      outputTemplate
    );
  }

  args.push(url);

  updateJob(jobId, { status: "downloading", progress: 0 });

  const proc = spawn("yt-dlp", args);
  let stderr = "";

  proc.stdout.on("data", (data) => {
    const line = data.toString();
    // Parse progress from yt-dlp output
    const match = line.match(/\[download\]\s+([\d.]+)%/);
    if (match) {
      const progress = parseFloat(match[1]);
      updateJob(jobId, { progress });
    }
    if (line.includes("[ExtractAudio]") || line.includes("[Merger]")) {
      updateJob(jobId, { status: "converting", progress: 99 });
    }
  });

  proc.stderr.on("data", (data) => {
    stderr += data.toString();
  });

  proc.on("close", (code) => {
    if (code !== 0) {
      updateJob(jobId, {
        status: "error",
        error: stderr || `Download failed with code ${code}`,
      });
      return;
    }

    // Find the output file
    const ext = format === "mp3" ? "mp3" : "mp4";
    const expectedPath = path.join(DOWNLOAD_DIR, `${jobId}.${ext}`);

    // yt-dlp might create file with different extension, scan for it
    const files = fs.readdirSync(DOWNLOAD_DIR).filter((f) => f.startsWith(jobId));

    if (files.length === 0) {
      updateJob(jobId, { status: "error", error: "Output file not found" });
      return;
    }

    const actualFile = files[0];
    const filePath = path.join(DOWNLOAD_DIR, actualFile);
    const stats = fs.statSync(filePath);

    updateJob(jobId, {
      status: "complete",
      progress: 100,
      filename: actualFile,
      filePath,
      fileSize: stats.size,
    });

    // Schedule cleanup after 10 minutes
    setTimeout(() => {
      try {
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      } catch {
        // ignore cleanup errors
      }
    }, 10 * 60 * 1000);
  });

  proc.on("error", (err) => {
    updateJob(jobId, {
      status: "error",
      error: `Failed to start yt-dlp: ${err.message}`,
    });
  });
}
