import { useState, useEffect } from 'react';
import { authClient } from '../auth';
import { getUserPermissions } from '../lib/permissions';

export interface UsePermissionsReturn {
  permissions: string[];
  loading: boolean;
  error: string | null;
  hasPermission: (permission: string) => boolean;
  hasAnyPermission: (permissions: string[]) => boolean;
  hasAllPermissions: (permissions: string[]) => boolean;
}

/**
 * Hook to get current user's permissions
 */
export function usePermissions(): UsePermissionsReturn {
  const [permissions, setPermissions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPermissions() {
      try {
        setLoading(true);
        setError(null);

        // Get current session
        const { data: session, error: sessionError } =
          await authClient.getSession();

        if (sessionError || !session?.user) {
          setPermissions([]);
          setError('No authenticated user');
          return;
        }

        // Fetch user permissions
        const userPermissions = await getUserPermissions(session.user.id);
        setPermissions(userPermissions);
      } catch (err) {
        console.error('Error fetching permissions:', err);
        setError('Failed to fetch permissions');
        setPermissions([]);
      } finally {
        setLoading(false);
      }
    }

    fetchPermissions();
  }, []);

  const hasPermission = (permission: string): boolean => {
    return permissions.includes(permission);
  };

  const hasAnyPermission = (requiredPermissions: string[]): boolean => {
    return requiredPermissions.some((permission) =>
      permissions.includes(permission)
    );
  };

  const hasAllPermissions = (requiredPermissions: string[]): boolean => {
    return requiredPermissions.every((permission) =>
      permissions.includes(permission)
    );
  };

  return {
    permissions,
    loading,
    error,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
  };
}

/**
 * Hook to check if user has specific permission
 */
export function useHasPermission(permission: string): boolean {
  const { hasPermission } = usePermissions();
  return hasPermission(permission);
}

/**
 * Hook to check if user has any of the specified permissions
 */
export function useHasAnyPermission(permissions: string[]): boolean {
  const { hasAnyPermission } = usePermissions();
  return hasAnyPermission(permissions);
}
