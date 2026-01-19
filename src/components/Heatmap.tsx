import React, { useMemo, useState } from 'react';

interface HeatmapProps {
  grid: number[][];
  valueFormatter: (value: number) => string;
}

const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const buildColor = (value: number, maxValue: number) => {
  const ratio = Math.min(Math.max(value / maxValue, 0), 1);
  const hue = 0 + ratio * 120;
  return `hsl(${hue}, 70%, 45%)`;
};

const Heatmap = ({ grid, valueFormatter }: HeatmapProps) => {
  const maxValue = Math.max(...grid.flat(), 1);
  const [selected, setSelected] = useState<{ day: number; hour: number; value: number } | null>(null);
  const peak = useMemo(() => {
    let best = { day: 0, hour: 0, value: 0 };
    grid.forEach((row, dayIndex) => {
      row.forEach((value, hour) => {
        if (value > best.value) {
          best = { day: dayIndex, hour, value };
        }
      });
    });
    return best;
  }, [grid]);

  return (
    <div className="overflow-x-auto">
      <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 mb-3">
        <span>
          Peak: {days[peak.day]} {peak.hour}:00 ({valueFormatter(peak.value)})
        </span>
        {selected ? (
          <span className="text-accent-300">
            Selected: {days[selected.day]} {selected.hour}:00 ({valueFormatter(selected.value)})
          </span>
        ) : (
          <span className="text-slate-400">Click a cell to pin a value.</span>
        )}
      </div>
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
                  className="h-6 rounded cursor-pointer hover:scale-105 transition"
                  style={{
                    background: buildColor(value, maxValue),
                    opacity: Math.max(0.15, intensity),
                    boxShadow:
                      selected?.day === dayIndex && selected.hour === hour
                        ? '0 0 0 1px rgba(56,224,122,0.9)'
                        : 'none',
                  }}
                  onClick={() => setSelected({ day: dayIndex, hour, value })}
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
