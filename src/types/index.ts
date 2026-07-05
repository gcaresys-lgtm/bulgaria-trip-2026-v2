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

export interface EmergencyContact {
  id: string;
  name: string;
  number: string;
  type: 'police' | 'ambulance' | 'fire' | 'embassy' | 'hotel';
}

export interface HotelInfo {
  name: string;
  rating: number;
  address: string;
  phone: string;
  boardType: string;
}

export interface FlightInfo {
  airline: string;
  flightNumber: string;
  departure: {
    city: string;
    time: string;
    date: string;
  };
  arrival: {
    city: string;
    time: string;
    date: string;
  };
}

export interface Expense {
  id: string;
  description: string;
  amount: number;
  currency: 'BGN' | 'ILS' | 'EUR' | 'USD';
  category: 'food' | 'transport' | 'activities' | 'shopping' | 'other';
  date: string;
  timestamp: string;
}

export interface WeatherData {
  temp: {
    day: number;
    night: number;
  };
  description: string;
  humidity: number;
  windSpeed: number;
}

export type TabId = 'home' | 'itinerary' | 'photos' | 'tips' | 'checklist' | 'emergency';

export interface AppState {
  activeTab: TabId;
  setActiveTab: (tab: TabId) => void;
  isOnline: boolean;
  setIsOnline: (online: boolean) => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}