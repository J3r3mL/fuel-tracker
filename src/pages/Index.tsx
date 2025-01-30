import React from 'react';
import FuelEntryForm from '@/components/FuelEntryForm';
import FuelEntryList from '@/components/FuelEntryList';
import ConsumptionChart from '@/components/ConsumptionChart';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface FuelEntry {
  date: string;
  totalPrice: number;
  liters: number;
  mileage: number;
}

const Index = () => {
  const [entries, setEntries] = React.useState<FuelEntry[]>(() => {
    const saved = localStorage.getItem('fuelEntries');
    return saved ? JSON.parse(saved) : [];
  });

  React.useEffect(() => {
    localStorage.setItem('fuelEntries', JSON.stringify(entries));
  }, [entries]);

  const handleNewEntry = (entry: FuelEntry) => {
    setEntries([entry, ...entries]);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-center mb-6">
          Suivi Carburant
        </h1>

        <Tabs defaultValue="form" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="form">Nouveau</TabsTrigger>
            <TabsTrigger value="list">Historique</TabsTrigger>
            <TabsTrigger value="chart">Graphique</TabsTrigger>
          </TabsList>
          
          <TabsContent value="form" className="mt-4">
            <FuelEntryForm onSubmit={handleNewEntry} />
          </TabsContent>
          
          <TabsContent value="list" className="mt-4">
            <FuelEntryList entries={entries} />
          </TabsContent>
          
          <TabsContent value="chart" className="mt-4">
            <ConsumptionChart entries={entries} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;