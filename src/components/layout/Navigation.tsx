import { motion } from 'framer-motion';
import { Home, Map, Camera, DollarSign, FileText, AlertCircle, Settings, Sparkles, Images } from 'lucide-react';
import { useAppStore, useTripStore, usePhotosStore } from '../../stores';
import { useExpenseStore } from '../../stores/trip';
import type { TabId } from '../../types';

const tabs: { id: TabId; label: string; icon: React.ReactNode }[] = [
  { id: 'home', label: 'בית', icon: <Home size={18} /> },
  { id: 'itinerary', label: 'מסלול', icon: <Map size={18} /> },
  { id: 'photos', label: 'תמונות', icon: <Camera size={18} /> },
  { id: 'expense', label: 'הוצאות', icon: <DollarSign size={18} /> },
  { id: 'documents', label: 'מסמכים', icon: <FileText size={18} /> },
  { id: 'emergency', label: 'חירום', icon: <AlertCircle size={18} /> },
  { id: 'celebration', label: 'חגיגה', icon: <Sparkles size={18} /> },
  { id: 'carousel', label: 'קארוסל', icon: <Images size={18} /> },
  { id: 'settings', label: 'הגדרות', icon: <Settings size={18} /> },
];

export function Navigation() {
  const { activeTab, setActiveTab } = useAppStore();
  const totalProgress = useTripStore((s) => s.getTotalProgress());
  const photosCount = usePhotosStore((s) => s.photos.length);
  const totalExpenses = useExpenseStore((s) => s.getTotalAll());

  const getBadge = (tabId: TabId): string | null => {
    switch (tabId) {
      case 'itinerary':
        return totalProgress > 0 ? `${totalProgress}%` : null;
      case 'photos':
        return photosCount > 0 ? `${photosCount}` : null;
      case 'expense':
        return totalExpenses > 0 ? `${totalExpenses.toFixed(0)}` : null;
      default:
        return null;
    }
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-50 safe-area-bottom">
      <div className="flex justify-around items-center h-16 max-w-lg mx-auto overflow-x-auto">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const badge = getBadge(tab.id);

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="relative flex flex-col items-center justify-center min-w-[44px] h-full px-1"
            >
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-x-1 -top-0.5 h-1 bg-primary-600 rounded-full"
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}

              <motion.div
                animate={{
                  scale: isActive ? 1.1 : 1,
                  color: isActive ? '#2563eb' : '#64748b',
                }}
                transition={{ duration: 0.2 }}
                className="relative"
              >
                {tab.icon}
                {badge && (
                  <span className="absolute -top-1 -right-2 bg-danger-500 text-white text-[8px] font-bold px-1 py-0.5 rounded-full min-w-[14px] text-center">
                    {badge}
                  </span>
                )}
              </motion.div>

              <span
                className={`text-[8px] mt-1 transition-colors ${
                  isActive ? 'text-primary-600 font-medium' : 'text-slate-500'
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}