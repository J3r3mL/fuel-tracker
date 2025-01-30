import React from 'react';
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { format } from 'date-fns';

interface FuelEntry {
  date: string;
  totalPrice: number;
  liters: number;
  mileage: number;
}

interface FuelEntryFormProps {
  onSubmit: (entry: FuelEntry) => void;
  initialValues?: FuelEntry;
}

const FuelEntryForm: React.FC<FuelEntryFormProps> = ({ onSubmit, initialValues }) => {
  const { toast } = useToast();
  const [date, setDate] = React.useState(initialValues?.date || format(new Date(), 'yyyy-MM-dd'));
  const [totalPrice, setTotalPrice] = React.useState(initialValues?.totalPrice.toString() || '');
  const [liters, setLiters] = React.useState(initialValues?.liters.toString() || '');
  const [mileage, setMileage] = React.useState(initialValues?.mileage.toString() || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!date || !totalPrice || !liters || !mileage) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs",
        variant: "destructive",
      });
      return;
    }

    const entry: FuelEntry = {
      date,
      totalPrice: parseFloat(totalPrice),
      liters: parseFloat(liters),
      mileage: parseFloat(mileage),
    };

    onSubmit(entry);
    
    if (!initialValues) {
      setTotalPrice('');
      setLiters('');
      setMileage('');
      
      toast({
        title: "Succès",
        description: "Plein d'essence enregistré",
      });
    } else {
      toast({
        title: "Succès",
        description: "Plein d'essence modifié",
      });
    }
  };

  return (
    <Card className={`p-4 w-full ${!initialValues ? 'max-w-md mx-auto' : ''}`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Date</label>
          <Input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Prix total (€)</label>
          <Input
            type="number"
            step="0.01"
            value={totalPrice}
            onChange={(e) => setTotalPrice(e.target.value)}
            placeholder="0.00"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Litres</label>
          <Input
            type="number"
            step="0.01"
            value={liters}
            onChange={(e) => setLiters(e.target.value)}
            placeholder="0.00"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Kilométrage</label>
          <Input
            type="number"
            value={mileage}
            onChange={(e) => setMileage(e.target.value)}
            placeholder="0"
          />
        </div>
        <Button type="submit" className="w-full">
          {initialValues ? 'Modifier' : 'Ajouter'}
        </Button>
      </form>
    </Card>
  );
};

export default FuelEntryForm;