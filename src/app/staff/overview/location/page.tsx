'use client';

import DashboardLayout from "../dashboardlayout/page";
import { MapPin, Navigation, Building2, Clock, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const checkInLocations = [
  {
    id: "1",
    name: "TechCorp Solutions - HQ",
    address: "Tower A, Sector 62, Noida, Uttar Pradesh 201301",
    type: "Primary Office",
    lastCheckIn: "Today, 09:15 AM",
    distance: "0.2 km",
    isCurrentLocation: true,
  },
  {
    id: "2",
    name: "TechCorp Solutions - Branch",
    address: "DLF Cyber City, Gurugram, Haryana 122002",
    type: "Branch Office",
    lastCheckIn: "15 Nov 2025, 10:00 AM",
    distance: "45 km",
    isCurrentLocation: false,
  },
  {
    id: "3",
    name: "Client Site - ABC Corp",
    address: "Connaught Place, New Delhi 110001",
    type: "Client Location",
    lastCheckIn: "10 Oct 2025, 09:30 AM",
    distance: "28 km",
    isCurrentLocation: false,
  },
];

const recentCheckIns = [
  {
    id: "1",
    date: "11 Dec 2025",
    time: "09:15 AM",
    location: "TechCorp Solutions - HQ",
    address: "Tower A, Sector 62, Noida",
    type: "check-in",
    coordinates: "28.6129° N, 77.3725° E",
  },
  {
    id: "2",
    date: "10 Dec 2025",
    time: "06:34 PM",
    location: "TechCorp Solutions - HQ",
    address: "Tower A, Sector 62, Noida",
    type: "check-out",
    coordinates: "28.6129° N, 77.3725° E",
  },
  {
    id: "3",
    date: "10 Dec 2025",
    time: "09:00 AM",
    location: "TechCorp Solutions - HQ",
    address: "Tower A, Sector 62, Noida",
    type: "check-in",
    coordinates: "28.6129° N, 77.3725° E",
  },
  {
    id: "4",
    date: "09 Dec 2025",
    time: "06:03 PM",
    location: "TechCorp Solutions - HQ",
    address: "Tower A, Sector 62, Noida",
    type: "check-out",
    coordinates: "28.6129° N, 77.3725° E",
  },
];

export default function Location() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Location & Address</h1>
            <p className="text-muted-foreground">View check-in locations and attendance geography</p>
          </div>
          <Button>
            <Navigation className="h-4 w-4 mr-2" />
            Get Current Location
          </Button>
        </div>

        {/* Current Location Card */}
        <div className="dashboard-card bg-gradient-to-r from-primary/10 via-card to-card border-2 border-primary/20">
          <div className="flex items-start gap-4">
            <div className="h-14 w-14 rounded-2xl bg-primary/20 flex items-center justify-center">
              <MapPin className="h-7 w-7 text-primary" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-xl font-bold text-foreground">Current Check-in Location</h2>
                <span className="status-badge status-badge-present">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Active
                </span>
              </div>
              <p className="text-lg text-primary font-medium mb-1">TechCorp Solutions - HQ</p>
              <p className="text-muted-foreground mb-2">Tower A, Sector 62, Noida, Uttar Pradesh 201301</p>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  Checked in at 09:15 AM
                </span>
                <span className="flex items-center gap-1">
                  <Navigation className="h-4 w-4" />
                  28.6129° N, 77.3725° E
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Map Placeholder */}
        <div className="dashboard-card p-0 overflow-hidden">
          <div className="h-64 bg-gradient-to-br from-primary/5 via-muted to-primary/10 flex items-center justify-center relative">
            <div className="absolute inset-0 opacity-20">
              {/* Grid pattern */}
              <div className="w-full h-full" style={{
                backgroundImage: `
                  linear-gradient(to right, hsl(var(--border)) 1px, transparent 1px),
                  linear-gradient(to bottom, hsl(var(--border)) 1px, transparent 1px)
                `,
                backgroundSize: '40px 40px'
              }} />
            </div>
            <div className="relative z-10 text-center">
              <div className="h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-3 animate-pulse">
                <MapPin className="h-8 w-8 text-primary" />
              </div>
              <p className="text-muted-foreground">Interactive map view</p>
              <p className="text-sm text-muted-foreground">Connect Mapbox for live location tracking</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Registered Locations */}
          <div className="dashboard-card">
            <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <Building2 className="h-5 w-5 text-primary" />
              Registered Locations
            </h2>
            <div className="space-y-4">
              {checkInLocations.map((location, index) => (
                <div 
                  key={location.id} 
                  className={`p-4 rounded-xl border transition-colors animate-fade-in ${
                    location.isCurrentLocation 
                      ? 'border-primary/30 bg-primary/5' 
                      : 'border-border hover:bg-muted/30'
                  }`}
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-foreground">{location.name}</h3>
                      {location.isCurrentLocation && (
                        <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
                          Current
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground">{location.distance}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{location.address}</p>
                  <div className="flex items-center justify-between text-xs">
                    <span className="px-2 py-1 rounded bg-muted text-muted-foreground">{location.type}</span>
                    <span className="text-muted-foreground">Last: {location.lastCheckIn}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Check-in History */}
          <div className="dashboard-card">
            <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Recent Location History
            </h2>
            <div className="space-y-3">
              {recentCheckIns.map((checkIn, index) => (
                <div 
                  key={checkIn.id} 
                  className="flex items-start gap-4 p-3 rounded-xl hover:bg-muted/30 transition-colors animate-fade-in"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${
                    checkIn.type === 'check-in' ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'
                  }`}>
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-foreground capitalize">{checkIn.type.replace('-', ' ')}</span>
                      <span className="text-sm text-muted-foreground">{checkIn.date}</span>
                    </div>
                    <p className="text-sm text-primary font-medium">{checkIn.time}</p>
                    <p className="text-sm text-muted-foreground truncate">{checkIn.location}</p>
                    <p className="text-xs text-muted-foreground mt-1">{checkIn.coordinates}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}