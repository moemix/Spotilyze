import { describe, expect, it } from 'vitest';
import { buildHeatmap, groupByMonth, groupByYear, summarize } from '../utils/aggregations';
import { NormalizedPlay } from '../utils/types';

const plays: NormalizedPlay[] = [
  {
    id: '1',
    playedAt: new Date('2023-01-02T10:00:00Z'),
    msPlayed: 60000,
    trackName: 'Track A',
    artistName: 'Artist A',
  },
  {
    id: '2',
    playedAt: new Date('2023-02-05T12:00:00Z'),
    msPlayed: 120000,
    trackName: 'Track B',
    artistName: 'Artist B',
  },
  {
    id: '3',
    playedAt: new Date('2024-02-05T12:00:00Z'),
    msPlayed: 180000,
    trackName: 'Track B',
    artistName: 'Artist B',
  },
];

describe('aggregations', () => {
  it('summarizes metrics', () => {
    const summary = summarize(plays);
    expect(summary.totalPlays).toBe(3);
    expect(summary.uniqueArtists).toBe(2);
    expect(summary.totalMs).toBe(360000);
  });

  it('groups by year and month', () => {
    const years = groupByYear(plays);
    expect(years).toHaveLength(2);
    expect(years[0].year).toBe(2023);

    const months = groupByMonth(plays, 2023);
    expect(months[0].msPlayed).toBe(60000);
  });

  it('builds heatmap counts', () => {
    const grid = buildHeatmap(plays, 'plays');
    expect(grid.flat().reduce((sum, value) => sum + value, 0)).toBe(3);
  });
});
