"use client";

import { detectPlatform } from "@/lib/platforms";
import { ArrowRightIcon, ClipboardIcon, Loader2Icon } from "lucide-react";

interface UrlInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  loading: boolean;
  disabled: boolean;
}

export function UrlInput({
  value,
  onChange,
  onSubmit,
  loading,
  disabled,
}: UrlInputProps) {
  const platform = value ? detectPlatform(value) : null;

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      onChange(text);
    } catch {
      // clipboard not available
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && value && !disabled) {
      onSubmit();
    }
  };

  return (
    <div className="w-full space-y-3">
      <div className="group relative flex items-center rounded-xl border border-border bg-background transition-all duration-200 focus-within:border-foreground/20 focus-within:shadow-[0_0_0_3px_rgba(0,0,0,0.04)] hover:border-foreground/15 dark:focus-within:shadow-[0_0_0_3px_rgba(255,255,255,0.04)]">
        <input
          type="url"
          placeholder="Paste a link..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          className="flex-1 bg-transparent px-4 py-3.5 text-[15px] placeholder:text-muted-foreground/60 focus:outline-none disabled:opacity-50"
        />
        <div className="flex items-center gap-1 pr-2">
          {platform && (
            <span className="mr-1 rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground">
              {platform.name}
            </span>
          )}
          <button
            onClick={handlePaste}
            className="rounded-lg p-2 text-muted-foreground/50 transition-colors hover:bg-muted hover:text-foreground"
            type="button"
          >
            <ClipboardIcon className="h-4 w-4" />
          </button>
          <button
            onClick={onSubmit}
            disabled={!value || disabled}
            className="rounded-lg bg-foreground p-2 text-background transition-all hover:opacity-80 disabled:opacity-30"
            type="button"
          >
            {loading ? (
              <Loader2Icon className="h-4 w-4 animate-spin" />
            ) : (
              <ArrowRightIcon className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
