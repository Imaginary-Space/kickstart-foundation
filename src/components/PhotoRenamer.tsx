import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { 
  Upload, 
  X, 
  Download, 
  Eye, 
  EyeOff, 
  FileImage, 
  Trash2, 
  RotateCw, 
  Copy, 
  Settings, 
  RefreshCw,
  Calendar,
  Hash,
  Type,
  Shuffle,
  CheckCircle2,
  AlertCircle,
  Image as ImageIcon,
  FolderOpen,
  Save,
  Undo2,
  Redo2,
  Filter,
  SortAsc,
  Grid,
  List
} from 'lucide-react';

interface PhotoFile {
  id: string;
  file: File;
  originalName: string;
  newName: string;
  preview: string;
  size: number;
  lastModified: number;
  dimensions?: { width: number; height: number };
  processed: boolean;
  error?: string;
  selected: boolean;
}

interface RenamePattern {
  prefix: string;
  suffix: string;
  numberFormat: 'sequential' | 'random' | 'timestamp' | 'none';
  startNumber: number;
  dateFormat: string;
  caseTransform: 'none' | 'lowercase' | 'uppercase' | 'capitalize';
  separator: string;
  removeSpaces: boolean;
  removeSpecialChars: boolean;
}

interface RenameHistory {
  id: string;
  timestamp: number;
  action: string;
  files: Array<{ oldName: string; newName: string }>;
}

export const PhotoRenamer: React.FC = () => {
  const [files, setFiles] = useState<PhotoFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set());
  const [previewMode, setPreviewMode] = useState<'grid' | 'list'>('grid');
  const [showPreview, setShowPreview] = useState(true);
  const [sortBy, setSortBy] = useState<'name' | 'size' | 'date'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [filterType, setFilterType] = useState<'all' | 'processed' | 'unprocessed' | 'errors'>('all');
  const [history, setHistory] = useState<RenameHistory[]>([]);
  const [currentHistoryIndex, setCurrentHistoryIndex] = useState(-1);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);

  const [pattern, setPattern] = useState<RenamePattern>({
    prefix: '',
    suffix: '',
    numberFormat: 'sequential',
    startNumber: 1,
    dateFormat: 'YYYY-MM-DD',
    caseTransform: 'none',
    separator: '_',
    removeSpaces: true,
    removeSpecialChars: true
  });

  // Drag and Drop Handlers
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
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
    handleFiles(droppedFiles);
  }, []);

  // File Processing
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

  const createImagePreview = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
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

  // Renaming Logic
  const generateNewName = useCallback((file: PhotoFile, index: number): string => {
    let newName = '';
    
    // Add prefix
    if (pattern.prefix) {
      newName += pattern.prefix;
    }

    // Add separator if we have a prefix and will add more content
    if (newName && (pattern.numberFormat !== 'none' || pattern.suffix)) {
      newName += pattern.separator;
    }

    // Add numbering/dating
    switch (pattern.numberFormat) {
      case 'sequential':
        newName += (pattern.startNumber + index).toString().padStart(3, '0');
        break;
      case 'random':
        newName += Math.random().toString(36).substr(2, 6).toUpperCase();
        break;
      case 'timestamp':
        const date = new Date(file.lastModified);
        newName += date.toISOString().replace(/[:.]/g, '-').split('T')[0];
        break;
      case 'none':
      default:
        // Keep original name without extension
        const originalWithoutExt = file.originalName.replace(/\.[^/.]+$/, '');
        newName += originalWithoutExt;
        break;
    }

    // Add separator if we have content and will add suffix
    if (newName && pattern.suffix) {
      newName += pattern.separator;
    }

    // Add suffix
    if (pattern.suffix) {
      newName += pattern.suffix;
    }

    // Apply transformations
    if (pattern.removeSpaces) {
      newName = newName.replace(/\s+/g, pattern.separator);
    }

    if (pattern.removeSpecialChars) {
      newName = newName.replace(/[^a-zA-Z0-9._-]/g, '');
    }

    // Apply case transform
    switch (pattern.caseTransform) {
      case 'lowercase':
        newName = newName.toLowerCase();
        break;
      case 'uppercase':
        newName = newName.toUpperCase();
        break;
      case 'capitalize':
        newName = newName.split(pattern.separator)
          .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
          .join(pattern.separator);
        break;
    }

    // Add original extension
    const extension = file.originalName.split('.').pop();
    if (extension) {
      newName += '.' + extension;
    }

    return newName || file.originalName;
  }, [pattern]);

  const applyRenaming = useCallback(() => {
    const selectedFileIds = Array.from(selectedFiles);
    const selectedFileObjects = files.filter(f => selectedFileIds.includes(f.id));
    
    if (selectedFileObjects.length === 0) {
      toast.error("Please select files to rename");
      return;
    }

    const renamedFiles = selectedFileObjects.map((file, index) => {
      const newName = generateNewName(file, index);
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
  }, [files, selectedFiles, generateNewName, currentHistoryIndex]);

  // File Management
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

  // Preview and Export
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

  // Filtering and Sorting
  const filteredAndSortedFiles = React.useMemo(() => {
    let filtered = files;

    // Apply filter
    switch (filterType) {
      case 'processed':
        filtered = files.filter(f => f.processed);
        break;
      case 'unprocessed':
        filtered = files.filter(f => !f.processed);
        break;
      case 'errors':
        filtered = files.filter(f => f.error);
        break;
    }

    // Apply sort
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'name':
          comparison = a.originalName.localeCompare(b.originalName);
          break;
        case 'size':
          comparison = a.size - b.size;
          break;
        case 'date':
          comparison = a.lastModified - b.lastModified;
          break;
      }

      return sortOrder === 'desc' ? -comparison : comparison;
    });

    return filtered;
  }, [files, filterType, sortBy, sortOrder]);

  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileImage className="w-6 h-6 text-primary" />
            Photo Renamer
            <Badge variant="secondary" className="ml-2">
              {files.length} files
            </Badge>
          </CardTitle>
        </CardHeader>
      </Card>

      <Tabs defaultValue="upload" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="upload">Upload</TabsTrigger>
          <TabsTrigger value="rename">Rename</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        {/* Upload Tab */}
        <TabsContent value="upload" className="space-y-4">
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
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => e.target.files && handleFiles(Array.from(e.target.files))}
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

              {files.length > 0 && (
                <div className="mt-6 flex flex-wrap gap-2 justify-between items-center">
                  <div className="flex gap-2">
                    <Button onClick={selectAllFiles} variant="ghost" size="sm">
                      <CheckCircle2 className="w-4 h-4" />
                      Select All
                    </Button>
                    <Button onClick={deselectAllFiles} variant="ghost" size="sm">
                      <X className="w-4 h-4" />
                      Deselect All
                    </Button>
                    <Button onClick={clearAllFiles} variant="ghost" size="sm">
                      <Trash2 className="w-4 h-4" />
                      Clear All
                    </Button>
                  </div>
                  
                  <div className="flex gap-2 items-center">
                    <Label className="text-sm">View:</Label>
                    <Button
                      variant={previewMode === 'grid' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setPreviewMode('grid')}
                    >
                      <Grid className="w-4 h-4" />
                    </Button>
                    <Button
                      variant={previewMode === 'list' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setPreviewMode('list')}
                    >
                      <List className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Rename Tab */}
        <TabsContent value="rename" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Rename Pattern</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="prefix">Prefix</Label>
                  <Input
                    id="prefix"
                    value={pattern.prefix}
                    onChange={(e) => setPattern(prev => ({ ...prev, prefix: e.target.value }))}
                    placeholder="e.g., vacation, photo"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="suffix">Suffix</Label>
                  <Input
                    id="suffix"
                    value={pattern.suffix}
                    onChange={(e) => setPattern(prev => ({ ...prev, suffix: e.target.value }))}
                    placeholder="e.g., edited, final"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Number Format</Label>
                  <Select
                    value={pattern.numberFormat}
                    onValueChange={(value: any) => setPattern(prev => ({ ...prev, numberFormat: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      <SelectItem value="sequential">Sequential (001, 002...)</SelectItem>
                      <SelectItem value="random">Random (ABC123)</SelectItem>
                      <SelectItem value="timestamp">Timestamp</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="startNumber">Start Number</Label>
                  <Input
                    id="startNumber"
                    type="number"
                    value={pattern.startNumber}
                    onChange={(e) => setPattern(prev => ({ ...prev, startNumber: parseInt(e.target.value) || 1 }))}
                    disabled={pattern.numberFormat !== 'sequential'}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="separator">Separator</Label>
                  <Select
                    value={pattern.separator}
                    onValueChange={(value) => setPattern(prev => ({ ...prev, separator: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="_">Underscore (_)</SelectItem>
                      <SelectItem value="-">Hyphen (-)</SelectItem>
                      <SelectItem value=".">Dot (.)</SelectItem>
                      <SelectItem value=" ">Space ( )</SelectItem>
                      <SelectItem value="">None</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Case Transform</Label>
                  <Select
                    value={pattern.caseTransform}
                    onValueChange={(value: any) => setPattern(prev => ({ ...prev, caseTransform: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Keep Original</SelectItem>
                      <SelectItem value="lowercase">lowercase</SelectItem>
                      <SelectItem value="uppercase">UPPERCASE</SelectItem>
                      <SelectItem value="capitalize">Capitalize Words</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="removeSpaces"
                      checked={pattern.removeSpaces}
                      onCheckedChange={(checked) => 
                        setPattern(prev => ({ ...prev, removeSpaces: !!checked }))
                      }
                    />
                    <Label htmlFor="removeSpaces">Remove spaces</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="removeSpecialChars"
                      checked={pattern.removeSpecialChars}
                      onCheckedChange={(checked) => 
                        setPattern(prev => ({ ...prev, removeSpecialChars: !!checked }))
                      }
                    />
                    <Label htmlFor="removeSpecialChars">Remove special characters</Label>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="flex gap-4">
                <Button onClick={applyRenaming} disabled={selectedFiles.size === 0}>
                  <RotateCw className="w-4 h-4" />
                  Apply Renaming ({selectedFiles.size} files)
                </Button>
                
                <Button variant="ghost" onClick={() => setShowPreview(!showPreview)}>
                  {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  {showPreview ? 'Hide' : 'Show'} Preview
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Preview Tab */}
        <TabsContent value="preview" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Files Preview</CardTitle>
              <div className="flex gap-2 items-center">
                <Select value={filterType} onValueChange={(value: any) => setFilterType(value)}>
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
                
                <Button variant="ghost" size="sm" onClick={downloadRenamedFiles}>
                  <Download className="w-4 h-4" />
                  Download Selected
                </Button>
              </div>
            </CardHeader>
            
            <CardContent>
              <ScrollArea className="h-96">
                {filteredAndSortedFiles.length === 0 ? (
                  <div className="text-center py-12">
                    <ImageIcon className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">No files to display</p>
                  </div>
                ) : (
                  <div className={previewMode === 'grid' ? 'grid grid-cols-2 md:grid-cols-4 gap-4' : 'space-y-2'}>
                    {filteredAndSortedFiles.map((file) => (
                      <div
                        key={file.id}
                        className={`border rounded-lg p-3 cursor-pointer transition-colors ${
                          selectedFiles.has(file.id) 
                            ? 'border-primary bg-primary/5' 
                            : 'border-border hover:border-primary/50'
                        } ${previewMode === 'list' ? 'flex items-center gap-4' : ''}`}
                        onClick={() => toggleFileSelection(file.id)}
                      >
                        {previewMode === 'grid' ? (
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
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    removeFile(file.id);
                                  }}
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
                        ) : (
                          <>
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
                              onClick={(e) => {
                                e.stopPropagation();
                                removeFile(file.id);
                              }}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Advanced Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">History</h3>
                {history.length === 0 ? (
                  <p className="text-muted-foreground">No history available</p>
                ) : (
                  <ScrollArea className="h-32">
                    <div className="space-y-2">
                      {history.map((entry) => (
                        <div key={entry.id} className="flex items-center justify-between p-2 border rounded">
                          <div>
                            <p className="text-sm font-medium">{entry.action}</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(entry.timestamp).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                )}
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Statistics</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="p-4 text-center">
                      <p className="text-2xl font-bold">{files.length}</p>
                      <p className="text-sm text-muted-foreground">Total Files</p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4 text-center">
                      <p className="text-2xl font-bold">{files.filter(f => f.processed).length}</p>
                      <p className="text-sm text-muted-foreground">Processed</p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4 text-center">
                      <p className="text-2xl font-bold">{selectedFiles.size}</p>
                      <p className="text-sm text-muted-foreground">Selected</p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4 text-center">
                      <p className="text-2xl font-bold">{files.filter(f => f.error).length}</p>
                      <p className="text-sm text-muted-foreground">Errors</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
