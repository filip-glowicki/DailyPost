"use client";

import { Slider } from "@/components/ui/slider";

interface LengthSliderProps {
  value: string;
  onChange: (value: string) => void;
}

const lengthOptions = [
  { value: "short", label: "Krótki", description: "~300 słów" },
  { value: "medium", label: "Średni", description: "~500 słów" },
  { value: "long", label: "Długi", description: "~800 słów" },
];

export function LengthSlider({ value, onChange }: LengthSliderProps) {
  const currentIndex =
    lengthOptions.findIndex((option) => option.value === value) ?? 1;

  const handleSliderChange = (values: number[]) => {
    const index = values[0];
    onChange(lengthOptions[index].value);
  };

  return (
    <div className="space-y-4" data-test-id="post-length-slider">
      <Slider
        min={0}
        max={2}
        step={1}
        value={[currentIndex]}
        onValueChange={handleSliderChange}
        className="w-full"
        data-test-id="post-length-slider-input"
      />
      <div className="flex justify-between text-sm text-muted-foreground">
        {lengthOptions.map((option) => (
          <div
            key={option.value}
            className="text-center"
            data-test-id={`length-option-${option.value}`}
          >
            <div className="font-medium">{option.label}</div>
            <div className="text-xs">{option.description}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
