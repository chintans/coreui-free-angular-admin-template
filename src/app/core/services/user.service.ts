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
  contractorProfile?: import('../models/user.model').ContractorProfile;
}

interface UpdateUserData {
  username?: string;
  email?: string;
  name?: string;
  role?: UserRole;
  avatar?: string;
  contractorProfile?: import('../models/user.model').ContractorProfile;
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
  readonly contractors = computed(() =>
    this.usersSignal().filter(u => u.role === UserRole.CONTRACTOR)
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
      avatar: userData.avatar,
      contractorProfile: userData.contractorProfile
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
        },
        {
          id: '4',
          username: 'contractor1',
          email: 'contractor1@scalex.com',
          role: UserRole.CONTRACTOR,
          name: 'Mike Contractor',
          avatar: '4.jpg',
          contractorProfile: {
            useCases: [
              'Web Development',
              'Mobile App Development',
              'E-commerce Solutions',
              'API Integration',
              'Cloud Architecture',
              'UI/UX Design'
            ],
            clientTestimonials: [
              {
                id: 't1',
                clientName: 'Sarah Johnson',
                clientCompany: 'TechStart Inc',
                testimonial: 'Mike delivered an exceptional web application that exceeded our expectations. His attention to detail and technical expertise helped us launch our product ahead of schedule. Highly recommended!',
                rating: 5,
                date: new Date('2024-01-15')
              },
              {
                id: 't2',
                clientName: 'David Chen',
                clientCompany: 'InnovateLabs',
                testimonial: 'Working with Mike was a pleasure. He transformed our mobile app idea into a polished, user-friendly application. His communication throughout the project was excellent.',
                rating: 5,
                date: new Date('2023-11-20')
              },
              {
                id: 't3',
                clientName: 'Emily Rodriguez',
                clientCompany: 'GrowthCo',
                testimonial: 'Mike\'s expertise in cloud architecture helped us scale our infrastructure efficiently. The solution he provided is robust and cost-effective. We\'re very satisfied with the results.',
                rating: 4,
                date: new Date('2023-10-10')
              }
            ],
            recentWork: [
              {
                id: 'w1',
                title: 'E-commerce Platform for Retail Chain',
                description: 'Developed a full-stack e-commerce solution with payment integration, inventory management, and admin dashboard. Implemented responsive design and optimized for performance.',
                clientName: 'RetailMax',
                completedDate: new Date('2024-01-30'),
                category: 'E-commerce'
              },
              {
                id: 'w2',
                title: 'Mobile Banking App',
                description: 'Built a secure mobile banking application with biometric authentication, transaction history, and bill payment features. Ensured compliance with financial regulations.',
                clientName: 'FinTech Solutions',
                completedDate: new Date('2023-12-15'),
                category: 'Finance'
              },
              {
                id: 'w3',
                title: 'Healthcare Management System',
                description: 'Created a comprehensive healthcare management system with patient records, appointment scheduling, and telemedicine capabilities. Integrated with multiple third-party APIs.',
                clientName: 'HealthCare Plus',
                completedDate: new Date('2023-11-05'),
                category: 'Healthcare'
              },
              {
                id: 'w4',
                title: 'Real Estate Listing Platform',
                description: 'Developed a property listing platform with advanced search filters, virtual tour integration, and CRM functionality. Implemented real-time notifications and messaging system.',
                clientName: 'PropertyHub',
                completedDate: new Date('2023-09-20'),
                category: 'Real Estate'
              }
            ],
            portfolio: [
              {
                id: 'p1',
                title: 'SaaS Dashboard Application',
                description: 'Modern SaaS dashboard with real-time analytics, user management, and customizable widgets. Built with Angular and integrated with multiple data sources.',
                imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800',
                link: 'https://example.com/portfolio/saas-dashboard',
                category: 'Web Application',
                tags: ['Angular', 'TypeScript', 'REST API', 'Charts', 'Dashboard']
              },
              {
                id: 'p2',
                title: 'Fitness Tracking Mobile App',
                description: 'Cross-platform mobile app for fitness tracking with workout plans, progress monitoring, and social features. Includes offline mode and data synchronization.',
                imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800',
                link: 'https://example.com/portfolio/fitness-app',
                category: 'Mobile App',
                tags: ['React Native', 'Firebase', 'Health API', 'Mobile']
              },
              {
                id: 'p3',
                title: 'Cloud Migration Project',
                description: 'Migrated legacy on-premise infrastructure to AWS cloud with zero downtime. Implemented CI/CD pipelines, auto-scaling, and disaster recovery solutions.',
                imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800',
                link: 'https://example.com/portfolio/cloud-migration',
                category: 'DevOps',
                tags: ['AWS', 'Docker', 'Kubernetes', 'CI/CD', 'Infrastructure']
              },
              {
                id: 'p4',
                title: 'E-learning Platform',
                description: 'Comprehensive e-learning platform with video streaming, quizzes, progress tracking, and certification system. Supports multiple languages and payment gateways.',
                imageUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800',
                link: 'https://example.com/portfolio/elearning',
                category: 'Education',
                tags: ['Vue.js', 'Node.js', 'Video Streaming', 'Payment Integration']
              }
            ]
          }
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
      '3': 'client123',     // client1
      '4': 'contractor123' // contractor1
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

