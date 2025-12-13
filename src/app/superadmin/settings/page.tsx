
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function SuperAdminSettingsPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">System Settings</h1>
       <Card>
        <CardHeader>
          <CardTitle>General Settings</CardTitle>
          <CardDescription>Manage system-wide settings and configurations.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Settings form will be displayed here.</p>
          <p className="text-muted-foreground mt-4">This page is under construction.</p>
        </CardContent>
      </Card>
    </div>
  );
}
