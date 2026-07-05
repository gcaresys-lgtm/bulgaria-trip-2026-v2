import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, DollarSign } from 'lucide-react';
import { useExpenseStore } from '../../stores/trip';
import { Card, CardHeader } from '../ui/Card';
import { Button } from '../ui/Button';

const categories = [
  { id: 'food', label: 'אוכל', icon: '🍽️', color: 'bg-orange-100 text-orange-600' },
  { id: 'transport', label: 'תחבורה', icon: '🚕', color: 'bg-blue-100 text-blue-600' },
  { id: 'shopping', label: 'קניות', icon: '🛍️', color: 'bg-purple-100 text-purple-600' },
  { id: 'attractions', label: 'אטרקציות', icon: '🎢', color: 'bg-green-100 text-green-600' },
  { id: 'hotel', label: 'מלון', icon: '🏨', color: 'bg-yellow-100 text-yellow-600' },
  { id: 'other', label: 'אחר', icon: '📦', color: 'bg-gray-100 text-gray-600' },
];

export default function ExpenseTracker() {
  const { expenses, addExpense, removeExpense, getTotalAll, getByCategory } = useExpenseStore();
  const [showAdd, setShowAdd] = useState(false);
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<string>('food');

  const total = getTotalAll();
  const byCategory = getByCategory();

  const handleAdd = () => {
    if (!amount || !description) return;
    addExpense({
      amount: parseFloat(amount),
      currency: 'BGN',
      category: category as any,
      description,
      date: new Date().toISOString().split('T')[0],
    });
    setAmount('');
    setDescription('');
    setShowAdd(false);
  };

  return (
    <div className="p-4 space-y-4">
      {/* Total Card */}
      <Card className="bg-gradient-to-br from-primary-600 to-primary-800 text-white">
        <div className="p-4 text-center">
          <DollarSign className="mx-auto mb-2" size={24} />
          <h2 className="text-sm text-white/80">סה"כ הוצאות</h2>
          <p className="text-3xl font-bold">{total.toFixed(0)} BGN</p>
          <p className="text-sm text-white/70">~{(total * 1.86).toFixed(0)} ₪</p>
        </div>
      </Card>

      {/* Category Breakdown */}
      <Card>
        <CardHeader>
          <h3 className="font-bold text-slate-800 mb-3">📊 לפי קטגוריה</h3>
          <div className="space-y-2">
            {categories.map((cat) => {
              const amount = byCategory[cat.id] || 0;
              if (amount === 0) return null;
              const percentage = total > 0 ? (amount / total) * 100 : 0;
              return (
                <div key={cat.id} className="flex items-center gap-3">
                  <span className="text-lg">{cat.icon}</span>
                  <div className="flex-1">
                    <div className="flex justify-between text-sm mb-1">
                      <span>{cat.label}</span>
                      <span className="font-medium">{amount.toFixed(0)} BGN</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-1.5">
                      <div
                        className={`h-1.5 rounded-full ${cat.color.split(' ')[0]}`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardHeader>
      </Card>

      {/* Recent Expenses */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-slate-800">📝 הוצאות אחרונות</h3>
            <Button
              variant="primary"
              size="sm"
              icon={<Plus size={14} />}
              onClick={() => setShowAdd(!showAdd)}
            >
              הוסף
            </Button>
          </div>

          {/* Add Form */}
          <AnimatePresence>
            {showAdd && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="mb-4 overflow-hidden"
              >
                <div className="space-y-3 p-3 bg-slate-50 rounded-xl">
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="סכום (BGN)"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="תאור"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  <div className="flex flex-wrap gap-2">
                    {categories.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => setCategory(cat.id)}
                        className={`px-3 py-1 rounded-full text-xs transition-colors ${
                          category === cat.id ? 'bg-primary-600 text-white' : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {cat.icon} {cat.label}
                      </button>
                    ))}
                  </div>
                  <Button variant="primary" onClick={handleAdd} className="w-full">
                    שמור
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* List */}
          <div className="space-y-2">
            {expenses.length === 0 ? (
              <p className="text-center text-slate-400 text-sm py-4">אין הוצאות עדיין</p>
            ) : (
              expenses
                .slice()
                .reverse()
                .slice(0, 10)
                .map((expense) => {
                  const cat = categories.find((c) => c.id === expense.category);
                  return (
                    <motion.div
                      key={expense.id}
                      layout
                      className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl"
                    >
                      <span className="text-xl">{cat?.icon || '📦'}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-700 truncate">
                          {expense.description}
                        </p>
                        <p className="text-xs text-slate-400">{expense.date}</p>
                      </div>
                      <span className="text-sm font-bold text-slate-800">
                        {expense.amount.toFixed(0)} BGN
                      </span>
                      <button
                        onClick={() => removeExpense(expense.id)}
                        className="text-slate-400 hover:text-danger-500 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </motion.div>
                  );
                })
            )}
          </div>
        </CardHeader>
      </Card>
    </div>
  );
}