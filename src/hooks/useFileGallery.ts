import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { errorLogger } from '@/utils/errorLogger';

export interface FileMetadata {
  id: string;
  user_id: string;
  original_name: string;
  file_name: string;
  file_path: string;
  file_size: number;
  mime_type: string;
  created_at: string;
  updated_at: string;
  url?: string;
}

export const useFileGallery = () => {
  const { user } = useAuth();
  const [files, setFiles] = useState<FileMetadata[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'size'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set());
  const [storageUsed, setStorageUsed] = useState<number>(0);

  const uploadFile = async (file: File): Promise<boolean> => {
    if (!user) {
      toast.error('You must be logged in to upload files');
      return false;
    }

    try {
      setLoading(true);
      
      // Create unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      // Upload to storage
      const { error: uploadError } = await supabase.storage
        .from('user-files')
        .upload(filePath, file);

      if (uploadError) {
        console.error('Upload error:', uploadError);
        
        // Log the error
        await errorLogger.logUploadError('file_upload', uploadError, {
          name: file.name,
          size: file.size,
          type: file.type
        });

        toast.error('Failed to upload file');
        return false;
      }

      // Save metadata to database
      const { error: dbError } = await supabase
        .from('files')
        .insert({
          user_id: user.id,
          original_name: file.name,
          file_name: fileName,
          file_path: filePath,
          file_size: file.size,
          mime_type: file.type || 'application/octet-stream',
        });

      if (dbError) {
        console.error('Database error:', dbError);
        
        // Log the error
        await errorLogger.logProcessingError('file_metadata_save', dbError, {
          fileName,
          filePath
        });

        // Try to clean up the uploaded file
        await supabase.storage.from('user-files').remove([filePath]);
        toast.error('Failed to save file metadata');
        return false;
      }

      toast.success('File uploaded successfully');
      await fetchFiles(); // Refresh the files list
      return true;
    } catch (error) {
      console.error('Error uploading file:', error);
      
      // Log the error
      await errorLogger.logUploadError('file_upload_general', error as Error, {
        name: file.name,
        size: file.size,
        type: file.type
      });

      toast.error('An error occurred while uploading');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteFile = async (fileId: string, filePath: string) => {
    if (!user) return;

    try {
      setLoading(true);
      
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('user-files')
        .remove([filePath]);

      if (storageError) {
        console.error('Storage delete error:', storageError);
        toast.error('Failed to delete file from storage');
        return;
      }

      // Delete from database
      const { error: dbError } = await supabase
        .from('files')
        .delete()
        .eq('id', fileId);

      if (dbError) {
        console.error('Database delete error:', dbError);
        toast.error('Failed to delete file metadata');
        return;
      }

      toast.success('File deleted successfully');
      await fetchFiles(); // Refresh the files list
    } catch (error) {
      console.error('Error deleting file:', error);
      
      // Log the error
      await errorLogger.logProcessingError('file_delete', error as Error, {
        fileId,
        filePath
      });

      toast.error('An error occurred while deleting');
    } finally {
      setLoading(false);
    }
  };

  const toggleFileSelection = (fileId: string) => {
    setSelectedFiles(prev => {
      const newSet = new Set(prev);
      if (newSet.has(fileId)) {
        newSet.delete(fileId);
      } else {
        newSet.add(fileId);
      }
      return newSet;
    });
  };

  const selectAllFiles = () => {
    setSelectedFiles(new Set(filteredAndSortedFiles.map(file => file.id)));
  };

  const clearSelection = () => {
    setSelectedFiles(new Set());
  };

  const deleteSelectedFiles = async () => {
    if (selectedFiles.size === 0) return;
    
    if (!window.confirm(`Are you sure you want to delete ${selectedFiles.size} file(s)?`)) {
      return;
    }

    const filesToDelete = files.filter(file => selectedFiles.has(file.id));
    
    try {
      setLoading(true);
      
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('user-files')
        .remove(filesToDelete.map(file => file.file_path));

      if (storageError) {
        console.error('Batch storage delete error:', storageError);
        toast.error('Failed to delete some files from storage');
        return;
      }

      // Delete from database
      const { error: dbError } = await supabase
        .from('files')
        .delete()
        .in('id', filesToDelete.map(file => file.id));

      if (dbError) {
        console.error('Batch database delete error:', dbError);
        toast.error('Failed to delete file metadata');
        return;
      }

      toast.success(`Deleted ${filesToDelete.length} file(s) successfully`);
      setSelectedFiles(new Set());
      await fetchFiles();
    } catch (error) {
      console.error('Error in batch delete:', error);
      toast.error('An error occurred during batch deletion');
    } finally {
      setLoading(false);
    }
  };

  const calculateStorageUsed = () => {
    return files.reduce((total, file) => total + (file.file_size || 0), 0);
  };

  const fetchFiles = async () => {
    if (!user) return;

    try {
      setLoading(true);
      
      const { data: fileList, error } = await supabase
        .from('files')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching files:', error);
        toast.error('Failed to fetch files');
        return;
      }

      // Generate signed URLs for each file
      const filesWithUrls = await Promise.all(
        (fileList || []).map(async (file) => {
          const { data } = supabase.storage
            .from('user-files')
            .getPublicUrl(file.file_path);

          return {
            ...file,
            url: data.publicUrl,
          };
        })
      );

      setFiles(filesWithUrls);
    } catch (error) {
      console.error('Error in fetchFiles:', error);
      toast.error('Failed to load files');
    } finally {
      setLoading(false);
    }
  };

  // Filter and sort files
  const filteredAndSortedFiles = files
    .filter(file => 
      file.original_name.toLowerCase().includes(searchTerm.toLowerCase())
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
          comparison = (a.file_size || 0) - (b.file_size || 0);
          break;
      }
      
      return sortOrder === 'desc' ? -comparison : comparison;
    });

  // Fetch files when user changes
  useEffect(() => {
    if (user) {
      fetchFiles();
    }
  }, [user]);

  // Update storage used when files change
  useEffect(() => {
    setStorageUsed(calculateStorageUsed());
  }, [files]);

  return {
    files: filteredAndSortedFiles,
    loading,
    searchTerm,
    setSearchTerm,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    selectedFiles,
    storageUsed,
    uploadFile,
    deleteFile,
    toggleFileSelection,
    selectAllFiles,
    clearSelection,
    deleteSelectedFiles,
  };
};