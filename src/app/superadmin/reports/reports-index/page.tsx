
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function SuperAdminReportsPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">System Reports</h1>
       <Card>
        <CardHeader>
          <CardTitle>Reports & Analytics</CardTitle>
          <CardDescription>View and export system-wide reports.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Report filters and data visualizations will be displayed here.</p>
          <p className="text-muted-foreground mt-4">This page is under construction.</p>
        </CardContent>
      </Card>
    </div>
  );
}
