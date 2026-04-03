export const publicBrandContent = {
  companyName: "Tekorix",
  siteTitle: "Tekorix",
  defaultMetaDescription:
    "Tekorix delivers consulting, talent, and engineering support for modern digital programmes.",
} as const;

export const publicOfficeContent = {
  city: "Bengaluru",
  state: "Karnataka",
  country: "India",
  displayAddress: "Bengaluru, Karnataka, India",
  addressLines: ["Bengaluru, Karnataka, India"],
  officeHours: "Mon-Fri | 9:00 AM - 6:00 PM IST",
  mapPlaceholderEyebrow: "Regional footprint",
  mapPlaceholderTitle: "Tekorix office and coverage view",
  mapPlaceholderDescription:
    "Replace this panel with the approved map embed or regional footprint visual when that asset is ready.",
} as const;

export const publicContactContent = {
  companyName: publicBrandContent.companyName,
  email: "hello@tekorix.com",
  phone: "+91 80 0000 0000",
  whatsAppHref: "",
  officeHours: publicOfficeContent.officeHours,
  primaryOffice: publicOfficeContent.displayAddress,
  addressLines: publicOfficeContent.addressLines,
  city: publicOfficeContent.city,
  state: publicOfficeContent.state,
  country: publicOfficeContent.country,
  deliveryCoverage: "India, GCC extensions, and distributed global teams",
  workingStyle: "Remote, hybrid, and embedded client support models",
} as const;

export const publicSocialLinks = {
  linkedinCompany: "https://www.linkedin.com/",
  linkedinLeadership: "https://www.linkedin.com/",
  linkedinUpdates: "https://www.linkedin.com/",
} as const;

export const publicLeadershipPlaceholders = [
  {
    name: "Leadership profile 01",
    role: "Delivery leadership",
    detail: "Guides programme structure, client visibility, and delivery continuity across engagements.",
    linkedInUrl: publicSocialLinks.linkedinLeadership,
  },
  {
    name: "Leadership profile 02",
    role: "Talent and workforce leadership",
    detail:
      "Shapes hiring paths, staffing models, and candidate quality across specialist and team-based needs.",
    linkedInUrl: publicSocialLinks.linkedinLeadership,
  },
  {
    name: "Leadership profile 03",
    role: "Consulting and transformation leadership",
    detail:
      "Supports discovery, prioritization, and operating-model decisions for change-heavy environments.",
    linkedInUrl: publicSocialLinks.linkedinLeadership,
  },
] as const;

export const publicClientLogoPlaceholders = [
  { name: "Global SaaS Platform", href: "", logoImageSrc: "" },
  { name: "Enterprise ISV", href: "", logoImageSrc: "" },
  { name: "Digital Product Team", href: "", logoImageSrc: "" },
  { name: "Transformation Programme", href: "", logoImageSrc: "" },
  { name: "Regulated Enterprise", href: "", logoImageSrc: "" },
  { name: "Public Delivery Initiative", href: "", logoImageSrc: "" },
  { name: "Cloud Modernization Team", href: "", logoImageSrc: "" },
  { name: "Platform Operations Group", href: "", logoImageSrc: "" },
] as const;

export const publicFooterContent = {
  description:
    "Tekorix helps organizations build stronger engineering teams through specialist hiring, delivery-ready pods, consulting support, and long-term capability development.",
  tagline: "Find talent. Find jobs. Build capability.",
  legalLeft: "Tekorix delivers talent, consulting, and engineering support for modern digital programmes.",
  legalRight: "Need to start a conversation? Use Contact, Find Talent, or Find a Job.",
} as const;

export function getPublicWhatsAppHref() {
  const rawValue = publicContactContent.whatsAppHref.trim();

  if (!rawValue) {
    return "";
  }

  if (/^https?:\/\//i.test(rawValue)) {
    return rawValue;
  }

  const digits = rawValue.replace(/\D/g, "");
  return digits ? `https://wa.me/${digits}` : "";
}
