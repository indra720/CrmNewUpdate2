// src/components/pms/sprint-mock-data.ts

import { Project, User, Sprint, SprintTask, Milestone } from './sprint-types';

export const mockProjects: Project[] = [
    { id: 'PRJ-001', name: 'E-commerce Platform', status: 'Active', startDate: '2025-01-01', endDate: '2025-06-30' },
    { id: 'PRJ-002', name: 'CRM Integration', status: 'Active', startDate: '2025-02-15', endDate: '2025-08-30' },
    { id: 'PRJ-003', name: 'Legacy Migration', status: 'On Hold', startDate: '2024-11-01', endDate: '2025-04-30' },
];
  
export const mockUsers: User[] = [
    { id: 'USR-1', name: 'Sarah Chen', role: 'Scrum Master' },
    { id: 'USR-2', name: 'Marcus Johnson', role: 'Product Owner' },
    { id: 'USR-3', name: 'Elena Rodriguez', role: 'Developer' },
    { id: 'USR-4', name: 'David Kim', role: 'Developer' },
    { id: 'USR-5', name: 'Alex Wong', role: 'QA Engineer' },
];

export const mockMilestones: Milestone[] = [
    { id: 'ML-001', projectId: 'PRJ-001', name: 'Beta Launch', deadline: '2025-03-15', progress: 45 },
    { id: 'ML-002', projectId: 'PRJ-001', name: 'Payment Gateway', deadline: '2025-04-30', progress: 10 },
];

export const initialSprints: Sprint[] = [
    {
      id: 'SP-001',
      projectId: 'PRJ-001',
      milestoneId: 'ML-001',
      name: 'Authentication & Security',
      number: 'Sprint 01',
      goal: 'Implement OAuth and user role management',
      type: 'development',
      durationWeeks: 2,
      startDate: '2025-01-20',
      endDate: '2025-02-03',
      workingDays: [1, 2, 3, 4, 5],
      status: 'Active',
      scrumMaster: 'USR-1',
      productOwner: 'USR-2',
      teamMembers: ['USR-3', 'USR-4', 'USR-5'],
      capacity: { 'USR-3': 40, 'USR-4': 40, 'USR-5': 30 },
      storyPointsTarget: 24,
      settings: {
        allowTaskOverflow: false,
        autoClose: true,
        allowScopeChange: false,
        freezeWhenActive: true
      }
    }
];
  
export const mockBacklogTasks: SprintTask[] = [
    { id: 'TASK-101', title: 'User Login API', type: 'Feature', priority: 'High', status: 'Todo', storyPoints: 5, assigneeId: 'USR-3' },
    { id: 'TASK-102', title: 'Password Reset Flow', type: 'Feature', priority: 'Medium', status: 'In Progress', storyPoints: 3, assigneeId: 'USR-3' },
    { id: 'TASK-103', title: 'Fix CSS bug in Header', type: 'Bug', priority: 'Low', status: 'Todo', storyPoints: 1 },
    { id: 'TASK-104', title: 'Unit Tests for Auth', type: 'Improvement', priority: 'Medium', status: 'Review', storyPoints: 2, assigneeId: 'USR-4' },
    { id: 'TASK-105', title: 'Database Schema Design', type: 'Feature', priority: 'Urgent', status: 'Done', storyPoints: 8, assigneeId: 'USR-4' },
    { id: 'TASK-106', title: 'API Documentation', type: 'Improvement', priority: 'Low', status: 'Todo', storyPoints: 2 },
    { id: 'TASK-107', title: 'Responsive Mobile View', type: 'Feature', priority: 'Medium', status: 'Todo', storyPoints: 5 },
];

export const burndownData = [
    { day: 'Day 1', ideal: 24, actual: 24 },
    { day: 'Day 2', ideal: 21.6, actual: 23 },
    { day: 'Day 3', ideal: 19.2, actual: 20 },
    { day: 'Day 4', ideal: 16.8, actual: 18 },
    { day: 'Day 5', ideal: 14.4, actual: 15 },
    { day: 'Day 6', ideal: 12, actual: 12 },
    { day: 'Day 7', ideal: 9.6, actual: 10 },
    { day: 'Day 8', ideal: 7.2, actual: 8 },
    { day: 'Day 9', ideal: 4.8, actual: 5 },
    { day: 'Day 10', ideal: 2.4, actual: 2 },
    { day: 'Day 11', ideal: 0, actual: 0 },
];
