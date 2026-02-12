export type ProjectStatus = 'active' | 'planned' | 'completed' | 'on-hold';

export interface ProjectMember {
  name: any;
  label: ReactNode;
  value: Key;
  id: string; // ProjectMember ID (UUID)
  user_name: string;
  project_name: string;
  role: string;
  user: number; // Numeric user ID for the backend API
}

export interface Project {
  members: ProjectMember[];
  team: boolean;
  id: string; // Changed from number to string (UUID)
  name: string;
  slug: string;
  progress: number;
  status: ProjectStatus;
  description: string;
  startDate: string;
  endDate: string;
  budget: number;
  client: string;
  // Add other properties from the API response if necessary and used elsewhere
}

export type SprintStatus = 'Draft' | 'Planned' | 'Active' | 'Frozen' | 'Completed' | 'Archived';
export type SprintType = 'development' | 'bugfix' | 'release';

export interface SprintTask {
  id: string;
  title: string;
  type: 'Bug' | 'Feature' | 'Improvement';
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  status: 'Todo' | 'In Progress' | 'Review' | 'Done';
  assigneeId?: string;
  storyPoints: number;
  blocked?: boolean;
}



export interface Milestone {
  id: string;
  criteria: Array<{
    id: string;
    title: string;
    is_completed: boolean;
  }>;
  project_name: string;
  sprint_name: string;
  is_deleted: boolean;
  deleted_at: string | null;
  title: string;
  code: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  due_date: string;
  status: 'not_started' | 'in_progress' | 'blocked' | 'completed';
  created_at: string;
  updated_at: string;
  deleted_by: number | null;
  project: string; // Project UUID
  sprint: string; // Sprint UUID
  owner: number; // User ID
  created_by: number; // User ID
}

export interface User {
  is_team_leader: boolean;
  is_it_staff: boolean;
  is_admin: boolean;
  is_superuser: boolean;
  is_staff_new: boolean;
  id: string; // The UUID from the frontend system/API for this member entry
  backendId: number; // The numeric user ID expected by the backend (e.g., sprint creation API)
  name: string;
  role: string;
  avatar?: string;
}

export type Task = {
  id: string;
  project_name?: string; // Optional, as it might be null or not always available
  assigned_to_name: string | null;
  created_by_name: string | null;
  updated_by_name: string | null;
  is_deleted: boolean;
  deleted_at: string | null;
  title: string;
  slug: string;
  description: string;
  position: number;
  estimated_hours: number | null;
  completed_at: string | null;
  assigned_at: string | null;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'todo' | 'in_progress' | 'review' | 'done' | 'blocked';
  due_date: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  deleted_by: number | null;
  project: string; // Project UUID
  assigned_to: number | null; // User ID
  created_by: number | null; // User ID
  updated_by: number | null; // User ID
  sprint: string | null; // Sprint UUID
  milestone: string | null; // Milestone UUID
  tags?: string[]; // Keep as optional, might be derived or added later
};

// Type for the TaskView component, adapted from the API's Task type
export type TaskViewTask = {
  id: string;
  title: string;
  description?: string;
  status: 'To Do' | 'In Progress' | 'Review' | 'Done' | 'Blocked'; // Mapped from API's 'todo', 'in_progress', 'done'
  priority: 'low' | 'medium' | 'high'; // Mapped from API's 'low', 'medium', 'high', 'critical'
  assignee: {
    avatar: string; name: string 
}; // Mapped from API's 'assigned_to_name'
  dueDate: Date; // Mapped from API's 'due_date' string
  tags?: string[];
  project_name?: string; // Added from API's Task
      project: string; // Added from API's Task
      sprint?: string | null; // Added from API's Task
      milestone?: string | null; // Added from API's Task
    };
    
    export interface Comment {
      id: string; // The UUID from the API response
      comment: string; // The comment text
      task: string; // UUID of the associated task
      created_at: string; // Timestamp of creation (e.g., "2026-02-09T15:47:09.540731+05:30")
      commented_by: number; // The ID of the user who commented
      commented_by_name: string; // The name of the user who commented
      is_deleted: boolean;
      deleted_at: string | null;
      deleted_by: number | null;
    }
// Function to map API Task to TaskViewTask
export const mapApiTaskToTaskView = (apiTask: Task): TaskViewTask => {
  let status: 'To Do' | 'In Progress' | 'Review' | 'Done' | 'Blocked';
  switch (apiTask.status) {
    case 'todo':
      status = 'To Do';
      break;
    case 'in_progress':
      status = 'In Progress';
      break;
    case 'review':
      status = 'Review';
      break;
    case 'done':
      status = 'Done';
      break;
    case 'blocked':
      status = 'Blocked';
      break;
    default:
      status = 'To Do'; // Default status if API returns an unrecognized status
  }

  let priority: 'low' | 'medium' | 'high';
  switch (apiTask.priority) {
    case 'low':
    case 'medium':
    case 'high':
      priority = apiTask.priority;
      break;
    case 'critical':
      priority = 'high'; // Map 'critical' to 'high' for TaskView
      break;
    default:
      priority = 'medium'; // Default priority
  }

  const dueDate = apiTask.due_date ? new Date(apiTask.due_date) : new Date(); // Convert string to Date, provide default

  return {
    id: apiTask.id,
    title: apiTask.title,
    description: apiTask.description || '',
    status: status,
    priority: priority,
    assignee: { name: apiTask.assigned_to_name || 'Unassigned' },
    dueDate: dueDate,
    tags: apiTask.tags || [], // Assuming tags might be an empty array if not present
    project_name: apiTask.project_name || '',
    project: apiTask.project,
    sprint: apiTask.sprint,
    milestone: apiTask.milestone,
  };
};