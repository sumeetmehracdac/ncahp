import { useCallback, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Highlight from '@tiptap/extension-highlight';
import Link from '@tiptap/extension-link';
import CharacterCount from '@tiptap/extension-character-count';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Highlighter,
  List,
  ListOrdered,
  Quote,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Link as LinkIcon,
  Unlink,
  Undo2,
  Redo2,
  Type,
  Heading1,
  Heading2,
  Heading3,
  Minus,
  CornerDownLeft,
  Sparkles,
  Check,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  maxLength?: number;
  className?: string;
}

interface ToolbarButtonProps {
  onClick: () => void;
  isActive?: boolean;
  disabled?: boolean;
  tooltip: string;
  children: React.ReactNode;
}

const ToolbarButton = ({ onClick, isActive, disabled, tooltip, children }: ToolbarButtonProps) => (
  <TooltipProvider delayDuration={300}>
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          onClick={onClick}
          disabled={disabled}
          className={cn(
            'relative p-2 rounded-lg transition-all duration-200',
            'hover:bg-accent/10 active:scale-95',
            'disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30',
            isActive && 'bg-primary/10 text-primary shadow-sm'
          )}
        >
          {children}
          {isActive && (
            <motion.div
              layoutId="activeIndicator"
              className="absolute inset-0 rounded-lg border-2 border-primary/30"
              initial={false}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            />
          )}
        </button>
      </TooltipTrigger>
      <TooltipContent side="top" className="text-xs">
        {tooltip}
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
);

const ToolbarDivider = () => (
  <div className="w-px h-6 bg-border/60 mx-1" />
);

const RichTextEditor = ({
  value,
  onChange,
  placeholder = 'Start writing...',
  maxLength = 2000,
  className,
}: RichTextEditorProps) => {
  const [linkUrl, setLinkUrl] = useState('');
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Placeholder.configure({
        placeholder,
        emptyEditorClass: 'is-editor-empty',
      }),
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Highlight.configure({
        multicolor: false,
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-primary underline underline-offset-2 hover:text-primary-dark cursor-pointer',
        },
      }),
      CharacterCount.configure({
        limit: maxLength,
      }),
    ],
    content: value,
    editorProps: {
      attributes: {
        class: cn(
          'prose prose-sm sm:prose max-w-none',
          'prose-headings:font-display prose-headings:text-foreground prose-headings:font-semibold',
          'prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg',
          'prose-p:text-foreground prose-p:leading-relaxed',
          'prose-strong:text-foreground prose-strong:font-semibold',
          'prose-em:text-foreground',
          'prose-blockquote:border-l-4 prose-blockquote:border-primary/30 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-muted-foreground',
          'prose-ul:list-disc prose-ol:list-decimal',
          'prose-li:text-foreground',
          'focus:outline-none min-h-[200px] px-4 py-3'
        ),
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    onFocus: () => setIsFocused(true),
    onBlur: () => setIsFocused(false),
  });

  const setLink = useCallback(() => {
    if (!editor) return;

    if (linkUrl === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    const url = linkUrl.startsWith('http') ? linkUrl : `https://${linkUrl}`;
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    setLinkUrl('');
    setShowLinkInput(false);
  }, [editor, linkUrl]);

  const removeLink = useCallback(() => {
    if (!editor) return;
    editor.chain().focus().extendMarkRange('link').unsetLink().run();
  }, [editor]);

  if (!editor) {
    return null;
  }

  const characterCount = editor.storage.characterCount.characters();
  const percentage = Math.round((characterCount / maxLength) * 100);
  const isNearLimit = percentage > 80;
  const isAtLimit = percentage >= 100;

  return (
    <div className={cn('relative', className)}>
      {/* Main Editor Container */}
      <motion.div
        className={cn(
          'relative rounded-2xl border-2 transition-all duration-300 overflow-hidden',
          'bg-gradient-to-b from-background to-muted/20',
          isFocused
            ? 'border-primary/40 shadow-lg shadow-primary/5'
            : 'border-border hover:border-border/80'
        )}
        animate={{
          boxShadow: isFocused
            ? '0 0 0 4px hsl(var(--primary) / 0.08), 0 10px 40px -10px hsl(var(--primary) / 0.15)'
            : '0 0 0 0px transparent, 0 4px 20px -10px hsl(var(--foreground) / 0.08)',
        }}
        transition={{ duration: 0.2 }}
      >
        {/* Toolbar */}
        <div className="relative">
          {/* Ambient glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-accent/5 pointer-events-none" />
          
          <div className="relative flex items-center gap-0.5 p-2 border-b border-border/50 bg-muted/30 backdrop-blur-sm overflow-x-auto scrollbar-hide">
            {/* Text Style Group */}
            <div className="flex items-center gap-0.5 px-1">
              <ToolbarButton
                onClick={() => editor.chain().focus().toggleBold().run()}
                isActive={editor.isActive('bold')}
                tooltip="Bold (Ctrl+B)"
              >
                <Bold className="h-4 w-4" />
              </ToolbarButton>
              <ToolbarButton
                onClick={() => editor.chain().focus().toggleItalic().run()}
                isActive={editor.isActive('italic')}
                tooltip="Italic (Ctrl+I)"
              >
                <Italic className="h-4 w-4" />
              </ToolbarButton>
              <ToolbarButton
                onClick={() => editor.chain().focus().toggleUnderline().run()}
                isActive={editor.isActive('underline')}
                tooltip="Underline (Ctrl+U)"
              >
                <UnderlineIcon className="h-4 w-4" />
              </ToolbarButton>
              <ToolbarButton
                onClick={() => editor.chain().focus().toggleStrike().run()}
                isActive={editor.isActive('strike')}
                tooltip="Strikethrough"
              >
                <Strikethrough className="h-4 w-4" />
              </ToolbarButton>
              <ToolbarButton
                onClick={() => editor.chain().focus().toggleHighlight().run()}
                isActive={editor.isActive('highlight')}
                tooltip="Highlight"
              >
                <Highlighter className="h-4 w-4" />
              </ToolbarButton>
            </div>

            <ToolbarDivider />

            {/* Heading Group */}
            <div className="flex items-center gap-0.5 px-1">
              <ToolbarButton
                onClick={() => editor.chain().focus().setParagraph().run()}
                isActive={editor.isActive('paragraph')}
                tooltip="Paragraph"
              >
                <Type className="h-4 w-4" />
              </ToolbarButton>
              <ToolbarButton
                onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                isActive={editor.isActive('heading', { level: 1 })}
                tooltip="Heading 1"
              >
                <Heading1 className="h-4 w-4" />
              </ToolbarButton>
              <ToolbarButton
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                isActive={editor.isActive('heading', { level: 2 })}
                tooltip="Heading 2"
              >
                <Heading2 className="h-4 w-4" />
              </ToolbarButton>
              <ToolbarButton
                onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                isActive={editor.isActive('heading', { level: 3 })}
                tooltip="Heading 3"
              >
                <Heading3 className="h-4 w-4" />
              </ToolbarButton>
            </div>

            <ToolbarDivider />

            {/* List & Block Group */}
            <div className="flex items-center gap-0.5 px-1">
              <ToolbarButton
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                isActive={editor.isActive('bulletList')}
                tooltip="Bullet List"
              >
                <List className="h-4 w-4" />
              </ToolbarButton>
              <ToolbarButton
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                isActive={editor.isActive('orderedList')}
                tooltip="Numbered List"
              >
                <ListOrdered className="h-4 w-4" />
              </ToolbarButton>
              <ToolbarButton
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                isActive={editor.isActive('blockquote')}
                tooltip="Quote"
              >
                <Quote className="h-4 w-4" />
              </ToolbarButton>
              <ToolbarButton
                onClick={() => editor.chain().focus().setHorizontalRule().run()}
                tooltip="Horizontal Rule"
              >
                <Minus className="h-4 w-4" />
              </ToolbarButton>
            </div>

            <ToolbarDivider />

            {/* Alignment Group */}
            <div className="flex items-center gap-0.5 px-1">
              <ToolbarButton
                onClick={() => editor.chain().focus().setTextAlign('left').run()}
                isActive={editor.isActive({ textAlign: 'left' })}
                tooltip="Align Left"
              >
                <AlignLeft className="h-4 w-4" />
              </ToolbarButton>
              <ToolbarButton
                onClick={() => editor.chain().focus().setTextAlign('center').run()}
                isActive={editor.isActive({ textAlign: 'center' })}
                tooltip="Align Center"
              >
                <AlignCenter className="h-4 w-4" />
              </ToolbarButton>
              <ToolbarButton
                onClick={() => editor.chain().focus().setTextAlign('right').run()}
                isActive={editor.isActive({ textAlign: 'right' })}
                tooltip="Align Right"
              >
                <AlignRight className="h-4 w-4" />
              </ToolbarButton>
            </div>

            <ToolbarDivider />

            {/* Link Group */}
            <div className="flex items-center gap-0.5 px-1">
              <ToolbarButton
                onClick={() => setShowLinkInput(!showLinkInput)}
                isActive={editor.isActive('link') || showLinkInput}
                tooltip="Add Link"
              >
                <LinkIcon className="h-4 w-4" />
              </ToolbarButton>
              {editor.isActive('link') && (
                <ToolbarButton
                  onClick={removeLink}
                  tooltip="Remove Link"
                >
                  <Unlink className="h-4 w-4" />
                </ToolbarButton>
              )}
            </div>

            <ToolbarDivider />

            {/* History Group */}
            <div className="flex items-center gap-0.5 px-1">
              <ToolbarButton
                onClick={() => editor.chain().focus().undo().run()}
                disabled={!editor.can().undo()}
                tooltip="Undo (Ctrl+Z)"
              >
                <Undo2 className="h-4 w-4" />
              </ToolbarButton>
              <ToolbarButton
                onClick={() => editor.chain().focus().redo().run()}
                disabled={!editor.can().redo()}
                tooltip="Redo (Ctrl+Shift+Z)"
              >
                <Redo2 className="h-4 w-4" />
              </ToolbarButton>
            </div>

            {/* Spacer */}
            <div className="flex-1" />

            {/* Character Count */}
            <div className="flex items-center gap-2 px-2">
              <div
                className={cn(
                  'flex items-center gap-1.5 text-xs font-medium transition-colors',
                  isAtLimit ? 'text-destructive' : isNearLimit ? 'text-warning' : 'text-muted-foreground'
                )}
              >
                <span>{characterCount.toLocaleString()}</span>
                <span className="text-muted-foreground/60">/</span>
                <span className="text-muted-foreground/60">{maxLength.toLocaleString()}</span>
              </div>
              <div className="relative w-12 h-1.5 rounded-full bg-border overflow-hidden">
                <motion.div
                  className={cn(
                    'absolute left-0 top-0 h-full rounded-full',
                    isAtLimit ? 'bg-destructive' : isNearLimit ? 'bg-warning' : 'bg-primary'
                  )}
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(percentage, 100)}%` }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                />
              </div>
            </div>
          </div>

          {/* Link Input */}
          <AnimatePresence>
            {showLinkInput && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden border-b border-border/50"
              >
                <div className="flex items-center gap-2 p-2 bg-muted/20">
                  <LinkIcon className="h-4 w-4 text-muted-foreground ml-2 flex-shrink-0" />
                  <Input
                    type="url"
                    placeholder="Enter URL and press Enter..."
                    value={linkUrl}
                    onChange={(e) => setLinkUrl(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        setLink();
                      }
                      if (e.key === 'Escape') {
                        setShowLinkInput(false);
                        setLinkUrl('');
                      }
                    }}
                    className="h-8 flex-1 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-muted-foreground/60"
                    autoFocus
                  />
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={setLink}
                    className="h-7 px-2 hover:bg-success/10 hover:text-success"
                  >
                    <Check className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      setShowLinkInput(false);
                      setLinkUrl('');
                    }}
                    className="h-7 px-2 hover:bg-destructive/10 hover:text-destructive"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Editor Content */}
        <div className="relative">
          <EditorContent editor={editor} />
          
          {/* Empty State Overlay */}
          <AnimatePresence>
            {characterCount === 0 && !isFocused && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
              >
                <div className="text-center p-8">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center mx-auto mb-4">
                    <Sparkles className="h-8 w-8 text-primary/60" />
                  </div>
                  <p className="text-muted-foreground font-medium">Click to start writing</p>
                  <p className="text-muted-foreground/60 text-sm mt-1">
                    Use the toolbar above for formatting
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer with Tips */}
        <div className="flex items-center justify-between gap-4 px-4 py-2 border-t border-border/30 bg-muted/20">
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <kbd className="px-1.5 py-0.5 rounded bg-muted font-mono text-[10px]">Ctrl</kbd>
              <span>+</span>
              <kbd className="px-1.5 py-0.5 rounded bg-muted font-mono text-[10px]">B</kbd>
              <span className="text-muted-foreground/60">Bold</span>
            </span>
            <span className="flex items-center gap-1.5">
              <kbd className="px-1.5 py-0.5 rounded bg-muted font-mono text-[10px]">Ctrl</kbd>
              <span>+</span>
              <kbd className="px-1.5 py-0.5 rounded bg-muted font-mono text-[10px]">I</kbd>
              <span className="text-muted-foreground/60">Italic</span>
            </span>
            <span className="hidden sm:flex items-center gap-1.5">
              <kbd className="px-1.5 py-0.5 rounded bg-muted font-mono text-[10px]">Enter</kbd>
              <span className="text-muted-foreground/60">New line</span>
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground/60">
            <CornerDownLeft className="h-3 w-3" />
            <span>Select text for quick formatting</span>
          </div>
        </div>
      </motion.div>

      {/* Editor Styles */}
      <style>{`
        .ProseMirror {
          outline: none;
        }
        
        .ProseMirror p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: left;
          color: hsl(var(--muted-foreground) / 0.5);
          pointer-events: none;
          height: 0;
        }
        
        .ProseMirror mark {
          background-color: hsl(var(--warning) / 0.3);
          border-radius: 0.125rem;
          padding: 0.125rem 0.25rem;
          margin: 0 -0.125rem;
        }
        
        .ProseMirror hr {
          border: none;
          border-top: 2px solid hsl(var(--border));
          margin: 1.5rem 0;
        }
        
        .ProseMirror blockquote {
          border-left: 4px solid hsl(var(--primary) / 0.3);
          padding-left: 1rem;
          margin-left: 0;
          font-style: italic;
          color: hsl(var(--muted-foreground));
        }
        
        .ProseMirror ul,
        .ProseMirror ol {
          padding-left: 1.5rem;
        }
        
        .ProseMirror h1,
        .ProseMirror h2,
        .ProseMirror h3 {
          font-family: var(--font-display);
          font-weight: 600;
          line-height: 1.3;
          margin-top: 1.5rem;
          margin-bottom: 0.5rem;
        }
        
        .ProseMirror h1:first-child,
        .ProseMirror h2:first-child,
        .ProseMirror h3:first-child {
          margin-top: 0;
        }
        
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default RichTextEditor;
