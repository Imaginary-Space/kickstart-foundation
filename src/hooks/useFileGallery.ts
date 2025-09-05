import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface FileMetadata {
  id: string;
  name: string;
  bucket_id?: string;
  owner?: string;
  created_at: string;
  updated_at: string;
  last_accessed_at?: string | null;
  metadata?: Record<string, any> | null;
  size?: number;
  mimetype?: string | null;
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
        toast.error('Failed to upload file');
        return false;
      }

      toast.success('File uploaded successfully');
      await fetchFiles(); // Refresh the files list
      return true;
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error('An error occurred while uploading');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteFile = async (filePath: string) => {
    if (!user) return;

    try {
      setLoading(true);
      
      const { error } = await supabase.storage
        .from('user-files')
        .remove([filePath]);

      if (error) {
        console.error('Delete error:', error);
        toast.error('Failed to delete file');
        return;
      }

      toast.success('File deleted successfully');
      await fetchFiles(); // Refresh the files list
    } catch (error) {
      console.error('Error deleting file:', error);
      toast.error('An error occurred while deleting');
    } finally {
      setLoading(false);
    }
  };

  const toggleFileSelection = (fileName: string) => {
    setSelectedFiles(prev => {
      const newSet = new Set(prev);
      if (newSet.has(fileName)) {
        newSet.delete(fileName);
      } else {
        newSet.add(fileName);
      }
      return newSet;
    });
  };

  const selectAllFiles = () => {
    setSelectedFiles(new Set(filteredAndSortedFiles.map(file => file.name)));
  };

  const clearSelection = () => {
    setSelectedFiles(new Set());
  };

  const deleteSelectedFiles = async () => {
    if (selectedFiles.size === 0) return;
    
    if (!window.confirm(`Are you sure you want to delete ${selectedFiles.size} file(s)?`)) {
      return;
    }

    const filesToDelete = files.filter(file => selectedFiles.has(file.name));
    
    try {
      setLoading(true);
      
      const { error } = await supabase.storage
        .from('user-files')
        .remove(filesToDelete.map(file => file.name));

      if (error) {
        console.error('Batch delete error:', error);
        toast.error('Failed to delete some files');
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
    return files.reduce((total, file) => total + (file.size || 0), 0);
  };

  const fetchFiles = async () => {
    if (!user) return;

    try {
      setLoading(true);
      
      const { data: fileList, error } = await supabase.storage
        .from('user-files')
        .list(user.id, {
          limit: 100,
          offset: 0
        });

      if (error) {
        console.error('Error fetching files:', error);
        toast.error('Failed to fetch files');
        return;
      }

      // Generate signed URLs for each file
      const filesWithUrls = await Promise.all(
        (fileList || []).map(async (file) => {
          const filePath = `${user.id}/${file.name}`;
          
          const { data } = supabase.storage
            .from('user-files')
            .getPublicUrl(filePath);

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
      file.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'date':
          comparison = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
          break;
        case 'size':
          comparison = (a.size || 0) - (b.size || 0);
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