import { FunInsight } from '../utils/types';

interface FunInsightsProps {
  insights: FunInsight[];
}

const FunInsights = ({ insights }: FunInsightsProps) => {
  if (insights.length === 0) {
    return <p className="text-sm text-slate-400">Upload data to see your insights.</p>;
  }

  return (
    <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
      {insights.map((insight) => (
        <div key={insight.title} className="bg-base-800/70 rounded-2xl p-5 shadow-glow">
          <h4 className="font-semibold mb-2">{insight.title}</h4>
          <p className="text-sm text-slate-300">{insight.description}</p>
        </div>
      ))}
    </div>
  );
};

export default FunInsights;
