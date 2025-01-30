import React from 'react';
import FuelEntryForm from '@/components/FuelEntryForm';
import FuelEntryList from '@/components/FuelEntryList';
import ConsumptionChart from '@/components/ConsumptionChart';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "@/hooks/use-toast";

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

  const handleDeleteAllData = () => {
    setEntries([]);
    setFormData({
      date: '',
      totalPrice: '',
      liters: '',
      mileage: '',
    });
    localStorage.removeItem('fuelEntries');
    toast({
      title: "Données supprimées",
      description: "Toutes les données ont été effacées avec succès.",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-center mb-6">
          Suivi Carburant
        </h1>

        <Tabs defaultValue="form" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="form">Nouveau</TabsTrigger>
            <TabsTrigger value="list">Historique</TabsTrigger>
            <TabsTrigger value="chart">Graphique</TabsTrigger>
            <TabsTrigger value="settings">Paramètres</TabsTrigger>
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

          <TabsContent value="settings" className="mt-4">
            <div className="space-y-6 p-4 bg-white rounded-lg shadow">
              <div>
                <h3 className="text-lg font-medium mb-4">Gestion des données</h3>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive">
                      Supprimer toutes les données
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Cette action supprimera définitivement toutes vos données enregistrées.
                        Cette action est irréversible.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Annuler</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDeleteAllData}>
                        Supprimer
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;