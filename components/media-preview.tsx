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
    <div className="flex gap-4 rounded-lg border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] p-3 transition-colors hover:bg-[rgba(255,255,255,0.04)]">
      {thumbnail && (
        <div className="relative shrink-0 w-36 h-[82px] rounded-md overflow-hidden bg-[rgba(255,255,255,0.05)]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={thumbnail}
            alt={title}
            className="w-full h-full object-cover"
          />
          {duration && (
            <span className="absolute bottom-1 right-1 rounded-sm bg-[rgba(0,0,0,0.75)] px-1.5 py-0.5 text-[10px] font-[510] text-[#d0d6e0]">
              {duration}
            </span>
          )}
        </div>
      )}
      <div className="flex flex-col justify-center gap-1.5 min-w-0 py-0.5">
        <h3 className="text-[14px] font-[510] leading-snug tracking-[-0.182px] line-clamp-2 text-[#f7f8f8]">
          {title}
        </h3>
        <span className="text-[12px] font-[410] text-[#62666d]">
          {platform}
        </span>
      </div>
    </div>
  );
}
