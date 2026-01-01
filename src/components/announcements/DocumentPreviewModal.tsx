import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Download, X, ExternalLink, ZoomIn, ZoomOut, RotateCw } from 'lucide-react';
import { useState } from 'react';

interface DocumentPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  document: {
    name: string;
    url: string;
    size: string;
    type?: string;
  } | null;
}

const DocumentPreviewModal = ({ isOpen, onClose, document }: DocumentPreviewModalProps) => {
  const [zoom, setZoom] = useState(100);
  const [rotation, setRotation] = useState(0);

  if (!document) return null;

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 25, 200));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 25, 50));
  const handleRotate = () => setRotation(prev => (prev + 90) % 360);
  const handleOpenExternal = () => window.open(document.url, '_blank');

  const isPdf = document.type === 'pdf' || document.name.toLowerCase().endsWith('.pdf');
  const isImage = ['jpg', 'jpeg', 'png', 'gif', 'webp'].some(ext => 
    document.name.toLowerCase().endsWith(`.${ext}`)
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-[95vw] h-[85vh] flex flex-col p-0 gap-0">
        {/* Header */}
        <DialogHeader className="px-4 py-3 border-b border-border flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0 pr-4">
              <DialogTitle className="text-base font-semibold truncate">
                {document.name}
              </DialogTitle>
              <p className="text-xs text-muted-foreground mt-0.5">{document.size}</p>
            </div>
            
            {/* Toolbar */}
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleZoomOut}
                disabled={zoom <= 50}
                className="h-8 w-8 p-0"
                title="Zoom out"
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
              <span className="text-xs text-muted-foreground w-12 text-center">{zoom}%</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleZoomIn}
                disabled={zoom >= 200}
                className="h-8 w-8 p-0"
                title="Zoom in"
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
              
              <div className="w-px h-5 bg-border mx-1" />
              
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRotate}
                className="h-8 w-8 p-0"
                title="Rotate"
              >
                <RotateCw className="h-4 w-4" />
              </Button>
              
              <div className="w-px h-5 bg-border mx-1" />
              
              <Button
                variant="ghost"
                size="sm"
                onClick={handleOpenExternal}
                className="h-8 w-8 p-0"
                title="Open in new tab"
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
              
              <a href={document.url} download>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  title="Download"
                >
                  <Download className="h-4 w-4" />
                </Button>
              </a>
            </div>
          </div>
        </DialogHeader>

        {/* Preview Area */}
        <div className="flex-1 overflow-auto bg-muted/50 flex items-center justify-center p-4">
          {isPdf ? (
            <div 
              className="w-full h-full flex items-center justify-center"
              style={{ 
                transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
                transformOrigin: 'center center',
                transition: 'transform 0.2s ease'
              }}
            >
              {/* PDF embed - in production use react-pdf or similar */}
              <iframe
                src={`${document.url}#toolbar=0&navpanes=0`}
                className="w-full h-full rounded-lg border border-border bg-white"
                title={document.name}
              />
            </div>
          ) : isImage ? (
            <div 
              className="flex items-center justify-center"
              style={{ 
                transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
                transformOrigin: 'center center',
                transition: 'transform 0.2s ease'
              }}
            >
              <img 
                src={document.url} 
                alt={document.name}
                className="max-w-full max-h-full object-contain rounded-lg shadow-lg"
              />
            </div>
          ) : (
            // Fallback for unsupported file types
            <div className="text-center p-8">
              <div className="w-20 h-20 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
                <Download className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Preview not available</h3>
              <p className="text-sm text-muted-foreground mb-4">
                This file type cannot be previewed in the browser.
              </p>
              <div className="flex items-center justify-center gap-3">
                <a href={document.url} download>
                  <Button variant="default" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Download File
                  </Button>
                </a>
                <Button variant="outline" size="sm" onClick={handleOpenExternal}>
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Open in New Tab
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-border flex items-center justify-between flex-shrink-0 bg-card">
          <p className="text-xs text-muted-foreground">
            Use the toolbar above to zoom, rotate, or download the document
          </p>
          <Button variant="outline" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DocumentPreviewModal;
