/* eslint-disable @next/next/no-img-element */

"use client";

import { useEffect, useMemo, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { readFileAsDataUrl, validateImageUploadFile } from "@/lib/image-upload";
import {
  MAX_TALENT_PROFILES,
  TALENT_PROFILES_STORAGE_KEY,
  createTalentProfileTemplate,
  defaultTalentProfiles,
  normalizeTalentProfiles,
  type TalentProfile,
} from "@/lib/talent-profiles";
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

export function TalentProfilesSettings() {
  const [profiles, setProfiles] = useState<TalentProfile[]>(defaultTalentProfiles);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(TALENT_PROFILES_STORAGE_KEY);

      if (stored) {
        const parsed = JSON.parse(stored);
        setProfiles(normalizeTalentProfiles(parsed));
      }
    } catch {
      setProfiles(defaultTalentProfiles);
    } finally {
      setIsReady(true);
    }
  }, []);

  const hasChanges = useMemo(() => {
    return JSON.stringify(profiles) !== JSON.stringify(defaultTalentProfiles);
  }, [profiles]);

  function isUploadedImage(value: string) {
    return value.trim().toLowerCase().startsWith("data:image/");
  }

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

  async function handleAvatarUpload(profileId: string, fileList: FileList | null) {
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
      updateProfile(profileId, { avatar: dataUrl });
      toast.success("Profile image selected.");
    } catch {
      toast.error("Unable to read image file.");
    }
  }

  function removeUploadedAvatar(profileId: string) {
    updateProfile(profileId, { avatar: "" });
    toast.success("Uploaded image removed.");
  }

  function saveProfiles() {
    const normalized = normalizeTalentProfiles(profiles);
    setProfiles(normalized);
    window.localStorage.setItem(TALENT_PROFILES_STORAGE_KEY, JSON.stringify(normalized));
    toast.success("Talent profile section updated.");
  }

  function resetDefaults() {
    setProfiles(defaultTalentProfiles);
    window.localStorage.removeItem(TALENT_PROFILES_STORAGE_KEY);
    toast.success("Talent profile section reset to defaults.");
  }

  return (
    <Card className="border-[#D4E8FC] bg-[#F8FBFF] backdrop-blur-xl">
      <CardHeader className="space-y-2">
        <CardTitle className="text-xl text-slate-900">Talent Profiles Section Controls</CardTitle>
        <p className="text-sm text-slate-500">
          Update the cards shown before footer on the website home page. Click save to apply.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {isReady ? (
          <>
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
                    disabled={profiles.length <= 1}
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
                      className="border-[#D4E8FC] bg-[#F4F9FF] text-slate-900"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-slate-500">Role</Label>
                    <Input
                      value={profile.role}
                      onChange={(event) => updateProfile(profile.id, { role: event.target.value })}
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
                      className="border-[#D4E8FC] bg-[#F4F9FF] text-slate-900"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs text-slate-500">Avatar Path / URL</Label>
                  <Input
                    value={profile.avatar}
                    onChange={(event) => updateProfile(profile.id, { avatar: event.target.value })}
                    placeholder={DEFAULT_PROFILE_IMAGE}
                    className="border-[#D4E8FC] bg-[#F4F9FF] text-slate-900"
                  />
                  <div className="flex items-center gap-3 rounded-md border border-[#D4E8FC] bg-white/[0.02] p-2">
                    {profile.avatar.trim() ? (
                      <img
                        src={profile.avatar}
                        alt={profile.name ? `${profile.name} avatar preview` : `Profile ${index + 1} avatar preview`}
                        className="h-12 w-12 rounded-full border border-[#D4E8FC] object-cover"
                        onError={(event) => {
                          event.currentTarget.src = DEFAULT_PROFILE_IMAGE;
                        }}
                      />
                    ) : (
                      <div className="h-12 w-12 rounded-full border border-[#D4E8FC] bg-[#F8FBFF]" />
                    )}
                    <p className="text-xs text-slate-500">Avatar preview</p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-slate-500">Choose Image</Label>
                    <Input
                      type="file"
                      accept="image/*"
                      className="border-[#D4E8FC] bg-[#F4F9FF] text-slate-900 file:mr-3 file:rounded-md file:border-0 file:bg-amber-300/15 file:px-3 file:py-1 file:text-xs file:text-amber-700"
                      onChange={(event) => {
                        void handleAvatarUpload(profile.id, event.target.files);
                        event.currentTarget.value = "";
                      }}
                    />
                    <p className="text-xs text-slate-500">Allowed image size: minimum 50KB and maximum 800KB.</p>
                    {isUploadedImage(profile.avatar) ? (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="border-[#C3DDF9] bg-[#F8FBFF] text-slate-900 hover:bg-white/[0.08]"
                        onClick={() => removeUploadedAvatar(profile.id)}
                      >
                        Remove Uploaded Image
                      </Button>
                    ) : null}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs text-slate-500">Summary</Label>
                  <Textarea
                    value={profile.summary}
                    onChange={(event) => updateProfile(profile.id, { summary: event.target.value })}
                    className="min-h-20 border-[#D4E8FC] bg-[#F4F9FF] text-slate-900"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-xs text-slate-500">Detailed Summary</Label>
                  <Textarea
                    value={profile.detailedSummary}
                    onChange={(event) => updateProfile(profile.id, { detailedSummary: event.target.value })}
                    className="min-h-24 border-[#D4E8FC] bg-[#F4F9FF] text-slate-900"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-xs text-slate-500">Expertise (comma separated)</Label>
                  <Input
                    value={skillsToText(profile.expertise)}
                    onChange={(event) => updateProfile(profile.id, { expertise: parseSkills(event.target.value) })}
                    className="border-[#D4E8FC] bg-[#F4F9FF] text-slate-900"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-xs text-slate-500">Button Label</Label>
                  <Input
                    value={profile.resumeCtaLabel}
                    onChange={(event) => updateProfile(profile.id, { resumeCtaLabel: event.target.value })}
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
                disabled={profiles.length >= MAX_TALENT_PROFILES}
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
                onClick={resetDefaults}
              >
                Reset Defaults
              </Button>
              <Button type="button" onClick={saveProfiles}>
                Save Talent Profiles
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


