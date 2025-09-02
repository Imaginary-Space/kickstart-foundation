import { useCallback, useState } from 'react';

export const useDragAndDrop = (onFileDrop: (files: File[]) => void) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent, dropZoneRef: React.RefObject<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!dropZoneRef.current?.contains(e.relatedTarget as Node)) {
      setIsDragging(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    onFileDrop(droppedFiles);
  }, [onFileDrop]);

  return {
    isDragging,
    handleDragOver,
    handleDragLeave,
    handleDrop,
  };
};