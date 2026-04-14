"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

import { Button } from "@/components/ui/button";
import { clearAuthToken } from "@/lib/auth/store";

export function LogoutButton() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  async function handleLogout() {
    setIsLoading(true);
    clearAuthToken();
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <Button variant="outline" onClick={handleLogout} disabled={isLoading} className="h-9 px-3 text-xs">
      <LogOut className="h-4 w-4" />
      {isLoading ? "Signing out..." : "Logout"}
    </Button>
  );
}
