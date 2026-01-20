export type TaskStatus = 'Completed' | 'In Progress' | 'To Do';

export interface Task {
  id: string;
  name: string;
  status: TaskStatus;
  project: string; // Project Name or ID
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Team Lead' | 'Developer' | 'Designer' | 'QA' | 'Intern';
  projects: string[];
  tasks: Task[];
  avatar?: string;
  lastActivity?: Date;
  skills?: string[];
  bio?: string;
}

const allTasks: Task[] = [
  // Tasks for Alice Johnson
  { id: 'TASK-01', name: 'Design login flow', status: 'Completed', project: 'PROJ-001' },
  { id: 'TASK-02', name: 'Develop settings page', status: 'In Progress', project: 'PROJ-001' },
  { id: 'TASK-03', name: 'Review PR #123', status: 'To Do', project: 'PROJ-001' },
  { id: 'TASK-04', name: 'Plan Q3 roadmap', status: 'In Progress', project: 'PROJ-003' },
  { id: 'TASK-05', name: 'Fix payment gateway bug', status: 'Completed', project: 'PROJ-003' },
  
  // Tasks for Bob Smith
  { id: 'TASK-06', name: 'Implement new navbar', status: 'Completed', project: 'PROJ-001' },
  { id: 'TASK-07', name: 'Refactor API authentication', status: 'Completed', project: 'PROJ-001' },
  { id: 'TASK-08', name: 'Set up staging environment', status: 'In Progress', project: 'PROJ-002' },
  { id: 'TASK-09', name: 'Write unit tests for user model', status: 'To Do', project: 'PROJ-002' },
  { id: 'TASK-10', name: 'Optimize database queries', status: 'In Progress', project: 'PROJ-001' },
  { id: 'TASK-11', name: 'Update documentation', status: 'To Do', project: 'PROJ-002' },
  { id: 'TASK-12', name: 'Research new charting library', status: 'To Do', project: 'PROJ-001' },
  { id: 'TASK-13', name: 'Deploy to production', status: 'Completed', project: 'PROJ-002' },

  // Tasks for Charlie Brown
  { id: 'TASK-14', name: 'Create new logo concepts', status: 'In Progress', project: 'PROJ-001' },
  { id: 'TASK-15', name: 'Design onboarding email templates', status: 'Completed', project: 'PROJ-001' },
  { id: 'TASK-16', name: 'Update style guide', status: 'To Do', project: 'PROJ-001' },

  // Tasks for Diana Prince
  { id: 'TASK-17', name: 'Test user registration flow', status: 'Completed', project: 'PROJ-002' },
  { id: 'TASK-18', name: 'Create test plan for PROJ-003', status: 'In Progress', project: 'PROJ-003' },
  { id: 'TASK-19', name: 'Automate regression tests', status: 'To Do', project: 'PROJ-002' },
  { id: 'TASK-20', name: 'Verify bug fixes in staging', status: 'Completed', project: 'PROJ-003' },
  { id: 'TASK-21', name: 'Perform load testing', status: 'To Do', project: 'PROJ-002' },
  { id: 'TASK-22', name: 'Manual testing for mobile responsive', status: 'In Progress', project: 'PROJ-003' },
];

export const mockTeamMembers: TeamMember[] = [
  {
    id: 'MEMBER-001',
    name: 'Alice Johnson',
    email: 'alice.j@example.com',
    role: 'Team Lead',
    projects: ['PROJ-001', 'PROJ-003'],
    tasks: allTasks.filter(t => ['TASK-01', 'TASK-02', 'TASK-03', 'TASK-04', 'TASK-05'].includes(t.id)),
    avatar: 'https://avatar.vercel.sh/alice.png',
    lastActivity: new Date(new Date().setHours(new Date().getHours() - 2)),
    skills: ['Leadership', 'React', 'Node.js'],
    bio: 'Experienced team lead with a passion for building scalable web applications.'
  },
  {
    id: 'MEMBER-002',
    name: 'Bob Smith',
    email: 'bob.s@example.com',
    role: 'Developer',
    projects: ['PROJ-001', 'PROJ-002'],
    tasks: allTasks.filter(t => ['TASK-06', 'TASK-07', 'TASK-08', 'TASK-09', 'TASK-10', 'TASK-11', 'TASK-12', 'TASK-13'].includes(t.id)),
    avatar: 'https://avatar.vercel.sh/bob.png',
    lastActivity: new Date(new Date().setMinutes(new Date().getMinutes() - 30)),
    skills: ['React', 'TypeScript', 'AWS'],
    bio: 'Frontend developer specializing in user-friendly interfaces.'
  },
  {
    id: 'MEMBER-003',
    name: 'Charlie Brown',
    email: 'charlie.b@example.com',
    role: 'Designer',
    projects: ['PROJ-001'],
    tasks: allTasks.filter(t => ['TASK-14', 'TASK-15', 'TASK-16'].includes(t.id)),
    avatar: 'https://avatar.vercel.sh/charlie.png',
    lastActivity: new Date(new Date().setDate(new Date().getDate() - 1)),
    skills: ['UI/UX', 'Figma', 'Sketch'],
    bio: 'Creative designer focused on intuitive user experiences.'
  },
  {
    id: 'MEMBER-004',
    name: 'Diana Prince',
    email: 'diana.p@example.com',
    role: 'QA',
    projects: ['PROJ-002', 'PROJ-003'],
    tasks: allTasks.filter(t => ['TASK-17', 'TASK-18', 'TASK-19', 'TASK-20', 'TASK-21', 'TASK-22'].includes(t.id)),
    avatar: 'https://avatar.vercel.sh/diana.png',
    lastActivity: new Date(new Date().setHours(new Date().getHours() - 5)),
    skills: ['Testing', 'Jira', 'Automation'],
    bio: 'Quality Assurance specialist ensuring high-quality software.'
  },
  {
    id: 'MEMBER-005',
    name: 'Eve Adams',
    email: 'eve.a@example.com',
    role: 'Developer',
    projects: ['PROJ-002'],
    tasks: [],
    avatar: 'https://avatar.vercel.sh/eve.png',
    lastActivity: new Date(new Date().setHours(new Date().getHours() - 1)),
    skills: ['Backend', 'Python', 'Databases'],
    bio: 'Backend developer with expertise in scalable APIs.'
  },
  {
    id: 'MEMBER-006',
    name: 'Frank White',
    email: 'frank.w@example.com',
    role: 'Intern',
    projects: ['PROJ-003'],
    tasks: [],
    avatar: 'https://avatar.vercel.sh/frank.png',
    lastActivity: new Date(new Date().setMinutes(new Date().getMinutes() - 15)),
    skills: ['Learning', 'HTML', 'CSS'],
    bio: 'Eager intern learning the ropes of web development.'
  },
];
