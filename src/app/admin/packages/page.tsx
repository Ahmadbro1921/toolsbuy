import { getAllPackages } from "@/lib/supabase/store";
import { PackagesClient } from "./packages-client";
import { Layers } from "lucide-react";

export const metadata = {
  title: "Packages & Bundles Management - ToolsBuy Admin",
  description: "Create and edit pricing bundles, included tools, and features.",
};

export default async function AdminPackagesPage() {
  const packages = await getAllPackages();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight flex items-center gap-2.5">
          <Layers className="w-7 h-7 text-primary" />
          Packages & Bundles Management
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          Configure pre-made bundles (Basic, Standard, Premium), set PKR pricing, modify included tools, and highlight featured plans.
        </p>
      </div>

      <PackagesClient initialPackages={packages} />
    </div>
  );
}
