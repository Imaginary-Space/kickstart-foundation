import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Trash2, Download, Calendar, FileText, HardDrive, CheckSquare, Square, X, File, FileImage, FileVideo, Music, Archive } from 'lucide-react';
import { useFileGallery, FileMetadata } from '@/hooks/useFileGallery';
import { formatFileSize } from '@/utils/fileProcessing';
import { format } from 'date-fns';
import { GlareCard } from '@/components/ui/glare-card';

interface FileGalleryProps {
  className?: string;
}

const FileGallery: React.FC<FileGalleryProps> = ({ className }) => {
  const {
    files,
    loading,
    searchTerm,
    setSearchTerm,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    selectedFiles,
    storageUsed,
    deleteFile,
    toggleFileSelection,
    selectAllFiles,
    clearSelection,
    deleteSelectedFiles,
  } = useFileGallery();

  const selectedFilesList = files.filter(file => selectedFiles.has(file.id));
  const isAllSelected = files.length > 0 && selectedFiles.size === files.length;
  const isSomeSelected = selectedFiles.size > 0;

  const handleDeleteFile = async (file: FileMetadata) => {
    if (window.confirm(`Are you sure you want to delete "${file.original_name}"?`)) {
      await deleteFile(file.id, file.file_path);
    }
  };

  const downloadFile = async (file: FileMetadata) => {
    if (!file.url) return;
    
    try {
      const response = await fetch(file.url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = file.original_name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };

  const handleDeleteSelected = async () => {
    await deleteSelectedFiles();
  };

  const formatStorageUsage = (bytes: number) => {
    return formatFileSize(bytes);
  };

  const getFileIcon = (mimeType: string | null, size: number = 24) => {
    if (!mimeType) return <File size={size} />;
    
    if (mimeType.startsWith('image/')) return <FileImage size={size} />;
    if (mimeType.startsWith('video/')) return <FileVideo size={size} />;
    if (mimeType.startsWith('audio/')) return <Music size={size} />;
    if (mimeType.includes('zip') || mimeType.includes('rar') || mimeType.includes('tar')) return <Archive size={size} />;
    
    return <FileText size={size} />;
  };

  const getFileTypeColor = (mimeType: string | null) => {
    if (!mimeType) return 'bg-secondary';
    
    if (mimeType.startsWith('image/')) return 'bg-green-500';
    if (mimeType.startsWith('video/')) return 'bg-red-500';
    if (mimeType.startsWith('audio/')) return 'bg-purple-500';
    if (mimeType.includes('pdf')) return 'bg-red-600';
    if (mimeType.includes('document') || mimeType.includes('word')) return 'bg-blue-500';
    if (mimeType.includes('spreadsheet') || mimeType.includes('excel')) return 'bg-green-600';
    
    return 'bg-gray-500';
  };

  return (
    <Card className={className}>
      <CardHeader className="space-y-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <HardDrive className="w-5 h-5" />
            File Gallery
            {files.length > 0 && (
              <Badge variant="secondary">{files.length} files</Badge>
            )}
          </CardTitle>
          <div className="text-sm text-muted-foreground">
            Storage: {formatStorageUsage(storageUsed)}
          </div>
        </div>

        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search files..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex items-center gap-2">
            <Select value={sortBy} onValueChange={(value: 'name' | 'date' | 'size') => setSortBy(value)}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">Date</SelectItem>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="size">Size</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            >
              {sortOrder === 'asc' ? '↑' : '↓'}
            </Button>
          </div>
        </div>

        {isSomeSelected && (
          <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={isAllSelected ? clearSelection : selectAllFiles}
                className="h-auto p-1"
              >
                {isAllSelected ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4" />}
              </Button>
              <span className="text-sm font-medium">
                {selectedFiles.size} of {files.length} selected
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="default"
                size="sm"
                onClick={handleDeleteSelected}
                disabled={selectedFiles.size === 0}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                <Trash2 className="w-4 h-4 mr-1" />
                Delete ({selectedFiles.size})
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearSelection}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </CardHeader>

      <CardContent>
        {loading && (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        )}

        {!loading && files.length === 0 && searchTerm && (
          <div className="text-center py-8 text-muted-foreground">
            <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No files found matching "{searchTerm}"</p>
          </div>
        )}

        {!loading && files.length === 0 && !searchTerm && (
          <div className="text-center py-8 text-muted-foreground">
            <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No files uploaded yet</p>
            <p className="text-sm mt-2">Upload files using the drop zone above</p>
          </div>
        )}

        {!loading && files.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {files.map((file) => (
              <GlareCard key={file.id} className="relative group">
                <div className="relative h-48 bg-card border rounded-lg overflow-hidden">
                  {/* Selection Checkbox */}
                  <div className="absolute top-2 left-2 z-10">
                    <Checkbox
                      checked={selectedFiles.has(file.id)}
                      onCheckedChange={() => toggleFileSelection(file.id)}
                      className="bg-background/80 backdrop-blur-sm border-2"
                    />
                  </div>

                  {/* File Icon/Preview */}
                  <div className="flex items-center justify-center h-32 bg-muted/50">
                    <div className={`p-4 rounded-full ${getFileTypeColor(file.mime_type)} text-white`}>
                      {getFileIcon(file.mime_type, 32)}
                    </div>
                  </div>

                  {/* File Info */}
                  <div className="p-3 space-y-1">
                    <h3 className="font-medium text-sm truncate" title={file.original_name}>
                      {file.original_name}
                    </h3>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{formatFileSize(file.file_size || 0)}</span>
                      <span>{format(new Date(file.created_at), 'MMM d')}</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2">
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => downloadFile(file)}
                      className="h-8 px-2 bg-background text-foreground hover:bg-background/90"
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => handleDeleteFile(file)}
                      className="h-8 px-2 bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </GlareCard>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FileGallery;