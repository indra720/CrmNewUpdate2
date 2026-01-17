'use client'
import React from 'react';
import Link from 'next/link';
import { Users, CalendarDays } from 'lucide-react';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

export const ProjectCard = ({ project, members = [] }) => {
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

  return (
    <Link href={`/admin/project/${project.slug}`} className="block h-full">
      <Card className="h-full hover:shadow-lg cursor-pointer border-border/50 hover:border-primary/30 transition-all p-4 flex flex-col">
        <CardHeader className="p-0 flex-1">
          <div className="flex items-start justify-between gap-3 mb-3">
            <Badge className={cn("whitespace-nowrap flex-shrink-0", styles.badge)}>{project.status.replace('_', ' ')}</Badge>
          </div>
          <h3 className="font-semibold text-base text-foreground mb-1 line-clamp-1">{project.name}</h3>
          <p className="text-xs text-muted-foreground line-clamp-2">{project.description}</p>
        </CardHeader>
        
        <CardContent className="p-0 pt-4">
          <div className="flex items-end justify-between text-sm text-muted-foreground">
            {/* Date & Members */}
            <div className='space-y-2'>
              <div className="flex items-center gap-2 text-xs">
                <CalendarDays className="w-4 h-4" />
                <span>{format(new Date(project.endDate), "MMM d, yyyy")}</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <Users className="w-4 h-4" />
                <span>{members.length} Members</span>
              </div>
            </div>
            
            {/* Avatars */}
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
      </Card>
    </Link>
  );
};








