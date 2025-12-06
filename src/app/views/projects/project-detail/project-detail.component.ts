import { Component, inject, signal, computed } from '@angular/core';
import type { OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  CardComponent,
  CardBodyComponent,
  CardHeaderComponent,
  ButtonDirective,
  BadgeComponent,
  ProgressComponent,
  RowComponent,
  ColComponent,
  ModalComponent,
  ModalHeaderComponent,
  ModalBodyComponent,
  ModalFooterComponent,
  ModalModule,
  ButtonCloseDirective,
  FormModule,
  ListGroupDirective,
  ListGroupItemDirective,
  AlertComponent,
  AlertModule
} from '@coreui/angular';
import { IconDirective } from '@coreui/icons-angular';
import { ProjectService } from '../../../core/services/project.service';
import { UserService } from '../../../core/services/user.service';
import { AuthService } from '../../../core/services/auth.service';
import type { Project, StrategicAction, Resource } from '../../../core/models/project.models';
import { UserRole } from '../../../core/models/user.model';

@Component({
  selector: 'app-project-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ReactiveFormsModule,
    CardComponent,
    CardBodyComponent,
    CardHeaderComponent,
    ButtonDirective,
    BadgeComponent,
    ProgressComponent,
    RowComponent,
    ColComponent,
    ModalComponent,
    ModalHeaderComponent,
    ModalBodyComponent,
    ModalFooterComponent,
    ModalModule,
    ButtonCloseDirective,
    FormModule,
    ListGroupDirective,
    ListGroupItemDirective,
    IconDirective,
    AlertComponent,
    AlertModule
  ],
  templateUrl: './project-detail.component.html',
  styleUrls: ['./project-detail.component.scss']
})
export class ProjectDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly projectService = inject(ProjectService);
  private readonly userService = inject(UserService);
  private readonly authService = inject(AuthService);
  private readonly fb = inject(FormBuilder);

  projectId = signal<string>('');
  project = signal<Project | undefined>(undefined);
  showChatModal = signal(false);
  showActionModal = signal(false);
  showResourceModal = signal(false);
  showContractorModal = signal(false);
  selectedActionId = signal<string | null>(null);
  selectedContractorId = signal<string | null>(null);
  
  readonly contractors = this.userService.contractors;
  readonly userRole = this.authService.userRole;
  readonly isConsultantOrAdmin = computed(() => {
    const role = this.userRole();
    return role === UserRole.CONSULTANT || role === UserRole.SUPER_ADMIN;
  });

  actionForm = this.fb.group({
    title: ['', Validators.required],
    description: ['', Validators.required],
    category: ['', Validators.required]
  });

  resourceForm = this.fb.group({
    fullName: ['', Validators.required],
    role: ['', Validators.required],
    company: [''],
    email: ['', [Validators.required, Validators.email]],
    phone: ['']
  });

  chatMessages = signal<Array<{ role: 'user' | 'assistant'; content: string }>>([]);
  chatInput = signal('');

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = params['id'];
      this.projectId.set(id);
      const project = this.projectService.getProjectById(id);
      this.project.set(project);
      
      if (!project) {
        this.router.navigate(['/projects']);
      }
    });
  }

  getStatusColor(status: Project['status']): string {
    const colorMap: Record<Project['status'], string> = {
      'In Progress': 'info',
      'Action Required': 'warning',
      'Under Review': 'success',
      'Completed': 'secondary',
      'Draft': 'secondary'
    };
    return colorMap[status] ?? 'secondary';
  }

  getActionStatusColor(status: StrategicAction['status']): string {
    const colorMap: Record<StrategicAction['status'], string> = {
      'Pending': 'warning',
      'In Progress': 'info',
      'Completed': 'success'
    };
    return colorMap[status] ?? 'secondary';
  }

  openActionModal(actionId?: string): void {
    this.selectedActionId.set(actionId ?? null);
    if (actionId) {
      const action = this.project()?.strategicActions?.find(a => a.id === actionId);
      if (action) {
        this.actionForm.patchValue({
          title: action.title,
          description: action.description,
          category: action.category
        });
      }
    } else {
      this.actionForm.reset();
    }
    this.showActionModal.set(true);
  }

  closeActionModal(): void {
    this.showActionModal.set(false);
    this.actionForm.reset();
    this.selectedActionId.set(null);
  }

  saveAction(): void {
    if (this.actionForm.valid && this.projectId()) {
      const actionData = {
        title: this.actionForm.value.title ?? '',
        description: this.actionForm.value.description ?? '',
        category: this.actionForm.value.category ?? '',
        status: 'Pending' as const
      };

      const actionId = this.selectedActionId();
      if (actionId) {
        this.projectService.updateStrategicAction(
          this.projectId(),
          actionId,
          actionData
        );
      } else {
        this.projectService.addStrategicAction(this.projectId(), actionData);
      }

      this.updateProject();
      this.closeActionModal();
    }
  }

  openResourceModal(actionId: string): void {
    this.selectedActionId.set(actionId);
    this.resourceForm.reset();
    this.showResourceModal.set(true);
  }

  closeResourceModal(): void {
    this.showResourceModal.set(false);
    this.resourceForm.reset();
    this.selectedActionId.set(null);
  }

  assignResource(): void {
    const actionId = this.selectedActionId();
    if (this.resourceForm.valid && this.projectId() && actionId) {
      const resource: Resource = {
        id: Date.now().toString(),
        fullName: this.resourceForm.value.fullName ?? '',
        role: this.resourceForm.value.role ?? '',
        company: this.resourceForm.value.company ?? undefined,
        email: this.resourceForm.value.email ?? '',
        phone: this.resourceForm.value.phone ?? undefined
      };

      this.projectService.assignResourceToAction(
        this.projectId(),
        actionId,
        resource
      );

      this.updateProject();
      this.closeResourceModal();
    }
  }

  toggleChat(): void {
    this.showChatModal.update(val => !val);
  }

  sendChatMessage(): void {
    const message = this.chatInput();
    if (message.trim()) {
      this.chatMessages.update(msgs => [...msgs, { role: 'user', content: message }]);
      this.chatInput.set('');

      // Simulate AI response
      setTimeout(() => {
        this.chatMessages.update(msgs => [
          ...msgs,
          {
            role: 'assistant',
            content: 'This is a simulated AI response. In production, this would call the Gemini API to provide context-aware answers about the project.'
          }
        ]);
      }, 1000);
    }
  }

  navigateToStep(step: string): void {
    if (this.projectId()) {
      this.router.navigate(['/projects', this.projectId(), step]);
    }
  }

  viewMarketplace(actionId: string, category: string): void {
    if (this.projectId()) {
      this.router.navigate(['/marketplace'], {
        queryParams: {
          category,
          actionId,
          projectId: this.projectId()
        }
      });
    }
  }

  openContractorModal(actionId?: string): void {
    this.selectedActionId.set(actionId ?? null);
    this.selectedContractorId.set(null);
    this.showContractorModal.set(true);
  }

  closeContractorModal(): void {
    this.showContractorModal.set(false);
    this.selectedActionId.set(null);
    this.selectedContractorId.set(null);
  }

  assignContractorToProject(): void {
    const contractorId = this.selectedContractorId();
    if (contractorId && this.projectId()) {
      this.projectService.assignContractorToProject(this.projectId(), contractorId);
      this.updateProject();
      this.closeContractorModal();
    }
  }

  assignContractorToAction(): void {
    const contractorId = this.selectedContractorId();
    const actionId = this.selectedActionId();
    if (contractorId && actionId && this.projectId()) {
      this.projectService.assignContractorToAction(this.projectId(), actionId, contractorId);
      this.updateProject();
      this.closeContractorModal();
    }
  }

  removeContractorFromProject(contractorId: string): void {
    if (this.projectId()) {
      this.projectService.removeContractorFromProject(this.projectId(), contractorId);
      this.updateProject();
    }
  }

  removeContractorFromAction(actionId: string): void {
    if (this.projectId()) {
      this.projectService.removeContractorFromAction(this.projectId(), actionId);
      this.updateProject();
    }
  }

  getContractorName(contractorId: string): string {
    const contractor = this.userService.getUserById(contractorId);
    return contractor?.name || 'Unknown';
  }

  getAssignedContractors(): string[] {
    return this.project()?.contractorIds || [];
  }

  getActionContractor(action: StrategicAction): string | undefined {
    return action.contractorId;
  }

  private updateProject(): void {
    const project = this.projectService.getProjectById(this.projectId());
    this.project.set(project);
  }
}
