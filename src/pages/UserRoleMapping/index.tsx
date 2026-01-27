import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  Link2, 
  ArrowLeft, 
  ArrowRight, 
  Shield,
  Building2,
  BarChart3,
  Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { StepIndicator } from './components/StepIndicator';
import {
  UserSelectionStep,
  StakeholderSelectionStep,
  CommitteeTypeSelectionStep,
  CommitteeSelectionStep,
  RoleSelectionStep,
  ReviewStep,
  SuccessScreen
} from './components/steps';
import { useFormWizard } from './hooks/useFormWizard';
import { mockExistingMappings } from './data/mockData';
import { Skeleton } from '@/components/ui/skeleton';

const STEPS = [
  { id: 1, title: 'Select User', shortTitle: 'User' },
  { id: 2, title: 'Select Stakeholder', shortTitle: 'Stakeholder' },
  { id: 3, title: 'Select Committee Type', shortTitle: 'Type' },
  { id: 4, title: 'Select Committee', shortTitle: 'Committee' },
  { id: 5, title: 'Select Role', shortTitle: 'Role' },
  { id: 6, title: 'Review & Confirm', shortTitle: 'Review' },
];

function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-10 w-96 mx-auto mb-8" />
        <div className="max-w-4xl mx-auto">
          <Skeleton className="h-16 w-full mb-8 rounded-xl" />
          <div className="space-y-4">
            <Skeleton className="h-20 w-full rounded-xl" />
            <Skeleton className="h-20 w-full rounded-xl" />
            <Skeleton className="h-20 w-full rounded-xl" />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default function UserRoleMapping() {
  const [isLoading, setIsLoading] = useState(true);
  
  const {
    currentStep,
    formData,
    isSubmitting,
    submitSuccess,
    currentUserContext,
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
    canProceedFromStep,
    goToStep,
    goNext,
    goBack,
    submitForm,
    resetForm
  } = useFormWizard();
  
  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);
  
  // Calculate completed steps
  const completedSteps = STEPS.filter(step => 
    step.id < currentStep && canProceedFromStep(step.id)
  ).map(s => s.id);
  
  if (isLoading) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <Header />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary via-primary to-primary/80 text-primary-foreground overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/50 to-transparent" />
        
        <div className="container mx-auto px-4 py-10 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-white/10 backdrop-blur-sm rounded-lg">
                <Link2 className="h-6 w-6" />
              </div>
              <Badge variant="secondary" className="bg-white/20 text-white border-0">
                Role Assignment
              </Badge>
            </div>
            
            <h1 className="text-2xl md:text-3xl font-serif font-bold mb-2">
              User-Role-Committee Mapping
            </h1>
            <p className="text-base text-white/80 max-w-xl">
              Assign users to specific roles within committees across NCAHP's organizational structure.
            </p>
            
            {/* Stats Row */}
            <div className="flex flex-wrap gap-4 mt-6">
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-1.5 text-sm">
                <Users className="h-4 w-4 text-white/70" />
                <span className="font-semibold">{availableUsers.length}</span>
                <span className="text-white/70">Users</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-1.5 text-sm">
                <Building2 className="h-4 w-4 text-white/70" />
                <span className="font-semibold">{availableCommittees.length > 0 ? '40+' : '40+'}</span>
                <span className="text-white/70">Committees</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-1.5 text-sm">
                <BarChart3 className="h-4 w-4 text-white/70" />
                <span className="font-semibold">{mockExistingMappings.length}</span>
                <span className="text-white/70">Active Mappings</span>
              </div>
              {currentUserContext.canAssignToAllStates && (
                <div className="flex items-center gap-2 bg-emerald-500/20 backdrop-blur-sm rounded-lg px-3 py-1.5 text-sm border border-emerald-400/30">
                  <Shield className="h-4 w-4 text-emerald-300" />
                  <span className="text-emerald-100">Full Access (NCAHP HO)</span>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* Main Content */}
      <section className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          
          {/* Show success screen or form */}
          <AnimatePresence mode="wait">
            {submitSuccess ? (
              <motion.div
                key="success"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="bg-card rounded-2xl border shadow-sm p-8"
              >
                <SuccessScreen
                  user={selectedUser}
                  committee={selectedCommittee}
                  role={selectedRole}
                  onCreateAnother={resetForm}
                  onViewMappings={() => console.log('View mappings')}
                />
              </motion.div>
            ) : (
              <motion.div
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {/* Step Indicator */}
                <div className="mb-8 bg-card rounded-2xl border shadow-sm p-6">
                  <StepIndicator
                    steps={STEPS}
                    currentStep={currentStep}
                    completedSteps={completedSteps}
                    onStepClick={(step) => {
                      // Only allow clicking on completed steps or current step
                      if (step <= currentStep) {
                        goToStep(step);
                      }
                    }}
                  />
                </div>
                
                {/* Step Content */}
                <div className="bg-card rounded-2xl border shadow-sm p-6 md:p-8">
                  <AnimatePresence mode="wait">
                    {currentStep === 1 && (
                      <motion.div
                        key="step1"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                      >
                        <UserSelectionStep
                          users={availableUsers}
                          selectedUserId={formData.userId}
                          onSelect={(userId) => updateFormData('userId', userId)}
                        />
                      </motion.div>
                    )}
                    
                    {currentStep === 2 && (
                      <motion.div
                        key="step2"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                      >
                        <StakeholderSelectionStep
                          stakeholders={availableStakeholders}
                          selectedStakeholderId={formData.stakeholderId}
                          onSelect={(id) => updateFormData('stakeholderId', id)}
                        />
                      </motion.div>
                    )}
                    
                    {currentStep === 3 && (
                      <motion.div
                        key="step3"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                      >
                        <CommitteeTypeSelectionStep
                          committeeTypes={availableCommitteeTypes}
                          selectedCommitteeTypeId={formData.committeeTypeId}
                          onSelect={(id) => updateFormData('committeeTypeId', id)}
                        />
                      </motion.div>
                    )}
                    
                    {currentStep === 4 && (
                      <motion.div
                        key="step4"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                      >
                        <CommitteeSelectionStep
                          committees={availableCommittees}
                          selectedCommitteeId={formData.committeeId}
                          onSelect={(id) => updateFormData('committeeId', id)}
                          currentUserContext={currentUserContext}
                        />
                      </motion.div>
                    )}
                    
                    {currentStep === 5 && (
                      <motion.div
                        key="step5"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                      >
                        <RoleSelectionStep
                          roles={availableRoles}
                          selectedRoleId={formData.roleId}
                          onSelect={(id) => updateFormData('roleId', id)}
                        />
                      </motion.div>
                    )}
                    
                    {currentStep === 6 && (
                      <motion.div
                        key="step6"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                      >
                        <ReviewStep
                          user={selectedUser}
                          stakeholder={selectedStakeholder}
                          committeeType={selectedCommitteeType}
                          committee={selectedCommittee}
                          role={selectedRole}
                          validFrom={formData.validFrom}
                          validUntil={formData.validUntil}
                          onValidFromChange={(v) => updateFormData('validFrom', v)}
                          onValidUntilChange={(v) => updateFormData('validUntil', v)}
                          onEditStep={goToStep}
                          isSubmitting={isSubmitting}
                          onSubmit={submitForm}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                  
                  {/* Navigation Buttons */}
                  {currentStep < 6 && (
                    <motion.div 
                      className="flex items-center justify-between mt-8 pt-6 border-t"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      <Button
                        variant="outline"
                        onClick={goBack}
                        disabled={currentStep === 1}
                        className="gap-2"
                      >
                        <ArrowLeft className="w-4 h-4" />
                        Back
                      </Button>
                      
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        Step {currentStep} of 6
                      </div>
                      
                      <Button
                        onClick={goNext}
                        disabled={!canProceedFromStep(currentStep)}
                        className="gap-2"
                      >
                        Continue
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
      
      <Footer />
    </div>
  );
}
