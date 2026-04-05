"use client";

interface MediaPreviewProps {
  title: string;
  thumbnail: string | null;
  duration: string | null;
  platform: string;
}

export function MediaPreview({
  title,
  thumbnail,
  duration,
  platform,
}: MediaPreviewProps) {
  return (
    <div className="flex gap-4 rounded-xl border border-border p-3 transition-colors hover:bg-muted/50">
      {thumbnail && (
        <div className="relative shrink-0 w-36 h-[82px] rounded-lg overflow-hidden bg-muted">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={thumbnail}
            alt={title}
            className="w-full h-full object-cover"
          />
          {duration && (
            <span className="absolute bottom-1 right-1 rounded bg-black/70 px-1.5 py-0.5 text-[10px] font-medium text-white">
              {duration}
            </span>
          )}
        </div>
      )}
      <div className="flex flex-col justify-center gap-1.5 min-w-0 py-0.5">
        <h3 className="text-[14px] font-medium leading-snug line-clamp-2 text-foreground">
          {title}
        </h3>
        <span className="text-xs text-muted-foreground">
          {platform}
        </span>
      </div>
    </div>
  );
}
