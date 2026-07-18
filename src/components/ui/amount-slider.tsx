"use client";

import type { CSSProperties } from "react";

interface AmountSliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  onChange: (value: number) => void;
}

const formatAmount = (value: number) => value.toLocaleString("fr-FR").replace(/,/g, " ");

export function AmountSlider({
  label,
  value,
  min,
  max,
  step = 1000,
  unit = "HTG",
  onChange,
}: AmountSliderProps) {
  const fill = ((value - min) / (max - min)) * 100;

  return (
    <div className="flex flex-col gap-3">
      <span className="text-[0.9rem] text-ink-secondary">{label}</span>
      <p className="text-[2.5rem] leading-none font-bold text-ink">
        {formatAmount(value)} {unit}
      </p>

      <input
        type="range"
        className="amount-slider"
        style={{ "--slider-fill": `${fill}%` } as CSSProperties}
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-label={label}
      />

      <div className="flex items-center justify-between text-[0.8rem] text-ink-secondary">
        <span>
          {formatAmount(min)} {unit}
        </span>
        <span>
          {formatAmount(max)} {unit}
        </span>
      </div>
    </div>
  );
}
