import React from 'react';
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { format } from 'date-fns';

const FuelEntryForm = ({ 
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
    date,
    totalPrice,
    liters,
    mileage
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

  const handleDateChange = (e) => {
    setLocalDate(e.target.value);
    updateFormData(e.target.value, localTotalPrice, localLiters, localMileage);
  };

  const handleTotalPriceChange = (e) => {
    setLocalTotalPrice(e.target.value);
    updateFormData(localDate, e.target.value, localLiters, localMileage);
  };

  const handleLitersChange = (e) => {
    setLocalLiters(e.target.value);
    updateFormData(localDate, localTotalPrice, e.target.value, localMileage);
  };

  const handleMileageChange = (e) => {
    setLocalMileage(e.target.value);
    updateFormData(localDate, localTotalPrice, localLiters, e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!localDate || !localTotalPrice || !localLiters || !localMileage) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs",
        variant: "destructive",
      });
      return;
    }

    const entry = {
      date: localDate,
      totalPrice: parseFloat(localTotalPrice),
      liters: parseFloat(localLiters),
      mileage: parseFloat(localMileage),
    };

    if (isNaN(entry.totalPrice) || isNaN(entry.liters) || isNaN(entry.mileage)) {
      toast({
        title: "Erreur",
        description: "Les valeurs numériques sont invalides",
        variant: "destructive",
      });
      return;
    }

    onSubmit(entry);
  };

  return (
    <Card className="p-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
            Date
          </label>
          <Input
            id="date"
            type="date"
            value={localDate}
            onChange={handleDateChange}
          />
        </div>

        <div>
          <label htmlFor="totalPrice" className="block text-sm font-medium text-gray-700 mb-1">
            Prix total (€)
          </label>
          <Input
            id="totalPrice"
            type="number"
            step="0.01"
            min="0"
            value={localTotalPrice}
            onChange={handleTotalPriceChange}
            placeholder="0.00"
          />
        </div>

        <div>
          <label htmlFor="liters" className="block text-sm font-medium text-gray-700 mb-1">
            Litres
          </label>
          <Input
            id="liters"
            type="number"
            step="0.01"
            min="0"
            value={localLiters}
            onChange={handleLitersChange}
            placeholder="0.00"
          />
        </div>

        <div>
          <label htmlFor="mileage" className="block text-sm font-medium text-gray-700 mb-1">
            Kilométrage
          </label>
          <Input
            id="mileage"
            type="number"
            step="1"
            min="0"
            value={localMileage}
            onChange={handleMileageChange}
            placeholder="0"
          />
        </div>

        <Button type="submit" className="w-full">
          Enregistrer
        </Button>
      </form>
    </Card>
  );
};

export default FuelEntryForm;
