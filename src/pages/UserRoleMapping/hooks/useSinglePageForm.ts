import { useState, useMemo, useCallback } from 'react';
import type { 
  UserRoleMappingFormData, 
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

export function useSinglePageForm() {
  const [formData, setFormData] = useState<UserRoleMappingFormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  
  // Current user context
  const currentUserContext: CurrentUserContext = mockCurrentUserContext;
  
  // Get available users
  const availableUsers: User[] = useMemo(() => {
    return mockUsers.filter(u => u.isActive);
  }, []);
  
  // Get stakeholders for selected user
  const availableStakeholders: Stakeholder[] = useMemo(() => {
    if (!formData.userId) return [];
    return mockStakeholders.filter(s => s.isActive);
  }, [formData.userId]);
  
  // Get committee types for selected stakeholder
  const availableCommitteeTypes: CommitteeType[] = useMemo(() => {
    if (!formData.stakeholderId) return [];
    
    const selectedStakeholder = mockStakeholders.find(s => s.stakeholderId === formData.stakeholderId);
    if (!selectedStakeholder) return [];
    
    return mockCommitteeTypes.filter(ct => 
      ct.isActive && ct.stakeholderType === selectedStakeholder.stakeholderType
    );
  }, [formData.stakeholderId]);
  
  // Get committees with STATE FILTERING
  const availableCommittees: Committee[] = useMemo(() => {
    if (!formData.committeeTypeId || !formData.stakeholderId) return [];
    
    const selectedStakeholder = mockStakeholders.find(s => s.stakeholderId === formData.stakeholderId);
    if (!selectedStakeholder) return [];
    
    let filtered = mockCommittees.filter(c => 
      c.isActive && c.committeeType.committeeTypeId === formData.committeeTypeId
    );
    
    // State filtering for State Council users
    if (selectedStakeholder.stakeholderType === 'STATE_COUNCIL') {
      if (!currentUserContext.canAssignToAllStates) {
        const userStateId = currentUserContext.stakeholder.state?.stateId;
        filtered = filtered.filter(c => c.state?.stateId === userStateId);
      }
    }
    
    return filtered;
  }, [formData.committeeTypeId, formData.stakeholderId, currentUserContext]);
  
  // Get roles
  const availableRoles: Role[] = useMemo(() => {
    if (!formData.committeeId) return [];
    return mockRoles.filter(r => r.isActive);
  }, [formData.committeeId]);
  
  // Selected entities
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
  
  // Progress calculation
  const progress = useMemo(() => {
    let completed = 0;
    if (formData.userId) completed++;
    if (formData.stakeholderId) completed++;
    if (formData.committeeTypeId) completed++;
    if (formData.committeeId) completed++;
    if (formData.roleId) completed++;
    return { completed, total: 5, percentage: (completed / 5) * 100 };
  }, [formData]);
  
  // Check if form is complete
  const isFormComplete = useMemo(() => {
    return !!(
      formData.userId && 
      formData.stakeholderId && 
      formData.committeeTypeId && 
      formData.committeeId && 
      formData.roleId
    );
  }, [formData]);
  
  // Update form data
  const updateFormData = useCallback((field: keyof UserRoleMappingFormData, value: string) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value };
      
      // Clear dependent fields
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
  
  // Submit form
  const submitForm = useCallback(async () => {
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    console.log('Submitting mapping:', formData);
    
    setIsSubmitting(false);
    setSubmitSuccess(true);
  }, [formData]);
  
  // Reset form
  const resetForm = useCallback(() => {
    setFormData(initialFormData);
    setSubmitSuccess(false);
  }, []);
  
  return {
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
  };
}
