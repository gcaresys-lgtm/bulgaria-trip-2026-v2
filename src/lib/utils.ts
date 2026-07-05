import type { TripDay } from '../types';

// Format date to Hebrew
export function formatDateHebrew(date: string): string {
  return date;
}

// Get day icon based on activities
export function getDayIcon(day: TripDay): string {
  const activityNames = day.activities.map((a) => a.name.toLowerCase());
  
  if (activityNames.some((n) => n.includes('טיסה') || n.includes('נחיתה'))) return '✈️';
  if (activityNames.some((n) => n.includes('ים') || n.includes('בריכה') || n.includes('חוף'))) return '🏖️';
  if (activityNames.some((n) => n.includes('קניות') || n.includes('mall'))) return '🛍️';
  if (activityNames.some((n) => n.includes('נסבר') || n.includes('עתיקה'))) return '🏛️';
  if (activityNames.some((n) => n.includes('אטרקציות') || n.includes('פארק'))) return '🎢';
  if (activityNames.some((n) => n.includes('ספא') || n.includes('מסאז'))) return '💆';
  if (activityNames.some((n) => n.includes('check-out') || n.includes('חזרה'))) return '🏠';
  
  return '☀️';
}

// Get time icon
export function getTimeIcon(time: 'morning' | 'afternoon' | 'evening'): string {
  switch (time) {
    case 'morning':
      return '🌅';
    case 'afternoon':
      return '☀️';
    case 'evening':
      return '🌙';
  }
}

// Format currency
export function formatCurrency(amount: number, currency: string): string {
  return new Intl.NumberFormat('he-IL', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
  }).format(amount);
}

// Generate unique ID
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Debounce function
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// Truncate text
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

// Check if image is cached
export async function isImageCached(url: string): Promise<boolean> {
  try {
    const cache = await caches.open('images-cache');
    const response = await cache.match(url);
    return !!response;
  } catch {
    return false;
  }
}

// Preload image
export function preloadImage(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = src;
  });
}

// Get relative time
export function getRelativeTime(timestamp: string): string {
  const now = new Date();
  const then = new Date(timestamp);
  const diff = now.getTime() - then.getTime();
  
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  
  if (minutes < 1) return 'עכשיו';
  if (minutes < 60) return `לפני ${minutes} דקות`;
  if (hours < 24) return `לפני ${hours} שעות`;
  if (days < 7) return `לפני ${days} ימים`;
  
  return then.toLocaleDateString('he-IL');
}