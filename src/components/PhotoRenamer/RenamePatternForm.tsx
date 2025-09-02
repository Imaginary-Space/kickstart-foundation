import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RotateCw, Eye, EyeOff } from 'lucide-react';
import type { RenamePattern } from '@/types/photoRenamer';

interface RenamePatternFormProps {
  pattern: RenamePattern;
  onPatternChange: (pattern: RenamePattern) => void;
  onApplyRenaming: () => void;
  selectedFilesCount: number;
  showPreview: boolean;
  onTogglePreview: () => void;
}

export const RenamePatternForm: React.FC<RenamePatternFormProps> = ({
  pattern,
  onPatternChange,
  onApplyRenaming,
  selectedFilesCount,
  showPreview,
  onTogglePreview,
}) => {
  const updatePattern = (updates: Partial<RenamePattern>) => {
    onPatternChange({ ...pattern, ...updates });
  };

  return (
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
              onChange={(e) => updatePattern({ prefix: e.target.value })}
              placeholder="e.g., vacation, photo"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="suffix">Suffix</Label>
            <Input
              id="suffix"
              value={pattern.suffix}
              onChange={(e) => updatePattern({ suffix: e.target.value })}
              placeholder="e.g., edited, final"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>Number Format</Label>
            <Select
              value={pattern.numberFormat}
              onValueChange={(value: any) => updatePattern({ numberFormat: value })}
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
              onChange={(e) => updatePattern({ startNumber: parseInt(e.target.value) || 1 })}
              disabled={pattern.numberFormat !== 'sequential'}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="separator">Separator</Label>
            <Select
              value={pattern.separator}
              onValueChange={(value) => updatePattern({ separator: value })}
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
              onValueChange={(value: any) => updatePattern({ caseTransform: value })}
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
                onCheckedChange={(checked) => updatePattern({ removeSpaces: !!checked })}
              />
              <Label htmlFor="removeSpaces">Remove spaces</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="removeSpecialChars"
                checked={pattern.removeSpecialChars}
                onCheckedChange={(checked) => updatePattern({ removeSpecialChars: !!checked })}
              />
              <Label htmlFor="removeSpecialChars">Remove special characters</Label>
            </div>
          </div>
        </div>

        <Separator />

        <div className="flex gap-4">
          <Button onClick={onApplyRenaming} disabled={selectedFilesCount === 0}>
            <RotateCw className="w-4 h-4" />
            Apply Renaming ({selectedFilesCount} files)
          </Button>
          
          <Button variant="ghost" onClick={onTogglePreview}>
            {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            {showPreview ? 'Hide' : 'Show'} Preview
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};