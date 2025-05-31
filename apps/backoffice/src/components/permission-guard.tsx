import { ReactNode } from 'react';
import { usePermissions } from '../hooks/use-permissions';

interface PermissionGuardProps {
  children: ReactNode;
  permission?: string;
  permissions?: string[];
  requireAll?: boolean;
  fallback?: ReactNode;
  loading?: ReactNode;
}

/**
 * Component that conditionally renders children based on user permissions
 */
export function PermissionGuard({
  children,
  permission,
  permissions = [],
  requireAll = false,
  fallback = null,
  loading = null,
}: PermissionGuardProps) {
  const {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    loading: permissionsLoading,
  } = usePermissions();

  if (permissionsLoading) {
    return <>{loading}</>;
  }

  // Single permission check
  if (permission) {
    return hasPermission(permission) ? <>{children}</> : <>{fallback}</>;
  }

  // Multiple permissions check
  if (permissions.length > 0) {
    const hasAccess = requireAll
      ? hasAllPermissions(permissions)
      : hasAnyPermission(permissions);

    return hasAccess ? <>{children}</> : <>{fallback}</>;
  }

  // No permissions specified, render children
  return <>{children}</>;
}

/**
 * Higher-order component for permission-based rendering
 */
export function withPermission<T extends object>(
  Component: React.ComponentType<T>,
  permission: string,
  fallback?: ReactNode
) {
  return function PermissionWrappedComponent(props: T) {
    return (
      <PermissionGuard permission={permission} fallback={fallback}>
        <Component {...props} />
      </PermissionGuard>
    );
  };
}

/**
 * Higher-order component for multiple permissions
 */
export function withPermissions<T extends object>(
  Component: React.ComponentType<T>,
  permissions: string[],
  requireAll = false,
  fallback?: ReactNode
) {
  return function PermissionsWrappedComponent(props: T) {
    return (
      <PermissionGuard
        permissions={permissions}
        requireAll={requireAll}
        fallback={fallback}
      >
        <Component {...props} />
      </PermissionGuard>
    );
  };
}
