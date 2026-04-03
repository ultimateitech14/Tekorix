export type NavigationItem = {
  label: string;
  href: string;
};

export const navigationItems: NavigationItem[] = [
  { label: "Find Talent", href: "/find-talent" },
  { label: "Find a Job", href: "/find-job" },
  { label: "Business Consulting", href: "/business-consulting" },
  { label: "Academy", href: "/academy" },
  { label: "About", href: "/about" },
  { label: "Industries", href: "/industries" },
  { label: "Clients", href: "/clients" },
  { label: "Technologies", href: "/technologies" },
  { label: "Services", href: "/services" },
  { label: "Contact Us", href: "/contact" },
];

export const navigationCtas = {
  hireTalent: { label: "Hire Talent", href: "/find-talent" },
  findJob: { label: "Find a Job", href: "/find-job" },
} as const;
