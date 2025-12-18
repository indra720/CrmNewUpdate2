// 'use client';

// import { useEffect, useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Clock, LogOut, MapPin } from "lucide-react";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { useToast } from "@/hooks/use-toast";
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";

// interface EmployeeCardProps {
//   employeeId: string;
//   name: string;
//   jobTitle: string;
//   avatarUrl?: string;
//   initialIsCheckedIn: boolean;
//   initialCheckInTime?: Date;
//   checkInLocation?: string;
// }

// export function EmployeeCard({
//   employeeId,
//   name,
//   jobTitle,
//   avatarUrl,
//   initialIsCheckedIn,
//   initialCheckInTime,
//   checkInLocation,
// }: EmployeeCardProps) {
//   const { toast } = useToast();
//   const [isCheckedIn, setIsCheckedIn] = useState(initialIsCheckedIn);
//   const [checkInTime, setCheckInTime] = useState<Date | undefined>(initialCheckInTime);
//   const [checkOutTime, setCheckOutTime] = useState<Date | null>(null);
//   const [isCheckoutModalOpen, setCheckoutModalOpen] = useState(false);
//   const [checkoutFormData, setCheckoutFormData] = useState({
//     projectName: "",
//     workDescription: "",
//     taskTime: "",
//     workProgress: "",
//   });
//   const [elapsedTime, setElapsedTime] = useState("00:00:00");

//   const handleCheckIn = async () => {
//     const token = localStorage.getItem('authToken');
//     if (!token) {
//       toast({ title: "Error", description: "Authentication token not found.", variant: "destructive" });
//       return;
//     }

//     try {
//       const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/accounts/checkin/`, {
//         method: "POST",
//         headers: {
//           "Authorization": `Token ${token}`,
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({}),
//       });

//       if (response.ok) {
//         const now = new Date();
//         setIsCheckedIn(true);
//         setCheckInTime(now);
//         toast({
//           title: "Checked In",
//           description: "checkin successful",
//           className: 'bg-green-500 text-white'
//         });
//       } else {
//         const errorData = await response.json();
//         toast({
//           title: "Check In Failed",
//           description: errorData.detail || "Failed to check in.",
//           variant: "destructive",
//         });
//       }
//     } catch (error) {
//       console.error("Error during check-in:", error);
//       toast({
//         title: "Error",
//         description: "An error occurred during check-in. Please try again.",
//         variant: "destructive",
//       });
//     }
//   };

//   const handleCheckOut = () => {
//     if (!checkInTime) {
//       toast({
//         title: "Error",
//         description: "You must check in before you can check out.",
//         variant: "destructive",
//       });
//       return;
//     }
//     setCheckoutModalOpen(true);
//   };
  
//   const handleCheckoutFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     const { name, value } = e.target;
//     setCheckoutFormData({ ...checkoutFormData, [name]: value });
//   };

//   const handleCheckoutSubmit = async () => {
//     const token = localStorage.getItem('authToken');
//     if (!token) {
//       toast({ title: "Error", description: "Authentication token not found.", variant: "destructive" });
//       return;
//     }

//     const now = new Date();
//     const data = new FormData();
//     data.append('project', checkoutFormData.projectName);
//     data.append('work', checkoutFormData.workDescription);
//     data.append('time_taken', checkoutFormData.taskTime);
//     data.append('progress', checkoutFormData.workProgress);

//     try {
//       const response = await fetch(`http://127.0.0.1:8000/accounts/checkout/`, {
//         method: "POST",
//         headers: {
//           "Authorization": `Token ${token}`,
//         },
//         body: data,
//       });

//       if (response.ok) {
//         setCheckOutTime(now);
//         setIsCheckedIn(false);
//         toast({
//           title: "Checked Out!",
//           description: "Your work has been logged successfully.",
//           className: 'bg-green-500 text-white'
//         });
        
//         setCheckoutModalOpen(false);
//         setCheckoutFormData({
//           projectName: "",
//           workDescription: "",
//           taskTime: "",
//           workProgress: "",
//         });

//       } else {
//         const errorData = await response.json();
//         toast({
//           title: "Check Out Failed",
//           description: errorData.detail || "Failed to log your work.",
//           variant: "destructive",
//         });
//       }
//     } catch (error) {
//       console.error("Error during check-out:", error);
//       toast({
//         title: "Error",
//         description: "An error occurred during check-out. Please try again.",
//         variant: "destructive",
//       });
//     }
//   };

//   useEffect(() => {
//     if (!isCheckedIn || !checkInTime) return;

//     const updateTimer = () => {
//       const now = new Date();
//       const diff = now.getTime() - (checkInTime as Date).getTime();
//       const hours = Math.floor(diff / (1000 * 60 * 60));
//       const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
//       const seconds = Math.floor((diff % (1000 * 60)) / 1000);

//       setElapsedTime(
//         `${hours.toString().padStart(2, "0")}:${minutes
//           .toString()
//           .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
//       );
//     };

//     updateTimer();
//     const interval = setInterval(updateTimer, 1000);
//     return () => clearInterval(interval);
//   }, [isCheckedIn, checkInTime]);

//   const initials = name
//     .split(" ")
//     .map((n) => n[0])
//     .join("")
//     .toUpperCase();

//   return (
//     <div className="dashboard-card bg-gradient-to-br from-card via-card to-primary/5 border border-border/50 rounded-2xl shadow-xl">
//       <div className="flex flex-col md:flex-row items-center gap-6 p-5">
//         {/* Avatar */}
//         <div className="relative">
//           <Avatar className="h-28 w-28 ring-4 ring-primary/20 shadow-lg">
//             <AvatarImage src={avatarUrl} alt={name} />
//             <AvatarFallback className="text-2xl font-bold bg-gradient-to-br from-primary to-primary/70 text-primary-foreground">
//               {initials}
//             </AvatarFallback>
//           </Avatar>
//           <div
//             className={`absolute -bottom-1 -right-1 h-6 w-6 rounded-full border-4 border-card ${
//               isCheckedIn ? "bg-green-300 animate-pulse" : "bg-destructive"
//             }`}
//           />
//         </div>

//         {/* Info */}
//         <div className="flex flex-1 flex-col items-center md:items-start">
//           <div className="flex flex-col md:flex-row md:items-center gap-2 mb-2">
//             <span className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-semibold">
//               {employeeId}
//             </span>
//             <h2 className="text-2xl font-bold text-foreground">{name}</h2>
//           </div>

//           <p className="text-muted-foreground font-medium mb-3">{jobTitle}</p>

//           <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3">
//             <span
//               className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors ${
//                 isCheckedIn
//                   ? "bg-green-100 text-green-800 animate-pulse"
//                   : "bg-red-100 text-red-800"
//               }`}
//             >
//               <span
//                 className={`h-2 w-2 rounded-full mr-2 ${
//                   isCheckedIn ? "bg-green-500" : "bg-destructive"
//                 }`}
//               />
//               {isCheckedIn ? "Checked In" : "Checked Out"}
//             </span>

//             {isCheckedIn && checkInTime && (
//               <span className="text-sm text-muted-foreground flex items-center gap-1">
//                 <Clock className="h-4 w-4" />
//                 Since{" "}
//                 {(checkInTime as Date).toLocaleTimeString([], {
//                   hour: "2-digit",
//                   minute: "2-digit",
//                 })}
//               </span>
//             )}
//           </div>

//           {/* Location */}
//           {isCheckedIn && checkInLocation && (
//             <div className="mt-3 flex items-start justify-center lg:justify-start gap-2 text-sm text-muted-foreground">
//               <MapPin className="h-4 w-4 mt-0.5 text-primary flex-shrink-0" />
//               <span className="line-clamp-1">{checkInLocation}</span>
//             </div>
//           )}
//         </div>

//         {/* Timer & Actions */}
//         <div className="flex flex-col items-center gap-4 p-4 rounded-2xl bg-muted/50">
//           <div className="text-center">
//             <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
//               Working Hours
//             </p>
//             <div className="timer-display text-primary text-lg font-bold">
//               {elapsedTime}
//             </div>
//           </div>

//           <div className="flex items-center gap-2">
//             {!isCheckedIn ? (
//               <Button onClick={handleCheckIn} size="lg" className="bg-green-500 text-white hover:bg-green-600 shadow-lg">
//                 Check-In
//               </Button>
//             ) : (
//               <Button onClick={handleCheckOut} variant="destructive" size="lg" className="shadow-lg">
//                 <LogOut className="mr-2 h-4 w-4" />
//                 Check-Out
//               </Button>
//             )}
//             <Button variant="outline" size="icon" className="shadow-md">
//               <Clock className="h-5 w-5" />
//             </Button>
//           </div>
//         </div>
//       </div>
//       <Dialog open={isCheckoutModalOpen} onOpenChange={setCheckoutModalOpen}>
//         <DialogContent className="sm:max-w-[425px]">
//           <DialogHeader>
//             <DialogTitle>Log Your Work & Check Out</DialogTitle>
//             <DialogDescription>
//               Fill out the details of your work session before checking out.
//             </DialogDescription>
//           </DialogHeader>
//           <div className="grid gap-4 py-4">
//             <div className="grid grid-cols-4 items-center gap-4">
//               <Label htmlFor="projectName" className="text-right">
//                 Project
//               </Label>
//               <Input
//                 id="projectName"
//                 name="projectName"
//                 value={checkoutFormData.projectName}
//                 onChange={handleCheckoutFormChange}
//                 className="col-span-3"
//                 placeholder="Enter project name"
//               />
//             </div>
//             <div className="grid grid-cols-4 items-center gap-4">
//               <Label htmlFor="workDescription" className="text-right">
//                 Work
//               </Label>
//               <Textarea
//                 id="workDescription"
//                 name="workDescription"
//                 value={checkoutFormData.workDescription}
//                 onChange={handleCheckoutFormChange}
//                 className="col-span-3"
//                 placeholder="Describe what you did."
//               />
//             </div>
//             <div className="grid grid-cols-4 items-center gap-4">
//               <Label htmlFor="taskTime" className="text-right">
//                 Time Taken
//               </Label>
//               <Input
//                 id="taskTime"
//                 name="taskTime"
//                 value={checkoutFormData.taskTime}
//                 onChange={handleCheckoutFormChange}
//                 className="col-span-3"
//                 placeholder="e.g., 2 hours"
//               />
//             </div>
//             <div className="grid grid-cols-4 items-center gap-4">
//               <Label htmlFor="workProgress" className="text-right">
//                 Progress
//               </Label>
//               <Textarea
//                 id="workProgress"
//                 name="workProgress"
//                 value={checkoutFormData.workProgress}
//                 onChange={handleCheckoutFormChange}
//                 className="col-span-3"
//                 placeholder="Describe the progress made."
//               />
//             </div>

//           </div>
//           <DialogFooter>
//             <Button variant="outline" onClick={() => setCheckoutModalOpen(false)}>Cancel</Button>
//             <Button onClick={handleCheckoutSubmit} className="bg-red-500 text-white hover:bg-red-600">Check Out</Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// }






















// // def check_in(request):
// //     user = request.user
// //     today = date.today()

// //     user_lat = request.data.get("latitude")
// //     user_lng = request.data.get("longitude")

// //     if not user_lat or not user_lng:
// //         return Response(
// //             {"error": "Latitude and longitude are required"},
// //             status=status.HTTP_400_BAD_REQUEST
// //         )

// //     try:
// //         allowed = user.allowedlocation
// //     except AllowedLocation.DoesNotExist:
// //         return Response(
// //             {"error": "No office location assigned by admin"},
// //             status=status.HTTP_403_FORBIDDEN
// //         )

// //     distance = calculate_distance(
// //         float(user_lat),
// //         float(user_lng),
// //         allowed.latitude,
// //         allowed.longitude
// //     )

// //     if distance > allowed.radius_meters:
// //         return Response(
// //             {
// //                 "error": "You are outside the allowed check-in zone",
// //                 "distance_meters": round(distance, 2),
// //                 "allowed_radius": allowed.radius_meters
// //             },
// //             status=status.HTTP_403_FORBIDDEN
// //         )

// //     ist_now = timezone.localtime(timezone.now())

// //     attendance, created = Attendance.objects.get_or_create(
// //         user=user,
// //         date=today,
// //         defaults={'check_in': ist_now.time(), 'status': 'Checked In'}
// //     )

// //     if not created and attendance.check_in:
// //         return Response(
// //             {"error": "Already checked in today"},
// //             status=status.HTTP_409_CONFLICT
// //         )

// //     attendance.check_in = ist_now.time()
// //     attendance.status = 'Checked In'
// //     attendance.save()

// //     return Response({
// //         "message": "Checked in successfully",
// //         "check_in": ist_now.strftime("%H:%M:%S"),
// //         "distance_meters": round(distance, 2)
// //     })
















// // {
// //     "latitude": 26.8983452,
// //     "longitude": 75.7530016,
// //     "location_name": "Vidyut Nagar, Shyam Nagar, Jaipur, Jaipur Municipal Corporation, Jaipur Tehsil, Jaipur, Rajasthan, 302001, India",
// //     "time": "2025-12-17T10:08:48.068155Z"
// // }























'use client';

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Clock, LogOut, MapPin } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface EmployeeCardProps {
  employeeId: string;
  name: string;
  jobTitle: string;
  avatarUrl?: string;
  initialIsCheckedIn: boolean;
  initialCheckInTime?: Date;
  checkInLocation?: string;
}

interface LocationData {
  latitude: number;
  longitude: number;
  location_name: string;
  time: string;
}

export function EmployeeCard({
  employeeId,
  name,
  jobTitle,
  avatarUrl,
  initialIsCheckedIn,
  initialCheckInTime,
  checkInLocation: initialCheckInLocation,
}: EmployeeCardProps) {
  const { toast } = useToast();
  const [isCheckedIn, setIsCheckedIn] = useState(initialIsCheckedIn);
  const [checkInTime, setCheckInTime] = useState<Date | undefined>(initialCheckInTime);
  const [currentCheckInLocation, setCurrentCheckInLocation] = useState(initialCheckInLocation || '');
  const [checkOutTime, setCheckOutTime] = useState<Date | null>(null);
  const [isCheckoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [checkoutFormData, setCheckoutFormData] = useState({
    projectName: "",
    workDescription: "",
    taskTime: "",
    workProgress: "",
  });
  const [elapsedTime, setElapsedTime] = useState("00:00:00");

  const fetchLocationData = async (): Promise<LocationData | null> => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      return null;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/accounts/see-location/`, {
        method: "GET",
        headers: {
          "Authorization": `Token ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data && data.latitude && data.longitude && data.location_name) {
          return data;
        }
      }
      return null;
    } catch (error) {
      console.error("Error fetching location data:", error);
      return null;
    }
  };

  // const handleCheckIn = async () => {
  //   const token = localStorage.getItem('authToken');
  //   if (!token) {
  //     toast({ title: "Error", description: "Authentication token not found.", variant: "destructive" });
  //     return;
  //   }

  //   // Fetch location data first
  //   const locationData = await fetchLocationData();
  //   if (!locationData) {
  //     toast({
  //       title: "Error",
  //       description: "No location data available. Please submit your location first.",
  //       variant: "destructive",
  //     });
  //     return;
  //   }

  //   try {
  //     const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/accounts/checkin/`, {
  //       method: "POST",
  //       headers: {
  //         "Authorization": `Token ${token}`,
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         latitude: locationData.latitude,
  //         longitude: locationData.longitude,
  //       }),
  //     });

  //     if (response.ok) {
  //       const now = new Date();
  //       setIsCheckedIn(true);
  //       setCheckInTime(now);
  //       setCurrentCheckInLocation(locationData.location_name);
  //       toast({
  //         title: "Checked In",
  //         description: "Check-in successful",
  //         className: 'bg-green-500 text-white'
  //       });
  //     } else {
  //       const errorData = await response.json();
  //       if (errorData.error === "You are outside the allowed check-in zone") {
  //         toast({
  //           title: "Check In Failed",
  //           description: `You are outside the allowed check-in zone. Distance: ${errorData.distance_meters} meters (Allowed: ${errorData.allowed_radius} meters).`,
  //           variant: "destructive",
  //         });
  //       } else {
  //         toast({
  //           title: "Check In Failed",
  //           description: errorData.error || errorData.detail || "Failed to check in.",
  //           variant: "destructive",
  //         });
  //       }
  //     }
  //   } catch (error) {
  //     console.error("Error during check-in:", error);
  //     toast({
  //       title: "Error",
  //       description: "An error occurred during check-in. Please try again.",
  //       variant: "destructive",
  //     });
  //   }
  // };


  const handleCheckIn = async () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      toast({ title: "Error", description: "Authentication token not found.", variant: "destructive" });
      return;
    }

    // Fetch location data first
    const locationData = await fetchLocationData();
    if (!locationData) {
      toast({
        title: "Error",
        description: "No location data available. Please submit your location first in the Location page.",
        variant: "destructive",
      });
      return;
    }

    console.log("Checking in with:", {
      latitude: locationData.latitude,
      longitude: locationData.longitude,
      location_name: locationData.location_name
    });

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/accounts/checkin/`, {
        method: "POST",
        headers: {
          "Authorization": `Token ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          latitude: locationData.latitude,
          longitude: locationData.longitude,
        }),
      });

      if (response.ok) {
        const now = new Date();
        setIsCheckedIn(true);
        setCheckInTime(now);
        setCurrentCheckInLocation(locationData.location_name);
        toast({
          title: "Checked In",
          description: "Check-in successful",
          className: 'bg-green-500 text-white'
        });
      } else {
        const errorData = await response.json();
        console.error("Check-in error:", errorData);
        
        if (response.status === 403) {
          if (errorData.error === "No office location assigned by admin") {
            toast({
              title: "Check In Failed",
              description: "No office location has been assigned by your admin. Please contact your administrator.",
              variant: "destructive",
            });
          } else if (errorData.error === "You are outside the allowed check-in zone") {
            toast({
              title: "Check In Failed",
              description: `You are outside the allowed check-in zone. Distance: ${errorData.distance_meters}m (Allowed: ${errorData.allowed_radius}m)`,
              variant: "destructive",
            });
          } else {
            toast({
              title: "Check In Failed",
              description: errorData.error || "You don't have permission to check in.",
              variant: "destructive",
            });
          }
        } else if (response.status === 409) {
          toast({
            title: "Already Checked In",
            description: "You have already checked in today.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Check In Failed",
            description: errorData.error || errorData.detail || "Failed to check in.",
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      console.error("Error during check-in:", error);
      toast({
        title: "Error",
        description: "An error occurred during check-in. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleCheckOut = () => {
    if (!checkInTime) {
      toast({
        title: "Error",
        description: "You must check in before you can check out.",
        variant: "destructive",
      });
      return;
    }
    setCheckoutModalOpen(true);
  };
  
  const handleCheckoutFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCheckoutFormData({ ...checkoutFormData, [name]: value });
  };

  const handleCheckoutSubmit = async () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      toast({ title: "Error", description: "Authentication token not found.", variant: "destructive" });
      return;
    }

    const now = new Date();
    const data = new FormData();
    data.append('project', checkoutFormData.projectName);
    data.append('work', checkoutFormData.workDescription);
    data.append('time_taken', checkoutFormData.taskTime);
    data.append('progress', checkoutFormData.workProgress);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/accounts/checkout/`, {
        method: "POST",
        headers: {
          "Authorization": `Token ${token}`,
        },
        body: data,
      });

      if (response.ok) {
        setCheckOutTime(now);
        setIsCheckedIn(false);
        setCurrentCheckInLocation('');
        toast({
          title: "Checked Out!",
          description: "Your work has been logged successfully.",
          className: 'bg-green-500 text-white'
        });
        
        setCheckoutModalOpen(false);
        setCheckoutFormData({
          projectName: "",
          workDescription: "",
          taskTime: "",
          workProgress: "",
        });

      } else {
        const errorData = await response.json();
        toast({
          title: "Check Out Failed",
          description: errorData.detail || "Failed to log your work.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error during check-out:", error);
      toast({
        title: "Error",
        description: "An error occurred during check-out. Please try again.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (!isCheckedIn || !checkInTime) return;

    const updateTimer = () => {
      const now = new Date();
      const diff = now.getTime() - (checkInTime as Date).getTime();
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setElapsedTime(
        `${hours.toString().padStart(2, "0")}:${minutes
          .toString()
          .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
      );
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [isCheckedIn, checkInTime]);

  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <div className="dashboard-card bg-gradient-to-br from-card via-card to-primary/5 border border-border/50 rounded-2xl shadow-xl">
      <div className="flex flex-col md:flex-row items-center gap-6 p-5">
        {/* Avatar */}
        <div className="relative">
          <Avatar className="h-28 w-28 ring-4 ring-primary/20 shadow-lg">
            <AvatarImage src={avatarUrl} alt={name} />
            <AvatarFallback className="text-2xl font-bold bg-gradient-to-br from-primary to-primary/70 text-primary-foreground">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div
            className={`absolute -bottom-1 -right-1 h-6 w-6 rounded-full border-4 border-card ${
              isCheckedIn ? "bg-green-300 animate-pulse" : "bg-destructive"
            }`}
          />
        </div>

        {/* Info */}
        <div className="flex flex-1 flex-col items-center md:items-start">
          <div className="flex flex-col md:flex-row md:items-center gap-2 mb-2">
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-semibold">
              {employeeId}
            </span>
            <h2 className="text-2xl font-bold text-foreground">{name}</h2>
          </div>

          <p className="text-muted-foreground font-medium mb-3">{jobTitle}</p>

          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3">
            <span
              className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors ${
                isCheckedIn
                  ? "bg-green-100 text-green-800 animate-pulse"
                  : "bg-red-100 text-red-800"
              }`}
            >
              <span
                className={`h-2 w-2 rounded-full mr-2 ${
                  isCheckedIn ? "bg-green-500" : "bg-destructive"
                }`}
              />
              {isCheckedIn ? "Checked In" : "Checked Out"}
            </span>

            {isCheckedIn && checkInTime && (
              <span className="text-sm text-muted-foreground flex items-center gap-1">
                <Clock className="h-4 w-4" />
                Since{" "}
                {(checkInTime as Date).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            )}
          </div>

          {/* Location */}
          {isCheckedIn && currentCheckInLocation && (
            <div className="mt-3 flex items-start justify-center lg:justify-start gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 mt-0.5 text-primary flex-shrink-0" />
              <span className="line-clamp-1">{currentCheckInLocation}</span>
            </div>
          )}
        </div>

        {/* Timer & Actions */}
        <div className="flex flex-col items-center gap-4 p-4 rounded-2xl bg-muted/50">
          <div className="text-center">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
              Working Hours
            </p>
            <div className="timer-display text-primary text-lg font-bold">
              {elapsedTime}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!isCheckedIn ? (
              <Button onClick={handleCheckIn} size="lg" className="bg-green-500 text-white hover:bg-green-600 shadow-lg">
                Check-In
              </Button>
            ) : (
              <Button onClick={handleCheckOut} variant="destructive" size="lg" className="shadow-lg">
                <LogOut className="mr-2 h-4 w-4" />
                Check-Out
              </Button>
            )}
            <Button variant="outline" size="icon" className="shadow-md">
              <Clock className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
      <Dialog open={isCheckoutModalOpen} onOpenChange={setCheckoutModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Log Your Work & Check Out</DialogTitle>
            <DialogDescription>
              Fill out the details of your work session before checking out.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="projectName" className="text-right">
                Project
              </Label>
              <Input
                id="projectName"
                name="projectName"
                value={checkoutFormData.projectName}
                onChange={handleCheckoutFormChange}
                className="col-span-3"
                placeholder="Enter project name"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="workDescription" className="text-right">
                Work
              </Label>
              <Textarea
                id="workDescription"
                name="workDescription"
                value={checkoutFormData.workDescription}
                onChange={handleCheckoutFormChange}
                className="col-span-3"
                placeholder="Describe what you did."
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="taskTime" className="text-right">
                Time Taken
              </Label>
              <Input
                id="taskTime"
                name="taskTime"
                value={checkoutFormData.taskTime}
                onChange={handleCheckoutFormChange}
                className="col-span-3"
                placeholder="e.g., 2 hours"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="workProgress" className="text-right">
                Progress
              </Label>
              <Textarea
                id="workProgress"
                name="workProgress"
                value={checkoutFormData.workProgress}
                onChange={handleCheckoutFormChange}
                className="col-span-3"
                placeholder="Describe the progress made."
              />
            </div>

          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCheckoutModalOpen(false)}>Cancel</Button>
            <Button onClick={handleCheckoutSubmit} className="bg-red-500 text-white hover:bg-red-600">Check Out</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}