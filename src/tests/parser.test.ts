import { describe, expect, it } from 'vitest';
import { parseSpotifyJson } from '../utils/parser';

const sample = [
  {
    endTime: '2023-12-01 10:00',
    msPlayed: 120000,
    trackName: 'Track A',
    artistName: 'Artist A',
    albumName: 'Album A',
    platform: 'iOS',
  },
  {
    ts: '2024-01-02T15:20:00Z',
    ms_played: 240000,
    master_metadata_track_name: 'Track B',
    master_metadata_album_artist_name: 'Artist B',
    master_metadata_album_album_name: 'Album B',
    spotify_track_uri: 'spotify:track:123',
    conn_country: 'DE',
    ip_addr: '127.0.0.1',
  },
];

describe('parseSpotifyJson', () => {
  it('normalizes multiple schema versions', () => {
    const result = parseSpotifyJson(sample);
    expect(result).toHaveLength(2);
    expect(result[0].trackName).toBe('Track A');
    expect(result[1].artistName).toBe('Artist B');
    expect(result[1].trackUri).toBe('spotify:track:123');
    expect(result[1].country).toBe('DE');
    expect(result[1].ipAddress).toBe('127.0.0.1');
  });

  it('returns empty array for invalid payload', () => {
    expect(parseSpotifyJson({})).toEqual([]);
  });
});
