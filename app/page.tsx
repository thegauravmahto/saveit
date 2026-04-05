"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { UrlInput } from "@/components/url-input";
import { MediaPreview } from "@/components/media-preview";
import { FormatSelector } from "@/components/format-selector";
import { DownloadCard } from "@/components/download-card";
import {
  ArrowDownToLineIcon,
  Loader2Icon,
  VideoIcon,
  MusicIcon,
  ShieldCheckIcon,
  ZapIcon,
  GlobeIcon,
  ServerIcon,
} from "lucide-react";
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

      <div className="w-full max-w-2xl px-6 pt-[12vh]">
        {/* Hero */}
        <div className="mb-12">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] px-3 py-1">
            <span className="h-1.5 w-1.5 rounded-full bg-[#27a644] animate-pulse" />
            <span className="text-[11px] font-[510] text-[#8a8f98]">Open source &middot; Self-hosted</span>
          </div>
          <h1 className="text-[48px] font-[510] tracking-[-1.056px] leading-[1.0] text-[#f7f8f8]">
            Save anything<br />from the internet.
          </h1>
          <p className="mt-4 max-w-md text-[17px] font-[410] leading-[1.6] tracking-[-0.165px] text-[#8a8f98]">
            Paste a link from YouTube, TikTok, Instagram, Twitter/X, or any of 1000+ supported sites. Download as video or audio in seconds.
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

        {/* Divider */}
        <div className="my-16 h-px bg-[rgba(255,255,255,0.06)]" />

        {/* Features */}
        <div className="mb-16">
          <p className="mb-6 text-[11px] font-[510] uppercase tracking-[0.5px] text-[#62666d]">
            What you get
          </p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {[
              {
                icon: VideoIcon,
                title: "MP4 Video",
                desc: "Best quality video with merged audio. Supports up to 4K resolution when available.",
              },
              {
                icon: MusicIcon,
                title: "MP3 Audio",
                desc: "Extract audio from any video. Perfect for music, podcasts, and lectures.",
              },
              {
                icon: ZapIcon,
                title: "Fast Downloads",
                desc: "Direct downloads with real-time progress tracking. No waiting in queues.",
              },
              {
                icon: ShieldCheckIcon,
                title: "No Tracking",
                desc: "Self-hosted on your own server. No ads, no analytics, no data collection.",
              },
            ].map((f) => (
              <div
                key={f.title}
                className="group rounded-lg border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.02)] p-4 transition-colors hover:border-[rgba(255,255,255,0.1)] hover:bg-[rgba(255,255,255,0.03)]"
              >
                <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-md bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.05)]">
                  <f.icon className="h-4 w-4 text-[#8a8f98] group-hover:text-[#d0d6e0] transition-colors" />
                </div>
                <h3 className="text-[14px] font-[510] tracking-[-0.182px] text-[#f7f8f8]">
                  {f.title}
                </h3>
                <p className="mt-1 text-[13px] font-[410] leading-[1.5] tracking-[-0.13px] text-[#62666d]">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Supported Platforms */}
        <div className="mb-16">
          <p className="mb-6 text-[11px] font-[510] uppercase tracking-[0.5px] text-[#62666d]">
            Supported platforms
          </p>
          <div className="flex flex-wrap gap-2">
            {[
              "YouTube", "TikTok", "Instagram", "Twitter / X",
              "Reddit", "Vimeo", "Twitch", "SoundCloud",
              "Facebook", "Dailymotion", "Bilibili", "Bandcamp",
              "Spotify (podcasts)", "Pinterest", "Tumblr",
            ].map((p) => (
              <span
                key={p}
                className="rounded-full border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.02)] px-3 py-1.5 text-[12px] font-[510] text-[#8a8f98] transition-colors hover:border-[rgba(255,255,255,0.1)] hover:text-[#d0d6e0]"
              >
                {p}
              </span>
            ))}
            <span className="rounded-full border border-[rgba(94,106,210,0.2)] bg-[rgba(94,106,210,0.08)] px-3 py-1.5 text-[12px] font-[510] text-[#7170ff]">
              +1000 more
            </span>
          </div>
        </div>

        {/* How it works */}
        <div className="mb-16">
          <p className="mb-6 text-[11px] font-[510] uppercase tracking-[0.5px] text-[#62666d]">
            How it works
          </p>
          <div className="space-y-0">
            {[
              { step: "1", title: "Paste a link", desc: "Copy a URL from any supported platform and paste it into the input above." },
              { step: "2", title: "Choose format", desc: "Select MP4 for video or MP3 for audio-only extraction." },
              { step: "3", title: "Download", desc: "Click download and the file will be saved to your device when ready." },
            ].map((s, i) => (
              <div key={s.step} className="relative flex gap-4 pb-6">
                {/* Connector line */}
                {i < 2 && (
                  <div className="absolute left-[15px] top-[32px] h-[calc(100%-20px)] w-px bg-[rgba(255,255,255,0.06)]" />
                )}
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] text-[12px] font-[510] text-[#8a8f98]">
                  {s.step}
                </div>
                <div className="pt-0.5">
                  <h4 className="text-[14px] font-[510] tracking-[-0.182px] text-[#f7f8f8]">
                    {s.title}
                  </h4>
                  <p className="mt-0.5 text-[13px] font-[410] leading-[1.5] tracking-[-0.13px] text-[#62666d]">
                    {s.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Self-host callout */}
        <div className="mb-16 rounded-lg border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.02)] p-5">
          <div className="flex items-start gap-4">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-[rgba(94,106,210,0.1)] border border-[rgba(94,106,210,0.15)]">
              <ServerIcon className="h-4 w-4 text-[#7170ff]" />
            </div>
            <div>
              <h3 className="text-[14px] font-[510] tracking-[-0.182px] text-[#f7f8f8]">
                Self-host in one command
              </h3>
              <p className="mt-1 text-[13px] font-[410] leading-[1.5] tracking-[-0.13px] text-[#62666d]">
                Deploy with Docker on your own server. No accounts, no limits, no third-party dependencies. Your data stays on your machine.
              </p>
              <div className="mt-3 rounded-md border border-[rgba(255,255,255,0.06)] bg-[rgba(0,0,0,0.3)] px-3 py-2">
                <code className="font-mono text-[12px] text-[#8a8f98]">
                  docker compose up -d
                </code>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-[rgba(255,255,255,0.06)] py-8 flex items-center justify-between">
          <p className="text-[11px] font-[410] text-[#62666d]/60">
            Powered by yt-dlp &middot; Supports 1000+ sites
          </p>
          <div className="flex items-center gap-1 text-[11px] font-[410] text-[#62666d]/60">
            <GlobeIcon className="h-3 w-3" />
            Open source
          </div>
        </div>
      </div>
    </div>
  );
}
