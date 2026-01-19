import { useMemo, useState } from 'react';
import FileUpload from './components/FileUpload';
import FilterPanel from './components/FilterPanel';
import FunInsights from './components/FunInsights';
import MetricCard from './components/MetricCard';
import RankingTable from './components/RankingTable';
import TimeCharts from './components/TimeCharts';
import { useSpotifyData } from './hooks/useSpotifyData';
import { buildFunInsights, rankBy } from './utils/aggregations';
import { parseSpotifyFiles } from './utils/parser';

const formatHours = (ms: number) => `${(ms / 36e5).toFixed(1)} h`;

const App = () => {
  const { plays, summary, filters, filteredPlays, lifetimeSummary, filteredSummary, setFilters, updateData } =
    useSpotifyData();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleFilesSelected = async (files: File[]) => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const result = await parseSpotifyFiles(files);
      updateData(result.plays, result.invalidFiles, files.length);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Failed to parse files.');
    } finally {
      setIsLoading(false);
    }
  };

  const funInsights = useMemo(() => buildFunInsights(filteredPlays), [filteredPlays]);

  const topArtists = useMemo(() => rankBy(filteredPlays, (play) => play.artistName), [filteredPlays]);
  const topTracks = useMemo(() => rankBy(filteredPlays, (play) => play.trackName), [filteredPlays]);
  const topAlbums = useMemo(() => rankBy(filteredPlays, (play) => play.albumName), [filteredPlays]);
  const topContexts = useMemo(() => rankBy(filteredPlays, (play) => play.contextType), [filteredPlays]);

  const hasData = plays.length > 0;

  return (
    <div className="min-h-screen bg-base-900 text-slate-100">
      <header className="sticky top-0 z-10 bg-base-900/80 backdrop-blur border-b border-base-700">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Spotilyze</h1>
            <p className="text-sm text-slate-400">Spotify listening dashboard</p>
          </div>
          <nav className="hidden md:flex gap-4 text-sm text-slate-300">
            <a href="#overview" className="hover:text-accent-300 transition">
              Overview
            </a>
            <a href="#time" className="hover:text-accent-300 transition">
              Time
            </a>
            <a href="#rankings" className="hover:text-accent-300 transition">
              Artists & Tracks
            </a>
            <a href="#fun" className="hover:text-accent-300 transition">
              Fun Insights
            </a>
            <a href="#about" className="hover:text-accent-300 transition">
              About
            </a>
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8 space-y-12">
        <section id="overview" className="space-y-6">
          <FileUpload onFilesSelected={handleFilesSelected} />
          {isLoading ? <p className="text-sm text-slate-400">Parsing your files...</p> : null}
          {errorMessage ? <p className="text-sm text-red-300">{errorMessage}</p> : null}

          {summary.totalPlays > 0 ? (
            <div className="bg-base-800/60 rounded-2xl p-6 space-y-2">
              <h2 className="text-lg font-semibold">Import summary</h2>
              <div className="text-sm text-slate-300 flex flex-wrap gap-4">
                <span>Files: {summary.fileCount}</span>
                <span>Total plays: {summary.totalPlays}</span>
                {summary.dateRange ? (
                  <span>
                    Date range: {summary.dateRange.start.toDateString()} - {summary.dateRange.end.toDateString()}
                  </span>
                ) : null}
              </div>
              {summary.invalidFiles.length > 0 ? (
                <p className="text-sm text-amber-300">Ignored invalid files: {summary.invalidFiles.join(', ')}</p>
              ) : null}
            </div>
          ) : (
            <p className="text-sm text-slate-400">Upload your exported JSON files to unlock the dashboard.</p>
          )}

          {hasData ? (
            <FilterPanel plays={plays} filters={filters} onChange={setFilters} />
          ) : null}

          {hasData ? (
            <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-4">
              <MetricCard
                title="Listening time (filtered)"
                value={formatHours(filteredSummary.totalMs)}
                subtitle={`Lifetime: ${formatHours(lifetimeSummary.totalMs)}`}
              />
              <MetricCard
                title="Total plays"
                value={`${filteredSummary.totalPlays}`}
                subtitle={`Lifetime: ${lifetimeSummary.totalPlays}`}
              />
              <MetricCard
                title="Unique artists"
                value={`${filteredSummary.uniqueArtists}`}
                subtitle={`Lifetime: ${lifetimeSummary.uniqueArtists}`}
              />
              <MetricCard
                title="Unique tracks"
                value={`${filteredSummary.uniqueTracks}`}
                subtitle={`Lifetime: ${lifetimeSummary.uniqueTracks}`}
              />
              <MetricCard
                title="First listened"
                value={lifetimeSummary.firstPlay ? lifetimeSummary.firstPlay.toDateString() : '—'}
              />
              <MetricCard
                title="Last listened"
                value={lifetimeSummary.lastPlay ? lifetimeSummary.lastPlay.toDateString() : '—'}
              />
              <MetricCard
                title="Top artist (all time)"
                value={lifetimeSummary.topArtist ?? '—'}
              />
              <MetricCard
                title="Top track (all time)"
                value={lifetimeSummary.topTrack ?? '—'}
              />
            </div>
          ) : null}
        </section>

        {hasData ? (
          <section id="time" className="space-y-6">
            <TimeCharts plays={filteredPlays} />
          </section>
        ) : null}

        {hasData ? (
          <section id="rankings" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <RankingTable title="Top artists" items={topArtists} />
              <RankingTable title="Top tracks" items={topTracks} />
              <RankingTable title="Top albums" items={topAlbums} />
              <RankingTable title="Top contexts" items={topContexts} />
            </div>
          </section>
        ) : null}

        {hasData ? (
          <section id="fun" className="space-y-4">
            <h2 className="text-xl font-semibold">Fun insights</h2>
            <FunInsights insights={funInsights} />
          </section>
        ) : null}

        <section id="about" className="space-y-4">
          <h2 className="text-xl font-semibold">About this dashboard</h2>
          <div className="bg-base-800/60 rounded-2xl p-6 text-sm text-slate-300 space-y-3">
            <p>
              Spotilyze runs entirely in your browser. Upload your local Spotify export JSON files and the data is
              parsed locally. Nothing is uploaded, stored, or shared.
            </p>
            <p>
              <strong>Overview</strong> highlights your top metrics and total listening time. <strong>Time</strong>{' '}
              reveals long-term trends, seasonal patterns, and your weekday/hour heatmap. <strong>Artists & Tracks</strong>{' '}
              gives sortable leaderboards. <strong>Fun insights</strong> surfaces shareable stats about your listening
              personality.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
};

export default App;
