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
    .slice()
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map((entry, index, sortedEntries) => {
      const nextEntry = sortedEntries[index + 1];
      if (!nextEntry) return null;

      const distance = nextEntry.mileage - entry.mileage;
      const consumption = (nextEntry.liters / distance) * 100;

      return {
        date: nextEntry.date,
        consumption: Number(consumption.toFixed(2)),
      };
    })
    .filter((entry): entry is { date: string; consumption: number } => entry !== null);

  return (
    <Card className="p-4 w-full">
      <h3 className="text-lg font-semibold mb-4">Évolution de la consommation (L/100km)</h3>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <XAxis 
              dataKey="date" 
              angle={-45}
              textAnchor="end"
              height={60}
              interval={0}
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              domain={['auto', 'auto']}
              tick={{ fontSize: 12 }}
            />
            <Tooltip 
              formatter={(value: number) => [`${value} L/100km`, 'Consommation']}
              labelFormatter={(label: string) => `Date: ${label}`}
            />
            <Line
              type="monotone"
              dataKey="consumption"
              stroke="#2563eb"
              strokeWidth={2}
              dot={{ fill: '#2563eb', r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default ConsumptionChart;