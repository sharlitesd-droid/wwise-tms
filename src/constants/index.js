export const BRANCHES = [
  { id: 'upington', name: 'Upington', region: 'Northern Cape' },
  { id: 'centurion', name: 'Centurion', region: 'Gauteng' },
  { id: 'cape-town', name: 'Cape Town', region: 'Western Cape' },
  { id: 'dubai', name: 'Dubai', region: 'UAE' },
];

export const TASK_STATUSES = [
  { id: 'pending', label: 'Pending', color: '#f59e0b' },
  { id: 'in-progress', label: 'In Progress', color: '#ec4899' },
  { id: 'completed', label: 'Completed', color: '#10b981' },
];

export const ROLES = {
  ADMIN: 'admin',
  BRANCH_ADMIN: 'branch_admin',
  EMPLOYEE: 'employee',
};

export const ROLE_LABELS = {
  admin: 'System Administrator',
  branch_admin: 'Branch Administrator',
  employee: 'Employee',
};

export const PRIORITIES = [
  { id: 'low', label: 'Low', color: '#6b7280' },
  { id: 'medium', label: 'Medium', color: '#f59e0b' },
  { id: 'high', label: 'High', color: '#ef4444' },
];

export function getBranchName(branchId) {
  return BRANCHES.find((b) => b.id === branchId)?.name ?? branchId;
}

export function getStatusLabel(statusId) {
  return TASK_STATUSES.find((s) => s.id === statusId)?.label ?? statusId;
}

export function getStatusColor(statusId) {
  return TASK_STATUSES.find((s) => s.id === statusId)?.color ?? '#6b7280';
}

export function getPriorityLabel(priorityId) {
  return PRIORITIES.find((p) => p.id === priorityId)?.label ?? priorityId;
}
