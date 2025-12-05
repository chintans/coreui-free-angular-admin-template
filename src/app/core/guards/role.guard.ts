import { inject } from '@angular/core';
import { Router, CanActivateFn, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UserRole } from '../models/user.model';

/**
 * Guard to protect routes based on user roles
 * Usage: canActivate: [roleGuard], data: { roles: [UserRole.SUPER_ADMIN, UserRole.CONSULTANT] }
 */
export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // First check if user is authenticated
  if (!authService.isAuthenticated()) {
    return router.createUrlTree(['/login']);
  }

  // Get required roles from route data
  const requiredRoles = route.data['roles'] as UserRole[] | undefined;

  // If no roles specified, allow access (just need authentication)
  if (!requiredRoles || requiredRoles.length === 0) {
    return true;
  }

  // Check if user has any of the required roles
  if (authService.hasAnyRole(requiredRoles)) {
    return true;
  }

  // User doesn't have required role, redirect to dashboard or 403
  return router.createUrlTree(['/dashboard']);
};

