"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { BriefcaseBusiness, Building2, Clock3, Eye, LoaderCircle } from "lucide-react";
import { toast } from "sonner";

import { StatCard } from "@/components/admin/StatCard";
import { StatusChip } from "@/components/admin/status-chip";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  getAdminCompanyLeadById,
  getAdminCompanyLeads,
  markAdminCompanyLeadRead,
  type AdminCompanyLead,
} from "@/lib/api/admin/company-leads";
import { ApiError } from "@/lib/api/http";
import { clearAuthToken } from "@/lib/auth/store";
import { companyLeadNeedLabels } from "@/lib/validators/company-lead";

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "2-digit",
  year: "numeric",
  hour: "numeric",
  minute: "2-digit",
});

type LeadDetailState = {
  open: boolean;
  leadId: string | null;
  lead: AdminCompanyLead | null;
  isLoading: boolean;
  isMarkingRead: boolean;
  error: string | null;
};

const emptyDetailState: LeadDetailState = {
  open: false,
  leadId: null,
  lead: null,
  isLoading: false,
  isMarkingRead: false,
  error: null,
};

function formatDate(value: string) {
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? "Recently" : dateFormatter.format(parsed);
}

function formatSourcePage(value: AdminCompanyLead["sourcePage"]) {
  if (value === "find-talent") {
    return "Find Talent";
  }

  if (value === "contact") {
    return "Contact";
  }

  return "Unknown";
}

function formatStatus(value: string) {
  if (!value) {
    return "Unknown";
  }

  return value
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((part) => `${part.slice(0, 1).toUpperCase()}${part.slice(1)}`)
    .join(" ");
}

function getSourceBadgeClass(sourcePage: AdminCompanyLead["sourcePage"]) {
  if (sourcePage === "find-talent") {
    return "border-cyan-300/35 bg-cyan-300/12 text-cyan-700";
  }

  if (sourcePage === "contact") {
    return "border-violet-300/35 bg-violet-300/12 text-violet-700";
  }

  return "border-slate-300/30 bg-slate-300/10 text-slate-700";
}

function getReadBadgeClass(isRead: boolean) {
  return isRead
    ? "border-emerald-300/35 bg-emerald-300/12 text-emerald-700"
    : "border-amber-300/40 bg-amber-300/15 text-amber-700";
}

export function AdminCompanyLeadsPage() {
  const router = useRouter();
  const [items, setItems] = useState<AdminCompanyLead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [detailState, setDetailState] = useState<LeadDetailState>(emptyDetailState);

  const newestLead = items[0] ?? null;
  const uniqueCompanies = useMemo(
    () => new Set(items.map((item) => item.companyName.trim().toLowerCase())).size,
    [items],
  );

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

  const loadCompanyLeads = useCallback(async () => {
    setIsLoading(true);
    setLoadError(null);

    try {
      const leads = await getAdminCompanyLeads();
      setItems(leads);
    } catch (error) {
      setItems([]);
      setLoadError(error instanceof Error ? error.message : "Unable to load company leads.");
      handleApiError(error, "Unable to load company leads.");
    } finally {
      setIsLoading(false);
    }
  }, [handleApiError]);

  useEffect(() => {
    void loadCompanyLeads();
  }, [loadCompanyLeads]);

  async function openLeadDetail(leadId: string) {
    const preview = items.find((item) => item.id === leadId) ?? null;

    setDetailState({
      open: true,
      leadId,
      lead: preview,
      isLoading: true,
      isMarkingRead: false,
      error: null,
    });

    try {
      const lead = await getAdminCompanyLeadById(leadId);

      setDetailState((current) => {
        if (current.leadId !== leadId) {
          return current;
        }

        return {
          ...current,
          lead,
          isLoading: false,
          error: null,
        };
      });
    } catch (error) {
      setDetailState((current) => {
        if (current.leadId !== leadId) {
          return current;
        }

        return {
          ...current,
          isLoading: false,
          error: error instanceof Error ? error.message : "Unable to load company lead details.",
        };
      });

      handleApiError(error, "Unable to load company lead details.");
    }
  }

  function handleDetailOpenChange(open: boolean) {
    setDetailState((current) => (open ? current : emptyDetailState));
  }

  async function handleMarkAsRead() {
    if (!detailState.leadId || detailState.lead?.isRead) {
      return;
    }

    setDetailState((current) => ({
      ...current,
      isMarkingRead: true,
    }));

    try {
      const updatedLead = await markAdminCompanyLeadRead(detailState.leadId);

      setItems((current) =>
        current.map((item) => (item.id === updatedLead.id ? { ...item, ...updatedLead } : item)),
      );

      setDetailState((current) => {
        if (current.leadId !== updatedLead.id) {
          return current;
        }

        return {
          ...current,
          lead: updatedLead,
          isMarkingRead: false,
          error: null,
        };
      });

      toast.success("Company lead marked as read.");
    } catch (error) {
      setDetailState((current) => ({
        ...current,
        isMarkingRead: false,
      }));

      handleApiError(error, "Unable to update read state.");
    }
  }

  const detailLead = detailState.lead;

  return (
    <>
      <div className="space-y-5 md:space-y-6">
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <StatCard
            label="Company Leads"
            value={isLoading ? "..." : String(items.length)}
            detail="Newest first, Express-backed."
            icon={Building2}
          />
          <StatCard
            label="Unique Companies"
            value={isLoading ? "..." : String(uniqueCompanies)}
            detail="Based on captured company names."
            icon={BriefcaseBusiness}
          />
          <StatCard
            label="Latest Submission"
            value={
              newestLead
                ? formatDate(newestLead.createdAt).split(",")[0] || "Today"
                : isLoading
                  ? "..."
                  : "None"
            }
            detail={newestLead ? newestLead.companyName : "No company leads captured yet."}
            icon={Clock3}
          />
        </section>

        <Card className="border-[#D4E8FC] bg-[linear-gradient(145deg,rgba(255,255,255,0.07),rgba(255,255,255,0.02))] backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-slate-900">Company Leads</CardTitle>
            <p className="text-sm leading-relaxed text-slate-500">
              Requests from companies looking for specialists, staffing support, or team-building help.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {loadError ? (
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-rose-300/20 bg-rose-300/10 px-4 py-3 text-sm text-rose-700">
                <span>{loadError}</span>
                <Button size="sm" variant="outline" onClick={() => void loadCompanyLeads()}>
                  Retry
                </Button>
              </div>
            ) : null}

            <div className="overflow-hidden rounded-lg border border-[#D4E8FC]">
              <Table>
                <TableHeader>
                  <TableRow className="border-[#D4E8FC] bg-[#F4F9FF] hover:bg-[#F4F9FF]">
                    <TableHead className="text-xs font-semibold tracking-[0.04em] text-slate-500">
                      Contact
                    </TableHead>
                    <TableHead className="text-xs font-semibold tracking-[0.04em] text-slate-500">
                      Company
                    </TableHead>
                    <TableHead className="text-xs font-semibold tracking-[0.04em] text-slate-500">
                      Need
                    </TableHead>
                    <TableHead className="text-xs font-semibold tracking-[0.04em] text-slate-500">
                      Message
                    </TableHead>
                    <TableHead className="text-xs font-semibold tracking-[0.04em] text-slate-500">
                      Created
                    </TableHead>
                    <TableHead className="text-xs font-semibold tracking-[0.04em] text-slate-500">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow className="border-[#D4E8FC]">
                      <TableCell colSpan={6} className="py-8 text-center text-sm text-slate-500">
                        Loading company leads...
                      </TableCell>
                    </TableRow>
                  ) : items.length ? (
                    items.map((item) => (
                      <TableRow key={item.id} className="border-[#D4E8FC] hover:bg-[#F1F7FF]">
                        <TableCell className="py-3 text-sm text-slate-700">
                          <div className="space-y-2">
                            <div>
                              <p className="font-semibold text-slate-900">{item.name}</p>
                              <p className="text-xs text-slate-500">{item.email}</p>
                              <p className="text-xs text-slate-500">{item.phone}</p>
                            </div>
                            <Badge variant="outline" className={getReadBadgeClass(item.isRead)}>
                              {item.isRead ? "Read" : "Unread"}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell className="py-3 text-sm text-slate-700">
                          <div className="space-y-2">
                            <p className="font-medium text-slate-900">{item.companyName}</p>
                            <Badge variant="outline" className={getSourceBadgeClass(item.sourcePage)}>
                              {formatSourcePage(item.sourcePage)}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell className="py-3 text-sm text-slate-700">
                          <div className="space-y-2">
                            <Badge variant="outline" className="border-[#D4E8FC] bg-[#F8FBFF] text-slate-900">
                              {companyLeadNeedLabels[item.need]}
                            </Badge>
                            <StatusChip status={formatStatus(item.status)} />
                          </div>
                        </TableCell>
                        <TableCell className="max-w-md py-3 text-sm text-slate-600">
                          <p className="whitespace-pre-wrap break-words text-sm leading-6">{item.message}</p>
                        </TableCell>
                        <TableCell className="py-3 text-sm text-slate-500">
                          {formatDate(item.createdAt)}
                        </TableCell>
                        <TableCell className="py-3 text-sm text-slate-700">
                          <Button size="sm" variant="outline" onClick={() => void openLeadDetail(item.id)}>
                            {detailState.open && detailState.leadId === item.id && detailState.isLoading ? (
                              <LoaderCircle className="h-4 w-4 animate-spin" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow className="border-[#D4E8FC]">
                      <TableCell colSpan={6} className="py-8 text-center text-sm text-slate-500">
                        No company leads captured yet.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={detailState.open} onOpenChange={handleDetailOpenChange}>
        <DialogContent className="border-[#D4E8FC] bg-[linear-gradient(145deg,#F9FCFF_0%,#EDF6FF_100%)] text-slate-900 sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-semibold text-slate-900">
              {detailLead ? detailLead.companyName : "Company lead details"}
            </DialogTitle>
            <DialogDescription className="text-slate-500">
              {detailLead
                ? `${detailLead.name} | ${detailLead.email}`
                : "Inspect request details and update read state."}
            </DialogDescription>
          </DialogHeader>

          {detailState.isLoading && !detailLead ? (
            <div className="flex items-center gap-2 py-8 text-sm text-slate-600">
              <LoaderCircle className="h-4 w-4 animate-spin" />
              Loading company lead details...
            </div>
          ) : detailState.error && !detailLead ? (
            <div className="rounded-lg border border-rose-300/20 bg-rose-300/10 px-4 py-4 text-sm text-rose-700">
              {detailState.error}
            </div>
          ) : detailLead ? (
            <div className="space-y-5">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-xl border border-[#D4E8FC] bg-[#F4F9FF] p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                    Contact
                  </p>
                  <div className="mt-3 space-y-2 text-sm text-slate-700">
                    <p>
                      <span className="text-slate-500">Name:</span> {detailLead.name}
                    </p>
                    <p>
                      <span className="text-slate-500">Email:</span> {detailLead.email}
                    </p>
                    <p>
                      <span className="text-slate-500">Phone:</span> {detailLead.phone}
                    </p>
                  </div>
                </div>

                <div className="rounded-xl border border-[#D4E8FC] bg-[#F4F9FF] p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                    Company
                  </p>
                  <div className="mt-3 space-y-2 text-sm text-slate-700">
                    <p>
                      <span className="text-slate-500">Company:</span> {detailLead.companyName}
                    </p>
                    <p>
                      <span className="text-slate-500">Need:</span> {companyLeadNeedLabels[detailLead.need]}
                    </p>
                    <div className="flex flex-wrap gap-2 pt-1">
                      <Badge variant="outline" className={getSourceBadgeClass(detailLead.sourcePage)}>
                        {formatSourcePage(detailLead.sourcePage)}
                      </Badge>
                      <Badge variant="outline" className={getReadBadgeClass(detailLead.isRead)}>
                        {detailLead.isRead ? "Read" : "Unread"}
                      </Badge>
                      <StatusChip status={formatStatus(detailLead.status)} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-[#D4E8FC] bg-[#F4F9FF] p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                  Message
                </p>
                <p className="mt-3 whitespace-pre-wrap break-words text-sm leading-6 text-slate-700">
                  {detailLead.message}
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-xl border border-[#D4E8FC] bg-[#F4F9FF] p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                    Created
                  </p>
                  <p className="mt-3 text-sm text-slate-700">{formatDate(detailLead.createdAt)}</p>
                </div>
                <div className="rounded-xl border border-[#D4E8FC] bg-[#F4F9FF] p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                    Updated
                  </p>
                  <p className="mt-3 text-sm text-slate-700">{formatDate(detailLead.updatedAt)}</p>
                </div>
              </div>

              {detailState.error ? (
                <div className="rounded-lg border border-rose-300/20 bg-rose-300/10 px-4 py-3 text-sm text-rose-700">
                  {detailState.error}
                </div>
              ) : null}
            </div>
          ) : null}

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => handleDetailOpenChange(false)}>
              Close
            </Button>
            {detailLead && !detailLead.isRead ? (
              <Button onClick={() => void handleMarkAsRead()} disabled={detailState.isMarkingRead}>
                {detailState.isMarkingRead ? "Marking..." : "Mark as read"}
              </Button>
            ) : null}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}


