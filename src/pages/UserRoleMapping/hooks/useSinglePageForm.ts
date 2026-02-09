import { useState, useMemo, useCallback, useEffect } from 'react';
import type {
  UserRoleMappingFormData,
  CurrentUserContext,
  User,
  Stakeholder,
  CommitteeType,
  Committee,
  Role,
  UserRoleMapping
} from '../types';
import {
  mockUsers,
  mockStakeholders,
  mockCommitteeTypes,
  mockCommittees,
  mockRoles,
  mockExistingMappings,
  mockCurrentUserContext,
  mockStateUserContext
} from '../data/mockData';

const initialFormData: UserRoleMappingFormData = {
  userId: '',
  stakeholderId: '',
  committeeTypeId: '',
  committeeId: '',
  roleIds: [],
  defaultRoleId: '',
};

export type AdminType = 'HO' | 'SC';

export function useSinglePageForm(adminType: AdminType = 'HO') {
  const [formData, setFormData] = useState<UserRoleMappingFormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [editingMappingId, setEditingMappingId] = useState<string | null>(null);

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

  const selectedDefaultRole = useMemo(() =>
    mockRoles.find(r => r.roleId === formData.defaultRoleId),
    [formData.defaultRoleId]
  );

  // Auto-set defaultRoleId when roles change
  useEffect(() => {
    if (formData.roleIds.length === 1) {
      setFormData(prev => ({ ...prev, defaultRoleId: formData.roleIds[0] }));
    } else if (formData.roleIds.length === 0) {
      setFormData(prev => ({ ...prev, defaultRoleId: '' }));
    } else if (formData.defaultRoleId && !formData.roleIds.includes(formData.defaultRoleId)) {
      setFormData(prev => ({ ...prev, defaultRoleId: '' }));
    }
  }, [formData.roleIds, formData.defaultRoleId]);

  // Existing mappings for selected user
  const existingMappings: UserRoleMapping[] = useMemo(() => {
    if (!formData.userId) return [];
    return mockExistingMappings.filter(m => m.user.userId === formData.userId);
  }, [formData.userId]);

  // Progress calculation
  const progress = useMemo(() => {
    let completed = 0;
    if (formData.userId) completed++;
    if (formData.stakeholderId) completed++;
    if (formData.committeeTypeId) completed++;
    if (formData.committeeId) completed++;
    if (formData.roleIds.length > 0) completed++;
    if (formData.defaultRoleId) completed++;
    return { completed, total: 6, percentage: (completed / 6) * 100 };
  }, [formData]);

  // Check if form is complete
  const isFormComplete = useMemo(() => {
    return !!(
      formData.userId &&
      formData.stakeholderId &&
      formData.committeeTypeId &&
      formData.committeeId &&
      formData.roleIds.length > 0 &&
      formData.defaultRoleId
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
          updated.defaultRoleId = '';
        } else if (field === 'stakeholderId') {
          updated.committeeTypeId = '';
          updated.committeeId = '';
          updated.roleIds = [];
          updated.defaultRoleId = '';
        } else if (field === 'committeeTypeId') {
          updated.committeeId = '';
          updated.roleIds = [];
          updated.defaultRoleId = '';
        } else if (field === 'committeeId') {
          updated.roleIds = [];
          updated.defaultRoleId = '';
        }
      }

      return updated;
    });
  }, []);

  // Load an existing mapping into the form for editing
  const editMapping = useCallback((mapping: UserRoleMapping) => {
    setEditingMappingId(mapping.mappingId);
    setFormData({
      userId: mapping.user.userId,
      stakeholderId: mapping.stakeholder.stakeholderId,
      committeeTypeId: mapping.committee.committeeType.committeeTypeId,
      committeeId: mapping.committee.committeeId,
      roleIds: [mapping.role.roleId],
      defaultRoleId: mapping.role.roleId,
    });
    setSubmitSuccess(false);
  }, []);

  // Cancel editing
  const cancelEdit = useCallback(() => {
    setEditingMappingId(null);
  }, []);

  // Submit form
  const submitForm = useCallback(async () => {
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));

    console.log('Submitting mapping:', formData);
    console.log('Selected Roles:', selectedRoles.map(r => r.roleName));
    console.log('Default Role:', selectedDefaultRole?.roleName);
    console.log('Editing:', editingMappingId);

    setIsSubmitting(false);
    setSubmitSuccess(true);
    setEditingMappingId(null);
  }, [formData, selectedRoles, selectedDefaultRole, editingMappingId]);

  // Reset form
  const resetForm = useCallback(() => {
    setFormData(initialFormData);
    setSubmitSuccess(false);
    setEditingMappingId(null);
  }, []);

  return {
    formData,
    isSubmitting,
    submitSuccess,
    currentUserContext,
    adminType,
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
  };
}
