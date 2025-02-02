import React from 'react';
import FuelEntryForm from '@/components/FuelEntryForm';
import FuelEntryList from '@/components/FuelEntryList';
import ConsumptionChart from '@/components/ConsumptionChart';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result;
      if (typeof text !== 'string') return;

      const lines = text.split('\n');
      const newEntries: FuelEntry[] = [];
      
      // Skip header line
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        const [date, totalPrice, liters, mileage] = line.split(',').map(val => val.trim());
        
        if (date && totalPrice && liters && mileage) {
          newEntries.push({
            date,
            totalPrice: parseFloat(totalPrice),
            liters: parseFloat(liters),
            mileage: parseFloat(mileage),
          });
        }
      }

      if (newEntries.length > 0) {
        setEntries(prevEntries => [...newEntries, ...prevEntries]);
        toast({
          title: "Import réussi",
          description: `${newEntries.length} entrées ont été importées.`,
        });
      } else {
        toast({
          title: "Erreur",
          description: "Aucune entrée valide n'a été trouvée dans le fichier.",
          variant: "destructive",
        });
      }
    };

    reader.readAsText(file);
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
                <h3 className="text-lg font-medium mb-4">Import de données</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Format attendu : Date, Prix, Litres, Kilométrage
                </p>
                <Input
                  type="file"
                  accept=".csv"
                  onChange={handleFileUpload}
                  className="mb-6"
                />
              </div>
              
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