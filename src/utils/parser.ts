import { NormalizedPlay, RawSpotifyEntry } from './types';

const toDate = (value: unknown): Date | null => {
  if (typeof value === 'string') {
    const parsed = new Date(value);
    if (!Number.isNaN(parsed.valueOf())) {
      return parsed;
    }
  }
  return null;
};

const toNumber = (value: unknown): number | null => {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === 'string') {
    const parsed = Number(value);
    if (!Number.isNaN(parsed)) {
      return parsed;
    }
  }
  return null;
};

const inferContextType = (contextUri?: string): string | undefined => {
  if (!contextUri) return undefined;
  if (contextUri.includes('playlist')) return 'Playlist';
  if (contextUri.includes('album')) return 'Album';
  if (contextUri.includes('artist')) return 'Artist';
  if (contextUri.includes('show') || contextUri.includes('episode')) return 'Podcast';
  if (contextUri.includes('radio')) return 'Radio';
  return 'Other';
};

const normalizeEntry = (entry: RawSpotifyEntry, index: number): NormalizedPlay | null => {
  const playedAt =
    toDate(entry.endTime) ||
    toDate(entry.ts) ||
    toDate(entry.end_time) ||
    toDate(entry.played_at);

  const msPlayed =
    toNumber(entry.msPlayed) ||
    toNumber(entry.ms_played) ||
    toNumber(entry.played_ms);

  const trackName =
    (entry.trackName as string) ||
    (entry.master_metadata_track_name as string) ||
    (entry.track as string) ||
    '';

  const artistName =
    (entry.artistName as string) ||
    (entry.master_metadata_album_artist_name as string) ||
    (entry.artist as string) ||
    '';

  if (!playedAt || !msPlayed || !trackName || !artistName) {
    return null;
  }

  const albumName =
    (entry.albumName as string) ||
    (entry.master_metadata_album_album_name as string) ||
    (entry.album as string) ||
    undefined;

  const trackUri =
    (entry.spotify_track_uri as string) ||
    (entry.track_uri as string) ||
    (entry.uri as string) ||
    undefined;

  const contextUri =
    (entry.spotify_context_uri as string) ||
    (entry.context_uri as string) ||
    (entry.context as string) ||
    undefined;

  const country =
    (entry.conn_country as string) ||
    (entry.country as string) ||
    (entry.country_code as string) ||
    undefined;

  return {
    id: `${playedAt.toISOString()}-${trackName}-${index}`,
    playedAt,
    msPlayed,
    trackName,
    artistName,
    albumName,
    trackUri,
    country,
    platform: entry.platform as string | undefined,
    shuffle: entry.shuffle as boolean | undefined,
    reasonStart: entry.reason_start as string | undefined,
    reasonEnd: entry.reason_end as string | undefined,
    contextUri,
    contextType: inferContextType(contextUri),
  };
};

export const parseSpotifyJson = (raw: unknown): NormalizedPlay[] => {
  if (!Array.isArray(raw)) {
    return [];
  }
  return raw
    .map((entry, index) => normalizeEntry(entry as RawSpotifyEntry, index))
    .filter((entry): entry is NormalizedPlay => entry !== null);
};

export const parseSpotifyFiles = async (
  files: File[]
): Promise<{ plays: NormalizedPlay[]; invalidFiles: string[] }> => {
  const invalidFiles: string[] = [];
  const plays: NormalizedPlay[] = [];

  for (const file of files) {
    try {
      const text = await file.text();
      const raw = JSON.parse(text);
      const parsed = parseSpotifyJson(raw);
      if (parsed.length === 0) {
        invalidFiles.push(file.name);
      } else {
        plays.push(...parsed);
      }
    } catch {
      invalidFiles.push(file.name);
    }
  }

  return { plays, invalidFiles };
};
