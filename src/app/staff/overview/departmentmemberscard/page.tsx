'use client';

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users } from "lucide-react";

interface Member {
  id: string;
  name: string;
  avatar?: string;
  status: "present" | "yet-to-check-in" | "absent" | "on-leave";
}

interface DepartmentMembersCardProps {
  members: Member[];
  departmentName?: string;
}

export function DepartmentMembersCard({
  members,
  departmentName = "Engineering",
}: DepartmentMembersCardProps) {
  const getStatusDisplay = (status: Member["status"]) => {
    switch (status) {
      case "present":
        return { label: "Present", className: "status-badge-present" };
      case "yet-to-check-in":
        return { label: "Yet to check-in", className: "status-badge-pending" };
      case "absent":
        return { label: "Absent", className: "status-badge-absent" };
      case "on-leave":
        return { label: "On Leave", className: "status-badge-absent" };
    }
  };

  return (
    <div className="dashboard-card bg-card shadow-md rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Users className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Department Members</h3>
            <p className="text-sm text-muted-foreground">{departmentName}</p>
          </div>
        </div>
        <span className="text-sm text-muted-foreground">
          {members.filter((m) => m.status === "present").length}/{members.length} present
        </span>
      </div>

      <div className="space-y-3">
        {members.map((member) => {
          const initials = member.name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase();

          const statusInfo = getStatusDisplay(member.status);

          return (
            <div
              key={member.id}
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors"
            >
              <Avatar className="h-10 w-10">
                <AvatarImage src={member.avatar} alt={member.name} />
                <AvatarFallback className="bg-secondary text-secondary-foreground text-sm">
                  {initials}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground truncate">
                  {member.name}
                </p>
              </div>

              <span className={`status-badge text-xs ${statusInfo.className}`}>
                {statusInfo.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
