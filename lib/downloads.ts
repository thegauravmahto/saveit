import { v4 as uuidv4 } from "uuid";

export type DownloadStatus =
  | "pending"
  | "downloading"
  | "converting"
  | "complete"
  | "error";

export interface DownloadJob {
  id: string;
  url: string;
  format: "mp4" | "mp3";
  status: DownloadStatus;
  progress: number;
  title: string;
  filename: string | null;
  filePath: string | null;
  fileSize: number | null;
  error: string | null;
  createdAt: number;
}

const jobs = new Map<string, DownloadJob>();

export function createJob(
  url: string,
  format: "mp4" | "mp3",
  title: string
): DownloadJob {
  const job: DownloadJob = {
    id: uuidv4(),
    url,
    format,
    status: "pending",
    progress: 0,
    title,
    filename: null,
    filePath: null,
    fileSize: null,
    error: null,
    createdAt: Date.now(),
  };
  jobs.set(job.id, job);
  return job;
}

export function getJob(id: string): DownloadJob | undefined {
  return jobs.get(id);
}

export function updateJob(id: string, updates: Partial<DownloadJob>) {
  const job = jobs.get(id);
  if (job) {
    Object.assign(job, updates);
  }
}

export function deleteJob(id: string) {
  jobs.delete(id);
}

// Clean up old completed/errored jobs after 10 minutes
setInterval(() => {
  const cutoff = Date.now() - 10 * 60 * 1000;
  for (const [id, job] of jobs) {
    if (
      (job.status === "complete" || job.status === "error") &&
      job.createdAt < cutoff
    ) {
      jobs.delete(id);
    }
  }
}, 60 * 1000);
