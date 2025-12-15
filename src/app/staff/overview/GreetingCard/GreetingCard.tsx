import { Building2 } from "lucide-react";

interface GreetingCardProps {
  name: string;
  companyName?: string;
}

export function GreetingCard({ name, companyName = "TechCorp" }: GreetingCardProps) {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <div className="dashboard-card greeting-gradient relative overflow-hidden bg-card rounded-md shadow-sm p-3">
      <div className="absolute top-4 right-4 opacity-10">
        <Building2 className="h-24 w-24 text-primary" />
      </div>
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-4">
          <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Building2 className="h-5 w-5 text-primary" />
          </div>
          <span className="font-semibold text-foreground">{companyName}</span>
        </div>
        <h3 className="text-2xl font-semibold text-foreground mb-2">
          {getGreeting()}, {name.split(" ")[0]}!
        </h3>
        <p className="text-muted-foreground">
          Have a productive day ahead. Your dedication makes a difference!
        </p>
      </div>
    </div>
  );
}
