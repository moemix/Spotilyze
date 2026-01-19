import { useEffect, useMemo, useState } from 'react';
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { buildHeatmap, groupByMonth, groupByYear } from '../utils/aggregations';
import { NormalizedPlay } from '../utils/types';
import Heatmap from './Heatmap';

interface TimeChartsProps {
  plays: NormalizedPlay[];
}

const formatMinutes = (value: number) => `${Math.round(value / 60000)} min`;

const TimeCharts = ({ plays }: TimeChartsProps) => {
  const [metric, setMetric] = useState<'ms' | 'plays'>('ms');

  const yearly = useMemo(() => groupByYear(plays), [plays]);
  const yearOptions = yearly.map((item) => item.year);
  const [selectedYear, setSelectedYear] = useState(yearOptions[yearOptions.length - 1] ?? new Date().getFullYear());

  useEffect(() => {
    if (yearOptions.length > 0 && !yearOptions.includes(selectedYear)) {
      setSelectedYear(yearOptions[yearOptions.length - 1]);
    }
  }, [yearOptions, selectedYear]);

  const monthly = useMemo(() => groupByMonth(plays, selectedYear), [plays, selectedYear]);
  const heatmap = useMemo(() => buildHeatmap(plays, metric), [plays, metric]);

  const tooltipFormatter = (value: number) => (metric === 'ms' ? formatMinutes(value) : `${value} plays`);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h3 className="text-lg font-semibold">Time-based analytics</h3>
        <div className="flex items-center gap-2">
          <button
            className={`px-3 py-1 rounded-full text-sm border transition ${
              metric === 'ms' ? 'border-accent-400 text-accent-300' : 'border-base-600 text-slate-400'
            }`}
            onClick={() => setMetric('ms')}
          >
            Time listened
          </button>
          <button
            className={`px-3 py-1 rounded-full text-sm border transition ${
              metric === 'plays' ? 'border-accent-400 text-accent-300' : 'border-base-600 text-slate-400'
            }`}
            onClick={() => setMetric('plays')}
          >
            Plays
          </button>
        </div>
      </div>
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-base-800/60 rounded-2xl p-6">
          <h4 className="font-semibold mb-4">Listening over years</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={yearly}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                <XAxis dataKey="year" stroke="#94a3b8" />
                <YAxis
                  stroke="#94a3b8"
                  tickFormatter={(value) => (metric === 'ms' ? formatMinutes(value) : value)}
                />
                <Tooltip formatter={(value) => tooltipFormatter(value as number)} />
                <Bar dataKey={metric === 'ms' ? 'msPlayed' : 'plays'} fill="#38e07a" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-base-800/60 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold">Monthly trend</h4>
            <select
              value={selectedYear}
              onChange={(event) => setSelectedYear(Number(event.target.value))}
              className="bg-base-900 border border-base-600 rounded-lg px-2 py-1 text-sm"
            >
              {yearOptions.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthly}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                <XAxis
                  dataKey="month"
                  stroke="#94a3b8"
                  tickFormatter={(value) =>
                    ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][value]
                  }
                />
                <YAxis
                  stroke="#94a3b8"
                  tickFormatter={(value) => (metric === 'ms' ? formatMinutes(value) : value)}
                />
                <Tooltip formatter={(value) => tooltipFormatter(value as number)} />
                <Line type="monotone" dataKey={metric === 'ms' ? 'msPlayed' : 'plays'} stroke="#1db954" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      <div className="bg-base-800/60 rounded-2xl p-6 space-y-3">
        <h4 className="font-semibold">Weekday vs hour heatmap</h4>
        <Heatmap
          grid={heatmap}
          valueFormatter={(value) =>
            metric === 'ms' ? `${Math.round(value / 60000)} min` : `${value} plays`
          }
        />
      </div>
    </div>
  );
};

export default TimeCharts;
