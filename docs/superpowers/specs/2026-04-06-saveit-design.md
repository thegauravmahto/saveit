# SaveIt — Self-Hosted Media Downloader

## Overview

A self-hosted, open-source video and audio downloader with a clean minimal web UI. Paste links from YouTube, TikTok, Instagram, Twitter/X, and 1000+ other sites — download as MP4 or MP3.

## Tech Stack

- **Frontend + Backend**: Next.js 15 (App Router, TypeScript)
- **UI**: shadcn/ui + Tailwind CSS
- **Download Engine**: yt-dlp (called via child_process)
- **Audio Conversion**: ffmpeg (for MP3 extraction)
- **Deployment**: Docker (yt-dlp + ffmpeg pre-installed)

## Architecture

Single Next.js application. API routes handle yt-dlp operations. No database — download jobs are tracked in-memory with a simple Map. Downloaded files are stored temporarily in `/tmp/saveit/` and cleaned up after serving.

```
saveit/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── globals.css
│   └── api/
│       ├── info/route.ts          # GET video metadata
│       ├── download/route.ts      # POST start download
│       └── download/[id]/route.ts # GET status or serve file
├── components/
│   ├── url-input.tsx              # URL paste input with platform detection
│   ├── media-preview.tsx          # Thumbnail, title, duration display
│   ├── format-selector.tsx        # MP4 / MP3 toggle
│   ├── download-button.tsx        # Download trigger with progress
│   ├── download-list.tsx          # Active/recent downloads
│   └── header.tsx                 # App title
├── lib/
│   ├── ytdlp.ts                  # yt-dlp wrapper (spawn, parse output)
│   ├── downloads.ts              # In-memory download job store
│   └── utils.ts                  # Helpers
├── Dockerfile
├── docker-compose.yml
└── package.json
```

## API Design

### `POST /api/info`
- **Input**: `{ url: string }`
- **Output**: `{ title, thumbnail, duration, formats[], platform }`
- Calls `yt-dlp --dump-json` to extract metadata

### `POST /api/download`
- **Input**: `{ url: string, format: "mp4" | "mp3", quality?: string }`
- **Output**: `{ id: string }`
- Spawns yt-dlp process, tracks progress via job ID
- MP3: uses `--extract-audio --audio-format mp3`
- MP4: uses `-f "bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best"`

### `GET /api/download/[id]`
- **Output**: Job status `{ id, status, progress, filename }` or streams the file when complete
- Query param `?file=true` to download the actual file

## UI Design

Minimal single-page layout:

1. **Header**: "SaveIt" title + subtitle "Paste any video link"
2. **URL Input**: Large centered input with paste button, auto-detects platform icon
3. **Media Preview**: Shows thumbnail, title, duration after URL analysis
4. **Format Toggle**: Clean MP4 / MP3 segmented control
5. **Download Button**: Large prominent button, shows progress bar during download
6. **Active Downloads**: Cards showing in-progress downloads below the main input

Design principles:
- Centered layout, max-width 640px
- Light/dark mode via shadcn theme
- Monochrome palette with accent color for actions
- No clutter — hide complexity, show only what's needed

## Platform Detection

Parse the URL to show the source platform icon/badge:
- YouTube (youtube.com, youtu.be)
- TikTok (tiktok.com)
- Instagram (instagram.com)
- Twitter/X (twitter.com, x.com)
- Reddit (reddit.com)
- Generic fallback for other sites

## Download Flow

1. User pastes URL into input
2. Frontend calls `POST /api/info` — shows loading skeleton
3. Backend runs `yt-dlp --dump-json URL` — returns metadata
4. Frontend displays preview card with title + thumbnail
5. User selects MP4 or MP3, clicks Download
6. Frontend calls `POST /api/download` — gets job ID
7. Frontend polls `GET /api/download/[id]` every second for progress
8. When complete, frontend triggers browser download via `GET /api/download/[id]?file=true`
9. Backend serves file, then schedules cleanup (delete after 10 minutes)

## Error Handling

- Invalid/unsupported URL: show inline error on input
- yt-dlp failure: show error card with message
- Network timeout: show retry option
- File too large: no limit by default (self-hosted), but show file size estimate

## Docker

```dockerfile
FROM node:20-alpine
RUN apk add --no-cache python3 py3-pip ffmpeg
RUN pip3 install yt-dlp
# ... copy app, build, run
```

## Out of Scope (v1)

- User accounts / auth
- Download history persistence
- Queue management
- Batch downloads
- Custom output templates
