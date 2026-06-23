import { create } from 'zustand';
import { supabase } from '../lib/supabase';

export const useDataStore = create((set) => ({
  categories: [],
  brands: [],
  loading: false,

  fetchFilterData: async () => {
    set({ loading: true });
    try {
      // Supabase doesn't have a distinct() method natively in JS client yet for easy unique lists,
      // so we select all categories and brands and filter them in JS.
      // In a very large app, you'd use an RPC call or a separate materialized view.
      const { data, error } = await supabase
        .from('products')
        .select('category, brand');

      if (error) throw error;

      const uniqueCategories = [...new Set(data.map(item => item.category).filter(Boolean))];
      const uniqueBrands = [...new Set(data.map(item => item.brand).filter(Boolean))];

      set({ 
        categories: uniqueCategories, 
        brands: uniqueBrands,
        loading: false 
      });
    } catch (error) {
      console.error('Error fetching filter data:', error);
      set({ loading: false });
    }
  }
}));
