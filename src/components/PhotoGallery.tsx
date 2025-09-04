import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Grid, Trash2, Download, Calendar, FileText, HardDrive, CheckSquare, Square, X } from 'lucide-react';
import { usePhotoGallery, PhotoMetadata } from '@/hooks/usePhotoGallery';
import { formatFileSize } from '@/utils/fileProcessing';
import { format } from 'date-fns';
import BatchRenameDialog from './BatchRenameDialog';

interface PhotoGalleryProps {
  className?: string;
}

const PhotoGallery: React.FC<PhotoGalleryProps> = ({ className }) => {
  const {
    photos,
    loading,
    isRenaming,
    searchTerm,
    setSearchTerm,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    selectedPhotos,
    storageUsed,
    deletePhoto,
    batchRenamePhotos,
    togglePhotoSelection,
    selectAllPhotos,
    clearSelection,
    deleteSelectedPhotos,
  } = usePhotoGallery();

  const selectedPhotosList = photos.filter(photo => selectedPhotos.has(photo.id));
  const isAllSelected = photos.length > 0 && selectedPhotos.size === photos.length;
  const isSomeSelected = selectedPhotos.size > 0;

  const handleDeletePhoto = async (photo: PhotoMetadata) => {
    if (window.confirm(`Are you sure you want to delete "${photo.original_name}"?`)) {
      await deletePhoto(photo.id, photo.file_path);
    }
  };

  const downloadPhoto = (photo: PhotoMetadata) => {
    if (photo.url) {
      const link = document.createElement('a');
      link.href = photo.url;
      link.download = photo.original_name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleDeleteSelected = async () => {
    if (window.confirm(`Are you sure you want to delete ${selectedPhotos.size} selected photos?`)) {
      await deleteSelectedPhotos();
    }
  };

  const formatStorageUsage = (bytes: number) => {
    const mb = bytes / (1024 * 1024);
    const gb = mb / 1024;
    return gb >= 1 ? `${gb.toFixed(2)} GB` : `${mb.toFixed(1)} MB`;
  };

  return (
    <Card className={`glass-card border-0 ${className}`}>
      <CardHeader className="glass-header rounded-t-2xl">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Grid className="w-5 h-5" />
            Photo Gallery
            <Badge variant="secondary">{photos.length} photos</Badge>
          </CardTitle>
          
          {/* Storage Usage */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <HardDrive className="w-4 h-4" />
              <span>{formatStorageUsage(storageUsed)} used</span>
            </div>
            {isSomeSelected && (
              <Badge variant="secondary">
                {selectedPhotos.size} selected
              </Badge>
            )}
          </div>
        </div>

        {/* Batch Actions */}
        {isSomeSelected && (
          <div className="flex items-center gap-2 p-3 glass rounded-lg border-0">
            <div className="flex items-center gap-2 flex-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={clearSelection}
                className="h-8 px-2 glass border-0 hover:bg-background/20"
              >
                <X className="w-4 h-4" />
              </Button>
              <span className="text-sm text-muted-foreground">
                {selectedPhotos.size} photos selected
              </span>
            </div>
            <div className="flex items-center gap-2">
              <BatchRenameDialog
                selectedPhotos={selectedPhotosList}
                onRename={batchRenamePhotos}
                isRenaming={isRenaming}
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDeleteSelected}
                className="text-destructive hover:text-destructive/80 glass border-0 hover:bg-destructive/10"
              >
                <Trash2 className="w-4 h-4" />
                Delete Selected
              </Button>
            </div>
          </div>
        )}
        
        {/* Search and Filter Controls */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search photos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex gap-2 items-center">
            {photos.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={isAllSelected ? clearSelection : selectAllPhotos}
              className="flex items-center gap-2 glass border-0 hover:bg-background/20"
            >
                {isAllSelected ? (
                  <CheckSquare className="w-4 h-4" />
                ) : (
                  <Square className="w-4 h-4" />
                )}
                {isAllSelected ? 'Deselect All' : 'Select All'}
              </Button>
            )}
            
            <Select value={sortBy} onValueChange={(value: 'name' | 'date' | 'size') => setSortBy(value)}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Sort by" />
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
              className="glass border-0 hover:bg-background/20"
            >
              {sortOrder === 'asc' ? '↑' : '↓'}
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="aspect-square bg-muted rounded-lg animate-pulse" />
            ))}
          </div>
        ) : photos.length === 0 ? (
          <div className="text-center py-12">
            <Grid className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No photos yet</h3>
            <p className="text-muted-foreground">
              {searchTerm ? 'No photos match your search.' : 'Upload some photos to get started!'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {photos.map((photo) => (
                <div key={photo.id} className="group relative">
                  <Card className="glass-card overflow-hidden border-0">
                   {/* Selection Checkbox */}
                   <div className="absolute top-2 left-2 z-10">
                      <Checkbox
                        checked={selectedPhotos.has(photo.id)}
                        onCheckedChange={() => togglePhotoSelection(photo.id)}
                        className="glass border-border/50 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                      />
                   </div>
                   
                   <div className="aspect-square relative">
                     {photo.url ? (
                       <img
                         src={photo.url}
                         alt={photo.original_name}
                         className="w-full h-full object-cover transition-transform group-hover:scale-105"
                         loading="lazy"
                       />
                     ) : (
                       <div className="w-full h-full bg-muted flex items-center justify-center">
                         <FileText className="w-8 h-8 text-muted-foreground" />
                       </div>
                     )}
                    
                     {/* Overlay with actions */}
                     <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                       <Button
                         size="sm"
                         variant="ghost"
                         onClick={() => downloadPhoto(photo)}
                         className="glass text-white border-0 hover:bg-white/20"
                       >
                         <Download className="w-4 h-4" />
                       </Button>
                       <Button
                         size="sm"
                         variant="ghost"
                         onClick={() => handleDeletePhoto(photo)}
                         className="glass text-white border-0 hover:bg-destructive/20 hover:text-destructive"
                       >
                         <Trash2 className="w-4 h-4" />
                       </Button>
                     </div>
                  </div>
                  
                  {/* Photo info */}
                  <div className="p-3">
                    <h4 className="font-medium text-sm truncate mb-2" title={photo.original_name}>
                      {photo.original_name}
                    </h4>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <HardDrive className="w-3 h-3" />
                        {formatFileSize(photo.file_size)}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {format(new Date(photo.created_at), 'MMM d')}
                      </div>
                    </div>
                    {photo.width && photo.height && (
                      <div className="text-xs text-muted-foreground mt-1">
                        {photo.width} × {photo.height}
                      </div>
                    )}
                  </div>
                </Card>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PhotoGallery;