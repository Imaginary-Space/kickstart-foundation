export interface PhotoFile {
  id: string;
  file: File;
  originalName: string;
  newName: string;
  preview: string;
  size: number;
  lastModified: number;
  dimensions?: { width: number; height: number };
  processed: boolean;
  error?: string;
  selected: boolean;
}

export interface RenamePattern {
  prefix: string;
  suffix: string;
  numberFormat: 'sequential' | 'random' | 'timestamp' | 'none';
  startNumber: number;
  dateFormat: string;
  caseTransform: 'none' | 'lowercase' | 'uppercase' | 'capitalize';
  separator: string;
  removeSpaces: boolean;
  removeSpecialChars: boolean;
}

export interface RenameHistory {
  id: string;
  timestamp: number;
  action: string;
  files: Array<{ oldName: string; newName: string }>;
}

export type PreviewMode = 'grid' | 'list';
export type SortBy = 'name' | 'size' | 'date';
export type SortOrder = 'asc' | 'desc';
export type FilterType = 'all' | 'processed' | 'unprocessed' | 'errors';