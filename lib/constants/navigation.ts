import type { LucideIcon } from "lucide-react";
import {
  Award,
  BriefcaseBusiness,
  Building2,
  GraduationCap,
  House,
  Layers,
  PhoneCall,
  Users2,
} from "lucide-react";

export type NavigationChild = {
  label: string;
  href: string;
  description: string;
  icon: LucideIcon;
};

export type NavigationItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  featured?: {
    label: string;
    description: string;
  };
  children?: NavigationChild[];
};

export const navigationItems: NavigationItem[] = [
  { label: "Home", href: "/", icon: House },
  {
    label: "Services",
    href: "/services",
    icon: BriefcaseBusiness,
    featured: {
      label: "All Services",
      description: "Explore HR, Business, Academy, and Industries pathways.",
    },
    children: [
      {
        label: "HR",
        href: "/services/consulting-services",
        description: "People strategy, hiring support, and workforce consulting for growth teams.",
        icon: Users2,
      },
      {
        label: "Business",
        href: "/business-consulting",
        description: "Business consulting support for planning, transformation, and execution clarity.",
        icon: BriefcaseBusiness,
      },
      {
        label: "Academy",
        href: "/academy",
        description: "Learning programs for corporate training, upskilling, and certification readiness.",
        icon: Building2,
      },
      {
        label: "Industries We Serve",
        href: "/industries",
        description: "Sector-focused support across technology, BFSI, healthcare, and manufacturing.",
        icon: Layers,
      },
    ],
  },
  {
    label: "Academy",
    href: "/academy",
    icon: GraduationCap,
    featured: {
      label: "All Academy Programs",
      description: "Explore corporate training, upskilling tracks, and certification support.",
    },
    children: [
      {
        label: "Corporate Training",
        href: "/academy/corporate-training",
        description: "Structured training programs for teams to improve delivery readiness.",
        icon: Building2,
      },
      {
        label: "Upskilling",
        href: "/academy/upskilling",
        description: "Role-based learning paths to grow technical and professional capability.",
        icon: GraduationCap,
      },
      {
        label: "Certification",
        href: "/academy/certification",
        description: "Guided preparation support for recognized technical certifications.",
        icon: Award,
      },
    ],
  },
  { label: "About", href: "/about", icon: Building2 },
  { label: "Contact Us", href: "/contact", icon: PhoneCall },
];

export const navigationCtas = {
  hireTalent: { label: "Hire Talent", href: "/find-talent" },
  findJob: { label: "Find a Job", href: "/find-job" },
} as const;
