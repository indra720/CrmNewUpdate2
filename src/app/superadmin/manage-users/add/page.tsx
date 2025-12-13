
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function AddUserPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Add New User</h1>
      <Card>
        <CardHeader>
          <CardTitle>New User Form</CardTitle>
          <CardDescription>Fill in the details to add a new user.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>The form to add a new user will be here.</p>
          <p className="text-muted-foreground mt-4">This page is under construction.</p>
        </CardContent>
      </Card>
    </div>
  );
}
