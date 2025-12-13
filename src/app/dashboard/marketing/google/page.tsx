'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function GoogleMarketingPage() {

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Google Marketing</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Google Ads Campaigns</CardTitle>
          <CardDescription>Manage your Google Ads campaigns here.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Google marketing content will go here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
