'use client'
import React from 'react';
import Link from 'next/link';
import { Users, CalendarDays } from 'lucide-react';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';


type ProjectCardProps = {
  project: {
    id: number;
    name: string;
    description?: string;
    status: string;
    startDate: string;
    endDate?: string;
    progress: number;
    slug: string;
  };
  members?: { name: string }[];
};

export const ProjectCard = ({ project, members = [] }: ProjectCardProps) => {
  const statusStyles = {
    active: {
      badge: "bg-green-100 text-green-800 hover:bg-green-100 border-green-200 capitalize",
      avatar: "border-green-500"
    },
    completed: {
      badge: "bg-blue-100 text-blue-800 hover:bg-blue-100 border-blue-200 capitalize",
      avatar: "border-blue-500"
    },
    'on-hold': {
      badge: "bg-orange-100 text-orange-800 hover:bg-orange-100 border-orange-200 capitalize",
      avatar: "border-orange-500"
    },
    planned: {
      badge: "bg-gray-100 text-gray-800 hover:bg-gray-100 border-gray-200 capitalize",
      avatar: "border-gray-400"
    }
  };

  const styles = statusStyles[project.status] || statusStyles.planned;

  const getHealthStatus = (project: any, currentProgress: number) => { // Added currentProgress parameter
    const today = new Date();
    const end = new Date(project.endDate);

    if (project.status === "completed") return "on-track";

    // For simplicity, let's say if the project is past its end date and progress isn't 100%
    if (today > end && currentProgress < 100) return "delayed";
    if (currentProgress < 50) return "at-risk"; // Projects less than 50% done are at risk

    return "on-track";
  };

  const healthStyles = {
    "on-track": "bg-green-100 text-green-700 border-green-200",
    "at-risk": "bg-orange-100 text-orange-700 border-orange-200",
    "delayed": "bg-red-100 text-red-700 border-red-200",
  };

  const progress = project.progress; // Directly use the progress from the project object
  const health = getHealthStatus(project, progress); // Pass progress to health status calculation

  return (
    <Link href={`/admin/project/${project.id}`} className="block h-full">
      <Card className="h-full hover:shadow-lg cursor-pointer border-border/50 hover:border-primary/30 transition-all p-4 flex flex-col">
        <CardHeader className="p-0 flex-1">
          <div className="flex items-start  justify-between gap-3 mb-3">
            <h3 className="font-semibold text-base text-foreground mb-1 line-clamp-1">{project.name}</h3>
            <Badge className={cn("whitespace-nowrap flex-shrink-0", styles.badge)}>{project.status.replace('_', ' ')}</Badge>
          </div>

          <p className="text-xs text-muted-foreground line-clamp-2">{project.description}</p>
        </CardHeader>
        {/* Project Health + Progress */}
        <div className="space-y-2 mb-3">
          <Badge
            variant="outline"
            className={cn(
              "text-xs capitalize w-fit",
              healthStyles[health]
            )}
          >
            {health.replace("-", " ")}
          </Badge>

          <div>
            <div className="flex justify-between text-xs text-muted-foreground mb-1">
              <span>Progress</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-2 bg-primary transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        <CardContent className="p-0 pt-4">
          <div className="flex items-end justify-between text-sm text-muted-foreground">
            <div className="space-y-2 text-xs">

              <div className="flex items-center gap-2">
                <CalendarDays className="w-4 h-4" />
                <span>{format(new Date(project.endDate), "MMM d, yyyy")}</span>
              </div>


              {members.length > 0 && (
                <div className="flex items-start gap-2">
                  <Users className="w-4 h-4 mt-0.5" />
                  <div className="flex flex-wrap gap-1">
                    {members.slice(0, 2).map((member, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="text-[10px] px-2 py-0.5"
                      >
                        {member.name}
                      </Badge>
                    ))}

                    {members.length > 2 && (
                      <Badge
                        variant="outline"
                        className="text-[10px] px-2 py-0.5 cursor-pointer hover:bg-muted"
                        title={members.map(m => m.name).join(', ')}
                      >
                        +{members.length - 2} more
                      </Badge>
                    )}
                  </div>
                </div>
              )}
            </div>
            {members.length > 0 && (
              <div className="flex -space-x-2">
                {members.slice(0, 3).map((member, index) => (
                  <Avatar key={index} className={cn("w-8 h-8 border-2", styles.avatar)}>
                    <AvatarFallback className="text-xs">
                      {member.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                ))}
                {members.length > 3 && (
                  <div className={cn("w-8 h-8 rounded-full bg-muted border-2 flex items-center justify-center text-xs text-muted-foreground", styles.avatar)}>
                    +{members.length - 3}
                  </div>
                )}
              </div>
            )}
          </div>
        </CardContent>

        {/* <CardContent className="p-0 pt-4">
          <div className="flex items-end justify-between text-sm text-muted-foreground">


            <div className="space-y-2 text-xs">

              <div className="flex items-center gap-2">
                <CalendarDays className="w-4 h-4" />
                <span>{format(new Date(project.endDate), "MMM d, yyyy")}</span>
              </div>


              {members.length > 0 && (
                <div className="flex items-start gap-2">
                  <Users className="w-4 h-4 mt-0.5" />
                  <div className="flex flex-wrap gap-1">
                    {members.slice(0, 2).map((member, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="text-[10px] px-2 py-0.5"
                      >
                        {member.name}
                      </Badge>
                    ))}

                    {members.length > 2 && (
                      <Badge
                        variant="outline"
                        className="text-[10px] px-2 py-0.5 cursor-pointer hover:bg-muted"
                        title={members.map(m => m.name).join(', ')}
                      >
                        +{members.length - 2} more
                      </Badge>
                    )}
                  </div>
                </div>
              )}
            </div>


            {members.length > 0 && (
              <div className="flex -space-x-2">
                {members.slice(0, 3).map((member, index) => (
                  <Avatar key={index} className={cn("w-8 h-8 border-2", styles.avatar)}>
                    <AvatarFallback className="text-xs">
                      {member.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                ))}
                {members.length > 3 && (
                  <div
                    className={cn(
                      "w-8 h-8 rounded-full bg-muted border-2 flex items-center justify-center text-xs",
                      styles.avatar
                    )}
                  >
                    +{members.length - 3}
                  </div>
                )}
              </div>
            )}

          </div>
        </CardContent> */}

      </Card>
    </Link>
  );
};







