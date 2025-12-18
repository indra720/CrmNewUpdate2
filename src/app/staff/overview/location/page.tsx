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
  type: string;
}

export default function Location() {
  const { toast } = useToast();
  const [mapUrl, setMapUrl] = useState("");
  const [isUrlDialogOpen, setIsUrlDialogOpen] = useState(false);
  
  const [isCurrentlyCheckedIn, setIsCurrentlyCheckedIn] = useState(false);
  const [locationData, setLocationData] = useState<LocationData | null>(null);
  const [recentCheckIns, setRecentCheckIns] = useState<RecentCheckIn[]>([]);
  
  const [isLocationLoading, setIsLocationLoading] = useState(true);
  const [isHistoryLoading, setIsHistoryLoading] = useState(true);

  // Fetches location details ONLY if the user is checked in
  const fetchLocationDetails = async (token: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/accounts/see-location/`, {
        headers: { Authorization: `Token ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        if (data && data.location_name) {
          setLocationData(data);
        }
      }
    } catch (error) {
      console.error("Failed to fetch location details:", error);
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
          if (todaysRecord && todaysRecord.check_in && !todaysRecord.check_out) {
            setIsCurrentlyCheckedIn(true);
            await fetchLocationDetails(token); // Fetch location details only if checked in
          } else {
            setIsCurrentlyCheckedIn(false);
            setLocationData(null); // Clear location data if not checked in
          }
          
          // Format and set history for display
          const formattedData: RecentCheckIn[] = historyData.results.map((item: any) => ({
            id: item.id.toString(),
            date: new Date(item.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }),
            time: item.check_in ? new Date(`2000-01-01T${item.check_in}`).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : 'N/A',
            location: item.location_name || 'Unknown Location',
            type: item.check_out ? 'check-out' : 'check-in',
          }));
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
      <div className="space-y-6 bg-card shadow-sm rounded-sm p-6">
        <div className="flex flex-col md:flex-row lg:flex-row items-center justify-between text-center">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Location & Address</h1>
            <p className="text-muted-foreground">View your current status and location history</p>
          </div>
          <Dialog open={isUrlDialogOpen} onOpenChange={setIsUrlDialogOpen}>
            <DialogTrigger asChild>
              {/* This button is now only for submitting a location URL and is disabled if already checked in */}
              <Button disabled={isCurrentlyCheckedIn}>
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
        <div className="dashboard-card bg-gradient-to-r from-primary/10 via-card to-card border-2 border-primary/20 p-6 rounded-lg shadow-md">
          <div className="flex flex-col md:flex-row items-start gap-4">
            <div className="h-14 w-14 rounded-2xl bg-primary/20 flex items-center justify-center mx-auto">
              <MapPin className="h-7 w-7 text-primary" />
            </div>
            <div className="flex-1">
              <div className="flex sm:flex-col md:flex-row items-center justify-between gap-2 mb-1">
                <h2 className="text-xl font-bold text-foreground">Current Status</h2>
                {isCurrentlyCheckedIn ? (
                  <span className="bg-green-100 p-1 rounded-md text-green-500 flex justify-center items-center ">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Checked In
                  </span>
                ) : (
                  <span className="bg-red-100 p-1 rounded-md text-red-500 flex justify-center items-center ">
                    <X className="h-3 w-3 mr-1" />
                    Checked Out
                  </span>
                )}
              </div>
              {isLocationLoading ? (
                <div className="space-y-2">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-5 w-full" />
                </div>
              ) : isCurrentlyCheckedIn && locationData ? (
                <>
                  <p className="text-lg text-primary font-medium mb-1">{locationData.location_name.split(',')[0]}</p>
                  <p className="text-muted-foreground mb-2 text-lg">{locationData.location_name}</p>
                  <div className="flex flex-col md:flex-row text-md items-center gap-4 text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="h-6 w-6 mr-1" />
                      Checked in at {formatTime(locationData.time)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Navigation className="h-4 w-4" />
                      {locationData.latitude.toFixed(4)}° N, {locationData.longitude.toFixed(4)}° E
                    </span>
                  </div>
                </>
              ) : (
                <p className="text-muted-foreground">You are currently checked out.</p>
              )}
            </div>
          </div>
        </div>

        {/* Recent History Card */}
        <div className="dashboard-card">
          <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            Recent Location History
          </h2>
          <div className="space-y-3">
            {isHistoryLoading ? (
              <div className="space-y-3">
                <Skeleton className="h-12 w-full" /> <Skeleton className="h-12 w-full" />
              </div>
            ) : recentCheckIns.length > 0 ? (
              recentCheckIns.map((checkIn) => (
                <div key={checkIn.id} className="flex items-start gap-4 p-3 rounded-xl bg-muted/70">
                  <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${checkIn.type === 'check-in' ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'}`}>
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0 ">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-foreground capitalize">{checkIn.type.replace('-', ' ')}</span>
                      <span className="text-sm text-muted-foreground">{checkIn.date}</span>
                    </div>
                    <p className="text-sm text-primary font-medium">{checkIn.time}</p>
                    <p className="text-sm text-muted-foreground truncate">{checkIn.location}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground text-center py-4">No recent history available.</p>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
