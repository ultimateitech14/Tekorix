import type { LucideIcon } from "lucide-react";
import { BriefcaseBusiness, Building2, Layers, Shield, Target, Users2, Waypoints } from "lucide-react";

export type ServiceCatalogItem = {
  id: string;
  title: string;
  shortDescription: string;
  description: string;
  icon: LucideIcon;
  core?: boolean;
  features: string[];
  benefits: string[];
};

export const serviceCatalog: ServiceCatalogItem[] = [
  {
    id: "product-engineering",
    title: "Product Engineering",
    shortDescription: "Delivery support for product, platform, and engineering programmes that need stronger execution capacity.",
    description:
      "Tekorix supports product and platform initiatives with engineering capability that improves throughput, delivery confidence, and release momentum. The focus stays on practical execution support rather than generic outsourcing language.",
    icon: Layers,
    features: [
      "Engineering support for roadmap-driven delivery",
      "Execution capacity across product, platform, and release work",
      "Flexible alignment with internal squads and programme owners",
      "Delivery continuity without forcing a full team replacement",
    ],
    benefits: [
      "Stronger delivery momentum",
      "Reduced execution bottlenecks",
      "Better continuity across product milestones",
      "Practical support for scale-up phases",
    ],
  },
  {
    id: "on-roll-staffing",
    title: "On-Roll Staffing",
    shortDescription:
      "Deploy consultants managed through Tekorix when clients need specialist capability with continuity and operational cover.",
    description:
      "On-roll staffing gives clients access to managed consultant deployment when continuity, oversight, and quick onboarding matter. Tekorix handles coordination so internal teams can focus on outcomes instead of admin overhead.",
    icon: Shield,
    core: true,
    features: [
      "Managed consultant deployment through Tekorix",
      "Faster onboarding for urgent specialist demand",
      "Operational continuity with clear commercial structure",
      "Support for delivery teams that need dependable coverage",
    ],
    benefits: [
      "Lower hiring overhead",
      "Faster access to vetted specialists",
      "Clear continuity model for delivery teams",
      "Practical control without long hiring cycles",
    ],
  },
  {
    id: "contract-staffing",
    title: "Contract Staffing",
    shortDescription: "Flexible contract hiring for programmes that need speed, niche expertise, or variable delivery pacing.",
    description:
      "Contract staffing helps companies respond to delivery surges, transformation projects, and specialist gaps without overcommitting long-term. Tekorix keeps the model fast, focused, and aligned to actual project pressure.",
    icon: BriefcaseBusiness,
    core: true,
    features: [
      "Fast access to contract specialists",
      "Support for project-based and time-bound demand",
      "Flexible scaling for changing roadmap pressure",
      "Coverage for niche capability gaps",
    ],
    benefits: [
      "Greater delivery flexibility",
      "Speed for urgent team needs",
      "Access to niche expertise",
      "Easier adjustment to shifting programme scope",
    ],
  },
  {
    id: "team-building",
    title: "Team Building",
    shortDescription: "Assemble delivery-ready engineering teams instead of solving every capability gap one role at a time.",
    description:
      "Tekorix helps companies build dedicated teams and specialist pods with structure, role balance, and delivery rhythm already considered. This is useful when organizations need more than isolated hiring support.",
    icon: Users2,
    core: true,
    features: [
      "Dedicated teams shaped around delivery goals",
      "Role mix planning instead of isolated requisitions",
      "Support for product pods, benches, and programme squads",
      "Ramp planning matched to expected delivery velocity",
    ],
    benefits: [
      "Faster team formation",
      "Better role balance from the start",
      "More stable programme execution",
      "Stronger fit for scale-up delivery needs",
    ],
  },
  {
    id: "gcc-setup",
    title: "GCC Setup",
    shortDescription:
      "Support capability center extensions with the team structure, staffing path, and early delivery rhythm needed to start well.",
    description:
      "For organizations building or extending GCC capability, Tekorix supports the early staffing and team-shaping decisions that make the operating model more workable from day one.",
    icon: Building2,
    features: [
      "Support for early GCC team composition",
      "Staffing paths matched to capability-center goals",
      "Guidance for delivery rhythm and operating setup",
      "Structured support beyond one-off role filling",
    ],
    benefits: [
      "Better early-stage GCC stability",
      "Clearer setup path for capability expansion",
      "Stronger alignment between hiring and operations",
      "Reduced friction during launch and ramp-up",
    ],
  },
  {
    id: "staff-augmentation",
    title: "Staff Augmentation",
    shortDescription: "Add targeted engineering strength to internal teams when the roadmap is moving faster than current bandwidth.",
    description:
      "Staff augmentation is designed for teams that already have delivery ownership but need more specialist capacity to keep pace. Tekorix plugs in targeted support where the bottleneck actually exists.",
    icon: Waypoints,
    core: true,
    features: [
      "Targeted specialist augmentation for internal teams",
      "Flexible deployment into existing delivery workflows",
      "Support for short-to-mid term execution gaps",
      "Focused capability where current bandwidth is constrained",
    ],
    benefits: [
      "Faster relief for delivery pressure",
      "Minimal disruption to existing team structures",
      "Practical extension of current engineering bandwidth",
      "Higher roadmap confidence",
    ],
  },
  {
    id: "consulting-services",
    title: "HR Consulting",
    shortDescription:
      "People strategy, hiring process design, and workforce consulting support for teams that need structured growth.",
    description:
      "Tekorix HR Consulting supports organizations with practical people and hiring decisions before scaling delivery. The focus stays on workforce planning, role clarity, hiring process improvement, and team design so growth can happen without execution confusion.",
    icon: Target,
    features: [
      "Workforce planning and headcount strategy for growth stages",
      "Role design and competency mapping across critical functions",
      "Hiring process improvement (screening, interview flow, offer conversion)",
      "Compensation and talent benchmarking inputs for market-aligned hiring",
    ],
    benefits: [
      "Clear hiring roadmap aligned to business growth goals",
      "Faster recruitment cycles with better candidate quality",
      "Improved role clarity across hiring managers and teams",
      "Lower hiring friction with actionable, implementation-ready recommendations",
    ],
  },
];

export const serviceDeliveryFlow = [
  {
    title: "Assess the gap",
    description: "Clarify whether the real need is for talent, team structure, GCC growth, or consulting-led discovery.",
  },
  {
    title: "Choose the model",
    description: "Use the right mix of on-roll, contract, augmentation, or team-building support for the current delivery pressure.",
  },
  {
    title: "Sustain outcomes",
    description: "Keep execution stable through practical ownership, continuity, and a hiring structure that can scale with the programme.",
  },
];

export const serviceValuePoints = [
  {
    icon: Users2,
    title: "Staffing and team building stay central",
    description: "The services story remains commercially clear even while broader delivery support sits around it.",
  },
  {
    icon: BriefcaseBusiness,
    title: "Flexible engagement models",
    description: "Permanent, contract, on-roll, and pod-based support can sit under one practical services structure.",
  },
  {
    icon: Building2,
    title: "Built for scale-up and GCC needs",
    description: "The offer extends beyond role filling into more structured capability and execution support.",
  },
];

export function getServiceById(serviceId: string) {
  return serviceCatalog.find((item) => item.id === serviceId);
}

export function getRelatedServices(serviceId: string, count = 3) {
  const preferred = serviceCatalog.filter((item) => item.id !== serviceId && item.core);

  if (preferred.length >= count) {
    return preferred.slice(0, count);
  }

  const fallback = serviceCatalog.filter((item) => item.id !== serviceId && !preferred.some((entry) => entry.id === item.id));
  return [...preferred, ...fallback].slice(0, count);
}
