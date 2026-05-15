"use client";

import { useState } from "react";
import { Card, CardTitle, ResultBox } from "@/components/ui/Card";
import { Input, Select } from "@/components/ui/Input";

type System = "imperial" | "metric";

function fmt(n: number) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD" });
}

export default function FuelCostCalculator() {
  const [system, setSystem] = useState<System>("imperial");
  const [distance, setDistance] = useState("100");
  const [efficiency, setEfficiency] = useState("30");
  const [fuelPrice, setFuelPrice] = useState("3.50");

  const d = parseFloat(distance) || 0;
  const eff = parseFloat(efficiency) || 1;
  const price = parseFloat(fuelPrice) || 0;

  // imperial: miles / mpg = gallons
  // metric: km / (L/100km) = liters → but user enters L/100km
  let fuelUsed = 0;
  if (system === "imperial") {
    fuelUsed = d / eff;
  } else {
    // eff = L per 100 km
    fuelUsed = (d / 100) * eff;
  }

  const totalCost = fuelUsed * price;
  const costPer100 = d > 0 ? (totalCost / d) * 100 : 0;

  // Cross-conversion helpers
  const mpgToL100 = eff > 0 ? 235.214 / eff : 0;
  const l100ToMpg = eff > 0 ? 235.214 / eff : 0;

  return (
    <Card>
      <CardTitle>Fuel Cost Calculator</CardTitle>
      <div className="flex flex-col gap-4">
        <Select
          label="Measurement System"
          options={[
            { value: "imperial", label: "Imperial (miles, MPG, $/gal)" },
            { value: "metric", label: "Metric (km, L/100km, $/L)" },
          ]}
          value={system}
          onChange={(e) => setSystem(e.target.value as System)}
        />

        <Input
          label={system === "imperial" ? "Trip Distance (miles)" : "Trip Distance (km)"}
          type="number"
          value={distance}
          unit={system === "imperial" ? "mi" : "km"}
          min="0"
          onChange={(e) => setDistance(e.target.value)}
        />

        <Input
          label={system === "imperial" ? "Fuel Efficiency (MPG)" : "Fuel Consumption (L/100km)"}
          type="number"
          value={efficiency}
          unit={system === "imperial" ? "mpg" : "L/100"}
          min="0.1"
          step="0.1"
          onChange={(e) => setEfficiency(e.target.value)}
        />

        <Input
          label={system === "imperial" ? "Fuel Price (per gallon)" : "Fuel Price (per liter)"}
          type="number"
          value={fuelPrice}
          unit={system === "imperial" ? "$/gal" : "$/L"}
          min="0"
          step="0.01"
          onChange={(e) => setFuelPrice(e.target.value)}
        />

        <ResultBox>
          <div className="grid grid-cols-2 gap-3 mb-2">
            <div>
              <p className="text-xs opacity-70">Total Cost</p>
              <p className="text-2xl font-bold">{fmt(totalCost)}</p>
            </div>
            <div>
              <p className="text-xs opacity-70">Fuel Used</p>
              <p className="text-2xl font-bold">
                {fuelUsed.toFixed(2)}{" "}
                <span className="text-sm font-normal">{system === "imperial" ? "gal" : "L"}</span>
              </p>
            </div>
            <div>
              <p className="text-xs opacity-70">Cost per 100 {system === "imperial" ? "mi" : "km"}</p>
              <p className="text-xl font-bold">{fmt(costPer100)}</p>
            </div>
            <div>
              <p className="text-xs opacity-70">
                {system === "imperial" ? "Equivalent L/100km" : "Equivalent MPG"}
              </p>
              <p className="text-xl font-bold">
                {system === "imperial" ? mpgToL100.toFixed(1) : l100ToMpg.toFixed(1)}
                <span className="text-sm font-normal">
                  {" "}{system === "imperial" ? "L/100" : "mpg"}
                </span>
              </p>
            </div>
          </div>
        </ResultBox>
      </div>
    </Card>
  );
}
