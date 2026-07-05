import { useState, useEffect } from 'react';
import { Sun, Wind, Droplets, Sunrise, Sunset, Eye } from 'lucide-react';
import { Card, CardHeader } from '../ui/Card';

interface WeatherData {
  current: {
    temp: number;
    feelsLike: number;
    humidity: number;
    windSpeed: number;
    description: string;
    icon: string;
  };
  hourly: { time: string; temp: number; icon: string; pop: number }[];
  daily: { day: string; temp: { min: number; max: number }; icon: string; pop: number }[];
}

const mockWeather: WeatherData = {
  current: {
    temp: 28,
    feelsLike: 31,
    humidity: 65,
    windSpeed: 12,
    description: 'שמש חלקית',
    icon: '⛅',
  },
  hourly: [
    { time: '14:00', temp: 28, icon: '☀️', pop: 0 },
    { time: '15:00', temp: 29, icon: '☀️', pop: 0 },
    { time: '16:00', temp: 28, icon: '⛅', pop: 10 },
    { time: '17:00', temp: 27, icon: '⛅', pop: 15 },
    { time: '18:00', temp: 25, icon: '🌅', pop: 5 },
    { time: '19:00', temp: 23, icon: '🌙', pop: 0 },
    { time: '20:00', temp: 22, icon: '🌙', pop: 0 },
    { time: '21:00', temp: 21, icon: '🌙', pop: 0 },
  ],
  daily: [
    { day: 'ראשון', temp: { min: 20, max: 29 }, icon: '☀️', pop: 0 },
    { day: 'שני', temp: { min: 21, max: 30 }, icon: '☀️', pop: 5 },
    { day: 'שלישי', temp: { min: 20, max: 28 }, icon: '⛅', pop: 15 },
    { day: 'רביעי', temp: { min: 19, max: 27 }, icon: '🌧️', pop: 40 },
    { day: 'חמישי', temp: { min: 20, max: 29 }, icon: '☀️', pop: 10 },
    { day: 'שישי', temp: { min: 21, max: 31 }, icon: '☀️', pop: 0 },
    { day: 'שבת', temp: { min: 20, max: 30 }, icon: '⛅', pop: 20 },
  ],
};

export default function WeatherTab() {
  const [weather] = useState<WeatherData>(mockWeather);
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const bulgariaTime = new Intl.DateTimeFormat('he-IL', {
        timeZone: 'Europe/Sofia',
        hour: '2-digit',
        minute: '2-digit',
      }).format(now);
      setCurrentTime(bulgariaTime);
    };
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-4 space-y-4">
      {/* Current Weather */}
      <Card className="bg-gradient-to-br from-blue-500 to-cyan-400 text-white">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-white/80 text-sm">Sunny Beach, Bulgaria</p>
              <p className="text-white/60 text-xs">🕐 {currentTime}</p>
            </div>
            <span className="text-5xl">{weather.current.icon}</span>
          </div>
          <div className="text-center">
            <span className="text-6xl font-bold">{weather.current.temp}°</span>
            <p className="text-white/80 mt-1">{weather.current.description}</p>
            <p className="text-white/60 text-sm">מרגיש כמו {weather.current.feelsLike}°</p>
          </div>
        </div>
      </Card>

      {/* Weather Details */}
      <div className="grid grid-cols-2 gap-3">
        <Card>
          <div className="p-4 text-center">
            <Droplets className="mx-auto text-blue-500 mb-1" size={20} />
            <p className="text-2xl font-bold text-slate-800">{weather.current.humidity}%</p>
            <p className="text-xs text-slate-500">לחות</p>
          </div>
        </Card>
        <Card>
          <div className="p-4 text-center">
            <Wind className="mx-auto text-cyan-500 mb-1" size={20} />
            <p className="text-2xl font-bold text-slate-800">{weather.current.windSpeed} km/h</p>
            <p className="text-xs text-slate-500">רוח</p>
          </div>
        </Card>
        <Card>
          <div className="p-4 text-center">
            <Eye className="mx-auto text-purple-500 mb-1" size={20} />
            <p className="text-2xl font-bold text-slate-800">10 km</p>
            <p className="text-xs text-slate-500">ראות</p>
          </div>
        </Card>
        <Card>
          <div className="p-4 text-center">
            <Sun className="mx-auto text-orange-500 mb-1" size={20} />
            <p className="text-2xl font-bold text-slate-800">UV 7</p>
            <p className="text-xs text-slate-500">מדד UV</p>
          </div>
        </Card>
      </div>

      {/* Hourly Forecast */}
      <Card>
        <CardHeader>
          <h3 className="font-bold text-slate-800 mb-3">⏰ תחזית שעתית</h3>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {weather.hourly.map((hour, i) => (
              <div key={i} className="flex-shrink-0 text-center p-2 bg-slate-50 rounded-xl min-w-[60px]">
                <p className="text-xs text-slate-500">{hour.time}</p>
                <span className="text-xl block my-1">{hour.icon}</span>
                <p className="text-sm font-bold text-slate-700">{hour.temp}°</p>
                {hour.pop > 0 && (
                  <p className="text-xs text-blue-500">💧{hour.pop}%</p>
                )}
              </div>
            ))}
          </div>
        </CardHeader>
      </Card>

      {/* 7 Day Forecast */}
      <Card>
        <CardHeader>
          <h3 className="font-bold text-slate-800 mb-3">📅 תחזית ל-7 ימים</h3>
          <div className="space-y-2">
            {weather.daily.map((day, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                <span className="text-sm font-medium text-slate-700 w-20">{day.day}</span>
                <span className="text-xl">{day.icon}</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-slate-800">{day.temp.max}°</span>
                  <span className="text-sm text-slate-400">{day.temp.min}°</span>
                </div>
                {day.pop > 0 && (
                  <span className="text-xs text-blue-500">💧{day.pop}%</span>
                )}
              </div>
            ))}
          </div>
        </CardHeader>
      </Card>

      {/* Sunrise/Sunset */}
      <Card>
        <div className="p-4">
          <div className="flex items-center justify-around">
            <div className="text-center">
              <Sunrise className="mx-auto text-orange-500 mb-1" size={24} />
              <p className="text-lg font-bold text-slate-800">05:42</p>
              <p className="text-xs text-slate-500">זריחה</p>
            </div>
            <div className="text-center">
              <Sunset className="mx-auto text-purple-500 mb-1" size={24} />
              <p className="text-lg font-bold text-slate-800">20:38</p>
              <p className="text-xs text-slate-500">שקיעה</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}