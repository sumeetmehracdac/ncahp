import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Share2, Search, Sparkles, Quote } from 'lucide-react';
import { toast } from 'sonner';

const TextSelectionToolbar = ({ containerRef, onAskAI }) => {
  const [selectedText, setSelectedText] = useState('');
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const toolbarRef = useRef(null);

  const handleCopy = useCallback(async (text) => {
    await navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
    setIsVisible(false);
  }, []);

  const handleShare = useCallback(async (text) => {
    const url = window.location.href;
    if (navigator.share) {
      try { await navigator.share({ title: 'Shared from NCAHP', text, url }); } catch {}
    } else {
      await navigator.clipboard.writeText(`"${text}"\n\n${url}`);
      toast.success('Quote and link copied');
    }
    setIsVisible(false);
  }, []);

  const handleSearch = useCallback((text) => {
    window.open(`https://www.google.com/search?q=${encodeURIComponent(text)}`, '_blank');
    setIsVisible(false);
  }, []);

  const handleAskAI = useCallback((text) => {
    if (onAskAI) onAskAI(text);
    setIsVisible(false);
  }, [onAskAI]);

  const handleQuote = useCallback(async (text) => {
    await navigator.clipboard.writeText(`"${text}"`);
    toast.success('Quote copied');
    setIsVisible(false);
  }, []);

  const actions = [
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
        setTimeout(() => { const cur = window.getSelection(); if (!cur || cur.isCollapsed) setIsVisible(false); }, 150);
        return;
      }
      const text = selection.toString().trim();
      if (text.length < 3) return;
      const range = selection.getRangeAt(0);
      const container = containerRef.current;
      if (!container || !container.contains(range.commonAncestorContainer)) { setIsVisible(false); return; }
      const rect = range.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      setSelectedText(text);
      setPosition({ x: rect.left + rect.width / 2 - containerRect.left, y: rect.top - containerRect.top - 8 });
      setIsVisible(true);
    };
    document.addEventListener('selectionchange', handleSelectionChange);
    document.addEventListener('mouseup', handleSelectionChange);
    return () => { document.removeEventListener('selectionchange', handleSelectionChange); document.removeEventListener('mouseup', handleSelectionChange); };
  }, [containerRef]);

  useEffect(() => {
    const handleScroll = () => setIsVisible(false);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div ref={toolbarRef} initial={{ opacity: 0, y: 8, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 4, scale: 0.98 }} transition={{ duration: 0.15, ease: 'easeOut' }} className="absolute z-50 pointer-events-auto" style={{ left: position.x, top: position.y, transform: 'translate(-50%, -100%)' }}>
          <div className="relative">
            <div className="flex items-center gap-0.5 px-1.5 py-1.5 bg-foreground/95 backdrop-blur-sm rounded-xl shadow-2xl border border-background/10">
              {actions.map((action, idx) => (
                <button key={action.label} onClick={(e) => { e.preventDefault(); e.stopPropagation(); action.onClick(selectedText); }} className={`group relative flex items-center gap-1.5 px-3 py-2 rounded-lg text-background/70 transition-all duration-200 ease-out text-xs font-medium hover:text-background ${action.label === 'Ask AI' ? 'bg-gradient-to-r from-accent/25 to-accent-hover/20 text-background hover:from-accent/40 hover:to-accent-hover/35' : 'hover:bg-gradient-to-r hover:from-background/10 hover:via-background/15 hover:to-background/10'}`} title={action.label}>
                  <span className={`transition-transform duration-200 ${action.label === 'Ask AI' ? 'group-hover:scale-110' : 'group-hover:scale-105'}`}>{action.icon}</span>
                  <span className="hidden sm:inline">{action.label}</span>
                  {idx < actions.length - 1 && <span className="absolute right-0 top-1/2 -translate-y-1/2 w-px h-4 bg-background/15" />}
                </button>
              ))}
            </div>
            <div className="absolute left-1/2 -translate-x-1/2 -bottom-1.5 w-3 h-3 bg-foreground/95 rotate-45 rounded-sm shadow-lg" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TextSelectionToolbar;
