"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Clock3, KeyRound, LoaderCircle, RefreshCcw, ShieldCheck, Users2 } from "lucide-react";
import { toast } from "sonner";

import { StatCard } from "@/components/admin/StatCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getAdminUsers, type AdminUser } from "@/lib/api/admin/users";
import { ApiError } from "@/lib/api/http";
import { clearAuthToken } from "@/lib/auth/store";

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "2-digit",
  year: "numeric",
  hour: "numeric",
  minute: "2-digit",
});

function formatDate(value: string | null) {
  if (!value) {
    return "Not recorded";
  }

  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? "Not recorded" : dateFormatter.format(parsed);
}

function formatPermission(permission: string) {
  return permission
    .split(/[:._-]+/)
    .filter(Boolean)
    .map((part) => `${part.slice(0, 1).toUpperCase()}${part.slice(1)}`)
    .join(" ");
}

export function AdminUsersPage() {
  const router = useRouter();
  const [items, setItems] = useState<AdminUser[]>([]);
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

  const loadUsers = useCallback(
    async (mode: "initial" | "refresh" = "initial") => {
      if (mode === "initial") {
        setIsLoading(true);
      } else {
        setIsRefreshing(true);
      }

      setLoadError(null);

      try {
        const data = await getAdminUsers();
        setItems(data);
      } catch (error) {
        setItems([]);
        setLoadError(error instanceof Error ? error.message : "Unable to load admin users.");
        handleApiError(error, "Unable to load admin users.");
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [handleApiError],
  );

  useEffect(() => {
    void loadUsers();
  }, [loadUsers]);

  const totalPermissions = useMemo(
    () => new Set(items.flatMap((item) => item.permissions.map((permission) => permission.trim()))).size,
    [items],
  );

  return (
    <div className="space-y-5 md:space-y-6">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <StatCard label="Admin Users" value={isLoading ? "..." : String(items.length)} detail="Backend-synced access list." icon={Users2} />
        <StatCard
          label="Active Accounts"
          value={isLoading ? "..." : String(items.filter((item) => item.status === "active").length)}
          detail="Accounts that can sign in now."
          icon={ShieldCheck}
        />
        <StatCard
          label="Permission Groups"
          value={isLoading ? "..." : String(totalPermissions)}
          detail="Unique access capabilities across admin users."
          icon={KeyRound}
        />
      </section>

      <Card className="border-[#D4E8FC] bg-[#F8FBFF] shadow-[0_24px_60px_-46px_rgba(15,23,42,0.18)]">
        <CardHeader className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="space-y-1">
            <CardTitle className="text-xl text-slate-950">Admin Users</CardTitle>
            <CardDescription className="text-sm leading-6 text-slate-600">
              This view is now Express-backed. It reflects the active admin account and the access profile stored for the control center.
            </CardDescription>
          </div>
          <Button
            type="button"
            variant="outline"
            className="border-[#BED9F3] bg-white text-slate-700 hover:bg-[#F1F7FF]"
            onClick={() => void loadUsers("refresh")}
            disabled={isLoading || isRefreshing}
          >
            {isRefreshing ? <LoaderCircle className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCcw className="mr-2 h-4 w-4" />}
            Refresh
          </Button>
        </CardHeader>
        <CardContent>
          {loadError ? <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{loadError}</p> : null}

          <div className="overflow-x-auto rounded-3xl border border-[#D4E8FC] bg-white/80">
            <Table className="min-w-[860px]">
              <TableHeader>
                <TableRow className="border-[#D4E8FC]">
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Sign In</TableHead>
                  <TableHead>Password Updated</TableHead>
                  <TableHead>Permissions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-40 text-center text-sm text-slate-500">
                      Loading admin users...
                    </TableCell>
                  </TableRow>
                ) : items.length ? (
                  items.map((item) => (
                    <TableRow key={item.id} className="border-[#D4E8FC]">
                      <TableCell>
                        <div className="space-y-1">
                          <p className="font-medium text-slate-900">{item.name}</p>
                          <p className="text-sm text-slate-500">{item.email}</p>
                          <p className="text-xs uppercase tracking-[0.14em] text-slate-400">{item.id}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <p className="font-medium text-slate-900">{item.roleName}</p>
                          <p className="max-w-xs text-sm text-slate-500">{item.roleDescription}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className="border-emerald-300/35 bg-emerald-300/12 text-emerald-700 hover:bg-emerald-300/12">
                          Active
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="inline-flex items-center gap-2 text-sm text-slate-600">
                          <Clock3 className="h-4 w-4 text-[#1B66B3]" />
                          {formatDate(item.lastSignInAt)}
                        </div>
                      </TableCell>
                      <TableCell>{formatDate(item.passwordUpdatedAt)}</TableCell>
                      <TableCell>
                        <div className="flex max-w-sm flex-wrap gap-2">
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
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-40 text-center text-sm text-slate-500">
                      No admin users were found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
