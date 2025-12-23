// 'use client';

// import { useState, useEffect } from "react";
// import { LogIn, LogOut, Coffee, MapPin, Clock, CheckCircle, ChevronRight } from "lucide-react";
// import DashboardLayout from "../dashboardlayout/page";
// import { Skeleton } from "@/components/ui/skeleton";

// // Helper function to map API data to the format the UI expects
// const mapApiToActivity = (apiItem) => {
//   const activities = [];
//   const itemDate = new Date(apiItem.date);
//   const displayDate = itemDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });

//   // Create a Check-in Activity if check_in time exists
//   if (apiItem.check_in) {
//     const checkInTime = new Date(`1970-01-01T${apiItem.check_in}`).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
//     activities.push({
//       id: `${apiItem.id}-in`,
//       type: "check-in",
//       title: "Checked In",
//       time: checkInTime,
//       date: displayDate,
//       sortableDate: itemDate,
//       location: apiItem.location_name || "Unknown Location",
//       icon: LogIn,
//       color: "border-emerald-500/20",
//       badge: "Present",
//       badgeColor: "bg-emerald-100 text-emerald-800",
//     });
//   }

//   // Create a Check-out Activity if check_out time exists
//   if (apiItem.check_out) {
//     const checkOutTime = new Date(`1970-01-01T${apiItem.check_out}`).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
//     activities.push({
//       id: `${apiItem.id}-out`,
//       type: "check-out",
//       title: "Checked Out",
//       time: checkOutTime,
//       date: displayDate,
//       sortableDate: itemDate,
//       location: apiItem.location_name || "Unknown Location",
//       icon: LogOut,
//       color: "border-red-500/20",
//       badge: "Ended",
//       badgeColor: "bg-red-100 text-red-800",
//     });
//   }
  
//   return activities;
// };


// export default function ActivitiesPage() {
//   const [activities, setActivities] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [lastUpdated, setLastUpdated] = useState("Just now");

//   useEffect(() => {
//     const fetchActivities = async () => {
//       setIsLoading(true);
//       const token = localStorage.getItem("authToken");
//       if (!token) {
//         console.error("Auth token not found");
//         setIsLoading(false);
//         return;
//       }

//       try {
//         const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/accounts/attendance/activities/`, {
//           headers: {
//             Authorization: `Token ${token}`,
//           },
//         });

//         if (response.ok) {
//           const data = await response.json();
//           if (data && Array.isArray(data.results)) {
//             const processedActivities = data.results
//               .filter(item => !item.status.toLowerCase().includes('break')) // Filter out lunch breaks
//               .flatMap(mapApiToActivity) // Create separate check-in/out activities
//               .sort((a, b) => {
//                 // Sort by date descending, then by time descending
//                 const dateComparison = b.sortableDate - a.sortableDate;
//                 if (dateComparison !== 0) return dateComparison;
//                 // Basic time sort, works for AM/PM strings
//                 return b.time.localeCompare(a.time); 
//               });
//             setActivities(processedActivities);
//             setLastUpdated(new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }));
//           } else {
//             console.error("API response is not in the expected format:", data);
//           }
//         } else {
//           console.error("Failed to fetch activities:", response.statusText);
//         }
//       } catch (error) {
//         console.error("Error fetching activities:", error);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchActivities();
//   }, []);

//   return (
//     <DashboardLayout>
//       <div className="space-y-6 bg-card shadow-md rounded-xl p-4 sm:p-6">
//         {/* Header */}
//         <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
//           <div className="space-y-1">
//             <h1 className="text-xl sm:text-2xl font-bold text-foreground">Activities</h1>
//             <p className="text-sm text-muted-foreground">Your recent attendance activities</p>
//           </div>
//           <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
//             <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
//             Last updated: {isLoading ? "Loading..." : lastUpdated}
//           </div>
//         </div>

//         {/* Activity List */}
//         <div className="space-y-3">
//           {isLoading ? (
//             // Skeleton Loader
//             Array.from({ length: 4 }).map((_, index) => (
//               <div key={index} className="flex items-start gap-3 p-3 sm:p-4 rounded-lg border">
//                 <Skeleton className="h-10 w-10 sm:h-12 sm:w-12 rounded-lg" />
//                 <div className="flex-1 space-y-2">
//                   <Skeleton className="h-4 w-3/4" />
//                   <Skeleton className="h-3 w-1/4" />
//                   <Skeleton className="h-3 w-full" />
//                 </div>
//               </div>
//             ))
//           ) : activities.length > 0 ? (
//             // Activity Items
//             activities.map((activity, index) => {
//               const Icon = activity.icon || Clock;
//               return (
//                 <div
//                   key={activity.id}
//                   className={`flex items-start gap-3 p-3 sm:p-4 rounded-lg border ${activity.color} hover:shadow-md transition-all duration-200 animate-in slide-in-from-bottom-2`}
//                   style={{ animationDelay: `${index * 0.05}s` }}
//                 >
//                   <div className={`flex-shrink-0 h-10 w-10 sm:h-12 sm:w-12 rounded-lg ${activity.color.replace('border-', 'bg-').replace('/20', '/10')} flex items-center justify-center shadow-sm`}>
//                     <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
//                   </div>

//                   <div className="flex-1 min-w-0">
//                     <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-1">
//                       <h3 className="font-semibold text-foreground text-sm sm:text-base leading-tight">
//                         {activity.title}
//                       </h3>
//                       <span className={`px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ${activity.badgeColor}`}>
//                         {activity.badge}
//                       </span>
//                     </div>

//                     <p className="text-primary font-mono text-xs sm:text-sm mb-1.5">
//                       {activity.time} on {activity.date}
//                     </p>

//                     <div className="flex items-center gap-1.5 text-xs sm:text-sm text-muted-foreground">
//                       <MapPin className="h-3 w-3 flex-shrink-0" />
//                       <span className="truncate">{activity.location}</span>
//                     </div>
//                   </div>
//                 </div>
//               );
//             })
//           ) : (
//             // No activities message
//             <div className="text-center py-10">
//               <h3 className="font-semibold">No Activities Found</h3>
//               <p className="text-sm text-muted-foreground">Your recent check-in and check-out history will appear here.</p>
//             </div>
//           )}
//         </div>
//       </div>
//     </DashboardLayout>
//   );
// }

















'use client';

import { useState, useEffect } from "react";
import { LogIn, LogOut, MapPin, Clock } from "lucide-react";
import DashboardLayout from "../dashboardlayout/page";
import { Skeleton } from "@/components/ui/skeleton";

export default function ActivitiesPage() {
  const [activities, setActivities] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState("Just now");

  useEffect(() => {
    const fetchActivities = async () => {
      setIsLoading(true);
      const token = localStorage.getItem("authToken");

      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/accounts/attendance/activities/`,
          {
            headers: {
              Authorization: `Token ${token}`,
            },
          }
        );

        const data = await res.json();

        if (Array.isArray(data?.results)) {
          const formatted = data.results.map((item, index) => ({
            id: index,
            title: item.label,
            time: item.time,
            date: new Date().toLocaleDateString("en-GB", {
              day: "numeric",
              month: "short",
            }),
            location: item.location,
            badge: item.type === "check_in" ? "Present" : "Ended",
            badgeColor:
              item.type === "check_in"
                ? "bg-emerald-100 text-emerald-800"
                : "bg-red-100 text-red-800",
            icon: item.type === "check_in" ? LogIn : LogOut,
            bgColor:
              item.type === "check_in"
                ? "bg-emerald-50 border-emerald-200"
                : "bg-red-50 border-red-200",
          }));

          setActivities(formatted);
          setLastUpdated(
            new Date().toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
            })
          );
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchActivities();
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-6 bg-card rounded-xl shadow p-4 sm:p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold">Activities</h1>
            <p className="text-sm text-muted-foreground">
              Your recent attendance activity
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            Last updated: {isLoading ? "Loading..." : lastUpdated}
          </div>
        </div>

        {/* List */}
        <div className="space-y-4">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="flex gap-3 p-4 rounded-lg border"
              >
                <Skeleton className="h-12 w-12 rounded-lg" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-3 w-1/3" />
                  <Skeleton className="h-3 w-full" />
                </div>
              </div>
            ))
          ) : activities.length > 0 ? (
            activities.map((activity) => {
              const Icon = activity.icon;
              return (
                <div
                  key={activity.id}
                  className={`flex gap-3 p-4 rounded-lg border ${activity.bgColor}`}
                >
                  <div className="h-12 w-12 rounded-lg bg-white shadow flex items-center justify-center">
                    <Icon className="h-5 w-5" />
                  </div>

                  <div className="flex-1">
                    <div className="flex justify-between items-start gap-2">
                      <h3 className="font-semibold text-sm sm:text-base">
                        {activity.title}
                      </h3>
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${activity.badgeColor}`}
                      >
                        {activity.badge}
                      </span>
                    </div>

                    <p className="text-primary text-xs sm:text-sm font-mono mt-1">
                      {activity.time} · {activity.date}
                    </p>

                    {/* LOCATION – FIXED FOR MOBILE */}
                    <div className="flex items-start gap-2 mt-2 text-muted-foreground">
                      <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      <p className="text-xs sm:text-sm leading-relaxed break-words">
                        {activity.location}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-10">
              <h3 className="font-semibold">No Activities Found</h3>
              <p className="text-sm text-muted-foreground">
                Your attendance activity will appear here.
              </p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

