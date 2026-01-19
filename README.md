# Spotilyze

Spotilyze is a privacy-friendly, fully client-side dashboard for exploring Spotify listening history exports. Upload your local `StreamingHistory*.json` or `endsong*.json` files and explore trends, rankings, and fun insights without sending any data to a server.

## Project structure (high level)

```
Spotilyze/
├── index.html
├── src/
│   ├── components/         # UI building blocks (charts, tables, filters)
│   ├── hooks/              # Reusable hooks for state/derived data
│   ├── utils/              # Parsing + aggregation logic + types
│   ├── tests/              # Unit tests (Vitest)
│   ├── App.tsx             # App shell + sections
│   └── main.tsx            # React entry point
└── README.md
```

## Data model (normalized play)

Each raw JSON record is normalized into a single `NormalizedPlay` shape so different Spotify schemas can be merged:

```ts
interface NormalizedPlay {
  id: string;
  playedAt: Date;
  msPlayed: number;
  trackName: string;
  artistName: string;
  albumName?: string;
  trackUri?: string;
  platform?: string;
  country?: string;
  ipAddress?: string;
  shuffle?: boolean;
  skipped?: boolean;
  offline?: boolean;
  incognito?: boolean;
  reasonStart?: string;
  reasonEnd?: string;
  contextUri?: string;
  contextType?: string;
}
```

## Getting started

```bash
npm install
npm run dev
```

Build for production:

```bash
npm run build
```

Run tests:

```bash
npm run test
```

## How to import your Spotify data

1. Request your Spotify data export from Spotify.
2. In the exported archive, locate `StreamingHistory*.json` or `endsong*.json` files.
3. Drag & drop or select those JSON files in the Spotilyze uploader.

### Example JSON snippet

```json
[
  {
    "endTime": "2023-10-10 12:14",
    "artistName": "Phoebe Bridgers",
    "trackName": "Motion Sickness",
    "msPlayed": 201392,
    "albumName": "Stranger in the Alps",
    "platform": "iOS"
  }
]
```

## What you can explore

- **Overview**: lifetime vs filtered listening time, plays, and top artist/track.
- **Time**: yearly totals, monthly trends, and weekday/hour heatmap.
- **Artists & Tracks**: sortable, searchable leaderboards.
- **Fun insights**: night owl vs early bird, discovery year, seasonal listening, and more.

Everything runs locally in your browser — your data never leaves your machine.
