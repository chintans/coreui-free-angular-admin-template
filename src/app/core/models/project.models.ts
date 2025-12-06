export interface Project {
	id: string;
	name: string;
	client: string;
	consultantId?: string;
	status: ProjectStatus;
	progress: number;
	conversationType: ConversationType;
	createdAt: Date;
	updatedAt: Date;
	referenceDocs?: File[];
	currentStep: ProjectStep;
	transcript?: TranscriptData;
	strategy?: StrategyData;
	report?: ReportData;
	strategicActions?: StrategicAction[];
}

export type ProjectStatus =
	| "In Progress"
	| "Action Required"
	| "Under Review"
	| "Completed"
	| "Draft";

export type ConversationType = "gtm" | "consumer" | "strategy" | "custom";

export type ProjectStep =
	| "setup"
	| "design"
	| "recording"
	| "transcript"
	| "research"
	| "strategy"
	| "report";

export interface TranscriptData {
	content: string;
	duration: number;
	tags: TranscriptTag[];
	insights?: string[];
}

export interface TranscriptTag {
	type: "Pain Point" | "Opportunity" | "Insight";
	text: string;
	timestamp: number;
}

export interface StrategyData {
	sections: StrategySection[];
	model: AIModel;
	researchScope: string[];
}

export interface StrategySection {
	id: string;
	title: string;
	content: string;
	status: "Drafted" | "Auto-filled" | "Pending";
}

export type AIModel = "gemini" | "gpt4" | "deepsea";

export interface ReportData {
	executiveSummary: string;
	recommendations: string[];
	sections: ReportSection[];
	sharedWith?: string[];
	sharedAt?: Date;
}

export interface ReportSection {
	title: string;
	content: string;
}

export interface StrategicAction {
	id: string;
	title: string;
	description: string;
	status: "Pending" | "In Progress" | "Completed";
	category: string;
	assignedResource?: Resource;
	createdAt: Date;
}

export interface Resource {
	id: string;
	fullName: string;
	role: string;
	company?: string;
	email: string;
	phone?: string;
}

export interface ConversationTopic {
	id: string;
	title: string;
	icon: string;
	description?: string;
}

export interface ConversationDesign {
	topics: ConversationTopic[];
	suggestedQuestions?: string[];
}

export interface Provider {
	id: string;
	name: string;
	type: "Agency" | "Independent";
	rating: number;
	rate: string;
	avatar?: string;
	skills: string[];
	categories: string[];
	email?: string;
	phone?: string;
	description?: string;
}
