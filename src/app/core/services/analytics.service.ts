import { Injectable, computed, signal } from '@angular/core';
import { ProjectService } from './project.service';
import { UserService } from './user.service';
import { MarketplaceService } from './marketplace.service';
import { UserRole } from '../models/user.model';
import type { Project } from '../models/project.models';

export interface PlatformAnalytics {
  monthlyActiveUsers: number;
  totalProjects: number;
  averageProjectsPerConsultant: number;
  agencyContractors: number;
  independentContractors: number;
  totalContractors: number;
  topMatchedEntities: TopMatchedEntity[];
  marketplaceEngagementRate: number;
  totalUsers: number;
  activeConsultants: number;
  clientGrowthRate: number;
  projectCompletionRate: number;
}

export interface TopMatchedEntity {
  id: string;
  name: string;
  type: 'Agency' | 'Independent';
  matchCount: number;
  engagementRate: number;
}

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  constructor(
    private readonly projectService: ProjectService,
    private readonly userService: UserService,
    private readonly marketplaceService: MarketplaceService
  ) {}

  readonly analytics = computed<PlatformAnalytics>(() => {
    const projects = this.projectService.projects();
    const users = this.userService.users();
    const providers = this.marketplaceService.providers();
    const consultants = this.userService.consultants();

    // Calculate Monthly Active Users (users active in last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const monthlyActiveUsers = users.filter(user => {
      // For demo purposes, consider all users as active
      // In real app, check last login date
      return true;
    }).length;

    // Total Projects
    const totalProjects = projects.length;

    // Average Projects per Consultant
    const consultantsWithProjects = consultants.filter(consultant => 
      projects.some(p => p.consultantId === consultant.id)
    );
    const totalProjectsByConsultants = projects.filter(p => p.consultantId).length;
    const averageProjectsPerConsultant = consultantsWithProjects.length > 0
      ? totalProjectsByConsultants / consultantsWithProjects.length
      : 0;

    // Contractors
    const agencyContractors = providers.filter(p => p.type === 'Agency').length;
    const independentContractors = providers.filter(p => p.type === 'Independent').length;
    const totalContractors = providers.length;

    // Top Matched Entities (providers with most strategic actions assigned)
    const providerMatchCount = new Map<string, number>();
    projects.forEach(project => {
      project.strategicActions?.forEach(action => {
        if (action.assignedResource) {
          const provider = providers.find(p => 
            p.name === action.assignedResource?.fullName ||
            p.email === action.assignedResource?.email
          );
          if (provider) {
            providerMatchCount.set(
              provider.id,
              (providerMatchCount.get(provider.id) ?? 0) + 1
            );
          }
        }
      });
    });

    const topMatchedEntities: TopMatchedEntity[] = Array.from(providerMatchCount.entries())
      .map(([id, count]) => {
        const provider = providers.find(p => p.id === id);
        if (!provider) return null;
        const totalActions = projects.reduce((sum, p) => 
          sum + (p.strategicActions?.length ?? 0), 0
        );
        const engagementRate = totalActions > 0 ? (count / totalActions) * 100 : 0;
        return {
          id: provider.id,
          name: provider.name,
          type: provider.type,
          matchCount: count,
          engagementRate: Math.round(engagementRate * 100) / 100
        };
      })
      .filter((entity): entity is TopMatchedEntity => entity !== null)
      .sort((a, b) => b.matchCount - a.matchCount)
      .slice(0, 10);

    // Marketplace Engagement Rate (projects with assigned resources / total projects)
    const projectsWithResources = projects.filter(p => 
      p.strategicActions?.some(a => a.assignedResource)
    ).length;
    const marketplaceEngagementRate = totalProjects > 0
      ? (projectsWithResources / totalProjects) * 100
      : 0;

    // Additional KPIs
    const totalUsers = users.length;
    const activeConsultants = consultantsWithProjects.length;

    // Client Growth Rate (new clients in last 30 days)
    const clients = this.userService.clients();
    const newClients = clients.length; // Simplified for demo
    const clientGrowthRate = 0; // Would calculate based on historical data

    // Project Completion Rate
    const completedProjects = projects.filter(p => p.status === 'Completed').length;
    const projectCompletionRate = totalProjects > 0
      ? (completedProjects / totalProjects) * 100
      : 0;

    return {
      monthlyActiveUsers,
      totalProjects,
      averageProjectsPerConsultant: Math.round(averageProjectsPerConsultant * 100) / 100,
      agencyContractors,
      independentContractors,
      totalContractors,
      topMatchedEntities,
      marketplaceEngagementRate: Math.round(marketplaceEngagementRate * 100) / 100,
      totalUsers,
      activeConsultants,
      clientGrowthRate,
      projectCompletionRate: Math.round(projectCompletionRate * 100) / 100
    };
  });
}

