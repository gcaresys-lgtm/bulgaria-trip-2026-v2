import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, SkipForward, SkipBack } from 'lucide-react';
import { useTripStore, usePhotosStore } from '../../stores';
import { useTripConfigStore, useExpenseStore } from '../../stores/trip';

const celebrationSlides = [
  {
    id: 1,
    type: 'hero',
    title: 'Bulgaria 2026',
    subtitle: 'Sunny Beach Vacation',
    gradient: 'from-blue-600 via-cyan-500 to-blue-400',
    icon: '🇧🇬',
  },
  {
    id: 2,
    type: 'stats',
    title: 'מספרים',
    gradient: 'from-purple-600 via-pink-500 to-rose-400',
  },
  {
    id: 3,
    type: 'photos',
    title: 'הרגעים היפים',
    gradient: 'from-amber-500 via-orange-500 to-red-500',
  },
  {
    id: 4,
    type: 'expenses',
    title: 'סיכום הוצאות',
    gradient: 'from-green-500 via-emerald-500 to-teal-500',
  },
  {
    id: 5,
    type: 'end',
    title: 'תודה!',
    subtitle: 'עד הטיול הבא',
    gradient: 'from-primary-600 via-secondary-500 to-accent-500',
    icon: '✈️',
  },
];

// Animated Counter Component
function AnimatedCounter({ value, duration = 2 }: { value: number; duration?: number }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = value;
    const increment = end / (duration * 60);
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 1000 / 60);
    return () => clearInterval(timer);
  }, [value, duration]);

  return <span>{count}</span>;
}

// Confetti Component
function Confetti() {
  const colors = ['#f43f5e', '#8b5cf6', '#06b6d4', '#f59e0b', '#10b981', '#3b82f6'];
  const confetti = Array.from({ length: 50 }).map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    delay: Math.random() * 0.5,
    color: colors[Math.floor(Math.random() * colors.length)],
    size: Math.random() * 10 + 5,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
      {confetti.map((c) => (
        <motion.div
          key={c.id}
          initial={{ y: -20, x: `${c.x}vw`, rotate: 0, opacity: 1 }}
          animate={{
            y: '110vh',
            rotate: 720,
            opacity: 0,
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            delay: c.delay,
            ease: 'linear',
          }}
          style={{
            position: 'absolute',
            width: c.size,
            height: c.size,
            backgroundColor: c.color,
            borderRadius: Math.random() > 0.5 ? '50%' : '0%',
          }}
        />
      ))}
    </div>
  );
}

// Floating Particles
function FloatingParticles() {
  const particles = Array.from({ length: 30 }).map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 4 + 2,
    duration: 10 + Math.random() * 20,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-white/20"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, 15, -15, 0],
            opacity: [0.2, 0.8, 0.2],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}

export default function CelebrationPage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const days = useTripStore((s) => s.days);
  const photos = usePhotosStore((s) => s.photos);
  const { trip } = useTripConfigStore();
  const { getTotalAll, getByCategory } = useExpenseStore();

  const completedActivities = days.reduce(
    (acc, day) => acc + day.activities.filter((a) => a.completed).length,
    0
  );
  const totalExpenses = getTotalAll();
  const expensesByCategory = getByCategory();

  // Auto-play
  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => {
        if (prev >= celebrationSlides.length - 1) {
          setIsPlaying(false);
          setShowConfetti(true);
          setTimeout(() => setShowConfetti(false), 5000);
          return 0;
        }
        return prev + 1;
      });
    }, 4000);
    return () => clearInterval(timer);
  }, [isPlaying]);

  const slide = celebrationSlides[currentSlide];

  const renderSlideContent = () => {
    switch (slide.type) {
      case 'hero':
        return (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center text-white"
          >
            <motion.span
              className="text-8xl block mb-6"
              animate={{ rotate: [0, -10, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {slide.icon}
            </motion.span>
            <h1 className="text-5xl font-bold mb-3">{slide.title}</h1>
            <p className="text-xl text-white/80">{slide.subtitle}</p>
            <p className="text-sm text-white/60 mt-4">
              {trip.startDate} - {trip.endDate}
            </p>
          </motion.div>
        );

      case 'stats':
        return (
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-white w-full"
          >
            <h2 className="text-3xl font-bold text-center mb-8">{slide.title}</h2>
            <div className="grid grid-cols-2 gap-4">
              {[
                { value: days.length, label: 'ימים', icon: '📅' },
                { value: completedActivities, label: 'פעילויות', icon: '✅' },
                { value: photos.length, label: 'תמונות', icon: '📸' },
                { value: totalExpenses, label: 'בGN הוצאות', icon: '💰' },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: i * 0.2, type: 'spring' }}
                  className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 text-center"
                >
                  <span className="text-3xl block mb-2">{stat.icon}</span>
                  <span className="text-4xl font-bold block">
                    <AnimatedCounter value={stat.value} />
                  </span>
                  <span className="text-sm text-white/70">{stat.label}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        );

      case 'photos':
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-white w-full"
          >
            <h2 className="text-3xl font-bold text-center mb-6">{slide.title}</h2>
            {photos.length > 0 ? (
              <div className="grid grid-cols-3 gap-2">
                {photos.slice(0, 9).map((photo, i) => (
                  <motion.div
                    key={photo.id}
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: i * 0.1, type: 'spring' }}
                    className="aspect-square rounded-xl overflow-hidden"
                  >
                    <img
                      src={photo.thumb}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <span className="text-6xl block mb-4">📷</span>
                <p className="text-white/70">הוסף תמונות כדי看到 את הרגעים היפים</p>
              </div>
            )}
          </motion.div>
        );

      case 'expenses':
        return (
          <motion.div
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="text-white w-full"
          >
            <h2 className="text-3xl font-bold text-center mb-6">{slide.title}</h2>
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6">
              <div className="text-center mb-6">
                <span className="text-5xl font-bold">
                  <AnimatedCounter value={totalExpenses} />
                </span>
                <span className="text-xl block text-white/70">BGN</span>
              </div>
              <div className="space-y-3">
                {Object.entries(expensesByCategory).map(([category, amount], i) => {
                  const icons: Record<string, string> = {
                    food: '🍽️',
                    transport: '🚕',
                    shopping: '🛍️',
                    attractions: '🎢',
                    hotel: '🏨',
                    other: '📦',
                  };
                  return (
                    <motion.div
                      key={category}
                      initial={{ x: -50, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-center justify-between"
                    >
                      <span>
                        {icons[category] || '📦'} {category}
                      </span>
                      <span className="font-bold">{amount.toFixed(0)} BGN</span>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        );

      case 'end':
        return (
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center text-white"
          >
            <motion.span
              className="text-8xl block mb-6"
              animate={{
                y: [0, -20, 0],
                rotate: [0, 5, -5, 0],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {slide.icon}
            </motion.span>
            <h2 className="text-5xl font-bold mb-3">{slide.title}</h2>
            <p className="text-xl text-white/80">{slide.subtitle}</p>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ duration: 2, delay: 0.5 }}
              className="h-1 bg-white/50 rounded-full mt-8 mx-auto max-w-xs"
            />
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen relative">
      {showConfetti && <Confetti />}

      {/* Slide Background */}
      <motion.div
        key={currentSlide}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className={`fixed inset-0 bg-gradient-to-br ${slide.gradient}`}
      >
        <FloatingParticles />
      </motion.div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-md"
          >
            {renderSlideContent()}
          </motion.div>
        </AnimatePresence>

        {/* Progress Dots */}
        <div className="flex gap-2 mt-8">
          {celebrationSlides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={`w-3 h-3 rounded-full transition-all ${
                i === currentSlide ? 'bg-white scale-125' : 'bg-white/40'
              }`}
            />
          ))}
        </div>

        {/* Controls */}
        <div className="flex items-center gap-4 mt-6">
          <button
            onClick={() => setCurrentSlide(Math.max(0, currentSlide - 1))}
            className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
          >
            <SkipBack size={20} />
          </button>

          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-primary-600 hover:scale-105 transition-transform shadow-lg"
          >
            {isPlaying ? <Pause size={24} /> : <Play size={24} className="mr-1" />}
          </button>

          <button
            onClick={() => setCurrentSlide(Math.min(celebrationSlides.length - 1, currentSlide + 1))}
            className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
          >
            <SkipForward size={20} />
          </button>
        </div>

        {/* Slide Counter */}
        <p className="text-white/60 text-sm mt-4">
          {currentSlide + 1} / {celebrationSlides.length}
        </p>
      </div>
    </div>
  );
}