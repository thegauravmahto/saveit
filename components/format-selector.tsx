"use client";

import { FilmIcon, MusicIcon } from "lucide-react";

interface FormatSelectorProps {
  value: "mp4" | "mp3";
  onChange: (value: "mp4" | "mp3") => void;
}

export function FormatSelector({ value, onChange }: FormatSelectorProps) {
  return (
    <div className="flex gap-2">
      <button
        onClick={() => onChange("mp4")}
        className={`flex flex-1 items-center justify-center gap-2 rounded-md border px-4 py-2.5 text-[13px] font-[510] tracking-[-0.13px] transition-all duration-150 ${
          value === "mp4"
            ? "border-[#5e6ad2]/40 bg-[#5e6ad2] text-white"
            : "border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] text-[#8a8f98] hover:bg-[rgba(255,255,255,0.04)] hover:text-[#d0d6e0]"
        }`}
      >
        <FilmIcon className="h-3.5 w-3.5" />
        Video
      </button>
      <button
        onClick={() => onChange("mp3")}
        className={`flex flex-1 items-center justify-center gap-2 rounded-md border px-4 py-2.5 text-[13px] font-[510] tracking-[-0.13px] transition-all duration-150 ${
          value === "mp3"
            ? "border-[#5e6ad2]/40 bg-[#5e6ad2] text-white"
            : "border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] text-[#8a8f98] hover:bg-[rgba(255,255,255,0.04)] hover:text-[#d0d6e0]"
        }`}
      >
        <MusicIcon className="h-3.5 w-3.5" />
        Audio
      </button>
    </div>
  );
}
