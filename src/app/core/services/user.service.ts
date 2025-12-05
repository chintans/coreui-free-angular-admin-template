import { Injectable, signal, computed } from '@angular/core';
import { Observable, of, delay, throwError } from 'rxjs';
import { User, UserRole } from '../models/user.model';

interface CreateUserData {
  username: string;
  email: string;
  name: string;
  role: UserRole;
  password: string;
  avatar?: string;
}

interface UpdateUserData {
  username?: string;
  email?: string;
  name?: string;
  role?: UserRole;
  avatar?: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly STORAGE_KEY = 'scalex_users';
  private readonly USERS_STORAGE_KEY = 'scalex_user_credentials';
  private readonly AUTH_STORAGE_KEY = 'scalex_auth';

  // Users state using signals
  private readonly usersSignal = signal<User[]>(this.loadUsersFromStorage());

  // Computed signals for reactive state
  readonly users = this.usersSignal.asReadonly();
  readonly consultants = computed(() =>
    this.usersSignal().filter(u => u.role === UserRole.CONSULTANT)
  );
  readonly clients = computed(() =>
    this.usersSignal().filter(u => u.role === UserRole.CLIENT)
  );
  readonly admins = computed(() =>
    this.usersSignal().filter(u => u.role === UserRole.SUPER_ADMIN)
  );
  readonly usersCount = computed(() => this.usersSignal().length);

  constructor() {
    this.initializeUsers();
  }

  /**
   * Get user by ID
   */
  getUserById(id: string): User | undefined {
    return this.usersSignal().find(u => u.id === id);
  }

  /**
   * Get all users
   */
  getAllUsers(): Observable<User[]> {
    return of(this.usersSignal()).pipe(delay(300));
  }

  /**
   * Create a new user
   */
  createUser(userData: CreateUserData): Observable<User> {
    // Validate email uniqueness
    if (this.usersSignal().some(u => u.email.toLowerCase() === userData.email.toLowerCase())) {
      return throwError(() => new Error('User with this email already exists'));
    }

    // Validate username uniqueness
    if (this.usersSignal().some(u => u.username.toLowerCase() === userData.username.toLowerCase())) {
      return throwError(() => new Error('Username is already taken'));
    }

    const newUser: User = {
      id: this.generateId(),
      username: userData.username,
      email: userData.email,
      name: userData.name,
      role: userData.role,
      avatar: userData.avatar
    };

    // Add user to signal
    this.usersSignal.update(users => [...users, newUser]);

    // Save password credentials separately
    this.saveUserCredentials(newUser.id, userData.password);

    // Save to storage
    this.saveUsersToStorage();

    return of(newUser).pipe(delay(500));
  }

  /**
   * Update existing user
   */
  updateUser(id: string, updates: UpdateUserData): Observable<User> {
    const user = this.getUserById(id);
    if (!user) {
      return throwError(() => new Error('User not found'));
    }

    // Validate email uniqueness (excluding current user)
    if (updates.email && this.usersSignal().some(u => u.id !== id && u.email.toLowerCase() === updates.email!.toLowerCase())) {
      return throwError(() => new Error('User with this email already exists'));
    }

    // Validate username uniqueness (excluding current user)
    if (updates.username && this.usersSignal().some(u => u.id !== id && u.username.toLowerCase() === updates.username!.toLowerCase())) {
      return throwError(() => new Error('Username is already taken'));
    }

    const updatedUser: User = {
      ...user,
      ...updates
    };

    this.usersSignal.update(users =>
      users.map(u => (u.id === id ? updatedUser : u))
    );

    this.saveUsersToStorage();

    return of(updatedUser).pipe(delay(500));
  }

  /**
   * Delete user
   */
  deleteUser(id: string): Observable<boolean> {
    const user = this.getUserById(id);
    if (!user) {
      return throwError(() => new Error('User not found'));
    }

    // Prevent deleting the current user
    const currentUserId = this.getCurrentUserIdFromStorage();
    if (currentUserId && currentUserId === id) {
      return throwError(() => new Error('You cannot delete your own account'));
    }

    this.usersSignal.update(users => users.filter(u => u.id !== id));

    // Remove credentials
    this.deleteUserCredentials(id);

    this.saveUsersToStorage();

    return of(true).pipe(delay(500));
  }

  /**
   * Search users by query
   */
  searchUsers(query: string): User[] {
    if (!query.trim()) {
      return this.usersSignal();
    }

    const lowerQuery = query.toLowerCase();
    return this.usersSignal().filter(
      user =>
        user.name.toLowerCase().includes(lowerQuery) ||
        user.email.toLowerCase().includes(lowerQuery) ||
        user.username.toLowerCase().includes(lowerQuery)
    );
  }

  /**
   * Filter users by role
   */
  filterUsersByRole(role: UserRole | null): User[] {
    if (!role) {
      return this.usersSignal();
    }
    return this.usersSignal().filter(u => u.role === role);
  }

  /**
   * Reset user password (for Super Admin)
   */
  resetUserPassword(userId: string, newPassword: string): Observable<boolean> {
    const user = this.getUserById(userId);
    if (!user) {
      return throwError(() => new Error('User not found'));
    }

    this.saveUserCredentials(userId, newPassword);

    return of(true).pipe(delay(500));
  }

  /**
   * Generate unique ID
   */
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  /**
   * Initialize users from storage or create default users
   */
  private initializeUsers(): void {
    const storedUsers = this.loadUsersFromStorage();
    if (storedUsers.length === 0) {
      // Initialize with default users from AuthService
      const defaultUsers: User[] = [
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

      this.usersSignal.set(defaultUsers);
      this.saveUsersToStorage();
      
      // Initialize default credentials for default users
      this.initializeDefaultCredentials();
    } else {
      this.usersSignal.set(storedUsers);
    }
  }

  /**
   * Initialize default credentials for default users
   */
  private initializeDefaultCredentials(): void {
    const credentials = this.loadUserCredentials();
    const defaultCredentials: Record<string, string> = {
      '1': 'admin123',      // superadmin
      '2': 'consultant123', // consultant1
      '3': 'client123'      // client1
    };

    // Only set if not already present
    Object.entries(defaultCredentials).forEach(([userId, password]) => {
      if (!credentials[userId]) {
        credentials[userId] = password;
      }
    });

    try {
      localStorage.setItem(this.USERS_STORAGE_KEY, JSON.stringify(credentials));
    } catch (error) {
      console.error('Error initializing default credentials:', error);
    }
  }

  /**
   * Load users from localStorage
   */
  private loadUsersFromStorage(): User[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error('Error loading users from storage:', error);
    }
    return [];
  }

  /**
   * Save users to localStorage
   */
  private saveUsersToStorage(): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.usersSignal()));
    } catch (error) {
      console.error('Error saving users to storage:', error);
    }
  }

  /**
   * Save user credentials (password) separately
   */
  private saveUserCredentials(userId: string, password: string): void {
    try {
      const credentials = this.loadUserCredentials();
      credentials[userId] = password;
      localStorage.setItem(this.USERS_STORAGE_KEY, JSON.stringify(credentials));
    } catch (error) {
      console.error('Error saving user credentials:', error);
    }
  }

  /**
   * Load user credentials
   */
  private loadUserCredentials(): Record<string, string> {
    try {
      const stored = localStorage.getItem(this.USERS_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error('Error loading user credentials:', error);
    }
    return {};
  }

  /**
   * Delete user credentials
   */
  private deleteUserCredentials(userId: string): void {
    try {
      const credentials = this.loadUserCredentials();
      delete credentials[userId];
      localStorage.setItem(this.USERS_STORAGE_KEY, JSON.stringify(credentials));
    } catch (error) {
      console.error('Error deleting user credentials:', error);
    }
  }

  /**
   * Get current user ID from auth storage (to avoid circular dependency)
   */
  private getCurrentUserIdFromStorage(): string | null {
    try {
      const stored = localStorage.getItem(this.AUTH_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.user && parsed.user.id) {
          return parsed.user.id;
        }
      }
    } catch (error) {
      console.error('Error getting current user ID from storage:', error);
    }
    return null;
  }
}

