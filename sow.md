# Product Requirements Document (PRD) - ScaleX

## 1. Introduction

Product Name: ScaleX (formerly StratformX)

Purpose: ScaleX is an AI-powered platform designed to streamline the workflow of business consultants
and growth service providers. It bridges the gap between strategic analysis and execution by combining
conversation intelligence, AI-driven research, strategy generation, and a curated marketplace of service
providers.

Target Audience:
Primary: Business Consultants, Strategy Advisors.
Secondary: Business Owners (Clients), Service Providers (Agencies, Freelancers).
Core Value Proposition: "From Conversation to Execution." ScaleX automates the tedious parts of
consulting (transcription, research, drafting) and provides a direct path to implementation via an
integrated marketplace.

## 2. User Roles

```
Consultant (Admin/User): Manages projects, conducts interviews, generates strategies, and
connects with providers.
Client (Viewer): Views project progress, approves reports, and tracks milestones via a dedicated
portal.
Service Provider (Marketplace Entity): (Implied) Profiles listed in the marketplace for execution
tasks.
```
## 3. Functional Requirements & Key Modules

3.1 Authentication & User Management
Login Screen:
Requirements: Email and Password authentication.
UI Elements: Clean card layout, "Welcome to ScaleX" branding, "Sign In" button, "Forgot
Password" link.
State: Default entry point if not authenticated.
Logout:
Requirements: Securely end session and redirect to Login.
Location: Side navigation bottom area.


3.2 Dashboard (Consultant View)
Overview: Central hub showing active projects and key metrics.
Features:
Stats: (Implied from earlier mockups) Active projects count, pending actions.
Project Cards:
Display Project Name, Client Name, Status Badge (e.g., "Action Required", "Under Review",
"In Progress"), and Progress Bar.
"View Details" button for deep navigation.
Quick Actions:
"New Project" button (Primary Action).
Navigation:
Collapsible Side Panel: Dashboard, Marketplace, Account, Settings.

3.3 Project Lifecycle Workflow

Step 1: New Project Setup
Input Fields:
Project Name: Text field.
Client/Company: Dropdown selection.
Reference Docs: Upload area (drag & drop support) for PDFs/DOCX context.
Conversation Type: Radio button selection (Go-To-Market, Consumer Research, Strategy Review,
Custom) with visual indicators.
Action: "Next -> Design Conversation" button.

Step 2: Conversation Designer
Purpose: Plan the client interview structure.
Features:
Search: Search bar for topics.
Topic List: Drag-and-drop list of discussion points (e.g., Market Overview, Value Prop) with
icons.
AI Suggestion: Context-aware card suggesting questions (e.g., "Would you like to include
competitive positioning?").
"Generate New" button calls AI (Gemini) for dynamic suggestions.
Action: "Start Recording" button.

Step 3: Recording & Transcription


```
Purpose: Capture live discussion and tag key moments.
Features:
Live Timer: Shows recording duration.
Real-time Transcript: Displays dialogue between Consultant and Client.
Tagging: Quick-action pills for "Pain Point", "Opportunity", "Insight".
Controls: Large Orange Pause/Play button; "Stop & Transcribe" button.
```
Step 4: Transcript Review & Insight Extraction
Purpose: Analyze text for strategic value.
Features:
Transcript View: Read-only/Editable view of the conversation.
AI Analysis: "Analyze with AI" button triggers Gemini to summarize top pain points into an
Insight Card.
Action: "Generate Research Prompt" button.

Step 5: Deep Research & Model Selection
Purpose: Configure AI parameters for strategy generation.
Features:
Model Selector: Toggle cards for AI models (Gemini 1.5 Pro, GPT-4o, DeepSea) with
descriptions of their strengths (Reasoning, Creative, Citations).
Research Scope Preview: Read-only summary of what will be researched (Target Market,
Competitors).
Action: "Execute Research & Build Strategy" button (Simulated delay).

Step 6: Strategy Builder
Purpose: Review and finalize the AI-drafted strategy.
Features:
Section List: Cards showing report sections (Market Overview, Target Segments) with status
indicators like "[Drafted]" or "[Auto-filled]".
Actions: "Regenerate Section" (Placeholder), "Save & Continue".

Step 7: Report Review & Editor
Purpose: Finalize the deliverable.
Features:
View Mode: Read-only clean layout of Executive Summary and Recommendations.


```
Edit Mode: Toggle "Edit Report" to convert text blocks into editable text areas for manual
refinement.
Share: "Share for Review" button opens a modal to invite reviewers via email and add a
message.
Status Update: Sharing triggers project status change to "Under Review".
Export: "Download PDF" button.
```
3.4 Project Detail View (Central Hub)
Header: Project Status Badge, Progress Bar, "Ask Project AI" button, "Client Portal" link.
Strategic Actions List:
List of AI-recommended tasks (e.g., "Hire Sales Lead").
Status badges (Pending, In Progress).
"View Resource" button links to the Marketplace.
"Add Strategic Action" button: Allows manual addition of new tasks.
Project Artifacts: Quick links to "Strategy Report", "View Recording", "Full Transcript".
AI Chat Assistant:
Slide-out or modal chat interface.
Context-aware Q&A using Gemini (e.g., "Summarize risks").

3.5 Actionable Marketplace
Purpose: Connect strategy to execution.
Smart Matching: Shows providers specifically filtered by the selected recommendation category
(e.g., Recruitment).
Provider Cards: Display Name, Type (Agency/Independent), Rating, Rate, and "Connect" button.
Manual Resource Entry:
"Add my own resource" button opens a form.
Form Fields: Full Name, Role/Title, Company/Agency Name, Phone, Email.
Saves the resource to the action item with an "Assigned" badge.

3.6 Client Progress Portal
Purpose: External-facing view for clients.
Navigation: Tabbed interface (Progress, Report, Action Plan, Resources).
Views:
Progress: Visual timeline of the engagement.
Report: Read-only preview of the strategy document.


```
Action Plan: List of strategic recommendations and their status.
Resources: Contact cards of assigned experts.
```
## 4. User Interface (UI) & Design System

```
Color Palette:
Primary: Deep Blue (#1e40af) for primary buttons and headers.
Secondary: Teal (text-teal-600, bg-teal-50) for branding elements and success states.
Accent: Orange (bg-orange-500) for recording controls and alerts.
Backgrounds: Slate/Gray (bg-slate-50) for application background.
Typography: Sans-serif (Inter/Lato implied), clean hierarchy.
Layout:
Sidebar: Collapsible (width transition w-64 to w-20), Dark Slate (bg-slate-900).
Cards: White background, rounded corners (rounded-xl), subtle borders (border-slate-
200 ), shadow-sm.
Interactions:
Hover effects on cards and buttons.
Smooth transitions for sidebar collapse and page navigation.
Loading states (spinners) for AI actions.
```
## 5. Technical Requirements (For Developer Reference)

```
Frontend Framework: React.js.
Styling: Tailwind CSS (extensive use of utility classes for layout and typography).
Icons: Lucide-React library.
State Management: React useState for local state (form inputs, active tabs, navigation).
AI Integration:
Provider: Google Gemini API (generativelanguage.googleapis.com).
Endpoints: generateContent.
Logic: Async calls for chat responses, suggestion generation, and transcript analysis.
Mock Data: Static JSON arrays (PROJECTS, PROVIDERS, MOCK_TRANSCRIPT_DATA) used to
simulate database records.
```
## 6. Future Considerations (Out of Scope for MVP)

```
Real backend database integration (Firebase/Supabase).
Live audio recording and real-time speech-to-text API integration.
```

PDF generation engine for report export.
Email integrationfor "Share"functionality


