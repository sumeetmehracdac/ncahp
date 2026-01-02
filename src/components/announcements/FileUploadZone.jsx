import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, FileText, Image, FileSpreadsheet, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const FileUploadZone = ({ files, onFilesChange, maxFiles = 10, maxSizeMB = 10, acceptedTypes = ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.png', '.jpg', '.jpeg'] }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState(null);

  const getFileIcon = (fileName) => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    if (['png', 'jpg', 'jpeg', 'gif', 'webp'].includes(ext || '')) return Image;
    if (['xls', 'xlsx', 'csv'].includes(ext || '')) return FileSpreadsheet;
    return FileText;
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const validateFile = (file) => {
    const ext = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!acceptedTypes.includes(ext)) return `File type ${ext} is not supported`;
    if (file.size > maxSizeMB * 1024 * 1024) return `File size exceeds ${maxSizeMB}MB limit`;
    return null;
  };

  const handleFiles = useCallback((newFiles) => {
    if (!newFiles) return;
    setError(null);

    const validFiles = [];
    const currentCount = files.length;

    Array.from(newFiles).forEach((file, idx) => {
      if (currentCount + validFiles.length >= maxFiles) {
        setError(`Maximum ${maxFiles} files allowed`);
        return;
      }
      const validationError = validateFile(file);
      if (validationError) {
        setError(validationError);
        return;
      }
      validFiles.push({ id: `${Date.now()}-${idx}`, file });
    });

    if (validFiles.length > 0) onFilesChange([...files, ...validFiles]);
  }, [files, maxFiles, onFilesChange]);

  const handleDragOver = useCallback((e) => { e.preventDefault(); setIsDragging(true); }, []);
  const handleDragLeave = useCallback((e) => { e.preventDefault(); setIsDragging(false); }, []);
  const handleDrop = useCallback((e) => { e.preventDefault(); setIsDragging(false); handleFiles(e.dataTransfer.files); }, [handleFiles]);
  const removeFile = useCallback((id) => { onFilesChange(files.filter(f => f.id !== id)); }, [files, onFilesChange]);

  return (
    <div className="space-y-4">
      <motion.div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        animate={{ scale: isDragging ? 1.01 : 1, borderColor: isDragging ? 'hsl(var(--primary))' : 'hsl(var(--border))' }}
        className={`relative rounded-2xl border-2 border-dashed p-8 lg:p-12 transition-all duration-300 ${isDragging ? 'bg-primary/5 border-primary' : 'bg-muted/30 border-border hover:border-primary/50 hover:bg-muted/50'}`}
      >
        <input type="file" multiple accept={acceptedTypes.join(',')} onChange={(e) => handleFiles(e.target.files)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
        <div className="text-center">
          <motion.div animate={{ y: isDragging ? -5 : 0 }} className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4">
            <Upload className="h-8 w-8 text-primary" />
          </motion.div>
          <h4 className="font-display text-lg font-semibold text-foreground mb-2">{isDragging ? 'Drop files here' : 'Drag & drop files here'}</h4>
          <p className="text-sm text-muted-foreground mb-4">or click to browse from your computer</p>
          <div className="flex flex-wrap justify-center gap-2 text-xs text-muted-foreground">
            <span className="px-2 py-1 bg-muted rounded-lg">PDF</span>
            <span className="px-2 py-1 bg-muted rounded-lg">DOC</span>
            <span className="px-2 py-1 bg-muted rounded-lg">DOCX</span>
            <span className="px-2 py-1 bg-muted rounded-lg">XLS</span>
            <span className="px-2 py-1 bg-muted rounded-lg">PNG</span>
            <span className="px-2 py-1 bg-muted rounded-lg">JPG</span>
          </div>
          <p className="text-xs text-muted-foreground mt-3">Max {maxFiles} files, up to {maxSizeMB}MB each</p>
        </div>
      </motion.div>

      <AnimatePresence>
        {error && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex items-center gap-2 p-3 rounded-xl bg-destructive/10 text-destructive text-sm">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {files.length > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-2">
            <p className="text-sm font-medium text-foreground">Uploaded files ({files.length}/{maxFiles})</p>
            <div className="grid gap-2">
              {files.map((uploadedFile) => {
                const FileIcon = getFileIcon(uploadedFile.file.name);
                return (
                  <motion.div key={uploadedFile.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex items-center gap-3 p-3 rounded-xl bg-card border border-border group hover:border-primary/30 transition-colors">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <FileIcon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{uploadedFile.file.name}</p>
                      <p className="text-xs text-muted-foreground">{formatFileSize(uploadedFile.file.size)}</p>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => removeFile(uploadedFile.id)} className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0 rounded-lg hover:bg-destructive/10 hover:text-destructive">
                      <X className="h-4 w-4" />
                    </Button>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FileUploadZone;
