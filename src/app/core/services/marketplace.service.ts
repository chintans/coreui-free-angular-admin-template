import { Injectable, signal } from "@angular/core";
import type { Provider } from "../models/project.models";

@Injectable({
	providedIn: "root",
})
export class MarketplaceService {
	private readonly providersSignal = signal<Provider[]>(
		this.getInitialProviders(),
	);

	readonly providers = this.providersSignal.asReadonly();

	getProvidersByCategory(category: string | null): Provider[] {
		if (!category) {
			return this.providersSignal();
		}
		return this.providersSignal().filter((provider) =>
			provider.categories.some((cat) =>
				cat.toLowerCase().includes(category.toLowerCase()),
			),
		);
	}

	searchProviders(query: string, category?: string | null): Provider[] {
		const lowerQuery = query.toLowerCase();
		let filtered = this.providersSignal();

		if (category) {
			filtered = this.getProvidersByCategory(category);
		}

		return filtered.filter(
			(provider) =>
				provider.name.toLowerCase().includes(lowerQuery) ||
				provider.skills.some((skill) =>
					skill.toLowerCase().includes(lowerQuery),
				) ||
				provider.description?.toLowerCase().includes(lowerQuery) ||
				provider.type.toLowerCase().includes(lowerQuery),
		);
	}

	getProviderById(id: string): Provider | undefined {
		return this.providersSignal().find((p) => p.id === id);
	}

	addProvider(provider: Omit<Provider, "id">): Provider {
		const newProvider: Provider = {
			...provider,
			id: this.generateId(),
		};
		this.providersSignal.update((providers) => [...providers, newProvider]);
		return newProvider;
	}

	private generateId(): string {
		return Date.now().toString(36) + Math.random().toString(36).substr(2);
	}

	private getInitialProviders(): Provider[] {
		return [
			{
				id: "1",
				name: "GrowthHacker Agency",
				type: "Agency",
				rating: 4.8,
				rate: "$150/hr",
				avatar: "1.jpg",
				skills: ["GTM Strategy", "PPC", "Content Marketing"],
				categories: ["Marketing", "Sales", "GTM Strategy"],
				email: "contact@growthhacker.com",
				phone: "+1-555-0101",
				description:
					"Specialized in go-to-market strategies and growth marketing campaigns.",
			},
			{
				id: "2",
				name: "Sarah Jenkins",
				type: "Independent",
				rating: 4.9,
				rate: "$120/hr",
				avatar: "2.jpg",
				skills: ["Content Marketing", "SEO", "Social Media"],
				categories: ["Marketing", "Content Strategy"],
				email: "sarah.jenkins@example.com",
				phone: "+1-555-0102",
				description:
					"Expert content marketer with 10+ years of experience in B2B SaaS.",
			},
			{
				id: "3",
				name: "Enterprise Solutions",
				type: "Agency",
				rating: 4.7,
				rate: "$200/hr",
				avatar: "3.jpg",
				skills: ["Sales Enablement", "CRM", "Sales Training"],
				categories: ["Sales", "Technology", "Operations"],
				email: "info@enterprisesolutions.com",
				phone: "+1-555-0103",
				description:
					"Full-service sales and operations consulting for enterprise clients.",
			},
			{
				id: "4",
				name: "TechRecruit Pro",
				type: "Agency",
				rating: 4.6,
				rate: "$180/hr",
				avatar: "4.jpg",
				skills: ["Technical Recruitment", "Talent Acquisition", "HR Strategy"],
				categories: ["Recruitment", "HR", "Operations"],
				email: "hello@techrecruitpro.com",
				phone: "+1-555-0104",
				description:
					"Specialized in technical talent acquisition for startups and scale-ups.",
			},
			{
				id: "5",
				name: "Michael Chen",
				type: "Independent",
				rating: 4.9,
				rate: "$140/hr",
				avatar: "5.jpg",
				skills: ["Financial Planning", "Budget Analysis", "Fundraising"],
				categories: ["Finance", "Operations"],
				email: "michael.chen@example.com",
				phone: "+1-555-0105",
				description:
					"CFO-level financial consulting for high-growth companies.",
			},
			{
				id: "6",
				name: "Digital Innovation Labs",
				type: "Agency",
				rating: 4.8,
				rate: "$175/hr",
				avatar: "6.jpg",
				skills: [
					"Product Development",
					"UX/UI Design",
					"Technical Architecture",
				],
				categories: ["Technology", "Product Development"],
				email: "contact@digitalinnovation.com",
				phone: "+1-555-0106",
				description:
					"End-to-end product development and technical consulting services.",
			},
			{
				id: "7",
				name: "Emma Rodriguez",
				type: "Independent",
				rating: 5.0,
				rate: "$130/hr",
				avatar: "7.jpg",
				skills: ["Brand Strategy", "Marketing", "GTM Strategy"],
				categories: ["Marketing", "GTM Strategy"],
				email: "emma.rodriguez@example.com",
				phone: "+1-555-0107",
				description:
					"Brand strategist helping companies establish market presence.",
			},
			{
				id: "8",
				name: "Operations Excellence Group",
				type: "Agency",
				rating: 4.7,
				rate: "$160/hr",
				avatar: "8.jpg",
				skills: ["Process Optimization", "Supply Chain", "Operations"],
				categories: ["Operations", "Technology"],
				email: "info@opsexcellence.com",
				phone: "+1-555-0108",
				description:
					"Operations consulting focused on scaling and efficiency improvements.",
			},
		];
	}
}
