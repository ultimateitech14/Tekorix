import { requestApi } from "@/lib/api/http";

export type PublicSiteSettings = {
  companyName: string;
  companyEmail: string;
  companyPhone: string;
  companyAddress: string;
  companyGoogleMapLink: string;
  careersDomain: string;
  careersHeadline: string;
  careersSubtitle: string;
  careersPublished: boolean;
  careersShowTeamPhotos: boolean;
  careersAutoPublishJobs: boolean;
  careersTeamMembers: Array<{
    id: string;
    name: string;
    role: string;
    photo: string;
    blurb: string;
  }>;
  talentProfilesEyebrow: string;
  talentProfilesHeadline: string;
  talentProfilesDescription: string;
  talentProfiles: Array<{
    id: string;
    name: string;
    role: string;
    yearsOfExperience: number;
    rating: number;
    summary: string;
    detailedSummary: string;
    expertise: string[];
    avatar: string;
    resumeCtaLabel: string;
  }>;
};

export async function getPublicSiteSettings() {
  const result = await requestApi<PublicSiteSettings>("/api/v1/site-settings");
  return result.data;
}
