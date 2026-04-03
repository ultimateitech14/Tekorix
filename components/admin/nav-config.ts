import type { LucideIcon } from "lucide-react";
import {
  Activity,
  BellRing,
  BriefcaseBusiness,
  Inbox,
  LayoutDashboard,
  Mail,
  Settings,
  Users2,
} from "lucide-react";

type AdminNavChild = {
  label: string;
  href: string;
};

export type AdminNavSection = {
  label: string;
  href: string;
  icon: LucideIcon;
  children: AdminNavChild[];
};

export const adminNavSections: AdminNavSection[] = [
  {
    label: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
    children: [],
  },
  {
    label: "Jobs",
    href: "/admin/jobs",
    icon: BriefcaseBusiness,
    children: [
      { label: "All Jobs", href: "/admin/jobs" },
      { label: "Create Job", href: "/admin/jobs/new" },
      { label: "Categories/Tags", href: "/admin/jobs?view=categories" },
    ],
  },
  {
    label: "Applications",
    href: "/admin/applications",
    icon: Users2,
    children: [
      { label: "All Applications", href: "/admin/applications" },
      { label: "Shortlisted", href: "/admin/applications?status=shortlisted" },
      { label: "Rejected", href: "/admin/applications?status=rejected" },
    ],
  },
  {
    label: "Candidates",
    href: "/admin/candidates",
    icon: Users2,
    children: [
      { label: "Candidate Directory", href: "/admin/candidates" },
      { label: "Resume Bank", href: "/admin/candidates?tab=resumes" },
    ],
  },
  {
    label: "Leads",
    href: "/admin/leads",
    icon: Inbox,
    children: [
      { label: "Company Leads", href: "/admin/leads/company" },
      { label: "Candidate Leads", href: "/admin/leads/candidate" },
    ],
  },
  {
    label: "Email & Notifications",
    href: "/admin/email-templates",
    icon: Mail,
    children: [
      { label: "Email Templates", href: "/admin/email-templates" },
      { label: "Provider Settings", href: "/admin/notifications?tab=providers" },
      { label: "Job Application Alerts", href: "/admin/notifications?tab=job-applications" },
      { label: "Notification Logs", href: "/admin/logs?tab=notifications" },
    ],
  },
  {
    label: "System",
    href: "/admin/logs",
    icon: Activity,
    children: [
      { label: "Audit Trail", href: "/admin/logs?tab=audit" },
    ],
  },
  {
    label: "Settings",
    href: "/admin/settings",
    icon: Settings,
    children: [
      { label: "Company Profile", href: "/admin/settings" },
      { label: "Careers Page Controls", href: "/admin/settings?tab=careers" },
    ],
  },
];

const directTitles: Record<string, string> = {
  "/admin": "Dashboard",
  "/admin/jobs": "Jobs",
  "/admin/jobs/new": "Create Job",
  "/admin/applications": "Applications",
  "/admin/candidates": "Candidates",
  "/admin/leads": "Leads",
  "/admin/leads/company": "Company Leads",
  "/admin/leads/candidate": "Candidate Leads",
  "/admin/email-templates": "Email Templates",
  "/admin/notifications": "Notifications",
  "/admin/logs": "Logs",
  "/admin/settings": "Settings",
};

function formatSegment(segment: string) {
  return segment
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function getAdminPageTitle(pathname: string) {
  if (pathname in directTitles) {
    return directTitles[pathname];
  }

  if (pathname.startsWith("/admin/jobs/") && pathname.endsWith("/edit")) {
    return "Edit Job";
  }

  if (pathname.startsWith("/admin/applications/")) {
    return "Application Details";
  }

  const segments = pathname.split("/").filter(Boolean);
  return segments.length ? formatSegment(segments[segments.length - 1]) : "Dashboard";
}

export function getAdminBreadcrumbs(pathname: string) {
  const segments = pathname.split("/").filter(Boolean);

  return segments.map((segment, index) => {
    const href = `/${segments.slice(0, index + 1).join("/")}`;

    if (href === "/admin") {
      return { label: "Admin", href };
    }

    if (href.startsWith("/admin/jobs/") && href.endsWith("/edit")) {
      return { label: "Edit", href };
    }

    if (href.startsWith("/admin/applications/")) {
      return { label: "Detail", href };
    }

    return { label: formatSegment(segment), href };
  });
}

export function isPathActive(pathname: string, href: string) {
  const normalized = href.split("?")[0];

  if (normalized === "/admin") {
    return pathname === "/admin";
  }

  return pathname === normalized || pathname.startsWith(`${normalized}/`);
}

export const adminQuickActions = [
  { label: "Alerts", icon: BellRing },
  { label: "Settings", icon: Settings },
];
