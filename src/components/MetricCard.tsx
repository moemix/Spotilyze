interface MetricCardProps {
  title: string;
  value: string;
  subtitle?: string;
}

const MetricCard = ({ title, value, subtitle }: MetricCardProps) => {
  return (
    <div className="bg-base-800/70 rounded-2xl p-5 shadow-glow hover:-translate-y-1 transition">
      <p className="text-xs uppercase tracking-wide text-slate-400">{title}</p>
      <p className="text-2xl font-semibold mt-2">{value}</p>
      {subtitle ? <p className="text-sm text-slate-400 mt-1">{subtitle}</p> : null}
    </div>
  );
};

export default MetricCard;
