import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check } from 'lucide-react';
import { Card, CardHeader } from '../ui/Card';
import { Checkbox } from '../ui/Checkbox';
import { ProgressBar } from '../ui/Progress';
import { useTripStore } from '../../stores';
import { getDayIcon, getTimeIcon } from '../../lib/utils';
import { useSwipe } from '../../hooks';

export default function ItineraryTab() {
  const [selectedDay, setSelectedDay] = useState(1);
  const { days, toggleActivity } = useTripStore();

  const currentDayIndex = days.findIndex((d) => d.id === selectedDay);
  
  const goToPrevDay = () => {
    if (currentDayIndex > 0) setSelectedDay(days[currentDayIndex - 1].id);
  };
  
  const goToNextDay = () => {
    if (currentDayIndex < days.length - 1) setSelectedDay(days[currentDayIndex + 1].id);
  };

  const swipeHandlers = useSwipe(goToNextDay, goToPrevDay);
  const currentDay = days.find((d) => d.id === selectedDay);

  const timeGroups = currentDay?.activities.reduce(
    (acc, activity) => {
      if (!acc[activity.time]) acc[activity.time] = [];
      acc[activity.time].push(activity);
      return acc;
    },
    {} as Record<string, typeof currentDay.activities>
  );

  return (
    <div className="p-4" {...swipeHandlers}>
      {/* Day Selector */}
      <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide">
        {days.map((day) => {
          const completedCount = day.activities.filter((a) => a.completed).length;
          const totalCount = day.activities.length;
          const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

          return (
            <motion.button
              key={day.id}
              onClick={() => setSelectedDay(day.id)}
              whileTap={{ scale: 0.95 }}
              className={`relative flex-shrink-0 w-20 p-3 rounded-xl text-center transition-all ${
                selectedDay === day.id
                  ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/30'
                  : 'bg-white text-slate-600 border border-slate-200'
              }`}
            >
              <span className="text-lg block">{getDayIcon(day)}</span>
              <span className="text-xs font-medium block mt-1">יום {day.id}</span>
              {progress > 0 && (
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-12 h-1 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-success-500 transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Day Content */}
      <AnimatePresence mode="wait">
        {currentDay && (
          <motion.div
            key={currentDay.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="mb-4">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-slate-800">
                      יום {currentDay.id} – {currentDay.dayName}
                    </h2>
                    <p className="text-sm text-slate-500">{currentDay.date}</p>
                  </div>
                  <span className="text-2xl">{getDayIcon(currentDay)}</span>
                </div>
                <ProgressBar
                  value={currentDay.activities.filter((a) => a.completed).length}
                  max={currentDay.activities.length}
                  size="sm"
                  className="mt-3"
                />
              </CardHeader>
            </Card>

            {/* Activities by Time */}
            {timeGroups && Object.entries(timeGroups).map(([time, activities]) => (
              <Card key={time} className="mb-4">
                <CardHeader>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xl">{getTimeIcon(time as 'morning' | 'afternoon' | 'evening')}</span>
                    <h3 className="font-bold text-slate-700">
                      {time === 'morning' ? 'בוקר' : time === 'afternoon' ? 'אחר הצהריים' : 'ערב'}
                    </h3>
                  </div>
                  <div className="space-y-2">
                    {activities.map((activity) => (
                      <motion.div
                        key={activity.id}
                        layout
                        className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${
                          activity.completed ? 'bg-success-500/10' : 'bg-slate-50'
                        }`}
                      >
                        <Checkbox
                          checked={activity.completed}
                          onChange={() => toggleActivity(currentDay.id, activity.id)}
                        />
                        <span
                          className={`flex-1 text-sm ${
                            activity.completed ? 'text-slate-500 line-through' : 'text-slate-700'
                          }`}
                        >
                          {activity.name}
                        </span>
                        {activity.completed && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="text-success-500"
                          >
                            <Check size={16} />
                          </motion.div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </CardHeader>
              </Card>
            ))}

            {/* Navigation hints */}
            <div className="flex justify-between items-center text-xs text-slate-400 px-4 py-2">
              {currentDayIndex > 0 && (
                <span>← יום {currentDayIndex}</span>
              )}
              {currentDayIndex < days.length - 1 && (
                <span className="ml-auto">יום {currentDayIndex + 2} →</span>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}