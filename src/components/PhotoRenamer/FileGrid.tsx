import React, { useMemo } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, Download, Trash2, AlertCircle, Image as ImageIcon } from 'lucide-react';
import type { PhotoFile, PreviewMode, FilterType } from '@/types/photoRenamer';
import { formatFileSize } from '@/utils/fileProcessing';

interface FileGridProps {
  files: PhotoFile[];
  selectedFiles: Set<string>;
  previewMode: PreviewMode;
  filterType: FilterType;
  onToggleSelection: (id: string) => void;
  onRemoveFile: (id: string) => void;
  onDownload: () => void;
  onFilterChange: (filter: FilterType) => void;
}

export const FileGrid: React.FC<FileGridProps> = ({
  files,
  selectedFiles,
  previewMode,
  filterType,
  onToggleSelection,
  onRemoveFile,
  onDownload,
  onFilterChange,
}) => {
  const filteredFiles = useMemo(() => {
    switch (filterType) {
      case 'processed':
        return files.filter(f => f.processed);
      case 'unprocessed':
        return files.filter(f => !f.processed);
      case 'errors':
        return files.filter(f => f.error);
      default:
        return files;
    }
  }, [files, filterType]);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Files Preview</CardTitle>
        <div className="flex gap-2 items-center">
          <Select value={filterType} onValueChange={onFilterChange}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Files</SelectItem>
              <SelectItem value="processed">Processed</SelectItem>
              <SelectItem value="unprocessed">Unprocessed</SelectItem>
              <SelectItem value="errors">Errors</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="ghost" size="sm" onClick={onDownload}>
            <Download className="w-4 h-4" />
            Download Selected
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        <ScrollArea className="h-96">
          {filteredFiles.length === 0 ? (
            <div className="text-center py-12">
              <ImageIcon className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No files to display</p>
            </div>
          ) : (
            <div className={previewMode === 'grid' ? 'grid grid-cols-2 md:grid-cols-4 gap-4' : 'space-y-2'}>
              {filteredFiles.map((file) => (
                <FileItem
                  key={file.id}
                  file={file}
                  isSelected={selectedFiles.has(file.id)}
                  previewMode={previewMode}
                  onToggleSelection={onToggleSelection}
                  onRemove={onRemoveFile}
                />
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

interface FileItemProps {
  file: PhotoFile;
  isSelected: boolean;
  previewMode: PreviewMode;
  onToggleSelection: (id: string) => void;
  onRemove: (id: string) => void;
}

const FileItem: React.FC<FileItemProps> = ({
  file,
  isSelected,
  previewMode,
  onToggleSelection,
  onRemove,
}) => {
  const handleClick = () => onToggleSelection(file.id);
  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onRemove(file.id);
  };

  if (previewMode === 'grid') {
    return (
      <div
        className={`border rounded-lg p-3 cursor-pointer transition-colors ${
          isSelected 
            ? 'border-primary bg-primary/5' 
            : 'border-border hover:border-primary/50'
        }`}
        onClick={handleClick}
      >
        <div className="space-y-2">
          <div className="aspect-square relative rounded overflow-hidden bg-muted">
            {file.preview ? (
              <img
                src={file.preview}
                alt={file.originalName}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-destructive" />
              </div>
            )}
            
            <div className="absolute top-2 right-2">
              <Button
                size="sm"
                variant="ghost"
                className="h-6 w-6 p-0 bg-background/80 hover:bg-background"
                onClick={handleRemove}
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
          </div>
          
          <div className="space-y-1">
            <p className="text-xs font-medium truncate" title={file.originalName}>
              {file.originalName}
            </p>
            {file.processed && (
              <p className="text-xs text-primary truncate" title={file.newName}>
                → {file.newName}
              </p>
            )}
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <span>{formatFileSize(file.size)}</span>
              {file.dimensions && (
                <span>• {file.dimensions.width}×{file.dimensions.height}</span>
              )}
            </div>
            {file.error && (
              <p className="text-xs text-destructive">{file.error}</p>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`border rounded-lg p-3 cursor-pointer transition-colors flex items-center gap-4 ${
        isSelected 
          ? 'border-primary bg-primary/5' 
          : 'border-border hover:border-primary/50'
      }`}
      onClick={handleClick}
    >
      <div className="w-16 h-16 rounded overflow-hidden bg-muted flex-shrink-0">
        {file.preview ? (
          <img
            src={file.preview}
            alt={file.originalName}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <AlertCircle className="w-4 h-4 text-destructive" />
          </div>
        )}
      </div>
      
      <div className="flex-1 min-w-0">
        <p className="font-medium truncate" title={file.originalName}>
          {file.originalName}
        </p>
        {file.processed && (
          <p className="text-sm text-primary truncate" title={file.newName}>
            → {file.newName}
          </p>
        )}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>{formatFileSize(file.size)}</span>
          {file.dimensions && (
            <span>• {file.dimensions.width}×{file.dimensions.height}</span>
          )}
          <Badge variant={file.processed ? "default" : "secondary"} className="text-xs">
            {file.processed ? "Renamed" : "Original"}
          </Badge>
        </div>
        {file.error && (
          <p className="text-sm text-destructive mt-1">{file.error}</p>
        )}
      </div>
      
      <Button
        size="sm"
        variant="ghost"
        onClick={handleRemove}
      >
        <Trash2 className="w-4 h-4" />
      </Button>
    </div>
  );
};