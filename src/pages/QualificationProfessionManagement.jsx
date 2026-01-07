import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  GraduationCap, 
  Award, 
  Stethoscope, 
  Clock, 
  FolderTree, 
  GitBranch,
  Users,
  ChevronRight,
  Plus,
  Search,
  LayoutGrid,
  List
} from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { cn } from '@/lib/utils';

// Import sub-modules
import DegreeTypeManager from '@/components/qualification/DegreeTypeManager';
import DegreeManager from '@/components/qualification/DegreeManager';
import SpecialisationManager from '@/components/qualification/SpecialisationManager';
import QualificationManager from '@/components/qualification/QualificationManager';
import CategoryManager from '@/components/qualification/CategoryManager';
import SubcategoryManager from '@/components/qualification/SubcategoryManager';
import CategorySubcategoryMapping from '@/components/qualification/CategorySubcategoryMapping';
import ProfessionManager from '@/components/qualification/ProfessionManager';

const MODULES = [
  {
    id: 'degree-type',
    label: 'Degree Type',
    icon: GraduationCap,
    description: 'Manage degree types (Bachelor\'s, Master\'s, Diploma, etc.)',
    color: 'from-teal-500/20 to-teal-600/10',
    borderColor: 'border-teal-500/30',
    group: 'qualification'
  },
  {
    id: 'degree',
    label: 'Degree',
    icon: Award,
    description: 'Manage degrees (MBBS, BDS, B.Pharm, etc.)',
    color: 'from-emerald-500/20 to-emerald-600/10',
    borderColor: 'border-emerald-500/30',
    group: 'qualification'
  },
  {
    id: 'specialisation',
    label: 'Specialisation',
    icon: Stethoscope,
    description: 'Manage medical specialisations',
    color: 'from-cyan-500/20 to-cyan-600/10',
    borderColor: 'border-cyan-500/30',
    group: 'qualification'
  },
  {
    id: 'qualification',
    label: 'Qualification',
    icon: Clock,
    description: 'Combine degree type, degree, specialisation & duration',
    color: 'from-primary/20 to-primary-dark/10',
    borderColor: 'border-primary/30',
    group: 'qualification'
  },
  {
    id: 'category',
    label: 'Category',
    icon: FolderTree,
    description: 'Manage profession categories',
    color: 'from-slate-500/20 to-slate-600/10',
    borderColor: 'border-slate-400/30',
    group: 'profession'
  },
  {
    id: 'subcategory',
    label: 'Sub-Category',
    icon: GitBranch,
    description: 'Manage profession sub-categories',
    color: 'from-zinc-500/20 to-zinc-600/10',
    borderColor: 'border-zinc-400/30',
    group: 'profession'
  },
  {
    id: 'category-mapping',
    label: 'Category Mapping',
    icon: GitBranch,
    description: 'Map categories to sub-categories (1:N)',
    color: 'from-amber-500/20 to-amber-600/10',
    borderColor: 'border-amber-500/30',
    group: 'profession'
  },
  {
    id: 'profession',
    label: 'Profession',
    icon: Users,
    description: 'Define professions with category, sub-category & qualification',
    color: 'from-primary/25 to-primary-dark/15',
    borderColor: 'border-primary/40',
    group: 'profession'
  }
];

const QualificationProfessionManagement = () => {
  const [activeModule, setActiveModule] = useState('degree-type');
  const [viewMode, setViewMode] = useState('grid');

  const qualificationModules = MODULES.filter(m => m.group === 'qualification');
  const professionModules = MODULES.filter(m => m.group === 'profession');

  const renderActiveModule = () => {
    switch (activeModule) {
      case 'degree-type':
        return <DegreeTypeManager />;
      case 'degree':
        return <DegreeManager />;
      case 'specialisation':
        return <SpecialisationManager />;
      case 'qualification':
        return <QualificationManager />;
      case 'category':
        return <CategoryManager />;
      case 'subcategory':
        return <SubcategoryManager />;
      case 'category-mapping':
        return <CategorySubcategoryMapping />;
      case 'profession':
        return <ProfessionManager />;
      default:
        return <DegreeTypeManager />;
    }
  };

  const activeModuleData = MODULES.find(m => m.id === activeModule);

  return (
    <div className="min-h-screen flex flex-col bg-muted">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-hero text-primary-foreground py-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-5" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h1 className="text-3xl md:text-4xl font-display font-bold mb-3">
              Qualification & Profession Management
            </h1>
            <p className="text-primary-foreground/80 max-w-2xl mx-auto text-lg">
              Configure degree types, qualifications, categories, and profession mappings for the healthcare registry
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-[320px_1fr] gap-6">
          
          {/* Sidebar Navigation */}
          <aside className="space-y-6">
            {/* Qualification Building Blocks */}
            <div className="bg-card rounded-xl border border-border shadow-card overflow-hidden">
              <div className="px-4 py-3 bg-gradient-to-r from-primary/5 to-transparent border-b border-border">
                <h3 className="font-display font-semibold text-foreground flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-primary" />
                  Qualification Building Blocks
                </h3>
              </div>
              <nav className="p-2 space-y-1">
                {qualificationModules.map((module, index) => (
                  <motion.button
                    key={module.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => setActiveModule(module.id)}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 text-left group",
                      activeModule === module.id
                        ? "bg-primary text-primary-foreground shadow-md"
                        : "hover:bg-muted text-foreground"
                    )}
                  >
                    <div className={cn(
                      "w-8 h-8 rounded-lg flex items-center justify-center transition-colors",
                      activeModule === module.id
                        ? "bg-primary-foreground/20"
                        : "bg-muted group-hover:bg-primary/10"
                    )}>
                      <module.icon className={cn(
                        "w-4 h-4",
                        activeModule === module.id ? "text-primary-foreground" : "text-primary"
                      )} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="font-medium text-sm block truncate">{module.label}</span>
                    </div>
                    <ChevronRight className={cn(
                      "w-4 h-4 transition-transform",
                      activeModule === module.id ? "text-primary-foreground" : "text-muted-foreground opacity-0 group-hover:opacity-100"
                    )} />
                  </motion.button>
                ))}
              </nav>
            </div>

            {/* Profession Configuration */}
            <div className="bg-card rounded-xl border border-border shadow-card overflow-hidden">
              <div className="px-4 py-3 bg-gradient-to-r from-accent/5 to-transparent border-b border-border">
                <h3 className="font-display font-semibold text-foreground flex items-center gap-2">
                  <Users className="w-4 h-4 text-accent" />
                  Profession Configuration
                </h3>
              </div>
              <nav className="p-2 space-y-1">
                {professionModules.map((module, index) => (
                  <motion.button
                    key={module.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: (index + 4) * 0.05 }}
                    onClick={() => setActiveModule(module.id)}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 text-left group",
                      activeModule === module.id
                        ? "bg-primary text-primary-foreground shadow-md"
                        : "hover:bg-muted text-foreground"
                    )}
                  >
                    <div className={cn(
                      "w-8 h-8 rounded-lg flex items-center justify-center transition-colors",
                      activeModule === module.id
                        ? "bg-primary-foreground/20"
                        : "bg-muted group-hover:bg-primary/10"
                    )}>
                      <module.icon className={cn(
                        "w-4 h-4",
                        activeModule === module.id ? "text-primary-foreground" : "text-primary"
                      )} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="font-medium text-sm block truncate">{module.label}</span>
                    </div>
                    <ChevronRight className={cn(
                      "w-4 h-4 transition-transform",
                      activeModule === module.id ? "text-primary-foreground" : "text-muted-foreground opacity-0 group-hover:opacity-100"
                    )} />
                  </motion.button>
                ))}
              </nav>
            </div>

            {/* Quick Stats */}
            <div className="bg-card rounded-xl border border-border shadow-card p-4">
              <h3 className="font-display font-semibold text-foreground text-sm mb-3">Quick Overview</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-muted rounded-lg p-3 text-center">
                  <span className="text-2xl font-bold text-primary">--</span>
                  <p className="text-xs text-muted-foreground mt-1">Qualifications</p>
                </div>
                <div className="bg-muted rounded-lg p-3 text-center">
                  <span className="text-2xl font-bold text-accent">--</span>
                  <p className="text-xs text-muted-foreground mt-1">Professions</p>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Panel */}
          <section className="bg-card rounded-xl border border-border shadow-card overflow-hidden">
            {/* Module Header */}
            <div className="px-6 py-4 border-b border-border bg-gradient-to-r from-muted/50 to-transparent flex items-center justify-between">
              <div className="flex items-center gap-3">
                {activeModuleData && (
                  <>
                    <div className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br",
                      activeModuleData.color,
                      activeModuleData.borderColor,
                      "border"
                    )}>
                      <activeModuleData.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h2 className="font-display font-semibold text-lg text-foreground">
                        {activeModuleData.label}
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        {activeModuleData.description}
                      </p>
                    </div>
                  </>
                )}
              </div>
              
              {/* View Toggle */}
              <div className="flex items-center gap-2 bg-muted rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={cn(
                    "p-1.5 rounded transition-colors",
                    viewMode === 'grid' ? "bg-card shadow-sm text-primary" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={cn(
                    "p-1.5 rounded transition-colors",
                    viewMode === 'list' ? "bg-card shadow-sm text-primary" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Module Content */}
            <div className="p-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeModule}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  {renderActiveModule()}
                </motion.div>
              </AnimatePresence>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default QualificationProfessionManagement;
