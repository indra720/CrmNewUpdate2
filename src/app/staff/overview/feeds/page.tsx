'use client';

import DashboardLayout from "../dashboardlayout/page";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Bell,
  PartyPopper,
  Award,
  Calendar,
  MessageSquare,
  Heart,
  Share2,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const feeds = [
  {
    id: "1",
    type: "announcement",
    author: "HR Team",
    avatar: "",
    title: "Holiday Schedule Update",
    content:
      "Please note that the office will remain closed on 25th December for Christmas. Wishing everyone a joyful holiday season!",
    time: "2 hours ago",
    icon: Bell,
    likes: 24,
    comments: 8,
  },
  {
    id: "2",
    type: "birthday",
    author: "TechCorp Team",
    avatar: "",
    title: "🎂 Birthday Celebration",
    content:
      "Join us in wishing Priya Sharma a very Happy Birthday! May your day be filled with joy and happiness.",
    time: "5 hours ago",
    icon: PartyPopper,
    likes: 45,
    comments: 12,
  },
  {
    id: "3",
    type: "achievement",
    author: "Management",
    avatar: "",
    title: "Employee of the Month",
    content:
      "Congratulations to Rahul Kumar for being recognized as the Employee of the Month for November 2025! Great work on the client deliverables.",
    time: "1 day ago",
    icon: Award,
    likes: 67,
    comments: 23,
  },
  {
    id: "4",
    type: "event",
    author: "Events Committee",
    avatar: "",
    title: "Annual Tech Conference 2025",
    content:
      "We're excited to announce our Annual Tech Conference on December 20th. Register now to participate in exciting sessions and workshops!",
    time: "2 days ago",
    icon: Calendar,
    likes: 89,
    comments: 34,
  },
];

export default function FeedsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6 bg-card shadow-sm rounded-lg p-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Company Feeds
          </h1>
          <p className="text-muted-foreground">
            Stay updated with company announcements and events
          </p>
        </div>

        {/* Feeds List */}
        <div className="space-y-4">
          {feeds.map((feed, index) => {
            const Icon = feed.icon;

            return (
              <div
                key={feed.id}
                className="dashboard-card animate-fade-in"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                    <Icon className="h-6 w-6" />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-foreground">
                          {feed.author}
                        </span>
                        <span className="text-sm text-muted-foreground">•</span>
                        <span className="text-sm text-muted-foreground">
                          {feed.time}
                        </span>
                      </div>
                    </div>

                    <h3 className="font-semibold text-lg text-foreground mb-2">
                      {feed.title}
                    </h3>

                    <p className="text-muted-foreground mb-4">
                      {feed.content}
                    </p>

                    <div className="flex items-center gap-4 pt-3 border-t border-border">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <Heart className="h-4 w-4 mr-2" />
                        {feed.likes}
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-muted-foreground hover:text-primary"
                      >
                        <MessageSquare className="h-4 w-4 mr-2" />
                        {feed.comments}
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-muted-foreground hover:text-primary"
                      >
                        <Share2 className="h-4 w-4 mr-2" />
                        Share
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
}
