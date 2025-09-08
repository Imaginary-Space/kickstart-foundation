import type { PhotoMetadata } from '@/hooks/usePhotoGallery';

const CACHE_KEY = 'photo_gallery_cache';
const CACHE_VERSION = '1.0';

interface CacheData {
  version: string;
  timestamp: number;
  userId: string;
  photos: PhotoMetadata[];
  searchPreferences: {
    searchTerm: string;
    sortBy: 'name' | 'date' | 'size';
    sortOrder: 'asc' | 'desc';
  };
}

export const photoCacheManager = {
  // Get cached photos for a user
  getCachedPhotos: (userId: string): PhotoMetadata[] | null => {
    try {
      const cached = localStorage.getItem(`${CACHE_KEY}_${userId}`);
      if (!cached) return null;

      const data: CacheData = JSON.parse(cached);
      
      // Check cache version and age (older than 30 minutes)
      const thirtyMinutes = 30 * 60 * 1000;
      if (
        data.version !== CACHE_VERSION || 
        Date.now() - data.timestamp > thirtyMinutes
      ) {
        localStorage.removeItem(`${CACHE_KEY}_${userId}`);
        return null;
      }

      return data.photos;
    } catch (error) {
      console.error('Error reading photo cache:', error);
      return null;
    }
  },

  // Cache photos for a user
  setCachedPhotos: (
    userId: string, 
    photos: PhotoMetadata[], 
    searchPreferences?: Partial<CacheData['searchPreferences']>
  ): void => {
    try {
      const data: CacheData = {
        version: CACHE_VERSION,
        timestamp: Date.now(),
        userId,
        photos,
        searchPreferences: {
          searchTerm: '',
          sortBy: 'date',
          sortOrder: 'desc',
          ...searchPreferences,
        },
      };

      localStorage.setItem(`${CACHE_KEY}_${userId}`, JSON.stringify(data));
    } catch (error) {
      console.error('Error caching photos:', error);
      // Clear cache if storage is full
      if (error instanceof Error && error.name === 'QuotaExceededError') {
        localStorage.removeItem(`${CACHE_KEY}_${userId}`);
      }
    }
  },

  // Get cached search preferences
  getCachedPreferences: (userId: string): CacheData['searchPreferences'] | null => {
    try {
      const cached = localStorage.getItem(`${CACHE_KEY}_${userId}`);
      if (!cached) return null;

      const data: CacheData = JSON.parse(cached);
      return data.searchPreferences;
    } catch (error) {
      console.error('Error reading cached preferences:', error);
      return null;
    }
  },

  // Clear cache for a user
  clearCache: (userId: string): void => {
    localStorage.removeItem(`${CACHE_KEY}_${userId}`);
  },

  // Clear all photo caches
  clearAllCaches: (): void => {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith(CACHE_KEY)) {
        localStorage.removeItem(key);
      }
    });
  },
};