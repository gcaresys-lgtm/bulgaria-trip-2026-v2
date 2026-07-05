import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface TripConfig {
  id: string;
  name: string;
  destination: string;
  startDate: string;
  endDate: string;
  hotel: {
    name: string;
    address: string;
    phone: string;
    rating: number;
    coordinates: { lat: number; lng: number };
  };
  flights: {
    outbound: { airline: string; number: string; departure: string; arrival: string; date: string };
    return: { airline: string; number: string; departure: string; arrival: string; date: string };
  };
  currency: 'BGN' | 'EUR' | 'ILS';
  budget: number;
  emergencyContacts: { name: string; number: string; type: string }[];
}

export interface Expense {
  id: string;
  amount: number;
  currency: 'BGN' | 'EUR' | 'ILS' | 'USD';
  category: 'food' | 'transport' | 'shopping' | 'attractions' | 'hotel' | 'other';
  description: string;
  date: string;
  timestamp: string;
}

export interface Document {
  id: string;
  name: string;
  type: 'passport' | 'ticket' | 'reservation' | 'insurance' | 'other';
  dataUrl: string;
  timestamp: string;
}

const defaultTrip: TripConfig = {
  id: 'bulgaria-2026',
  name: 'Bulgaria 2026',
  destination: 'Sunny Beach, Bulgaria',
  startDate: '2026-07-06',
  endDate: '2026-07-12',
  hotel: {
    name: 'Premier Fort Cuisine',
    address: 'Sunny Beach, Bulgaria',
    phone: '+359 88 888 8888',
    rating: 9.1,
    coordinates: { lat: 42.6833, lng: 27.7167 },
  },
  flights: {
    outbound: { airline: 'TBD', number: 'TBD', departure: '07:45', arrival: '10:10', date: '2026-07-06' },
    return: { airline: 'TBD', number: 'TBD', departure: '18:30', arrival: '21:00', date: '2026-07-12' },
  },
  currency: 'BGN',
  budget: 2000,
  emergencyContacts: [
    { name: 'משטרה', number: '112', type: 'police' },
    { name: 'אמבולנס', number: '150', type: 'ambulance' },
    { name: 'כיבוי אש', number: '160', type: 'fire' },
    { name: 'שגרירות ישראל', number: '+35929433205', type: 'embassy' },
  ],
};

interface TripStore {
  trip: TripConfig;
  updateTrip: (trip: Partial<TripConfig>) => void;
}

export const useTripConfigStore = create<TripStore>()(
  persist(
    (set) => ({
      trip: defaultTrip,
      updateTrip: (updates) =>
        set((state) => ({ trip: { ...state.trip, ...updates } })),
    }),
    { name: 'trip-config', storage: createJSONStorage(() => localStorage) }
  )
);

interface ExpenseStore {
  expenses: Expense[];
  addExpense: (expense: Omit<Expense, 'id' | 'timestamp'>) => void;
  removeExpense: (id: string) => void;
  getExpensesByDate: (date: string) => Expense[];
  getTotalByDate: (date: string) => number;
  getTotalAll: () => number;
  getByCategory: () => Record<string, number>;
}

export const useExpenseStore = create<ExpenseStore>()(
  persist(
    (set, get) => ({
      expenses: [],
      addExpense: (expense) =>
        set((state) => ({
          expenses: [
            ...state.expenses,
            { ...expense, id: crypto.randomUUID(), timestamp: new Date().toISOString() },
          ],
        })),
      removeExpense: (id) =>
        set((state) => ({
          expenses: state.expenses.filter((e) => e.id !== id),
        })),
      getExpensesByDate: (date) =>
        get().expenses.filter((e) => e.date === date),
      getTotalByDate: (date) =>
        get()
          .expenses.filter((e) => e.date === date)
          .reduce((sum, e) => sum + e.amount, 0),
      getTotalAll: () =>
        get().expenses.reduce((sum, e) => sum + e.amount, 0),
      getByCategory: () => {
        const expenses = get().expenses;
        return expenses.reduce((acc, e) => {
          acc[e.category] = (acc[e.category] || 0) + e.amount;
          return acc;
        }, {} as Record<string, number>);
      },
    }),
    { name: 'expenses', storage: createJSONStorage(() => localStorage) }
  )
);

interface DocumentStore {
  documents: Document[];
  addDocument: (doc: Omit<Document, 'id' | 'timestamp'>) => void;
  removeDocument: (id: string) => void;
}

export const useDocumentStore = create<DocumentStore>()(
  persist(
    (set) => ({
      documents: [],
      addDocument: (doc) =>
        set((state) => ({
          documents: [
            ...state.documents,
            { ...doc, id: crypto.randomUUID(), timestamp: new Date().toISOString() },
          ],
        })),
      removeDocument: (id) =>
        set((state) => ({
          documents: state.documents.filter((d) => d.id !== id),
        })),
    }),
    { name: 'documents', storage: createJSONStorage(() => localStorage) }
  )
);

interface SettingsStore {
  currency: 'BGN' | 'EUR' | 'ILS';
  budget: number;
  darkMode: boolean;
  language: 'he' | 'en';
  setCurrency: (c: 'BGN' | 'EUR' | 'ILS') => void;
  setBudget: (b: number) => void;
  toggleDarkMode: () => void;
  setLanguage: (l: 'he' | 'en') => void;
  exportData: () => string;
  importData: (json: string) => void;
  resetAll: () => void;
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set, get) => ({
      currency: 'BGN',
      budget: 2000,
      darkMode: false,
      language: 'he',
      setCurrency: (currency) => set({ currency }),
      setBudget: (budget) => set({ budget }),
      toggleDarkMode: () => set((s) => ({ darkMode: !s.darkMode })),
      setLanguage: (language) => set({ language }),
      exportData: () => {
        const data = {
          settings: get(),
          expenses: useExpenseStore.getState().expenses,
          documents: useDocumentStore.getState().documents,
        };
        return JSON.stringify(data, null, 2);
      },
      importData: (json) => {
        try {
          const data = JSON.parse(json);
          if (data.settings) set(data.settings);
          if (data.expenses) useExpenseStore.setState({ expenses: data.expenses });
          if (data.documents) useDocumentStore.setState({ documents: data.documents });
        } catch (e) {
          console.error('Import failed:', e);
        }
      },
      resetAll: () => {
        localStorage.clear();
        window.location.reload();
      },
    }),
    { name: 'settings', storage: createJSONStorage(() => localStorage) }
  )
);