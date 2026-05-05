"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Bell,
  ChevronRight,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  Search,
  Trash2,
  UserCircle2,
  X,
} from "lucide-react";
import { toast } from "sonner";

import { getAdminBreadcrumbs, getAdminPageTitle } from "@/components/admin/nav-config";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  deleteAdminContactSubmission,
  deleteAllAdminContactSubmissions,
  getAdminContactSubmissions,
  markAllAdminContactSubmissionsRead,
} from "@/lib/api/admin/contact-submissions";
import {
  deleteAdminJobApplication,
  deleteAllAdminJobApplications,
  getAdminJobApplications,
  markAllAdminJobApplicationsRead,
} from "@/lib/api/admin/job-applications";
import { useAdminShellData } from "@/lib/admin/use-admin-shell-data";
import { clearAuthToken } from "@/lib/auth/store";
import { ENABLE_ADMIN_LIGHTER_TYPE, ENABLE_ADMIN_UI_REFRESH } from "@/lib/ui-flags";
import { cn } from "@/lib/utils";

type ContactSubmissionNotification = {
  id: string;
  inquiryType: string;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: string;
  isRead: boolean;
};

type JobApplicationNotification = {
  id: string;
  fullName: string;
  email: string;
  jobTitle: string;
  createdAt: string;
  isRead: boolean;
};

type HeaderNotificationItem = {
  id: string;
  kind: "contact" | "application";
  recordId: string;
  title: string;
  description: string;
  href: string;
  createdAt: string;
  isRead: boolean;
};

type HeaderProps = {
  collapsed: boolean;
  onToggleCollapse: () => void;
  onOpenMobileSidebar: () => void;
};

const notificationTimeFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "2-digit",
  hour: "numeric",
  minute: "2-digit",
});

function formatInquiryType(value: string) {
  if (value === "candidate") {
    return "Candidate";
  }

  if (value === "former-employee") {
    return "Former Employee";
  }

  if (value === "client") {
    return "Client";
  }

  return value || "General";
}

function formatNotificationTime(value: string) {
  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) {
    return "Recently";
  }

  return notificationTimeFormatter.format(parsed);
}

export function Header({ collapsed, onToggleCollapse, onOpenMobileSidebar }: HeaderProps) {
  const router = useRouter();
  const pathname = usePathname() ?? "/admin";
  const title = getAdminPageTitle(pathname);
  const breadcrumbs = getAdminBreadcrumbs(pathname);
  const shellData = useAdminShellData();
  const [notifications, setNotifications] = useState<HeaderNotificationItem[]>([]);
  const [isLoadingNotifications, setIsLoadingNotifications] = useState(true);
  const [isMarkingAllRead, setIsMarkingAllRead] = useState(false);
  const [isCleaningNotifications, setIsCleaningNotifications] = useState(false);
  const [deletingNotificationId, setDeletingNotificationId] = useState<string | null>(null);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isBellBlinking, setIsBellBlinking] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  const unreadNotifications = useMemo(
    () => notifications.filter((item) => !item.isRead).length,
    [notifications],
  );
  const workspaceLabel = shellData.companyName ? `${shellData.companyName} workspace` : "Admin workspace";
  const profileLabel = shellData.profile?.name || shellData.companyName || "Admin profile";

  const loadNotifications = useCallback(async () => {
    try {
      const [contactResult, applicationResult] = await Promise.all([
        getAdminContactSubmissions(),
        getAdminJobApplications(),
      ]);

      const contactItems = (contactResult.items ?? []) as ContactSubmissionNotification[];
      const applicationItems = (applicationResult.items ?? []) as JobApplicationNotification[];

      const contactNotifications: HeaderNotificationItem[] = contactItems.map((item) => ({
        id: `contact:${item.id}`,
        kind: "contact",
        recordId: item.id,
        title: `${item.firstName} ${item.lastName}`.trim() || "Contact lead",
        description: `${formatInquiryType(item.inquiryType)} inquiry - ${item.email}`,
        href: "/admin/notifications?tab=contact-leads",
        createdAt: item.createdAt,
        isRead: item.isRead,
      }));

      const applicationNotifications: HeaderNotificationItem[] = applicationItems.map((item) => ({
        id: `application:${item.id}`,
        kind: "application",
        recordId: item.id,
        title: `${item.fullName} applied`,
        description: `${item.jobTitle} - ${item.email}`,
        href: "/admin/notifications?tab=job-applications",
        createdAt: item.createdAt,
        isRead: item.isRead,
      }));

      const next = [...contactNotifications, ...applicationNotifications].sort((a, b) =>
        a.createdAt < b.createdAt ? 1 : -1,
      );

      setNotifications(next);
    } catch {
      setNotifications([]);
    } finally {
      setIsLoadingNotifications(false);
    }
  }, []);

  useEffect(() => {
    void loadNotifications();
    const timer = window.setInterval(() => {
      void loadNotifications();
    }, 15000);

    return () => {
      window.clearInterval(timer);
    };
  }, [loadNotifications]);

  useEffect(() => {
    if (unreadNotifications <= 0) {
      setIsBellBlinking(false);
      return;
    }

    let timeoutId: number | undefined;
    const timer = window.setInterval(() => {
      setIsBellBlinking(true);
      timeoutId = window.setTimeout(() => {
        setIsBellBlinking(false);
      }, 1200);
    }, 15000);

    return () => {
      window.clearInterval(timer);

      if (typeof timeoutId === "number") {
        window.clearTimeout(timeoutId);
      }
    };
  }, [unreadNotifications]);

  async function handleMarkAllRead() {
    setIsMarkingAllRead(true);

    try {
      await Promise.all([markAllAdminContactSubmissionsRead(), markAllAdminJobApplicationsRead()]);

      setNotifications((current) => current.map((item) => ({ ...item, isRead: true })));
      toast.success("All notifications marked as read.");
    } catch {
      toast.error("Unable to mark all notifications as read.");
    } finally {
      setIsMarkingAllRead(false);
    }
  }

  async function handleDeleteNotification(item: HeaderNotificationItem) {
    setDeletingNotificationId(item.id);

    try {
      if (item.kind === "contact") {
        await deleteAdminContactSubmission(item.recordId);
      } else {
        await deleteAdminJobApplication(item.recordId);
      }

      setNotifications((current) => current.filter((entry) => entry.id !== item.id));
      toast.success("Notification deleted.");
    } catch {
      toast.error("Unable to delete this notification right now.");
    } finally {
      setDeletingNotificationId(null);
    }
  }

  async function handleCleanNotifications() {
    if (!notifications.length) {
      toast.message("No notifications to clean.");
      return;
    }

    setIsCleaningNotifications(true);

    try {
      await Promise.all([deleteAllAdminContactSubmissions(), deleteAllAdminJobApplications()]);
      setNotifications([]);
      toast.success("Notifications cleared from the database.");
    } catch {
      toast.error("Unable to clear notifications right now.");
    } finally {
      setIsCleaningNotifications(false);
    }
  }

  function handleSignOut() {
    if (isSigningOut) {
      return;
    }

    setIsSigningOut(true);

    clearAuthToken();
    toast.success("Signed out.");
    router.push("/admin/login");
    router.refresh();
    setIsSigningOut(false);
  }

  return (
    <header
      className={cn(
        "sticky top-0 z-30 border-b backdrop-blur-xl",
        ENABLE_ADMIN_UI_REFRESH ? "border-[#D4E8FC] bg-[#F8FBFF]/[0.88]" : "border-[#D4E8FC] bg-[#F8FBFF]/80",
      )}
    >
      <div className="flex h-16 items-center gap-2 px-3 sm:gap-3 sm:px-5 lg:px-8">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className={cn(
            "text-slate-700 hover:bg-[#EDF5FF] hover:text-slate-900 lg:hidden",
            ENABLE_ADMIN_UI_REFRESH && "hover:bg-[#EAF4FF]",
          )}
          onClick={onOpenMobileSidebar}
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Open navigation</span>
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          className={cn(
            "hidden text-slate-700 hover:bg-[#EDF5FF] hover:text-slate-900 lg:inline-flex",
            ENABLE_ADMIN_UI_REFRESH && "hover:bg-[#EAF4FF]",
          )}
          onClick={onToggleCollapse}
        >
          {collapsed ? <PanelLeftOpen className="h-5 w-5" /> : <PanelLeftClose className="h-5 w-5" />}
          <span className="sr-only">Toggle sidebar width</span>
        </Button>

        <div className="min-w-0 flex-1">
          <p
            className={cn(
              "text-xs tracking-[0.08em] text-[#1B66B3]",
              ENABLE_ADMIN_LIGHTER_TYPE ? "font-medium" : "font-semibold",
            )}
          >
            {workspaceLabel}
          </p>
          <h1
            className={cn(
              "truncate text-base text-slate-900 sm:text-lg",
              ENABLE_ADMIN_LIGHTER_TYPE ? "font-medium" : "font-semibold",
            )}
          >
            {title}
          </h1>
          <nav className="hidden items-center gap-1 text-xs text-slate-500 md:flex">
            {breadcrumbs.map((crumb, index) => (
              <div key={crumb.href} className="flex items-center gap-1">
                {index > 0 ? <ChevronRight className="h-3 w-3" /> : null}
                <Link
                  href={crumb.href}
                  className={cn(
                    "hover:text-slate-900",
                    index === breadcrumbs.length - 1 ? "text-slate-700" : "text-slate-500",
                  )}
                >
                  {crumb.label}
                </Link>
              </div>
            ))}
          </nav>
        </div>

        <div className="ml-auto hidden w-full max-w-sm items-center lg:flex">
          <div className="relative w-full">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <Input
              placeholder="Search jobs, candidates, applications..."
              className={cn(
                "h-10 border-[#D4E8FC] bg-[#F8FBFF] pl-9 text-base text-slate-900 placeholder:text-slate-500 focus-visible:ring-[#1B66B3]/40",
                ENABLE_ADMIN_UI_REFRESH && "bg-[#F1F7FF]",
              )}
            />
          </div>
        </div>

        <DropdownMenu open={isNotificationsOpen} onOpenChange={setIsNotificationsOpen}>
          <DropdownMenuTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className={cn(
                "relative text-slate-700 hover:bg-[#EDF5FF] hover:text-slate-900",
                ENABLE_ADMIN_UI_REFRESH && "hover:bg-[#EAF4FF]",
              )}
              aria-label="Notifications"
            >
              <Bell className={cn("h-5 w-5", unreadNotifications > 0 && isBellBlinking && "animate-pulse text-[#1B66B3]")} />
              {unreadNotifications > 0 ? (
                <span
                  className={cn(
                    "absolute -right-1 -top-1 inline-flex min-w-5 items-center justify-center rounded-full bg-[#1B66B3] px-1 text-xs font-semibold text-white",
                    isBellBlinking && "animate-pulse",
                  )}
                >
                  {unreadNotifications > 99 ? "99+" : unreadNotifications}
                </span>
              ) : (
                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[#1B66B3]" />
              )}
              <span className="sr-only">Notifications</span>
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            className={cn(
              "w-[min(24rem,calc(100vw-0.75rem))] border p-0 text-slate-900",
              ENABLE_ADMIN_UI_REFRESH
                ? "border-[#D4E8FC] bg-[#F8FBFF]/[0.96]"
                : "border-[#D4E8FC] bg-[#F8FBFF]",
            )}
          >
            <div className="flex items-start justify-between gap-3 px-3 pb-2 pt-3">
              <div className="min-w-0">
                <DropdownMenuLabel className="p-0">Notifications</DropdownMenuLabel>
                <p className="mt-0.5 text-xs text-slate-600">{unreadNotifications} unread</p>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8 shrink-0 rounded-full text-slate-500 hover:bg-[#EDF5FF] hover:text-slate-900"
                onClick={() => setIsNotificationsOpen(false)}
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Close notifications</span>
              </Button>
            </div>

            <DropdownMenuSeparator className="bg-[#D4E8FC]" />

            <div className="flex flex-wrap gap-2 px-3 py-2">
              <Button
                type="button"
                size="sm"
                variant="outline"
                className="h-8 border-[#C3DDF9] bg-[#F8FBFF] px-2 text-xs text-slate-900 hover:bg-[#EDF5FF]"
                disabled={isMarkingAllRead || !notifications.length}
                onClick={() => {
                  void handleMarkAllRead();
                }}
              >
                {isMarkingAllRead ? "Marking..." : "Mark all read"}
              </Button>
              <Button
                type="button"
                size="sm"
                variant="outline"
                className="h-8 border-[#C3DDF9] bg-[#F8FBFF] px-2 text-xs text-slate-900 hover:bg-[#EDF5FF]"
                disabled={isCleaningNotifications || !notifications.length}
                onClick={() => {
                  void handleCleanNotifications();
                }}
              >
                {isCleaningNotifications ? "Cleaning..." : "Clean"}
              </Button>
            </div>

            <DropdownMenuSeparator className="bg-[#D4E8FC]" />

            <div className="max-h-[min(24rem,calc(100vh-11rem))] overflow-y-auto">
              {isLoadingNotifications ? (
                <p className="px-3 py-3 text-sm text-slate-500">Loading notifications...</p>
              ) : !notifications.length ? (
                <p className="px-3 py-3 text-sm text-slate-500">No notifications available.</p>
              ) : (
                notifications.map((item) => (
                  <div
                    key={item.id}
                    className={cn(
                      "flex items-start gap-3 px-3 py-3",
                      !item.isRead ? "bg-[#EAF4FF]" : "bg-transparent",
                    )}
                  >
                    <Link
                      href={item.href}
                      className="min-w-0 flex-1 rounded-md pr-1 transition-colors hover:text-slate-900"
                      onClick={() => setIsNotificationsOpen(false)}
                    >
                      <p className="text-sm font-medium text-slate-900">{item.title}</p>
                      <p className="mt-0.5 break-words text-xs leading-5 text-slate-500">{item.description}</p>
                      <p className="mt-1 text-xs text-slate-500">{formatNotificationTime(item.createdAt)}</p>
                    </Link>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="mt-0.5 h-8 w-8 shrink-0 rounded-full text-slate-500 hover:bg-[#EDF5FF] hover:text-rose-600"
                      disabled={deletingNotificationId === item.id || isCleaningNotifications}
                      onClick={() => {
                        void handleDeleteNotification(item);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete notification</span>
                    </Button>
                  </div>
                ))
              )}
            </div>

            <DropdownMenuSeparator className="bg-[#D4E8FC]" />
            <div className="px-3 py-2">
              <Link
                href="/admin/notifications?tab=contact-leads"
                className="block rounded-md px-2 py-2 text-sm text-slate-900 transition-colors hover:bg-[#EDF5FF]"
                onClick={() => setIsNotificationsOpen(false)}
              >
                Open notification center
              </Link>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              className={cn(
                "h-10 gap-2 rounded-full border border-[#C8DEF6] bg-[#F1F7FF] px-3 text-slate-900 transition-colors hover:border-[#B6D3F2] hover:bg-[#E6F2FF] data-[state=open]:border-[#B6D3F2] data-[state=open]:bg-[#E6F2FF]",
                ENABLE_ADMIN_UI_REFRESH && "bg-[#EDF5FF] hover:bg-[#E3F0FF] data-[state=open]:bg-[#E3F0FF]",
              )}
            >
                <UserCircle2 className="h-5 w-5 text-[#1B66B3]" />
              <span
                className={cn(
                  "hidden text-sm sm:inline-flex",
                  ENABLE_ADMIN_LIGHTER_TYPE ? "font-medium" : "font-semibold",
                )}
              >
                {profileLabel}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className={cn(
              "w-48 border text-slate-900",
              ENABLE_ADMIN_UI_REFRESH
                ? "border-[#D4E8FC] bg-[#F8FBFF]/[0.96]"
                : "border-[#D4E8FC] bg-[#F8FBFF]",
            )}
            >
            <DropdownMenuLabel>{profileLabel}</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-[#D4E8FC]" />
            <DropdownMenuItem asChild className="cursor-pointer focus:bg-[#EDF5FF]">
              <Link href="/admin/profile">Profile</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="cursor-pointer focus:bg-[#EDF5FF]">
              <Link href="/admin/settings?tab=company">Company Settings</Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="cursor-pointer focus:bg-[#EDF5FF]"
              disabled={isSigningOut}
              onSelect={(event) => {
                event.preventDefault();
                handleSignOut();
              }}
            >
              {isSigningOut ? "Signing out..." : "Sign out"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="border-t border-[#D4E8FC] px-3 pb-3 pt-2 sm:px-5 lg:hidden">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <Input
            placeholder="Search..."
            className={cn(
              "h-10 border-[#D4E8FC] bg-[#F8FBFF] pl-9 text-base text-slate-900 placeholder:text-slate-500 focus-visible:ring-[#1B66B3]/40",
              ENABLE_ADMIN_UI_REFRESH && "bg-[#F1F7FF]",
            )}
          />
        </div>
      </div>
    </header>
  );
}


