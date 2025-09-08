import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Edit, FileText, Calendar, Hash } from 'lucide-react';
import type { RenamePattern } from '@/types/photoRenamer';
import { generateNewName } from '@/utils/fileNaming';
import type { PhotoMetadata } from '@/hooks/usePhotoGallery';

interface BatchRenameDialogProps {
  selectedPhotos: PhotoMetadata[];
  onRename: (photos: PhotoMetadata[], pattern: RenamePattern) => void;
  isRenaming: boolean;
}

const defaultPattern: RenamePattern = {
  prefix: '',
  suffix: '',
  numberFormat: 'sequential',
  startNumber: 1,
  dateFormat: 'YYYY-MM-DD',
  caseTransform: 'none',
  separator: 'none',
  removeSpaces: false,
  removeSpecialChars: false,
};

const BatchRenameDialog: React.FC<BatchRenameDialogProps> = ({
  selectedPhotos,
  onRename,
  isRenaming,
}) => {
  const [open, setOpen] = useState(false);
  const [pattern, setPattern] = useState<RenamePattern>(defaultPattern);

  const handleRename = () => {
    onRename(selectedPhotos, pattern);
    setOpen(false);
  };

  const previewNames = selectedPhotos.slice(0, 3).map((photo, index) => {
    // Create a mock PhotoFile for the generateNewName function
    const mockPhotoFile = {
      id: photo.id,
      file: new File([], photo.original_name),
      originalName: photo.original_name,
      newName: '',
      preview: '',
      size: photo.file_size,
      lastModified: new Date(photo.created_at).getTime(),
      processed: false,
      selected: true,
    };
    
    return generateNewName(mockPhotoFile, index, pattern);
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default" className="flex items-center gap-2">
          <Edit className="w-4 h-4" />
          Batch Rename ({selectedPhotos.length})
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto glass-card border-0">
        <DialogHeader>
          <DialogTitle>Batch Rename Photos</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Selected Photos Count */}
          <div className="flex items-center gap-2">
            <Badge variant="secondary">{selectedPhotos.length} photos selected</Badge>
          </div>

          {/* Renaming Pattern */}
          <Card className="glass border-0">
            <CardHeader>
              <CardTitle className="text-lg">Rename Pattern</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Prefix and Suffix */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="prefix">Prefix</Label>
                  <Input
                    id="prefix"
                    placeholder="e.g., IMG"
                    value={pattern.prefix}
                    onChange={(e) => setPattern({ ...pattern, prefix: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="suffix">Suffix</Label>
                  <Input
                    id="suffix"
                    placeholder="e.g., edited"
                    value={pattern.suffix}
                    onChange={(e) => setPattern({ ...pattern, suffix: e.target.value })}
                  />
                </div>
              </div>

              {/* Number Format */}
              <div>
                <Label htmlFor="numberFormat">Number Format</Label>
                <Select
                  value={pattern.numberFormat}
                  onValueChange={(value: 'sequential' | 'random' | 'timestamp' | 'none') =>
                    setPattern({ ...pattern, numberFormat: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sequential">Sequential (1, 2, 3...)</SelectItem>
                    <SelectItem value="random">Random Numbers</SelectItem>
                    <SelectItem value="timestamp">Timestamp</SelectItem>
                    <SelectItem value="none">No Numbers</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Start Number (if sequential) */}
              {pattern.numberFormat === 'sequential' && (
                <div>
                  <Label htmlFor="startNumber">Start Number</Label>
                  <Input
                    id="startNumber"
                    type="number"
                    value={pattern.startNumber}
                    onChange={(e) => setPattern({ ...pattern, startNumber: parseInt(e.target.value) || 1 })}
                  />
                </div>
              )}

              {/* Separator */}
              <div>
                <Label htmlFor="separator">Separator</Label>
                <Select
                  value={pattern.separator}
                  onValueChange={(value: string) => setPattern({ ...pattern, separator: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="_">Underscore (_)</SelectItem>
                    <SelectItem value="-">Dash (-)</SelectItem>
                    <SelectItem value=" ">Space ( )</SelectItem>
                    <SelectItem value="none">No Separator</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Case Transform */}
              <div>
                <Label htmlFor="caseTransform">Case Transform</Label>
                <Select
                  value={pattern.caseTransform}
                  onValueChange={(value: 'none' | 'lowercase' | 'uppercase' | 'capitalize') =>
                    setPattern({ ...pattern, caseTransform: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No Change</SelectItem>
                    <SelectItem value="lowercase">lowercase</SelectItem>
                    <SelectItem value="uppercase">UPPERCASE</SelectItem>
                    <SelectItem value="capitalize">Capitalize</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Preview */}
          <Card className="glass border-0">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Preview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {previewNames.map((newName, index) => (
                  <div key={index} className="flex items-center justify-between p-2 glass rounded border-0">
                    <span className="text-sm text-muted-foreground truncate">
                      {selectedPhotos[index]?.original_name}
                    </span>
                    <span className="text-sm font-medium truncate ml-2">
                      {newName}
                    </span>
                  </div>
                ))}
                {selectedPhotos.length > 3 && (
                  <p className="text-sm text-muted-foreground text-center">
                    ...and {selectedPhotos.length - 3} more photos
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleRename} 
              disabled={isRenaming || selectedPhotos.length === 0}
            >
              {isRenaming ? 'Renaming...' : `Rename ${selectedPhotos.length} Photos`}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BatchRenameDialog;