import type { Routes } from "@angular/router";
import { roleGuard } from "../../core/guards/role.guard";
import { UserRole } from "../../core/models/user.model";

export const routes: Routes = [
	{
		path: "",
		loadComponent: () =>
			import("./marketplace.component").then((m) => m.MarketplaceComponent),
		data: {
			title: "Marketplace",
		},
	},
	// IMPORTANT: More specific routes must come BEFORE parameterized routes
	{
		path: "contractors/new",
		loadComponent: () =>
			import("./contractor-form/contractor-form.component").then((m) => m.ContractorFormComponent),
		canActivate: [roleGuard],
		data: {
			title: "Add Contractor",
			roles: [UserRole.SUPER_ADMIN],
		},
	},
	{
		path: "contractors/:id/edit",
		loadComponent: () =>
			import("./contractor-form/contractor-form.component").then((m) => m.ContractorFormComponent),
		canActivate: [roleGuard],
		data: {
			title: "Edit Contractor",
			roles: [UserRole.SUPER_ADMIN],
		},
	},
	{
		path: "contractors/:id",
		loadComponent: () =>
			import("./contractor-detail/contractor-detail.component").then((m) => m.ContractorDetailComponent),
		data: {
			title: "Contractor Details",
		},
	},
];
