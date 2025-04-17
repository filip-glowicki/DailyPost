"use client";

import { Slider } from "@/components/ui/slider";

interface LengthSliderProps {
  value: string;
  onChange: (value: string) => void;
}

const lengthOptions = [
  { value: "short", label: "Short", description: "~300 words" },
  { value: "medium", label: "Medium", description: "~500 words" },
  { value: "long", label: "Long", description: "~800 words" },
];

export function LengthSlider({ value, onChange }: LengthSliderProps) {
  const currentIndex =
    lengthOptions.findIndex((option) => option.value === value) ?? 1;

  const handleSliderChange = (values: number[]) => {
    const index = values[0];
    onChange(lengthOptions[index].value);
  };

  return (
    <div className="space-y-4">
      <Slider
        min={0}
        max={2}
        step={1}
        value={[currentIndex]}
        onValueChange={handleSliderChange}
        className="w-full"
      />
      <div className="flex justify-between text-sm text-muted-foreground">
        {lengthOptions.map((option) => (
          <div key={option.value} className="text-center">
            <div className="font-medium">{option.label}</div>
            <div className="text-xs">{option.description}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
