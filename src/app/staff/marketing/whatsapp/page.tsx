'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useMarketingDialog } from "@/components/marketing/provider";
import { MarketingDialog } from "@/components/marketing/dialog";

export default function WhatsappMarketingPage() {
  const { openDialog } = useMarketingDialog();

  const handleOpenDialog = () => {
    openDialog("WhatsApp Campaign", "whatsapp");
  };

  return (
    <div>
       <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">WhatsApp Marketing</h1>
        <Button onClick={handleOpenDialog} className="flex-shrink-0">
          <PlusCircle className="mr-2 h-4 w-4" /> <span className="hidden md:inline">Create Campaign</span>
          <span className="inline md:hidden">Create</span>
        </Button>
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
      <MarketingDialog />
    </div>
  );
}
