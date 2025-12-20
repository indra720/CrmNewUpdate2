'use client';
import { useState, useEffect } from "react";
import DashboardLayout from "../dashboardlayout/page";
import { MapPin, Navigation, Building2, Clock, CheckCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

interface LocationData {
  latitude: number;
  longitude: number;
  location_name: string;
  time: string;
}

interface RecentCheckIn {
  id: string;
  date: string;
  time: string;
  location: string;
  type: "check-in" | "check-out";
}

export default function Location() {
  const { toast } = useToast();
  const [mapUrl, setMapUrl] = useState("");
  const [isUrlDialogOpen, setIsUrlDialogOpen] = useState(false);

  const [isCurrentlyCheckedIn, setIsCurrentlyCheckedIn] = useState(false);
  const [locationData, setLocationData] = useState<LocationData | null>(null);
  const [recentCheckIns, setRecentCheckIns] = useState<RecentCheckIn[]>([]);
  const [isLocationSet, setIsLocationSet] = useState(false);

  const [isLocationLoading, setIsLocationLoading] = useState(true);
  const [isHistoryLoading, setIsHistoryLoading] = useState(true);

  // Fetches location details
  const fetchLocationDetails = async (token: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/accounts/see-location/`, {
        headers: { Authorization: `Token ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        if (data && data.location_name) {
          setLocationData(data);
          setIsLocationSet(true); // Location is set
        } else {
          setIsLocationSet(false); // No location is set
        }
      } else {
        setIsLocationSet(false);
      }
    } catch (error) {
      console.error("Failed to fetch location details:", error);
      setIsLocationSet(false);
    }
  };

  // Fetches the full history and determines the CURRENT check-in status
  const fetchInitialStatusAndHistory = async () => {
    setIsLocationLoading(true);
    setIsHistoryLoading(true);
    const token = localStorage.getItem("authToken");
    if (!token) {
      setIsLocationLoading(false);
      setIsHistoryLoading(false);
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/accounts/attendance/recent-history/`, {
        headers: { Authorization: `Token ${token}` },
      });

      if (response.ok) {
        const historyData = await response.json();
        if (historyData && Array.isArray(historyData.results)) {
          const today = new Date().toISOString().split("T")[0];
          const todaysRecord = historyData.results.find(rec => rec.date === today);

          // This is the key logic fix: determine status from the history API
          await fetchLocationDetails(token); // Always fetch permanent location

          if (todaysRecord && todaysRecord.check_in && !todaysRecord.check_out) {
            setIsCurrentlyCheckedIn(true);
          } else {
            setIsCurrentlyCheckedIn(false);
          }

          // Format and set history for display
          const formattedData: RecentCheckIn[] = historyData.results.map(
            (item: any, index: number) => ({
              id: `${item.date}-${index}`, // 🔥 backend me id nahi hai
              date: new Date(item.date).toLocaleDateString('en-GB', {
                day: '2-digit',
                month: 'short',
              }),
              time: item.check_in
                ? new Date(`2000-01-01T${item.check_in}`).toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit',
                })
                : 'N/A',
              location: item.location_name || 'Unknown Location',
              type: item.check_out ? 'check-out' : 'check-in',
            })
          );

          setRecentCheckIns(formattedData);
        }
      }
    } catch (error) {
      console.error("Failed to fetch initial status:", error);
    } finally {
      setIsLocationLoading(false);
      setIsHistoryLoading(false);
    }
  };

  useEffect(() => {
    fetchInitialStatusAndHistory();

    // Re-fetch data when the window gains focus to ensure data is fresh
    window.addEventListener('focus', fetchInitialStatusAndHistory);

    // Cleanup listener on component unmount
    return () => {
      window.removeEventListener('focus', fetchInitialStatusAndHistory);
    };
  }, []);

  // This handler ONLY saves the location URL. It does not perform check-in.
  const handleSaveLocationUrl = async () => {
    if (!mapUrl) {
      toast({ title: "Error", description: "Please enter a map URL.", variant: "destructive" });
      return;
    }

    const token = localStorage.getItem("authToken");
    if (!token) {
      toast({ title: "Error", description: "Authentication token not found.", variant: "destructive" });
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/accounts/get-location/`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Token ${token}` },
        body: JSON.stringify({ map_link: mapUrl }),
      });

      if (!response.ok) {
        let errorDetail = "Failed to save location.";
        try {
          // Try to get a more specific error message from the server's response
          const errorData = await response.json();
          errorDetail = errorData.detail || errorData.error || JSON.stringify(errorData);
        } catch (jsonError) {
          // If the response isn't JSON, use the status text
          errorDetail = response.statusText;
        }
        throw new Error(errorDetail);
      }

      toast({ title: "Success", description: "Location URL submitted successfully!" });
      setIsUrlDialogOpen(false);
      setMapUrl("");
      fetchInitialStatusAndHistory(); // Re-fetch to update button state and UI

    } catch (error: any) {
      console.error("Failed to save location URL:", error);
      toast({
        title: "Error Saving Location",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const formatTime = (isoString: string) => {
    if (!isoString) return 'N/A';
    return new Date(isoString).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  return (
    <DashboardLayout>
      <div className="space-y-4 sm:space-y-6 bg-card shadow-sm rounded-sm p-4 sm:p-6"> {/* Reduced padding and space-y on mobile */}
        <div className="flex flex-col md:flex-row lg:flex-row items-center justify-between text-center">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-foreground">Location & Address</h1> {/* Smaller title on mobile */}
            <p className="text-sm sm:text-base text-muted-foreground">View your current status and location history</p> {/* Smaller subtitle on mobile */}
          </div>
          <Dialog open={isUrlDialogOpen} onOpenChange={setIsUrlDialogOpen}>
            <DialogTrigger asChild>
              {/* This button is now only for submitting a location URL and is disabled if already checked in */}
              <Button disabled={isLocationSet} className="mt-2 md:mt-0 w-full md:w-auto"> {/* Full width on mobile */}
                <Navigation className="h-4 w-4 mr-2" />
                Submit Location URL
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Submit Location URL</DialogTitle>
                <DialogDescription>
                  Provide the map URL for your location before checking in.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="map-url" className="text-right">Link URL</Label>
                  <Input
                    id="map-url"
                    value={mapUrl}
                    onChange={(e) => setMapUrl(e.target.value)}
                    className="col-span-3"
                    placeholder="https://maps.google.com/..."
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" onClick={handleSaveLocationUrl}>Save URL</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Current Status Card */}
        <div className="dashboard-card bg-gradient-to-r from-primary/10 via-card to-card border-2 border-primary/20 p-4 sm:p-6 rounded-lg shadow-md"> {/* Reduced padding on mobile */}
          <div className="flex flex-col sm:flex-row sm:items-start gap-4"> {/* Row on sm+, col on mobile but with adjustments below */}
            <div className="h-12 sm:h-14 w-12 sm:w-14 rounded-2xl bg-primary/20 flex items-center justify-center flex-shrink-0"> {/* Icon always left-ish, no mx-auto */}
              <MapPin className="h-6 sm:h-7 w-6 sm:w-7 text-primary" />
            </div>
            <div className="flex-1 w-full"> {/* Full width for content */}
              <div className="flex items-center justify-between gap-2 mb-1"> {/* Always row for title and badge, justified between for right-side badge on mobile */}
                <h2 className="text-lg sm:text-xl font-bold text-foreground flex-1">Current Status</h2> {/* flex-1 to push badge to right */}
                {isLocationSet ? (
                  <span className="bg-green-100 p-1 rounded-md text-green-500 flex justify-center items-center min-w-fit whitespace-nowrap text-sm">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Active
                  </span>
                ) : (
                  <span className="bg-red-100 p-1 rounded-md text-red-500 flex justify-center items-center min-w-fit whitespace-nowrap text-sm">
                    <X className="h-3 w-3 mr-1" />
                    Inactive
                  </span>
                )}
              </div>
              {isLocationLoading ? (
                <div className="space-y-2">
                  <Skeleton className="h-5 sm:h-6 w-3/4" />
                  <Skeleton className="h-4 sm:h-5 w-full" />
                </div>
              ) : locationData ? (
                <div className="space-y-2 text-center sm:text-left"> {/* Center on mobile, left on sm+; added space-y for better vertical flow */}
                  <p className="text-base sm:text-lg text-primary font-medium mb-1 break-words">{locationData.location_name.split(',')[0]}</p> {/* Added break-words to force wrapping if needed */}
                  <p className="text-sm sm:text-lg text-muted-foreground mb-2 break-all">{locationData.location_name}</p> {/* Changed to break-all for long URLs/locations; smaller on mobile */}
                  <div className="flex flex-col sm:flex-row text-sm sm:text-md items-center gap-3 sm:gap-4 text-muted-foreground"> {/* Col on mobile for better stacking */}
                    <span className="flex items-center gap-1 justify-center sm:justify-start">
                      <Clock className="h-5 sm:h-6 w-5 sm:w-6 mr-1" />
                      Checked in at {formatTime(locationData.time)}
                    </span>
                    <span className="flex items-center gap-1 justify-center sm:justify-start">
                      <Navigation className="h-4 w-4" />
                      {locationData.latitude.toFixed(4)}° N, {locationData.longitude.toFixed(4)}° E
                    </span>
                  </div>
                </div>
              ) : (
                <p className="text-sm sm:text-base text-muted-foreground">You have not set a permanent location yet.</p> 
              )}
            </div>
          </div>
        </div>

        {/* Recent History Card */}
        <div className="dashboard-card p-4 sm:p-6"> {/* Reduced padding on mobile */}
          <h2 className="text-base sm:text-lg font-semibold text-foreground mb-4 flex items-center gap-2"> {/* Smaller on mobile */}
            <Clock className="h-4 sm:h-5 w-4 sm:h-5 text-primary" />
            Recent Location History
          </h2>
          <div className="space-y-3">
            {isHistoryLoading ? (
              <div className="space-y-3">
                <Skeleton className="h-10 sm:h-12 w-full" /> <Skeleton className="h-10 sm:h-12 w-full" />
              </div>
            ) : recentCheckIns.length > 0 ? (
              recentCheckIns.map((checkIn) => (
                <div key={checkIn.id} className="flex items-start gap-3 sm:gap-4 p-3 rounded-xl bg-muted/70"> {/* Row on all, but content adjusts */}
                  <div className={`h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0 ${checkIn.type === 'check-in' ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'}`}>
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0"> {/* No w-full needed now */}
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-1"> {/* Row with wrap for type/date/time on one line, justified between */}
                      <span className="font-medium text-foreground capitalize text-sm order-1">{checkIn.type.replace('-', ' ')}</span>
                      <span className="text-xs sm:text-sm text-muted-foreground order-3 sm:order-2">{checkIn.date}</span>
                      <p className="text-base sm:text-sm text-primary font-medium order-2 sm:order-3">{checkIn.time}</p> {/* Time as p but in row */}
                    </div>
                    <p className="text-xs sm:text-sm text-muted-foreground break-words flex items-center gap-1"> {/* Location with icon inline */}
                      <MapPin className="h-3 w-3 flex-shrink-0" />
                      {checkIn.location}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm sm:text-base text-muted-foreground text-center py-4">No recent history available.</p> 
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}