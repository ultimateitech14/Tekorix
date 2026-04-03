"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { clearAuthToken } from "@/lib/auth/store";
import { getAdminMe } from "@/lib/auth/client";

export function AdminAuthGuard() {
  const router = useRouter();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function validate() {
      try {
        await getAdminMe();

        if (mounted) {
          setChecked(true);
        }
      } catch {
        clearAuthToken();
        router.replace("/admin/login");
      }
    }

    validate();

    return () => {
      mounted = false;
    };
  }, [router]);

  if (!checked) {
    return (
      <div className="mb-4 rounded-lg border border-border/70 bg-card/50 px-4 py-3 text-xs text-muted-foreground">
        Verifying admin session...
      </div>
    );
  }

  return null;
}
