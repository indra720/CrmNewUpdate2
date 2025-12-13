'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function WhatsappMarketingPage() {

  return (
    <div>
       <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">WhatsApp Marketing</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>WhatsApp Campaigns</CardTitle>
          <CardDescription>Manage your WhatsApp marketing campaigns here.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>WhatsApp marketing content will go here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
