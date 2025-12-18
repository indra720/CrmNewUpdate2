'use client';

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "lucide-react";

interface ReportingToCardProps {
  managerName: string;
  managerTitle?: string;
  managerAvatar?: string;
  status: "checked-in" | "yet-to-check-in" | "on-leave";
}

export function ReportingToCard({
  managerName,
  managerTitle = "Manager",
  managerAvatar,
  status,
}: ReportingToCardProps) {
  const initials = managerName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  const getStatusDisplay = () => {
    switch (status) {
      case "checked-in":
        return { label: "Checked In", className: "bg-green-100 text-green-800 rounded-full px-2 py-1 text-xs font-medium inline-flex items-center gap-1" };
      case "yet-to-check-in":
        return { label: "Yet to check-in", className: "bg-amber-100 text-amber-800 rounded-full px-2 py-1 text-xs font-medium inline-flex items-center gap-1" };
      case "on-leave":
        return { label: "On Leave", className: "bg-red-100 text-red-800 rounded-full px-2 py-1 text-xs font-medium inline-flex items-center gap-1" };
      default:
        return { label: "", className: "" };
    }
  };

  const statusInfo = getStatusDisplay();

  return (
    <div className="dashboard-card bg-card border border-border p-3 rounded-md shadow-sm">
      <div className="flex items-center gap-3 mb-4">
        <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <User className="h-5 w-5 text-primary" />
        </div>
        <h3 className="font-semibold text-foreground">Reporting To</h3>
      </div>

      <div className="flex items-center gap-4">
        <Avatar className="h-14 w-14 ring-2 ring-primary/20 ">
          <AvatarImage src={managerAvatar} alt={managerName} />
          <AvatarFallback className="bg-gradient-to-br from-primary to-primary/70 text-primary-foreground">
            {initials}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1">
          <h4 className="font-medium text-foreground">{managerName}</h4>
          <p className="text-sm text-muted-foreground">{managerTitle}</p>
          <span className={`${statusInfo.className}`}>
            {statusInfo.label}
          </span>
        </div>
      </div>
    </div>
  );
}
