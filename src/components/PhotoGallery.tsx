import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Grid, Trash2, Download, Calendar, FileText, HardDrive, CheckSquare, Square, X, Sparkles, RefreshCw, Bot, ArrowUpDown, ArrowUp, ArrowDown, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, ChevronDown, ChevronUp, Filter, SlidersHorizontal, Eye, EyeOff } from 'lucide-react';
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
  getPaginationRowModel,
  getExpandedRowModel,
  createColumnHelper,
  flexRender,
  type ColumnDef,
  type SortingState,
  type RowSelectionState,
  type PaginationState,
  type ExpandedState,
} from '@tanstack/react-table';

interface PhotoGalleryProps {
  className?: string;
}

const PhotoGallery: React.FC<PhotoGalleryProps> = ({ className }) => {
  const [showBatchAnalysisDialog, setShowBatchAnalysisDialog] = useState(false);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [globalFilter, setGlobalFilter] = useState('');
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 25,
  });
  const [expanded, setExpanded] = useState<ExpandedState>({});
  const [dateFilter, setDateFilter] = useState('all');
  const [sizeFilter, setSizeFilter] = useState('all');
  
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
      id: 'expand',
      header: '',
      cell: ({ row }) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            console.log('Expand button clicked for row:', row.id);
            row.toggleExpanded();
          }}
          className="h-8 w-8 p-0 hover:bg-transparent"
        >
          {row.getIsExpanded() ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </Button>
      ),
      enableSorting: false,
      enableHiding: false,
      size: 40,
    }),
    columnHelper.display({
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => {
            console.log('Select all checkbox clicked:', value);
            table.toggleAllPageRowsSelected(!!value);
          }}
          aria-label="Select all"
          className="glass border-border/50 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => {
            console.log('Row checkbox clicked:', row.id, value);
            row.toggleSelected(!!value);
          }}
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
              onClick={(e) => {
                e.stopPropagation();
                console.log('AI Rename button clicked for photo:', photo.id);
                aiRenamePhoto(photo.id);
              }}
              disabled={loading}
              className="h-8 w-8 p-0 hover:bg-primary/10"
              title="AI Rename"
            >
              <Sparkles className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation();
                console.log('Download button clicked for photo:', photo.id);
                downloadPhoto(photo);
              }}
              className="h-8 w-8 p-0 hover:bg-primary/10"
              title="Download"
            >
              <Download className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation();
                console.log('Delete button clicked for photo:', photo.id);
                handleDeletePhoto(photo);
              }}
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
    columnHelper.display({
      id: 'expandedDetails',
      cell: ({ row }) => {
        if (!row.getIsExpanded()) return null;
        const photo = row.original;
        return (
          <div className="p-4 glass rounded-lg border border-border/20 bg-background/50">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Details</h4>
                <div className="space-y-1 text-xs text-muted-foreground">
                  <div>File: {photo.file_name}</div>
                  <div>Type: {photo.mime_type}</div>
                  <div>Size: {formatFileSize(photo.file_size)}</div>
                  {photo.width && photo.height && (
                    <div>Dimensions: {photo.width} × {photo.height}</div>
                  )}
                  <div>Created: {format(new Date(photo.created_at), 'PPpp')}</div>
                  {photo.updated_at !== photo.created_at && (
                    <div>Modified: {format(new Date(photo.updated_at), 'PPpp')}</div>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium text-sm">AI Analysis</h4>
                {photo.ai_description && (
                  <div className="text-xs">
                    <span className="text-muted-foreground">Description:</span>
                    <p className="mt-1">{photo.ai_description}</p>
                  </div>
                )}
                {photo.ai_generated_tags && photo.ai_generated_tags.length > 0 && (
                  <div className="text-xs">
                    <span className="text-muted-foreground">Tags:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {photo.ai_generated_tags.map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs px-1 py-0">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                {photo.analysis_completed_at && (
                  <div className="text-xs text-muted-foreground">
                    Analyzed: {format(new Date(photo.analysis_completed_at), 'PPp')}
                  </div>
                )}
              </div>
            </div>
            {photo.url && (
              <div className="mt-4">
                <h4 className="font-medium text-sm mb-2">Preview</h4>
                <div className="w-full max-w-md mx-auto glass rounded-lg overflow-hidden">
                  <img
                    src={photo.url}
                    alt={photo.original_name}
                    className="w-full h-auto"
                    loading="lazy"
                  />
                </div>
              </div>
            )}
          </div>
        );
      },
      enableSorting: false,
      enableHiding: false,
    }),
  ], [loading]);

  // Filter photos based on date and size filters
  const filteredPhotos = useMemo(() => {
    let filtered = photos;
    
    if (dateFilter !== 'all') {
      const now = new Date();
      const filterDate = new Date();
      
      switch (dateFilter) {
        case 'today':
          filterDate.setHours(0, 0, 0, 0);
          break;
        case 'week':
          filterDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          filterDate.setMonth(now.getMonth() - 1);
          break;
        case 'year':
          filterDate.setFullYear(now.getFullYear() - 1);
          break;
      }
      
      filtered = filtered.filter(photo => new Date(photo.created_at) >= filterDate);
    }
    
    if (sizeFilter !== 'all') {
      const sizeMap = {
        small: [0, 1024 * 1024], // < 1MB
        medium: [1024 * 1024, 5 * 1024 * 1024], // 1-5MB
        large: [5 * 1024 * 1024, Infinity], // > 5MB
      };
      
      const [min, max] = sizeMap[sizeFilter as keyof typeof sizeMap];
      filtered = filtered.filter(photo => photo.file_size >= min && photo.file_size < max);
    }
    
    return filtered;
  }, [photos, dateFilter, sizeFilter]);

  const table = useReactTable({
    data: filteredPhotos,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    onExpandedChange: setExpanded,
    globalFilterFn: 'includesString',
    state: {
      sorting,
      rowSelection,
      globalFilter,
      pagination,
      expanded,
    },
    getRowId: (row) => row.id,
    getRowCanExpand: () => true,
  });

  const handleDeletePhoto = async (photo: PhotoMetadata) => {
    console.log('handleDeletePhoto called:', photo.id);
    try {
      if (window.confirm(`Are you sure you want to delete "${photo.original_name}"?`)) {
        await deletePhoto(photo.id, photo.file_path);
      }
    } catch (error) {
      console.error('Error in handleDeletePhoto:', error);
    }
  };

  const downloadPhoto = (photo: PhotoMetadata) => {
    console.log('downloadPhoto called:', photo.id);
    try {
      if (photo.url) {
        const link = document.createElement('a');
        link.href = photo.url;
        link.download = photo.original_name;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (error) {
      console.error('Error in downloadPhoto:', error);
    }
  };

  const handleDeleteSelected = async () => {
    console.log('handleDeleteSelected called, selected count:', selectedPhotos.size);
    try {
      if (window.confirm(`Are you sure you want to delete ${selectedPhotos.size} selected photos?`)) {
        await deleteSelectedPhotos();
      }
    } catch (error) {
      console.error('Error in handleDeleteSelected:', error);
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
        <div className="flex flex-col gap-4">
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
          
          {/* Advanced Filters */}
          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Filters:</span>
            </div>
            
            <div className="flex gap-2 flex-wrap">
              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger className="w-32 h-8 glass border-border/20">
                  <Calendar className="w-3 h-3 mr-1" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                  <SelectItem value="year">This Year</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={sizeFilter} onValueChange={setSizeFilter}>
                <SelectTrigger className="w-32 h-8 glass border-border/20">
                  <HardDrive className="w-3 h-3 mr-1" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sizes</SelectItem>
                  <SelectItem value="small">&lt; 1MB</SelectItem>
                  <SelectItem value="medium">1-5MB</SelectItem>
                  <SelectItem value="large">&gt; 5MB</SelectItem>
                </SelectContent>
              </Select>
              
              <Select 
                value={pagination.pageSize.toString()} 
                onValueChange={(value) => setPagination(prev => ({ ...prev, pageSize: parseInt(value) }))}
              >
                <SelectTrigger className="w-28 h-8 glass border-border/20">
                  <Eye className="w-3 h-3 mr-1" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10 per page</SelectItem>
                  <SelectItem value="25">25 per page</SelectItem>
                  <SelectItem value="50">50 per page</SelectItem>
                  <SelectItem value="100">100 per page</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {(dateFilter !== 'all' || sizeFilter !== 'all') && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setDateFilter('all');
                  setSizeFilter('all');
                }}
                className="text-xs glass border-0 hover:bg-background/20"
              >
                <X className="w-3 h-3 mr-1" />
                Clear Filters
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
                    <React.Fragment key={row.id}>
                      <TableRow
                        data-state={row.getIsSelected() && "selected"}
                        className="border-border/20 hover:bg-muted/50 data-[state=selected]:bg-primary/5"
                      >
                        {row.getVisibleCells().map((cell) => {
                          if (cell.column.id === 'expandedDetails') return null;
                          return (
                            <TableCell key={cell.id} className="py-3">
                              {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </TableCell>
                          );
                        })}
                      </TableRow>
                      {row.getIsExpanded() && (
                        <TableRow>
                          <TableCell colSpan={columns.length - 1} className="p-0 border-0">
                            {flexRender(
                              row.getVisibleCells().find(cell => cell.column.id === 'expandedDetails')?.column.columnDef.cell,
                              row.getVisibleCells().find(cell => cell.column.id === 'expandedDetails')?.getContext()
                            )}
                          </TableCell>
                        </TableRow>
                      )}
                    </React.Fragment>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={columns.length - 1} className="h-24 text-center">
                      No photos found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            
            {/* Pagination Controls */}
            {table.getPageCount() > 1 && (
              <div className="flex items-center justify-between px-4 py-3 border-t border-border/20">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>
                    Showing {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} to{' '}
                    {Math.min(
                      (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
                      table.getPrePaginationRowModel().rows.length
                    )}{' '}
                    of {table.getPrePaginationRowModel().rows.length} photos
                  </span>
                </div>
                
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => table.setPageIndex(0)}
                    disabled={!table.getCanPreviousPage()}
                    className="h-8 w-8 p-0 glass border-0"
                  >
                    <ChevronsLeft className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                    className="h-8 w-8 p-0 glass border-0"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  
                  <div className="flex items-center gap-1 mx-2">
                    <span className="text-sm text-muted-foreground">Page</span>
                    <span className="text-sm font-medium">
                      {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
                    </span>
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                    className="h-8 w-8 p-0 glass border-0"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                    disabled={!table.getCanNextPage()}
                    className="h-8 w-8 p-0 glass border-0"
                  >
                    <ChevronsRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
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