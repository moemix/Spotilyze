import { useMemo } from 'react';
import { groupByCountry } from '../utils/aggregations';
import { NormalizedPlay } from '../utils/types';
import CountryChart from './CountryChart';

interface LocationInsightsProps {
  plays: NormalizedPlay[];
}

const formatHours = (ms: number) => `${(ms / 36e5).toFixed(1)} h`;

const LocationInsights = ({ plays }: LocationInsightsProps) => {
  const countries = useMemo(() => groupByCountry(plays), [plays]);
  const totalMs = countries.reduce((sum, item) => sum + item.msPlayed, 0);

  const uniqueCountries = countries.filter((item) => item.country !== 'Unknown').length;
  const topCountry = countries[0];
  const topShare = topCountry && totalMs > 0 ? Math.round((topCountry.msPlayed / totalMs) * 100) : 0;

  const mostDiverseMonth = useMemo(() => {
    const monthMap = new Map<number, Set<string>>();
    plays.forEach((play) => {
      const monthKey = play.playedAt.getFullYear() * 100 + play.playedAt.getMonth();
      const set = monthMap.get(monthKey) ?? new Set();
      if (play.country) {
        set.add(play.country);
      }
      monthMap.set(monthKey, set);
    });
    let bestMonth: number | null = null;
    let bestCount = 0;
    monthMap.forEach((set, key) => {
      if (set.size > bestCount) {
        bestCount = set.size;
        bestMonth = key;
      }
    });
    if (!bestMonth) return '—';
    const year = Math.floor(bestMonth / 100);
    const month = bestMonth % 100;
    const label = new Date(year, month, 1).toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
    return `${label} (${bestCount} countries)`;
  }, [plays]);

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-base-800/60 rounded-2xl p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Countries listened</p>
          <p className="text-2xl font-semibold mt-2">{uniqueCountries || '—'}</p>
          <p className="text-xs text-slate-500 mt-1">Based on conn_country entries</p>
        </div>
        <div className="bg-base-800/60 rounded-2xl p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Top location share</p>
          <p className="text-2xl font-semibold mt-2">{topCountry ? `${topShare}%` : '—'}</p>
          <p className="text-xs text-slate-500 mt-1">
            {topCountry ? `${topCountry.country} • ${formatHours(topCountry.msPlayed)}` : 'No data'}
          </p>
        </div>
        <div className="bg-base-800/60 rounded-2xl p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Most diverse month</p>
          <p className="text-lg font-semibold mt-2">{mostDiverseMonth}</p>
          <p className="text-xs text-slate-500 mt-1">Month with the widest listening spread</p>
        </div>
      </div>
      <CountryChart plays={plays} />
    </div>
  );
};

export default LocationInsights;
