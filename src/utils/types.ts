export type RawSpotifyEntry = Record<string, unknown>;

export interface NormalizedPlay {
  id: string;
  playedAt: Date;
  msPlayed: number;
  trackName: string;
  artistName: string;
  albumName?: string;
  trackUri?: string;
  country?: string;
  platform?: string;
  shuffle?: boolean;
  reasonStart?: string;
  reasonEnd?: string;
  contextUri?: string;
  contextType?: string;
}

export interface ImportSummary {
  totalPlays: number;
  fileCount: number;
  invalidFiles: string[];
  dateRange?: { start: Date; end: Date };
}

export interface FilterState {
  startDate?: string;
  endDate?: string;
  artist?: string;
  track?: string;
  contextType?: string;
  platform?: string;
}

export interface MetricSummary {
  totalMs: number;
  totalPlays: number;
  uniqueTracks: number;
  uniqueArtists: number;
  firstPlay?: Date;
  lastPlay?: Date;
  topArtist?: string;
  topTrack?: string;
}

export interface RankedItem {
  name: string;
  msPlayed: number;
  plays: number;
}

export interface FunInsight {
  title: string;
  description: string;
}
