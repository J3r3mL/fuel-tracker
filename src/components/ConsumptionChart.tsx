import React from 'react';
import { Card } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface FuelEntry {
  date: string;
  totalPrice: number;
  liters: number;
  mileage: number;
}

interface ConsumptionChartProps {
  entries: FuelEntry[];
}

const ConsumptionChart: React.FC<ConsumptionChartProps> = ({ entries }) => {
  const chartData = entries
    .map((entry, index) => {
      const prevEntry = entries[index + 1];
      if (!prevEntry) return null;

      const distance = entry.mileage - prevEntry.mileage;
      const consumption = (entry.liters / distance) * 100;

      return {
        date: entry.date,
        consumption: Number(consumption.toFixed(2)),
      };
    })
    .filter((entry): entry is { date: string; consumption: number } => entry !== null)
    .reverse();

  return (
    <Card className="p-4 w-full">
      <h3 className="text-lg font-semibold mb-4">Évolution de la consommation</h3>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="consumption"
              stroke="#2563eb"
              strokeWidth={2}
              dot={{ fill: '#2563eb' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default ConsumptionChart;