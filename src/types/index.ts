export type ProjectStatus = 'active' | 'planned' | 'completed' | 'on-hold';

export interface ProjectMember {
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

export interface Sprint {
  id: string;
  project: string; // Project UUID
  project_name: string;
  name: string;
  sprint_number: string;
  sprint_type: SprintType; // Use the new SprintType
  goal: string;
  start_date: string;
  end_date: string;
  duration_weeks: number;
  working_days: number[]; // 1-5 for Mon-Fri from sprint-types.ts. API returns string[] for working_days. Need to clarify this.
  story_points_target: number;
  status: SprintStatus; // Use the new SprintStatus
  // Properties from sprint-types.ts:
  milestoneId?: string;
  createdAt?: string;
  scrumMaster: string;
  productOwner: string;
  teamMembers: string[];
  capacity: Record<string, number>; // userId -> hours
  settings: {
    allowTaskOverflow: boolean;
    autoClose: boolean;
    allowScopeChange: boolean;
    freezeWhenActive: boolean;
  };
  retrospective?: {
    wentWell: string;
    wentWrong: string;
    actionItems: string[];
  };
  // Properties from previous Sprint in index.ts
  total_capacity_hours: number;
  created_by: number;
  updated_at: string;
  // Reconciled projectId and createdAt from previous index.ts with new structure
  projectId: string; // For consistency with frontend state, already present
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
  status: 'todo' | 'in_progress' | 'done';
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