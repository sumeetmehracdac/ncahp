import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Download,
  Package,
  Grid3X3,
  List,
  Filter,
  Check,
  Sparkles,
  FileImage,
  ChevronDown,
  Stethoscope
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import TopUtilityBar from '@/components/layout/TopUtilityBar';
import Header from '@/components/layout/Header';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { toast } from 'sonner';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { professionCategories as dataProfessionCategories, allProfessions as dataAllProfessions, getIconPath } from '@/data/professions';

// Use the data from professions.ts
const professionCategories = dataProfessionCategories;

// Flatten all professions with iconPath computed
const allProfessions = dataAllProfessions.map(prof => ({
  ...prof,
  iconPath: getIconPath(prof.iconFile),
}));

// Profession Icon component
const ProfessionIcon = ({ profession, className = "w-8 h-8" }) => {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <Stethoscope
        className={className}
        style={{ color: profession.color }}
      />
    );
  }

  return (
    <img
      src={profession.iconPath}
      alt={profession.name}
      className={cn(className, "object-contain")}
      onError={() => setHasError(true)}
    />
  );
};

const ProfessionIconsGallery = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedIcons, setSelectedIcons] = useState([]);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [isDownloading, setIsDownloading] = useState(false);

  // Filter professions based on search and category filters
  const filteredProfessions = useMemo(() => {
    let result = allProfessions;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        prof =>
          prof.name.toLowerCase().includes(query) ||
          prof.categoryName.toLowerCase().includes(query)
      );
    }

    if (selectedCategories.length > 0) {
      result = result.filter(prof => selectedCategories.includes(prof.categoryId));
    }

    return result;
  }, [searchQuery, selectedCategories]);

  // Toggle icon selection
  const toggleIconSelection = (professionId) => {
    setSelectedIcons(prev =>
      prev.includes(professionId)
        ? prev.filter(id => id !== professionId)
        : [...prev, professionId]
    );
  };

  // Select all visible icons
  const selectAllVisible = () => {
    const visibleIds = filteredProfessions.map(p => p.id);
    setSelectedIcons(visibleIds);
  };

  // Clear selection
  const clearSelection = () => {
    setSelectedIcons([]);
  };

  // Download single icon as PNG
  const downloadPng = async (profession) => {
    try {
      const response = await fetch(profession.iconPath);
      const blob = await response.blob();
      const fileName = `${profession.name.replace(/[^a-zA-Z0-9]/g, '_')}.png`;
      saveAs(blob, fileName);
      toast.success(`Downloaded ${fileName}`);
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download icon');
    }
  };

  // Bulk download selected icons
  const downloadBulk = async () => {
    const iconsToDownload = selectedIcons.length > 0
      ? allProfessions.filter(p => selectedIcons.includes(p.id))
      : filteredProfessions;

    if (iconsToDownload.length === 0) {
      toast.error('No icons to download');
      return;
    }

    setIsDownloading(true);
    const zip = new JSZip();

    try {
      for (const profession of iconsToDownload) {
        try {
          const response = await fetch(profession.iconPath);
          const blob = await response.blob();
          const fileName = profession.name.replace(/[^a-zA-Z0-9]/g, '_');
          zip.file(`${fileName}.png`, blob);
        } catch (err) {
          console.warn(`Failed to fetch icon for ${profession.name}`);
        }
      }

      const content = await zip.generateAsync({ type: 'blob' });
      saveAs(content, `NCAHP_Profession_Icons.zip`);
      toast.success(`Downloaded ${iconsToDownload.length} icons`);
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download icons');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <TopUtilityBar />
      <Header />
      <Navbar />

      <main className="flex-1">
        {/* Hero Header */}
        <div className="relative overflow-hidden">
          <div
            className="absolute inset-0 opacity-95"
            style={{
              background: 'linear-gradient(135deg, hsl(175, 79%, 27%) 0%, hsl(180, 84%, 16%) 100%)',
            }}
          />
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djZoNnYtNmgtNnptMC0zMHY2aDZ2LTZoLTZ6bTAgMTJ2Nmg2di02aC02em0wIDEydjZoNnYtNmgtNnptLTEyLTEydjZoNnYtNmgtNnptMCAxMnY2aDZ2LTZoLTZ6bTAtMjR2Nmg2di02aC02em0wIDM2djZoNnYtNmgtNnptLTEyLTEydjZoNnYtNmgtNnptMCAxMnY2aDZ2LTZoLTZ6bTAtMjR2Nmg2di02aC02em0wLTEydjZoNnYtNmgtNnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30" />
          <div className="absolute inset-0" style={{ background: 'rgba(4, 20, 30, 0.12)' }} />

          <div className="relative container mx-auto px-4 py-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-4">
                <Sparkles className="w-4 h-4 text-white" />
                <span className="text-white/90 text-sm font-medium">NCAHP Profession Icons</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-display font-bold text-white mb-3">
                Profession Icons Gallery
              </h1>
              <p className="text-white/80 max-w-2xl mx-auto text-lg font-medium drop-shadow-sm">
                Download curated icons for all 57 Allied Healthcare Professions in PNG format
              </p>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-8 flex flex-wrap justify-center gap-4"
            >
              <div className="bg-white/10 backdrop-blur-sm rounded-xl px-6 py-3 text-center">
                <div className="text-2xl font-bold text-white">{allProfessions.length}</div>
                <div className="text-white/70 text-sm">Professions</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl px-6 py-3 text-center">
                <div className="text-2xl font-bold text-white">{professionCategories.length}</div>
                <div className="text-white/70 text-sm">Categories</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl px-6 py-3 text-center">
                <div className="text-2xl font-bold text-white">PNG</div>
                <div className="text-white/70 text-sm">Format</div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="bg-card border-b border-border sticky top-0 z-40 shadow-sm">
          <div className="container mx-auto px-4 py-3">
            <div className="flex flex-wrap items-center justify-between gap-4">
              {/* Search and Filters */}
              <div className="flex items-center gap-3 flex-1 min-w-[280px]">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search professions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Filter className="w-4 h-4" />
                      Categories
                      {selectedCategories.length > 0 && (
                        <Badge variant="secondary" className="ml-1 px-1.5 py-0 text-xs">
                          {selectedCategories.length}
                        </Badge>
                      )}
                      <ChevronDown className="w-3 h-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-72 max-h-80 overflow-y-auto">
                    {professionCategories.map(cat => (
                      <DropdownMenuCheckboxItem
                        key={cat.id}
                        checked={selectedCategories.includes(cat.id)}
                        onCheckedChange={(checked) => {
                          setSelectedCategories(prev =>
                            checked
                              ? [...prev, cat.id]
                              : prev.filter(id => id !== cat.id)
                          );
                        }}
                      >
                        <span className="truncate text-sm">{cat.name}</span>
                      </DropdownMenuCheckboxItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* View Mode and Actions */}
              <div className="flex items-center gap-2">
                <div className="flex items-center border rounded-lg p-0.5 bg-muted/50">
                  <Button
                    variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                    className="h-8 px-3"
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                    className="h-8 px-3"
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </div>

                {selectedIcons.length > 0 && (
                  <Badge variant="secondary" className="py-1.5">
                    {selectedIcons.length} selected
                  </Badge>
                )}

                <Button variant="outline" size="sm" onClick={selectAllVisible}>
                  Select All
                </Button>

                {selectedIcons.length > 0 && (
                  <Button variant="ghost" size="sm" onClick={clearSelection}>
                    Clear
                  </Button>
                )}

                <Button
                  size="sm"
                  className="bg-primary hover:bg-primary/90 gap-2"
                  disabled={isDownloading}
                  onClick={downloadBulk}
                >
                  <Package className="w-4 h-4" />
                  {isDownloading ? 'Downloading...' : 'Bulk Download'}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Icons Gallery */}
        <div className="container mx-auto px-4 py-8">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-muted-foreground text-sm">
              Showing {filteredProfessions.length} of {allProfessions.length} professions
            </p>
          </div>

          {viewMode === 'grid' ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              <AnimatePresence mode="popLayout">
                {filteredProfessions.map((profession, index) => {
                  const isSelected = selectedIcons.includes(profession.id);

                  return (
                    <motion.div
                      key={profession.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.2, delay: index * 0.02 }}
                      className={cn(
                        'group relative bg-card border rounded-2xl p-4 transition-all cursor-pointer hover:shadow-lg hover:border-primary/30',
                        isSelected && 'ring-2 ring-primary border-primary bg-primary/5'
                      )}
                      onClick={() => toggleIconSelection(profession.id)}
                    >
                      {/* Selection Indicator */}
                      <div
                        className={cn(
                          'absolute top-2 right-2 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all',
                          isSelected
                            ? 'bg-primary border-primary text-white'
                            : 'border-muted-foreground/30 group-hover:border-primary/50'
                        )}
                      >
                        {isSelected && <Check className="w-3 h-3" />}
                      </div>

                      {/* Icon */}
                      <div
                        className="w-16 h-16 mx-auto mb-3 rounded-xl flex items-center justify-center"
                        style={{
                          background: `linear-gradient(135deg, ${profession.color}15, ${profession.color}25)`,
                        }}
                      >
                        <ProfessionIcon
                          profession={profession}
                          className="w-8 h-8"
                        />
                      </div>

                      {/* Name */}
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <p className="text-xs font-medium text-center line-clamp-2 text-foreground/80">
                              {profession.name}
                            </p>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{profession.name}</p>
                            <p className="text-xs text-muted-foreground">{profession.categoryName}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>

                      {/* Download Actions - Show on Hover */}
                      <div className="absolute bottom-2 left-2 right-2 flex justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="secondary"
                          size="sm"
                          className="h-6 px-2 text-xs"
                          onClick={(e) => {
                            e.stopPropagation();
                            downloadPng(profession);
                          }}
                        >
                          <FileImage className="w-3 h-3 mr-1" />
                          PNG
                        </Button>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          ) : (
            <div className="space-y-2">
              <AnimatePresence mode="popLayout">
                {filteredProfessions.map((profession, index) => {
                  const isSelected = selectedIcons.includes(profession.id);

                  return (
                    <motion.div
                      key={profession.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2, delay: index * 0.01 }}
                      className={cn(
                        'group flex items-center gap-4 bg-card border rounded-xl p-3 transition-all cursor-pointer hover:shadow-md hover:border-primary/30',
                        isSelected && 'ring-2 ring-primary border-primary bg-primary/5'
                      )}
                      onClick={() => toggleIconSelection(profession.id)}
                    >
                      {/* Selection Checkbox */}
                      <div
                        className={cn(
                          'w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all shrink-0',
                          isSelected
                            ? 'bg-primary border-primary text-white'
                            : 'border-muted-foreground/30'
                        )}
                      >
                        {isSelected && <Check className="w-3 h-3" />}
                      </div>

                      {/* Icon */}
                      <div
                        className="w-12 h-12 rounded-lg flex items-center justify-center shrink-0"
                        style={{
                          background: `linear-gradient(135deg, ${profession.color}15, ${profession.color}25)`,
                        }}
                      >
                        <ProfessionIcon
                          profession={profession}
                          className="w-6 h-6"
                        />
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm text-foreground truncate">
                          {profession.name}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {profession.categoryName}
                        </p>
                      </div>

                      {/* Download Actions */}
                      <div className="flex items-center gap-2 shrink-0">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 gap-1.5"
                          onClick={(e) => {
                            e.stopPropagation();
                            downloadPng(profession);
                          }}
                        >
                          <FileImage className="w-3.5 h-3.5" />
                          PNG
                        </Button>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}

          {filteredProfessions.length === 0 && (
            <div className="text-center py-16">
              <Search className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No professions found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search or filter criteria
              </p>
            </div>
          )}
        </div>

        {/* Categories Summary */}
        <div className="bg-muted/30 border-t">
          <div className="container mx-auto px-4 py-8">
            <h2 className="text-xl font-semibold mb-6 text-center">Browse by Category</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
              {professionCategories.map((cat) => (
                <motion.button
                  key={cat.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setSelectedCategories([cat.id]);
                    window.scrollTo({ top: 400, behavior: 'smooth' });
                  }}
                  className={cn(
                    'p-4 rounded-xl border bg-card text-left transition-all hover:shadow-md',
                    selectedCategories.includes(cat.id) && 'ring-2 ring-primary'
                  )}
                >
                  <h3 className="font-medium text-sm line-clamp-2 mb-1">{cat.name}</h3>
                  <p className="text-xs text-muted-foreground">
                    {cat.professions.length} profession{cat.professions.length !== 1 ? 's' : ''}
                  </p>
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProfessionIconsGallery;
