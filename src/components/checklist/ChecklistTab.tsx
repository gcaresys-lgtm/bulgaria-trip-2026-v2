import { motion } from 'framer-motion';
import { Backpack, CheckCircle } from 'lucide-react';
import { Card, CardHeader } from '../ui/Card';
import { Checkbox } from '../ui/Checkbox';
import { CircularProgress } from '../ui/Progress';
import { useChecklistStore } from '../../stores';

const categoryLabels: Record<string, string> = {
  documents: '📄 מסמכים',
  clothing: '👕 בגדים',
  toiletries: '🧴 טואלטיקה',
  electronics: '🔌 אלקטרוניקה',
  essentials: '🎯 הכרחי',
};

export default function ChecklistTab() {
  const { items, toggleItem, getProgress } = useChecklistStore();
  const progress = getProgress();

  const groupedItems = items.reduce(
    (acc, item) => {
      if (!acc[item.category]) acc[item.category] = [];
      acc[item.category].push(item);
      return acc;
    },
    {} as Record<string, typeof items>
  );

  const packedCount = items.filter((i) => i.packed).length;

  return (
    <div className="p-4">
      {/* Header with Progress */}
      <Card className="mb-4">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Backpack className="text-primary-600" size={24} />
              <div>
                <h2 className="text-lg font-bold text-slate-800">רשימת ציוד</h2>
                <p className="text-sm text-slate-500">
                  {packedCount} / {items.length} נארזו
                </p>
              </div>
            </div>
            <CircularProgress value={progress} size={70} />
          </div>
        </CardHeader>
      </Card>

      {/* Checklist by Category */}
      {Object.entries(groupedItems).map(([category, categoryItems]) => (
        <motion.div
          key={category}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4"
        >
          <Card>
            <CardHeader>
              <h3 className="font-bold text-slate-700 mb-3">
                {categoryLabels[category]}
              </h3>
              <div className="space-y-2">
                {categoryItems.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${
                      item.packed ? 'bg-success-500/10' : 'bg-slate-50'
                    }`}
                  >
                    <Checkbox
                      checked={item.packed}
                      onChange={() => toggleItem(item.id)}
                    />
                    <span
                      className={`flex-1 text-sm ${
                        item.packed ? 'text-slate-500 line-through' : 'text-slate-700'
                      }`}
                    >
                      {item.name}
                    </span>
                    {item.packed && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="text-success-500"
                      >
                        <CheckCircle size={16} />
                      </motion.div>
                    )}
                  </motion.div>
                ))}
              </div>
            </CardHeader>
          </Card>
        </motion.div>
      ))}

      {/* Summary */}
      {progress === 100 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-6"
        >
          <div className="text-5xl mb-3">🎉</div>
          <h3 className="text-lg font-bold text-success-600">כל הציוד מוכן!</h3>
          <p className="text-sm text-slate-500">מוכנים לטיול!</p>
        </motion.div>
      )}
    </div>
  );
}