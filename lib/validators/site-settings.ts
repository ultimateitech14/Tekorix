import { z } from "zod";

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

export const siteSettingsUpdateSchema = z
  .object({
    companyName: optionalTrimmedString(300),
    companyEmail: optionalTrimmedString(320),
    companyPhone: optionalTrimmedString(100),
    careersDomain: optionalTrimmedString(300),
    careersHeadline: optionalTrimmedString(500),
    careersSubtitle: optionalTrimmedString(4_000),
    careersPublished: optionalBoolean,
    careersShowTeamPhotos: optionalBoolean,
    careersAutoPublishJobs: optionalBoolean,
    careersTeamMembers: z.array(teamMemberSchema).max(8).optional(),
  })
  .refine((value) => Object.values(value).some((item) => item !== undefined), {
    message: "At least one setting is required.",
  });

export type SiteSettingsUpdateInput = z.infer<typeof siteSettingsUpdateSchema>;
