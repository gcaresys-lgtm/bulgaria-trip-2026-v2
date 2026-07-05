import { motion } from 'framer-motion';
import { Utensils, Banknote, Smartphone, MapPin, StickyNote } from 'lucide-react';
import { Card, CardHeader } from '../ui/Card';

const tips = [
  {
    icon: <Utensils className="text-orange-500" size={20} />,
    title: 'איפה אוכלים?',
    content: {
      subtitle: 'בגלל שיש Full Board:',
      included: ['ארוחת בוקר במלון', 'ארוחת צהריים במלון', 'ארוחת ערב במלון'],
      outside: ['קפה', 'גלידה', 'קוקטיילים', 'קינוחים'],
    },
  },
  {
    icon: <Banknote className="text-green-500" size={20} />,
    title: 'כסף',
    items: [
      'מטבע: לב בולגרי (BGN)',
      'מעט מזומן',
      'רוב התשלומים באשראי',
      'להימנע מהמרת כסף בדלפקים תיירותיים',
    ],
  },
  {
    icon: <Smartphone className="text-blue-500" size={20} />,
    title: 'אפליקציות מומלצות',
    items: [
      'Google Maps (מפות לא מקוונות)',
      'Uber/Bolt (אם זמין באזור)',
      'Google Translate',
      'XE Currency (המרת מטבע)',
    ],
  },
  {
    icon: <MapPin className="text-red-500" size={20} />,
    title: 'נקודות עניין',
    items: [
      'Premier Fort Cuisine',
      'Sunny Beach',
      'Nessebar',
      'Action Aquapark',
      'Royal Beach Mall',
      'Burgas Airport',
    ],
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function TipsTab() {
  return (
    <motion.div
      className="p-4 space-y-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {tips.map((tip, i) => (
        <motion.div key={i} variants={itemVariants}>
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2 mb-4">
                {tip.icon}
                <h3 className="font-bold text-slate-800">{tip.title}</h3>
              </div>

              {tip.content && (
                <div className="space-y-3">
                  <p className="text-sm text-slate-600">{tip.content.subtitle}</p>
                  <div className="space-y-2">
                    {tip.content.included.map((item, j) => (
                      <div key={j} className="flex items-center gap-2 text-sm text-success-600">
                        <span>✔</span>
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-slate-100 pt-3">
                    <p className="text-sm text-slate-500 mb-2">בחוץ רק:</p>
                    <div className="flex flex-wrap gap-2">
                      {tip.content.outside.map((item, j) => (
                        <span key={j} className="bg-slate-100 text-slate-600 px-2 py-1 rounded-lg text-xs">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {tip.items && (
                <div className="space-y-2">
                  {tip.items.map((item, j) => (
                    <div key={j} className="flex items-center gap-2 text-sm text-slate-600">
                      <span className="w-1.5 h-1.5 bg-primary-500 rounded-full" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              )}
            </CardHeader>
          </Card>
        </motion.div>
      ))}

      {/* Personal Notes */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2 mb-4">
              <StickyNote className="text-purple-500" size={20} />
              <h3 className="font-bold text-slate-800">הערות אישיות</h3>
            </div>
            <textarea
              placeholder="הוסף הערות אישיות, הוצאות או תמונות מהטיול..."
              className="w-full h-32 p-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
            />
          </CardHeader>
        </Card>
      </motion.div>
    </motion.div>
  );
}