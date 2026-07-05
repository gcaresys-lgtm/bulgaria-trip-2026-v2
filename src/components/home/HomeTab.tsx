import { useState } from 'react';
import { Plane, Hotel, Thermometer, DollarSign } from 'lucide-react';
import { Card, CardImage, CardHeader } from '../ui/Card';
import { useCurrencyConverter } from '../../hooks';

export default function HomeTab() {
  const [amount, setAmount] = useState(100);
  const [fromCurrency, setFromCurrency] = useState<'ILS' | 'EUR' | 'USD'>('ILS');
  const { convert } = useCurrencyConverter();

  const convertedAmount = convert(amount, fromCurrency);

  return (
    <div className="p-4 space-y-4">
      {/* Hotel Card */}
      <Card>
        <CardImage src="/src/assets/images/bg2.jpg" alt="Premier Fort Cuisine" className="h-40" />
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Hotel className="text-primary-600" size={20} />
              <h2 className="text-lg font-bold text-slate-800">Premier Fort Cuisine</h2>
            </div>
            <span className="bg-success-500 text-white px-2 py-1 rounded-full text-sm font-bold">
              ⭐ 9.1
            </span>
          </div>
        </CardHeader>
        <div className="px-4 pb-4 space-y-2">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <span>🏖️</span>
            <span>על חוף הים</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <span>🍽️</span>
            <span>פנסיון מלא</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <span>📅</span>
            <span>6–12 יולי 2026</span>
          </div>
        </div>
      </Card>

      {/* Flight Card - הלוך */}
      <Card>
        <CardImage src="/src/assets/images/bg3.jpg" alt="Flight" className="h-32" />
        <CardHeader>
          <div className="flex items-center gap-2 mb-3">
            <Plane className="text-primary-600" size={20} />
            <h3 className="font-bold text-slate-800">✈️ טיסה הלוך</h3>
          </div>
          <div className="flex items-center justify-between bg-slate-50 rounded-xl p-4">
            <div className="text-center">
              <p className="text-xs text-slate-500">תל אביב</p>
              <p className="text-xl font-bold text-primary-600">07:45</p>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-2xl">✈️</span>
              <span className="text-xs text-slate-400">2h 25m</span>
            </div>
            <div className="text-center">
              <p className="text-xs text-slate-500">בורגס</p>
              <p className="text-xl font-bold text-primary-600">10:10</p>
            </div>
          </div>
          <p className="text-center text-xs text-slate-500 mt-2">📅 6/7/2026</p>
        </CardHeader>
      </Card>

      {/* Flight Card - חזור */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2 mb-3">
            <Plane className="text-secondary-600 rotate-180" size={20} />
            <h3 className="font-bold text-slate-800">✈️ טיסה חזור</h3>
          </div>
          <div className="flex items-center justify-between bg-gradient-to-br from-secondary-50 to-primary-50 rounded-xl p-4">
            <div className="text-center">
              <p className="text-xs text-slate-500">בורגס</p>
              <p className="text-xl font-bold text-secondary-600">18:30</p>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-2xl">✈️</span>
              <span className="text-xs text-slate-400">2h 30m</span>
            </div>
            <div className="text-center">
              <p className="text-xs text-slate-500">תל אביב</p>
              <p className="text-xl font-bold text-secondary-600">21:00</p>
            </div>
          </div>
          <p className="text-center text-xs text-slate-500 mt-2">📅 12/7/2026</p>
        </CardHeader>
      </Card>

      {/* Weather Widget */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2 mb-3">
            <Thermometer className="text-secondary-500" size={20} />
            <h3 className="font-bold text-slate-800">מזג אוויר צפוי</h3>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-3 text-center">
              <p className="text-xs text-orange-600 mb-1">ביום</p>
              <p className="text-2xl font-bold text-orange-700">28-31°</p>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-3 text-center">
              <p className="text-xs text-blue-600 mb-1">בלילה</p>
              <p className="text-2xl font-bold text-blue-700">20-23°</p>
            </div>
            <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 rounded-xl p-3 text-center">
              <p className="text-xs text-cyan-600 mb-1">מצב הים</p>
              <p className="text-sm font-bold text-cyan-700">מים חמימים</p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-3 text-center">
              <p className="text-xs text-green-600 mb-1">גשם</p>
              <p className="text-sm font-bold text-green-700">כמעט ללא</p>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Currency Converter */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2 mb-3">
            <DollarSign className="text-accent-500" size={20} />
            <h3 className="font-bold text-slate-800">ממיר מטבע</h3>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="סכום"
            />
            <select
              value={fromCurrency}
              onChange={(e) => setFromCurrency(e.target.value as typeof fromCurrency)}
              className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="ILS">שקל</option>
              <option value="EUR">אירו</option>
              <option value="USD">דולר</option>
            </select>
          </div>
          <div className="mt-3 text-center">
            <span className="text-2xl font-bold text-primary-600">
              ~{convertedAmount.toFixed(2)} BGN
            </span>
          </div>
          <p className="text-center text-xs text-slate-500 mt-2">
            מטבע: לב בולגרי (BGN)
          </p>
        </CardHeader>
      </Card>
    </div>
  );
}