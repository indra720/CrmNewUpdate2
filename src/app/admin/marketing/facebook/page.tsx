'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useMarketingDialog } from "@/components/marketing/provider";
import { MarketingDialog } from "@/components/marketing/dialog";

export default function FacebookMarketingPage() {
  const { openDialog } = useMarketingDialog(); // Re-adding the hook

  const handleOpenDialog = () => { // Re-adding the handler
    openDialog("Facebook Campaign", "facebook");
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6"> 
        <h1 className="text-3xl font-bold">Facebook Marketing</h1>
        <Button onClick={handleOpenDialog} className="flex-shrink-0"> {/* Connecting button to handler */}
          <PlusCircle className="mr-2 h-4 w-4" /> <span className="hidden md:inline">Create Campaign</span>
          <span className="inline md:hidden">Create</span>
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Facebook Campaigns</CardTitle>
          <CardDescription>Manage your Facebook marketing campaigns here.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Facebook marketing content will go here.</p>
        </CardContent>
      </Card>
      <MarketingDialog />
    </div>
  );
}













// BHAI yeh error 100% same type ka hai jo Facebook Marketing me aaya tha.
// Solution bhi EXACT SAME hai.

// ⭐ ERROR KA MATALAB
// useMarketingDialog must be used within a MarketingProvider


// Iska matlab:

// 🔴 admin/marketing/linkedin/page.tsx ke upar koi Provider laga hi nahi hai
// 🔴 Client component ek hook use kar raha hai jo Provider ke bina chalega nahi
// 🔴 Build time par Next.js page ko server se pre-render karta hai → tab hook fail ho jata hai.

// ⭐ 100% FIX — 2 options
// ✅ OPTION 1 (BEST, CLEAN, SAHI TARIQA):
// admin/marketing/layout.tsx me Provider wrap karo

// 👉 Folder path:

// src/app/admin/marketing/layout.tsx


// Agar ye file nahi hai → banao.

// 📌 Yeh EXACT CODE paste karo:
// 'use client';

// import { MarketingProvider } from "@/components/marketing/provider";

// export default function MarketingLayout({ children }: { children: React.ReactNode }) {
//   return (
//     <MarketingProvider>
//       {children}
//     </MarketingProvider>
//   );
// }


// ✔️ Yeh PURE marketing pages ko wrap karega
// ✔️ LinkedIn, Facebook, Instagram sab me error band ho jayega
// ✔️ Build 100% pass ho jayega

// ✅ OPTION 2 (Quick temporary hack)

// Agar layout file nahi banana chahte ho,
// to page ke andar manual Provider wrap karo.

// admin/marketing/linkedin/page.tsx me:

// 👇 Example:

// 'use client';

// import { MarketingProvider } from "@/components/marketing/provider";
// import { useMarketingDialog } from "@/components/marketing/provider";
// import { MarketingDialog } from "@/components/marketing/dialog";
// import { Button } from "@/components/ui/button";
// import { PlusCircle } from "lucide-react";

// export default function LinkedinMarketingPage() {
//   return (
//     <MarketingProvider>
//       <LinkedinContent />
//     </MarketingProvider>
//   );
// }

// function LinkedinContent() {
//   const { openDialog } = useMarketingDialog();

//   return (
//     <div>
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-3xl font-bold">LinkedIn Marketing</h1>
//         <Button onClick={() => openDialog("LinkedIn Campaign", "linkedin")}>
//           <PlusCircle className="mr-2 h-4 w-4" />
//           Create Campaign
//         </Button>
//       </div>

//       <MarketingDialog />
//     </div>
//   );
// }