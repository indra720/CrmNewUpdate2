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
}

export interface Sprint {
  id: string;
  projectId: string;
  milestoneId?: string;
  name: string;
  number: string;
  goal: string;
  type: SprintType;
  durationWeeks: number;
  startDate: string;
  endDate: string;
  workingDays: number[]; // 1-5 for Mon-Fri
  status: SprintStatus;
  scrumMaster: string;
  productOwner: string;
  teamMembers: string[];
  capacity: Record<string, number>; // userId -> hours
  storyPointsTarget: number;
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
