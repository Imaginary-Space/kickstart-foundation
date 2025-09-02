import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileImage } from 'lucide-react';
import { usePhotoRenamer } from '@/hooks/usePhotoRenamer';
import { FileDropZone } from './PhotoRenamer/FileDropZone';
import { RenamePatternForm } from './PhotoRenamer/RenamePatternForm';
import { FileGrid } from './PhotoRenamer/FileGrid';
import { FileStats } from './PhotoRenamer/FileStats';

export const PhotoRenamer: React.FC = () => {
  const {
    // State
    files,
    isProcessing,
    progress,
    selectedFiles,
    previewMode,
    showPreview,
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
    setFilterType,
    setPattern,
  } = usePhotoRenamer();

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
          <FileDropZone
            onFiles={handleFiles}
            isProcessing={isProcessing}
            progress={progress}
            fileCount={files.length}
            onSelectAll={selectAllFiles}
            onDeselectAll={deselectAllFiles}
            onClearAll={clearAllFiles}
            previewMode={previewMode}
            onPreviewModeChange={setPreviewMode}
          />
        </TabsContent>

        {/* Rename Tab */}
        <TabsContent value="rename" className="space-y-4">
          <RenamePatternForm
            pattern={pattern}
            onPatternChange={setPattern}
            onApplyRenaming={applyRenaming}
            selectedFilesCount={selectedFiles.size}
            showPreview={showPreview}
            onTogglePreview={() => setShowPreview(!showPreview)}
          />
        </TabsContent>

        {/* Preview Tab */}
        <TabsContent value="preview" className="space-y-4">
          <FileGrid
            files={files}
            selectedFiles={selectedFiles}
            previewMode={previewMode}
            filterType={filterType}
            onToggleSelection={toggleFileSelection}
            onRemoveFile={removeFile}
            onDownload={downloadRenamedFiles}
            onFilterChange={setFilterType}
          />
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-4">
          <FileStats
            files={files}
            selectedFiles={selectedFiles}
            history={history}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};
