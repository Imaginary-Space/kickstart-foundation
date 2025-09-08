import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import type { 
  PhotoFile, 
  RenamePattern, 
  RenameHistory, 
  PreviewMode, 
  SortBy, 
  SortOrder, 
  FilterType 
} from '@/types/photoRenamer';
import { createImagePreview, getImageDimensions } from '@/utils/fileProcessing';
import { generateNewName } from '@/utils/fileNaming';

const defaultPattern: RenamePattern = {
  prefix: '',
  suffix: '',
  numberFormat: 'sequential',
  startNumber: 1,
  dateFormat: 'YYYY-MM-DD',
  caseTransform: 'none',
  separator: 'none',
  removeSpaces: true,
  removeSpecialChars: true
};

export const usePhotoRenamer = () => {
  const [files, setFiles] = useState<PhotoFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set());
  const [previewMode, setPreviewMode] = useState<PreviewMode>('grid');
  const [showPreview, setShowPreview] = useState(true);
  const [sortBy, setSortBy] = useState<SortBy>('name');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [history, setHistory] = useState<RenameHistory[]>([]);
  const [currentHistoryIndex, setCurrentHistoryIndex] = useState(-1);
  const [pattern, setPattern] = useState<RenamePattern>(defaultPattern);

  const handleFiles = useCallback(async (fileList: File[]) => {
    const imageFiles = fileList.filter(file => file.type.startsWith('image/'));
    
    if (imageFiles.length === 0) {
      toast.error("Please drop image files only");
      return;
    }

    setIsProcessing(true);
    setProgress(0);

    const newFiles: PhotoFile[] = [];
    
    for (let i = 0; i < imageFiles.length; i++) {
      const file = imageFiles[i];
      const id = `${Date.now()}-${Math.random()}`;
      
      try {
        const preview = await createImagePreview(file);
        const dimensions = await getImageDimensions(file);
        
        const photoFile: PhotoFile = {
          id,
          file,
          originalName: file.name,
          newName: file.name,
          preview,
          size: file.size,
          lastModified: file.lastModified,
          dimensions,
          processed: false,
          selected: true
        };

        newFiles.push(photoFile);
        setProgress(((i + 1) / imageFiles.length) * 100);
      } catch (error) {
        console.error('Error processing file:', error);
        const errorFile: PhotoFile = {
          id,
          file,
          originalName: file.name,
          newName: file.name,
          preview: '',
          size: file.size,
          lastModified: file.lastModified,
          processed: false,
          error: 'Failed to process image',
          selected: false
        };
        newFiles.push(errorFile);
      }
    }

    setFiles(prev => [...prev, ...newFiles]);
    setSelectedFiles(new Set(newFiles.filter(f => f.selected).map(f => f.id)));
    setIsProcessing(false);
    setProgress(0);
    
    toast.success(`Successfully loaded ${newFiles.length} images`);
  }, []);

  const applyRenaming = useCallback(() => {
    const selectedFileIds = Array.from(selectedFiles);
    const selectedFileObjects = files.filter(f => selectedFileIds.includes(f.id));
    
    if (selectedFileObjects.length === 0) {
      toast.error("Please select files to rename");
      return;
    }

    const renamedFiles = selectedFileObjects.map((file, index) => {
      const newName = generateNewName(file, index, pattern);
      return { ...file, newName, processed: true };
    });

    // Add to history
    const historyEntry: RenameHistory = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      action: `Renamed ${renamedFiles.length} files`,
      files: renamedFiles.map(f => ({ oldName: f.originalName, newName: f.newName }))
    };

    setHistory(prev => [...prev.slice(0, currentHistoryIndex + 1), historyEntry]);
    setCurrentHistoryIndex(prev => prev + 1);

    // Update files
    setFiles(prev => prev.map(file => {
      const renamedFile = renamedFiles.find(rf => rf.id === file.id);
      return renamedFile || file;
    }));

    toast.success(`Successfully renamed ${renamedFiles.length} files`);
  }, [files, selectedFiles, pattern, currentHistoryIndex]);

  const removeFile = useCallback((id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
    setSelectedFiles(prev => {
      const newSet = new Set(prev);
      newSet.delete(id);
      return newSet;
    });
    toast.success("File removed");
  }, []);

  const clearAllFiles = useCallback(() => {
    setFiles([]);
    setSelectedFiles(new Set());
    setHistory([]);
    setCurrentHistoryIndex(-1);
    toast.success("All files cleared");
  }, []);

  const toggleFileSelection = useCallback((id: string) => {
    setSelectedFiles(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  }, []);

  const selectAllFiles = useCallback(() => {
    setSelectedFiles(new Set(files.map(f => f.id)));
  }, [files]);

  const deselectAllFiles = useCallback(() => {
    setSelectedFiles(new Set());
  }, []);

  const downloadRenamedFiles = useCallback(async () => {
    const processedFiles = files.filter(f => f.processed && selectedFiles.has(f.id));
    
    if (processedFiles.length === 0) {
      toast.error("No processed files to download");
      return;
    }

    for (const file of processedFiles) {
      const link = document.createElement('a');
      link.href = file.preview;
      link.download = file.newName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Small delay between downloads
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    toast.success(`Downloaded ${processedFiles.length} files`);
  }, [files, selectedFiles]);

  return {
    // State
    files,
    isProcessing,
    progress,
    selectedFiles,
    previewMode,
    showPreview,
    sortBy,
    sortOrder,
    filterType,
    history,
    pattern,
    
    // Actions
    handleFiles,
    applyRenaming,
    removeFile,
    clearAllFiles,
    toggleFileSelection,
    selectAllFiles,
    deselectAllFiles,
    downloadRenamedFiles,
    
    // Setters
    setPreviewMode,
    setShowPreview,
    setSortBy,
    setSortOrder,
    setFilterType,
    setPattern,
  };
};