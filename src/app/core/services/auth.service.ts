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

// Dummy credentials mapping
const DUMMY_CREDENTIALS: Record<string, { password: string; userId: string }> = {
  'superadmin@scalex.com': { password: 'admin123', userId: '1' },
  'consultant1@scalex.com': { password: 'consultant123', userId: '2' },
  'client1@scalex.com': { password: 'client123', userId: '3' },
  'contractor1@scalex.com': { password: 'contractor123', userId: '4' }
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
   * Login with email and password
   */
  login(credentials: LoginCredentials): Observable<User> {
    const { email, password } = credentials;
    
    // First check hardcoded credentials (for backward compatibility)
    const dummyCredential = DUMMY_CREDENTIALS[email.toLowerCase()];
    if (dummyCredential && dummyCredential.password === password) {
      const user = DUMMY_USERS.find(u => u.id === dummyCredential.userId);
      if (user) {
        return of(user).pipe(delay(500));
      }
    }

    // Check UserService for dynamically created users
    const allUsers = this.userService.users();
    const user = allUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (user) {
      // Check password from UserService storage
      const storedCredentials = this.loadUserCredentials();
      const storedPassword = storedCredentials[user.id];
      
      if (storedPassword && storedPassword === password) {
        return of(user).pipe(delay(500));
      }
    }

    return throwError(() => new Error('Invalid email or password'));
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
   * Check if user can add contractors (Super Admin only)
   */
  canAddContractors(): boolean {
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
   * Check if user can manage contractor profile (Contractor only)
   */
  canManageContractorProfile(): boolean {
    return this.hasRole(UserRole.CONTRACTOR);
  }

  /**
   * Check if user can view assigned projects (Contractor only)
   */
  canViewAssignedProjects(): boolean {
    return this.hasRole(UserRole.CONTRACTOR);
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

