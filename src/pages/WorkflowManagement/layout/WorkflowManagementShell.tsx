import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Settings2, ChevronDown, ChevronRight,
  Zap, Shield, GitBranch, Layers, Monitor, Wrench,
  Search,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { schemes } from '../data/mockData';
import { useWMStore } from '../store/workflowManagementStore';

const proposalLayers = [
  {
    label: 'Foundation',
    icon: Zap,
    pages: [
      { path: 'actions', label: 'Actions', desc: 'Action master list' },
      { path: 'conditions', label: 'Condition Variables', desc: 'Branching logic' },
      { path: 'roles', label: 'Roles & Committees', desc: 'Role–committee mapping' },
      { path: 'statuses', label: 'Status Master', desc: 'Status vocabulary' },
      { path: 'pi-status', label: 'PI Status Mapping', desc: 'Applicant-facing text' },
    ],
  },
  {
    label: 'Permissions',
    icon: Shield,
    pages: [
      { path: 'permissions', label: 'Role–Action Permissions', desc: 'Permission matrix' },
    ],
  },
  {
    label: 'Routing',
    icon: GitBranch,
    pages: [
      { path: 'routing', label: 'Next Role After Action', desc: 'Routing rules' },
    ],
  },
  {
    label: 'Orchestration',
    icon: Layers,
    pages: [
      { path: 'approval-master', label: 'Approval Master', desc: 'Approval chain rules' },
    ],
  },
  {
    label: 'Presentation',
    icon: Monitor,
    pages: [
      { path: 'file-view', label: 'File View Config', desc: 'Document view settings' },
    ],
  },
  {
    label: 'Utility',
    icon: Wrench,
    pages: [
      { path: 'copy', label: 'Workflow Copy', desc: 'Copy between schemes' },
    ],
  },
];

const monitoringLayers = [
  {
    label: 'Routing',
    icon: GitBranch,
    pages: [
      { path: 'monitoring/routing', label: 'Monitoring Routing', desc: 'Post-sanction routing' },
    ],
  },
  {
    label: 'Permissions',
    icon: Shield,
    pages: [
      { path: 'monitoring/permissions', label: 'Monitoring Permissions', desc: 'Monitoring access' },
    ],
  },
  {
    label: 'Orchestration',
    icon: Layers,
    pages: [
      { path: 'monitoring/approval', label: 'Monitoring Approval', desc: 'Monitoring rules' },
    ],
  },
];

const WorkflowManagementShell = () => {
  const navigate = useNavigate();
  const { selectedScheme, setSelectedScheme, selectedTrack, setSelectedTrack } = useWMStore();
  const [expandedLayers, setExpandedLayers] = useState<Set<string>>(
    new Set(proposalLayers.map((l) => l.label))
  );

  const toggleLayer = (label: string) => {
    setExpandedLayers((prev) => {
      const next = new Set(prev);
      next.has(label) ? next.delete(label) : next.add(label);
      return next;
    });
  };

  const layers = selectedTrack === 'proposal' ? proposalLayers : monitoringLayers;

  return (
    <div className="min-h-screen bg-muted/30 flex">
      {/* Sidebar */}
      <aside className="w-[272px] shrink-0 bg-card border-r border-border flex flex-col sticky top-0 h-screen overflow-hidden">
        {/* Module header */}
        <div className="p-4 border-b border-border bg-primary/[0.03]">
          <div className="flex items-center gap-3 mb-3">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 shrink-0 text-muted-foreground hover:text-foreground"
              onClick={() => navigate('/')}
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <Settings2 className="w-4 h-4 text-primary" />
              </div>
              <div className="min-w-0">
                <h1 className="text-sm font-bold text-foreground truncate">Workflow Config</h1>
                <p className="text-[10px] text-muted-foreground">Administration</p>
              </div>
            </div>
          </div>

          {/* Scheme selector */}
          <Select value={selectedScheme} onValueChange={setSelectedScheme}>
            <SelectTrigger className="h-8 text-xs bg-background border-border">
              <SelectValue placeholder="All Schemes" />
            </SelectTrigger>
            <SelectContent className="bg-card">
              <SelectItem value="all" className="text-xs">All Schemes</SelectItem>
              {schemes.map((s) => (
                <SelectItem key={s.id} value={s.id} className="text-xs">{s.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Track tabs */}
        <div className="flex border-b border-border">
          {[
            { id: 'proposal' as const, label: 'Proposal' },
            { id: 'monitoring' as const, label: 'Monitoring' },
          ].map((track) => (
            <button
              key={track.id}
              onClick={() => setSelectedTrack(track.id)}
              className={cn(
                'flex-1 py-2.5 text-xs font-medium transition-all relative',
                selectedTrack === track.id
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {track.label}
              {selectedTrack === track.id && (
                <motion.div
                  layoutId="track-indicator"
                  className="absolute bottom-0 left-2 right-2 h-0.5 bg-primary rounded-full"
                />
              )}
            </button>
          ))}
        </div>

        {/* Navigation layers */}
        <nav className="flex-1 overflow-y-auto py-2 scrollbar-hidden">
          {layers.map((layer) => {
            const expanded = expandedLayers.has(layer.label);
            const Icon = layer.icon;
            return (
              <div key={layer.label} className="mb-0.5">
                <button
                  onClick={() => toggleLayer(layer.label)}
                  className="w-full flex items-center gap-2 px-4 py-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span className="flex-1 text-left">{layer.label}</span>
                  {expanded ? (
                    <ChevronDown className="w-3 h-3" />
                  ) : (
                    <ChevronRight className="w-3 h-3" />
                  )}
                </button>
                <AnimatePresence initial={false}>
                  {expanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.15 }}
                      className="overflow-hidden"
                    >
                      {layer.pages.map((page) => (
                        <NavLink
                          key={page.path}
                          to={`/workflow-management/${page.path}`}
                          className={({ isActive }) =>
                            cn(
                              'flex items-center gap-3 pl-10 pr-4 py-2 text-sm transition-all group relative',
                              isActive
                                ? 'text-primary bg-primary/[0.06] font-medium'
                                : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                            )
                          }
                        >
                          {({ isActive }) => (
                            <>
                              {isActive && (
                                <div className="absolute left-0 top-1 bottom-1 w-[3px] rounded-r-full bg-primary" />
                              )}
                              <div className="flex-1 min-w-0">
                                <p className="text-[13px] truncate">{page.label}</p>
                              </div>
                            </>
                          )}
                        </NavLink>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-3 border-t border-border">
          <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-primary/5 text-primary">
            <Search className="w-3.5 h-3.5" />
            <span className="text-[11px] font-medium">⌘K to search</span>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 min-w-0 overflow-y-auto">
        <div className="max-w-[1200px] mx-auto p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default WorkflowManagementShell;
