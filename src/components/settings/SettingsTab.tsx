import { useState } from 'react';
import { Settings, Download, Upload, RotateCcw, DollarSign } from 'lucide-react';
import { useSettingsStore } from '../../stores/trip';
import { Card, CardHeader } from '../ui/Card';
import { Button } from '../ui/Button';

export default function SettingsTab() {
  const { currency, budget, darkMode, language, setCurrency, setBudget, toggleDarkMode, setLanguage, exportData, importData, resetAll } = useSettingsStore();
  const [showImport, setShowImport] = useState(false);
  const [importJson, setImportJson] = useState('');

  const handleExport = () => {
    const data = exportData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `bulgaria-2026-backup-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    if (!importJson) return;
    importData(importJson);
    setImportJson('');
    setShowImport(false);
  };

  return (
    <div className="p-4 space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2 mb-4">
            <Settings className="text-primary-600" size={20} />
            <h2 className="font-bold text-slate-800">הגדרות</h2>
          </div>

          {/* Currency */}
          <div className="mb-4">
            <label className="text-sm font-medium text-slate-700 block mb-2">
              <DollarSign className="inline" size={14} /> מטבע מועדף
            </label>
            <div className="flex gap-2">
              {(['BGN', 'EUR', 'ILS'] as const).map((c) => (
                <button
                  key={c}
                  onClick={() => setCurrency(c)}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                    currency === c
                      ? 'bg-primary-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {c === 'BGN' ? ' לב (BGN)' : c === 'EUR' ? ' € (EUR)' : ' ₪ (ILS)'}
                </button>
              ))}
            </div>
          </div>

          {/* Budget */}
          <div className="mb-4">
            <label className="text-sm font-medium text-slate-700 block mb-2">
              💰 תקציב (BGN)
            </label>
            <input
              type="number"
              value={budget}
              onChange={(e) => setBudget(Number(e.target.value))}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          {/* Dark Mode */}
          <div className="flex items-center justify-between py-3 border-b border-slate-100">
            <span className="text-sm font-medium text-slate-700">
              {darkMode ? '🌙' : '☀️'} מצב לילה
            </span>
            <button
              onClick={toggleDarkMode}
              className={`w-12 h-6 rounded-full transition-colors ${
                darkMode ? 'bg-primary-600' : 'bg-slate-300'
              }`}
            >
              <div
                className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${
                  darkMode ? 'translate-x-6' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>

          {/* Language */}
          <div className="flex items-center justify-between py-3 border-b border-slate-100">
            <span className="text-sm font-medium text-slate-700">🌐 שפה</span>
            <div className="flex gap-2">
              <button
                onClick={() => setLanguage('he')}
                className={`px-3 py-1 rounded-lg text-sm ${
                  language === 'he' ? 'bg-primary-600 text-white' : 'bg-slate-100 text-slate-600'
                }`}
              >
                עברית
              </button>
              <button
                onClick={() => setLanguage('en')}
                className={`px-3 py-1 rounded-lg text-sm ${
                  language === 'en' ? 'bg-primary-600 text-white' : 'bg-slate-100 text-slate-600'
                }`}
              >
                English
              </button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Data Management */}
      <Card>
        <CardHeader>
          <h3 className="font-bold text-slate-800 mb-3">📂 ניהול נתונים</h3>
          <div className="space-y-2">
            <Button
              variant="secondary"
              onClick={handleExport}
              className="w-full justify-start"
              icon={<Download size={16} />}
            >
              ייצוא נתונים (JSON)
            </Button>
            <Button
              variant="secondary"
              onClick={() => setShowImport(!showImport)}
              className="w-full justify-start"
              icon={<Upload size={16} />}
            >
              ייבוא נתונים
            </Button>
            {showImport && (
              <div className="mt-2 space-y-2">
                <textarea
                  value={importJson}
                  onChange={(e) => setImportJson(e.target.value)}
                  placeholder="הדבק את קובץ ה-JSON כאן..."
                  className="w-full h-32 px-3 py-2 border border-slate-200 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <Button variant="primary" onClick={handleImport} className="w-full">
                  ייבא
                </Button>
              </div>
            )}
            <Button
              variant="danger"
              onClick={() => {
                if (confirm('למחוק את כל הנתונים? פעולה זו לא ניתנת לביטול!')) {
                  resetAll();
                }
              }}
              className="w-full justify-start"
              icon={<RotateCcw size={16} />}
            >
              איפוס כל הנתונים
            </Button>
          </div>
        </CardHeader>
      </Card>
    </div>
  );
}