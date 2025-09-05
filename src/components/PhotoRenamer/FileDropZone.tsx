import React, { useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Button as MovingBorderButton } from "@/components/ui/moving-border";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Upload, RefreshCw, CheckCircle2, X, Trash2, Grid, List, ImageIcon, Sparkles, Camera } from 'lucide-react';
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
    <Card className="glass-card overflow-hidden border-0">
      <CardContent className="p-0">
        <div
          ref={dropZoneRef}
          className={`relative min-h-[300px] transition-all duration-300 ease-in-out ${
            isDragging 
              ? 'glass border-primary/50 bg-primary/5' 
              : 'glass hover:bg-background/10'
          } border-2 border-dashed ${
            isDragging ? 'border-primary' : 'border-border/30 hover:border-primary/50'
          } m-6 rounded-xl cursor-pointer group`}
          onDragOver={handleDragOver}
          onDragLeave={(e) => handleDragLeave(e, dropZoneRef)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            onChange={handleFileInputChange}
          />
          
          <div className="flex flex-col items-center justify-center h-full py-12 px-8">
            {/* Animated Icon Stack */}
            <div className="relative mb-6">
              <div className={`rounded-full glass p-6 shadow-glow transition-transform duration-300 ${
                isDragging ? 'scale-110' : 'group-hover:scale-105'
              }`}>
                <div className="relative">
                  <Camera className="w-10 h-10 text-primary" />
                  <Sparkles className="w-4 h-4 text-secondary absolute -top-1 -right-1 animate-pulse" />
                </div>
              </div>
              
              {/* Floating Icons */}
              <ImageIcon className="w-5 h-5 text-primary/60 absolute -top-2 -left-2 animate-bounce" style={{ animationDelay: '0.5s' }} />
              <Upload className="w-4 h-4 text-secondary/60 absolute -bottom-1 -right-3 animate-bounce" style={{ animationDelay: '1s' }} />
            </div>
            
            {/* Main Content */}
            <div className="text-center space-y-4 max-w-md">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                {isDragging ? "Drop your photos!" : "Upload Your Photos"}
              </h3>
              
              <p className="text-lg text-muted-foreground">
                {isDragging ? (
                  <span className="text-primary font-medium">Release to add your images ✨</span>
                ) : (
                  <>
                    Drag & drop your images here, or{' '}
                    <span className="text-primary font-medium cursor-pointer hover:underline">
                      click to browse
                    </span>
                  </>
                )}
              </p>
              
              <div className="flex flex-wrap items-center justify-center gap-3 text-sm text-muted-foreground">
                <Badge variant="secondary" className="glass border-0">
                  <Camera className="w-3 h-3 mr-1" />
                  JPG
                </Badge>
                <Badge variant="secondary" className="glass border-0">
                  <ImageIcon className="w-3 h-3 mr-1" />
                  PNG
                </Badge>
                <Badge variant="secondary" className="glass border-0">
                  <Sparkles className="w-3 h-3 mr-1" />
                  GIF & More
                </Badge>
              </div>
              
              {!isDragging && (
                <div className="pt-2">
                  <MovingBorderButton
                    borderRadius="1.75rem"
                    className="bg-white dark:bg-slate-900 text-black dark:text-white border-neutral-200 dark:border-slate-800"
                    onClick={(e) => {
                      e.stopPropagation();
                      fileInputRef.current?.click();
                    }}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Choose Files
                  </MovingBorderButton>
                </div>
              )}
            </div>
          </div>

          {/* Processing Overlay */}
          {isProcessing && (
            <div className="absolute inset-0 glass flex items-center justify-center rounded-xl">
              <div className="text-center space-y-4 p-8">
                <div className="relative">
                  <div className="rounded-full glass p-4 shadow-glow">
                    <RefreshCw className="w-8 h-8 animate-spin text-primary" />
                  </div>
                  <Sparkles className="w-4 h-4 text-primary absolute -top-1 -right-1 animate-pulse" />
                </div>
                <div className="space-y-2">
                  <p className="text-lg font-semibold text-primary">Processing your images...</p>
                  <p className="text-sm text-muted-foreground">This won't take long ✨</p>
                </div>
                <Progress value={progress} className="w-64 h-2" />
                <p className="text-xs text-muted-foreground">{Math.round(progress)}% complete</p>
              </div>
            </div>
          )}
        </div>

        {fileCount > 0 && (
          <div className="px-6 pb-6 pt-0">
            <div className="flex flex-wrap gap-3 justify-between items-center p-4 glass rounded-lg border-0">
              <div className="flex gap-2">
                <Button onClick={onSelectAll} variant="ghost" size="sm" className="glass border-0 hover:bg-primary/10">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  <div className="w-px h-4 bg-border mx-1"></div>
                  Select All
                </Button>
                <Button onClick={onDeselectAll} variant="ghost" size="sm" className="glass border-0 hover:bg-secondary/10">
                  <X className="w-4 h-4 text-foreground" />
                  <div className="w-px h-4 bg-border mx-1"></div>
                  Deselect All
                </Button>
                <Button onClick={onClearAll} variant="ghost" size="sm" className="glass border-0 hover:bg-destructive/10">
                  <Trash2 className="w-4 h-4 text-destructive" />
                  <div className="w-px h-4 bg-border mx-1"></div>
                  Clear All
                </Button>
              </div>
              
              <div className="flex gap-2 items-center">
                <Label className="text-sm font-medium text-muted-foreground">View:</Label>
                <Button
                  variant={previewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => onPreviewModeChange('grid')}
                  className={previewMode === 'grid' ? '' : 'glass border-0 hover:bg-primary/10'}
                >
                  <Grid className="w-4 h-4" />
                  {previewMode === 'grid' && <div className="w-px h-4 bg-border mx-1"></div>}
                  Grid
                </Button>
                <Button
                  variant={previewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => onPreviewModeChange('list')}
                  className={previewMode === 'list' ? '' : 'glass border-0 hover:bg-primary/10'}
                >
                  <List className="w-4 h-4" />
                  {previewMode === 'list' && <div className="w-px h-4 bg-border mx-1"></div>}
                  List
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};