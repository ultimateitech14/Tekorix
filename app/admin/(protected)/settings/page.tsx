/* eslint-disable @next/next/no-img-element */

"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { TalentProfilesSettings } from "@/components/admin/TalentProfilesSettings";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { readFileAsDataUrl, validateImageUploadFile } from "@/lib/image-upload";
import { cn } from "@/lib/utils";

type SettingsTab = "company" | "careers" | "talent-profiles";

type CareersTeamMemberPayload = {
  id: string;
  name: string;
  role: string;
  photo: string;
  blurb: string;
};

type SiteSettingsPayload = {
  careersHeadline: string;
  careersSubtitle: string;
  careersPublished: boolean;
  careersShowTeamPhotos: boolean;
  careersTeamMembers: CareersTeamMemberPayload[];
};

type CompanyProfileData = {
  companyName: string;
  email: string;
  phone: string;
  address: string;
  googleMapLink: string;
};

type CompanyProfileErrors = Partial<Record<keyof CompanyProfileData, string>>;
const MAX_TEAM_MEMBERS = 8;
const COMPANY_PROFILE_STORAGE_KEY = "company_profile";
const DEFAULT_PROFILE_IMAGE = "/images/profiles/profile-3.svg";

function parseSettingsTab(value: string | null): SettingsTab {
  if (value === "careers" || value === "talent-profiles" || value === "company") {
    return value;
  }

  return "company";
}

function asTrimmedText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function createTeamMemberTemplate(index: number): CareersTeamMemberPayload {
  const id = `team-${String(index + 1).padStart(2, "0")}`;

  return {
    id,
    name: "",
    role: "",
    photo: DEFAULT_PROFILE_IMAGE,
    blurb: "",
  };
}

function getEmptyCompanyProfile(): CompanyProfileData {
  return {
    companyName: "",
    email: "",
    phone: "",
    address: "",
    googleMapLink: "",
  };
}

function parseStoredCompanyProfile(raw: string | null): CompanyProfileData {
  if (!raw) {
    return getEmptyCompanyProfile();
  }

  try {
    const parsed = JSON.parse(raw) as Partial<CompanyProfileData>;

    return {
      companyName: typeof parsed.companyName === "string" ? parsed.companyName : "",
      email: typeof parsed.email === "string" ? parsed.email : "",
      phone: typeof parsed.phone === "string" ? parsed.phone : "",
      address: typeof parsed.address === "string" ? parsed.address : "",
      googleMapLink: typeof parsed.googleMapLink === "string" ? parsed.googleMapLink : "",
    };
  } catch {
    return getEmptyCompanyProfile();
  }
}

function validateCompanyProfile(values: CompanyProfileData) {
  const errors: CompanyProfileErrors = {};
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!values.companyName.trim()) {
    errors.companyName = "Company Name is required.";
  }

  if (!values.email.trim()) {
    errors.email = "Email is required.";
  } else if (!emailPattern.test(values.email.trim())) {
    errors.email = "Enter a valid email address.";
  }

  if (values.googleMapLink.trim() && !values.googleMapLink.trim().toLowerCase().startsWith("http")) {
    errors.googleMapLink = "Google Map Link must start with http.";
  }

  return errors;
}

function SettingsPageContent() {
  const router = useRouter();
  const pathname = usePathname() ?? "/admin/settings";
  const searchParams = useSearchParams();

  const activeTab = useMemo(() => parseSettingsTab(searchParams?.get("tab") ?? null), [searchParams]);

  const [companyName, setCompanyName] = useState("");
  const [companyEmail, setCompanyEmail] = useState("");
  const [companyPhone, setCompanyPhone] = useState("");
  const [companyAddress, setCompanyAddress] = useState("");
  const [companyGoogleMapLink, setCompanyGoogleMapLink] = useState("");
  const [companyErrors, setCompanyErrors] = useState<CompanyProfileErrors>({});

  const [careersHeadline, setCareersHeadline] = useState("Build products that help teams hire better.");
  const [careersSubtitle, setCareersSubtitle] = useState(
    "We are hiring across product, engineering, and operations. Join us to shape the future of recruiting.",
  );
  const [careersPublished, setCareersPublished] = useState(true);
  const [careersShowTeamPhotos, setCareersShowTeamPhotos] = useState(true);
  const [careersTeamMembers, setCareersTeamMembers] = useState<CareersTeamMemberPayload[]>([
    createTeamMemberTemplate(0),
  ]);

  const [isLoadingSettings, setIsLoadingSettings] = useState(true);
  const [isSavingCompany, setIsSavingCompany] = useState(false);
  const [isSavingCareers, setIsSavingCareers] = useState(false);

  useEffect(() => {
    const stored = parseStoredCompanyProfile(window.localStorage.getItem(COMPANY_PROFILE_STORAGE_KEY));

    setCompanyName(stored.companyName);
    setCompanyEmail(stored.email);
    setCompanyPhone(stored.phone);
    setCompanyAddress(stored.address);
    setCompanyGoogleMapLink(stored.googleMapLink);
  }, []);

  useEffect(() => {
    let active = true;

    async function loadSettings() {
      setIsLoadingSettings(true);

      try {
        const response = await fetch("/api/admin/site-settings", {
          cache: "no-store",
          credentials: "include",
        });
        const payload = (await response.json()) as { data?: SiteSettingsPayload };

        if (!response.ok || !payload.data || !active) {
          return;
        }

        setCareersHeadline(payload.data.careersHeadline);
        setCareersSubtitle(payload.data.careersSubtitle);
        setCareersPublished(Boolean(payload.data.careersPublished));
        setCareersShowTeamPhotos(Boolean(payload.data.careersShowTeamPhotos));
        setCareersTeamMembers(
          payload.data.careersTeamMembers?.length ? payload.data.careersTeamMembers : [createTeamMemberTemplate(0)],
        );
      } finally {
        if (active) {
          setIsLoadingSettings(false);
        }
      }
    }

    void loadSettings();

    return () => {
      active = false;
    };
  }, []);

  function handleTabChange(nextTab: string) {
    const parsed = parseSettingsTab(nextTab);
    const params = new URLSearchParams(searchParams?.toString() ?? "");

    if (parsed === "company") {
      params.delete("tab");
    } else {
      params.set("tab", parsed);
    }

    const nextQuery = params.toString();
    router.replace(nextQuery ? `${pathname}?${nextQuery}` : pathname, { scroll: false });
  }

  function updateTeamMember(memberId: string, patch: Partial<CareersTeamMemberPayload>) {
    setCareersTeamMembers((current) => current.map((item) => (item.id === memberId ? { ...item, ...patch } : item)));
  }

  function isUploadedImage(value: string) {
    return value.trim().toLowerCase().startsWith("data:image/");
  }

  async function handleTeamMemberPhotoUpload(memberId: string, fileList: FileList | null) {
    const file = fileList?.[0];

    if (!file) {
      return;
    }

    const error = validateImageUploadFile(file);

    if (error) {
      toast.error(error);
      return;
    }

    try {
      const dataUrl = await readFileAsDataUrl(file);
      updateTeamMember(memberId, { photo: dataUrl });
      toast.success("Team member image selected.");
    } catch {
      toast.error("Unable to read image file.");
    }
  }

  function removeUploadedTeamMemberPhoto(memberId: string) {
    updateTeamMember(memberId, { photo: "" });
    toast.success("Uploaded image removed.");
  }

  function addTeamMember() {
    setCareersTeamMembers((current) => {
      if (current.length >= MAX_TEAM_MEMBERS) {
        toast.error(`You can add up to ${MAX_TEAM_MEMBERS} team members.`);
        return current;
      }

      return [...current, createTeamMemberTemplate(current.length)];
    });
  }

  function removeTeamMember(memberId: string) {
    setCareersTeamMembers((current) => {
      if (current.length <= 1) {
        return [createTeamMemberTemplate(0)];
      }

      return current.filter((item) => item.id !== memberId);
    });
  }

  function saveCompanyProfile() {
    setIsSavingCompany(true);

    const profile: CompanyProfileData = {
      companyName: companyName.trim(),
      email: companyEmail.trim(),
      phone: companyPhone.trim(),
      address: companyAddress.trim(),
      googleMapLink: companyGoogleMapLink.trim(),
    };

    const errors = validateCompanyProfile(profile);

    if (Object.keys(errors).length > 0) {
      setCompanyErrors(errors);
      setIsSavingCompany(false);
      return;
    }

    setCompanyErrors({});

    try {
      window.localStorage.setItem(COMPANY_PROFILE_STORAGE_KEY, JSON.stringify(profile));
      toast.success("Company profile saved");
    } catch {
      toast.error("Unable to save company profile.");
    } finally {
      setIsSavingCompany(false);
    }
  }

  async function saveCareersControls() {
    setIsSavingCareers(true);

    try {
      const sanitizedMembers = careersTeamMembers
        .slice(0, MAX_TEAM_MEMBERS)
        .map((member, index) => {
          const id = asTrimmedText(member.id) || `team-${String(index + 1).padStart(2, "0")}`;
          const name = asTrimmedText(member.name);
          const role = asTrimmedText(member.role);
          const photo = asTrimmedText(member.photo);
          const blurb = asTrimmedText(member.blurb);

          return {
            id,
            name,
            role,
            photo,
            blurb,
          } satisfies CareersTeamMemberPayload;
        })
        .filter((member) => member.name || member.role || member.blurb || member.photo);

      const response = await fetch("/api/admin/site-settings", {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          careersHeadline,
          careersSubtitle,
          careersPublished,
          careersShowTeamPhotos,
          careersTeamMembers: sanitizedMembers,
        }),
      });

      if (!response.ok) {
        const errorPayload = (await response.json().catch(() => null)) as { message?: string } | null;
        throw new Error(errorPayload?.message ?? "Unable to save careers settings.");
      }

      toast.success("Careers controls saved.");
      router.refresh();
    } catch (error) {
      if (error instanceof Error && error.message) {
        toast.error(error.message);
      } else {
        toast.error("Unable to save careers controls.");
      }
    } finally {
      setIsSavingCareers(false);
    }
  }

  return (
    <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-4">
      <TabsList className="bg-white/10">
        <TabsTrigger value="company">Company Profile</TabsTrigger>
        <TabsTrigger value="careers">Careers Page Controls</TabsTrigger>
        <TabsTrigger value="talent-profiles">Talent Profiles Section</TabsTrigger>
      </TabsList>

      <TabsContent value="company">
        <Card className="border-[#D4E8FC] bg-[#F8FBFF] backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-xl text-slate-900">Company Profile</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-[0.16em] text-slate-500">Company Name</Label>
              <Input
                value={companyName}
                onChange={(event) => {
                  setCompanyName(event.target.value);
                  setCompanyErrors((current) => ({ ...current, companyName: undefined }));
                }}
                className="border-[#D4E8FC] bg-[#F8FBFF] text-slate-900"
              />
              {companyErrors.companyName ? <p className="text-xs text-red-300">{companyErrors.companyName}</p> : null}
            </div>

            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-[0.16em] text-slate-500">Email</Label>
              <Input
                type="email"
                value={companyEmail}
                onChange={(event) => {
                  setCompanyEmail(event.target.value);
                  setCompanyErrors((current) => ({ ...current, email: undefined }));
                }}
                className="border-[#D4E8FC] bg-[#F8FBFF] text-slate-900"
              />
              {companyErrors.email ? <p className="text-xs text-red-300">{companyErrors.email}</p> : null}
            </div>

            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-[0.16em] text-slate-500">Phone</Label>
              <Input
                type="tel"
                value={companyPhone}
                onChange={(event) => setCompanyPhone(event.target.value)}
                className="border-[#D4E8FC] bg-[#F8FBFF] text-slate-900"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-[0.16em] text-slate-500">Google Map Link</Label>
              <Input
                type="url"
                value={companyGoogleMapLink}
                onChange={(event) => {
                  setCompanyGoogleMapLink(event.target.value);
                  setCompanyErrors((current) => ({ ...current, googleMapLink: undefined }));
                }}
                className="border-[#D4E8FC] bg-[#F8FBFF] text-slate-900"
              />
              <p className="text-xs text-slate-500">
                Paste a Google Maps share link. Example: https://maps.google.com/?q=...
              </p>
              {companyErrors.googleMapLink ? (
                <p className="text-xs text-red-300">{companyErrors.googleMapLink}</p>
              ) : null}
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label className="text-xs uppercase tracking-[0.16em] text-slate-500">Address</Label>
              <Textarea
                rows={4}
                value={companyAddress}
                onChange={(event) => setCompanyAddress(event.target.value)}
                className="border-[#D4E8FC] bg-[#F8FBFF] text-slate-900"
              />
            </div>

            <div className="md:col-span-2">
              <Button onClick={saveCompanyProfile} disabled={isSavingCompany}>
                {isSavingCompany ? "Saving..." : "Save Company Profile"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="careers">
        <Card className="border-[#D4E8FC] bg-[#F8FBFF] backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-xl text-slate-900">Careers Page Controls</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-[0.16em] text-slate-500">Headline</Label>
              <Input
                value={careersHeadline}
                onChange={(event) => setCareersHeadline(event.target.value)}
                className="border-[#D4E8FC] bg-[#F8FBFF] text-slate-900"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-[0.16em] text-slate-500">Subtitle</Label>
              <Textarea
                value={careersSubtitle}
                onChange={(event) => setCareersSubtitle(event.target.value)}
                className="min-h-28 border-[#D4E8FC] bg-[#F8FBFF] text-slate-900"
              />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-lg border border-[#D4E8FC] bg-[#F8FBFF] p-3">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">Publish Careers Page</p>
                    <p className="text-xs text-slate-500">{careersPublished ? "Published" : "Unpublished"}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setCareersPublished((value) => !value)}
                    className={cn(
                      "relative inline-flex h-7 w-14 items-center rounded-full border transition-colors",
                      careersPublished ? "border-amber-300/60 bg-amber-300/30" : "border-[#BAD7F6] bg-slate-500/20",
                    )}
                    aria-label="Toggle careers published state"
                  >
                    <span
                      className={cn(
                        "inline-block h-5 w-5 rounded-full bg-white transition-transform",
                        careersPublished ? "translate-x-8" : "translate-x-1",
                      )}
                    />
                  </button>
                </div>
              </div>

              <div className="rounded-lg border border-[#D4E8FC] bg-[#F8FBFF] p-3">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">Show Team Photos</p>
                    <p className="text-xs text-slate-500">{careersShowTeamPhotos ? "Enabled" : "Disabled"}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setCareersShowTeamPhotos((value) => !value)}
                    className={cn(
                      "relative inline-flex h-7 w-14 items-center rounded-full border transition-colors",
                      careersShowTeamPhotos
                        ? "border-amber-300/60 bg-amber-300/30"
                        : "border-[#BAD7F6] bg-slate-500/20",
                    )}
                    aria-label="Toggle team photos"
                  >
                    <span
                      className={cn(
                        "inline-block h-5 w-5 rounded-full bg-white transition-transform",
                        careersShowTeamPhotos ? "translate-x-8" : "translate-x-1",
                      )}
                    />
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-3 rounded-lg border border-[#D4E8FC] bg-[#F8FBFF] p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="text-sm font-semibold text-slate-900">Team Members</p>
                  <p className="text-xs text-slate-500">
                    Update team cards shown on the careers page. Add up to {MAX_TEAM_MEMBERS}.
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  className="border-[#C3DDF9] bg-[#F8FBFF] text-slate-900 hover:bg-white/[0.08]"
                  onClick={addTeamMember}
                  disabled={careersTeamMembers.length >= MAX_TEAM_MEMBERS}
                >
                  <Plus className="h-4 w-4" />
                  Add Team Member
                </Button>
              </div>

              <div className="space-y-3">
                {careersTeamMembers.map((member, index) => (
                  <div key={member.id} className="space-y-3 rounded-md border border-[#D4E8FC] bg-[#F8FBFF] p-3">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm text-amber-700">Member {index + 1}</p>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="border-[#C3DDF9] bg-[#F8FBFF] text-slate-900 hover:bg-white/[0.08]"
                        onClick={() => removeTeamMember(member.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Remove
                      </Button>
                    </div>

                    <div className="grid gap-3 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label className="text-xs text-slate-500">Name</Label>
                        <Input
                          value={member.name}
                          onChange={(event) => updateTeamMember(member.id, { name: event.target.value })}
                          className="border-[#D4E8FC] bg-[#F4F9FF] text-slate-900"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs text-slate-500">Role</Label>
                        <Input
                          value={member.role}
                          onChange={(event) => updateTeamMember(member.id, { role: event.target.value })}
                          className="border-[#D4E8FC] bg-[#F4F9FF] text-slate-900"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs text-slate-500">Photo URL / Path</Label>
                      <Input
                        value={member.photo}
                        onChange={(event) => updateTeamMember(member.id, { photo: event.target.value })}
                        placeholder={DEFAULT_PROFILE_IMAGE}
                        className="border-[#D4E8FC] bg-[#F4F9FF] text-slate-900"
                      />
                      <div className="flex items-center gap-3 rounded-md border border-[#D4E8FC] bg-white/[0.02] p-2">
                        {member.photo.trim() ? (
                          <img
                            src={member.photo}
                            alt={member.name ? `${member.name} preview` : `Member ${index + 1} preview`}
                            className="h-12 w-12 rounded-full border border-[#D4E8FC] object-cover"
                            onError={(event) => {
                              event.currentTarget.src = DEFAULT_PROFILE_IMAGE;
                            }}
                          />
                        ) : (
                          <div className="h-12 w-12 rounded-full border border-[#D4E8FC] bg-[#F8FBFF]" />
                        )}
                        <p className="text-xs text-slate-500">Photo preview</p>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs text-slate-500">Choose Image</Label>
                        <Input
                          type="file"
                          accept="image/*"
                          className="border-[#D4E8FC] bg-[#F4F9FF] text-slate-900 file:mr-3 file:rounded-md file:border-0 file:bg-amber-300/15 file:px-3 file:py-1 file:text-xs file:text-amber-700"
                          onChange={(event) => {
                            void handleTeamMemberPhotoUpload(member.id, event.target.files);
                            event.currentTarget.value = "";
                          }}
                        />
                        <p className="text-xs text-slate-500">Allowed image size: minimum 50KB and maximum 800KB.</p>
                        {isUploadedImage(member.photo) ? (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="border-[#C3DDF9] bg-[#F8FBFF] text-slate-900 hover:bg-white/[0.08]"
                            onClick={() => removeUploadedTeamMemberPhoto(member.id)}
                          >
                            Remove Uploaded Image
                          </Button>
                        ) : null}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs text-slate-500">Short Bio</Label>
                      <Textarea
                        value={member.blurb}
                        onChange={(event) => updateTeamMember(member.id, { blurb: event.target.value })}
                        className="min-h-20 border-[#D4E8FC] bg-[#F4F9FF] text-slate-900"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Button onClick={saveCareersControls} disabled={isLoadingSettings || isSavingCareers}>
              {isSavingCareers ? "Saving..." : "Save Careers Controls"}
            </Button>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="talent-profiles">
        <TalentProfilesSettings />
      </TabsContent>
    </Tabs>
  );
}

export default function SettingsPage() {
  return (
    <Suspense fallback={<div className="space-y-4">Loading settings...</div>}>
      <SettingsPageContent />
    </Suspense>
  );
}


