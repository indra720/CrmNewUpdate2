# **App Name**: NexusCRM

## Core Features:

- SuperAdmin Dashboard: Centralized control panel for managing users, roles, and system-wide settings.
- User Management (CRUD): Create, read, update, and delete admin/team leader/staff user accounts with role selection and permission management, stored in Firestore.
- Lead Scoring: Use AI to automatically score leads based on engagement, demographics, and other factors to prioritize sales efforts.
- Performance Reports: Generate and export detailed reports on team performance, lead conversion rates, and revenue, with filtering by date ranges.
- Role-Based Dashboards: Tailored dashboards for admins, team leaders, and staff, providing role-specific information and tools.
- Customer Timeline: A chronological view of all interactions and activities related to a customer, including communications, tasks, and updates, leveraging Firestore for data storage.
- File Import via Firebase Storage: Tool that enables bulk importing of customer data into the system, uploading files via Firebase Storage, using LLM analysis of file structure to incorporate the data when possible.

## Style Guidelines:

- Primary color: Royal Blue (#2563EB) for a professional and trustworthy feel.
- Background color: Light Gray (#F9FAFB), very slightly tinted with the primary color (Royal Blue), for a clean and modern look.
- Accent color: Neutral Gray (#6B7280) to provide contrast and highlight key elements without overpowering the design.
- Font: 'Inter', a sans-serif font, is recommended for both body and headlines to give a modern and neutral UI. Note: currently only Google Fonts are supported.
- Use rounded corners (rounded-2xl) and soft shadows (shadow-lg) to create a visually appealing and user-friendly interface.
- Employ a modern icon set such as Lucide React or Heroicons for a consistent and professional look.
- Subtle hover animations (transition-all duration-300 ease-in-out) on interactive elements to enhance user engagement.