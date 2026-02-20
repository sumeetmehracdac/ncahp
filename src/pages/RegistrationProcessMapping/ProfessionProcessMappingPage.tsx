import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import {
  GitBranch, GripVertical, Plus, Save, CheckCircle2,
  RotateCcw, ChevronRight, Info, X, Search, AlertTriangle,
  Sparkles, Users, Shield
} from 'lucide-react';
import { PageShell } from './components/PageShell';
import {
  applicationTypes, allSubProcesses, defaultMappings,
  professionMappingStatuses, customProfessionMappings,
  ApplicationType, Process, ProcessMapping, ProfessionMappingStatus
} from './mockData';

// ─── helpers ────────────────────────────────────────────────────────────────
const processById = Object.fromEntries(allSubProcesses.map(p => [p.id, p]));

function buildProcessList(mappings: ProcessMapping[]): (Process & { sequence: number; mappingId: number })[] {
  return mappings
    .filter(m => m.isActive)
    .sort((a, b) => a.sequence - b.sequence)
    .map(m => ({ ...processById[m.processId], sequence: m.sequence, mappingId: m.mappingId }));
}

const typeColorMap: Record<string, { badge: string; dot: string; cardLeft: string }> = {
  teal:   { badge: 'bg-teal-50 text-teal-700 border border-teal-200',   dot: 'bg-teal-500',   cardLeft: 'border-l-teal-500' },
  blue:   { badge: 'bg-blue-50 text-blue-700 border border-blue-200',   dot: 'bg-blue-500',   cardLeft: 'border-l-blue-500' },
  orange: { badge: 'bg-orange-50 text-orange-700 border border-orange-200', dot: 'bg-orange-500', cardLeft: 'border-l-orange-500' },
  purple: { badge: 'bg-purple-50 text-purple-700 border border-purple-200', dot: 'bg-purple-500', cardLeft: 'border-l-purple-500' },
  indigo: { badge: 'bg-indigo-50 text-indigo-700 border border-indigo-200', dot: 'bg-indigo-500', cardLeft: 'border-l-indigo-500' },
};

type DraftItem = Process & { sequence: number; mappingId: number };

// ─── Process Chip ─────────────────────────────────────────────────────────
function ProcessChip({
  process, sequence, isEditMode, onRemove, isCustom
}: {
  process: Process & { sequence: number };
  sequence: number;
  isEditMode: boolean;
  onRemove: () => void;
  isCustom: boolean;
}) {
  return (
    <div className={`group flex items-center gap-3 px-3 py-2.5 rounded-lg border transition-all select-none bg-white
      ${isEditMode ? 'border-gray-200 hover:border-gray-300 hover:shadow-sm cursor-grab active:cursor-grabbing' : 'border-gray-200'}`}
    >
      {isEditMode && (
        <div className="text-gray-300 hover:text-gray-500 transition-colors">
          <GripVertical size={15} />
        </div>
      )}
      <span
        className="flex-shrink-0 w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center"
        style={{ background: 'hsl(var(--primary))', color: 'white' }}
      >
        {sequence}
      </span>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-gray-800 truncate">{process.name}</div>
        <div className="text-xs text-gray-400 font-mono truncate">{process.path}</div>
      </div>
      {!isCustom && !isEditMode && (
        <span className="text-xs text-gray-400 bg-gray-50 border border-gray-200 px-1.5 py-0.5 rounded flex-shrink-0">
          default
        </span>
      )}
      {isEditMode && (
        <button
          onClick={onRemove}
          className="opacity-0 group-hover:opacity-100 flex-shrink-0 p-1 rounded text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}

// ─── Available Picker ─────────────────────────────────────────────────────
function AddProcessDrawer({
  available, onAdd, onClose
}: { available: Process[]; onAdd: (p: Process) => void; onClose: () => void; }) {
  const [search, setSearch] = useState('');
  const filtered = available.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.path.toLowerCase().includes(search.toLowerCase())
  );
  return (
    <motion.div
      initial={{ opacity: 0, x: 16 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 16 }}
      className="bg-white rounded-xl border shadow-sm overflow-hidden"
      style={{ borderColor: 'hsl(var(--border))' }}
    >
      <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: 'hsl(var(--border))', background: 'hsl(var(--muted))' }}>
        <div>
          <div className="text-sm font-semibold text-gray-800">Available Screens</div>
          <div className="text-xs text-gray-500 mt-0.5">Click to append</div>
        </div>
        <button onClick={onClose} className="p-1.5 rounded hover:bg-gray-200 text-gray-400 transition-colors">
          <X size={14} />
        </button>
      </div>
      <div className="p-3 border-b" style={{ borderColor: 'hsl(var(--border))' }}>
        <div className="relative">
          <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-sm border rounded-lg outline-none focus:border-teal-400 transition-colors"
            style={{ borderColor: 'hsl(var(--border))' }}
            placeholder="Search…"
            autoFocus
          />
        </div>
      </div>
      <div className="p-2 space-y-1 max-h-72 overflow-y-auto">
        {filtered.length === 0 ? (
          <div className="text-center py-6 text-sm text-gray-400">
            {available.length === 0 ? 'All screens added' : 'No results'}
          </div>
        ) : filtered.map(p => (
          <button key={p.id} onClick={() => onAdd(p)}
            className="w-full flex items-center gap-2.5 p-2.5 rounded-lg text-left hover:bg-teal-50 hover:border-teal-200 border border-transparent transition-all group"
          >
            <div className="w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold"
              style={{ background: 'hsl(var(--primary) / 0.15)', color: 'hsl(var(--primary))' }}>
              +
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-medium text-gray-700 group-hover:text-teal-700 truncate">{p.name}</div>
              <div className="text-xs text-gray-400 font-mono truncate">{p.path}</div>
            </div>
          </button>
        ))}
      </div>
    </motion.div>
  );
}

// ─── Reset Confirmation ─────────────────────────────────────────────────
function ResetConfirmDialog({
  professionName, onConfirm, onCancel
}: { professionName: string; onConfirm: () => void; onCancel: () => void; }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-white rounded-xl border shadow-xl p-6 max-w-sm w-full"
      style={{ borderColor: 'hsl(var(--border))' }}
    >
      <div className="flex items-start gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center flex-shrink-0">
          <AlertTriangle size={18} className="text-amber-600" />
        </div>
        <div>
          <div className="text-base font-bold text-gray-900">Reset to Default?</div>
          <div className="text-sm text-gray-500 mt-1">
            All custom process overrides for <strong>{professionName}</strong> will be permanently removed.
            The default application mapping will apply going forward.
          </div>
        </div>
      </div>
      <div className="flex gap-2 justify-end">
        <button onClick={onCancel}
          className="px-4 py-2 text-sm font-medium border rounded-lg hover:bg-gray-50 transition-colors"
          style={{ borderColor: 'hsl(var(--border))', color: 'hsl(var(--muted-foreground))' }}
        >
          Cancel
        </button>
        <button onClick={onConfirm}
          className="px-4 py-2 text-sm font-bold rounded-lg text-white transition-colors"
          style={{ background: 'hsl(var(--destructive))' }}
        >
          Reset to Default
        </button>
      </div>
    </motion.div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────
export default function ProfessionProcessMappingPage() {
  const [selectedTypeId, setSelectedTypeId] = useState<number | null>(null);
  const [selectedProfessionId, setSelectedProfessionId] = useState<number | null>(null);
  const [draftItems, setDraftItems] = useState<DraftItem[]>([]);
  const [isCustom, setIsCustom] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [showAddDrawer, setShowAddDrawer] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savedKey, setSavedKey] = useState<string | null>(null);
  const [resetTarget, setResetTarget] = useState<ProfessionMappingStatus | null>(null);
  const [professionSearch, setProfessionSearch] = useState('');

  const selectedType = applicationTypes.find(t => t.id === selectedTypeId);
  const colors = selectedType ? typeColorMap[selectedType.color] : null;
  const professions = selectedTypeId ? (professionMappingStatuses[selectedTypeId] ?? []) : [];

  const filteredProfessions = professions.filter(p =>
    p.professionName.toLowerCase().includes(professionSearch.toLowerCase()) ||
    p.professionShortName.toLowerCase().includes(professionSearch.toLowerCase())
  );

  const selectedProfession = professions.find(p => p.professionId === selectedProfessionId);
  const customCount = professions.filter(p => p.hasCustomMapping).length;

  const handleSelectType = (id: number) => {
    setSelectedTypeId(id);
    setSelectedProfessionId(null);
    setDraftItems([]);
    setIsEditMode(false);
    setShowAddDrawer(false);
    setProfessionSearch('');
  };

  const handleSelectProfession = (prof: ProfessionMappingStatus) => {
    setSelectedProfessionId(prof.professionId);
    setIsEditMode(false);
    setShowAddDrawer(false);
    setSavedKey(null);

    if (!selectedTypeId) return;
    const key = `${selectedTypeId}-${prof.professionId}`;
    const custom = customProfessionMappings[key];
    if (custom && prof.hasCustomMapping) {
      setDraftItems(buildProcessList(custom));
      setIsCustom(true);
    } else {
      const defaults = defaultMappings[selectedTypeId] ?? [];
      setDraftItems(buildProcessList(defaults));
      setIsCustom(false);
    }
  };

  const handleReorder = (newItems: DraftItem[]) => {
    setDraftItems(newItems.map((item, idx) => ({ ...item, sequence: idx + 1 })));
  };

  const handleRemove = useCallback((processId: number) => {
    setDraftItems(prev => prev.filter(p => p.id !== processId));
  }, []);

  const handleAddProcess = useCallback((proc: Process) => {
    setDraftItems(prev => [...prev, { ...proc, sequence: prev.length + 1, mappingId: Date.now() }]);
  }, []);

  const handleSave = async () => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 900));
    setSaving(false);
    setIsEditMode(false);
    setShowAddDrawer(false);
    setIsCustom(true);
    const key = `${selectedTypeId}-${selectedProfessionId}`;
    setSavedKey(key);
    setTimeout(() => setSavedKey(null), 3000);
  };

  const handleCancelEdit = () => {
    if (selectedTypeId && selectedProfessionId) {
      const key = `${selectedTypeId}-${selectedProfessionId}`;
      const custom = customProfessionMappings[key];
      if (custom && isCustom) {
        setDraftItems(buildProcessList(custom));
      } else {
        setDraftItems(buildProcessList(defaultMappings[selectedTypeId] ?? []));
      }
    }
    setIsEditMode(false);
    setShowAddDrawer(false);
  };

  const handleConfirmReset = () => {
    if (!resetTarget || !selectedTypeId) return;
    // Reset to default
    setDraftItems(buildProcessList(defaultMappings[selectedTypeId] ?? []));
    setIsCustom(false);
    setIsEditMode(false);
    setResetTarget(null);
  };

  const availableProcesses = allSubProcesses.filter(
    p => !draftItems.some(d => d.id === p.id)
  );

  const currentKey = `${selectedTypeId}-${selectedProfessionId}`;

  return (
    <PageShell>
      {/* Reset dialog overlay */}
      <AnimatePresence>
        {resetTarget && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
            onClick={() => setResetTarget(null)}>
            <div onClick={e => e.stopPropagation()}>
              <ResetConfirmDialog
                professionName={resetTarget.professionName}
                onConfirm={handleConfirmReset}
                onCancel={() => setResetTarget(null)}
              />
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: 'hsl(var(--primary))' }}>
            <GitBranch size={20} color="white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight" style={{ color: 'hsl(var(--foreground))' }}>
              Profession-Process Mapping
            </h1>
            <p className="text-sm mt-0.5" style={{ color: 'hsl(var(--muted-foreground))' }}>
              Override the default process flow for specific professions within each application type
            </p>
          </div>
        </div>
      </div>

      {/* Info Banner */}
      <div className="flex items-start gap-3 p-4 rounded-xl border mb-7 text-sm"
        style={{ background: 'hsl(217 91% 53% / 0.05)', borderColor: 'hsl(217 91% 53% / 0.2)', color: 'hsl(217 91% 35%)' }}>
        <Info size={16} className="flex-shrink-0 mt-0.5" />
        <div>
          <strong>Two-step fallback:</strong> If a custom mapping exists for a profession, it overrides the default.
          If none exists, the default application mapping is shown as an editable template.
          Use <strong>Reset to Default</strong> to remove all overrides for a profession.
        </div>
      </div>

      <div className="grid grid-cols-12 gap-5">
        {/* Col 1: Application Type */}
        <div className="col-span-12 lg:col-span-3 space-y-2">
          <div className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'hsl(var(--muted-foreground))' }}>
            Application Types
          </div>
          {applicationTypes.map(type => {
            const c = typeColorMap[type.color];
            const isSelected = selectedTypeId === type.id;
            const profs = professionMappingStatuses[type.id] ?? [];
            const custom = profs.filter(p => p.hasCustomMapping).length;
            return (
              <button key={type.id} onClick={() => handleSelectType(type.id)}
                className={`w-full text-left p-3.5 rounded-xl border-l-4 border transition-all
                  ${isSelected ? 'bg-white shadow-md border-r border-t border-b border-gray-200' : 'bg-white hover:bg-gray-50 hover:shadow-sm border-r border-t border-b border-gray-100'}
                  ${c.cardLeft}`}
              >
                <div className="flex items-center justify-between gap-1">
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${c.badge}`}>{type.formCode}</span>
                  {custom > 0 && (
                    <span className="text-xs font-semibold px-1.5 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200">
                      {custom} custom
                    </span>
                  )}
                  {isSelected && <ChevronRight size={13} className="text-teal-600" />}
                </div>
                <div className="text-sm font-semibold text-gray-800 mt-1.5 leading-snug">{type.name}</div>
                <div className="text-xs text-gray-400 mt-0.5">{profs.length} professions</div>
              </button>
            );
          })}
        </div>

        {/* Col 2: Profession List */}
        <div className="col-span-12 lg:col-span-3">
          {!selectedType ? (
            <div className="h-full flex flex-col items-center justify-center py-20 text-center px-4">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-3"
                style={{ background: 'hsl(var(--primary) / 0.08)' }}>
                <Users size={22} style={{ color: 'hsl(var(--primary))' }} />
              </div>
              <div className="text-sm font-semibold text-gray-600 mb-1">Select a Type First</div>
              <div className="text-xs text-gray-400">Choose an application type to see professions</div>
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'hsl(var(--muted-foreground))' }}>
                  Professions
                </div>
                {customCount > 0 && (
                  <span className="text-xs text-teal-600 font-medium">
                    {customCount} customised
                  </span>
                )}
              </div>

              {/* Search */}
              <div className="relative mb-2">
                <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  value={professionSearch}
                  onChange={e => setProfessionSearch(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 text-sm border rounded-lg outline-none focus:border-teal-400 transition-colors bg-white"
                  style={{ borderColor: 'hsl(var(--border))' }}
                  placeholder="Search professions…"
                />
              </div>

              <div className="space-y-1.5">
                {filteredProfessions.map(prof => {
                  const isSelected = selectedProfessionId === prof.professionId;
                  return (
                    <button key={prof.professionId} onClick={() => handleSelectProfession(prof)}
                      className={`w-full text-left p-3 rounded-xl border transition-all
                        ${isSelected ? 'border-teal-300 bg-teal-50 shadow-sm' : 'border-gray-100 bg-white hover:border-gray-200 hover:bg-gray-50'}`}
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className="w-7 h-7 rounded-lg flex-shrink-0 flex items-center justify-center text-xs font-bold"
                          style={{
                            background: isSelected ? 'hsl(var(--primary))' : 'hsl(var(--muted))',
                            color: isSelected ? 'white' : 'hsl(var(--muted-foreground))',
                          }}
                        >
                          {prof.professionShortName.slice(0, 2)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-semibold text-gray-800 truncate leading-tight">{prof.professionName}</div>
                          <div className="text-xs text-gray-400 mt-0.5 truncate">{prof.professionShortName}</div>
                        </div>
                        <div className="flex-shrink-0">
                          {prof.hasCustomMapping ? (
                            <span className="flex items-center gap-1 text-xs font-semibold px-1.5 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200">
                              <Sparkles size={9} />
                              Custom
                            </span>
                          ) : (
                            <span className="text-xs font-medium px-1.5 py-0.5 rounded-full bg-gray-50 text-gray-400 border border-gray-200">
                              Default
                            </span>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
                {filteredProfessions.length === 0 && (
                  <div className="text-center py-8 text-sm text-gray-400">No professions found</div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Col 3: Process Editor */}
        <div className="col-span-12 lg:col-span-6">
          {!selectedProfession ? (
            <div className="h-full flex flex-col items-center justify-center py-24 text-center px-4">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
                style={{ background: 'hsl(var(--primary) / 0.08)' }}>
                <GitBranch size={28} style={{ color: 'hsl(var(--primary))' }} />
              </div>
              <div className="text-lg font-semibold text-gray-700 mb-1">Select a Profession</div>
              <div className="text-sm text-gray-400 max-w-xs">
                Choose a profession from the centre panel to view and configure its process flow.
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Header */}
              <div className="bg-white rounded-xl border p-5 shadow-sm" style={{ borderColor: 'hsl(var(--border))' }}>
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2 className="text-base font-bold text-gray-900">{selectedProfession.professionName}</h2>
                      {isCustom ? (
                        <span className="flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200">
                          <Sparkles size={10} /> Custom Override
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-gray-50 text-gray-500 border border-gray-200">
                          <Shield size={10} /> Using Default
                        </span>
                      )}
                      <AnimatePresence>
                        {savedKey === currentKey && (
                          <motion.span initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                            className="flex items-center gap-1 text-xs font-medium text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full"
                          >
                            <CheckCircle2 size={10} /> Saved
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      {draftItems.length} screen{draftItems.length !== 1 ? 's' : ''} configured
                      {!isCustom && <span className="text-gray-400 ml-1">· inherited from default</span>}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    {isCustom && !isEditMode && (
                      <button onClick={() => setResetTarget(selectedProfession)}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium border transition-all hover:bg-red-50 hover:border-red-200 hover:text-red-600"
                        style={{ borderColor: 'hsl(var(--border))', color: 'hsl(var(--muted-foreground))' }}
                      >
                        <RotateCcw size={13} />
                        Reset to Default
                      </button>
                    )}
                    {!isEditMode ? (
                      <button onClick={() => setIsEditMode(true)}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white transition-all"
                        style={{ background: 'hsl(var(--primary))' }}
                      >
                        {isCustom ? 'Edit Custom Mapping' : 'Create Custom Override'}
                      </button>
                    ) : (
                      <>
                        <button onClick={handleCancelEdit}
                          className="px-4 py-2 rounded-lg text-sm font-medium border hover:bg-gray-50 transition-colors"
                          style={{ borderColor: 'hsl(var(--border))', color: 'hsl(var(--muted-foreground))' }}
                        >
                          Cancel
                        </button>
                        <button onClick={() => setShowAddDrawer(s => !s)}
                          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium border transition-all
                            ${showAddDrawer ? 'bg-teal-50 border-teal-300 text-teal-700' : 'border-teal-300 text-teal-700 hover:bg-teal-50'}`}
                        >
                          <Plus size={13} />
                          Add Screen
                        </button>
                        <button onClick={handleSave} disabled={saving}
                          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold text-white transition-all"
                          style={{ background: 'hsl(var(--accent))', opacity: saving ? 0.7 : 1 }}
                        >
                          {saving
                            ? <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                            : <Save size={14} />
                          }
                          {saving ? 'Saving…' : 'Save Override'}
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Processes + Drawer */}
              <div className={`grid gap-4 ${showAddDrawer ? 'grid-cols-5' : 'grid-cols-1'}`}>
                <div className={showAddDrawer ? 'col-span-3' : 'col-span-1'}>
                  {isEditMode && (
                    <div className="flex items-center gap-2 mb-3 px-3 py-2 rounded-lg text-xs font-medium"
                      style={{ background: 'hsl(var(--accent) / 0.08)', color: 'hsl(var(--accent))' }}>
                      <GripVertical size={12} />
                      Drag to reorder · Click × to remove
                    </div>
                  )}

                  {draftItems.length === 0 ? (
                    <div className="border-2 border-dashed rounded-xl p-12 text-center" style={{ borderColor: 'hsl(var(--border))' }}>
                      <div className="text-sm text-gray-400 mb-3">No screens configured</div>
                      {isEditMode && (
                        <button onClick={() => setShowAddDrawer(true)}
                          className="text-sm font-medium px-4 py-2 rounded-lg text-white transition-all"
                          style={{ background: 'hsl(var(--primary))' }}
                        >
                          <Plus size={14} className="inline mr-1" />
                          Add screen
                        </button>
                      )}
                    </div>
                  ) : isEditMode ? (
                    <Reorder.Group axis="y" values={draftItems} onReorder={handleReorder} className="space-y-2">
                      {draftItems.map((item, idx) => (
                        <Reorder.Item key={item.id} value={item}>
                          <ProcessChip
                            process={item}
                            sequence={idx + 1}
                            isEditMode={isEditMode}
                            onRemove={() => handleRemove(item.id)}
                            isCustom={isCustom}
                          />
                        </Reorder.Item>
                      ))}
                    </Reorder.Group>
                  ) : (
                    <div className="space-y-2">
                      {draftItems.map((item, idx) => (
                        <motion.div key={item.id} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.04 }}>
                          <ProcessChip
                            process={item}
                            sequence={idx + 1}
                            isEditMode={false}
                            onRemove={() => {}}
                            isCustom={isCustom}
                          />
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="col-span-2">
                  <AnimatePresence>
                    {showAddDrawer && (
                      <AddProcessDrawer
                        available={availableProcesses}
                        onAdd={handleAddProcess}
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
