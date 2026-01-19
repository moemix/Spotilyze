import React, { useMemo, useState } from 'react';

interface HeatmapProps {
  grid: number[][];
  valueFormatter: (value: number) => string;
}

const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const getColor = (intensity: number) => {
  const clamped = Math.min(Math.max(intensity, 0), 1);
  const hue = 260 - clamped * 160;
  const saturation = 65 + clamped * 20;
  const lightness = 18 + clamped * 52;
  return `hsl(${hue} ${saturation}% ${lightness}%)`;
};

const Heatmap = ({ grid, valueFormatter }: HeatmapProps) => {
  const maxValue = Math.max(...grid.flat(), 1);
  const [hovered, setHovered] = useState<{ day: number; hour: number; value: number } | null>(null);

  const peak = useMemo(() => {
    let best = { day: 0, hour: 0, value: 0 };
    grid.forEach((row, day) => {
      row.forEach((value, hour) => {
        if (value > best.value) {
          best = { day, hour, value };
        }
      });
    });
    return best.value > 0 ? best : null;
  }, [grid]);

  return (
    <div className="overflow-x-auto space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-300">
        <div className="flex items-center gap-2">
          <span className="uppercase tracking-[0.2em] text-[10px] text-slate-500">Heat level</span>
          <div className="h-2 w-40 rounded-full bg-gradient-to-r from-indigo-950 via-purple-600 to-amber-300" />
        </div>
        <span className="text-slate-400">
          {hovered
            ? `${days[hovered.day]} · ${hovered.hour}:00 — ${valueFormatter(hovered.value)}`
            : peak
              ? `Peak: ${days[peak.day]} · ${peak.hour}:00`
              : 'Hover a cell for details'}
        </span>
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
                  className="h-6 rounded transition duration-200 hover:scale-[1.08] hover:ring-2 hover:ring-white/60"
                  onMouseEnter={() => setHovered({ day: dayIndex, hour, value })}
                  onMouseLeave={() => setHovered(null)}
                  style={{
                    background: getColor(Math.max(0.08, intensity)),
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
