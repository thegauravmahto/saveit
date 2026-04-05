"use client";

import { FilmIcon, MusicIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface FormatSelectorProps {
  value: "mp4" | "mp3";
  onChange: (value: "mp4" | "mp3") => void;
}

export function FormatSelector({ value, onChange }: FormatSelectorProps) {
  return (
    <div className="flex gap-2">
      <button
        onClick={() => onChange("mp4")}
        className={cn(
          "flex flex-1 items-center justify-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition-all duration-150",
          value === "mp4"
            ? "border-foreground/15 bg-foreground text-background"
            : "border-border bg-transparent text-muted-foreground hover:border-foreground/15 hover:text-foreground"
        )}
      >
        <FilmIcon className="h-3.5 w-3.5" />
        Video
      </button>
      <button
        onClick={() => onChange("mp3")}
        className={cn(
          "flex flex-1 items-center justify-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition-all duration-150",
          value === "mp3"
            ? "border-foreground/15 bg-foreground text-background"
            : "border-border bg-transparent text-muted-foreground hover:border-foreground/15 hover:text-foreground"
        )}
      >
        <MusicIcon className="h-3.5 w-3.5" />
        Audio
      </button>
    </div>
  );
}
