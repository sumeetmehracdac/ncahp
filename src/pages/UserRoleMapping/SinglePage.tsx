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
  Shield,
  BarChart3,
  ArrowRight,
  CheckCircle2,
  PartyPopper,
  Plus,
  Eye,
  Calendar,
  MapPin,
  Globe,
  Info,
  ListOrdered
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { FlowSelector } from './components/FlowSelector';
import { ProgressRing } from './components/ProgressRing';
import { FlowSummary } from './components/FlowSummary';
import { useSinglePageForm } from './hooks/useSinglePageForm';
import { mockExistingMappings } from './data/mockData';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-32 w-full rounded-2xl mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-48 rounded-xl" />
          <Skeleton className="h-48 rounded-xl" />
          <Skeleton className="h-48 rounded-xl" />
          <Skeleton className="h-48 rounded-xl" />
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default function UserRoleMappingSinglePage() {
  const [isLoading, setIsLoading] = useState(true);
  
  const {
    formData,
    isSubmitting,
    submitSuccess,
    currentUserContext,
    progress,
    isFormComplete,
    availableUsers,
    availableStakeholders,
    availableCommitteeTypes,
    availableCommittees,
    availableRoles,
    selectedUser,
    selectedStakeholder,
    selectedCommitteeType,
    selectedCommittee,
    selectedRole,
    updateFormData,
    submitForm,
    resetForm
  } = useSinglePageForm();
  
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 600);
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
    color: s.stakeholderType === 'NCAHP_HO' ? 'bg-indigo-500 text-white' : 'bg-emerald-500 text-white'
  }));
  
  const committeeTypeOptions = availableCommitteeTypes.map(ct => ({
    id: ct.committeeTypeId,
    label: ct.typeName,
    sublabel: ct.description,
    color: 'bg-violet-500 text-white'
  }));
  
  const committeeOptions = availableCommittees.map(c => ({
    id: c.committeeId,
    label: c.committeeName,
    sublabel: c.state?.stateName || 'National',
    badge: c.state?.stateCode,
    color: 'bg-amber-500 text-white'
  }));
  
  const roleOptions = availableRoles.map(r => ({
    id: r.roleId,
    label: r.roleName,
    sublabel: r.description,
    color: r.roleName.toLowerCase().includes('chair') ? 'bg-rose-500 text-white' : 'bg-cyan-500 text-white'
  }));
  
  if (isLoading) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-muted/30 via-background to-muted/30">
      <Header />
      
      {/* Compact Hero */}
      <section className="relative bg-gradient-to-r from-primary via-primary to-primary/90 text-primary-foreground overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5" />
        
        <div className="container mx-auto px-4 py-8 relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex-1"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-white/10 backdrop-blur-sm rounded-lg">
                  <Link2 className="h-5 w-5" />
                </div>
                <Badge variant="secondary" className="bg-white/20 text-white border-0 text-xs">
                  Single-Page Flow
                </Badge>
                <Link 
                  to="/user-role-mapping" 
                  className="flex items-center gap-1.5 text-xs bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg transition-colors"
                >
                  <ListOrdered className="w-3.5 h-3.5" />
                  Switch to Wizard
                </Link>
              </div>
              
              <h1 className="text-2xl md:text-3xl font-serif font-bold mb-2">
                User-Role-Committee Mapping
              </h1>
              <p className="text-sm text-white/80 max-w-lg">
                Assign users to roles in committees with a streamlined single-page experience.
              </p>
            </motion.div>
            
            {/* Stats & Progress */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-6"
            >
              <div className="hidden md:flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-white/10 rounded-lg">
                  <Users className="h-4 w-4" />
                  <span>{availableUsers.length} Users</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-white/10 rounded-lg">
                  <Building className="h-4 w-4" />
                  <span>40+ Committees</span>
                </div>
              </div>
              
              <div className="flex items-center gap-3 px-4 py-3 bg-white/10 backdrop-blur-sm rounded-xl">
                <ProgressRing progress={progress.percentage} size={48} strokeWidth={4} />
                <div className="text-sm">
                  <p className="font-semibold">{progress.completed}/5 Complete</p>
                  <p className="text-white/70 text-xs">Steps completed</p>
                </div>
              </div>
            </motion.div>
          </div>
          
          {/* Flow Summary */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-6 pt-4 border-t border-white/10"
          >
            <FlowSummary
              user={selectedUser}
              stakeholder={selectedStakeholder}
              committeeType={selectedCommitteeType}
              committee={selectedCommittee}
              role={selectedRole}
              isComplete={isFormComplete}
            />
          </motion.div>
        </div>
      </section>
      
      {/* Main Content */}
      <section className="container mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {submitSuccess ? (
            /* Success State */
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-2xl mx-auto text-center py-16"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
                className="relative inline-block mb-6"
              >
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-400 to-green-600 flex items-center justify-center shadow-xl shadow-emerald-500/30">
                  <CheckCircle2 className="w-12 h-12 text-white" />
                </div>
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                  className="absolute -top-2 -right-2"
                >
                  <PartyPopper className="w-8 h-8 text-amber-500" />
                </motion.div>
              </motion.div>
              
              <h2 className="text-3xl font-serif font-bold text-foreground mb-3">
                Assignment Created!
              </h2>
              <p className="text-muted-foreground mb-8">
                <strong className="text-foreground">{selectedUser?.fullName}</strong> has been assigned as{' '}
                <strong className="text-foreground">{selectedRole?.roleName}</strong> to{' '}
                <strong className="text-foreground">{selectedCommittee?.committeeName}</strong>.
              </p>
              
              <div className="flex items-center justify-center gap-4">
                <Button variant="outline" size="lg" className="gap-2">
                  <Eye className="w-4 h-4" />
                  View All Mappings
                </Button>
                <Button size="lg" onClick={resetForm} className="gap-2">
                  <Plus className="w-4 h-4" />
                  Create Another
                </Button>
              </div>
            </motion.div>
          ) : (
            /* Form State */
            <motion.div
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Selection Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* User Selection */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-card rounded-2xl border shadow-sm p-6"
                >
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center text-white">
                      <Users className="w-4 h-4" />
                    </div>
                    <span className="font-semibold text-foreground">Step 1</span>
                    {selectedUser && <CheckCircle2 className="w-4 h-4 text-emerald-500 ml-auto" />}
                  </div>
                  
                  <FlowSelector
                    label="Select User"
                    placeholder="Choose a user to assign..."
                    options={userOptions}
                    value={formData.userId}
                    onChange={(v) => updateFormData('userId', v)}
                    icon={<Users className="w-5 h-5" />}
                  />
                </motion.div>
                
                {/* Stakeholder Selection */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                  className={cn(
                    "bg-card rounded-2xl border shadow-sm p-6 transition-opacity",
                    !formData.userId && "opacity-60"
                  )}
                >
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-white">
                      <Building2 className="w-4 h-4" />
                    </div>
                    <span className="font-semibold text-foreground">Step 2</span>
                    {selectedStakeholder && <CheckCircle2 className="w-4 h-4 text-emerald-500 ml-auto" />}
                  </div>
                  
                  <FlowSelector
                    label="Select Stakeholder Level"
                    placeholder="Choose stakeholder type..."
                    options={stakeholderOptions}
                    value={formData.stakeholderId}
                    onChange={(v) => updateFormData('stakeholderId', v)}
                    disabled={!formData.userId}
                    icon={<Building2 className="w-5 h-5" />}
                    emptyMessage="Select a user first"
                  />
                </motion.div>
                
                {/* Committee Type Selection */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className={cn(
                    "bg-card rounded-2xl border shadow-sm p-6 transition-opacity",
                    !formData.stakeholderId && "opacity-60"
                  )}
                >
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-violet-500 flex items-center justify-center text-white">
                      <Layers className="w-4 h-4" />
                    </div>
                    <span className="font-semibold text-foreground">Step 3</span>
                    {selectedCommitteeType && <CheckCircle2 className="w-4 h-4 text-emerald-500 ml-auto" />}
                  </div>
                  
                  <FlowSelector
                    label="Select Committee Type"
                    placeholder="Choose committee type..."
                    options={committeeTypeOptions}
                    value={formData.committeeTypeId}
                    onChange={(v) => updateFormData('committeeTypeId', v)}
                    disabled={!formData.stakeholderId}
                    icon={<Layers className="w-5 h-5" />}
                    emptyMessage="No committee types for selected stakeholder"
                  />
                </motion.div>
                
                {/* Committee Selection */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 }}
                  className={cn(
                    "bg-card rounded-2xl border shadow-sm p-6 transition-opacity",
                    !formData.committeeTypeId && "opacity-60"
                  )}
                >
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center text-white">
                      <Building className="w-4 h-4" />
                    </div>
                    <span className="font-semibold text-foreground">Step 4</span>
                    {selectedCommittee && <CheckCircle2 className="w-4 h-4 text-emerald-500 ml-auto" />}
                  </div>
                  
                  {/* State filtering notice */}
                  {formData.stakeholderId && selectedStakeholder?.stakeholderType === 'STATE_COUNCIL' && (
                    <Alert className="mb-4 py-2 bg-amber-50 border-amber-200">
                      <Info className="h-3.5 w-3.5 text-amber-600" />
                      <AlertDescription className="text-xs text-amber-700">
                        Showing committees for {currentUserContext.canAssignToAllStates ? 'all states' : currentUserContext.stakeholder.state?.stateName}
                      </AlertDescription>
                    </Alert>
                  )}
                  
                  <FlowSelector
                    label="Select Committee"
                    placeholder="Choose specific committee..."
                    options={committeeOptions}
                    value={formData.committeeId}
                    onChange={(v) => updateFormData('committeeId', v)}
                    disabled={!formData.committeeTypeId}
                    icon={<Building className="w-5 h-5" />}
                    emptyMessage="Select committee type first"
                  />
                </motion.div>
              </div>
              
              {/* Role Selection - Full Width */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className={cn(
                  "bg-card rounded-2xl border shadow-sm p-6 mb-8 transition-opacity",
                  !formData.committeeId && "opacity-60"
                )}
              >
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-rose-500 flex items-center justify-center text-white">
                    <UserCheck className="w-4 h-4" />
                  </div>
                  <span className="font-semibold text-foreground">Step 5 - Select Role</span>
                  {selectedRole && <CheckCircle2 className="w-4 h-4 text-emerald-500 ml-auto" />}
                </div>
                
                {/* Role Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
                  {availableRoles.map((role, index) => {
                    const isSelected = formData.roleId === role.roleId;
                    const isChair = role.roleName.toLowerCase().includes('chair');
                    
                    return (
                      <motion.button
                        key={role.roleId}
                        type="button"
                        onClick={() => formData.committeeId && updateFormData('roleId', role.roleId)}
                        disabled={!formData.committeeId}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 + index * 0.03 }}
                        className={cn(
                          "relative p-4 rounded-xl text-center transition-all duration-200",
                          "border-2 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed",
                          isSelected 
                            ? "border-primary bg-primary/5 shadow-md" 
                            : "border-border hover:border-primary/50 bg-background",
                          isChair && "sm:col-span-2"
                        )}
                      >
                        {isSelected && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-primary flex items-center justify-center"
                          >
                            <CheckCircle2 className="w-3 h-3 text-primary-foreground" />
                          </motion.div>
                        )}
                        
                        <p className={cn(
                          "font-medium text-sm",
                          isSelected ? "text-primary" : "text-foreground"
                        )}>
                          {role.roleName}
                        </p>
                      </motion.button>
                    );
                  })}
                </div>
                
                {!formData.committeeId && (
                  <p className="text-sm text-muted-foreground text-center mt-4">
                    Select a committee to choose a role
                  </p>
                )}
              </motion.div>
              
              {/* Validity & Submit */}
              <AnimatePresence>
                {isFormComplete && (
                  <motion.div
                    initial={{ opacity: 0, y: 20, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: 'auto' }}
                    exit={{ opacity: 0, y: 20, height: 0 }}
                    className="bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 rounded-2xl border-2 border-primary/20 p-6"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-end gap-6">
                      {/* Validity Inputs */}
                      <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="validFrom" className="flex items-center gap-2 text-sm">
                            <Calendar className="w-4 h-4 text-primary" />
                            Valid From
                          </Label>
                          <Input
                            id="validFrom"
                            type="date"
                            value={formData.validFrom}
                            onChange={(e) => updateFormData('validFrom', e.target.value)}
                            className="bg-background"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="validUntil" className="flex items-center gap-2 text-sm">
                            <Calendar className="w-4 h-4 text-muted-foreground" />
                            Valid Until (Optional)
                          </Label>
                          <Input
                            id="validUntil"
                            type="date"
                            value={formData.validUntil}
                            onChange={(e) => updateFormData('validUntil', e.target.value)}
                            min={formData.validFrom}
                            className="bg-background"
                            placeholder="Indefinite"
                          />
                        </div>
                      </div>
                      
                      {/* Submit Button */}
                      <Button
                        size="lg"
                        onClick={submitForm}
                        disabled={isSubmitting}
                        className="gap-2 h-12 px-8 text-base font-semibold rounded-xl shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all whitespace-nowrap"
                      >
                        {isSubmitting ? (
                          <>
                            <motion.div
                              className="w-5 h-5 border-2 border-current border-t-transparent rounded-full"
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            />
                            Creating...
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="w-5 h-5" />
                            Create Assignment
                          </>
                        )}
                      </Button>
                    </div>
                    
                    {/* Summary Preview */}
                    <Separator className="my-4" />
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>Assignment:</span>
                      <span className="font-medium text-foreground">{selectedUser?.fullName}</span>
                      <ArrowRight className="w-3 h-3" />
                      <span className="font-medium text-foreground">{selectedRole?.roleName}</span>
                      <ArrowRight className="w-3 h-3" />
                      <span className="font-medium text-foreground truncate">{selectedCommittee?.committeeName}</span>
                    </div>
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
