// src/components/pms/sprint-types.ts

export type SprintStatus = 'Draft' | 'Planned' | 'Active' | 'Frozen' | 'Completed' | 'Archived';
export type SprintType = 'Planning' | 'Development' | 'Testing' | 'Release';

export interface SprintTask {
  id: string;
  title: string;
  type: 'Bug' | 'Feature' | 'Improvement';
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  status: 'Todo' | 'In Progress' | 'Review' | 'Done';
  assigneeId?: string;
  storyPoints: number;
  blocked?: boolean;
  sprintId?: string;
}

export interface SprintHistoryEntry {
  id: string;
  action: 'create' | 'update' | 'delete'; // Assuming these actions
  model_name: string; // Should be 'Sprint'
  old_data: Sprint | null; // Null for 'create' action
  new_data: Sprint;
  performed_by_name: string | null;
  created_at: string;
}

export interface Sprint {
  number: ReactNode;
  id: string;
  project: string; // From API: Project ID (UUID)
  project_name: string; // From API: Project Name
  milestoneId?: string; // Keep this if used elsewhere (not from API response)
  name: string;
  sprint_number: string; // From API
  sprint_type: SprintType; // From API
  goal: string;
  duration_weeks: number; // From API
  start_date: string; // From API
  end_date: string; // From API
  working_days: string[]; // From API
  story_points_target: number; // From API
  status: SprintStatus;
  allow_task_overflow: boolean; // From API
  auto_close: boolean; // From API
  allow_scope_change: boolean; // From API
  freeze_when_active: boolean; // From API
  total_capacity_hours: number; // From API
  created_by: number; // From API
  created_at: string; // From API
  updated_at: string; // From API
}

export interface Project {
  id: string;
  name: string;
  status: 'Active' | 'Completed' | 'On Hold';
  startDate: string;
  endDate: string;
}

export interface Milestone {
  id: string;
  projectId: string;
  name: string;
  deadline: string;
  progress: number;
}

export interface User {
  id: string;
  name: string;
  role: string;
  avatar?: string;
}