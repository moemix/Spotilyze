import { useMemo, useState } from 'react';
import { RankedItem } from '../utils/types';

interface RankingTableProps {
  title: string;
  items: RankedItem[];
}

const RankingTable = ({ title, items }: RankingTableProps) => {
  const [query, setQuery] = useState('');
  const [sortKey, setSortKey] = useState<'ms' | 'plays'>('ms');
  const [limit, setLimit] = useState(20);

  const filtered = useMemo(() => {
    const lower = query.toLowerCase();
    return items.filter((item) => item.name.toLowerCase().includes(lower));
  }, [items, query]);

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) =>
      sortKey === 'ms' ? b.msPlayed - a.msPlayed : b.plays - a.plays
    );
  }, [filtered, sortKey]);

  const visible = sorted.slice(0, limit);

  return (
    <div className="bg-base-800/60 rounded-2xl p-6 space-y-4">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h3 className="text-lg font-semibold">{title}</h3>
        <div className="flex items-center gap-2 text-sm">
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search"
            className="bg-base-900 border border-base-600 rounded-lg px-3 py-1"
          />
          <select
            value={sortKey}
            onChange={(event) => setSortKey(event.target.value as 'ms' | 'plays')}
            className="bg-base-900 border border-base-600 rounded-lg px-2 py-1"
          >
            <option value="ms">Time listened</option>
            <option value="plays">Plays</option>
          </select>
          <select
            value={limit}
            onChange={(event) => setLimit(Number(event.target.value))}
            className="bg-base-900 border border-base-600 rounded-lg px-2 py-1"
          >
            {[10, 20, 50].map((size) => (
              <option key={size} value={size}>
                Top {size}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="space-y-2 max-h-72 overflow-y-auto pr-2">
        {visible.length === 0 ? (
          <p className="text-sm text-slate-400">No data for this filter.</p>
        ) : (
          visible.map((item, index) => (
            <div
              key={item.name}
              className="flex items-center justify-between text-sm border-b border-base-700/60 pb-2"
            >
              <div className="flex items-center gap-3">
                <span className="text-slate-400">#{index + 1}</span>
                <span className="font-medium">{item.name}</span>
              </div>
              <div className="text-right">
                <div>{Math.round(item.msPlayed / 60000)} min</div>
                <div className="text-xs text-slate-400">{item.plays} plays</div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RankingTable;
