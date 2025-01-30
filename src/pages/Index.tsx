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

interface FormData {
  date: string;
  totalPrice: string;
  liters: string;
  mileage: string;
}

const Index = () => {
  const [entries, setEntries] = React.useState<FuelEntry[]>(() => {
    const saved = localStorage.getItem('fuelEntries');
    return saved ? JSON.parse(saved) : [];
  });

  const [formData, setFormData] = React.useState<FormData>({
    date: '',
    totalPrice: '',
    liters: '',
    mileage: '',
  });

  React.useEffect(() => {
    localStorage.setItem('fuelEntries', JSON.stringify(entries));
  }, [entries]);

  const handleNewEntry = (entry: FuelEntry) => {
    setEntries([entry, ...entries]);
    setFormData({
      date: '',
      totalPrice: '',
      liters: '',
      mileage: '',
    });
  };

  const handleUpdateEntry = (index: number, updatedEntry: FuelEntry) => {
    const newEntries = [...entries];
    newEntries[index] = updatedEntry;
    setEntries(newEntries);
  };

  const handleFormChange = (newData: FormData) => {
    setFormData(newData);
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
            <FuelEntryForm 
              onSubmit={handleNewEntry} 
              formData={formData}
              onFormChange={handleFormChange}
            />
          </TabsContent>
          
          <TabsContent value="list" className="mt-4">
            <FuelEntryList entries={entries} onUpdateEntry={handleUpdateEntry} />
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