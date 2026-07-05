import { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Navigation } from 'lucide-react';
import { Card, CardHeader } from '../ui/Card';
import { Button } from '../ui/Button';
import { useTripConfigStore } from '../../stores/trip';
import 'leaflet/dist/leaflet.css';

interface MapLocation {
  id: string;
  name: string;
  nameHe: string;
  lat: number;
  lng: number;
  type: 'hotel' | 'airport' | 'beach' | 'restaurant' | 'shopping' | 'hospital' | 'attraction';
  icon: string;
}

const locations: MapLocation[] = [
  { id: '1', name: 'Premier Fort Cuisine', nameHe: 'מלון Premier Fort Cuisine', lat: 42.6833, lng: 27.7167, type: 'hotel', icon: '🏨' },
  { id: '2', name: 'Burgas Airport', nameHe: 'שדה תעופה בורגס', lat: 42.5696, lng: 27.5152, type: 'airport', icon: '✈️' },
  { id: '3', name: 'Sunny Beach', nameHe: 'חוף סאני ביץ', lat: 42.6900, lng: 27.7200, type: 'beach', icon: '🏖️' },
  { id: '4', name: 'Nessebar Old Town', nameHe: 'עיר העתיקה נסבר', lat: 42.7070, lng: 27.7340, type: 'attraction', icon: '🏛️' },
  { id: '5', name: 'Action Aquapark', nameHe: 'פארק מים Action', lat: 42.6850, lng: 27.7100, type: 'attraction', icon: '💦' },
  { id: '6', name: 'Royal Beach Mall', nameHe: 'קניון Royal Beach', lat: 42.6880, lng: 27.7180, type: 'shopping', icon: '🛍️' },
  { id: '7', name: 'Hospital Burgas', nameHe: 'בית חולים בורגס', lat: 42.5060, lng: 27.4700, type: 'hospital', icon: '🏥' },
  { id: '8', name: 'Local Pharmacy', nameHe: ' pharmacy מקומי', lat: 42.6840, lng: 27.7160, type: 'hospital', icon: '💊' },
];

function NavigationButton({ lat, lng }: { lat: number; lng: number }) {
  const handleNavigate = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
    window.open(url, '_blank');
  };

  return (
    <Button
      variant="primary"
      size="sm"
      icon={<Navigation size={14} />}
      onClick={handleNavigate}
    >
      נווט
    </Button>
  );
}

export default function MapsTab() {
  const [selectedType, setSelectedType] = useState<string>('all');
  const { trip } = useTripConfigStore();

  const filteredLocations = selectedType === 'all'
    ? locations
    : locations.filter((l) => l.type === selectedType);

  return (
    <div className="p-4 space-y-4">
      {/* Filter Buttons */}
      <Card>
        <div className="p-3">
          <h3 className="font-bold text-slate-800 mb-3">🗺️ סנן מיקומים</h3>
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'all', label: 'הכל', icon: '📍' },
              { id: 'hotel', label: 'מלון', icon: '🏨' },
              { id: 'airport', label: 'שדה תעופה', icon: '✈️' },
              { id: 'beach', label: 'חוף', icon: '🏖️' },
              { id: 'shopping', label: 'קניות', icon: '🛍️' },
              { id: 'hospital', label: 'בית חולים', icon: '🏥' },
              { id: 'attraction', label: 'אטרקציות', icon: '🎢' },
            ].map((type) => (
              <button
                key={type.id}
                onClick={() => setSelectedType(type.id)}
                className={`px-3 py-1.5 rounded-full text-xs transition-colors ${
                  selectedType === type.id
                    ? 'bg-primary-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {type.icon} {type.label}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Map */}
      <Card className="overflow-hidden">
        <div className="h-[300px] relative">
          <MapContainer
            center={[trip.hotel.coordinates.lat, trip.hotel.coordinates.lng]}
            zoom={13}
            style={{ height: '100%', width: '100%' }}
            zoomControl={false}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {filteredLocations.map((loc) => (
              <Marker
                key={loc.id}
                position={[loc.lat, loc.lng]}
              >
                <Popup>
                  <div className="text-center min-w-[150px]">
                    <span className="text-2xl block">{loc.icon}</span>
                    <h4 className="font-bold text-sm mt-1">{loc.nameHe}</h4>
                    <p className="text-xs text-slate-500">{loc.name}</p>
                    <button
                      onClick={() => {
                        const url = `https://www.google.com/maps/dir/?api=1&destination=${loc.lat},${loc.lng}`;
                        window.open(url, '_blank');
                      }}
                      className="mt-2 px-3 py-1 bg-blue-500 text-white rounded-full text-xs hover:bg-blue-600"
                    >
                      🧭 נווט
                    </button>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </Card>

      {/* Locations List */}
      <Card>
        <CardHeader>
          <h3 className="font-bold text-slate-800 mb-3">📍 כל המיקומים</h3>
          <div className="space-y-2">
            {filteredLocations.map((loc) => (
              <div
                key={loc.id}
                className="flex items-center justify-between p-3 bg-slate-50 rounded-xl"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{loc.icon}</span>
                  <div>
                    <p className="text-sm font-medium text-slate-700">{loc.nameHe}</p>
                    <p className="text-xs text-slate-400">{loc.name}</p>
                  </div>
                </div>
                <NavigationButton lat={loc.lat} lng={loc.lng} />
              </div>
            ))}
          </div>
        </CardHeader>
      </Card>
    </div>
  );
}