import React, { Suspense, lazy } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useAppStore } from '../../stores';
import { SkeletonCard } from '../ui/Skeleton';

const HomeTab = lazy(() => import('../home/HomeTab'));
const ItineraryTab = lazy(() => import('../itinerary/ItineraryTab'));
const PhotosTab = lazy(() => import('../photos/PhotosTab'));
const TipsTab = lazy(() => import('../tips/TipsTab'));
const ChecklistTab = lazy(() => import('../checklist/ChecklistTab'));
const EmergencyTab = lazy(() => import('../emergency/EmergencyTab'));

const tabComponents: Record<string, React.LazyExoticComponent<React.FC>> = {
  home: HomeTab,
  itinerary: ItineraryTab,
  photos: PhotosTab,
  tips: TipsTab,
  checklist: ChecklistTab,
  emergency: EmergencyTab,
};

const pageVariants = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 },
};

export function TabContent() {
  const activeTab = useAppStore((s) => s.activeTab);
  const Component = tabComponents[activeTab];

  return (
    <main className="pb-20 min-h-screen">
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.2, ease: 'easeInOut' }}
        >
          <Suspense fallback={<SkeletonCard count={3} />}>
            {Component && <Component />}
          </Suspense>
        </motion.div>
      </AnimatePresence>
    </main>
  );
}