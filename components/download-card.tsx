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
    <div className="group relative rounded-lg border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] p-3.5 transition-colors hover:bg-[rgba(255,255,255,0.04)]">
      <div className="flex items-center gap-3">
        {/* Status indicator */}
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.05)]">
          {status === "complete" ? (
            <CheckIcon className="h-3.5 w-3.5 text-[#27a644]" />
          ) : status === "error" ? (
            <XIcon className="h-3.5 w-3.5 text-[#ef4444]" />
          ) : isActive ? (
            <Loader2Icon className="h-3.5 w-3.5 animate-spin text-[#7170ff]" />
          ) : (
            <DownloadIcon className="h-3.5 w-3.5 text-[#62666d]" />
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <p className="truncate text-[13px] font-[510] tracking-[-0.13px] text-[#f7f8f8]">
            {title}
          </p>
          <p className="text-[12px] font-[410] text-[#62666d]">
            {error ? (
              <span className="text-[#ef4444]">{error}</span>
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
        <div className="mt-3 h-[3px] w-full overflow-hidden rounded-full bg-[rgba(255,255,255,0.05)]">
          <div
            className="h-full rounded-full bg-[#5e6ad2] transition-all duration-300 ease-out"
            style={{ width: `${Math.max(progress, 2)}%` }}
          />
        </div>
      )}
    </div>
  );
}
