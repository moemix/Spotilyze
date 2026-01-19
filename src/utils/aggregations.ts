import { FilterState, FunInsight, MetricSummary, NormalizedPlay, RankedItem } from './types';

export const applyFilters = (plays: NormalizedPlay[], filters: FilterState): NormalizedPlay[] => {
  return plays.filter((play) => {
    if (filters.startDate) {
      const start = new Date(filters.startDate);
      if (play.playedAt < start) return false;
    }
    if (filters.endDate) {
      const end = new Date(filters.endDate);
      if (play.playedAt > end) return false;
    }
    if (filters.artist && play.artistName !== filters.artist) return false;
    if (filters.track && play.trackName !== filters.track) return false;
    if (filters.contextType && play.contextType !== filters.contextType) return false;
    if (filters.platform && play.platform !== filters.platform) return false;
    if (filters.country && play.country !== filters.country) return false;
    return true;
  });
};

export const summarize = (plays: NormalizedPlay[]): MetricSummary => {
  const totalMs = plays.reduce((sum, play) => sum + play.msPlayed, 0);
  const totalPlays = plays.length;
  const uniqueTracks = new Set(plays.map((play) => play.trackName)).size;
  const uniqueArtists = new Set(plays.map((play) => play.artistName)).size;
  const sorted = [...plays].sort((a, b) => a.playedAt.getTime() - b.playedAt.getTime());
  const firstPlay = sorted[0]?.playedAt;
  const lastPlay = sorted[sorted.length - 1]?.playedAt;

  const topArtist = rankBy(plays, (play) => play.artistName)[0]?.name;
  const topTrack = rankBy(plays, (play) => play.trackName)[0]?.name;

  return {
    totalMs,
    totalPlays,
    uniqueTracks,
    uniqueArtists,
    firstPlay,
    lastPlay,
    topArtist,
    topTrack,
  };
};

export const rankBy = (
  plays: NormalizedPlay[],
  keyFn: (play: NormalizedPlay) => string | undefined
): RankedItem[] => {
  const map = new Map<string, RankedItem>();
  for (const play of plays) {
    const key = keyFn(play) ?? 'Unknown';
    const existing = map.get(key);
    if (existing) {
      existing.msPlayed += play.msPlayed;
      existing.plays += 1;
    } else {
      map.set(key, { name: key, msPlayed: play.msPlayed, plays: 1 });
    }
  }
  return [...map.values()].sort((a, b) => b.msPlayed - a.msPlayed);
};

export const groupByYear = (plays: NormalizedPlay[]) => {
  const map = new Map<number, { year: number; msPlayed: number; plays: number }>();
  for (const play of plays) {
    const year = play.playedAt.getFullYear();
    const existing = map.get(year) ?? { year, msPlayed: 0, plays: 0 };
    existing.msPlayed += play.msPlayed;
    existing.plays += 1;
    map.set(year, existing);
  }
  return [...map.values()].sort((a, b) => a.year - b.year);
};

export const groupByMonth = (plays: NormalizedPlay[], year: number) => {
  const map = new Map<number, { month: number; msPlayed: number; plays: number }>();
  for (const play of plays) {
    if (play.playedAt.getFullYear() !== year) continue;
    const month = play.playedAt.getMonth();
    const existing = map.get(month) ?? { month, msPlayed: 0, plays: 0 };
    existing.msPlayed += play.msPlayed;
    existing.plays += 1;
    map.set(month, existing);
  }
  return Array.from({ length: 12 }).map((_, index) =>
    map.get(index) ?? { month: index, msPlayed: 0, plays: 0 }
  );
};

export const groupByCountry = (plays: NormalizedPlay[]) => {
  const map = new Map<string, { country: string; msPlayed: number; plays: number }>();
  for (const play of plays) {
    const country = play.country ?? 'Unknown';
    const existing = map.get(country) ?? { country, msPlayed: 0, plays: 0 };
    existing.msPlayed += play.msPlayed;
    existing.plays += 1;
    map.set(country, existing);
  }
  return [...map.values()].sort((a, b) => b.msPlayed - a.msPlayed);
};

export const buildHeatmap = (plays: NormalizedPlay[], metric: 'ms' | 'plays') => {
  const grid = Array.from({ length: 7 }, () => Array.from({ length: 24 }, () => 0));
  for (const play of plays) {
    const day = play.playedAt.getDay();
    const hour = play.playedAt.getHours();
    grid[day][hour] += metric === 'ms' ? play.msPlayed : 1;
  }
  return grid;
};

const getSeason = (date: Date): string => {
  const month = date.getMonth();
  if ([11, 0, 1].includes(month)) return 'Winter';
  if ([2, 3, 4].includes(month)) return 'Spring';
  if ([5, 6, 7].includes(month)) return 'Summer';
  return 'Fall';
};

export const buildFunInsights = (plays: NormalizedPlay[]): FunInsight[] => {
  if (plays.length === 0) return [];
  const nightMs = plays
    .filter((play) => {
      const hour = play.playedAt.getHours();
      return hour >= 23 || hour < 5;
    })
    .reduce((sum, play) => sum + play.msPlayed, 0);
  const morningMs = plays
    .filter((play) => {
      const hour = play.playedAt.getHours();
      return hour >= 6 && hour < 12;
    })
    .reduce((sum, play) => sum + play.msPlayed, 0);
  const nightVerdict = nightMs > morningMs ? 'Night owl' : 'Early bird';

  const byDay = new Map<string, { date: string; msPlayed: number; tracks: Map<string, number> }>();
  for (const play of plays) {
    const dateKey = play.playedAt.toISOString().slice(0, 10);
    const existing = byDay.get(dateKey) ?? { date: dateKey, msPlayed: 0, tracks: new Map() };
    existing.msPlayed += play.msPlayed;
    existing.tracks.set(play.trackName, (existing.tracks.get(play.trackName) ?? 0) + play.msPlayed);
    byDay.set(dateKey, existing);
  }
  const mostObsessed = [...byDay.values()].sort((a, b) => b.msPlayed - a.msPlayed)[0];
  const topTrackOnObsessed = mostObsessed
    ? [...mostObsessed.tracks.entries()].sort((a, b) => b[1] - a[1])[0]?.[0]
    : undefined;

  const byArtistDay = new Map<string, Map<string, number>>();
  for (const play of plays) {
    const dateKey = play.playedAt.toISOString().slice(0, 10);
    const artistMap = byArtistDay.get(dateKey) ?? new Map();
    artistMap.set(play.artistName, (artistMap.get(play.artistName) ?? 0) + play.msPlayed);
    byArtistDay.set(dateKey, artistMap);
  }
  let bestArtist = 'Unknown';
  let bestShare = 0;
  let bestDate = '';
  for (const [date, artistMap] of byArtistDay.entries()) {
    const total = [...artistMap.values()].reduce((sum, value) => sum + value, 0);
    for (const [artist, msPlayed] of artistMap.entries()) {
      const share = msPlayed / total;
      if (share > bestShare) {
        bestShare = share;
        bestArtist = artist;
        bestDate = date;
      }
    }
  }

  const firstSeenArtist = new Map<string, number>();
  for (const play of plays) {
    const year = play.playedAt.getFullYear();
    if (!firstSeenArtist.has(play.artistName)) {
      firstSeenArtist.set(play.artistName, year);
    }
  }
  const discoveryMap = new Map<number, number>();
  for (const year of firstSeenArtist.values()) {
    discoveryMap.set(year, (discoveryMap.get(year) ?? 0) + 1);
  }
  const discoveryYear = [...discoveryMap.entries()].sort((a, b) => b[1] - a[1])[0]?.[0];

  const seasonMap = new Map<string, number>();
  for (const play of plays) {
    const season = getSeason(play.playedAt);
    seasonMap.set(season, (seasonMap.get(season) ?? 0) + play.msPlayed);
  }
  const topSeason = [...seasonMap.entries()].sort((a, b) => b[1] - a[1])[0]?.[0];

  return [
    {
      title: 'Night owl vs early bird',
      description: `${nightVerdict}! ${Math.round(nightMs / 36e5)}h late-night vs ${Math.round(
        morningMs / 36e5
      )}h morning listening.`,
    },
    {
      title: 'Most obsessed day',
      description: mostObsessed
        ? `${mostObsessed.date} was your biggest day. Top track: ${topTrackOnObsessed ?? 'Unknown'}.`
        : 'Not enough data yet.',
    },
    {
      title: 'Artist binge',
      description: bestDate
        ? `${bestArtist} dominated ${Math.round(bestShare * 100)}% of your listening on ${bestDate}.`
        : 'Not enough data yet.',
    },
    {
      title: 'Discovery year',
      description: discoveryYear
        ? `You discovered the most new artists in ${discoveryYear}.`
        : 'Not enough data yet.',
    },
    {
      title: 'Seasonal listener',
      description: topSeason
        ? `You listen the most in ${topSeason}.`
        : 'Not enough data yet.',
    },
  ];
};
