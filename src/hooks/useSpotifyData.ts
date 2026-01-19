import { useMemo, useState } from 'react';
import { applyFilters, summarize } from '../utils/aggregations';
import { FilterState, ImportSummary, MetricSummary, NormalizedPlay } from '../utils/types';

const emptyFilters: FilterState = {};

export const useSpotifyData = () => {
  const [plays, setPlays] = useState<NormalizedPlay[]>([]);
  const [summary, setSummary] = useState<ImportSummary>({ totalPlays: 0, fileCount: 0, invalidFiles: [] });
  const [filters, setFilters] = useState<FilterState>(emptyFilters);

  const filteredPlays = useMemo(() => applyFilters(plays, filters), [plays, filters]);
  const lifetimeSummary = useMemo<MetricSummary>(() => summarize(plays), [plays]);
  const filteredSummary = useMemo<MetricSummary>(() => summarize(filteredPlays), [filteredPlays]);

  const updateData = (nextPlays: NormalizedPlay[], invalidFiles: string[], fileCount: number) => {
    setPlays(nextPlays);
    const sorted = [...nextPlays].sort((a, b) => a.playedAt.getTime() - b.playedAt.getTime());
    const dateRange = sorted.length
      ? { start: sorted[0].playedAt, end: sorted[sorted.length - 1].playedAt }
      : undefined;
    setSummary({ totalPlays: nextPlays.length, fileCount, invalidFiles, dateRange });
  };

  return {
    plays,
    summary,
    filters,
    filteredPlays,
    lifetimeSummary,
    filteredSummary,
    setFilters,
    updateData,
  };
};
