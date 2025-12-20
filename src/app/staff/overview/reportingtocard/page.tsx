'use client';

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface ReportingToData {
  id: number;
  name: string;
  designation: string;
  profile_image?: string; // Changed from avatar to profile_image
  status: "Checked In" | "Yet to check-in" | "On Leave";
}

export function ReportingToCard() {
  const [data, setData] = useState<ReportingToData | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchReportingToData = async () => {
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
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/accounts/profile/reporting-to/`, {
          method: 'GET',
          headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          if (response.status === 404) {
            setData(null);
          } else {
            throw new Error('Failed to fetch reporting-to data');
          }
        } else {
            const responseData = await response.json();
            // Correctly access the nested object
            const singleData = responseData.reporting_to;
            setData(singleData || null);
        }

      } catch (error: any) {
        console.error(error);
        toast({
          title: "Error",
          description: error.message || "An unexpected error occurred.",
          variant: "destructive",
        });
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchReportingToData();
  }, [toast]);

  const getStatusDisplay = (status: ReportingToData['status'] | undefined) => {
    switch (status) {
      case "Checked In":
        return { label: "Checked In", className: "bg-green-100 text-green-800" };
      case "Yet to check-in":
        return { label: "Yet to check-in", className: "bg-amber-100 text-amber-800" };
      case "On Leave":
        return { label: "On Leave", className: "bg-red-100 text-red-800" };
      default:
        return { label: "Unknown", className: "bg-gray-100 text-gray-800" };
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-24">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      );
    }

    if (!data) {
      return (
        <div className="text-center text-muted-foreground py-4">No reporting manager found.</div>
      );
    }

    const name = data.name || '';
    const designation = data.designation || 'N/A';
    
    const initials = name
      .split(" ")
      .filter(n => n)
      .map((n) => n[0])
      .join("")
      .toUpperCase();
      
    const statusInfo = getStatusDisplay(data.status);

    return (
      <div className="flex items-center gap-4 py-2">
        <Avatar className="h-14 w-14 ring-2 ring-primary/20">
          {/* Use profile_image for the src */}
          <AvatarImage src={data.profile_image} alt={name} />
          <AvatarFallback className="bg-gradient-to-br from-primary to-primary/70 text-primary-foreground">
            {initials}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1">
          <h4 className="font-medium text-foreground">{name}</h4>
          <p className="text-sm text-muted-foreground">{designation}</p>
          <span className={`rounded-full px-2 py-1 text-xs font-medium inline-flex items-center gap-1 ${statusInfo.className}`}>
            {statusInfo.label}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="dashboard-card bg-card border border-border p-3 rounded-md shadow-sm order-3">
      <div className="flex items-center gap-3 mb-4">
        <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <User className="h-5 w-5 text-primary" />
        </div>
        <h3 className="font-semibold text-foreground">Reporting To</h3>
      </div>
      {renderContent()}
    </div>
  );
}