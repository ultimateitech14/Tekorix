import { z } from "zod";

import { MAX_TALENT_PROFILES } from "@/lib/talent-profiles";

const optionalTrimmedString = (max: number) =>
  z.preprocess(
    (value) => {
      if (typeof value !== "string") {
        return undefined;
      }

      return value.trim();
    },
    z.string().max(max).optional(),
  );

const optionalBoolean = z.boolean().optional();

const teamMemberSchema = z.object({
  id: optionalTrimmedString(120),
  name: optionalTrimmedString(160),
  role: optionalTrimmedString(200),
  photo: optionalTrimmedString(4_000_000),
  blurb: optionalTrimmedString(2_000),
});

const talentProfileSchema = z.object({
  id: optionalTrimmedString(160),
  name: optionalTrimmedString(160),
  role: optionalTrimmedString(200),
  yearsOfExperience: z.number().int().min(1).max(40).optional(),
  rating: z.number().int().min(1).max(5).optional(),
  summary: optionalTrimmedString(500),
  detailedSummary: optionalTrimmedString(2_000),
  expertise: z.array(z.string().trim().min(1).max(120)).max(12).optional(),
  avatar: optionalTrimmedString(4_000_000),
  resumeCtaLabel: optionalTrimmedString(120),
});

export const siteSettingsUpdateSchema = z
  .object({
    companyName: optionalTrimmedString(300),
    companyEmail: optionalTrimmedString(320),
    companyPhone: optionalTrimmedString(100),
    companyAddress: optionalTrimmedString(600),
    companyGoogleMapLink: optionalTrimmedString(2_000),
    careersDomain: optionalTrimmedString(300),
    careersHeadline: optionalTrimmedString(500),
    careersSubtitle: optionalTrimmedString(4_000),
    careersPublished: optionalBoolean,
    careersShowTeamPhotos: optionalBoolean,
    careersAutoPublishJobs: optionalBoolean,
    careersTeamMembers: z.array(teamMemberSchema).max(8).optional(),
    talentProfilesEyebrow: optionalTrimmedString(160),
    talentProfilesHeadline: optionalTrimmedString(500),
    talentProfilesDescription: optionalTrimmedString(2_000),
    talentProfiles: z.array(talentProfileSchema).max(MAX_TALENT_PROFILES).optional(),
    notificationEmailProvider: optionalTrimmedString(160),
    notificationEmailApiKey: optionalTrimmedString(2_000),
    notificationFromEmail: optionalTrimmedString(320),
  })
  .refine((value) => Object.values(value).some((item) => item !== undefined), {
    message: "At least one setting is required.",
  });

export type SiteSettingsUpdateInput = z.infer<typeof siteSettingsUpdateSchema>;
