import { Injectable, signal, computed } from '@angular/core';
import { Project, ProjectStatus, ConversationType, ProjectStep, StrategicAction, Resource, ConversationTopic, TranscriptData, StrategyData, ReportData } from '../models/project.models';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private readonly projectsSignal = signal<Project[]>(this.getInitialProjects());
  
  readonly projects = this.projectsSignal.asReadonly();
  readonly activeProjects = computed(() => 
    this.projectsSignal().filter(p => p.status !== 'Completed')
  );
  readonly projectsCount = computed(() => this.projectsSignal().length);
  readonly pendingActionsCount = computed(() => 
    this.projectsSignal().reduce((count, p) => {
      return count + (p.strategicActions?.filter(a => a.status === 'Pending').length ?? 0);
    }, 0)
  );

  getProjectById(id: string): Project | undefined {
    return this.projectsSignal().find(p => p.id === id);
  }

  createProject(projectData: Partial<Project>): Project {
    const newProject: Project = {
      id: this.generateId(),
      name: projectData.name ?? '',
      client: projectData.client ?? '',
      status: 'Draft',
      progress: 0,
      conversationType: projectData.conversationType ?? 'gtm',
      createdAt: new Date(),
      updatedAt: new Date(),
      currentStep: 'setup',
      referenceDocs: projectData.referenceDocs,
      strategicActions: []
    };

    this.projectsSignal.update(projects => [...projects, newProject]);
    return newProject;
  }

  updateProject(id: string, updates: Partial<Project>): void {
    this.projectsSignal.update(projects =>
      projects.map(p =>
        p.id === id
          ? { ...p, ...updates, updatedAt: new Date() }
          : p
      )
    );
  }

  updateProjectStep(id: string, step: ProjectStep): void {
    this.updateProject(id, { currentStep: step });
  }

  updateProjectStatus(id: string, status: ProjectStatus): void {
    this.updateProject(id, { status });
  }

  updateProjectProgress(id: string, progress: number): void {
    this.updateProject(id, { progress });
  }

  addStrategicAction(projectId: string, action: Omit<StrategicAction, 'id' | 'createdAt'>): void {
    const newAction: StrategicAction = {
      ...action,
      id: this.generateId(),
      createdAt: new Date()
    };

    const project = this.getProjectById(projectId);
    if (project) {
      const actions = project.strategicActions ?? [];
      this.updateProject(projectId, {
        strategicActions: [...actions, newAction]
      });
    }
  }

  updateStrategicAction(projectId: string, actionId: string, updates: Partial<StrategicAction>): void {
    const project = this.getProjectById(projectId);
    if (project?.strategicActions) {
      const updatedActions = project.strategicActions.map(a =>
        a.id === actionId ? { ...a, ...updates } : a
      );
      this.updateProject(projectId, { strategicActions: updatedActions });
    }
  }

  assignResourceToAction(projectId: string, actionId: string, resource: Resource): void {
    this.updateStrategicAction(projectId, actionId, { assignedResource: resource });
  }

  setTranscript(projectId: string, transcript: TranscriptData): void {
    this.updateProject(projectId, { transcript });
  }

  setStrategy(projectId: string, strategy: StrategyData): void {
    this.updateProject(projectId, { strategy });
  }

  setReport(projectId: string, report: ReportData): void {
    this.updateProject(projectId, { report });
  }

  shareReport(projectId: string, emails: string[], message?: string): void {
    const project = this.getProjectById(projectId);
    if (project?.report) {
      const updatedReport: ReportData = {
        ...project.report,
        sharedWith: emails,
        sharedAt: new Date()
      };
      this.setReport(projectId, updatedReport);
      this.updateProjectStatus(projectId, 'Under Review');
    }
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  private getInitialProjects(): Project[] {
    return [
      {
        id: '1',
        name: 'Go-To-Market Strategy',
        client: 'Acme Corp',
        status: 'In Progress',
        progress: 45,
        conversationType: 'gtm',
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-20'),
        currentStep: 'strategy',
        strategicActions: [
          {
            id: 'a1',
            title: 'Hire Sales Lead',
            description: 'Recruit an experienced sales leader to drive revenue growth',
            status: 'Pending',
            category: 'Recruitment',
            createdAt: new Date('2024-01-18')
          },
          {
            id: 'a2',
            title: 'Develop Marketing Campaign',
            description: 'Create and launch targeted marketing campaigns',
            status: 'In Progress',
            category: 'Marketing',
            createdAt: new Date('2024-01-19')
          }
        ]
      },
      {
        id: '2',
        name: 'Consumer Research',
        client: 'Globex Inc',
        status: 'Action Required',
        progress: 10,
        conversationType: 'consumer',
        createdAt: new Date('2024-01-18'),
        updatedAt: new Date('2024-01-19'),
        currentStep: 'transcript',
        strategicActions: []
      },
      {
        id: '3',
        name: 'Strategy Review',
        client: 'Soylent Corp',
        status: 'Under Review',
        progress: 80,
        conversationType: 'strategy',
        createdAt: new Date('2024-01-10'),
        updatedAt: new Date('2024-01-20'),
        currentStep: 'report',
        report: {
          executiveSummary: 'This comprehensive strategy review identifies key opportunities for growth and operational efficiency. Through detailed analysis of market conditions, competitive landscape, and internal capabilities, we have developed actionable recommendations to drive sustainable business success.',
          recommendations: [
            'Implement a customer relationship management (CRM) system to improve sales tracking and customer engagement',
            'Develop a comprehensive digital marketing strategy to expand market reach',
            'Establish strategic partnerships with key industry players to accelerate growth',
            'Invest in employee training and development programs to enhance operational capabilities'
          ],
          sections: [
            {
              title: 'Market Overview',
              content: 'The current market presents significant opportunities for expansion. Industry trends indicate strong demand for innovative solutions, with particular growth potential in the technology and services sectors. Market analysis reveals a competitive landscape with opportunities for differentiation through superior customer experience and operational excellence.'
            },
            {
              title: 'Target Segments',
              content: 'Primary target segments include mid-market enterprises seeking scalable solutions and small businesses requiring cost-effective alternatives. Secondary opportunities exist in the enterprise segment, where premium services and dedicated support can command higher margins.'
            },
            {
              title: 'Competitive Analysis',
              content: 'Competitive positioning analysis shows clear opportunities to differentiate through superior customer service, innovative product features, and strategic partnerships. Key competitors have strengths in market presence but weaknesses in customer engagement and operational efficiency.'
            },
            {
              title: 'Strategic Recommendations',
              content: 'Based on comprehensive analysis, we recommend focusing on three strategic pillars: (1) Technology infrastructure improvements, (2) Market expansion initiatives, and (3) Operational excellence programs. These initiatives will position the organization for sustainable growth and competitive advantage.'
            }
          ],
          sharedWith: ['client@soylentcorp.com'],
          sharedAt: new Date('2024-01-20')
        },
        strategicActions: [
          {
            id: 'a3',
            title: 'Implement CRM System',
            description: 'Deploy and configure new CRM platform',
            status: 'Pending',
            category: 'Technology',
            createdAt: new Date('2024-01-15'),
            assignedResource: {
              id: 'r1',
              fullName: 'Sarah Jenkins',
              role: 'Technology Consultant',
              company: 'TechSolutions Inc',
              email: 'sarah@techsolutions.com',
              phone: '+1-555-0123'
            }
          }
        ]
      }
    ];
  }
}

