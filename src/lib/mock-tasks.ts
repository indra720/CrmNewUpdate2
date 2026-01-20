// In a real application, this data would come from an API
export type Task = {
  id: string;
  title: string;
  description?: string;
  status: 'To Do' | 'In Progress' | 'Done';
  priority: 'low' | 'medium' | 'high';
  assignee: {
    name: string;
    avatar?: string; // URL to an avatar image
  };
  dueDate: Date;
  tags?: string[];
};

export const mockTasks: Task[] = [
  {
    id: 'TASK-001',
    title: 'Finalize Q3 Marketing Strategy',
    status: 'In Progress',
    priority: 'high',
    assignee: { name: 'Jane Smith' },
    dueDate: new Date(new Date().setDate(new Date().getDate() + 3)),
    tags: ['Marketing', 'Strategy'],
  },
  {
    id: 'TASK-002',
    title: 'Design new homepage mockups',
    description: 'Create 3-4 variations of the homepage design for review. Focus on a clean, modern aesthetic and improved user navigation. Use the new brand guidelines.',
    status: 'In Progress',
    priority: 'high',
    assignee: { name: 'John Doe' },
    dueDate: new Date(new Date().setDate(new Date().getDate() + 5)),
    tags: ['UI', 'Design'],
  },
  {
    id: 'TASK-003',
    title: 'Develop API for user authentication',
    status: 'To Do',
    priority: 'high',
    assignee: { name: 'Peter Jones' },
    dueDate: new Date(new Date().setDate(new Date().getDate() + 10)),
    tags: ['Backend', 'Feature'],
  },
  {
    id: 'TASK-004',
    title: 'Fix bug in payment processing',
    description: 'Users are reporting a 500 error when using PayPal. Need to investigate the server logs and resolve the issue.',
    status: 'To Do',
    priority: 'medium',
    assignee: { name: 'Peter Jones' },
    dueDate: new Date(new Date().setDate(new Date().getDate() + 2)),
    tags: ['Bug', 'Backend'],
  },
  {
    id: 'TASK-005',
    title: 'Write documentation for the new API',
    status: 'To Do',
    priority: 'low',
    assignee: { name: 'Jane Smith' },
    dueDate: new Date(new Date().setDate(new Date().getDate() + 14)),
    tags: ['Docs'],
  },
  {
    id: 'TASK-006',
    title: 'Review and approve new ad creatives',
    status: 'Done',
    priority: 'medium',
    assignee: { name: 'Jane Smith' },
    dueDate: new Date(new Date().setDate(new Date().getDate() - 1)),
    tags: ['Marketing', 'Content'],
  },
  {
    id: 'TASK-007',
    title: 'Onboard new marketing intern',
    status: 'Done',
    priority: 'low',
    assignee: { name: 'Jane Smith' },
    dueDate: new Date(new Date().setDate(new Date().getDate() - 4)),
  },
];
