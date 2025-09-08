import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import type { RenamePattern } from '@/types/photoRenamer';
import { generateNewName } from '@/utils/fileNaming';
import { errorLogger } from '@/utils/errorLogger';
import { usePostHog } from 'posthog-js/react';
import { photoCacheManager } from '@/utils/photoCache';

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

export const usePhotoGalleryWithCache = () => {
  const { user } = useAuth();
  const posthog = usePostHog();
  const queryClient = useQueryClient();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'size'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedPhotos, setSelectedPhotos] = useState<Set<string>>(new Set());
  const [isRenaming, setIsRenaming] = useState(false);

  // Load cached preferences on mount
  useEffect(() => {
    if (user) {
      const cachedPrefs = photoCacheManager.getCachedPreferences(user.id);
      if (cachedPrefs) {
        setSearchTerm(cachedPrefs.searchTerm);
        setSortBy(cachedPrefs.sortBy);
        setSortOrder(cachedPrefs.sortOrder);
      }
    }
  }, [user]);

  // Photos query with caching
  const photosQuery = useQuery({
    queryKey: ['photos', user?.id],
    queryFn: async () => {
      if (!user) return [];

      // Try to get cached data first for immediate display
      const cachedPhotos = photoCacheManager.getCachedPhotos(user.id);
      
      const { data, error } = await supabase
        .from('photos')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Get signed URLs for photos
      const photosWithUrls = await Promise.all(
        (data || []).map(async (photo) => {
          const { data: urlData } = await supabase.storage
            .from('user-photos')
            .createSignedUrl(photo.file_path, 3600);

          return {
            ...photo,
            url: urlData?.signedUrl || null,
          };
        })
      );

      // Cache the fresh data
      photoCacheManager.setCachedPhotos(user.id, photosWithUrls, {
        searchTerm,
        sortBy,
        sortOrder,
      });

      return photosWithUrls;
    },
    enabled: !!user,
    initialData: () => {
      // Return cached data immediately if available
      if (user) {
        return photoCacheManager.getCachedPhotos(user.id) || [];
      }
      return [];
    },
    staleTime: 2 * 60 * 1000, // 2 minutes - photos don't change that often
    gcTime: 10 * 60 * 1000, // 10 minutes in memory
  });

  // Upload mutation with optimistic updates
  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      if (!user) throw new Error('User not authenticated');

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

      if (uploadError) throw uploadError;

      // Save metadata to database
      const { data, error: dbError } = await supabase
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
        })
        .select()
        .single();

      if (dbError) {
        // Clean up uploaded file if database insert fails
        await supabase.storage.from('user-photos').remove([filePath]);
        throw dbError;
      }

      // Track successful photo upload
      posthog.capture('photo_uploaded', {
        file_name: file.name,
        file_size: file.size,
        file_type: file.type,
        image_dimensions: `${dimensions.width}x${dimensions.height}`,
        user_id: user.id,
        timestamp: new Date().toISOString()
      });

      return data;
    },
    onMutate: async (file) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['photos', user?.id] });

      // Snapshot the previous value
      const previousPhotos = queryClient.getQueryData<PhotoMetadata[]>(['photos', user?.id]);

      // Optimistically update with a temporary photo
      if (user) {
        const tempPhoto: PhotoMetadata = {
          id: `temp-${Date.now()}`,
          original_name: file.name,
          file_name: file.name,
          file_path: '',
          file_size: file.size,
          mime_type: file.type,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          url: URL.createObjectURL(file),
        };

        queryClient.setQueryData<PhotoMetadata[]>(['photos', user.id], (old) => 
          [tempPhoto, ...(old || [])]
        );
      }

      return { previousPhotos };
    },
    onError: (error, file, context) => {
      // Rollback on error
      if (context?.previousPhotos && user) {
        queryClient.setQueryData(['photos', user.id], context.previousPhotos);
      }

      // Track failed upload
      posthog.capture('photo_upload_failed', {
        file_name: file.name,
        error_message: error instanceof Error ? error.message : 'Unknown error',
        user_id: user?.id,
      });

      errorLogger.logUploadError('photo_upload', error as Error, {
        name: file.name,
        size: file.size,
        type: file.type
      });

      toast.error('Failed to upload photo');
    },
    onSuccess: (data) => {
      toast.success('Photo uploaded successfully');
      
      // Remove temporary photo and add real one
      if (user) {
        queryClient.setQueryData<PhotoMetadata[]>(['photos', user.id], (old) => {
          const filtered = (old || []).filter(photo => !photo.id.startsWith('temp-'));
          return [data, ...filtered];
        });
      }
    },
    onSettled: () => {
      // Refetch after mutation
      queryClient.invalidateQueries({ queryKey: ['photos', user?.id] });
    },
  });

  // Delete mutation with optimistic updates
  const deleteMutation = useMutation({
    mutationFn: async ({ photoId, filePath }: { photoId: string; filePath: string }) => {
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('user-photos')
        .remove([filePath]);

      if (storageError) throw storageError;

      // Delete from database
      const { error: dbError } = await supabase
        .from('photos')
        .delete()
        .eq('id', photoId);

      if (dbError) throw dbError;

      return photoId;
    },
    onMutate: async ({ photoId }) => {
      await queryClient.cancelQueries({ queryKey: ['photos', user?.id] });

      const previousPhotos = queryClient.getQueryData<PhotoMetadata[]>(['photos', user?.id]);

      // Optimistically remove photo
      if (user) {
        queryClient.setQueryData<PhotoMetadata[]>(['photos', user.id], (old) =>
          (old || []).filter(photo => photo.id !== photoId)
        );
      }

      return { previousPhotos };
    },
    onError: (error, variables, context) => {
      // Rollback on error
      if (context?.previousPhotos && user) {
        queryClient.setQueryData(['photos', user.id], context.previousPhotos);
      }

      errorLogger.logProcessingError('photo_delete', error as Error, {
        photoId: variables.photoId,
        filePath: variables.filePath
      });

      toast.error('Failed to delete photo');
    },
    onSuccess: () => {
      toast.success('Photo deleted successfully');
    },
  });

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

  const uploadPhoto = async (file: File): Promise<boolean> => {
    try {
      await uploadMutation.mutateAsync(file);
      return true;
    } catch (error) {
      return false;
    }
  };

  const deletePhoto = async (photoId: string, filePath: string): Promise<boolean> => {
    try {
      await deleteMutation.mutateAsync({ photoId, filePath });
      return true;
    } catch (error) {
      return false;
    }
  };

  const batchRenamePhotos = async (photosToRename: PhotoMetadata[], pattern: RenamePattern): Promise<boolean> => {
    try {
      setIsRenaming(true);
      let successCount = 0;

      for (let index = 0; index < photosToRename.length; index++) {
        const photo = photosToRename[index];
        
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
        
        const { error } = await supabase
          .from('photos')
          .update({ original_name: newName })
          .eq('id', photo.id);

        if (!error) {
          successCount++;
        }
      }

      if (successCount > 0) {
        toast.success(`Successfully renamed ${successCount} photos`);
        setSelectedPhotos(new Set());
        queryClient.invalidateQueries({ queryKey: ['photos', user?.id] });
      }

      return successCount === photosToRename.length;
    } catch (error) {
      toast.error('Failed to rename photos');
      return false;
    } finally {
      setIsRenaming(false);
    }
  };

  const aiRenamePhoto = async (photoId: string): Promise<boolean> => {
    try {
      const photos = queryClient.getQueryData<PhotoMetadata[]>(['photos', user?.id]) || [];
      const photo = photos.find(p => p.id === photoId);
      if (!photo) throw new Error('Photo not found');

      const { data: signedUrlData, error: urlError } = await supabase.storage
        .from('user-photos')
        .createSignedUrl(photo.file_path, 300);

      if (urlError || !signedUrlData?.signedUrl) {
        throw new Error('Failed to generate signed URL');
      }

      const { data, error } = await supabase.functions.invoke('ai-photo-rename', {
        body: {
          photoId,
          signedUrl: signedUrlData.signedUrl
        }
      });

      if (error || !data?.success) {
        throw new Error(data?.error || 'AI renaming failed');
      }

      toast.success('Photo renamed with AI successfully');
      queryClient.invalidateQueries({ queryKey: ['photos', user?.id] });
      return true;

    } catch (error) {
      errorLogger.logAiError('ai_photo_rename', error as Error, { photoId });
      toast.error('Failed to rename photo with AI');
      return false;
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
    const selectedPhotosList = filteredAndSortedPhotos.filter(photo => 
      selectedPhotos.has(photo.id)
    );
    
    if (selectedPhotosList.length === 0) return false;

    try {
      let successCount = 0;
      for (const photo of selectedPhotosList) {
        const success = await deletePhoto(photo.id, photo.file_path);
        if (success) successCount++;
      }

      if (successCount > 0) {
        setSelectedPhotos(new Set());
        toast.success(`Successfully deleted ${successCount} photos`);
      }

      return successCount === selectedPhotosList.length;
    } catch (error) {
      toast.error('Failed to delete selected photos');
      return false;
    }
  };

  const photos = photosQuery.data || [];
  
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

  const calculateStorageUsed = () => {
    return photos.reduce((total, photo) => total + photo.file_size, 0);
  };

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
          const { data: urlData } = await supabase.storage
            .from('user-photos')
            .createSignedUrl(payload.new.file_path, 3600);

          const newPhoto = {
            ...payload.new,
            url: urlData?.signedUrl || null,
          } as PhotoMetadata;

          queryClient.setQueryData<PhotoMetadata[]>(['photos', user.id], (old) =>
            [newPhoto, ...(old || [])]
          );
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
          const { data: urlData } = await supabase.storage
            .from('user-photos')
            .createSignedUrl(payload.new.file_path, 3600);

          const updatedPhoto = {
            ...payload.new,
            url: urlData?.signedUrl || null,
          } as PhotoMetadata;

          queryClient.setQueryData<PhotoMetadata[]>(['photos', user.id], (old) =>
            (old || []).map(photo => 
              photo.id === updatedPhoto.id ? updatedPhoto : photo
            )
          );
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
          queryClient.setQueryData<PhotoMetadata[]>(['photos', user.id], (old) =>
            (old || []).filter(photo => photo.id !== payload.old.id)
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, queryClient]);

  // Save search preferences to cache when they change
  useEffect(() => {
    if (user) {
      photoCacheManager.setCachedPhotos(user.id, photos, {
        searchTerm,
        sortBy,
        sortOrder,
      });
    }
  }, [user, searchTerm, sortBy, sortOrder, photos]);

  return {
    photos: filteredAndSortedPhotos,
    loading: photosQuery.isLoading || uploadMutation.isPending || deleteMutation.isPending,
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
    fetchPhotos: () => queryClient.invalidateQueries({ queryKey: ['photos', user?.id] }),
    batchRenamePhotos,
    togglePhotoSelection,
    selectAllPhotos,
    clearSelection,
    deleteSelectedPhotos,
    aiRenamePhoto,
  };
};