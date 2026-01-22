export type ProjectStatus = 'active' | 'planned' | 'completed' | 'on-hold';

export interface Project {
  id: number;
  name: string;
  slug: string;
  progress: number;
  status: ProjectStatus;
  description: string;
  startDate: string;
  endDate: string;
  budget: number;
  client: string;
}

