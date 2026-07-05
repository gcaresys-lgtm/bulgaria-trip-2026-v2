import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Upload, X, Download } from 'lucide-react';
import { Card, CardHeader } from '../ui/Card';
import { Button } from '../ui/Button';
import { usePhotosStore } from '../../stores';
import { useImageCompression } from '../../hooks';
import { generateId } from '../../lib/utils';

const MAX_PHOTOS = 50;

const presetImages = [
  { src: '/src/assets/images/bg1.jpg', name: 'Sunny Beach' },
  { src: '/src/assets/images/bg2.jpg', name: 'המלון' },
  { src: '/src/assets/images/bg3.jpg', name: 'בולגריה' },
  { src: '/src/assets/images/bg4.jpg', name: 'חוף הים' },
  { src: '/src/assets/images/bg5.jpg', name: 'נסבר' },
];

export default function PhotosTab() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const { photos, addPhoto, removePhoto } = usePhotosStore();
  const { compressImage, createThumbnail } = useImageCompression();

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const remaining = MAX_PHOTOS - photos.length;
    if (remaining <= 0) {
      alert(`לא ניתן להעלות יותר מ-${MAX_PHOTOS} תמונות`);
      return;
    }

    setIsUploading(true);
    const filesToProcess = Array.from(files).slice(0, remaining);

    for (const file of filesToProcess) {
      if (!file.type.startsWith('image/')) continue;

      const thumbnail = await createThumbnail(file);
      const compressed = await compressImage(file);
      const reader = new FileReader();

      reader.onload = (event) => {
        addPhoto({
          id: generateId(),
          name: file.name,
          thumb: thumbnail,
          full: event.target?.result as string,
          status: 'uploaded',
          eventId: 'bulgaria-2026',
          timestamp: new Date().toISOString(),
        });
      };
      reader.readAsDataURL(compressed);
    }

    setIsUploading(false);
    e.target.value = '';
  };

  const handleDelete = (id: string) => {
    if (confirm('למחוק את התמונה?')) {
      removePhoto(id);
      setSelectedImage(null);
    }
  };

  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-slate-800">📸 תמונות מהטיול</h2>
        <span className="bg-primary-600 text-white px-3 py-1 rounded-full text-sm font-bold">
          {photos.length}/{MAX_PHOTOS}
        </span>
      </div>

      {/* Upload Buttons */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <Button
          variant="primary"
          icon={<Camera size={18} />}
          onClick={() => cameraInputRef.current?.click()}
          disabled={photos.length >= MAX_PHOTOS}
        >
          מצלמה
        </Button>
        <Button
          variant="secondary"
          icon={<Upload size={18} />}
          onClick={() => fileInputRef.current?.click()}
          disabled={photos.length >= MAX_PHOTOS}
        >
          גלריה
        </Button>
      </div>

      {/* Hidden Inputs */}
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileSelect}
        className="hidden"
      />
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Upload Progress */}
      <AnimatePresence>
        {isUploading && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-4"
          >
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="animate-spin">
                    <Upload size={20} className="text-primary-600" />
                  </div>
                  <span className="text-sm text-slate-600">מעלה תמונה...</span>
                </div>
              </CardHeader>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Uploaded Photos Grid */}
      {photos.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-medium text-slate-600 mb-3">התמונות שלי</h3>
          <div className="grid grid-cols-3 gap-2">
            {photos.map((photo) => (
              <motion.div
                key={photo.id}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="relative aspect-square rounded-xl overflow-hidden cursor-pointer group"
                onClick={() => setSelectedImage(photo.full)}
              >
                <img
                  src={photo.thumb}
                  alt={photo.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors" />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(photo.id);
                  }}
                  className="absolute top-1 left-1 w-6 h-6 bg-danger-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X size={12} className="text-white" />
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Preset Gallery */}
      <div>
        <h3 className="text-sm font-medium text-slate-600 mb-3">🖼️ גלריית הטיול</h3>
        <div className="grid grid-cols-2 gap-3">
          {presetImages.map((img, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="relative aspect-[4/3] rounded-xl overflow-hidden cursor-pointer shadow-sm"
              onClick={() => setSelectedImage(img.src)}
            >
              <img
                src={img.src}
                alt={img.name}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                <span className="text-white text-sm font-medium">{img.name}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Image Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-50 flex flex-col items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <button
              className="absolute top-4 right-4 w-10 h-10 bg-white/20 rounded-full flex items-center justify-center"
              onClick={() => setSelectedImage(null)}
            >
              <X size={24} className="text-white" />
            </button>
            
            <motion.img
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              src={selectedImage}
              alt="תמונה"
              className="max-w-full max-h-[70vh] rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />

            <div className="flex gap-4 mt-4" onClick={(e) => e.stopPropagation()}>
              <a
                href={selectedImage}
                download
                className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center"
              >
                <Download size={20} className="text-white" />
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}