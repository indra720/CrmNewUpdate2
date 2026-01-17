'use client';

import ProjectDetails from '@/components/pms/ProjectsDetails';

// This defines the shape of the props the page will receive from Next.js
interface ProjectDetailsPageProps {
  params: {
    slug: string;
  };
}

// The page component
export default function AdminProjectDetailsPage({ params }: ProjectDetailsPageProps) {
  // We just render the ProjectDetails component and pass the params to it.
  // The ProjectDetails component contains all the logic for fetching and displaying the project.
  return <ProjectDetails params={params} />;
}

// Optional: If you want to statically generate these pages at build time
// you can use generateStaticParams. For now, we'll keep it dynamic.
/*
import { mockProjects } from '@/lib/mockData';

export async function generateStaticParams() {
  return mockProjects.map((project) => ({
    slug: project.slug,
  }));
}
*/
