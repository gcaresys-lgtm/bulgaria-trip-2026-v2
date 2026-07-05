import { motion } from 'framer-motion';
import { AlertTriangle, Phone, Hotel, Plane, MapPin } from 'lucide-react';
import { Card, CardHeader } from '../ui/Card';
import { Button } from '../ui/Button';

const emergencyContacts = [
  { name: 'משטרה', number: '112', type: 'police', icon: '🚔' },
  { name: 'אמבולנס', number: '150', type: 'ambulance', icon: '🚑' },
  { name: 'כיבוי אש', number: '160', type: 'fire', icon: '🚒' },
  { name: 'שגרירות ישראל', number: '+35929433205', type: 'embassy', icon: '🇮🇱' },
];

const hotelInfo = {
  name: 'Premier Fort Cuisine',
  rating: 9.1,
  address: 'Sunny Beach, Bulgaria',
  phone: '+359 88 888 8888',
};

const flightInfo = {
  airline: 'TBD',
  flightNumber: 'TBD',
  departure: { city: 'תל אביב', time: '07:45', date: '6/7/2026' },
  arrival: { city: 'בורגס', time: '10:10', date: '6/7/2026' },
};

export default function EmergencyTab() {
  return (
    <div className="p-4 space-y-4">
      {/* Emergency Contacts */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="text-danger-500" size={20} />
            <h2 className="text-lg font-bold text-slate-800">חירום</h2>
          </div>
          <div className="space-y-3">
            {emergencyContacts.map((contact, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center justify-between p-3 bg-slate-50 rounded-xl"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{contact.icon}</span>
                  <span className="font-medium text-slate-700">{contact.name}</span>
                </div>
                <a
                  href={`tel:${contact.number}`}
                  className="bg-danger-500 text-white px-4 py-2 rounded-full text-sm font-bold hover:bg-red-600 transition-colors"
                >
                  {contact.number}
                </a>
              </motion.div>
            ))}
          </div>
        </CardHeader>
      </Card>

      {/* Hotel Info */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2 mb-4">
            <Hotel className="text-primary-600" size={20} />
            <h3 className="font-bold text-slate-800">פרטי המלון</h3>
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
              <span className="text-xl">🏨</span>
              <div>
                <p className="text-xs text-slate-500">שם</p>
                <p className="font-medium text-slate-700">{hotelInfo.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
              <span className="text-xl">⭐</span>
              <div>
                <p className="text-xs text-slate-500">דירוג</p>
                <p className="font-medium text-slate-700">{hotelInfo.rating}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
              <MapPin className="text-slate-400" size={20} />
              <div>
                <p className="text-xs text-slate-500">כתובת</p>
                <p className="font-medium text-slate-700">{hotelInfo.address}</p>
              </div>
            </div>
            <a
              href={`tel:${hotelInfo.phone}`}
              className="flex items-center gap-3 p-3 bg-primary-50 rounded-xl hover:bg-primary-100 transition-colors"
            >
              <Phone className="text-primary-600" size={20} />
              <div>
                <p className="text-xs text-primary-600">טלפון</p>
                <p className="font-medium text-primary-700">{hotelInfo.phone}</p>
              </div>
            </a>
          </div>
        </CardHeader>
      </Card>

      {/* Flight Info - הלוך */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2 mb-4">
            <Plane className="text-primary-500" size={20} />
            <h3 className="font-bold text-slate-800">✈️ טיסה הלוך</h3>
          </div>
          <div className="bg-gradient-to-br from-primary-50 to-secondary-50 rounded-xl p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="text-center flex-1">
                <p className="text-xs text-slate-500 mb-1">{flightInfo.departure.city}</p>
                <p className="text-xl font-bold text-primary-600">{flightInfo.departure.time}</p>
                <p className="text-xs text-slate-400">{flightInfo.departure.date}</p>
              </div>
              <div className="flex flex-col items-center px-4">
                <span className="text-3xl">✈️</span>
                <span className="text-xs text-slate-400 mt-1">{flightInfo.flightNumber}</span>
              </div>
              <div className="text-center flex-1">
                <p className="text-xs text-slate-500 mb-1">{flightInfo.arrival.city}</p>
                <p className="text-xl font-bold text-primary-600">{flightInfo.arrival.time}</p>
                <p className="text-xs text-slate-400">{flightInfo.arrival.date}</p>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Flight Info - חזור */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2 mb-4">
            <Plane className="text-secondary-500 rotate-180" size={20} />
            <h3 className="font-bold text-slate-800">✈️ טיסה חזור</h3>
          </div>
          <div className="bg-gradient-to-br from-secondary-50 to-primary-50 rounded-xl p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="text-center flex-1">
                <p className="text-xs text-slate-500 mb-1">בורגס</p>
                <p className="text-xl font-bold text-secondary-600">18:30</p>
                <p className="text-xs text-slate-400">12/7/2026</p>
              </div>
              <div className="flex flex-col items-center px-4">
                <span className="text-3xl">✈️</span>
                <span className="text-xs text-slate-400 mt-1">TBD</span>
              </div>
              <div className="text-center flex-1">
                <p className="text-xs text-slate-500 mb-1">תל אביב</p>
                <p className="text-xl font-bold text-secondary-600">21:00</p>
                <p className="text-xs text-slate-400">12/7/2026</p>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <h3 className="font-bold text-slate-800 mb-3">פעולות מהירות</h3>
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="danger"
              icon={<Phone size={16} />}
              onClick={() => window.location.href = 'tel:112'}
            >
              חירום
            </Button>
            <Button
              variant="secondary"
              icon={<MapPin size={16} />}
              onClick={() => window.open(`https://maps.google.com/?q=${hotelInfo.address}`, '_blank')}
            >
              נווט למלון
            </Button>
          </div>
        </CardHeader>
      </Card>
    </div>
  );
}