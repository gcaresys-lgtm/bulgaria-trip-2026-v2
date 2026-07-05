import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Share2, Download, Award } from 'lucide-react';
import { useTripStore, useChecklistStore, usePhotosStore } from '../../stores';
import { useTripConfigStore, useExpenseStore } from '../../stores/trip';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

export default function TripSummary() {
  const [showSummary, setShowSummary] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const summaryRef = useRef<HTMLDivElement>(null);

  const days = useTripStore((s) => s.days);
  const checklistItems = useChecklistStore((s) => s.items);
  const photos = usePhotosStore((s) => s.photos);
  const { trip } = useTripConfigStore();
  const { getTotalAll } = useExpenseStore();

  const totalActivities = days.reduce((acc, day) => acc + day.activities.length, 0);
  const completedActivities = days.reduce(
    (acc, day) => acc + day.activities.filter((a) => a.completed).length,
    0
  );
  const packedItems = checklistItems.filter((i) => i.packed).length;
  const totalExpenses = getTotalAll();

  const stats = [
    { label: 'ימים', value: days.length, icon: '📅', color: 'bg-blue-100 text-blue-600' },
    {
      label: 'פעילויות',
      value: `${completedActivities}/${totalActivities}`,
      icon: '✅',
      color: 'bg-green-100 text-green-600',
    },
    { label: 'תמונות', value: photos.length, icon: '📸', color: 'bg-purple-100 text-purple-600' },
    { label: 'הוצאות', value: `${totalExpenses.toFixed(0)} BGN`, icon: '💰', color: 'bg-orange-100 text-orange-600' },
    { label: 'ציוד', value: `${packedItems}/${checklistItems.length}`, icon: '🎒', color: 'bg-cyan-100 text-cyan-600' },
  ];

  const handleShare = async () => {
    if (!summaryRef.current) return;

    setIsGenerating(true);
    try {
      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(summaryRef.current, {
        backgroundColor: '#1e3a8a',
        scale: 2,
      });

      const link = document.createElement('a');
      link.download = `bulgaria-2026-summary.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error('Failed to generate image:', err);
    }
    setIsGenerating(false);
  };

  const handleNativeShare = async () => {
    if (!summaryRef.current) return;

    setIsGenerating(true);
    try {
      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(summaryRef.current, {
        backgroundColor: '#1e3a8a',
        scale: 2,
      });

      canvas.toBlob(async (blob) => {
        if (!blob) return;
        const file = new File([blob], 'bulgaria-2026-summary.png', { type: 'image/png' });

        if (navigator.share && navigator.canShare({ files: [file] })) {
          await navigator.share({
            title: 'Bulgaria 2026 - סיכום טיול',
            text: `הטיול לבולגריה היה מדהים! ${completedActivities} פעילויות, ${photos.length} תמונות, ${totalExpenses.toFixed(0)} BGN`,
            files: [file],
          });
        } else {
          handleShare();
        }
      }, 'image/png');
    } catch (err) {
      console.error('Share failed:', err);
    }
    setIsGenerating(false);
  };

  return (
    <div className="p-4 space-y-4">
      {/* Entry Card */}
      <Card className="bg-gradient-to-br from-primary-600 to-secondary-600 text-white">
        <div className="p-6 text-center">
          <Award className="mx-auto mb-3" size={48} />
          <h2 className="text-xl font-bold mb-2">🎉 סיכום הטיול</h2>
          <p className="text-white/80 text-sm mb-4">
            צפה בכל מה שעשית בטיול ושתף עם חברים
          </p>
          <Button
            variant="secondary"
            onClick={() => setShowSummary(true)}
            className="bg-white text-primary-600 hover:bg-white/90"
          >
            צפה בסיכום
          </Button>
        </div>
      </Card>

      {/* Summary Modal */}
      <AnimatePresence>
        {showSummary && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-50 overflow-auto"
          >
            <div className="min-h-screen flex flex-col items-center justify-center p-4">
              {/* Close Button */}
              <button
                onClick={() => setShowSummary(false)}
                className="absolute top-4 right-4 w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-white z-10"
              >
                ✕
              </button>

              {/* Summary Card */}
              <div ref={summaryRef} className="w-full max-w-md bg-gradient-to-br from-primary-800 via-primary-700 to-secondary-700 rounded-3xl overflow-hidden shadow-2xl">
                {/* Header */}
                <div className="p-6 text-center border-b border-white/10">
                  <span className="text-4xl block mb-2">🇧🇬</span>
                  <h1 className="text-2xl font-bold text-white">Bulgaria 2026</h1>
                  <p className="text-white/70 text-sm mt-1">
                    {trip.startDate} - {trip.endDate}
                  </p>
                  <p className="text-white/60 text-xs mt-1">{trip.destination}</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-3 p-4">
                  {stats.slice(0, 3).map((stat, i) => (
                    <div key={i} className="bg-white/10 rounded-xl p-3 text-center">
                      <span className="text-2xl block">{stat.icon}</span>
                      <span className="text-lg font-bold text-white block mt-1">{stat.value}</span>
                      <span className="text-xs text-white/60">{stat.label}</span>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-3 px-4 pb-4">
                  {stats.slice(3).map((stat, i) => (
                    <div key={i} className="bg-white/10 rounded-xl p-3 text-center">
                      <span className="text-2xl block">{stat.icon}</span>
                      <span className="text-lg font-bold text-white block mt-1">{stat.value}</span>
                      <span className="text-xs text-white/60">{stat.label}</span>
                    </div>
                  ))}
                </div>

                {/* Completion */}
                <div className="px-4 pb-4">
                  <div className="bg-white/10 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-white/70">השלמת הטיול</span>
                      <span className="text-sm font-bold text-white">
                        {Math.round((completedActivities / totalActivities) * 100)}%
                      </span>
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-2">
                      <div
                        className="bg-white h-2 rounded-full"
                        style={{ width: `${(completedActivities / totalActivities) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Photos Preview */}
                {photos.length > 0 && (
                  <div className="px-4 pb-4">
                    <div className="grid grid-cols-4 gap-1 rounded-xl overflow-hidden">
                      {photos.slice(0, 8).map((photo, i) => (
                        <div key={i} className="aspect-square">
                          <img
                            src={photo.thumb}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Footer */}
                <div className="bg-white/5 p-4 text-center">
                  <p className="text-white/50 text-xs">נבנה עם ❤️ על ידי Bulgaria 2026 App</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mt-6">
                <Button
                  variant="primary"
                  icon={<Share2 size={18} />}
                  onClick={handleNativeShare}
                  isLoading={isGenerating}
                  className="bg-white text-primary-600 hover:bg-white/90"
                >
                  שתף
                </Button>
                <Button
                  variant="secondary"
                  icon={<Download size={18} />}
                  onClick={handleShare}
                  isLoading={isGenerating}
                  className="bg-white/20 text-white hover:bg-white/30"
                >
                  הורד תמונה
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}