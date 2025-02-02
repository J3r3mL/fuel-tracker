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

interface FormData {
  date: string;
  totalPrice: string;
  liters: string;
  mileage: string;
}

interface FuelEntryFormProps {
  onSubmit: (entry: FuelEntry) => void;
  initialValues?: FuelEntry;
  formData?: FormData;
  onFormChange?: (data: FormData) => void;
}

const FuelEntryForm: React.FC<FuelEntryFormProps> = ({ 
  onSubmit, 
  initialValues,
  formData,
  onFormChange 
}) => {
  const { toast } = useToast();
  const [localDate, setLocalDate] = React.useState(
    initialValues?.date || formData?.date || format(new Date(), 'yyyy-MM-dd')
  );
  const [localTotalPrice, setLocalTotalPrice] = React.useState(
    initialValues?.totalPrice?.toString() || formData?.totalPrice || ''
  );
  const [localLiters, setLocalLiters] = React.useState(
    initialValues?.liters?.toString() || formData?.liters || ''
  );
  const [localMileage, setLocalMileage] = React.useState(
    initialValues?.mileage?.toString() || formData?.mileage || ''
  );

  const updateFormData = (
    date: string,
    totalPrice: string,
    liters: string,
    mileage: string
  ) => {
    if (onFormChange) {
      onFormChange({
        date,
        totalPrice,
        liters,
        mileage,
      });
    }
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalDate(e.target.value);
    updateFormData(e.target.value, localTotalPrice, localLiters, localMileage);
  };

  const handleTotalPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalTotalPrice(e.target.value);
    updateFormData(localDate, e.target.value, localLiters, localMileage);
  };

  const handleLitersChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalLiters(e.target.value);
    updateFormData(localDate, localTotalPrice, e.target.value, localMileage);
  };

  const handleMileageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalMileage(e.target.value);
    updateFormData(localDate, localTotalPrice, localLiters, e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!localDate || !localTotalPrice || !localLiters || !localMileage) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs",
        variant: "destructive",
      });
      return;
    }

    const entry: FuelEntry = {
      date: localDate,
      totalPrice: parseFloat(localTotalPrice),
      liters: parseFloat(localLiters),
      mileage: parseFloat(localMileage),
    };

    onSubmit(entry);
    
    if (!initialValues) {
      setLocalTotalPrice('');
      setLocalLiters('');
      setLocalMileage('');
      
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
            value={localDate}
            onChange={handleDateChange}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Prix total (₪)</label>
          <Input
            type="number"
            step="0.01"
            value={localTotalPrice}
            onChange={handleTotalPriceChange}
            placeholder="0.00"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Litres</label>
          <Input
            type="number"
            step="0.01"
            value={localLiters}
            onChange={handleLitersChange}
            placeholder="0.00"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Kilométrage</label>
          <Input
            type="number"
            value={localMileage}
            onChange={handleMileageChange}
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