import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface PhotoMetadata {
  id: string;
  original_name: string;
  file_name: string;
  file_path: string;
  file_size: number;
  mime_type: string;
  width?: number;
  height?: number;
  created_at: string;
  updated_at: string;
  url?: string;
}

export const usePhotoGallery = () => {
  const { user } = useAuth();
  const [photos, setPhotos] = useState<PhotoMetadata[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'size'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const uploadPhoto = async (file: File): Promise<boolean> => {
    if (!user) {
      toast.error('You must be logged in to upload photos');
      return false;
    }

    try {
      setLoading(true);
      
      // Get image dimensions
      const dimensions = await getImageDimensions(file);
      
      // Create unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      // Upload to storage
      const { error: uploadError } = await supabase.storage
        .from('user-photos')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        throw uploadError;
      }

      // Save metadata to database
      const { error: dbError } = await supabase
        .from('photos')
        .insert({
          user_id: user.id,
          original_name: file.name,
          file_name: fileName,
          file_path: filePath,
          file_size: file.size,
          mime_type: file.type,
          width: dimensions.width,
          height: dimensions.height,
        });

      if (dbError) {
        // Clean up uploaded file if database insert fails
        await supabase.storage.from('user-photos').remove([filePath]);
        throw dbError;
      }

      toast.success('Photo uploaded successfully');
      await fetchPhotos(); // Refresh the gallery
      return true;
    } catch (error) {
      console.error('Error uploading photo:', error);
      toast.error('Failed to upload photo');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deletePhoto = async (photoId: string, filePath: string): Promise<boolean> => {
    try {
      setLoading(true);

      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('user-photos')
        .remove([filePath]);

      if (storageError) {
        throw storageError;
      }

      // Delete from database
      const { error: dbError } = await supabase
        .from('photos')
        .delete()
        .eq('id', photoId);

      if (dbError) {
        throw dbError;
      }

      toast.success('Photo deleted successfully');
      await fetchPhotos(); // Refresh the gallery
      return true;
    } catch (error) {
      console.error('Error deleting photo:', error);
      toast.error('Failed to delete photo');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const fetchPhotos = async () => {
    if (!user) return;

    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('photos')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      // Get signed URLs for photos
      const photosWithUrls = await Promise.all(
        (data || []).map(async (photo) => {
          const { data: urlData } = await supabase.storage
            .from('user-photos')
            .createSignedUrl(photo.file_path, 3600); // 1 hour expiry

          return {
            ...photo,
            url: urlData?.signedUrl || null,
          };
        })
      );

      setPhotos(photosWithUrls);
    } catch (error) {
      console.error('Error fetching photos:', error);
      toast.error('Failed to load photos');
    } finally {
      setLoading(false);
    }
  };

  const getImageDimensions = (file: File): Promise<{ width: number; height: number }> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        resolve({ width: img.naturalWidth, height: img.naturalHeight });
        URL.revokeObjectURL(img.src);
      };
      img.onerror = reject;
      img.src = URL.createObjectURL(file);
    });
  };

  const filteredAndSortedPhotos = photos
    .filter(photo => 
      photo.original_name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'name':
          comparison = a.original_name.localeCompare(b.original_name);
          break;
        case 'date':
          comparison = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
          break;
        case 'size':
          comparison = a.file_size - b.file_size;
          break;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });

  useEffect(() => {
    if (user) {
      fetchPhotos();
    }
  }, [user]);

  return {
    photos: filteredAndSortedPhotos,
    loading,
    searchTerm,
    setSearchTerm,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    uploadPhoto,
    deletePhoto,
    fetchPhotos,
  };
};