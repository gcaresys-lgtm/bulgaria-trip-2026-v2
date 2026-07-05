import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { TabId, TripDay, ChecklistItem, Photo, Expense } from '../types';

// Main App Store
interface AppStore {
  activeTab: TabId;
  setActiveTab: (tab: TabId) => void;
  isOnline: boolean;
  setIsOnline: (online: boolean) => void;
}

export const useAppStore = create<AppStore>((set) => ({
  activeTab: 'home',
  setActiveTab: (tab) => set({ activeTab: tab }),
  isOnline: navigator.onLine,
  setIsOnline: (online) => set({ isOnline: online }),
}));

// Trip Store
interface TripStore {
  days: TripDay[];
  toggleActivity: (dayId: number, activityId: string) => void;
  getCompletedCount: (dayId: number) => number;
  getTotalProgress: () => number;
}

const initialDays: TripDay[] = [
  {
    id: 1,
    date: '6.7.2026',
    dayName: 'שני',
    title: 'הגעה',
    activities: [
      { id: '1-1', name: 'נחיתה בבורגס', time: 'morning', completed: false },
      { id: '1-2', name: 'איסוף מזוודות', time: 'morning', completed: false },
      { id: '1-3', name: 'הסעה למלון', time: 'morning', completed: false },
      { id: '1-4', name: 'Check-in', time: 'morning', completed: false },
      { id: '1-5', name: 'היכרות עם המלון', time: 'afternoon', completed: false },
      { id: '1-6', name: 'בריכה', time: 'afternoon', completed: false },
      { id: '1-7', name: 'חוף ים', time: 'afternoon', completed: false },
      { id: '1-8', name: 'ארוחת ערב במלון', time: 'evening', completed: false },
      { id: '1-9', name: 'הליכה בטיילת', time: 'evening', completed: false },
      { id: '1-10', name: 'גלידה', time: 'evening', completed: false },
      { id: '1-11', name: 'קוקטייל', time: 'evening', completed: false },
    ],
  },
  {
    id: 2,
    date: '7.7.2026',
    dayName: 'שלישי',
    title: 'יום חופשי',
    activities: [
      { id: '2-1', name: 'ארוחת בוקר', time: 'morning', completed: false },
      { id: '2-2', name: 'ים', time: 'morning', completed: false },
      { id: '2-3', name: 'בריכה', time: 'afternoon', completed: false },
      { id: '2-4', name: 'מגלשות', time: 'afternoon', completed: false },
      { id: '2-5', name: 'מנוחה', time: 'afternoon', completed: false },
      { id: '2-6', name: 'מרכז סאני ביץ\'', time: 'evening', completed: false },
      { id: '2-7', name: 'ברים', time: 'evening', completed: false },
      { id: '2-8', name: 'הופעות רחוב', time: 'evening', completed: false },
      { id: '2-9', name: 'מוזיקה', time: 'evening', completed: false },
    ],
  },
  {
    id: 3,
    date: '8.7.2026',
    dayName: 'רביעי',
    title: 'טיול לנסבר',
    activities: [
      { id: '3-1', name: 'העיר העתיקה', time: 'afternoon', completed: false },
      { id: '3-2', name: 'הסמטאות', time: 'afternoon', completed: false },
      { id: '3-3', name: 'הכנסיות', time: 'afternoon', completed: false },
      { id: '3-4', name: 'הנמל', time: 'afternoon', completed: false },
      { id: '3-5', name: 'גלידה', time: 'afternoon', completed: false },
      { id: '3-6', name: 'בתי קפה', time: 'afternoon', completed: false },
      { id: '3-7', name: 'קניות', time: 'afternoon', completed: false },
    ],
  },
  {
    id: 4,
    date: '9.7.2026',
    dayName: 'חמישי',
    title: 'יום אטרקציות',
    activities: [
      { id: '4-1', name: 'פארק מים', time: 'morning', completed: false },
      { id: '4-2', name: 'שייט', time: 'afternoon', completed: false },
      { id: '4-3', name: 'טרקטורונים', time: 'afternoon', completed: false },
      { id: '4-4', name: 'ג\'יפים', time: 'afternoon', completed: false },
    ],
  },
  {
    id: 5,
    date: '10.7.2026',
    dayName: 'שישי',
    title: 'יום רגוע',
    activities: [
      { id: '5-1', name: 'ארוחת בוקר', time: 'morning', completed: false },
      { id: '5-2', name: 'ים', time: 'morning', completed: false },
      { id: '5-3', name: 'ספא', time: 'afternoon', completed: false },
      { id: '5-4', name: 'מסאז\'', time: 'afternoon', completed: false },
      { id: '5-5', name: 'בריכה', time: 'afternoon', completed: false },
      { id: '5-6', name: 'קוקטייל מול הים', time: 'evening', completed: false },
    ],
  },
  {
    id: 6,
    date: '11.7.2026',
    dayName: 'שבת',
    title: 'יום קניות',
    activities: [
      { id: '6-1', name: 'Royal Beach Mall', time: 'morning', completed: false },
      { id: '6-2', name: 'מזכרות', time: 'morning', completed: false },
      { id: '6-3', name: 'סופרמרקט', time: 'afternoon', completed: false },
      { id: '6-4', name: 'שוק מקומי', time: 'afternoon', completed: false },
      { id: '6-5', name: 'שוקולדים', time: 'afternoon', completed: false },
      { id: '6-6', name: 'אלכוהול', time: 'afternoon', completed: false },
      { id: '6-7', name: 'קוסמטיקה', time: 'afternoon', completed: false },
      { id: '6-8', name: 'מגנטים', time: 'afternoon', completed: false },
    ],
  },
  {
    id: 7,
    date: '12.7.2026',
    dayName: 'ראשון',
    title: 'חזרה',
    activities: [
      { id: '7-1', name: 'ארוחת בוקר', time: 'morning', completed: false },
      { id: '7-2', name: 'בריכה', time: 'morning', completed: false },
      { id: '7-3', name: 'צילומים אחרונים', time: 'morning', completed: false },
      { id: '7-4', name: 'Check-out', time: 'afternoon', completed: false },
      { id: '7-5', name: 'נסיעה לשדה', time: 'afternoon', completed: false },
      { id: '7-6', name: 'טיסה לישראל', time: 'afternoon', completed: false },
    ],
  },
];

export const useTripStore = create<TripStore>()(
  persist(
    (set, get) => ({
      days: initialDays,
      toggleActivity: (dayId, activityId) =>
        set((state) => ({
          days: state.days.map((day) =>
            day.id === dayId
              ? {
                  ...day,
                  activities: day.activities.map((activity) =>
                    activity.id === activityId
                      ? { ...activity, completed: !activity.completed }
                      : activity
                  ),
                }
              : day
          ),
        })),
      getCompletedCount: (dayId) => {
        const day = get().days.find((d) => d.id === dayId);
        return day ? day.activities.filter((a) => a.completed).length : 0;
      },
      getTotalProgress: () => {
        const days = get().days;
        const total = days.reduce((acc, day) => acc + day.activities.length, 0);
        const completed = days.reduce(
          (acc, day) => acc + day.activities.filter((a) => a.completed).length,
          0
        );
        return total > 0 ? Math.round((completed / total) * 100) : 0;
      },
    }),
    {
      name: 'trip-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

// Checklist Store
interface ChecklistStore {
  items: ChecklistItem[];
  toggleItem: (id: string) => void;
  getProgress: () => number;
}

const initialChecklist: ChecklistItem[] = [
  { id: 'c1', name: 'דרכון', packed: false, category: 'documents' },
  { id: 'c2', name: 'ביטוח נסיעות', packed: false, category: 'documents' },
  { id: 'c3', name: 'כרטיס טיסה', packed: false, category: 'documents' },
  { id: 'c4', name: 'בגד ים', packed: false, category: 'clothing' },
  { id: 'c5', name: 'כפכפים', packed: false, category: 'clothing' },
  { id: 'c6', name: 'בגדים קלים', packed: false, category: 'clothing' },
  { id: 'c7', name: 'קרם הגנה', packed: false, category: 'toiletries' },
  { id: 'c8', name: 'כובע', packed: false, category: 'clothing' },
  { id: 'c9', name: 'משקפי שמש', packed: false, category: 'essentials' },
  { id: 'c10', name: 'מטען נייד', packed: false, category: 'electronics' },
  { id: 'c11', name: 'מטען טלפון', packed: false, category: 'electronics' },
  { id: 'c12', name: 'תרופות אישיות', packed: false, category: 'toiletries' },
];

export const useChecklistStore = create<ChecklistStore>()(
  persist(
    (set, get) => ({
      items: initialChecklist,
      toggleItem: (id) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, packed: !item.packed } : item
          ),
        })),
      getProgress: () => {
        const items = get().items;
        const packed = items.filter((i) => i.packed).length;
        return items.length > 0 ? Math.round((packed / items.length) * 100) : 0;
      },
    }),
    {
      name: 'checklist-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

// Photos Store
interface PhotosStore {
  photos: Photo[];
  addPhoto: (photo: Photo) => void;
  removePhoto: (id: string) => void;
  updatePhotoStatus: (id: string, status: Photo['status']) => void;
  getPhotosByDay: (dayNumber: number) => Photo[];
}

export const usePhotosStore = create<PhotosStore>()(
  persist(
    (set, get) => ({
      photos: [],
      addPhoto: (photo) =>
        set((state) => ({
          photos: [...state.photos, photo],
        })),
      removePhoto: (id) =>
        set((state) => ({
          photos: state.photos.filter((p) => p.id !== id),
        })),
      updatePhotoStatus: (id, status) =>
        set((state) => ({
          photos: state.photos.map((p) =>
            p.id === id ? { ...p, status } : p
          ),
        })),
      getPhotosByDay: (dayNumber) => {
        return get().photos.filter((p) => p.dayNumber === dayNumber);
      },
    }),
    {
      name: 'photos-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

// Expenses Store
interface ExpensesStore {
  expenses: Expense[];
  addExpense: (expense: Expense) => void;
  removeExpense: (id: string) => void;
  getTotalByCurrency: (currency: Expense['currency']) => number;
}

export const useExpensesStore = create<ExpensesStore>()(
  persist(
    (set, get) => ({
      expenses: [],
      addExpense: (expense) =>
        set((state) => ({
          expenses: [...state.expenses, expense],
        })),
      removeExpense: (id) =>
        set((state) => ({
          expenses: state.expenses.filter((e) => e.id !== id),
        })),
      getTotalByCurrency: (currency) => {
        return get()
          .expenses.filter((e) => e.currency === currency)
          .reduce((acc, e) => acc + e.amount, 0);
      },
    }),
    {
      name: 'expenses-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);