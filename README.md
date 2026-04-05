# SaveIt

Self-hosted video and audio downloader with a clean web UI. Paste links from YouTube, TikTok, Instagram, Twitter/X, and 1000+ other sites — download as MP4 or MP3.

## Features

- Paste any video/audio URL and download it
- MP4 (video) or MP3 (audio) format selection
- Live download progress tracking
- Auto-detects platform (YouTube, TikTok, Instagram, X, Reddit, etc.)
- Thumbnail preview with video metadata
- Minimal, responsive UI built with shadcn/ui
- Docker-ready for self-hosting

## Prerequisites

- Node.js 20+
- [yt-dlp](https://github.com/yt-dlp/yt-dlp) installed and in PATH
- [ffmpeg](https://ffmpeg.org/) installed (for audio extraction and merging)

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Docker

```bash
docker compose up -d
```

Builds an image with yt-dlp and ffmpeg pre-installed. Access at `http://localhost:3000`.

## Tech Stack

- **Next.js 16** — App Router, API routes, TypeScript
- **shadcn/ui** — Minimal component library
- **Tailwind CSS v4** — Styling
- **yt-dlp** — Download engine (1000+ supported sites)
- **ffmpeg** — Audio extraction and format conversion

## How It Works

1. Paste a URL — app calls `yt-dlp --dump-json` to fetch metadata
2. Choose MP4 or MP3, click Download
3. Backend spawns `yt-dlp` with appropriate flags
4. Frontend polls for progress, auto-downloads when complete
5. Files are cleaned up after 10 minutes

## License

MIT
