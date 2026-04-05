"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { UrlInput } from "@/components/url-input";
import { MediaPreview } from "@/components/media-preview";
import { FormatSelector } from "@/components/format-selector";
import { DownloadCard } from "@/components/download-card";
import { ArrowDownToLineIcon, Loader2Icon } from "lucide-react";
import { Toaster, toast } from "sonner";

interface VideoInfo {
  title: string;
  thumbnail: string | null;
  duration: number | null;
  durationString: string | null;
  platform: string;
  url: string;
}

interface ActiveDownload {
  id: string;
  title: string;
  format: string;
  status: string;
  progress: number;
  error: string | null;
  fileSize: number | null;
}

export default function Home() {
  const [url, setUrl] = useState("");
  const [videoInfo, setVideoInfo] = useState<VideoInfo | null>(null);
  const [format, setFormat] = useState<"mp4" | "mp3">("mp4");
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [downloads, setDownloads] = useState<ActiveDownload[]>([]);
  const pollIntervals = useRef<Map<string, NodeJS.Timeout>>(new Map());

  useEffect(() => {
    return () => {
      pollIntervals.current.forEach((interval) => clearInterval(interval));
    };
  }, []);

  const fetchInfo = useCallback(async () => {
    if (!url) return;
    setLoading(true);
    setVideoInfo(null);

    try {
      const res = await fetch("/api/info", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Failed to fetch video info");
        return;
      }

      setVideoInfo(data);
    } catch {
      toast.error("Failed to connect to server");
    } finally {
      setLoading(false);
    }
  }, [url]);

  const pollStatus = useCallback((jobId: string) => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/download/${jobId}`);
        const data = await res.json();

        setDownloads((prev) =>
          prev.map((d) =>
            d.id === jobId
              ? {
                  ...d,
                  status: data.status,
                  progress: data.progress,
                  error: data.error,
                  fileSize: data.fileSize,
                }
              : d
          )
        );

        if (data.status === "complete") {
          clearInterval(interval);
          pollIntervals.current.delete(jobId);
          const link = document.createElement("a");
          link.href = `/api/download/${jobId}?file=true`;
          link.download = "";
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          toast.success("Download complete!");
        }

        if (data.status === "error") {
          clearInterval(interval);
          pollIntervals.current.delete(jobId);
          toast.error(data.error || "Download failed");
        }
      } catch {
        // ignore poll errors
      }
    }, 1000);

    pollIntervals.current.set(jobId, interval);
  }, []);

  const startDownload = useCallback(async () => {
    if (!videoInfo) return;
    setDownloading(true);

    try {
      const res = await fetch("/api/download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: videoInfo.url,
          format,
          title: videoInfo.title,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Failed to start download");
        return;
      }

      const newDownload: ActiveDownload = {
        id: data.id,
        title: videoInfo.title,
        format,
        status: "downloading",
        progress: 0,
        error: null,
        fileSize: null,
      };

      setDownloads((prev) => [newDownload, ...prev]);
      pollStatus(data.id);

      setVideoInfo(null);
      setUrl("");
    } catch {
      toast.error("Failed to connect to server");
    } finally {
      setDownloading(false);
    }
  }, [videoInfo, format, pollStatus]);

  return (
    <div className="flex flex-col items-center min-h-screen bg-[#08090a]">
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: "#191a1b",
            border: "1px solid rgba(255,255,255,0.08)",
            color: "#f7f8f8",
            fontSize: "13px",
            fontWeight: 510,
          },
        }}
      />

      <div className="w-full max-w-lg px-6 pt-[20vh]">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-[32px] font-[510] tracking-[-0.704px] text-[#f7f8f8]">
            SaveIt
          </h1>
          <p className="mt-1.5 text-[15px] font-[410] tracking-[-0.165px] text-[#8a8f98]">
            Download video or audio from any link.
          </p>
        </div>

        {/* URL Input */}
        <div className="space-y-4">
          <UrlInput
            value={url}
            onChange={setUrl}
            onSubmit={fetchInfo}
            loading={loading}
            disabled={loading}
          />

          {/* Loading skeleton */}
          {loading && (
            <div className="flex gap-4 rounded-lg border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] p-3 animate-pulse">
              <div className="w-36 h-[82px] rounded-md bg-[rgba(255,255,255,0.05)]" />
              <div className="flex-1 space-y-2.5 py-2">
                <div className="h-3.5 w-3/4 rounded bg-[rgba(255,255,255,0.05)]" />
                <div className="h-3 w-1/3 rounded bg-[rgba(255,255,255,0.03)]" />
              </div>
            </div>
          )}

          {/* Video Preview + Controls */}
          {videoInfo && !loading && (
            <div className="space-y-3 animate-in fade-in duration-200">
              <MediaPreview
                title={videoInfo.title}
                thumbnail={videoInfo.thumbnail}
                duration={videoInfo.durationString}
                platform={videoInfo.platform}
              />

              <FormatSelector value={format} onChange={setFormat} />

              <button
                onClick={startDownload}
                disabled={downloading}
                className="flex w-full items-center justify-center gap-2 rounded-md bg-[#5e6ad2] py-2.5 text-[13px] font-[510] tracking-[-0.13px] text-white transition-all hover:bg-[#828fff] disabled:opacity-40 disabled:hover:bg-[#5e6ad2]"
              >
                {downloading ? (
                  <Loader2Icon className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <ArrowDownToLineIcon className="h-3.5 w-3.5" />
                    Download {format === "mp4" ? "Video" : "Audio"}
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Active Downloads */}
        {downloads.length > 0 && (
          <div className="mt-10">
            <p className="mb-3 text-[11px] font-[510] uppercase tracking-[0.5px] text-[#62666d]">
              Downloads
            </p>
            <div className="space-y-2">
              {downloads.map((dl) => (
                <DownloadCard
                  key={dl.id}
                  title={dl.title}
                  format={dl.format}
                  status={dl.status}
                  progress={dl.progress}
                  error={dl.error}
                  fileSize={dl.fileSize}
                />
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-16 pb-8">
          <p className="text-[11px] font-[410] text-[#62666d]/60">
            Powered by yt-dlp &middot; Supports 1000+ sites
          </p>
        </div>
      </div>
    </div>
  );
}
