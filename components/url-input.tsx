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
      <div className="group relative flex items-center rounded-lg border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] transition-all duration-200 focus-within:border-[rgba(255,255,255,0.15)] focus-within:bg-[rgba(255,255,255,0.03)]">
        <input
          type="url"
          placeholder="Paste a link..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          className="flex-1 bg-transparent px-4 py-3.5 text-[15px] font-[410] tracking-[-0.165px] text-[#f7f8f8] placeholder:text-[#62666d] focus:outline-none disabled:opacity-40"
        />
        <div className="flex items-center gap-1 pr-2.5">
          {platform && (
            <span className="mr-1 rounded-[4px] border border-[rgba(255,255,255,0.05)] bg-[rgba(255,255,255,0.05)] px-2 py-0.5 text-[11px] font-[510] text-[#8a8f98]">
              {platform.name}
            </span>
          )}
          <button
            onClick={handlePaste}
            className="rounded-md p-2 text-[#62666d] transition-colors hover:bg-[rgba(255,255,255,0.05)] hover:text-[#8a8f98]"
            type="button"
          >
            <ClipboardIcon className="h-4 w-4" />
          </button>
          <button
            onClick={onSubmit}
            disabled={!value || disabled}
            className="rounded-md bg-[#5e6ad2] p-2 text-white transition-all hover:bg-[#828fff] disabled:opacity-30 disabled:hover:bg-[#5e6ad2]"
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
