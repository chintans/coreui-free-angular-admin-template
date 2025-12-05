import { Injectable, signal, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of, delay, throwError } from 'rxjs';
import { User, UserRole, LoginCredentials, AuthState } from '../models/user.model';
import { UserService } from './user.service';

// Dummy users data
const DUMMY_USERS: User[] = [
  {
    id: '1',
    username: 'superadmin',
    email: 'superadmin@scalex.com',
    role: UserRole.SUPER_ADMIN,
    name: 'Super Admin',
    avatar: '1.jpg'
  },
  {
    id: '2',
    username: 'consultant1',
    email: 'consultant1@scalex.com',
    role: UserRole.CONSULTANT,
    name: 'John Consultant',
    avatar: '2.jpg'
  },
  {
    id: '3',
    username: 'client1',
    email: 'client1@scalex.com',
    role: UserRole.CLIENT,
    name: 'Jane Client',
    avatar: '3.jpg'
  }
];

// Dummy credentials mapping
const DUMMY_CREDENTIALS: Record<string, { password: string; userId: string }> = {
  'superadmin': { password: 'admin123', userId: '1' },
  'consultant1': { password: 'consultant123', userId: '2' },
  'client1': { password: 'client123', userId: '3' }
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly router = inject(Router);
  private readonly userService = inject(UserService);
  private readonly AUTH_STORAGE_KEY = 'scalex_auth';
  private readonly CREDENTIALS_STORAGE_KEY = 'scalex_user_credentials';

  // Auth state using signals
  private readonly authState = signal<AuthState>(this.loadAuthStateFromStorage());

  // Computed signals for reactive state
  readonly currentUser = computed(() => this.authState().user);
  readonly isAuthenticated = computed(() => this.authState().isAuthenticated);
  readonly userRole = computed(() => this.authState().user?.role ?? null);

  constructor() {
    // Initialize auth state from localStorage
    this.initializeAuthState();
  }

  /**
   * Login with username and password
   */
  login(credentials: LoginCredentials): Observable<User> {
    const { username, password } = credentials;
    
    // First check hardcoded credentials (for backward compatibility)
    const dummyCredential = DUMMY_CREDENTIALS[username.toLowerCase()];
    if (dummyCredential && dummyCredential.password === password) {
      const user = DUMMY_USERS.find(u => u.id === dummyCredential.userId);
      if (user) {
        return of(user).pipe(delay(500));
      }
    }

    // Check UserService for dynamically created users
    const allUsers = this.userService.users();
    const user = allUsers.find(u => u.username.toLowerCase() === username.toLowerCase());
    
    if (user) {
      // Check password from UserService storage
      const storedCredentials = this.loadUserCredentials();
      const storedPassword = storedCredentials[user.id];
      
      if (storedPassword && storedPassword === password) {
        return of(user).pipe(delay(500));
      }
    }

    return throwError(() => new Error('Invalid username or password'));
  }

  /**
   * Set authenticated user
   */
  setAuthenticatedUser(user: User, token?: string): void {
    const newState: AuthState = {
      user,
      isAuthenticated: true,
      token: token ?? `dummy_token_${user.id}_${Date.now()}`
    };
    this.authState.set(newState);
    this.saveAuthStateToStorage(newState);
  }

  /**
   * Logout current user
   */
  logout(): void {
    this.authState.set({
      user: null,
      isAuthenticated: false
    });
    this.clearAuthStateFromStorage();
    this.router.navigate(['/login']);
  }

  /**
   * Check if user has specific role
   */
  hasRole(role: UserRole): boolean {
    return this.userRole() === role;
  }

  /**
   * Check if user has any of the provided roles
   */
  hasAnyRole(roles: UserRole[]): boolean {
    const currentRole = this.userRole();
    return currentRole !== null && roles.includes(currentRole);
  }

  /**
   * Check if user can manage users (Super Admin only)
   */
  canManageUsers(): boolean {
    return this.hasRole(UserRole.SUPER_ADMIN);
  }

  /**
   * Check if user can add consultants (Super Admin only)
   */
  canAddConsultants(): boolean {
    return this.hasRole(UserRole.SUPER_ADMIN);
  }

  /**
   * Check if user can manage projects (Consultant only)
   */
  canManageProjects(): boolean {
    return this.hasRole(UserRole.CONSULTANT);
  }

  /**
   * Check if user can access marketplace (Consultant only)
   */
  canAccessMarketplace(): boolean {
    return this.hasRole(UserRole.CONSULTANT);
  }

  /**
   * Check if user can add clients (Consultant only)
   */
  canAddClients(): boolean {
    return this.hasRole(UserRole.CONSULTANT);
  }

  /**
   * Check if user can access client portal (Client only)
   */
  canAccessClientPortal(): boolean {
    return this.hasRole(UserRole.CLIENT);
  }

  /**
   * Initialize auth state from localStorage
   */
  private initializeAuthState(): void {
    const savedState = this.loadAuthStateFromStorage();
    if (savedState.isAuthenticated && savedState.user) {
      this.authState.set(savedState);
    }
  }

  /**
   * Load auth state from localStorage
   */
  private loadAuthStateFromStorage(): AuthState {
    try {
      const stored = localStorage.getItem(this.AUTH_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.user) {
          // Check if user exists in either dummy data or UserService
          const existsInDummy = DUMMY_USERS.find(u => u.id === parsed.user.id);
          const existsInService = this.userService.getUserById(parsed.user.id);
          
          if (existsInDummy || existsInService) {
            return parsed;
          }
        }
      }
    } catch (error) {
      console.error('Error loading auth state from storage:', error);
    }
    return { user: null, isAuthenticated: false };
  }

  /**
   * Save auth state to localStorage
   */
  private saveAuthStateToStorage(state: AuthState): void {
    try {
      localStorage.setItem(this.AUTH_STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      console.error('Error saving auth state to storage:', error);
    }
  }

  /**
   * Clear auth state from localStorage
   */
  private clearAuthStateFromStorage(): void {
    try {
      localStorage.removeItem(this.AUTH_STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing auth state from storage:', error);
    }
  }

  /**
   * Load user credentials from storage
   */
  private loadUserCredentials(): Record<string, string> {
    try {
      const stored = localStorage.getItem(this.CREDENTIALS_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error('Error loading user credentials:', error);
    }
    return {};
  }
}

