/* eslint-disable @next/next/no-img-element */

"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { AdminImageUploadField } from "@/components/admin/AdminImageUploadField";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { requestApi } from "@/lib/api/http";
import {
  MAX_TALENT_PROFILES,
  createTalentProfileTemplate,
  defaultTalentProfiles,
  normalizeTalentProfiles,
  type TalentProfile,
} from "@/lib/talent-profiles";
import {
  defaultTalentProfilesSectionContent,
  type TalentProfilesSectionContent,
} from "@/lib/talent-profiles-section";
import { cn } from "@/lib/utils";

const DEFAULT_PROFILE_IMAGE = "/images/profiles/profile-3.svg";

function skillsToText(skills: string[]) {
  return skills.join(", ");
}

function parseSkills(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 12);
}

function normalizeSectionContent(
  input: Partial<TalentProfilesSectionContent> | undefined,
): TalentProfilesSectionContent {
  return {
    eyebrow: input?.eyebrow?.trim() || defaultTalentProfilesSectionContent.eyebrow,
    title: input?.title?.trim() || defaultTalentProfilesSectionContent.title,
    description: input?.description?.trim() || defaultTalentProfilesSectionContent.description,
  };
}

function serializeSectionState(sectionContent: TalentProfilesSectionContent, profiles: TalentProfile[]) {
  return JSON.stringify({
    ...normalizeSectionContent(sectionContent),
    talentProfiles: normalizeTalentProfiles(profiles),
  });
}

function pruneEmptyProfiles(profiles: TalentProfile[]) {
  const pruned = profiles.filter((profile) =>
    [profile.name, profile.role, profile.summary, profile.detailedSummary].some((value) => value.trim().length > 0),
  );

  return pruned.length ? pruned : defaultTalentProfiles;
}

export function TalentProfilesSettings() {
  const [sectionEyebrow, setSectionEyebrow] = useState(defaultTalentProfilesSectionContent.eyebrow);
  const [sectionTitle, setSectionTitle] = useState(defaultTalentProfilesSectionContent.title);
  const [sectionDescription, setSectionDescription] = useState(defaultTalentProfilesSectionContent.description);
  const [profiles, setProfiles] = useState<TalentProfile[]>(defaultTalentProfiles);
  const [isReady, setIsReady] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [savedProfilesSignature, setSavedProfilesSignature] = useState(
    serializeSectionState(defaultTalentProfilesSectionContent, defaultTalentProfiles),
  );

  const loadProfiles = useCallback(async () => {
    try {
      const result = await requestApi<{
        talentProfilesEyebrow?: string;
        talentProfilesHeadline?: string;
        talentProfilesDescription?: string;
        talentProfiles?: TalentProfile[];
      }>("/api/admin/site-settings", {
        auth: true,
      });
      const nextSectionContent = normalizeSectionContent({
        eyebrow: result.data.talentProfilesEyebrow,
        title: result.data.talentProfilesHeadline,
        description: result.data.talentProfilesDescription,
      });
      const nextProfiles = normalizeTalentProfiles(result.data.talentProfiles ?? defaultTalentProfiles);
      const signature = serializeSectionState(nextSectionContent, nextProfiles);

      setSectionEyebrow(nextSectionContent.eyebrow);
      setSectionTitle(nextSectionContent.title);
      setSectionDescription(nextSectionContent.description);
      setProfiles(nextProfiles);
      setSavedProfilesSignature(signature);
    } catch {
      const fallbackSectionContent = normalizeSectionContent(defaultTalentProfilesSectionContent);
      const fallbackProfiles = normalizeTalentProfiles(defaultTalentProfiles);
      setSectionEyebrow(fallbackSectionContent.eyebrow);
      setSectionTitle(fallbackSectionContent.title);
      setSectionDescription(fallbackSectionContent.description);
      setProfiles(fallbackProfiles);
      setSavedProfilesSignature(serializeSectionState(fallbackSectionContent, fallbackProfiles));
      toast.error("Unable to load talent profiles.");
    } finally {
      setIsReady(true);
    }
  }, []);

  useEffect(() => {
    void loadProfiles();
  }, [loadProfiles]);

  const hasChanges = useMemo(() => {
    return (
      serializeSectionState(
        {
          eyebrow: sectionEyebrow,
          title: sectionTitle,
          description: sectionDescription,
        },
        profiles,
      ) !== savedProfilesSignature
    );
  }, [profiles, savedProfilesSignature, sectionDescription, sectionEyebrow, sectionTitle]);

  function updateProfile(profileId: string, patch: Partial<TalentProfile>) {
    setProfiles((current) => current.map((item) => (item.id === profileId ? { ...item, ...patch } : item)));
  }

  function addProfile() {
    if (profiles.length >= MAX_TALENT_PROFILES) {
      toast.error(`You can add up to ${MAX_TALENT_PROFILES} profiles.`);
      return;
    }

    setProfiles((current) => normalizeTalentProfiles([...current, createTalentProfileTemplate(current.length)]));
  }

  function removeProfile(profileId: string) {
    if (profiles.length <= 1) {
      toast.error("At least one profile is required.");
      return;
    }

    setProfiles((current) => normalizeTalentProfiles(current.filter((item) => item.id !== profileId)));
  }

  async function persistProfiles(
    nextSectionContent: TalentProfilesSectionContent,
    nextProfiles: TalentProfile[],
    successMessage: string,
  ) {
    const normalizedSectionContent = normalizeSectionContent(nextSectionContent);
    const normalized = normalizeTalentProfiles(pruneEmptyProfiles(nextProfiles));
    await requestApi("/api/admin/site-settings", {
      auth: true,
      method: "PUT",
      body: {
        talentProfilesEyebrow: normalizedSectionContent.eyebrow,
        talentProfilesHeadline: normalizedSectionContent.title,
        talentProfilesDescription: normalizedSectionContent.description,
        talentProfiles: normalized,
      },
    });

    const signature = serializeSectionState(normalizedSectionContent, normalized);
    setSectionEyebrow(normalizedSectionContent.eyebrow);
    setSectionTitle(normalizedSectionContent.title);
    setSectionDescription(normalizedSectionContent.description);
    setProfiles(normalized);
    setSavedProfilesSignature(signature);
    toast.success(successMessage);
  }

  async function saveProfiles() {
    setIsSaving(true);

    try {
      await persistProfiles(
        {
          eyebrow: sectionEyebrow,
          title: sectionTitle,
          description: sectionDescription,
        },
        profiles,
        "Talent profile section updated.",
      );
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to save talent profiles.");
    } finally {
      setIsSaving(false);
    }
  }

  async function resetDefaults() {
    setIsResetting(true);

    try {
      await persistProfiles(
        defaultTalentProfilesSectionContent,
        defaultTalentProfiles,
        "Talent profile section reset to defaults.",
      );
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to reset talent profiles.");
    } finally {
      setIsResetting(false);
    }
  }

  return (
    <Card className="border-[#D4E8FC] bg-[#F8FBFF] backdrop-blur-xl">
      <CardHeader className="space-y-2">
        <CardTitle className="text-xl text-slate-900">Talent Profiles Section Controls</CardTitle>
        <p className="text-sm text-slate-500">
          Update the section heading and profile cards shown before the footer on the website home page.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {isReady ? (
          <>
            <div className="space-y-4 rounded-xl border border-[#D4E8FC] bg-[#F4F9FF] p-4 md:p-5">
              <div>
                <p className="text-sm font-medium text-amber-700">Section Copy</p>
                <p className="mt-1 text-sm text-slate-500">
                  Control the label, heading, and description shown above the talent profile cards.
                </p>
              </div>

              <div className="space-y-2">
                <Label className="text-xs text-slate-500">Section Label</Label>
                <Input
                  value={sectionEyebrow}
                  onChange={(event) => setSectionEyebrow(event.target.value)}
                  placeholder="e.g. Representative profiles"
                  className="border-[#D4E8FC] bg-[#F4F9FF] text-slate-900"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs text-slate-500">Section Heading</Label>
                <Textarea
                  value={sectionTitle}
                  onChange={(event) => setSectionTitle(event.target.value)}
                  placeholder="Write the main heading for the talent profiles section"
                  className="min-h-20 border-[#D4E8FC] bg-[#F4F9FF] text-slate-900"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs text-slate-500">Section Description</Label>
                <Textarea
                  value={sectionDescription}
                  onChange={(event) => setSectionDescription(event.target.value)}
                  placeholder="Write the supporting description shown under the section heading"
                  className="min-h-24 border-[#D4E8FC] bg-[#F4F9FF] text-slate-900"
                />
              </div>
            </div>

            {profiles.map((profile, index) => (
              <div
                key={profile.id}
                className="space-y-4 rounded-xl border border-[#D4E8FC] bg-[#F4F9FF] p-4 md:p-5"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm font-medium text-amber-700">Profile {index + 1}</p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="border-[#C3DDF9] bg-[#F8FBFF] text-slate-900 hover:bg-white/[0.08]"
                    onClick={() => removeProfile(profile.id)}
                    disabled={profiles.length <= 1 || isSaving || isResetting}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Delete
                  </Button>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label className="text-xs text-slate-500">Name</Label>
                    <Input
                      value={profile.name}
                      onChange={(event) => updateProfile(profile.id, { name: event.target.value })}
                      placeholder="e.g. Aisha Khan"
                      className="border-[#D4E8FC] bg-[#F4F9FF] text-slate-900"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-slate-500">Role</Label>
                    <Input
                      value={profile.role}
                      onChange={(event) => updateProfile(profile.id, { role: event.target.value })}
                      placeholder="e.g. Senior Frontend Engineer"
                      className="border-[#D4E8FC] bg-[#F4F9FF] text-slate-900"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-slate-500">Years Of Experience</Label>
                    <Input
                      type="number"
                      min={1}
                      max={40}
                      value={profile.yearsOfExperience > 0 ? profile.yearsOfExperience : ""}
                      onChange={(event) => {
                        const nextValue = event.target.value;
                        updateProfile(profile.id, {
                          yearsOfExperience: nextValue === "" ? 0 : Number(nextValue),
                        });
                      }}
                      placeholder="e.g. 6"
                      className="border-[#D4E8FC] bg-[#F4F9FF] text-slate-900"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-slate-500">Rating (1-5)</Label>
                    <Input
                      type="number"
                      min={1}
                      max={5}
                      value={profile.rating > 0 ? profile.rating : ""}
                      onChange={(event) => {
                        const nextValue = event.target.value;
                        updateProfile(profile.id, {
                          rating: nextValue === "" ? 0 : Number(nextValue),
                        });
                      }}
                      placeholder="e.g. 5"
                      className="border-[#D4E8FC] bg-[#F4F9FF] text-slate-900"
                    />
                  </div>
                </div>

                <AdminImageUploadField
                  label="Avatar Image"
                  value={profile.avatar}
                  folder="profiles"
                  previewAlt={profile.name ? `${profile.name} avatar preview` : `Profile ${index + 1} avatar preview`}
                  fallbackPreviewSrc={DEFAULT_PROFILE_IMAGE}
                  helperText="Upload the image that should appear in the homepage representative profile card."
                  recommendedSizeText="Recommended: square headshot for best layout."
                  onChange={(nextValue) => updateProfile(profile.id, { avatar: nextValue })}
                  removeLabel="Remove Avatar"
                />

                <div className="space-y-2">
                  <Label className="text-xs text-slate-500">Summary</Label>
                  <Textarea
                    value={profile.summary}
                    onChange={(event) => updateProfile(profile.id, { summary: event.target.value })}
                    placeholder="Write a short summary for the homepage card"
                    className="min-h-20 border-[#D4E8FC] bg-[#F4F9FF] text-slate-900"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-xs text-slate-500">Detailed Summary</Label>
                  <Textarea
                    value={profile.detailedSummary}
                    onChange={(event) => updateProfile(profile.id, { detailedSummary: event.target.value })}
                    placeholder="Write a more detailed profile summary"
                    className="min-h-24 border-[#D4E8FC] bg-[#F4F9FF] text-slate-900"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-xs text-slate-500">Expertise (comma separated)</Label>
                  <Input
                    value={skillsToText(profile.expertise)}
                    onChange={(event) => updateProfile(profile.id, { expertise: parseSkills(event.target.value) })}
                    placeholder="React, TypeScript, Design Systems"
                    className="border-[#D4E8FC] bg-[#F4F9FF] text-slate-900"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-xs text-slate-500">Button Label</Label>
                  <Input
                    value={profile.resumeCtaLabel}
                    onChange={(event) => updateProfile(profile.id, { resumeCtaLabel: event.target.value })}
                    placeholder="e.g. View Resume"
                    className="border-[#D4E8FC] bg-[#F4F9FF] text-slate-900"
                  />
                </div>
              </div>
            ))}

            <div className="flex flex-wrap items-center justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                className="border-[#C3DDF9] bg-[#F8FBFF] text-slate-900 hover:bg-white/[0.08]"
                onClick={addProfile}
                disabled={profiles.length >= MAX_TALENT_PROFILES || isSaving || isResetting}
              >
                <Plus className="h-4 w-4" />
                Add Profile
              </Button>
              <Button
                type="button"
                variant="outline"
                className={cn(
                  "border-[#C3DDF9] bg-[#F8FBFF] text-slate-900 hover:bg-white/[0.08]",
                  !hasChanges && "opacity-70",
                )}
                onClick={() => {
                  void resetDefaults();
                }}
                disabled={isSaving || isResetting}
              >
                {isResetting ? "Resetting..." : "Reset Defaults"}
              </Button>
              <Button type="button" onClick={() => void saveProfiles()} disabled={isSaving || isResetting}>
                {isSaving ? "Saving..." : "Save Talent Profiles Section"}
              </Button>
            </div>
          </>
        ) : (
          <p className="text-sm text-slate-500">Loading profile controls...</p>
        )}
      </CardContent>
    </Card>
  );
}
