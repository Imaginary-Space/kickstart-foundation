import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Settings } from 'lucide-react';
import type { PhotoFile, RenameHistory } from '@/types/photoRenamer';

interface FileStatsProps {
  files: PhotoFile[];
  selectedFiles: Set<string>;
  history: RenameHistory[];
}

export const FileStats: React.FC<FileStatsProps> = ({
  files,
  selectedFiles,
  history,
}) => {
  return (
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
  );
};