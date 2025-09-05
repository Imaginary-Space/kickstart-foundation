import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Upload, File, X } from 'lucide-react';

interface FileDropZoneProps {
  onFiles: (files: File[]) => Promise<void>;
  isProcessing: boolean;
  className?: string;
}

const FileDropZone: React.FC<FileDropZoneProps> = ({
  onFiles,
  isProcessing,
  className
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setSelectedFiles(prev => [...prev, ...acceptedFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    disabled: isProcessing,
    multiple: true
  });

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (selectedFiles.length > 0) {
      await onFiles(selectedFiles);
      setSelectedFiles([]);
    }
  };

  const clearAll = () => {
    setSelectedFiles([]);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className={className}>
      <Card className="glass-card border-0">
        <CardContent className="p-6">
          <div
            {...getRootProps()}
            className={`
              border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300 cursor-pointer
              ${isDragActive || dragActive 
                ? 'border-primary bg-primary/10 scale-[1.02]' 
                : 'border-muted-foreground/25 hover:border-primary/50 hover:bg-primary/5'
              }
              ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          >
            <input {...getInputProps()} />
            
            <div className="space-y-4">
              <div className="w-16 h-16 mx-auto bg-gradient-primary rounded-full flex items-center justify-center shadow-glow">
                <Upload className="w-8 h-8 text-primary-foreground" />
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-2">
                  {isDragActive ? 'Drop files here' : 'Upload Files'}
                </h3>
                <p className="text-muted-foreground">
                  Drag and drop files here, or click to select files
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  All file types supported
                </p>
              </div>

              {!isDragActive && !isProcessing && (
                <Button className="glass hover:bg-primary/20">
                  Choose Files
                </Button>
              )}
            </div>
          </div>

          {/* Selected Files */}
          {selectedFiles.length > 0 && (
            <div className="mt-6 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Selected Files ({selectedFiles.length})</h4>
                <div className="flex gap-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={clearAll}
                    disabled={isProcessing}
                  >
                    <X className="w-4 h-4 mr-1" />
                    Clear All
                  </Button>
                  <Button 
                    onClick={handleUpload}
                    disabled={isProcessing || selectedFiles.length === 0}
                    className="glass"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload {selectedFiles.length} file(s)
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-2 max-h-40 overflow-y-auto">
                {selectedFiles.map((file, index) => (
                  <div 
                    key={`${file.name}-${index}`}
                    className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <File className="w-4 h-4 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium truncate">{file.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatFileSize(file.size)}
                        </p>
                      </div>
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(index)}
                      disabled={isProcessing}
                      className="h-8 w-8 p-0 flex-shrink-0"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {isProcessing && (
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Uploading files...</span>
              </div>
              <Progress value={75} className="w-full" />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default FileDropZone;