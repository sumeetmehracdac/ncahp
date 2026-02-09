// User-Role Mapping - Head Office Admin - Revamped Single Page
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Link2,
  Users,
  Building2,
  Layers,
  Building,
  UserCheck,
  CheckCircle2,
  PartyPopper,
  Plus,
  Eye,
  ArrowRight,
  Shield,
  Search,
  Mail,
  RotateCcw,
  Star,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { FlowSelector } from './components/FlowSelector';
import { ProgressRing } from './components/ProgressRing';
import { ExistingMappingsTable } from './components/ExistingMappingsTable';
import { useSinglePageForm } from './hooks/useSinglePageForm';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-6">
        <Skeleton className="h-14 w-full max-w-2xl mx-auto rounded-xl mb-6" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 max-w-5xl mx-auto">
          <Skeleton className="h-32 rounded-xl" />
          <Skeleton className="h-32 rounded-xl" />
          <Skeleton className="h-32 rounded-xl" />
          <Skeleton className="h-32 rounded-xl" />
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default function SinglePageHO() {
  const [isLoading, setIsLoading] = useState(true);

  const {
    formData,
    isSubmitting,
    submitSuccess,
    progress,
    isFormComplete,
    editingMappingId,
    availableUsers,
    availableStakeholders,
    availableCommitteeTypes,
    availableCommittees,
    availableRoles,
    existingMappings,
    selectedUser,
    selectedStakeholder,
    selectedCommitteeType,
    selectedCommittee,
    selectedRoles,
    selectedDefaultRole,
    updateFormData,
    submitForm,
    resetForm,
    editMapping,
    cancelEdit
  } = useSinglePageForm('HO');

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 400);
    return () => clearTimeout(timer);
  }, []);

  // Convert to selector options
  const userOptions = availableUsers.map(u => ({
    id: u.userId,
    label: u.fullName,
    sublabel: u.email,
    color: 'bg-blue-500 text-white'
  }));

  const stakeholderOptions = availableStakeholders.map(s => ({
    id: s.stakeholderId,
    label: s.name,
    sublabel: s.state?.stateName,
    badge: s.stakeholderType === 'NCAHP_HO' ? 'National' : s.stakeholderType === 'STATE_COUNCIL' ? 'State' : 'External',
    color: s.stakeholderType === 'NCAHP_HO' ? 'bg-primary text-primary-foreground' : s.stakeholderType === 'STATE_COUNCIL' ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-white'
  }));

  const committeeTypeOptions = availableCommitteeTypes.map(ct => ({
    id: ct.committeeTypeId,
    label: ct.typeName,
    sublabel: ct.description,
    color: 'bg-primary text-primary-foreground'
  }));

  const committeeOptions = availableCommittees.map(c => ({
    id: c.committeeId,
    label: c.committeeName,
    sublabel: c.state?.stateName || 'National',
    badge: c.state?.stateCode,
    color: 'bg-primary text-primary-foreground'
  }));

  // Default role options (only from selected roles)
  const defaultRoleOptions = selectedRoles.map(r => ({
    id: r.roleId,
    label: r.roleName,
    sublabel: r.description,
    color: 'bg-primary text-primary-foreground'
  }));

  const handleSubmit = async () => {
    await submitForm();
    toast.success(
      editingMappingId ? 'Mapping updated successfully' : 'Role assignment created successfully',
      { description: `${selectedUser?.fullName} → ${selectedRoles.map(r => r.roleName).join(', ')} → ${selectedCommittee?.committeeName}` }
    );
  };

  const handleReset = () => {
    resetForm();
    if (editingMappingId) cancelEdit();
  };

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-muted/30 via-background to-muted/30">
      <Header />

      {/* Page Header */}
      <section className="bg-gradient-to-r from-primary via-primary to-primary/95 text-primary-foreground">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/10 backdrop-blur-sm rounded-lg">
                <Link2 className="h-5 w-5" />
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-serif font-bold text-white">
                  User Role Mapping
                </h1>
                <p className="text-xs text-white/80">Assign users to roles across committees</p>
              </div>
              <Badge variant="secondary" className="bg-indigo-600 text-white border-0 text-xs gap-1 ml-2">
                <Shield className="w-3 h-3" />
                Head Office Admin
              </Badge>
            </div>

            <div className="flex items-center gap-3">
              <Link
                to="/user-role-mapping/sc"
                className="flex items-center gap-1.5 text-xs bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg transition-colors text-white"
              >
                <Users className="w-3.5 h-3.5" />
                View as SC Admin
              </Link>

              {/* Progress Ring */}
              <div className="flex items-center gap-2 px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                <ProgressRing progress={progress.percentage} size={36} strokeWidth={3} className="text-white" />
                <div className="text-xs">
                  <div className="font-medium text-white">{progress.completed}/{progress.total}</div>
                  <div className="text-white/70">Done</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="container mx-auto px-6 py-6 max-w-6xl">
        <AnimatePresence mode="wait">
          {submitSuccess ? (
            /* ===== Success State ===== */
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-2xl mx-auto text-center py-12"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
                className="relative inline-block mb-5"
              >
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-400 to-green-600 flex items-center justify-center shadow-xl shadow-emerald-500/30">
                  <CheckCircle2 className="w-10 h-10 text-white" />
                </div>
                <motion.div initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }} className="absolute -top-1 -right-1">
                  <PartyPopper className="w-7 h-7 text-amber-500" />
                </motion.div>
              </motion.div>
              <h2 className="text-2xl font-serif font-bold text-foreground mb-2">
                {editingMappingId ? 'Mapping Updated!' : 'Assignment Created!'}
              </h2>
              <p className="text-muted-foreground mb-6 text-sm">
                <strong className="text-foreground">{selectedUser?.fullName}</strong> has been assigned as{' '}
                <strong className="text-foreground">{selectedRoles.map(r => r.roleName).join(', ')}</strong> to{' '}
                <strong className="text-foreground">{selectedCommittee?.committeeName}</strong>.
                {selectedDefaultRole && (
                  <span> Default role: <strong className="text-foreground">{selectedDefaultRole.roleName}</strong>.</span>
                )}
              </p>
              <div className="flex items-center justify-center gap-3">
                <Button variant="outline" size="default" className="gap-2">
                  <Eye className="w-4 h-4" />
                  View Mappings
                </Button>
                <Button size="default" onClick={resetForm} className="gap-2">
                  <Plus className="w-4 h-4" />
                  Create Another
                </Button>
              </div>
            </motion.div>
          ) : (
            /* ===== Form State ===== */
            <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>

              {/* Section Header */}
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-serif font-semibold text-foreground">
                  {editingMappingId ? 'Edit Role Mapping' : 'Assign Roles to User'}
                </h2>
                {(formData.userId || editingMappingId) && (
                  <Button variant="outline" size="sm" onClick={handleReset} className="gap-1.5 text-xs">
                    <RotateCcw className="w-3.5 h-3.5" />
                    Reset
                  </Button>
                )}
              </div>

              {/* ===== Step 1: User Search (top-level, full width) ===== */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card rounded-xl border shadow-sm p-5 mb-4"
              >
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center text-primary-foreground">
                    <Search className="w-3.5 h-3.5" />
                  </div>
                  <span className="font-medium text-sm text-foreground">Step 1</span>
                  {selectedUser && <CheckCircle2 className="w-4 h-4 text-emerald-500 ml-auto" />}
                </div>

                <FlowSelector
                  label="Select User"
                  placeholder="Search and choose a user to assign roles..."
                  options={userOptions}
                  value={formData.userId}
                  onChange={(v) => updateFormData('userId', v)}
                  icon={<Users className="w-5 h-5" />}
                />

                {/* User context card */}
                {selectedUser && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-3 flex items-center gap-3 px-4 py-2.5 bg-muted/50 rounded-lg border"
                  >
                    <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-bold">
                      {selectedUser.fullName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">{selectedUser.fullName}</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Mail className="w-3 h-3" />
                        {selectedUser.email}
                      </p>
                    </div>
                    {existingMappings.length > 0 && (
                      <Badge variant="secondary" className="text-xs">
                        {existingMappings.length} existing mapping{existingMappings.length !== 1 ? 's' : ''}
                      </Badge>
                    )}
                  </motion.div>
                )}
              </motion.div>

              {/* ===== Steps 2-4: Cascading Selectors (2-col grid) ===== */}
              <AnimatePresence>
                {formData.userId && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    {/* Breadcrumb summary */}
                    {(selectedStakeholder || selectedCommitteeType || selectedCommittee) && (
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3 flex-wrap px-1">
                        <span className="font-medium text-foreground">{selectedUser?.fullName}</span>
                        {selectedStakeholder && (
                          <>
                            <ArrowRight className="w-3 h-3" />
                            <span className="font-medium text-foreground">{selectedStakeholder.name}</span>
                          </>
                        )}
                        {selectedCommitteeType && (
                          <>
                            <ArrowRight className="w-3 h-3" />
                            <span className="font-medium text-foreground">{selectedCommitteeType.typeName.split(' ').slice(0, 3).join(' ')}</span>
                          </>
                        )}
                        {selectedCommittee && (
                          <>
                            <ArrowRight className="w-3 h-3" />
                            <span className="font-medium text-foreground">{selectedCommittee.committeeName.split(' ').slice(0, 3).join(' ')}</span>
                          </>
                        )}
                        {selectedRoles.length > 0 && (
                          <>
                            <ArrowRight className="w-3 h-3" />
                            <span className="font-medium text-foreground">
                              {selectedRoles.length === 1 ? selectedRoles[0].roleName : `${selectedRoles.length} Roles`}
                            </span>
                          </>
                        )}
                      </div>
                    )}

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                      {/* Stakeholder Type */}
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.05 }}
                        className={cn(
                          "bg-card rounded-xl border shadow-sm p-5 transition-opacity",
                          !formData.userId && "opacity-50"
                        )}
                      >
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-7 h-7 rounded-lg bg-primary/80 flex items-center justify-center text-primary-foreground">
                            <Building2 className="w-3.5 h-3.5" />
                          </div>
                          <span className="font-medium text-sm text-foreground">Step 2</span>
                          <Badge variant="outline" className="ml-1 text-[10px] bg-primary/5 text-primary border-primary/20 px-1.5 py-0">
                            All Types
                          </Badge>
                          {selectedStakeholder && <CheckCircle2 className="w-4 h-4 text-emerald-500 ml-auto" />}
                        </div>
                        <FlowSelector
                          label="Stakeholder Type"
                          placeholder="Choose stakeholder type..."
                          options={stakeholderOptions}
                          value={formData.stakeholderId}
                          onChange={(v) => updateFormData('stakeholderId', v)}
                          disabled={!formData.userId}
                          icon={<Building2 className="w-5 h-5" />}
                          emptyMessage="Select a user first"
                        />
                      </motion.div>

                      {/* Committee Type */}
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className={cn(
                          "bg-card rounded-xl border shadow-sm p-5 transition-opacity",
                          !formData.stakeholderId && "opacity-50"
                        )}
                      >
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-7 h-7 rounded-lg bg-primary/80 flex items-center justify-center text-primary-foreground">
                            <Layers className="w-3.5 h-3.5" />
                          </div>
                          <span className="font-medium text-sm text-foreground">Step 3</span>
                          {selectedCommitteeType && <CheckCircle2 className="w-4 h-4 text-emerald-500 ml-auto" />}
                        </div>
                        <FlowSelector
                          label="Committee Type"
                          placeholder={formData.stakeholderId ? "Choose committee type..." : "Select stakeholder first"}
                          options={committeeTypeOptions}
                          value={formData.committeeTypeId}
                          onChange={(v) => updateFormData('committeeTypeId', v)}
                          disabled={!formData.stakeholderId}
                          icon={<Layers className="w-5 h-5" />}
                          emptyMessage="No committee types available"
                        />
                      </motion.div>

                      {/* Committee */}
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15 }}
                        className={cn(
                          "bg-card rounded-xl border shadow-sm p-5 transition-opacity",
                          !formData.committeeTypeId && "opacity-50"
                        )}
                      >
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-7 h-7 rounded-lg bg-primary/80 flex items-center justify-center text-primary-foreground">
                            <Building className="w-3.5 h-3.5" />
                          </div>
                          <span className="font-medium text-sm text-foreground">Step 4</span>
                          {selectedCommittee && <CheckCircle2 className="w-4 h-4 text-emerald-500 ml-auto" />}
                        </div>
                        <FlowSelector
                          label="Committee"
                          placeholder={formData.committeeTypeId ? "Choose specific committee..." : "Select committee type first"}
                          options={committeeOptions}
                          value={formData.committeeId}
                          onChange={(v) => updateFormData('committeeId', v)}
                          disabled={!formData.committeeTypeId}
                          icon={<Building className="w-5 h-5" />}
                          emptyMessage="No committees available"
                        />
                      </motion.div>

                      {/* Role(s) Multi-select */}
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className={cn(
                          "bg-card rounded-xl border shadow-sm p-5 transition-opacity",
                          !formData.committeeId && "opacity-50"
                        )}
                      >
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-7 h-7 rounded-lg bg-primary/80 flex items-center justify-center text-primary-foreground">
                            <UserCheck className="w-3.5 h-3.5" />
                          </div>
                          <span className="font-medium text-sm text-foreground">Step 5 — Role(s)</span>
                          <Badge variant="outline" className="ml-1 text-[10px] px-1.5 py-0">Multi</Badge>
                          {formData.roleIds.length > 0 && (
                            <Badge className="ml-auto bg-emerald-100 text-emerald-700 border-emerald-200 text-xs">
                              {formData.roleIds.length} selected
                            </Badge>
                          )}
                        </div>

                        {/* Role grid */}
                        <div className="grid grid-cols-2 gap-2">
                          {availableRoles.map((role, index) => {
                            const isSelected = formData.roleIds.includes(role.roleId);
                            return (
                              <motion.button
                                key={role.roleId}
                                type="button"
                                onClick={() => formData.committeeId && updateFormData('roleIds', role.roleId)}
                                disabled={!formData.committeeId}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.2 + index * 0.02 }}
                                className={cn(
                                  "relative p-2.5 rounded-lg text-left transition-all duration-200",
                                  "border hover:shadow-sm disabled:opacity-50 disabled:cursor-not-allowed",
                                  isSelected
                                    ? "border-primary bg-primary/5 shadow-sm"
                                    : "border-border hover:border-primary/40 bg-background"
                                )}
                              >
                                {isSelected && (
                                  <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-primary flex items-center justify-center"
                                  >
                                    <CheckCircle2 className="w-2.5 h-2.5 text-primary-foreground" />
                                  </motion.div>
                                )}
                                <p className={cn(
                                  "font-medium text-xs",
                                  isSelected ? "text-primary" : "text-foreground"
                                )}>
                                  {role.roleName}
                                </p>
                                <p className="text-[10px] text-muted-foreground line-clamp-1 mt-0.5">
                                  {role.description}
                                </p>
                              </motion.button>
                            );
                          })}
                        </div>

                        {!formData.committeeId && (
                          <p className="text-xs text-muted-foreground text-center mt-3">
                            Select a committee to choose roles
                          </p>
                        )}
                      </motion.div>
                    </div>

                    {/* ===== Step 6: Default Role (conditionally shown) ===== */}
                    <AnimatePresence>
                      {formData.roleIds.length > 1 && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, height: 0 }}
                          animate={{ opacity: 1, y: 0, height: 'auto' }}
                          exit={{ opacity: 0, y: -10, height: 0 }}
                          className="bg-card rounded-xl border shadow-sm p-5 mb-4"
                        >
                          <div className="flex items-center gap-2 mb-3">
                            <div className="w-7 h-7 rounded-lg bg-primary/80 flex items-center justify-center text-primary-foreground">
                              <Star className="w-3.5 h-3.5" />
                            </div>
                            <span className="font-medium text-sm text-foreground">Step 6 — Default Role</span>
                            {formData.defaultRoleId && <CheckCircle2 className="w-4 h-4 text-emerald-500 ml-auto" />}
                          </div>
                          <FlowSelector
                            label="Default Role"
                            placeholder="Select which role should be the default..."
                            options={defaultRoleOptions}
                            value={formData.defaultRoleId}
                            onChange={(v) => updateFormData('defaultRoleId', v)}
                            icon={<Star className="w-5 h-5" />}
                            emptyMessage="Select roles first"
                          />
                          <p className="text-xs text-muted-foreground mt-2">
                            Select which role should be the default for this user
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* ===== Submit / Action Bar ===== */}
                    <AnimatePresence>
                      {isFormComplete && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, height: 0 }}
                          animate={{ opacity: 1, y: 0, height: 'auto' }}
                          exit={{ opacity: 0, y: 10, height: 0 }}
                          className="bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 rounded-xl border-2 border-primary/20 p-5 mb-6"
                        >
                          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                            {/* Assignment summary */}
                            <div className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap">
                              <span className="font-medium text-foreground">{selectedUser?.fullName}</span>
                              <ArrowRight className="w-3 h-3" />
                              <span className="font-medium text-foreground">{selectedRoles.map(r => r.roleName).join(', ')}</span>
                              <ArrowRight className="w-3 h-3" />
                              <span className="font-medium text-foreground truncate max-w-[200px]">{selectedCommittee?.committeeName}</span>
                              {selectedDefaultRole && (
                                <>
                                  <span className="text-muted-foreground">•</span>
                                  <span className="text-primary font-medium flex items-center gap-1">
                                    <Star className="w-3 h-3" />
                                    Default: {selectedDefaultRole.roleName}
                                  </span>
                                </>
                              )}
                            </div>

                            <div className="flex items-center gap-2">
                              <Button variant="outline" size="sm" onClick={handleReset} className="gap-1.5 text-xs">
                                <RotateCcw className="w-3.5 h-3.5" />
                                Reset
                              </Button>
                              <Button
                                size="default"
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                                className="gap-2 font-semibold shadow-lg shadow-primary/25 hover:shadow-xl transition-all"
                              >
                                {isSubmitting ? (
                                  <>
                                    <motion.div
                                      className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
                                      animate={{ rotate: 360 }}
                                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                    />
                                    {editingMappingId ? 'Updating...' : 'Creating...'}
                                  </>
                                ) : (
                                  <>
                                    <CheckCircle2 className="w-4 h-4" />
                                    {editingMappingId ? 'Update Mapping' : 'Assign Roles'}
                                  </>
                                )}
                              </Button>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* ===== Existing Mappings Table ===== */}
                    {selectedUser && (
                      <ExistingMappingsTable
                        mappings={existingMappings}
                        editingMappingId={editingMappingId}
                        onEdit={editMapping}
                        onDelete={(id) => {
                          toast.success('Mapping deleted', { description: 'The role mapping has been removed.' });
                        }}
                        userName={selectedUser.fullName}
                      />
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      <Footer />
    </div>
  );
}
