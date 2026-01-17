
interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatarUrl?: string;
}

export const mockProjects = [
  { 
    id: 1, 
    name: 'Corporate Website Redesign', 
    slug: 'corporate-website-redesign',
    progress: 75, 
    status: 'active',
    description: 'A complete overhaul of the main corporate website to improve user experience and modernize the design.',
    startDate: '2025-01-15',
    endDate: '2025-06-30',
    budget: 50000,
    client: 'Global Tech Inc.'
  },
  { 
    id: 2, 
    name: 'Mobile App Launch', 
    slug: 'mobile-app-launch',
    progress: 100, 
    status: 'completed',
    description: 'Launch of the new iOS and Android mobile application for our core services.',
    startDate: '2024-09-01',
    endDate: '2025-01-31',
    budget: 75000,
    client: 'Innovate Solutions'
  },
  { 
    id: 3, 
    name: 'Q3 Marketing Campaign', 
    slug: 'q3-marketing-campaign',
    progress: 40, 
    status: 'active',
    description: 'A multi-channel marketing campaign to boost brand awareness and lead generation for the third quarter.',
    startDate: '2025-07-01',
    endDate: '2025-09-30',
    budget: 25000,
    client: 'Self-initiated'
  },
  { 
    id: 4, 
    name: 'API Integration Project', 
    slug: 'api-integration-project',
    progress: 90, 
    status: 'active',
    description: 'Integrating third-party APIs to extend the functionality of our platform.',
    startDate: '2025-02-01',
    endDate: '2025-05-31',
    budget: 35000,
    client: 'Connective Corp.'
  },
  { 
    id: 5, 
    name: 'Data Analytics Dashboard', 
    slug: 'data-analytics-dashboard',
    progress: 20, 
    status: 'planned',
    description: 'Development of an internal dashboard for visualizing key business metrics and data analytics.',
    startDate: '2025-08-15',
    endDate: '2025-12-31',
    budget: 42000,
    client: 'Internal'
  },
];

export const mockTasks = [
  { id: 1, title: 'Design new homepage mockups', status: 'in_progress', priority: 'high' },
  { id: 2, title: 'Develop user authentication', status: 'done', priority: 'high' },
  { id: 3, title: 'Set up staging server', status: 'in_progress', priority: 'medium' },
  { id: 4, title: 'Write API documentation', status: 'todo', priority: 'low' },
  { id: 5, title: 'Test payment gateway', status: 'in_progress', priority: 'high' },
  { id: 6, title: 'Finalize logo design', status: 'done', priority: 'medium' },
];

export const mockProjectMembers = [
  { id: '1', projectId: 1, name: 'Alice', email: 'alice@company.com', role: 'Developer' },
  { id: '2', projectId: 1, name: 'Bob', email: 'bob@company.com', role: 'Designer' },
  { id: '3', projectId: 2, name: 'Charlie', email: 'charlie@company.com', role: 'Lead' },
  { id: '4', projectId: 3, name: 'David', email: 'david@company.com', role: 'Developer' },
  { id: '5', projectId: 3, name: 'Eve', email: 'eve@company.com', role: 'QA' },
  { id: '6', projectId: 4, name: 'Frank', email: 'frank@company.com', role: 'Developer' },
  { id: '7', projectId: 4, name: 'Alice', email: 'alice@company.com', role: 'Developer' },
];


export const mockUsers: User[] = [
  {
    id: '1',
    email: 'sarah.chen@company.com',
    firstName: 'Sarah',
    lastName: 'Chen',
    avatarUrl: undefined,
  },
  {
    id: '2',
    email: 'marcus.johnson@company.com',
    firstName: 'Marcus',
    lastName: 'Johnson',
    avatarUrl: undefined,
  },
  {
    id: '3',
    email: 'elena.rodriguez@company.com',
    firstName: 'Elena',
    lastName: 'Rodriguez',
    avatarUrl: undefined,
  },
  {
    id: '4',
    email: 'david.kim@company.com',
    firstName: 'David',
    lastName: 'Kim',
    avatarUrl: undefined,
  },
];