'use client';

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";

// Interface matching the API response for a single member
interface DepartmentMember {
  name: string;
  profile_image?: string;
  status: "Checked In" | "Yet to check-in" | "On Leave" | "Absent";
}

// Interface for the summary object
interface Summary {
    present: number;
    total: number;
}

export function DepartmentMembersCard() {
  const [members, setMembers] = useState<DepartmentMember[]>([]);
  const [departmentName, setDepartmentName] = useState<string | null>(null);
  const [summary, setSummary] = useState<Summary>({ present: 0, total: 0 });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchDepartmentMembers = async () => {
      const token = localStorage.getItem('authToken');
      if (!token) {
        toast({
          title: "Authentication Error",
          description: "No auth token found, please log in.",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/accounts/profile/department-members/`, {
          method: 'GET',
          headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch department members');
        }
        
        const responseData = await response.json();
        setMembers(responseData.members || []);
        setDepartmentName(responseData.department || "Your Department");
        setSummary(responseData.summary || { present: 0, total: 0 });

      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message || "Could not load department members.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDepartmentMembers();
  }, [toast]);
  
  const getStatusDisplay = (status: DepartmentMember["status"]) => {
    switch (status) {
      case "Checked In":
        return { label: "Present", className: "status-badge-present" };
      case "Yet to check-in":
        return { label: "Yet to check-in", className: "status-badge-pending" };
      case "Absent":
        return { label: "Absent", className: "status-badge-absent" };
      case "On Leave":
        return { label: "On Leave", className: "status-badge-absent" };
      default:
        return { label: "Unknown", className: "bg-gray-200 text-gray-800" }
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
        {!loading && (
          <span className="text-sm text-muted-foreground">
            {summary.present}/{summary.total} present
          </span>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="space-y-3">
          {members.map((member, index) => {
            const initials = member.name
              .split(" ")
              .filter(n => n)
              .map((n) => n[0])
              .join("")
              .toUpperCase();

            const statusInfo = getStatusDisplay(member.status);

            return (
              <div
                key={index} // Using index as key since no id is provided
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors"
              >
                <Avatar className="h-10 w-10">
                  <AvatarImage src={member.profile_image} alt={member.name} />
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
      )}
    </div>
  );
}