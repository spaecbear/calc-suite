"use client";

import { useState } from "react";
import { Card, CardTitle, ResultBox } from "@/components/ui/Card";
import { Input, Select } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { ArrowLeftRight } from "lucide-react";

type Category = "length" | "weight" | "temperature" | "volume" | "area" | "speed";

const UNITS: Record<Category, { value: string; label: string; toBase: (v: number) => number; fromBase: (v: number) => number }[]> = {
  length: [
    { value: "mm", label: "Millimeters (mm)", toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
    { value: "cm", label: "Centimeters (cm)", toBase: (v) => v / 100, fromBase: (v) => v * 100 },
    { value: "m", label: "Meters (m)", toBase: (v) => v, fromBase: (v) => v },
    { value: "km", label: "Kilometers (km)", toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
    { value: "in", label: "Inches (in)", toBase: (v) => v * 0.0254, fromBase: (v) => v / 0.0254 },
    { value: "ft", label: "Feet (ft)", toBase: (v) => v * 0.3048, fromBase: (v) => v / 0.3048 },
    { value: "yd", label: "Yards (yd)", toBase: (v) => v * 0.9144, fromBase: (v) => v / 0.9144 },
    { value: "mi", label: "Miles (mi)", toBase: (v) => v * 1609.344, fromBase: (v) => v / 1609.344 },
  ],
  weight: [
    { value: "mg", label: "Milligrams (mg)", toBase: (v) => v / 1e6, fromBase: (v) => v * 1e6 },
    { value: "g", label: "Grams (g)", toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
    { value: "kg", label: "Kilograms (kg)", toBase: (v) => v, fromBase: (v) => v },
    { value: "t", label: "Metric Tons (t)", toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
    { value: "oz", label: "Ounces (oz)", toBase: (v) => v * 0.0283495, fromBase: (v) => v / 0.0283495 },
    { value: "lb", label: "Pounds (lb)", toBase: (v) => v * 0.453592, fromBase: (v) => v / 0.453592 },
    { value: "st", label: "Stone (st)", toBase: (v) => v * 6.35029, fromBase: (v) => v / 6.35029 },
  ],
  temperature: [
    { value: "c", label: "Celsius (°C)", toBase: (v) => v, fromBase: (v) => v },
    { value: "f", label: "Fahrenheit (°F)", toBase: (v) => (v - 32) * (5 / 9), fromBase: (v) => v * (9 / 5) + 32 },
    { value: "k", label: "Kelvin (K)", toBase: (v) => v - 273.15, fromBase: (v) => v + 273.15 },
  ],
  volume: [
    { value: "ml", label: "Milliliters (ml)", toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
    { value: "l", label: "Liters (L)", toBase: (v) => v, fromBase: (v) => v },
    { value: "m3", label: "Cubic Meters (m³)", toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
    { value: "floz", label: "Fl. Ounces (fl oz)", toBase: (v) => v * 0.0295735, fromBase: (v) => v / 0.0295735 },
    { value: "cup", label: "Cups (cup)", toBase: (v) => v * 0.236588, fromBase: (v) => v / 0.236588 },
    { value: "pt", label: "Pints (pt)", toBase: (v) => v * 0.473176, fromBase: (v) => v / 0.473176 },
    { value: "qt", label: "Quarts (qt)", toBase: (v) => v * 0.946353, fromBase: (v) => v / 0.946353 },
    { value: "gal", label: "Gallons (gal)", toBase: (v) => v * 3.78541, fromBase: (v) => v / 3.78541 },
  ],
  area: [
    { value: "mm2", label: "Sq. Millimeters (mm²)", toBase: (v) => v / 1e6, fromBase: (v) => v * 1e6 },
    { value: "cm2", label: "Sq. Centimeters (cm²)", toBase: (v) => v / 10000, fromBase: (v) => v * 10000 },
    { value: "m2", label: "Sq. Meters (m²)", toBase: (v) => v, fromBase: (v) => v },
    { value: "km2", label: "Sq. Kilometers (km²)", toBase: (v) => v * 1e6, fromBase: (v) => v / 1e6 },
    { value: "in2", label: "Sq. Inches (in²)", toBase: (v) => v * 0.00064516, fromBase: (v) => v / 0.00064516 },
    { value: "ft2", label: "Sq. Feet (ft²)", toBase: (v) => v * 0.092903, fromBase: (v) => v / 0.092903 },
    { value: "ac", label: "Acres (ac)", toBase: (v) => v * 4046.86, fromBase: (v) => v / 4046.86 },
    { value: "ha", label: "Hectares (ha)", toBase: (v) => v * 10000, fromBase: (v) => v / 10000 },
  ],
  speed: [
    { value: "ms", label: "Meters/sec (m/s)", toBase: (v) => v, fromBase: (v) => v },
    { value: "kmh", label: "Km/hour (km/h)", toBase: (v) => v / 3.6, fromBase: (v) => v * 3.6 },
    { value: "mph", label: "Miles/hour (mph)", toBase: (v) => v * 0.44704, fromBase: (v) => v / 0.44704 },
    { value: "kn", label: "Knots (kn)", toBase: (v) => v * 0.514444, fromBase: (v) => v / 0.514444 },
    { value: "mach", label: "Mach (Ma)", toBase: (v) => v * 340.29, fromBase: (v) => v / 340.29 },
  ],
};

const CATEGORIES: { value: Category; label: string }[] = [
  { value: "length", label: "Length" },
  { value: "weight", label: "Weight / Mass" },
  { value: "temperature", label: "Temperature" },
  { value: "volume", label: "Volume" },
  { value: "area", label: "Area" },
  { value: "speed", label: "Speed" },
];

function fmt(n: number): string {
  if (!isFinite(n)) return "—";
  if (Math.abs(n) >= 1e9 || (Math.abs(n) < 0.0001 && n !== 0)) return n.toExponential(4);
  return parseFloat(n.toPrecision(7)).toString();
}

export default function UnitConverter() {
  const [category, setCategory] = useState<Category>("length");
  const [fromUnit, setFromUnit] = useState(UNITS.length[3].value);
  const [toUnit, setToUnit] = useState(UNITS.length[5].value);
  const [value, setValue] = useState("1");

  const units = UNITS[category];

  const handleCategoryChange = (cat: Category) => {
    setCategory(cat);
    setFromUnit(UNITS[cat][0].value);
    setToUnit(UNITS[cat][1].value);
    setValue("1");
  };

  const swap = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
  };

  const fromDef = units.find((u) => u.value === fromUnit)!;
  const toDef = units.find((u) => u.value === toUnit)!;
  const numVal = parseFloat(value);
  const result = isNaN(numVal) ? null : toDef.fromBase(fromDef.toBase(numVal));

  const unitOpts = units.map((u) => ({ value: u.value, label: u.label }));

  return (
    <Card>
      <CardTitle>Unit Converter</CardTitle>
      <div className="flex flex-col gap-4">
        <Select
          label="Category"
          options={CATEGORIES}
          value={category}
          onChange={(e) => handleCategoryChange(e.target.value as Category)}
        />

        <Input
          label="Value"
          type="number"
          value={value}
          placeholder="Enter value"
          onChange={(e) => setValue(e.target.value)}
        />

        <div className="flex items-end gap-2">
          <div className="flex-1">
            <Select
              label="From"
              options={unitOpts}
              value={fromUnit}
              onChange={(e) => setFromUnit(e.target.value)}
            />
          </div>
          <Button variant="secondary" size="sm" className="mb-0.5 h-10" onClick={swap}>
            <ArrowLeftRight size={14} />
          </Button>
          <div className="flex-1">
            <Select
              label="To"
              options={unitOpts}
              value={toUnit}
              onChange={(e) => setToUnit(e.target.value)}
            />
          </div>
        </div>

        {result !== null && (
          <ResultBox>
            <p className="text-xs font-medium mb-1 opacity-70">Result</p>
            <p className="text-2xl font-bold">
              {fmt(result)}{" "}
              <span className="text-base font-normal">{toUnit}</span>
            </p>
            <p className="text-xs mt-1 opacity-70">
              {fmt(numVal)} {fromUnit} = {fmt(result)} {toUnit}
            </p>
          </ResultBox>
        )}
      </div>
    </Card>
  );
}
