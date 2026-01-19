import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { groupByCountry } from '../utils/aggregations';
import { NormalizedPlay } from '../utils/types';

interface CountryChartProps {
  plays: NormalizedPlay[];
}

const formatMinutes = (value: number) => `${Math.round(value / 60000)} min`;

const CountryChart = ({ plays }: CountryChartProps) => {
  const data = groupByCountry(plays).slice(0, 10);

  if (data.length === 0) {
    return <p className="text-sm text-slate-400">No country data available in this filter.</p>;
  }

  return (
    <div className="bg-base-800/60 rounded-2xl p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-semibold">Top listening countries</h4>
        <span className="text-xs text-slate-400">Based on conn_country</span>
      </div>
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ left: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
            <XAxis type="number" stroke="#94a3b8" tickFormatter={formatMinutes} />
            <YAxis type="category" dataKey="country" stroke="#94a3b8" width={60} />
            <Tooltip formatter={(value) => formatMinutes(value as number)} />
            <Bar dataKey="msPlayed" fill="#1db954" radius={[0, 6, 6, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CountryChart;
