import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  CardComponent,
  CardBodyComponent,
  CardHeaderComponent,
  FormModule,
  ButtonDirective,
  RowComponent,
  ColComponent,
  AlertComponent,
  AlertModule
} from '@coreui/angular';
import { IconDirective } from '@coreui/icons-angular';
import { UserService } from '../../../core/services/user.service';
import { UserRole } from '../../../core/models/user.model';

@Component({
  selector: 'app-new-user',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CardComponent,
    CardBodyComponent,
    CardHeaderComponent,
    FormModule,
    ButtonDirective,
    RowComponent,
    ColComponent,
    AlertComponent,
    AlertModule,
    IconDirective
  ],
  templateUrl: './new-user.component.html',
  styleUrls: ['./new-user.component.scss']
})
export class NewUserComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly userService = inject(UserService);

  userId = signal<string | null>(null);
  isEditMode = signal(false);
  isLoading = signal(false);
  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);

  userForm = this.fb.group({
    username: ['', [Validators.required, Validators.minLength(3), Validators.pattern(/^[a-zA-Z0-9_]+$/)]],
    email: ['', [Validators.required, Validators.email]],
    name: ['', [Validators.required, Validators.minLength(2)]],
    role: this.fb.control<UserRole>(UserRole.CLIENT, { validators: Validators.required }),
    password: ['', []],
    confirmPassword: ['']
  });

  roles: Array<{ value: UserRole; label: string; description: string }> = [
    {
      value: UserRole.SUPER_ADMIN,
      label: 'Super Admin',
      description: 'Full system access and user management'
    },
    {
      value: UserRole.CONSULTANT,
      label: 'Consultant',
      description: 'Can manage projects and access marketplace'
    },
    {
      value: UserRole.CLIENT,
      label: 'Client',
      description: 'Can access client portal and view assigned projects'
    }
  ];

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.userId.set(id);
        this.isEditMode.set(true);
        this.loadUser(id);
        // Password not required in edit mode
        this.userForm.get('password')?.clearValidators();
        this.userForm.get('confirmPassword')?.clearValidators();
      } else {
        // Password required in create mode
        this.userForm.get('password')?.setValidators([Validators.required, Validators.minLength(6)]);
        this.userForm.get('confirmPassword')?.setValidators([Validators.required]);
        this.userForm.addValidators(this.passwordMatchValidator);
      }
      this.userForm.updateValueAndValidity();
    });
  }

  private passwordMatchValidator = (): { passwordMismatch: boolean } | null => {
    const password = this.userForm?.get('password')?.value;
    const confirmPassword = this.userForm?.get('confirmPassword')?.value;

    if (password && confirmPassword && password !== confirmPassword) {
      return { passwordMismatch: true };
    }
    return null;
  };

  loadUser(id: string): void {
    const user = this.userService.getUserById(id);
    if (user) {
      this.userForm.patchValue({
        username: user.username,
        email: user.email,
        name: user.name,
        role: user.role
      });
    } else {
      this.errorMessage.set('User not found');
      setTimeout(() => this.router.navigate(['/users']), 2000);
    }
  }

  onSubmit(): void {
    if (this.userForm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);
    this.successMessage.set(null);

    const formValue = this.userForm.value;

    if (this.isEditMode()) {
      this.updateUser(formValue);
    } else {
      this.createUser(formValue);
    }
  }

  private createUser(formValue: any): void {
    if (!formValue.password) {
      this.errorMessage.set('Password is required');
      this.isLoading.set(false);
      return;
    }

    if (formValue.password !== formValue.confirmPassword) {
      this.errorMessage.set('Passwords do not match');
      this.isLoading.set(false);
      return;
    }

    this.userService
      .createUser({
        username: formValue.username ?? '',
        email: formValue.email ?? '',
        name: formValue.name ?? '',
        role: formValue.role ?? UserRole.CLIENT,
        password: formValue.password ?? ''
      })
      .subscribe({
        next: () => {
          this.successMessage.set('User created successfully!');
          setTimeout(() => {
            this.router.navigate(['/users']);
          }, 1500);
        },
        error: (error: Error) => {
          this.errorMessage.set(error.message || 'Failed to create user');
          this.isLoading.set(false);
        }
      });
  }

  private updateUser(formValue: any): void {
    const updates: {
      username?: string;
      email?: string;
      name?: string;
      role?: UserRole;
    } = {};

    if (formValue.username) updates.username = formValue.username;
    if (formValue.email) updates.email = formValue.email;
    if (formValue.name) updates.name = formValue.name;
    if (formValue.role) updates.role = formValue.role;

    // Update password if provided
    if (formValue.password) {
      if (formValue.password !== formValue.confirmPassword) {
        this.errorMessage.set('Passwords do not match');
        this.isLoading.set(false);
        return;
      }

      this.userService
        .resetUserPassword(this.userId()!, formValue.password)
        .subscribe({
          error: (error: Error) => {
            this.errorMessage.set(error.message || 'Failed to update password');
            this.isLoading.set(false);
          }
        });
    }

    this.userService.updateUser(this.userId()!, updates).subscribe({
      next: () => {
        this.successMessage.set('User updated successfully!');
        setTimeout(() => {
          this.router.navigate(['/users']);
        }, 1500);
      },
      error: (error: Error) => {
        this.errorMessage.set(error.message || 'Failed to update user');
        this.isLoading.set(false);
      }
    });
  }

  private markFormGroupTouched(): void {
    Object.keys(this.userForm.controls).forEach(key => {
      const control = this.userForm.get(key);
      control?.markAsTouched();
    });
  }

  getRoleIcon(role: UserRole | null | undefined): string {
    if (!role) {
      return 'cilUser';
    }
    const iconMap: Record<UserRole, string> = {
      [UserRole.SUPER_ADMIN]: 'cilUser',
      [UserRole.CONSULTANT]: 'cilBriefcase',
      [UserRole.CLIENT]: 'cilUserFollow'
    };
    return iconMap[role] ?? 'cilUser';
  }

  getCurrentRole(): UserRole | null {
    const roleValue = this.userForm.get('role')?.value;
    return roleValue ?? null;
  }

  getRoleDescription(): string {
    const role = this.getCurrentRole();
    if (!role) {
      return '';
    }
    const roleConfig = this.roles.find(r => r.value === role);
    return roleConfig?.description ?? '';
  }

  getFieldError(fieldName: string): string | null {
    const field = this.userForm.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors['required']) {
        return `${this.getFieldLabel(fieldName)} is required`;
      }
      if (field.errors['email']) {
        return 'Please enter a valid email address';
      }
      if (field.errors['minlength']) {
        const minLength = field.errors['minlength'].requiredLength;
        return `${this.getFieldLabel(fieldName)} must be at least ${minLength} characters`;
      }
      if (field.errors['pattern']) {
        return 'Username can only contain letters, numbers, and underscores';
      }
    }
    return null;
  }

  private getFieldLabel(fieldName: string): string {
    const labels: Record<string, string> = {
      username: 'Username',
      email: 'Email',
      name: 'Name',
      role: 'Role',
      password: 'Password',
      confirmPassword: 'Confirm Password'
    };
    return labels[fieldName] ?? fieldName;
  }

  hasPasswordMismatch(): boolean {
    const password = this.userForm.get('password')?.value;
    const confirmPassword = this.userForm.get('confirmPassword')?.value;
    return (
      !!password &&
      !!confirmPassword &&
      password !== confirmPassword &&
      this.userForm.get('confirmPassword')?.touched === true
    );
  }
}

