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
  UserCircle2,
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

const dismissedNotificationsStorageKey = "admin_header_dismissed_notifications";

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
  const [notifications, setNotifications] = useState<HeaderNotificationItem[]>([]);
  const [dismissedNotificationIds, setDismissedNotificationIds] = useState<string[]>([]);
  const [isLoadingNotifications, setIsLoadingNotifications] = useState(true);
  const [isMarkingAllRead, setIsMarkingAllRead] = useState(false);
  const [isCleaningNotifications, setIsCleaningNotifications] = useState(false);
  const [isBellBlinking, setIsBellBlinking] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  const visibleNotifications = useMemo(() => {
    const hidden = new Set(dismissedNotificationIds);
    return notifications.filter((item) => !hidden.has(item.id));
  }, [dismissedNotificationIds, notifications]);

  const unreadNotifications = useMemo(
    () => visibleNotifications.filter((item) => !item.isRead).length,
    [visibleNotifications],
  );

  const loadNotifications = useCallback(async () => {
    try {
      const [contactResponse, applicationResponse] = await Promise.all([
        fetch("/api/admin/contact-submissions", { cache: "no-store" }),
        fetch("/api/admin/job-applications", { cache: "no-store" }),
      ]);

      let contactItems: ContactSubmissionNotification[] = [];
      let applicationItems: JobApplicationNotification[] = [];

      if (contactResponse.ok) {
        const payload = (await contactResponse.json()) as { items?: ContactSubmissionNotification[] };
        contactItems = payload.items ?? [];
      }

      if (applicationResponse.ok) {
        const payload = (await applicationResponse.json()) as { items?: JobApplicationNotification[] };
        applicationItems = payload.items ?? [];
      }

      const contactNotifications: HeaderNotificationItem[] = contactItems.map((item) => ({
        id: `contact:${item.id}`,
        title: `${item.firstName} ${item.lastName}`.trim() || "Contact lead",
        description: `${formatInquiryType(item.inquiryType)} inquiry - ${item.email}`,
        href: "/admin/notifications?tab=contact-leads",
        createdAt: item.createdAt,
        isRead: item.isRead,
      }));

      const applicationNotifications: HeaderNotificationItem[] = applicationItems.map((item) => ({
        id: `application:${item.id}`,
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
      setDismissedNotificationIds((current) => {
        const allowed = new Set(next.map((item) => item.id));
        return current.filter((item) => allowed.has(item));
      });
    } catch {
      setNotifications([]);
    } finally {
      setIsLoadingNotifications(false);
    }
  }, []);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(dismissedNotificationsStorageKey);

      if (!raw) {
        return;
      }

      const parsed = JSON.parse(raw) as unknown;

      if (Array.isArray(parsed)) {
        setDismissedNotificationIds(parsed.filter((item): item is string => typeof item === "string"));
      }
    } catch {
      setDismissedNotificationIds([]);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(
      dismissedNotificationsStorageKey,
      JSON.stringify(dismissedNotificationIds),
    );
  }, [dismissedNotificationIds]);

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
      const [contactResponse, applicationResponse] = await Promise.all([
        fetch("/api/admin/contact-submissions", {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ markAll: true }),
        }),
        fetch("/api/admin/job-applications", {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ markAll: true }),
        }),
      ]);

      if (!contactResponse.ok || !applicationResponse.ok) {
        throw new Error("Unable to mark all notifications as read.");
      }

      setNotifications((current) => current.map((item) => ({ ...item, isRead: true })));
      toast.success("All notifications marked as read.");
    } catch {
      toast.error("Unable to mark all notifications as read.");
    } finally {
      setIsMarkingAllRead(false);
    }
  }

  function handleCleanNotifications() {
    if (!visibleNotifications.length) {
      toast.message("No notifications to clean.");
      return;
    }

    setIsCleaningNotifications(true);
    setDismissedNotificationIds((current) => {
      const next = new Set(current);

      for (const item of visibleNotifications) {
        next.add(item.id);
      }

      return Array.from(next);
    });
    setIsCleaningNotifications(false);
    toast.success("Notification list cleaned.");
  }

  function handleSignOut() {
    if (isSigningOut) {
      return;
    }

    setIsSigningOut(true);

    clearAuthToken();
    toast.success("Signed out.");
    router.push("/login");
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
      <div className="flex h-16 items-center gap-3 px-4 sm:px-6 lg:px-8">
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

        <div className="min-w-0">
          <p
            className={cn(
              "text-xs tracking-[0.08em] text-[#1B66B3]",
              ENABLE_ADMIN_LIGHTER_TYPE ? "font-medium" : "font-semibold",
            )}
          >
            Recruiting workspace
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

        <DropdownMenu>
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
              "w-[360px] border text-slate-900",
              ENABLE_ADMIN_UI_REFRESH
                ? "border-[#D4E8FC] bg-[#F8FBFF]/[0.96]"
                : "border-[#D4E8FC] bg-[#F8FBFF]",
            )}
          >
            <div className="flex items-center justify-between px-2 pb-1 pt-1.5">
              <DropdownMenuLabel className="p-0">Notifications</DropdownMenuLabel>
              <span className="text-xs text-slate-600">{unreadNotifications} unread</span>
            </div>

            <DropdownMenuSeparator className="bg-[#D4E8FC]" />

            <div className="flex gap-2 px-2 py-2">
              <Button
                type="button"
                size="sm"
                variant="outline"
                className="h-8 border-[#C3DDF9] bg-[#F8FBFF] px-2 text-xs text-slate-900 hover:bg-[#EDF5FF]"
                disabled={isMarkingAllRead || !visibleNotifications.length}
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
                disabled={isCleaningNotifications || !visibleNotifications.length}
                onClick={handleCleanNotifications}
              >
                {isCleaningNotifications ? "Cleaning..." : "Clean"}
              </Button>
            </div>

            <DropdownMenuSeparator className="bg-[#D4E8FC]" />

            <div className="max-h-80 overflow-y-auto">
              {isLoadingNotifications ? (
                <p className="px-3 py-3 text-sm text-slate-500">Loading notifications...</p>
              ) : !visibleNotifications.length ? (
                <p className="px-3 py-3 text-sm text-slate-500">No notifications available.</p>
              ) : (
                visibleNotifications.map((item) => (
                  <DropdownMenuItem
                    key={item.id}
                    asChild
                    className={cn(
                      "cursor-pointer items-start py-2 focus:bg-[#EDF5FF]",
                      !item.isRead && "bg-[#EAF4FF]",
                    )}
                  >
                    <Link href={item.href} className="w-full">
                      <p className="text-sm font-medium text-slate-900">{item.title}</p>
                      <p className="mt-0.5 text-xs text-slate-500">{item.description}</p>
                      <p className="mt-1 text-xs text-slate-500">{formatNotificationTime(item.createdAt)}</p>
                    </Link>
                  </DropdownMenuItem>
                ))
              )}
            </div>

            <DropdownMenuSeparator className="bg-[#D4E8FC]" />
            <DropdownMenuItem asChild className="cursor-pointer focus:bg-[#EDF5FF]">
              <Link href="/admin/notifications?tab=contact-leads">Open notification center</Link>
            </DropdownMenuItem>
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
                My profile
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
            <DropdownMenuLabel>Admin User</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-[#D4E8FC]" />
            <DropdownMenuItem asChild className="cursor-pointer focus:bg-[#EDF5FF]">
              <Link href="/admin/settings?tab=company">Account</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="cursor-pointer focus:bg-[#EDF5FF]">
              <Link href="/admin/settings/security">Preferences</Link>
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

      <div className="border-t border-[#D4E8FC] px-4 pb-3 pt-2 lg:hidden">
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


