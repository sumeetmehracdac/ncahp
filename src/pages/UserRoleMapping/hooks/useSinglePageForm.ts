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
  mockCurrentUserContext,
  mockStateUserContext
} from '../data/mockData';

const initialFormData: UserRoleMappingFormData = {
  userId: '',
  stakeholderId: '',
  committeeTypeId: '',
  committeeId: '',
  roleIds: [], // Multi-role selection

};

export type AdminType = 'HO' | 'SC';

export function useSinglePageForm(adminType: AdminType = 'HO') {
  const [formData, setFormData] = useState<UserRoleMappingFormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Current user context based on admin type
  const currentUserContext: CurrentUserContext = useMemo(() => {
    return adminType === 'HO' ? mockCurrentUserContext : mockStateUserContext;
  }, [adminType]);

  // Get available users
  const availableUsers: User[] = useMemo(() => {
    return mockUsers.filter(u => u.isActive);
  }, []);

  // Get stakeholders with RBAC filtering
  // HO Admin: Can see all stakeholder types (NCAHP_HO, STATE_COUNCIL, EXTERNAL)
  // SC Admin: Can only see STATE_COUNCIL and EXTERNAL
  const availableStakeholders: Stakeholder[] = useMemo(() => {
    if (!formData.userId) return [];

    return mockStakeholders.filter(s => {
      if (!s.isActive) return false;

      // RBAC filtering based on admin type
      if (adminType === 'HO') {
        // HO Admin can see all stakeholder types
        return true;
      } else {
        // SC Admin can only see STATE_COUNCIL and EXTERNAL (NOT NCAHP_HO)
        return s.stakeholderType !== 'NCAHP_HO';
      }
    });
  }, [formData.userId, adminType]);

  // Get committee types for selected stakeholder
  // Committee types are filtered by the selected stakeholder's type
  const availableCommitteeTypes: CommitteeType[] = useMemo(() => {
    if (!formData.stakeholderId) return [];

    const selectedStakeholder = mockStakeholders.find(s => s.stakeholderId === formData.stakeholderId);
    if (!selectedStakeholder) return [];

    return mockCommitteeTypes.filter(ct =>
      ct.isActive && ct.stakeholderType === selectedStakeholder.stakeholderType
    );
  }, [formData.stakeholderId]);

  // Get committees with filtering by committee type and state
  const availableCommittees: Committee[] = useMemo(() => {
    if (!formData.committeeTypeId || !formData.stakeholderId) return [];

    const selectedStakeholder = mockStakeholders.find(s => s.stakeholderId === formData.stakeholderId);
    if (!selectedStakeholder) return [];

    let filtered = mockCommittees.filter(c =>
      c.isActive && c.committeeType.committeeTypeId === formData.committeeTypeId
    );

    // State filtering for State Council stakeholders
    if (selectedStakeholder.stakeholderType === 'STATE_COUNCIL') {
      if (!currentUserContext.canAssignToAllStates) {
        // SC Admin can only see committees in their own state
        const userStateId = currentUserContext.stakeholder.state?.stateId;
        filtered = filtered.filter(c => c.state?.stateId === userStateId);
      }
    }

    return filtered;
  }, [formData.committeeTypeId, formData.stakeholderId, currentUserContext]);

  // Get roles filtered by the selected stakeholder type
  const availableRoles: Role[] = useMemo(() => {
    if (!formData.committeeId || !formData.stakeholderId) return [];

    const selectedStakeholder = mockStakeholders.find(s => s.stakeholderId === formData.stakeholderId);
    if (!selectedStakeholder) return [];

    // Filter roles by the stakeholder type (RBAC)
    return mockRoles.filter(r =>
      r.isActive && r.stakeholderType === selectedStakeholder.stakeholderType
    );
  }, [formData.committeeId, formData.stakeholderId]);

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

  // Multiple selected roles
  const selectedRoles = useMemo(() =>
    mockRoles.filter(r => formData.roleIds.includes(r.roleId)),
    [formData.roleIds]
  );

  // Progress calculation
  const progress = useMemo(() => {
    let completed = 0;
    if (formData.userId) completed++;
    if (formData.stakeholderId) completed++;
    if (formData.committeeTypeId) completed++;
    if (formData.committeeId) completed++;
    if (formData.roleIds.length > 0) completed++; // Multi-role check
    return { completed, total: 5, percentage: (completed / 5) * 100 };
  }, [formData]);

  // Check if form is complete
  const isFormComplete = useMemo(() => {
    return !!(
      formData.userId &&
      formData.stakeholderId &&
      formData.committeeTypeId &&
      formData.committeeId &&
      formData.roleIds.length > 0 // At least one role selected
    );
  }, [formData]);

  // Update form data with special handling for multi-role
  const updateFormData = useCallback((field: keyof UserRoleMappingFormData, value: string | string[]) => {
    setFormData(prev => {
      const updated = { ...prev };

      if (field === 'roleIds') {
        // Handle multi-role toggle
        const roleId = value as string;
        const currentRoles = prev.roleIds;
        if (currentRoles.includes(roleId)) {
          updated.roleIds = currentRoles.filter(id => id !== roleId);
        } else {
          updated.roleIds = [...currentRoles, roleId];
        }
      } else {
        // Handle single value fields
        (updated as any)[field] = value;

        // Clear dependent fields
        if (field === 'userId') {
          updated.stakeholderId = '';
          updated.committeeTypeId = '';
          updated.committeeId = '';
          updated.roleIds = [];
        } else if (field === 'stakeholderId') {
          updated.committeeTypeId = '';
          updated.committeeId = '';
          updated.roleIds = [];
        } else if (field === 'committeeTypeId') {
          updated.committeeId = '';
          updated.roleIds = [];
        } else if (field === 'committeeId') {
          updated.roleIds = [];
        }
      }

      return updated;
    });
  }, []);

  // Submit form
  const submitForm = useCallback(async () => {
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));

    console.log('Submitting mapping:', formData);
    console.log('Selected Roles:', selectedRoles.map(r => r.roleName));

    setIsSubmitting(false);
    setSubmitSuccess(true);
  }, [formData, selectedRoles]);

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
    adminType,
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
    selectedRoles, // Changed from selectedRole to selectedRoles

    updateFormData,
    submitForm,
    resetForm
  };
}
