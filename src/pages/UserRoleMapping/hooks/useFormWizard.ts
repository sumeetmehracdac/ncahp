import { useState, useCallback, useMemo } from 'react';
import type { 
  UserRoleMappingFormData, 
  FilterOptions, 
  CurrentUserContext,
  User,
  Stakeholder,
  CommitteeType,
  Committee,
  Role
} from '../types';
import { 
  mockUsers, 
  mockStakeholders, 
  mockCommitteeTypes, 
  mockCommittees, 
  mockRoles,
  mockCurrentUserContext 
} from '../data/mockData';

const initialFormData: UserRoleMappingFormData = {
  userId: '',
  stakeholderId: '',
  committeeTypeId: '',
  committeeId: '',
  roleId: '',
  validFrom: new Date().toISOString().split('T')[0],
  validUntil: ''
};

export function useFormWizard() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<UserRoleMappingFormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  
  // Current user context (in real app, this would come from auth)
  const currentUserContext: CurrentUserContext = mockCurrentUserContext;
  
  // Get available users
  const availableUsers: User[] = useMemo(() => {
    return mockUsers.filter(u => u.isActive);
  }, []);
  
  // Get stakeholders for selected user
  const availableStakeholders: Stakeholder[] = useMemo(() => {
    if (!formData.userId) return [];
    // In real app, this would be filtered by user's associated stakeholders
    return mockStakeholders.filter(s => s.isActive);
  }, [formData.userId]);
  
  // Get committee types for selected stakeholder
  const availableCommitteeTypes: CommitteeType[] = useMemo(() => {
    if (!formData.stakeholderId) return [];
    
    const selectedStakeholder = mockStakeholders.find(s => s.stakeholderId === formData.stakeholderId);
    if (!selectedStakeholder) return [];
    
    // Filter by stakeholder type
    return mockCommitteeTypes.filter(ct => 
      ct.isActive && ct.stakeholderType === selectedStakeholder.stakeholderType
    );
  }, [formData.stakeholderId]);
  
  // Get committees with STATE FILTERING (the critical business rule)
  const availableCommittees: Committee[] = useMemo(() => {
    if (!formData.committeeTypeId || !formData.stakeholderId) return [];
    
    const selectedStakeholder = mockStakeholders.find(s => s.stakeholderId === formData.stakeholderId);
    if (!selectedStakeholder) return [];
    
    let filtered = mockCommittees.filter(c => 
      c.isActive && c.committeeType.committeeTypeId === formData.committeeTypeId
    );
    
    // ⭐⭐⭐ CRITICAL: State filtering for State Council users
    if (selectedStakeholder.stakeholderType === 'STATE_COUNCIL') {
      if (!currentUserContext.canAssignToAllStates) {
        // State Council user can ONLY see their own state's committees
        const userStateId = currentUserContext.stakeholder.state?.stateId;
        filtered = filtered.filter(c => c.state?.stateId === userStateId);
      }
      // NCAHP HO user can see all states
    }
    
    return filtered;
  }, [formData.committeeTypeId, formData.stakeholderId, currentUserContext]);
  
  // Get roles for selected committee type
  const availableRoles: Role[] = useMemo(() => {
    if (!formData.committeeTypeId) return [];
    
    // Return all roles (in real app, filter by committee type mapping)
    return mockRoles.filter(r => r.isActive);
  }, [formData.committeeTypeId]);
  
  // Selected entities (for display)
  const selectedUser = useMemo(() => 
    mockUsers.find(u => u.userId === formData.userId),
    [formData.userId]
  );
  
  const selectedStakeholder = useMemo(() => 
    mockStakeholders.find(s => s.stakeholderId === formData.stakeholderId),
    [formData.stakeholderId]
  );
  
  const selectedCommitteeType = useMemo(() => 
    mockCommitteeTypes.find(ct => ct.committeeTypeId === formData.committeeTypeId),
    [formData.committeeTypeId]
  );
  
  const selectedCommittee = useMemo(() => 
    mockCommittees.find(c => c.committeeId === formData.committeeId),
    [formData.committeeId]
  );
  
  const selectedRole = useMemo(() => 
    mockRoles.find(r => r.roleId === formData.roleId),
    [formData.roleId]
  );
  
  // Update form data
  const updateFormData = useCallback((field: keyof UserRoleMappingFormData, value: string) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value };
      
      // Clear dependent fields when parent changes
      if (field === 'userId') {
        updated.stakeholderId = '';
        updated.committeeTypeId = '';
        updated.committeeId = '';
        updated.roleId = '';
      } else if (field === 'stakeholderId') {
        updated.committeeTypeId = '';
        updated.committeeId = '';
        updated.roleId = '';
      } else if (field === 'committeeTypeId') {
        updated.committeeId = '';
        updated.roleId = '';
      } else if (field === 'committeeId') {
        updated.roleId = '';
      }
      
      return updated;
    });
  }, []);
  
  // Step validation
  const canProceedFromStep = useCallback((step: number): boolean => {
    switch (step) {
      case 1: return !!formData.userId;
      case 2: return !!formData.stakeholderId;
      case 3: return !!formData.committeeTypeId;
      case 4: return !!formData.committeeId;
      case 5: return !!formData.roleId;
      case 6: return true; // Review step
      default: return false;
    }
  }, [formData]);
  
  // Navigation
  const goToStep = useCallback((step: number) => {
    if (step >= 1 && step <= 6) {
      setCurrentStep(step);
    }
  }, []);
  
  const goNext = useCallback(() => {
    if (canProceedFromStep(currentStep) && currentStep < 6) {
      setCurrentStep(prev => prev + 1);
    }
  }, [currentStep, canProceedFromStep]);
  
  const goBack = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  }, [currentStep]);
  
  // Submit form
  const submitForm = useCallback(async () => {
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // In real app, POST to /api/v1/user-role-mappings
    console.log('Submitting mapping:', {
      userId: formData.userId,
      stakeholderId: formData.stakeholderId,
      committeeId: formData.committeeId,
      roleId: formData.roleId,
      validFrom: formData.validFrom,
      validUntil: formData.validUntil || null
    });
    
    setIsSubmitting(false);
    setSubmitSuccess(true);
  }, [formData]);
  
  // Reset form
  const resetForm = useCallback(() => {
    setFormData(initialFormData);
    setCurrentStep(1);
    setSubmitSuccess(false);
  }, []);
  
  return {
    currentStep,
    formData,
    isSubmitting,
    submitSuccess,
    currentUserContext,
    
    // Available options
    availableUsers,
    availableStakeholders,
    availableCommitteeTypes,
    availableCommittees,
    availableRoles,
    
    // Selected entities
    selectedUser,
    selectedStakeholder,
    selectedCommitteeType,
    selectedCommittee,
    selectedRole,
    
    // Actions
    updateFormData,
    canProceedFromStep,
    goToStep,
    goNext,
    goBack,
    submitForm,
    resetForm
  };
}
