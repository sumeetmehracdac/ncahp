import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Share2, Search, Sparkles, Quote, Highlighter } from 'lucide-react';
import { toast } from 'sonner';

interface ToolbarAction {
  icon: React.ReactNode;
  label: string;
  onClick: (text: string) => void;
}

interface TextSelectionToolbarProps {
  containerRef: React.RefObject<HTMLElement>;
  onAskAI?: (text: string) => void;
}

const TextSelectionToolbar = ({ containerRef, onAskAI }: TextSelectionToolbarProps) => {
  const [selectedText, setSelectedText] = useState('');
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const toolbarRef = useRef<HTMLDivElement>(null);

  const handleCopy = useCallback(async (text: string) => {
    await navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
    setIsVisible(false);
  }, []);

  const handleShare = useCallback(async (text: string) => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Shared from NCAHP',
          text: text,
          url,
        });
      } catch {
        // User cancelled
      }
    } else {
      await navigator.clipboard.writeText(`"${text}"\n\n${url}`);
      toast.success('Quote and link copied');
    }
    setIsVisible(false);
  }, []);

  const handleSearch = useCallback((text: string) => {
    const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(text)}`;
    window.open(searchUrl, '_blank');
    setIsVisible(false);
  }, []);

  const handleAskAI = useCallback((text: string) => {
    if (onAskAI) {
      onAskAI(text);
    } else {
      toast.info('AI assistant coming soon');
    }
    setIsVisible(false);
  }, [onAskAI]);

  const handleQuote = useCallback(async (text: string) => {
    const formattedQuote = `"${text}"`;
    await navigator.clipboard.writeText(formattedQuote);
    toast.success('Quote copied');
    setIsVisible(false);
  }, []);

  const actions: ToolbarAction[] = [
    { icon: <Copy className="h-3.5 w-3.5" />, label: 'Copy', onClick: handleCopy },
    { icon: <Quote className="h-3.5 w-3.5" />, label: 'Quote', onClick: handleQuote },
    { icon: <Share2 className="h-3.5 w-3.5" />, label: 'Share', onClick: handleShare },
    { icon: <Search className="h-3.5 w-3.5" />, label: 'Search', onClick: handleSearch },
    { icon: <Sparkles className="h-3.5 w-3.5" />, label: 'Ask AI', onClick: handleAskAI },
  ];

  useEffect(() => {
    const handleSelectionChange = () => {
      const selection = window.getSelection();
      
      if (!selection || selection.isCollapsed || !selection.toString().trim()) {
        // Delay hiding to allow clicking toolbar buttons
        setTimeout(() => {
          const currentSelection = window.getSelection();
          if (!currentSelection || currentSelection.isCollapsed) {
            setIsVisible(false);
          }
        }, 150);
        return;
      }

      const text = selection.toString().trim();
      if (text.length < 3) return;

      // Check if selection is within container
      const range = selection.getRangeAt(0);
      const container = containerRef.current;
      
      if (!container || !container.contains(range.commonAncestorContainer)) {
        setIsVisible(false);
        return;
      }

      const rect = range.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      
      // Position toolbar above the selection, centered
      const x = rect.left + rect.width / 2 - containerRect.left;
      const y = rect.top - containerRect.top - 8;

      setSelectedText(text);
      setPosition({ x, y });
      setIsVisible(true);
    };

    document.addEventListener('selectionchange', handleSelectionChange);
    document.addEventListener('mouseup', handleSelectionChange);

    return () => {
      document.removeEventListener('selectionchange', handleSelectionChange);
      document.removeEventListener('mouseup', handleSelectionChange);
    };
  }, [containerRef]);

  // Hide on scroll
  useEffect(() => {
    const handleScroll = () => setIsVisible(false);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          ref={toolbarRef}
          initial={{ opacity: 0, y: 8, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 4, scale: 0.98 }}
          transition={{ duration: 0.15, ease: 'easeOut' }}
          className="absolute z-50 pointer-events-auto"
          style={{
            left: position.x,
            top: position.y,
            transform: 'translate(-50%, -100%)',
          }}
        >
          {/* Toolbar container */}
          <div className="relative">
            {/* Main toolbar */}
            <div className="flex items-center gap-0.5 px-1 py-1 bg-foreground rounded-lg shadow-xl border border-border/10">
              {actions.map((action, idx) => (
                <button
                  key={action.label}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    action.onClick(selectedText);
                  }}
                  className={`
                    group relative flex items-center gap-1.5 px-2.5 py-1.5 rounded-md
                    text-background/80 hover:text-background hover:bg-background/15
                    transition-all duration-150 text-xs font-medium
                    ${action.label === 'Ask AI' ? 'bg-accent/20 text-accent-foreground hover:bg-accent/30' : ''}
                  `}
                  title={action.label}
                >
                  {action.icon}
                  <span className="hidden sm:inline">{action.label}</span>
                  
                  {/* Divider */}
                  {idx < actions.length - 1 && (
                    <span className="absolute right-0 top-1/2 -translate-y-1/2 w-px h-4 bg-background/20" />
                  )}
                </button>
              ))}
            </div>
            
            {/* Arrow pointer */}
            <div className="absolute left-1/2 -translate-x-1/2 -bottom-1.5 w-3 h-3 bg-foreground rotate-45 rounded-sm" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TextSelectionToolbar;
