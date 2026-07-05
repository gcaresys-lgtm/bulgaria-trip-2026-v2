import React from 'react';
import { motion } from 'framer-motion';
import { Home, Map, Camera, Lightbulb, CheckSquare, AlertCircle } from 'lucide-react';
import { useAppStore, useTripStore, usePhotosStore, useChecklistStore } from '../../stores';
import type { TabId } from '../../types';

const tabs: { id: TabId; label: string; icon: React.ReactNode }[] = [
  { id: 'home', label: 'בית', icon: <Home size={20} /> },
  { id: 'itinerary', label: 'מסלול', icon: <Map size={20} /> },
  { id: 'photos', label: 'תמונות', icon: <Camera size={20} /> },
  { id: 'tips', label: 'מידע', icon: <Lightbulb size={20} /> },
  { id: 'checklist', label: 'רשימה', icon: <CheckSquare size={20} /> },
  { id: 'emergency', label: 'חירום', icon: <AlertCircle size={20} /> },
];

export function Navigation() {
  const { activeTab, setActiveTab } = useAppStore();
  const totalProgress = useTripStore((s) => s.getTotalProgress());
  const photosCount = usePhotosStore((s) => s.photos.length);
  const checklistProgress = useChecklistStore((s) => s.getProgress());

  const getBadge = (tabId: TabId): string | null => {
    switch (tabId) {
      case 'itinerary':
        return totalProgress > 0 ? `${totalProgress}%` : null;
      case 'photos':
        return photosCount > 0 ? `${photosCount}` : null;
      case 'checklist':
        return checklistProgress > 0 ? `${checklistProgress}%` : null;
      default:
        return null;
    }
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-50 safe-area-bottom">
      <div className="flex justify-around items-center h-16 max-w-lg mx-auto">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const badge = getBadge(tab.id);
          
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="relative flex flex-col items-center justify-center w-16 h-full"
            >
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-x-2 -top-0.5 h-1 bg-primary-600 rounded-full"
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
                  <span className="absolute -top-1 -right-2 bg-danger-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                    {badge}
                  </span>
                )}
              </motion.div>
              
              <span
                className={`text-[10px] mt-1 transition-colors ${
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