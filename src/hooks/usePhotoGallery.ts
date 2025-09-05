import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import type { RenamePattern } from '@/types/photoRenamer';
import { generateNewName } from '@/utils/fileNaming';
import { errorLogger } from '@/utils/errorLogger';

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
  const [selectedPhotos, setSelectedPhotos] = useState<Set<string>>(new Set());
  const [storageUsed, setStorageUsed] = useState<number>(0);
  const [isRenaming, setIsRenaming] = useState(false);

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
      
      // Log the error
      await errorLogger.logUploadError('photo_upload', error as Error, {
        name: file.name,
        size: file.size,
        type: file.type
      });

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
      
      // Log the error
      await errorLogger.logProcessingError('photo_delete', error as Error, {
        photoId,
        filePath
      });

      toast.error('Failed to delete photo');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const batchRenamePhotos = async (photosToRename: PhotoMetadata[], pattern: RenamePattern): Promise<boolean> => {
    try {
      setIsRenaming(true);
      let successCount = 0;

      for (let index = 0; index < photosToRename.length; index++) {
        const photo = photosToRename[index];
        
        // Create a mock PhotoFile for the generateNewName function
        const mockPhotoFile = {
          id: photo.id,
          file: new File([], photo.original_name),
          originalName: photo.original_name,
          newName: '',
          preview: '',
          size: photo.file_size,
          lastModified: new Date(photo.created_at).getTime(),
          processed: false,
          selected: true,
        };

        const newName = generateNewName(mockPhotoFile, index, pattern);
        
        // Update the database with the new name
        const { error } = await supabase
          .from('photos')
          .update({ original_name: newName })
          .eq('id', photo.id);

        if (!error) {
          successCount++;
        } else {
          console.error(`Error renaming photo ${photo.original_name}:`, error);
        }
      }

      if (successCount > 0) {
        toast.success(`Successfully renamed ${successCount} photos`);
        setSelectedPhotos(new Set()); // Clear selection
        await fetchPhotos(); // Refresh the gallery
      }

      if (successCount < photosToRename.length) {
        toast.error(`Failed to rename ${photosToRename.length - successCount} photos`);
      }

      return successCount === photosToRename.length;
    } catch (error) {
      console.error('Error in batch rename:', error);
      toast.error('Failed to rename photos');
      return false;
    } finally {
      setIsRenaming(false);
    }
  };

  const togglePhotoSelection = (photoId: string) => {
    setSelectedPhotos(prev => {
      const newSelection = new Set(prev);
      if (newSelection.has(photoId)) {
        newSelection.delete(photoId);
      } else {
        newSelection.add(photoId);
      }
      return newSelection;
    });
  };

  const selectAllPhotos = () => {
    setSelectedPhotos(new Set(filteredAndSortedPhotos.map(photo => photo.id)));
  };

  const clearSelection = () => {
    setSelectedPhotos(new Set());
  };

  const deleteSelectedPhotos = async (): Promise<boolean> => {
    const selectedPhotosList = filteredAndSortedPhotos.filter(photo => selectedPhotos.has(photo.id));
    
    if (selectedPhotosList.length === 0) return false;

    try {
      setLoading(true);
      let successCount = 0;

      for (const photo of selectedPhotosList) {
        const success = await deletePhoto(photo.id, photo.file_path);
        if (success) successCount++;
      }

      if (successCount > 0) {
        setSelectedPhotos(new Set()); // Clear selection
        toast.success(`Successfully deleted ${successCount} photos`);
      }

      return successCount === selectedPhotosList.length;
    } catch (error) {
      console.error('Error deleting selected photos:', error);
      toast.error('Failed to delete selected photos');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const aiRenamePhoto = async (photoId: string): Promise<boolean> => {
    try {
      setLoading(true);
      
      // Get signed URL for the photo
      const photo = photos.find(p => p.id === photoId);
      if (!photo) {
        throw new Error('Photo not found');
      }

      const { data: signedUrlData, error: urlError } = await supabase.storage
        .from('user-photos')
        .createSignedUrl(photo.file_path, 300); // 5 minute expiry

      if (urlError || !signedUrlData?.signedUrl) {
        throw new Error('Failed to generate signed URL');
      }

      // Call the AI rename edge function
      const { data, error } = await supabase.functions.invoke('ai-photo-rename', {
        body: {
          photoId,
          signedUrl: signedUrlData.signedUrl
        }
      });

      if (error) {
        throw new Error(error.message || 'Failed to rename photo');
      }

      if (!data?.success) {
        throw new Error(data?.error || 'AI renaming failed');
      }

      toast.success('Photo renamed with AI successfully');
      // Refresh will happen automatically via real-time subscription
      return true;

    } catch (error) {
      console.error('Error renaming photo with AI:', error);
      
      // Log the error
      await errorLogger.logAiError('ai_photo_rename', error as Error, {
        photoId
      });

      toast.error('Failed to rename photo with AI');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const calculateStorageUsed = () => {
    return photos.reduce((total, photo) => total + photo.file_size, 0);
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
      
      // Log the error
      await errorLogger.logProcessingError('photo_fetch', error as Error);

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

  useEffect(() => {
    setStorageUsed(calculateStorageUsed());
  }, [photos]);

  // Set up realtime subscription for photos changes
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('photos-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'photos',
          filter: `user_id=eq.${user.id}`
        },
        async (payload) => {
          console.log('New photo inserted:', payload);
          
          // Get signed URL for the new photo
          const { data: urlData } = await supabase.storage
            .from('user-photos')
            .createSignedUrl(payload.new.file_path, 3600);

          const newPhoto = {
            ...payload.new,
            url: urlData?.signedUrl || null,
          } as PhotoMetadata;

          // Add the new photo to the beginning of the list
          setPhotos(prev => [newPhoto, ...prev]);
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'photos',
          filter: `user_id=eq.${user.id}`
        },
        async (payload) => {
          console.log('Photo updated:', payload);
          
          // Get signed URL for the updated photo
          const { data: urlData } = await supabase.storage
            .from('user-photos')
            .createSignedUrl(payload.new.file_path, 3600);

          const updatedPhoto = {
            ...payload.new,
            url: urlData?.signedUrl || null,
          } as PhotoMetadata;

          // Update the photo in the list
          setPhotos(prev => prev.map(photo => 
            photo.id === updatedPhoto.id ? updatedPhoto : photo
          ));
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'photos',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          console.log('Photo deleted:', payload);
          
          // Remove the photo from the list
          setPhotos(prev => prev.filter(photo => photo.id !== payload.old.id));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  return {
    photos: filteredAndSortedPhotos,
    loading,
    isRenaming,
    searchTerm,
    setSearchTerm,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    selectedPhotos,
    storageUsed: calculateStorageUsed(),
    uploadPhoto,
    deletePhoto,
    fetchPhotos,
    batchRenamePhotos,
    togglePhotoSelection,
    selectAllPhotos,
    clearSelection,
    deleteSelectedPhotos,
    aiRenamePhoto,
  };
};