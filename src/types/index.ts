export interface TripDay {
  id: number;
  date: string;
  dayName: string;
  title: string;
  activities: Activity[];
}

export interface Activity {
  id: string;
  name: string;
  time: 'morning' | 'afternoon' | 'evening';
  completed: boolean;
}

export interface Photo {
  id: string;
  name: string;
  thumb: string;
  full: string;
  status: 'pending' | 'uploading' | 'uploaded' | 'error';
  eventId: string;
  timestamp: string;
  dayNumber?: number;
}

export interface ChecklistItem {
  id: string;
  name: string;
  packed: boolean;
  category: 'essentials' | 'clothing' | 'toiletries' | 'electronics' | 'documents';
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

export type TabId = 'home' | 'itinerary' | 'photos' | 'expense' | 'documents' | 'emergency' | 'settings' | 'summary';

export interface AppState {
  activeTab: TabId;
  setActiveTab: (tab: TabId) => void;
  isOnline: boolean;
  setIsOnline: (online: boolean) => void;
}