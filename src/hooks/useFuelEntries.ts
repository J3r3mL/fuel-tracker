import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

interface FuelEntry {
  id: string;
  date: string;
  total_price: number;
  liters: number;
  mileage: number;
}

export const useFuelEntries = () => {
  const queryClient = useQueryClient();

  const { data: entries = [], isLoading } = useQuery({
    queryKey: ['fuelEntries'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('fuel_entries')
        .select('*')
        .order('date', { ascending: false });

      if (error) throw error;
      return data as FuelEntry[];
    },
  });

  const addEntry = useMutation({
    mutationFn: async (entry: Omit<FuelEntry, 'id'>) => {
      const { data, error } = await supabase
        .from('fuel_entries')
        .insert([entry])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fuelEntries'] });
    },
  });

  const updateEntry = useMutation({
    mutationFn: async (entry: FuelEntry) => {
      const { data, error } = await supabase
        .from('fuel_entries')
        .update({
          date: entry.date,
          total_price: entry.total_price,
          liters: entry.liters,
          mileage: entry.mileage,
        })
        .eq('id', entry.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fuelEntries'] });
    },
  });

  return {
    entries,
    isLoading,
    addEntry,
    updateEntry,
  };
};