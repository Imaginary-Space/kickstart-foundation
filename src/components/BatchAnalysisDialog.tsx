import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Bot, FileText, Hash, Sparkles, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { useJobManager } from '@/hooks/useJobManager';

interface BatchAnalysisDialogProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPhotos: any[];
}

export const BatchAnalysisDialog: React.FC<BatchAnalysisDialogProps> = ({
  isOpen,
  onClose,
  selectedPhotos,
}) => {
  const { startBatchAnalysis, activeJob, hasActiveJob, isStartingJob } = useJobManager();
  
  const [analysisOptions, setAnalysisOptions] = useState({
    generateTags: true,
    generateDescription: true,
    improveFilename: true,
  });

  const handleStartAnalysis = () => {
    if (selectedPhotos.length === 0) return;
    
    const photoIds = selectedPhotos.map(photo => photo.id);
    startBatchAnalysis({ photoIds, analysisOptions });
  };

  const handleClose = () => {
    if (!hasActiveJob) {
      onClose();
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="w-4 h-4 text-success" />;
      case 'failed':
        return <AlertCircle className="w-4 h-4 text-destructive" />;
      case 'processing':
        return <Bot className="w-4 h-4 text-primary animate-pulse" />;
      default:
        return <Clock className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return minutes > 0 
      ? `${minutes}m ${remainingSeconds}s`
      : `${remainingSeconds}s`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bot className="w-5 h-5 text-primary" />
            Batch AI Analysis
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Selection Summary */}
          <div className="bg-muted/50 rounded-lg p-4">
            <h3 className="font-medium mb-2">Selected Photos</h3>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">
                {selectedPhotos.length} photo{selectedPhotos.length !== 1 ? 's' : ''}
              </Badge>
              <span className="text-sm text-muted-foreground">
                Ready for AI analysis
              </span>
            </div>
          </div>

          {/* Active Job Status */}
          {hasActiveJob && activeJob && (
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  {getStatusIcon(activeJob.status)}
                  <span className="font-medium capitalize">{activeJob.status}</span>
                </div>
                <Badge variant="secondary">
                  {activeJob.processed_items}/{activeJob.total_items}
                </Badge>
              </div>
              
              <Progress value={activeJob.progress} className="mb-3" />
              
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>{activeJob.progress}% complete</span>
              </div>

              {activeJob.status === 'completed' && (
                <div className="mt-3 p-3 bg-success/10 rounded-lg">
                  <div className="flex items-center gap-2 text-success">
                    <CheckCircle2 className="w-4 h-4" />
                    <span className="text-sm font-medium">Analysis Complete!</span>
                  </div>
                  <p className="text-sm mt-1">
                    Successfully processed {activeJob.processed_items} photos.
                  </p>
                </div>
              )}

              {activeJob.status === 'failed' && (
                <div className="mt-3 p-3 bg-destructive/10 rounded-lg">
                  <div className="flex items-center gap-2 text-destructive">
                    <AlertCircle className="w-4 h-4" />
                    <span className="text-sm font-medium">Analysis Failed</span>
                  </div>
                  <p className="text-sm mt-1">
                    {activeJob.error_message || 'An error occurred during processing.'}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Analysis Options */}
          {!hasActiveJob && (
            <>
              <Separator />
              
              <div className="space-y-4">
                <h3 className="font-medium">Analysis Options</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="generateTags"
                      checked={analysisOptions.generateTags}
                      onCheckedChange={(checked) =>
                        setAnalysisOptions(prev => ({ ...prev, generateTags: !!checked }))
                      }
                    />
                    <Label htmlFor="generateTags" className="flex items-center gap-2 cursor-pointer">
                      <Hash className="w-4 h-4 text-blue-500" />
                      Generate Tags
                      <span className="text-sm text-muted-foreground">
                        Auto-tag photos with relevant keywords
                      </span>
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="generateDescription"
                      checked={analysisOptions.generateDescription}
                      onCheckedChange={(checked) =>
                        setAnalysisOptions(prev => ({ ...prev, generateDescription: !!checked }))
                      }
                    />
                    <Label htmlFor="generateDescription" className="flex items-center gap-2 cursor-pointer">
                      <FileText className="w-4 h-4 text-green-500" />
                      Generate Description
                      <span className="text-sm text-muted-foreground">
                        Create detailed descriptions
                      </span>
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="improveFilename"
                      checked={analysisOptions.improveFilename}
                      onCheckedChange={(checked) =>
                        setAnalysisOptions(prev => ({ ...prev, improveFilename: !!checked }))
                      }
                    />
                    <Label htmlFor="improveFilename" className="flex items-center gap-2 cursor-pointer">
                      <Sparkles className="w-4 h-4 text-purple-500" />
                      Improve Filename
                      <span className="text-sm text-muted-foreground">
                        Generate descriptive filenames
                      </span>
                    </Label>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        <DialogFooter>
          {hasActiveJob ? (
            <Button 
              variant="ghost" 
              onClick={handleClose}
              disabled={activeJob?.status === 'processing'}
            >
              {activeJob?.status === 'processing' ? 'Processing...' : 'Close'}
            </Button>
          ) : (
            <>
              <Button variant="ghost" onClick={onClose}>
                Cancel
              </Button>
              <Button
                onClick={handleStartAnalysis}
                disabled={selectedPhotos.length === 0 || isStartingJob}
                className="bg-primary hover:bg-primary/90"
              >
                {isStartingJob ? (
                  <>
                    <Bot className="w-4 h-4 mr-2 animate-pulse" />
                    Starting...
                  </>
                ) : (
                  <>
                    <Bot className="w-4 h-4 mr-2" />
                    Start Analysis
                  </>
                )}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};