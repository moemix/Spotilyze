import React from 'react';

interface HeatmapProps {
  grid: number[][];
  valueFormatter: (value: number) => string;
}

const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const Heatmap = ({ grid, valueFormatter }: HeatmapProps) => {
  const maxValue = Math.max(...grid.flat(), 1);

  return (
    <div className="overflow-x-auto">
      <div className="grid grid-cols-[auto_repeat(24,minmax(24px,1fr))] gap-1 text-[10px]">
        <div></div>
        {Array.from({ length: 24 }).map((_, hour) => (
          <div key={hour} className="text-center text-slate-400">
            {hour}
          </div>
        ))}
        {grid.map((row, dayIndex) => (
          <React.Fragment key={days[dayIndex]}>
            <div className="text-slate-400 pr-2">{days[dayIndex]}</div>
            {row.map((value, hour) => {
              const intensity = value / maxValue;
              return (
                <div
                  key={`${dayIndex}-${hour}`}
                  title={`${days[dayIndex]} ${hour}:00 • ${valueFormatter(value)}`}
                  className="h-6 rounded"
                  style={{
                    background: `rgba(56,224,122,${Math.max(0.1, intensity)})`,
                  }}
                />
              );
            })}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default Heatmap;
