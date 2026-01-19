import { useMemo } from 'react';
import { FilterState, NormalizedPlay } from '../utils/types';

interface FilterPanelProps {
  plays: NormalizedPlay[];
  filters: FilterState;
  onChange: (next: FilterState) => void;
}

const buildOptions = (plays: NormalizedPlay[], selector: (play: NormalizedPlay) => string | undefined) =>
  Array.from(new Set(plays.map(selector).filter(Boolean) as string[])).sort((a, b) => a.localeCompare(b));

const FilterPanel = ({ plays, filters, onChange }: FilterPanelProps) => {
  const artists = useMemo(() => buildOptions(plays, (play) => play.artistName), [plays]);
  const tracks = useMemo(() => buildOptions(plays, (play) => play.trackName), [plays]);
  const contexts = useMemo(() => buildOptions(plays, (play) => play.contextType), [plays]);
  const platforms = useMemo(() => buildOptions(plays, (play) => play.platform), [plays]);
  const countries = useMemo(() => buildOptions(plays, (play) => play.country), [plays]);

  const update = (patch: Partial<FilterState>) => {
    onChange({ ...filters, ...patch });
  };

  return (
    <div className="bg-base-800/60 rounded-2xl p-6 space-y-4">
      <div className="flex flex-wrap gap-4">
        <label className="flex flex-col text-sm gap-2">
          Start date
          <input
            type="date"
            value={filters.startDate ?? ''}
            onChange={(event) => update({ startDate: event.target.value || undefined })}
            className="bg-base-900 border border-base-600 rounded-lg px-3 py-2"
          />
        </label>
        <label className="flex flex-col text-sm gap-2">
          End date
          <input
            type="date"
            value={filters.endDate ?? ''}
            onChange={(event) => update({ endDate: event.target.value || undefined })}
            className="bg-base-900 border border-base-600 rounded-lg px-3 py-2"
          />
        </label>
        <label className="flex flex-col text-sm gap-2 min-w-[200px]">
          Artist
          <input
            list="artist-options"
            value={filters.artist ?? ''}
            onChange={(event) => update({ artist: event.target.value || undefined })}
            placeholder="Search artist"
            className="bg-base-900 border border-base-600 rounded-lg px-3 py-2"
          />
          <datalist id="artist-options">
            {artists.map((artist) => (
              <option key={artist} value={artist} />
            ))}
          </datalist>
        </label>
        <label className="flex flex-col text-sm gap-2 min-w-[200px]">
          Track
          <input
            list="track-options"
            value={filters.track ?? ''}
            onChange={(event) => update({ track: event.target.value || undefined })}
            placeholder="Search track"
            className="bg-base-900 border border-base-600 rounded-lg px-3 py-2"
          />
          <datalist id="track-options">
            {tracks.map((track) => (
              <option key={track} value={track} />
            ))}
          </datalist>
        </label>
        <label className="flex flex-col text-sm gap-2 min-w-[180px]">
          Context
          <select
            value={filters.contextType ?? ''}
            onChange={(event) => update({ contextType: event.target.value || undefined })}
            className="bg-base-900 border border-base-600 rounded-lg px-3 py-2"
          >
            <option value="">All</option>
            {contexts.map((context) => (
              <option key={context} value={context}>
                {context}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col text-sm gap-2 min-w-[180px]">
          Platform
          <select
            value={filters.platform ?? ''}
            onChange={(event) => update({ platform: event.target.value || undefined })}
            className="bg-base-900 border border-base-600 rounded-lg px-3 py-2"
          >
            <option value="">All</option>
            {platforms.map((platform) => (
              <option key={platform} value={platform}>
                {platform}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col text-sm gap-2 min-w-[180px]">
          Country
          <select
            value={filters.country ?? ''}
            onChange={(event) => update({ country: event.target.value || undefined })}
            className="bg-base-900 border border-base-600 rounded-lg px-3 py-2"
          >
            <option value="">All</option>
            {countries.map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>
        </label>
        <button
          className="self-end px-3 py-2 rounded-lg border border-base-600 text-sm hover:border-accent-400 hover:text-accent-300 transition"
          onClick={() => onChange({})}
        >
          Reset filters
        </button>
      </div>
    </div>
  );
};

export default FilterPanel;
