import React, { useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Upload, RefreshCw, CheckCircle2, X, Trash2, Grid, List } from 'lucide-react';
import { useDragAndDrop } from '@/hooks/useDragAndDrop';
import type { PreviewMode } from '@/types/photoRenamer';

interface FileDropZoneProps {
  onFiles: (files: File[]) => void;
  isProcessing: boolean;
  progress: number;
  fileCount: number;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  onClearAll: () => void;
  previewMode: PreviewMode;
  onPreviewModeChange: (mode: PreviewMode) => void;
}

export const FileDropZone: React.FC<FileDropZoneProps> = ({
  onFiles,
  isProcessing,
  progress,
  fileCount,
  onSelectAll,
  onDeselectAll,
  onClearAll,
  previewMode,
  onPreviewModeChange,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);

  const { isDragging, handleDragOver, handleDragLeave, handleDrop } = useDragAndDrop(onFiles);

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      onFiles(Array.from(e.target.files));
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div
          ref={dropZoneRef}
          className={`relative border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
            isDragging 
              ? 'border-primary bg-primary/5' 
              : 'border-muted-foreground/25 hover:border-primary/50'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={(e) => handleDragLeave(e, dropZoneRef)}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            onChange={handleFileInputChange}
          />
          
          <div className="flex flex-col items-center gap-4">
            <div className="rounded-full bg-primary/10 p-4">
              <Upload className="w-8 h-8 text-primary" />
            </div>
            
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Drop your photos here</h3>
              <p className="text-muted-foreground">
                or{' '}
                <Button
                  variant="ghost"
                  className="p-0 h-auto text-primary hover:text-primary/80"
                  onClick={() => fileInputRef.current?.click()}
                >
                  browse files
                </Button>
              </p>
              <p className="text-sm text-muted-foreground">
                Supports JPG, PNG, GIF, WebP and more
              </p>
            </div>
          </div>

          {isProcessing && (
            <div className="absolute inset-0 bg-background/80 flex items-center justify-center rounded-lg">
              <div className="text-center space-y-2">
                <RefreshCw className="w-6 h-6 animate-spin mx-auto text-primary" />
                <p className="text-sm">Processing files...</p>
                <Progress value={progress} className="w-48" />
              </div>
            </div>
          )}
        </div>

        {fileCount > 0 && (
          <div className="mt-6 flex flex-wrap gap-2 justify-between items-center">
            <div className="flex gap-2">
              <Button onClick={onSelectAll} variant="ghost" size="sm">
                <CheckCircle2 className="w-4 h-4" />
                Select All
              </Button>
              <Button onClick={onDeselectAll} variant="ghost" size="sm">
                <X className="w-4 h-4" />
                Deselect All
              </Button>
              <Button onClick={onClearAll} variant="ghost" size="sm">
                <Trash2 className="w-4 h-4" />
                Clear All
              </Button>
            </div>
            
            <div className="flex gap-2 items-center">
              <Label className="text-sm">View:</Label>
              <Button
                variant={previewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => onPreviewModeChange('grid')}
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={previewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => onPreviewModeChange('list')}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};