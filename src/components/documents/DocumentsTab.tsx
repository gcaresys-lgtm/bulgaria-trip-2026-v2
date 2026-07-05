import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Upload, Trash2, Download } from 'lucide-react';
import { useDocumentStore } from '../../stores/trip';
import { Card, CardHeader } from '../ui/Card';
import { Button } from '../ui/Button';

const docTypes = [
  { id: 'passport', label: 'דרכון', icon: '🛂', color: 'bg-blue-100' },
  { id: 'ticket', label: 'כרטיס טיסה', icon: '✈️', color: 'bg-green-100' },
  { id: 'reservation', label: 'הזמנת מלון', icon: '🏨', color: 'bg-yellow-100' },
  { id: 'insurance', label: 'ביטוח נסיעות', icon: '🛡️', color: 'bg-purple-100' },
  { id: 'other', label: 'אחר', icon: '📄', color: 'bg-gray-100' },
];

export default function DocumentsTab() {
  const { documents, addDocument, removeDocument } = useDocumentStore();
  const [showUpload, setShowUpload] = useState(false);
  const [selectedType, setSelectedType] = useState<string>('passport');
  const [selectedDoc, setSelectedDoc] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      addDocument({
        name: file.name,
        type: selectedType as any,
        dataUrl: event.target?.result as string,
      });
      setShowUpload(false);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleDownload = (doc: typeof documents[0]) => {
    const link = document.createElement('a');
    link.href = doc.dataUrl;
    link.download = doc.name;
    link.click();
  };

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <Card>
        <div className="p-4">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-slate-800">📁 המסמכים שלי</h2>
            <Button
              variant="primary"
              size="sm"
              icon={<Upload size={14} />}
              onClick={() => setShowUpload(!showUpload)}
            >
              העלה
            </Button>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            {documents.length} מסמכים שמורים - פועלים גם במצב Offline
          </p>
        </div>
      </Card>

      {/* Upload Form */}
      <AnimatePresence>
        {showUpload && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
          >
            <Card>
              <CardHeader>
                <h3 className="font-bold text-slate-700 mb-3">העלה מסמך חדש</h3>
                <div className="flex flex-wrap gap-2 mb-3">
                  {docTypes.map((type) => (
                    <button
                      key={type.id}
                      onClick={() => setSelectedType(type.id)}
                      className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                        selectedType === type.id
                          ? 'bg-primary-600 text-white'
                          : `${type.color} text-slate-600`
                      }`}
                    >
                      {type.icon} {type.label}
                    </button>
                  ))}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,.pdf"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <Button
                  variant="secondary"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full"
                  icon={<Upload size={16} />}
                >
                  בחר קובץ
                </Button>
              </CardHeader>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Documents Grid */}
      <div className="grid grid-cols-2 gap-3">
        {documents.length === 0 ? (
          <div className="col-span-2 text-center py-8">
            <FileText className="mx-auto text-slate-300 mb-2" size={48} />
            <p className="text-slate-400">אין מסמכים עדיין</p>
            <p className="text-xs text-slate-300">העלה דרכון, כרטיס טיסה או ביטוח</p>
          </div>
        ) : (
          documents.map((doc) => {
            const type = docTypes.find((t) => t.id === doc.type);
            return (
              <motion.div
                key={doc.id}
                layout
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
              >
                <Card className="cursor-pointer" onClick={() => setSelectedDoc(doc.id)}>
                  <div className={`p-3 ${type?.color || 'bg-gray-100'} rounded-t-xl`}>
                    <span className="text-3xl">{type?.icon || '📄'}</span>
                  </div>
                  <div className="p-3">
                    <p className="text-sm font-medium text-slate-700 truncate">{doc.name}</p>
                    <p className="text-xs text-slate-400">{type?.label}</p>
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDownload(doc);
                        }}
                        className="text-primary-600 hover:text-primary-700"
                      >
                        <Download size={14} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeDocument(doc.id);
                        }}
                        className="text-danger-500 hover:text-danger-600"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })
        )}
      </div>

      {/* Document Viewer */}
      <AnimatePresence>
        {selectedDoc && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-50 flex flex-col items-center justify-center p-4"
            onClick={() => setSelectedDoc(null)}
          >
            <button
              className="absolute top-4 right-4 w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-white"
              onClick={() => setSelectedDoc(null)}
            >
              ✕
            </button>
            {(() => {
              const doc = documents.find((d) => d.id === selectedDoc);
              if (!doc) return null;
              return (
                <div className="max-w-full max-h-[80vh] overflow-auto" onClick={(e) => e.stopPropagation()}>
                  {doc.dataUrl.startsWith('data:image') ? (
                    <img src={doc.dataUrl} alt={doc.name} className="max-w-full rounded-lg" />
                  ) : (
                    <iframe src={doc.dataUrl} className="w-full h-[80vh] rounded-lg bg-white" />
                  )}
                </div>
              );
            })()}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}