import type { Metadata } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "SaveIt — Free Open Source Video & Audio Downloader",
    template: "%s | SaveIt",
  },
  description:
    "Self-hosted, open-source video and audio downloader. Download MP4 video or MP3 audio from YouTube, TikTok, Instagram, Twitter/X, Reddit, and 1000+ sites. No ads, no tracking. Deploy with Docker in one command.",
  keywords: [
    "video downloader",
    "audio downloader",
    "youtube downloader",
    "tiktok downloader",
    "instagram downloader",
    "twitter video download",
    "mp4 downloader",
    "mp3 converter",
    "self-hosted downloader",
    "open source video downloader",
    "yt-dlp web ui",
    "free video downloader",
    "online video downloader",
    "download video from url",
  ],
  authors: [{ name: "Gaurav", url: "https://www.linkedin.com/in/gauravmahto/" }],
  creator: "Gaurav",
  publisher: "Gaurav",
  metadataBase: new URL("https://github.com/thegauravmahto/saveit"),
  openGraph: {
    type: "website",
    title: "SaveIt — Free Open Source Video & Audio Downloader",
    description:
      "Download video or audio from YouTube, TikTok, Instagram, Twitter/X, and 1000+ sites. Self-hosted, no ads, no tracking. MP4 & MP3.",
    siteName: "SaveIt",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "SaveIt — Free Open Source Video & Audio Downloader",
    description:
      "Download video or audio from YouTube, TikTok, Instagram, Twitter/X, and 1000+ sites. Self-hosted, open source.",
    creator: "@gaurav_mahto18",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://github.com/thegauravmahto/saveit",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              name: "SaveIt",
              applicationCategory: "MultimediaApplication",
              operatingSystem: "Any",
              description:
                "Self-hosted, open-source video and audio downloader. Download MP4 or MP3 from YouTube, TikTok, Instagram, Twitter/X, and 1000+ sites.",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "USD",
              },
              author: {
                "@type": "Person",
                name: "Gaurav",
                url: "https://www.linkedin.com/in/gauravmahto/",
                sameAs: [
                  "https://x.com/gaurav_mahto18",
                  "https://www.linkedin.com/in/gauravmahto/",
                ],
              },
              featureList: [
                "Download video as MP4",
                "Extract audio as MP3",
                "Supports 1000+ websites",
                "Real-time download progress",
                "Self-hosted with Docker",
                "No ads or tracking",
                "Open source",
              ],
              softwareRequirements: "Docker or Node.js 20+, yt-dlp, ffmpeg",
              license: "https://opensource.org/licenses/MIT",
              url: "https://github.com/thegauravmahto/saveit",
              downloadUrl: "https://github.com/thegauravmahto/saveit",
              isAccessibleForFree: true,
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: [
                {
                  "@type": "Question",
                  name: "What sites does SaveIt support?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "SaveIt supports over 1000 websites including YouTube, TikTok, Instagram, Twitter/X, Reddit, Vimeo, Twitch, SoundCloud, Facebook, Dailymotion, Bilibili, Bandcamp, and many more. It is powered by yt-dlp.",
                  },
                },
                {
                  "@type": "Question",
                  name: "Is SaveIt free to use?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Yes, SaveIt is completely free and open source under the MIT license. You self-host it on your own server — there are no ads, no tracking, and no usage limits.",
                  },
                },
                {
                  "@type": "Question",
                  name: "How do I install SaveIt?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "You can deploy SaveIt with a single Docker command: docker compose up -d. Alternatively, clone the repo and run npm install && npm run dev with Node.js 20+, yt-dlp, and ffmpeg installed.",
                  },
                },
                {
                  "@type": "Question",
                  name: "Can I download audio only as MP3?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Yes, SaveIt lets you choose between MP4 video or MP3 audio-only extraction. The audio is extracted at the highest quality using ffmpeg.",
                  },
                },
              ],
            }),
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
