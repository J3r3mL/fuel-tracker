import React from 'react';
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface FuelEntry {
  date: string;
  totalPrice: number;
  liters: number;
  mileage: number;
}

interface FuelEntryWithStats extends FuelEntry {
  pricePerLiter?: number;
  distanceSinceLast?: number;
  consumptionPer100km?: number;
}

interface FuelEntryListProps {
  entries: FuelEntry[];
}

const FuelEntryList: React.FC<FuelEntryListProps> = ({ entries }) => {
  const processedEntries: FuelEntryWithStats[] = entries
    .map((entry, index) => {
      const prevEntry = entries[index + 1];
      const pricePerLiter = entry.totalPrice / entry.liters;
      
      let distanceSinceLast: number | undefined;
      let consumptionPer100km: number | undefined;
      
      if (prevEntry) {
        distanceSinceLast = entry.mileage - prevEntry.mileage;
        consumptionPer100km = (entry.liters / distanceSinceLast) * 100;
      }

      return {
        ...entry,
        pricePerLiter,
        distanceSinceLast,
        consumptionPer100km,
      };
    })
    .reverse();

  return (
    <Card className="w-full overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Prix</TableHead>
            <TableHead>Litres</TableHead>
            <TableHead>€/L</TableHead>
            <TableHead>Km</TableHead>
            <TableHead>Distance</TableHead>
            <TableHead>L/100km</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {processedEntries.map((entry, index) => (
            <TableRow key={index}>
              <TableCell>{entry.date}</TableCell>
              <TableCell>{entry.totalPrice.toFixed(2)}€</TableCell>
              <TableCell>{entry.liters.toFixed(2)}L</TableCell>
              <TableCell>{entry.pricePerLiter?.toFixed(2)}€</TableCell>
              <TableCell>{entry.mileage}km</TableCell>
              <TableCell>
                {entry.distanceSinceLast ? `${entry.distanceSinceLast}km` : '-'}
              </TableCell>
              <TableCell>
                {entry.consumptionPer100km
                  ? `${entry.consumptionPer100km.toFixed(2)}L`
                  : '-'}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
};

export default FuelEntryList;