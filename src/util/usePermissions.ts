import { useAuth } from '../context/auth.context';
import { User } from '../types/types';

type Role = User['role'];

export const PERMISSIONS = {
  MANAGE_CONTACTS: ['admin'] as Role[],
  MANAGE_VENUES: ['admin', 'manager'] as Role[],
  VIEW_CONTACTS: ['admin', 'manager', 'staff'] as Role[],
  VIEW_VENUES: ['admin', 'manager', 'staff'] as Role[],
  MANAGE_USERS: ['admin'] as Role[],
} as const;

export type PermissionType = keyof typeof PERMISSIONS;

export const usePermissions = () => {
  const { user } = useAuth();
  
  const hasPermission = (permission: PermissionType): boolean => {
    if (!user) return false;
    return PERMISSIONS[permission].includes(user.role);
  };

  return { hasPermission };
};