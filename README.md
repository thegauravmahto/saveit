<p align="center">
  <h1 align="center">SaveIt</h1>
  <p align="center">
    Self-hosted video & audio downloader with a minimal dark UI.
    <br />
    Paste a link. Pick a format. Download.
  </p>
</p>

<p align="center">
  <a href="#quick-start">Quick Start</a> &nbsp;&middot;&nbsp;
  <a href="#docker">Docker</a> &nbsp;&middot;&nbsp;
  <a href="#features">Features</a> &nbsp;&middot;&nbsp;
  <a href="#tech-stack">Tech Stack</a>
</p>

---

## Features

| | Feature | Description |
|---|---|---|
| **MP4** | Video download | Best quality video with merged audio, up to 4K |
| **MP3** | Audio extraction | Pull audio from any video — music, podcasts, lectures |
| **1000+** | Supported sites | YouTube, TikTok, Instagram, X, Reddit, Vimeo, Twitch, and more |
| **Live** | Progress tracking | Real-time download progress with auto-download on completion |
| **Private** | No tracking | Self-hosted. No ads, no analytics, no data collection |
| **Docker** | One command deploy | `docker compose up -d` and you're live |

## Quick Start

**Prerequisites:** Node.js 20+, [yt-dlp](https://github.com/yt-dlp/yt-dlp), [ffmpeg](https://ffmpeg.org/)

```bash
git clone https://github.com/thegauravmahto/saveit.git
cd saveit
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Docker

No dependencies needed — yt-dlp and ffmpeg are pre-installed in the image.

```bash
docker compose up -d
```

Access at `http://localhost:3000`.

## How It Works

```
Paste URL → Fetch metadata → Pick MP4/MP3 → Download → Auto-cleanup
```

1. **Paste** — App calls `yt-dlp --dump-json` to fetch title, thumbnail, and duration
2. **Choose** — Select video (MP4) or audio-only (MP3)
3. **Download** — Backend spawns `yt-dlp`, frontend polls for progress
4. **Save** — File auto-downloads to your browser when complete
5. **Cleanup** — Temp files are removed after 10 minutes

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router, TypeScript) |
| UI | shadcn/ui + Tailwind CSS v4 |
| Design System | [Linear](https://linear.app) — dark-mode-first, Inter Variable |
| Download Engine | [yt-dlp](https://github.com/yt-dlp/yt-dlp) (1000+ sites) |
| Audio Processing | [ffmpeg](https://ffmpeg.org/) |
| Deployment | Docker + Docker Compose |

## Supported Platforms

YouTube, TikTok, Instagram, Twitter/X, Reddit, Vimeo, Twitch, SoundCloud, Facebook, Dailymotion, Bilibili, Bandcamp, Spotify (podcasts), Pinterest, Tumblr, and [1000+ more](https://github.com/yt-dlp/yt-dlp/blob/master/supportedsites.md).

## License

MIT

---

<p align="center">
  Built by <strong>Gaurav</strong>
  &nbsp;&middot;&nbsp;
  <a href="https://www.linkedin.com/in/gauravmahto/">LinkedIn</a>
  &nbsp;&middot;&nbsp;
  <a href="https://x.com/gaurav_mahto18">X</a>
</p>
