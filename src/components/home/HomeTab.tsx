import { useState, useEffect } from 'react';
import { useTripStore, useChecklistStore } from '../../stores';
import { useTripConfigStore, useExpenseStore } from '../../stores/trip';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { useCountdown } from '../../hooks';
import { useAppStore } from '../../stores';

export default function HomeTab() {
  const { trip } = useTripConfigStore();
  const { setActiveTab } = useAppStore();
  const totalProgress = useTripStore((s) => s.getTotalProgress());
  const checklistProgress = useChecklistStore((s) => s.getProgress());
  const { getTotalByDate, getTotalAll } = useExpenseStore();

  const timeLeft = useCountdown(`${trip.startDate}T07:45:00`);
  const [bulgariaTime, setBulgariaTime] = useState('');

  useEffect(() => {
    const updateBulgariaTime = () => {
      const now = new Date();
      const bulgariaTimezone = new Intl.DateTimeFormat('he-IL', {
        timeZone: 'Europe/Sofia',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      }).format(now);
      setBulgariaTime(bulgariaTimezone);
    };
    updateBulgariaTime();
    const interval = setInterval(updateBulgariaTime, 60000);
    return () => clearInterval(interval);
  }, []);

  const todayExpenses = getTotalByDate(new Date().toISOString().split('T')[0]);
  const totalExpenses = getTotalAll();
  const days = useTripStore((s) => s.days);
  const today = new Date();
  const currentDay = days.find((d) => {
    const tripDate = new Date(`2026-07-${d.id}`);
    return tripDate.toDateString() === today.toDateString();
  });

  return (
    <div className="p-4 space-y-4">
      {/* Countdown Card */}
      <Card className="bg-gradient-to-br from-primary-600 to-primary-800 text-white">
        <div className="p-4 text-center">
          <h1 className="text-xl font-bold mb-1">🇧🇬 Bulgaria 2026</h1>
          <p className="text-white/80 text-sm mb-3">Sunny Beach Vacation</p>

          {!timeLeft.isExpired ? (
            <div className="grid grid-cols-4 gap-2 mb-4">
              {[
                { value: timeLeft.days, label: 'ימים' },
                { value: timeLeft.hours, label: 'שעות' },
                { value: timeLeft.minutes, label: 'דקות' },
                { value: timeLeft.seconds, label: 'שניות' },
              ].map((item, i) => (
                <div
                  key={i}
                  className="bg-white/20 rounded-xl p-2"
                >
                  <span className="text-2xl font-bold block">{item.value}</span>
                  <span className="text-xs text-white/70">{item.label}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white/20 rounded-xl p-3 mb-4">
              <span className="text-lg font-bold">🎉 הטיול התחיל!</span>
            </div>
          )}

          <div className="flex items-center justify-center gap-4 text-sm">
            <span>🕐 בולגריה: {bulgariaTime}</span>
            <span>📅 {trip.startDate}</span>
          </div>
        </div>
      </Card>

      {/* Today's Itinerary */}
      {currentDay && (
        <Card>
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-bold text-slate-800">📅 היום - יום {currentDay.id}</h2>
              <span className="text-sm text-primary-600 font-medium">
                {currentDay.activities.filter((a) => a.completed).length}/{currentDay.activities.length}
              </span>
            </div>
            <div className="space-y-2">
              {currentDay.activities.slice(0, 5).map((activity) => (
                <div
                  key={activity.id}
                  className={`flex items-center gap-2 p-2 rounded-lg text-sm ${
                    activity.completed ? 'bg-success-500/10 text-slate-500' : 'bg-slate-50'
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      activity.completed ? 'bg-success-500' : 'bg-slate-300'
                    }`}
                  />
                  <span className={activity.completed ? 'line-through' : ''}>{activity.name}</span>
                </div>
              ))}
              {currentDay.activities.length > 5 && (
                <p className="text-xs text-slate-400 text-center">
                  +{currentDay.activities.length - 5} פעילויות נוספות
                </p>
              )}
            </div>
          </div>
        </Card>
      )}

      {/* Progress Cards */}
      <div className="grid grid-cols-2 gap-3">
        <Card>
          <div className="p-4 text-center">
            <span className="text-3xl font-bold text-primary-600">{totalProgress}%</span>
            <p className="text-xs text-slate-500 mt-1">מסלול הושלם</p>
            <div className="w-full bg-slate-200 rounded-full h-2 mt-2">
              <div
                className="bg-primary-500 h-2 rounded-full transition-all"
                style={{ width: `${totalProgress}%` }}
              />
            </div>
          </div>
        </Card>
        <Card>
          <div className="p-4 text-center">
            <span className="text-3xl font-bold text-success-500">{checklistProgress}%</span>
            <p className="text-xs text-slate-500 mt-1">ציוד מוכן</p>
            <div className="w-full bg-slate-200 rounded-full h-2 mt-2">
              <div
                className="bg-success-500 h-2 rounded-full transition-all"
                style={{ width: `${checklistProgress}%` }}
              />
            </div>
          </div>
        </Card>
      </div>

      {/* Expenses Summary */}
      <Card>
        <div className="p-4">
          <h3 className="font-bold text-slate-800 mb-3">💰 סיכום הוצאות</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-orange-50 rounded-xl p-3 text-center">
              <p className="text-xs text-orange-600">היום</p>
              <p className="text-lg font-bold text-orange-700">
                {todayExpenses.toFixed(0)} BGN
              </p>
            </div>
            <div className="bg-blue-50 rounded-xl p-3 text-center">
              <p className="text-xs text-blue-600">כולל הטיול</p>
              <p className="text-lg font-bold text-blue-700">
                {totalExpenses.toFixed(0)} BGN
              </p>
            </div>
          </div>
          <div className="mt-3 bg-slate-50 rounded-xl p-2 text-center">
            <p className="text-xs text-slate-500">תקציב שנותר</p>
            <p className={`text-lg font-bold ${trip.budget - totalExpenses > 0 ? 'text-success-600' : 'text-danger-600'}`}>
              {(trip.budget - totalExpenses).toFixed(0)} BGN
            </p>
          </div>
        </div>
      </Card>

      {/* Quick Actions */}
      <Card>
        <div className="p-4">
          <h3 className="font-bold text-slate-800 mb-3">⚡ פעולות מהירות</h3>
          <div className="grid grid-cols-4 gap-2">
            <Button
              variant="secondary"
              size="sm"
              className="flex flex-col items-center h-16"
              onClick={() => setActiveTab('itinerary')}
            >
              <span className="text-lg">📅</span>
              <span className="text-[10px]">מסלול</span>
            </Button>
            <Button
              variant="secondary"
              size="sm"
              className="flex flex-col items-center h-16"
              onClick={() => setActiveTab('photos')}
            >
              <span className="text-lg">📸</span>
              <span className="text-[10px]">תמונה</span>
            </Button>
            <Button
              variant="secondary"
              size="sm"
              className="flex flex-col items-center h-16"
              onClick={() => setActiveTab('celebration')}
            >
              <span className="text-lg">🎉</span>
              <span className="text-[10px]">חגיגה</span>
            </Button>
            <Button
              variant="secondary"
              size="sm"
              className="flex flex-col items-center h-16"
              onClick={() => setActiveTab('emergency')}
            >
              <span className="text-lg">🚨</span>
              <span className="text-[10px]">חירום</span>
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}