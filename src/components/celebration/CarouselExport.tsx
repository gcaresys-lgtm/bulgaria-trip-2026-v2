import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Images, Download, ChevronLeft, ChevronRight } from 'lucide-react';
import { useTripStore, useChecklistStore, usePhotosStore } from '../../stores';
import { useTripConfigStore, useExpenseStore } from '../../stores/trip';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

export default function CarouselExport() {
  const [showCarousel, setShowCarousel] = useState(false);
  const [currentCard, setCurrentCard] = useState(0);
  const [isExporting, setIsExporting] = useState(false);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

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

  const cards = [
    {
      bg: 'bg-gradient-to-br from-blue-600 to-cyan-500',
      content: (
        <div className="text-center">
          <span className="text-6xl block mb-4">🇧🇬</span>
          <h2 className="text-3xl font-bold mb-2">Bulgaria 2026</h2>
          <p className="text-white/80">{trip.startDate} - {trip.endDate}</p>
          <p className="text-sm text-white/60 mt-2">{trip.destination}</p>
        </div>
      ),
    },
    {
      bg: 'bg-gradient-to-br from-purple-600 to-pink-500',
      content: (
        <div className="text-center">
          <span className="text-5xl block mb-4">📅</span>
          <span className="text-6xl font-bold block">{days.length}</span>
          <span className="text-xl text-white/80">ימים של חוויות</span>
          <div className="mt-4 flex gap-4 justify-center">
            <div className="text-center">
              <span className="text-2xl font-bold">{completedActivities}</span>
              <span className="text-xs text-white/60 block">פעילויות</span>
            </div>
            <div className="text-center">
              <span className="text-2xl font-bold">{photos.length}</span>
              <span className="text-xs text-white/60 block">תמונות</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      bg: 'bg-gradient-to-br from-amber-500 to-orange-500',
      content: (
        <div className="text-center">
          <span className="text-5xl block mb-4">📸</span>
          <span className="text-6xl font-bold block">{photos.length}</span>
          <span className="text-xl text-white/80">רגעים שנתפסו</span>
          {photos.length > 0 && (
            <div className="grid grid-cols-3 gap-1 mt-4">
              {photos.slice(0, 6).map((p, i) => (
                <div key={i} className="aspect-square rounded-lg overflow-hidden">
                  <img src={p.thumb} alt="" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>
      ),
    },
    {
      bg: 'bg-gradient-to-br from-green-500 to-emerald-500',
      content: (
        <div className="text-center">
          <span className="text-5xl block mb-4">💰</span>
          <span className="text-5xl font-bold block">{totalExpenses.toFixed(0)}</span>
          <span className="text-xl text-white/80">BGN הוצאות</span>
          <div className="mt-4 bg-white/20 rounded-xl p-3">
            <span className="text-sm text-white/70">תקציב שנותר</span>
            <span className="text-2xl font-bold block">
              {(trip.budget - totalExpenses).toFixed(0)} BGN
            </span>
          </div>
        </div>
      ),
    },
    {
      bg: 'bg-gradient-to-br from-primary-600 to-secondary-500',
      content: (
        <div className="text-center">
          <span className="text-6xl block mb-4">✅</span>
          <span className="text-4xl font-bold block">{completedActivities}/{totalActivities}</span>
          <span className="text-xl text-white/80">פעילויות הושלמו</span>
          <div className="w-full bg-white/20 rounded-full h-3 mt-4">
            <div
              className="bg-white h-3 rounded-full"
              style={{ width: `${(completedActivities / totalActivities) * 100}%` }}
            />
          </div>
        </div>
      ),
    },
    {
      bg: 'bg-gradient-to-br from-rose-500 to-pink-500',
      content: (
        <div className="text-center">
          <span className="text-6xl block mb-4">🎒</span>
          <span className="text-4xl font-bold block">{packedItems}/{checklistItems.length}</span>
          <span className="text-xl text-white/80">פריטים נארזו</span>
        </div>
      ),
    },
    {
      bg: 'bg-gradient-to-br from-indigo-600 to-violet-500',
      content: (
        <div className="text-center">
          <motion.span
            className="text-6xl block mb-4"
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            ✈️
          </motion.span>
          <h2 className="text-3xl font-bold mb-2">תודה!</h2>
          <p className="text-white/80">עד הטיול הבא</p>
          <p className="text-sm text-white/60 mt-4">נבנה עם ❤️</p>
        </div>
      ),
    },
  ];

  const handleExportAll = async () => {
    setIsExporting(true);
    try {
      const html2canvas = (await import('html2canvas')).default;

      for (let i = 0; i < cards.length; i++) {
        const cardEl = cardRefs.current[i];
        if (!cardEl) continue;

        setCurrentCard(i);
        await new Promise((r) => setTimeout(r, 300));

        const canvas = await html2canvas(cardEl, {
          backgroundColor: null,
          scale: 2,
        });

        const link = document.createElement('a');
        link.download = `bulgaria-2026-card-${i + 1}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();

        await new Promise((r) => setTimeout(r, 500));
      }
    } catch (err) {
      console.error('Export failed:', err);
    }
    setIsExporting(false);
  };

  return (
    <div className="p-4 space-y-4">
      {/* Entry Card */}
      <Card className="bg-gradient-to-br from-rose-500 to-pink-600 text-white">
        <div className="p-6 text-center">
          <Images className="mx-auto mb-3" size={48} />
          <h2 className="text-xl font-bold mb-2">📸 ייצוא ל-Instagram</h2>
          <p className="text-white/80 text-sm mb-4">
            צור קארוסל יפה עם כל הנתונים מהטיול
          </p>
          <Button
            variant="secondary"
            onClick={() => setShowCarousel(true)}
            className="bg-white text-rose-600 hover:bg-white/90"
          >
            צור קארוסל
          </Button>
        </div>
      </Card>

      {/* Carousel Preview Modal */}
      <AnimatePresence>
        {showCarousel && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4">
              <button
                onClick={() => setShowCarousel(false)}
                className="text-white text-sm"
              >
                סגור
              </button>
              <span className="text-white text-sm">
                {currentCard + 1} / {cards.length}
              </span>
              <Button
                variant="primary"
                size="sm"
                icon={<Download size={14} />}
                onClick={handleExportAll}
                isLoading={isExporting}
              >
                הורד הכל
              </Button>
            </div>

            {/* Card Display */}
            <div className="flex-1 flex items-center justify-center p-4">
              <div className="relative">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentCard}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div
                      ref={(el) => { cardRefs.current[currentCard] = el; }}
                      className={`w-80 h-80 rounded-3xl overflow-hidden shadow-2xl ${cards[currentCard].bg} flex flex-col items-center justify-center p-8 text-white`}
                    >
                      {cards[currentCard].content}
                    </div>
                  </motion.div>
                </AnimatePresence>

                {/* Navigation Arrows */}
                <button
                  onClick={() => setCurrentCard(Math.max(0, currentCard - 1))}
                  disabled={currentCard === 0}
                  className="absolute left-[-50px] top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-white disabled:opacity-30"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={() => setCurrentCard(Math.min(cards.length - 1, currentCard + 1))}
                  disabled={currentCard === cards.length - 1}
                  className="absolute right-[-50px] top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-white disabled:opacity-30"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>

            {/* Dots */}
            <div className="flex justify-center gap-2 pb-6">
              {cards.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentCard(i)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    i === currentCard ? 'bg-white w-6' : 'bg-white/40'
                  }`}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}