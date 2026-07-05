import { Toaster } from 'react-hot-toast';
import { Header } from './components/layout/Header';
import { Navigation } from './components/layout/Navigation';
import { TabContent } from './components/layout/TabContent';
import { useOnlineStatus } from './hooks';

function App() {
  const isOnline = useOnlineStatus();

  return (
    <div className="min-h-screen bg-slate-50">
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#1e293b',
            color: '#fff',
            borderRadius: '12px',
          },
        }}
      />

      {!isOnline && (
        <div className="bg-warning-500 text-white text-center py-2 text-sm font-medium sticky top-0 z-50">
          📴 במצב Offline - הנתונים נשמרים מקומית
        </div>
      )}

      <Header />
      <TabContent />
      <Navigation />
    </div>
  );
}

export default App;