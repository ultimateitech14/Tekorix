"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { KeyRound, LoaderCircle, RefreshCcw, ShieldCheck, Users2 } from "lucide-react";
import { toast } from "sonner";

import { StatCard } from "@/components/admin/StatCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getAdminRoles, type AdminRole } from "@/lib/api/admin/roles";
import { ApiError } from "@/lib/api/http";
import { clearAuthToken } from "@/lib/auth/store";

function formatPermission(permission: string) {
  return permission
    .split(/[:._-]+/)
    .filter(Boolean)
    .map((part) => `${part.slice(0, 1).toUpperCase()}${part.slice(1)}`)
    .join(" ");
}

export function AdminRolesPage() {
  const router = useRouter();
  const [items, setItems] = useState<AdminRole[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  const handleApiError = useCallback(
    (error: unknown, fallbackMessage: string) => {
      if (error instanceof ApiError && error.status === 401) {
        clearAuthToken();
        toast.error("Admin session expired. Please sign in again.");
        router.replace("/admin/login");
        return;
      }

      toast.error(error instanceof Error ? error.message : fallbackMessage);
    },
    [router],
  );

  const loadRoles = useCallback(
    async (mode: "initial" | "refresh" = "initial") => {
      if (mode === "initial") {
        setIsLoading(true);
      } else {
        setIsRefreshing(true);
      }

      setLoadError(null);

      try {
        setItems(await getAdminRoles());
      } catch (error) {
        setItems([]);
        setLoadError(error instanceof Error ? error.message : "Unable to load admin roles.");
        handleApiError(error, "Unable to load admin roles.");
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [handleApiError],
  );

  useEffect(() => {
    void loadRoles();
  }, [loadRoles]);

  return (
    <div className="space-y-5 md:space-y-6">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <StatCard label="Roles" value={isLoading ? "..." : String(items.length)} detail="Access profiles exposed from the backend." icon={ShieldCheck} />
        <StatCard
          label="Assigned Users"
          value={isLoading ? "..." : String(items.reduce((sum, item) => sum + item.userCount, 0))}
          detail="Users mapped to the available roles."
          icon={Users2}
        />
        <StatCard
          label="Permission Rules"
          value={isLoading ? "..." : String(items.reduce((sum, item) => sum + item.permissions.length, 0))}
          detail="Named permissions attached to the roles."
          icon={KeyRound}
        />
      </section>

      <Card className="border-[#D4E8FC] bg-[#F8FBFF] shadow-[0_24px_60px_-46px_rgba(15,23,42,0.18)]">
        <CardHeader className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="space-y-1">
            <CardTitle className="text-xl text-slate-950">Roles & Access</CardTitle>
            <CardDescription className="text-sm leading-6 text-slate-600">
              These roles are now loaded from the Express backend, so access summaries can be reviewed inside the admin panel instead of being hard-coded.
            </CardDescription>
          </div>
          <Button
            type="button"
            variant="outline"
            className="border-[#BED9F3] bg-white text-slate-700 hover:bg-[#F1F7FF]"
            onClick={() => void loadRoles("refresh")}
            disabled={isLoading || isRefreshing}
          >
            {isRefreshing ? <LoaderCircle className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCcw className="mr-2 h-4 w-4" />}
            Refresh
          </Button>
        </CardHeader>
        <CardContent>
          {loadError ? <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{loadError}</p> : null}

          <div className="grid gap-4 xl:grid-cols-2">
            {isLoading ? (
              <div className="rounded-[1.5rem] border border-[#D4E8FC] bg-white/80 px-5 py-10 text-center text-sm text-slate-500 xl:col-span-2">
                Loading roles...
              </div>
            ) : items.length ? (
              items.map((item) => (
                <Card key={item.id} className="border-[#D4E8FC] bg-white/85 shadow-none">
                  <CardHeader className="space-y-3">
                    <div className="flex items-center justify-between gap-3">
                      <CardTitle className="text-lg text-slate-950">{item.name}</CardTitle>
                      <Badge className="border-[#BED9F3] bg-[#F7FAFF] text-[#1B66B3] hover:bg-[#F7FAFF]">
                        {item.userCount} user{item.userCount === 1 ? "" : "s"}
                      </Badge>
                    </div>
                    <CardDescription className="text-sm leading-6 text-slate-600">{item.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                      {item.isSystem ? (
                        <Badge className="border-emerald-300/35 bg-emerald-300/12 text-emerald-700 hover:bg-emerald-300/12">
                          System role
                        </Badge>
                      ) : null}
                      <Badge variant="outline" className="border-[#D4E8FC] bg-[#F8FBFF] text-slate-600 hover:bg-[#F8FBFF]">
                        {item.permissions.length} permissions
                      </Badge>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {item.permissions.map((permission) => (
                        <Badge
                          key={permission}
                          variant="outline"
                          className="border-[#BED9F3] bg-[#F7FAFF] text-[#1B66B3] hover:bg-[#F7FAFF]"
                        >
                          {formatPermission(permission)}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="rounded-[1.5rem] border border-[#D4E8FC] bg-white/80 px-5 py-10 text-center text-sm text-slate-500 xl:col-span-2">
                No roles were found.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
