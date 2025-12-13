'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function LinkedinMarketingPage() {

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">LinkedIn Marketing</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>LinkedIn Campaigns</CardTitle>
          <CardDescription>Manage your LinkedIn marketing campaigns here.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>LinkedIn marketing content will go here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
