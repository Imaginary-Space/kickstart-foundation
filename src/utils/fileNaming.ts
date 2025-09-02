import type { PhotoFile, RenamePattern } from '@/types/photoRenamer';

export const generateNewName = (file: PhotoFile, index: number, pattern: RenamePattern): string => {
  let newName = '';
  
  // Add prefix
  if (pattern.prefix) {
    newName += pattern.prefix;
  }

  // Add separator if we have a prefix and will add more content
  if (newName && (pattern.numberFormat !== 'none' || pattern.suffix)) {
    newName += pattern.separator;
  }

  // Add numbering/dating
  switch (pattern.numberFormat) {
    case 'sequential':
      newName += (pattern.startNumber + index).toString().padStart(3, '0');
      break;
    case 'random':
      newName += Math.random().toString(36).substr(2, 6).toUpperCase();
      break;
    case 'timestamp':
      const date = new Date(file.lastModified);
      newName += date.toISOString().replace(/[:.]/g, '-').split('T')[0];
      break;
    case 'none':
    default:
      // Keep original name without extension
      const originalWithoutExt = file.originalName.replace(/\.[^/.]+$/, '');
      newName += originalWithoutExt;
      break;
  }

  // Add separator if we have content and will add suffix
  if (newName && pattern.suffix) {
    newName += pattern.separator;
  }

  // Add suffix
  if (pattern.suffix) {
    newName += pattern.suffix;
  }

  // Apply transformations
  if (pattern.removeSpaces) {
    newName = newName.replace(/\s+/g, pattern.separator);
  }

  if (pattern.removeSpecialChars) {
    newName = newName.replace(/[^a-zA-Z0-9._-]/g, '');
  }

  // Apply case transform
  switch (pattern.caseTransform) {
    case 'lowercase':
      newName = newName.toLowerCase();
      break;
    case 'uppercase':
      newName = newName.toUpperCase();
      break;
    case 'capitalize':
      newName = newName.split(pattern.separator)
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(pattern.separator);
      break;
  }

  // Add original extension
  const extension = file.originalName.split('.').pop();
  if (extension) {
    newName += '.' + extension;
  }

  return newName || file.originalName;
};
