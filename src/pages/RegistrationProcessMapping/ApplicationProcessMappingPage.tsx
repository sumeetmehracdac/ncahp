import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import {
  Layers, GripVertical, Plus, Trash2, Save, CheckCircle2, AlertCircle,
  ChevronRight, Info, Eye, EyeOff, ArrowUpDown, X, Search
} from 'lucide-react';
import { PageShell } from './components/PageShell';
import {
  applicationTypes, allSubProcesses, defaultMappings,
  ApplicationType, Process, ProcessMapping
} from './mockData';

// ─── helpers ────────────────────────────────────────────────────────────────
const processById = Object.fromEntries(allSubProcesses.map(p => [p.id, p]));

function buildProcessList(mappings: ProcessMapping[]): (Process & { sequence: number; mappingId: number })[] {
  return mappings
    .filter(m => m.isActive)
    .sort((a, b) => a.sequence - b.sequence)
    .map(m => ({ ...processById[m.processId], sequence: m.sequence, mappingId: m.mappingId }));
}

// Unified teal badge / dot for all types
const typeBadge = 'bg-teal-50 text-teal-700 border border-teal-200';
const typeDot   = 'bg-teal-500';

// ─── Process Chip ────────────────────────────────────────────────────────────
function ProcessChip({
  process,
  sequence,
  isDragging,
  onRemove,
  isEditMode,
}: {
  process: Process & { sequence: number };
  sequence: number;
  isDragging?: boolean;
  onRemove: () => void;
  isEditMode: boolean;
}) {
  return (
    <div
      className={`group flex items-center gap-3 px-3 py-2.5 rounded-lg border transition-all select-none
        ${isDragging
          ? 'shadow-lg border-teal-300 bg-teal-50 ring-2 ring-teal-200'
          : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-sm'
        }`}
    >
      {isEditMode && (
        <div className="text-gray-300 hover:text-gray-500 cursor-grab active:cursor-grabbing transition-colors">
          <GripVertical size={16} />
        </div>
      )}
      {/* Sequence badge */}
      <span
        className="flex-shrink-0 w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center"
        style={{ background: 'hsl(var(--primary))', color: 'white' }}
      >
        {sequence}
      </span>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-gray-800 truncate">{process.name}</div>
        <div className="text-xs text-gray-400 truncate font-mono">{process.path}</div>
      </div>
      {isEditMode && (
        <button
          onClick={onRemove}
          className="opacity-0 group-hover:opacity-100 flex-shrink-0 p-1 rounded text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all"
          title="Remove step"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}

// ─── Available Process Picker ────────────────────────────────────────────────
function AvailableProcessDrawer({
  availableProcesses,
  onAdd,
  onClose,
}: {
  availableProcesses: Process[];
  onAdd: (process: Process) => void;
  onClose: () => void;
}) {
  const [search, setSearch] = useState('');
  const filtered = availableProcesses.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.path.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="bg-white rounded-xl border shadow-sm overflow-hidden"
      style={{ borderColor: 'hsl(var(--border))' }}
    >
      <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: 'hsl(var(--border))', background: 'hsl(var(--muted))' }}>
        <div>
          <div className="text-sm font-semibold text-gray-800">Available Screens</div>
          <div className="text-xs text-gray-500 mt-0.5">Click to add to the process flow</div>
        </div>
        <button onClick={onClose} className="p-1.5 rounded hover:bg-gray-200 text-gray-400 transition-colors">
          <X size={14} />
        </button>
      </div>

      {/* Search */}
      <div className="p-3 border-b" style={{ borderColor: 'hsl(var(--border))' }}>
        <div className="relative">
          <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-2 text-sm border rounded-lg outline-none focus:border-teal-400 transition-colors"
            style={{ borderColor: 'hsl(var(--border))' }}
            placeholder="Search screens…"
            autoFocus
          />
        </div>
      </div>

      <div className="p-3 space-y-1.5 max-h-80 overflow-y-auto">
        {filtered.length === 0 ? (
          <div className="text-center py-8 text-sm text-gray-400">
            {availableProcesses.length === 0 ? 'All screens are already added' : 'No screens match your search'}
          </div>
        ) : (
          filtered.map(proc => (
            <button
              key={proc.id}
              onClick={() => onAdd(proc)}
              className="w-full flex items-center gap-3 p-2.5 rounded-lg text-left border border-transparent hover:border-teal-200 hover:bg-teal-50 transition-all group"
            >
              <div
                className="w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold"
                style={{ background: 'hsl(var(--primary))', color: 'white', opacity: 0.4 }}
              >
                +
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-700 group-hover:text-teal-700 truncate">{proc.name}</div>
                <div className="text-xs text-gray-400 font-mono truncate">{proc.path}</div>
              </div>
              <Plus size={14} className="text-teal-500 opacity-0 group-hover:opacity-100 flex-shrink-0 transition-opacity" />
            </button>
          ))
        )}
      </div>
    </motion.div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────
type DraftItem = Process & { sequence: number; mappingId: number };

export default function ApplicationProcessMappingPage() {
  const [selectedTypeId, setSelectedTypeId] = useState<number | null>(null);
  const [draftItems, setDraftItems] = useState<DraftItem[]>([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [showAddDrawer, setShowAddDrawer] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savedTypeId, setSavedTypeId] = useState<number | null>(null);

  const selectedType = applicationTypes.find(t => t.id === selectedTypeId);

  const handleSelectType = (id: number) => {
    setSelectedTypeId(id);
    setIsEditMode(false);
    setShowAddDrawer(false);
    const mappings = defaultMappings[id] ?? [];
    setDraftItems(buildProcessList(mappings));
    setSavedTypeId(null);
  };

  const handleEnterEdit = () => {
    setIsEditMode(true);
    setShowAddDrawer(false);
  };

  const handleCancelEdit = () => {
    if (selectedTypeId) {
      const mappings = defaultMappings[selectedTypeId] ?? [];
      setDraftItems(buildProcessList(mappings));
    }
    setIsEditMode(false);
    setShowAddDrawer(false);
  };

  const handleRemove = useCallback((processId: number) => {
    setDraftItems(prev => prev.filter(p => p.id !== processId));
  }, []);

  const handleAddProcess = useCallback((proc: Process) => {
    setDraftItems(prev => {
      const nextSeq = prev.length + 1;
      return [...prev, { ...proc, sequence: nextSeq, mappingId: Date.now() }];
    });
  }, []);

  const handleReorder = (newItems: DraftItem[]) => {
    // Re-assign sequences after reorder
    setDraftItems(newItems.map((item, idx) => ({ ...item, sequence: idx + 1 })));
  };

  const handleSave = async () => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 900));
    setSaving(false);
    setIsEditMode(false);
    setShowAddDrawer(false);
    setSavedTypeId(selectedTypeId);
    setTimeout(() => setSavedTypeId(null), 3000);
  };

  // Available = all SUB processes not already in draftItems
  const availableProcesses = allSubProcesses.filter(
    p => !draftItems.some(d => d.id === p.id)
  );

  const hasChanges = isEditMode && selectedTypeId !== null;

  return (
    <PageShell>
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: 'hsl(var(--primary))' }}
          >
            <Layers size={20} color="white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight" style={{ color: 'hsl(var(--foreground))' }}>
              Application-Process Mapping
            </h1>
            <p className="text-sm mt-0.5" style={{ color: 'hsl(var(--muted-foreground))' }}>
              Configure the default sequence of registration screens for each application type
            </p>
          </div>
        </div>
      </div>

      {/* Info Banner */}
      <div
        className="flex items-start gap-3 p-4 rounded-xl border mb-7 text-sm"
        style={{ background: 'hsl(217 91% 53% / 0.05)', borderColor: 'hsl(217 91% 53% / 0.2)', color: 'hsl(217 91% 35%)' }}
      >
        <Info size={16} className="flex-shrink-0 mt-0.5" />
        <div>
          <strong>Default Mapping</strong> — This configuration applies to all professions unless a profession-specific override is defined in the Profession-Process Mapping module.
          Drag to reorder screens; use the add panel to include additional screens.
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Left: Application Type Selector */}
        <div className="col-span-12 lg:col-span-4 xl:col-span-3 space-y-2">
          <div className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'hsl(var(--muted-foreground))' }}>
            Application Types
          </div>
          {applicationTypes.map(type => {
            const isSelected = selectedTypeId === type.id;
            const mappingCount = (defaultMappings[type.id] ?? []).filter(m => m.isActive).length;

            return (
              <button
                key={type.id}
                onClick={() => handleSelectType(type.id)}
                className={`w-full text-left p-4 rounded-xl border transition-all
                  ${isSelected
                    ? 'bg-white shadow-md border-teal-300'
                    : 'bg-white hover:bg-gray-50 hover:shadow-sm border-gray-100'
                  }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-full mb-2 ${typeBadge}`}>
                      {type.formCode}
                    </div>
                    <div className="text-sm font-semibold text-gray-800 leading-snug">{type.name}</div>
                  </div>
                  <div className="flex-shrink-0 flex items-center gap-1">
                    <span className="text-xs font-semibold text-gray-500">{mappingCount}</span>
                    <span className="text-xs text-gray-400">screens</span>
                    {isSelected && (
                      <ChevronRight size={14} className="text-teal-600 ml-1" />
                    )}
                  </div>
                </div>
                <div className="text-xs text-gray-400 mt-1 line-clamp-2">{type.description}</div>
              </button>
            );
          })}
        </div>

        {/* Right: Process List */}
        <div className="col-span-12 lg:col-span-8 xl:col-span-9">
          {!selectedType ? (
            <div className="h-full flex flex-col items-center justify-center py-24 text-center">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
                style={{ background: 'hsl(var(--primary) / 0.1)' }}
              >
                <Layers size={28} style={{ color: 'hsl(var(--primary))' }} />
              </div>
              <div className="text-lg font-semibold text-gray-700 mb-1">Select an Application Type</div>
              <div className="text-sm text-gray-400 max-w-xs">
                Choose a registration type from the left panel to view and configure its process flow.
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              {/* Header Card */}
              <div className="bg-white rounded-xl border p-5 shadow-sm" style={{ borderColor: 'hsl(var(--border))' }}>
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 rounded-full bg-teal-500" />
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-lg font-bold text-gray-900">{selectedType.name}</h2>
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${typeBadge}`}>
                          {selectedType.formCode}
                        </span>
                        <AnimatePresence>
                          {savedTypeId === selectedTypeId && (
                            <motion.span
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.8 }}
                              className="flex items-center gap-1 text-xs font-medium text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full"
                            >
                              <CheckCircle2 size={11} />
                              Saved
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </div>
                      <div className="text-sm text-gray-500 mt-0.5">
                        {draftItems.length} screen{draftItems.length !== 1 ? 's' : ''} in sequence
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {!isEditMode ? (
                      <button
                        onClick={handleEnterEdit}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all"
                        style={{ background: 'hsl(var(--primary))', color: 'white' }}
                      >
                        <ArrowUpDown size={14} />
                        Edit Sequence
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={handleCancelEdit}
                          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border transition-all hover:bg-gray-50"
                          style={{ borderColor: 'hsl(var(--border))', color: 'hsl(var(--muted-foreground))' }}
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => setShowAddDrawer(s => !s)}
                          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border transition-all
                            ${showAddDrawer
                              ? 'bg-teal-50 border-teal-300 text-teal-700'
                              : 'border-teal-300 text-teal-700 hover:bg-teal-50'}`}
                        >
                          <Plus size={14} />
                          Add Screen
                        </button>
                        <button
                          onClick={handleSave}
                          disabled={saving}
                          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all"
                          style={{ background: 'hsl(var(--accent))', color: 'white', opacity: saving ? 0.7 : 1 }}
                        >
                          {saving ? (
                            <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                          ) : (
                            <Save size={14} />
                          )}
                          {saving ? 'Saving…' : 'Save Changes'}
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Process Flow + Drawer */}
              <div className={`grid gap-4 ${showAddDrawer ? 'grid-cols-5' : 'grid-cols-1'}`}>
                {/* Process list */}
                <div className={showAddDrawer ? 'col-span-3' : 'col-span-1'}>
                  {isEditMode && (
                    <div
                      className="flex items-center gap-2 mb-3 px-3 py-2 rounded-lg text-xs font-medium"
                      style={{ background: 'hsl(var(--accent) / 0.08)', color: 'hsl(var(--accent))' }}
                    >
                      <GripVertical size={12} />
                      Drag rows to reorder · Click × to remove a screen
                    </div>
                  )}

                  {draftItems.length === 0 ? (
                    <div
                      className="border-2 border-dashed rounded-xl p-12 text-center"
                      style={{ borderColor: 'hsl(var(--border))' }}
                    >
                      <div className="text-sm text-gray-400 mb-3">No screens configured</div>
                      {isEditMode && (
                        <button
                          onClick={() => setShowAddDrawer(true)}
                          className="text-sm font-medium px-4 py-2 rounded-lg transition-all"
                          style={{ background: 'hsl(var(--primary))', color: 'white' }}
                        >
                          <Plus size={14} className="inline mr-1" />
                          Add first screen
                        </button>
                      )}
                    </div>
                  ) : isEditMode ? (
                    <Reorder.Group
                      axis="y"
                      values={draftItems}
                      onReorder={handleReorder}
                      className="space-y-2"
                    >
                      {draftItems.map((item, idx) => (
                        <Reorder.Item key={item.id} value={item}>
                          <ProcessChip
                            process={item}
                            sequence={idx + 1}
                            onRemove={() => handleRemove(item.id)}
                            isEditMode={isEditMode}
                          />
                        </Reorder.Item>
                      ))}
                    </Reorder.Group>
                  ) : (
                    <div className="space-y-2">
                      {draftItems.map((item, idx) => (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, y: 4 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.04 }}
                        >
                          <ProcessChip
                            process={item}
                            sequence={idx + 1}
                            onRemove={() => handleRemove(item.id)}
                            isEditMode={false}
                          />
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Add drawer */}
                <div className="col-span-2">
                  <AnimatePresence>
                    {showAddDrawer && (
                      <AvailableProcessDrawer
                        availableProcesses={availableProcesses}
                        onAdd={proc => { handleAddProcess(proc); }}
                        onClose={() => setShowAddDrawer(false)}
                      />
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </PageShell>
  );
}
