"use client";

import {
  CheckIcon,
  DownloadIcon,
  Loader2Icon,
  XIcon,
} from "lucide-react";

interface DownloadCardProps {
  title: string;
  format: string;
  status: string;
  progress: number;
  error: string | null;
  fileSize: number | null;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function DownloadCard({
  title,
  format,
  status,
  progress,
  error,
  fileSize,
}: DownloadCardProps) {
  const isActive = status === "downloading" || status === "converting";

  return (
    <div className="group relative rounded-xl border border-border p-3.5 transition-colors hover:bg-muted/40">
      <div className="flex items-center gap-3">
        {/* Status indicator */}
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted">
          {status === "complete" ? (
            <CheckIcon className="h-3.5 w-3.5 text-foreground" />
          ) : status === "error" ? (
            <XIcon className="h-3.5 w-3.5 text-destructive" />
          ) : isActive ? (
            <Loader2Icon className="h-3.5 w-3.5 animate-spin text-muted-foreground" />
          ) : (
            <DownloadIcon className="h-3.5 w-3.5 text-muted-foreground" />
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <p className="truncate text-[13px] font-medium text-foreground">
            {title}
          </p>
          <p className="text-xs text-muted-foreground">
            {error ? (
              <span className="text-destructive">{error}</span>
            ) : isActive ? (
              status === "converting"
                ? "Converting..."
                : `Downloading ${Math.round(progress)}%`
            ) : status === "complete" && fileSize ? (
              `${format.toUpperCase()} \u00B7 ${formatBytes(fileSize)}`
            ) : (
              format.toUpperCase()
            )}
          </p>
        </div>
      </div>

      {/* Progress bar */}
      {isActive && (
        <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-foreground/70 transition-all duration-300 ease-out"
            style={{ width: `${Math.max(progress, 2)}%` }}
          />
        </div>
      )}
    </div>
  );
}
