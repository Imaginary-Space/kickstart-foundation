import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Grid, Trash2, Download, Calendar, FileText, HardDrive, CheckSquare, Square, X, Sparkles, RefreshCw, Bot, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { BatchAnalysisDialog } from './BatchAnalysisDialog';
import { useJobManager } from '@/hooks/useJobManager';
import { usePhotoGalleryWithCache, PhotoMetadata } from '@/hooks/usePhotoGalleryWithCache';
import { formatFileSize } from '@/utils/fileProcessing';
import { format } from 'date-fns';
import BatchRenameDialog from './BatchRenameDialog';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  createColumnHelper,
  flexRender,
  type ColumnDef,
  type SortingState,
  type RowSelectionState,
} from '@tanstack/react-table';

interface PhotoGalleryProps {
  className?: string;
}

const PhotoGallery: React.FC<PhotoGalleryProps> = ({ className }) => {
  const [showBatchAnalysisDialog, setShowBatchAnalysisDialog] = useState(false);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [globalFilter, setGlobalFilter] = useState('');
  
  const { startBatchAnalysis, isStartingJob, hasActiveJob } = useJobManager();
  const {
    photos,
    loading,
    isRenaming,
    storageUsed,
    deletePhoto,
    batchRenamePhotos,
    deleteSelectedPhotos,
    aiRenamePhoto,
    manualRefresh,
  } = usePhotoGalleryWithCache();

  // Convert row selection to photo selection
  const selectedPhotos = useMemo(() => {
    const selectedIds = Object.keys(rowSelection).filter(key => rowSelection[key]);
    return new Set(selectedIds);
  }, [rowSelection]);

  const selectedPhotosList = photos.filter(photo => selectedPhotos.has(photo.id));
  const isAllSelected = photos.length > 0 && selectedPhotos.size === photos.length;
  const isSomeSelected = selectedPhotos.size > 0;

  const columnHelper = createColumnHelper<PhotoMetadata>();

  const columns = useMemo<ColumnDef<PhotoMetadata>[]>(() => [
    columnHelper.display({
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
          className="glass border-border/50 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          className="glass border-border/50 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
        />
      ),
      enableSorting: false,
      enableHiding: false,
      size: 40,
    }),
    columnHelper.accessor('original_name', {
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 p-0 hover:bg-transparent"
        >
          Photo
          {column.getIsSorted() === "asc" ? (
            <ArrowUp className="ml-2 h-4 w-4" />
          ) : column.getIsSorted() === "desc" ? (
            <ArrowDown className="ml-2 h-4 w-4" />
          ) : (
            <ArrowUpDown className="ml-2 h-4 w-4" />
          )}
        </Button>
      ),
      cell: ({ row }) => {
        const photo = row.original;
        return (
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg overflow-hidden glass">
              {photo.url ? (
                <img
                  src={photo.url}
                  alt={photo.original_name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-full bg-muted flex items-center justify-center">
                  <FileText className="w-4 h-4 text-muted-foreground" />
                </div>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-medium text-sm truncate" title={photo.original_name}>
                {photo.original_name}
              </p>
              {photo.width && photo.height && (
                <p className="text-xs text-muted-foreground">
                  {photo.width} × {photo.height}
                </p>
              )}
            </div>
          </div>
        );
      },
    }),
    columnHelper.accessor('file_size', {
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 p-0 hover:bg-transparent"
        >
          Size
          {column.getIsSorted() === "asc" ? (
            <ArrowUp className="ml-2 h-4 w-4" />
          ) : column.getIsSorted() === "desc" ? (
            <ArrowDown className="ml-2 h-4 w-4" />
          ) : (
            <ArrowUpDown className="ml-2 h-4 w-4" />
          )}
        </Button>
      ),
      cell: ({ getValue }) => (
        <div className="flex items-center gap-1 text-sm">
          <HardDrive className="w-3 h-3 text-muted-foreground" />
          {formatFileSize(getValue() as number)}
        </div>
      ),
    }),
    columnHelper.accessor('created_at', {
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 p-0 hover:bg-transparent"
        >
          Date
          {column.getIsSorted() === "asc" ? (
            <ArrowUp className="ml-2 h-4 w-4" />
          ) : column.getIsSorted() === "desc" ? (
            <ArrowDown className="ml-2 h-4 w-4" />
          ) : (
            <ArrowUpDown className="ml-2 h-4 w-4" />
          )}
        </Button>
      ),
      cell: ({ getValue }) => (
        <div className="flex items-center gap-1 text-sm">
          <Calendar className="w-3 h-3 text-muted-foreground" />
          {format(new Date(getValue() as string), 'MMM d, yyyy')}
        </div>
      ),
    }),
    columnHelper.display({
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const photo = row.original;
        return (
          <div className="flex items-center gap-1">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => aiRenamePhoto(photo.id)}
              disabled={loading}
              className="h-8 w-8 p-0 hover:bg-primary/10"
              title="AI Rename"
            >
              <Sparkles className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => downloadPhoto(photo)}
              className="h-8 w-8 p-0 hover:bg-primary/10"
              title="Download"
            >
              <Download className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => handleDeletePhoto(photo)}
              className="h-8 w-8 p-0 hover:bg-destructive/10"
              title="Delete"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        );
      },
      enableSorting: false,
      size: 120,
    }),
  ], [loading]);

  const table = useReactTable({
    data: photos,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: 'includesString',
    state: {
      sorting,
      rowSelection,
      globalFilter,
    },
    getRowId: (row) => row.id,
  });

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

  const togglePhotoSelection = (photoId: string) => {
    setRowSelection(prev => ({
      ...prev,
      [photoId]: !prev[photoId]
    }));
  };

  const selectAllPhotos = () => {
    const allIds = photos.reduce((acc, photo) => {
      acc[photo.id] = true;
      return acc;
    }, {} as RowSelectionState);
    setRowSelection(allIds);
  };

  const clearSelection = () => {
    setRowSelection({});
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
            <Button
              variant="ghost"
              size="sm"
              onClick={manualRefresh}
              className="flex items-center gap-1 text-xs glass border-0 hover:bg-background/20"
            >
              <RefreshCw className="w-3 h-3" />
              Refresh
            </Button>
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
                onClick={() => setShowBatchAnalysisDialog(true)}
                variant="ghost"
                size="sm"
                className="text-primary hover:text-primary/90 glass border-0 hover:bg-primary/10"
              >
                <Bot className="w-4 h-4" />
                AI Analysis
              </Button>
              <Button
                onClick={() => {
                  // Start AI rename with only filename generation enabled
                  const photoIds = selectedPhotosList.map(photo => photo.id);
                  startBatchAnalysis({ 
                    photoIds, 
                    analysisOptions: {
                      improveFilename: true,
                      generateTags: false,
                      generateDescription: false
                    }
                  });
                }}
                variant="ghost"
                size="sm"
                className="text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 glass border-0 hover:bg-purple-500/10"
                disabled={isStartingJob || hasActiveJob}
              >
                <Sparkles className="w-4 h-4" />
                {isStartingJob ? 'Starting...' : 'AI Rename'}
              </Button>
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
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
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
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : photos.length === 0 ? (
          <div className="text-center py-12">
            <Grid className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No photos yet</h3>
            <p className="text-muted-foreground">
              {globalFilter ? 'No photos match your search.' : 'Upload some photos to get started!'}
            </p>
          </div>
        ) : (
          <div className="glass rounded-lg border-0">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id} className="border-border/20 hover:bg-transparent">
                    {headerGroup.headers.map((header) => (
                      <TableHead 
                        key={header.id} 
                        style={{ width: header.getSize() }}
                        className="text-foreground font-medium"
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                      className="border-border/20 hover:bg-muted/50 data-[state=selected]:bg-primary/5"
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id} className="py-3">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="h-24 text-center">
                      No photos found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
      
      <BatchAnalysisDialog
        isOpen={showBatchAnalysisDialog}
        onClose={() => setShowBatchAnalysisDialog(false)}
        selectedPhotos={selectedPhotosList}
      />
    </Card>
  );
};

export default PhotoGallery;