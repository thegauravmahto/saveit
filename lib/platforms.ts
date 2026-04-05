export interface Platform {
  name: string;
  color: string;
}

const PLATFORMS: Record<string, Platform> = {
  "youtube.com": { name: "YouTube", color: "text-red-500" },
  "youtu.be": { name: "YouTube", color: "text-red-500" },
  "tiktok.com": { name: "TikTok", color: "text-foreground" },
  "instagram.com": { name: "Instagram", color: "text-pink-500" },
  "twitter.com": { name: "Twitter", color: "text-blue-400" },
  "x.com": { name: "X", color: "text-foreground" },
  "reddit.com": { name: "Reddit", color: "text-orange-500" },
  "vimeo.com": { name: "Vimeo", color: "text-cyan-500" },
  "twitch.tv": { name: "Twitch", color: "text-purple-500" },
  "soundcloud.com": { name: "SoundCloud", color: "text-orange-400" },
  "facebook.com": { name: "Facebook", color: "text-blue-600" },
  "dailymotion.com": { name: "Dailymotion", color: "text-blue-500" },
};

export function detectPlatform(url: string): Platform | null {
  try {
    const hostname = new URL(url).hostname.replace("www.", "").replace("m.", "");
    return PLATFORMS[hostname] || null;
  } catch {
    return null;
  }
}
