import { motion } from 'framer-motion';
import { useTripStore } from '../../stores';
import { useCountdown } from '../../hooks';

export function Header() {
  const totalProgress = useTripStore((s) => s.getTotalProgress());
  const timeLeft = useCountdown('2026-07-06T07:45:00');

  return (
    <header className="relative h-64 overflow-hidden">
      <img
        src="/src/assets/images/bg1.jpg"
        alt="Sunny Beach"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-primary-800/85 to-primary-600/70" />
      
      <div className="relative h-full flex flex-col items-center justify-center text-white px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h1 className="text-3xl font-bold mb-2">🇧🇬 Bulgaria 2026</h1>
          <p className="text-white/90 text-sm">Sunny Beach Vacation • 6–12 July 2026</p>
        </motion.div>

        {!timeLeft.isExpired && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="mt-4 bg-white/20 backdrop-blur-sm rounded-2xl px-6 py-3"
          >
            <p className="text-xs text-white/80 mb-1">טסים בעוד</p>
            <div className="flex gap-4 text-center">
              <div>
                <span className="text-2xl font-bold">{timeLeft.days}</span>
                <span className="text-xs text-white/70 block">ימים</span>
              </div>
              <div>
                <span className="text-2xl font-bold">{timeLeft.hours}</span>
                <span className="text-xs text-white/70 block">שעות</span>
              </div>
              <div>
                <span className="text-2xl font-bold">{timeLeft.minutes}</span>
                <span className="text-xs text-white/70 block">דקות</span>
              </div>
            </div>
          </motion.div>
        )}

        {totalProgress > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-3 bg-white/20 backdrop-blur-sm rounded-full px-4 py-1.5"
          >
            <span className="text-xs">✅ {totalProgress}% מהפעילויות הושלמו</span>
          </motion.div>
        )}
      </div>
    </header>
  );
}