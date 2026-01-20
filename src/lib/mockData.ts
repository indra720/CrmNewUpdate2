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
    name: "Corporate Website Redesign",
    slug: "corporate-website-redesign",
    progress: 75,
    status: "active",
    description:
      "A complete overhaul of the main corporate website to improve user experience and modernize the design.",
    startDate: "2025-01-15",
    endDate: "2025-06-30",
    budget: 50000,
    client: "Global Tech Inc.",
  },
  {
    id: 2,
    name: "Mobile App Launch",
    slug: "mobile-app-launch",
    progress: 100,
    status: "completed",
    description:
      "Launch of the new iOS and Android mobile application for our core services.",
    startDate: "2024-09-01",
    endDate: "2025-01-31",
    budget: 75000,
    client: "Innovate Solutions",
  },
  {
    id: 3,
    name: "Q3 Marketing Campaign",
    slug: "q3-marketing-campaign",
    progress: 40,
    status: "active",
    description:
      "A multi-channel marketing campaign to boost brand awareness and lead generation for the third quarter.",
    startDate: "2025-07-01",
    endDate: "2025-09-30",
    budget: 25000,
    client: "Self-initiated",
  },
  {
    id: 4,
    name: "API Integration Project",
    slug: "api-integration-project",
    progress: 90,
    status: "active",
    description:
      "Integrating third-party APIs to extend the functionality of our platform.",
    startDate: "2025-02-01",
    endDate: "2025-05-31",
    budget: 35000,
    client: "Connective Corp.",
  },
  {
    id: 5,
    name: "Data Analytics Dashboard",
    slug: "data-analytics-dashboard",
    progress: 20,
    status: "planned",
    description:
      "Development of an internal dashboard for visualizing key business metrics and data analytics.",
    startDate: "2025-08-15",
    endDate: "2025-12-31",
    budget: 42000,
    client: "Internal",
  },
];

export const mockTasks = [
  // Project 1: Corporate Website Redesign
  {
    id: 1,
    projectId: 1,
    title: "Design new homepage mockups",
    status: "in_progress",
    priority: "high",
    deadline: new Date(new Date().setDate(new Date().getDate() + 3))
      .toISOString()
      .split("T")[0],
    assigneeId: "1",
  }, // Alice
  {
    id: 7,
    projectId: 1,
    title: "Develop responsive navigation",
    status: "todo",
    priority: "medium",
    deadline: new Date(new Date().setDate(new Date().getDate() + 10))
      .toISOString()
      .split("T")[0],
    assigneeId: "1",
  }, // Alice
  {
    id: 8,
    projectId: 1,
    title: "Integrate contact forms",
    status: "todo",
    priority: "low",
    deadline: new Date(new Date().setDate(new Date().getDate() + 15))
      .toISOString()
      .split("T")[0],
    assigneeId: "2",
  }, // Bob

  // Project 2: Mobile App Launch
  {
    id: 2,
    projectId: 2,
    title: "Develop user authentication",
    status: "done",
    priority: "high",
    deadline: new Date(new Date().setDate(new Date().getDate() - 10))
      .toISOString()
      .split("T")[0],
    assigneeId: "3",
  }, // Charlie
  {
    id: 9,
    projectId: 2,
    title: "Implement push notifications",
    status: "in_progress",
    priority: "high",
    deadline: new Date(new Date().setDate(new Date().getDate() + 5))
      .toISOString()
      .split("T")[0],
    assigneeId: "3",
  }, // Charlie

  // Project 3: Q3 Marketing Campaign
  {
    id: 3,
    projectId: 3,
    title: "Set up staging server",
    status: "in_progress",
    priority: "medium",
    deadline: new Date(new Date().setDate(new Date().getDate() + 6))
      .toISOString()
      .split("T")[0],
    assigneeId: "1",
  }, // Alice
  {
    id: 10,
    projectId: 3,
    title: "Design social media creatives",
    status: "todo",
    priority: "medium",
    deadline: new Date(new Date().setDate(new Date().getDate() + 12))
      .toISOString()
      .split("T")[0],
    assigneeId: "5",
  }, // Eve

  // Project 4: API Integration Project
  {
    id: 4,
    projectId: 4,
    title: "Write API documentation",
    status: "todo",
    priority: "low",
    deadline: new Date(new Date().setDate(new Date().getDate() + 15))
      .toISOString()
      .split("T")[0],
    assigneeId: "4",
  }, // David
  {
    id: 5,
    projectId: 4,
    title: "Test payment gateway",
    status: "in_progress",
    priority: "high",
    deadline: new Date(new Date().setDate(new Date().getDate() + 1))
      .toISOString()
      .split("T")[0],
    assigneeId: "2",
  }, // Bob

  // Project 5: Data Analytics Dashboard
  {
    id: 6,
    projectId: 5,
    title: "Finalize logo design",
    status: "done",
    priority: "medium",
    deadline: new Date(new Date().setDate(new Date().getDate() - 20))
      .toISOString()
      .split("T")[0],
    assigneeId: "5",
  }, // Eve
  {
    id: 11,
    projectId: 5,
    title: "Define key metrics",
    status: "in_progress",
    priority: "high",
    deadline: new Date(new Date().setDate(new Date().getDate() + 7))
      .toISOString()
      .split("T")[0],
    assigneeId: "4",
  }, // David
];

export const mockProjectMembers = [
  {
    id: "1",
    projectId: 1,
    name: "Alice",
    email: "alice@company.com",
    role: "Developer",
  },
  {
    id: "2",
    projectId: 1,
    name: "Bob",
    email: "bob@company.com",
    role: "Designer",
  },
  {
    id: "3",
    projectId: 2,
    name: "Charlie",
    email: "charlie@company.com",
    role: "Lead",
  },
  {
    id: "4",
    projectId: 3,
    name: "David",
    email: "david@company.com",
    role: "Developer",
  },
  { id: "5", projectId: 3, name: "Eve", email: "eve@company.com", role: "QA" },
  {
    id: "6",
    projectId: 4,
    name: "Frank",
    email: "frank@company.com",
    role: "Developer",
  },
  {
    id: "7",
    projectId: 4,
    name: "Alice",
    email: "alice@company.com",
    role: "Developer",
  },
];

export const mockUsers: User[] = [
  {
    id: "1",
    email: "sarah.chen@company.com",
    firstName: "Sarah",
    lastName: "Chen",
    avatarUrl: undefined,
  },
  {
    id: "2",
    email: "marcus.johnson@company.com",
    firstName: "Marcus",
    lastName: "Johnson",
    avatarUrl: undefined,
  },
  {
    id: "3",
    email: "elena.rodriguez@company.com",
    firstName: "Elena",
    lastName: "Rodriguez",
    avatarUrl: undefined,
  },
  {
    id: "4",
    email: "david.kim@company.com",
    firstName: "David",
    lastName: "Kim",
    avatarUrl: undefined,
  },
];

export const mockActivities = [
  {
    id: 1,
    projectId: 1,
    type: "task_completed",
    description: 'completed task "Design new homepage mockups"',
    user: "Alice",
    timestamp: new Date(
      new Date().setHours(new Date().getHours() - 3),
    ).toISOString(),
    taskId: 1,
  },
  {
    id: 2,
    projectId: 1,
    type: "status_changed",
    description: 'changed project status from "active" to "in_progress"',
    user: "Bob",
    timestamp: new Date(
      new Date().setDate(new Date().getDate() - 1),
    ).toISOString(),
  },
  {
    id: 3,
    projectId: 1,
    type: "member_added",
    description: "added Bob to the project team",
    user: "Alice",
    timestamp: new Date(
      new Date().setDate(new Date().getDate() - 2),
    ).toISOString(),
    memberId: "2",
  },
  {
    id: 4,
    projectId: 2,
    type: "comment_added",
    description: 'added a comment on task "Implement push notifications"',
    user: "Charlie",
    timestamp: new Date(
      new Date().setHours(new Date().getHours() - 5),
    ).toISOString(),
    taskId: 9,
  },
  {
    id: 5,
    projectId: 3,
    type: "task_created",
    description: 'created task "Design social media creatives"',
    user: "Eve",
    timestamp: new Date(
      new Date().setDate(new Date().getDate() - 3),
    ).toISOString(),
    taskId: 10,
  },
];
