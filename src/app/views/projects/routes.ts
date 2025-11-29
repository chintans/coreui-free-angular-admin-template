import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./project-list/project-list.component').then(m => m.ProjectListComponent),
        data: {
            title: 'Projects'
        }
    },
    {
        path: 'new',
        loadComponent: () => import('./new-project/new-project.component').then(m => m.NewProjectComponent),
        data: {
            title: 'New Project'
        }
    },
    {
        path: ':id',
        loadComponent: () => import('./project-detail/project-detail.component').then(m => m.ProjectDetailComponent),
        data: {
            title: 'Project Details'
        }
    },
    {
        path: ':id/design',
        loadComponent: () => import('./conversation-designer/conversation-designer.component').then(m => m.ConversationDesignerComponent),
        data: {
            title: 'Conversation Designer'
        }
    },
    {
        path: ':id/recording',
        loadComponent: () => import('./recording/recording.component').then(m => m.RecordingComponent),
        data: {
            title: 'Recording'
        }
    },
    {
        path: ':id/transcript',
        loadComponent: () => import('./transcript-review/transcript-review.component').then(m => m.TranscriptReviewComponent),
        data: {
            title: 'Transcript Review'
        }
    },
    {
        path: ':id/research',
        loadComponent: () => import('./deep-research/deep-research.component').then(m => m.DeepResearchComponent),
        data: {
            title: 'Deep Research'
        }
    },
    {
        path: ':id/strategy',
        loadComponent: () => import('./strategy-builder/strategy-builder.component').then(m => m.StrategyBuilderComponent),
        data: {
            title: 'Strategy Builder'
        }
    },
    {
        path: ':id/report',
        loadComponent: () => import('./report-review/report-review.component').then(m => m.ReportReviewComponent),
        data: {
            title: 'Report Review'
        }
    }
];
