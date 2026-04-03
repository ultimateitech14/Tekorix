"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { toast } from "sonner";

import { getFieldErrors } from "@/components/admin/forms/form-utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { createAdminJob, getAdminJobById, updateAdminJob } from "@/lib/api/admin/jobs";
import { buildJobLocation, getCitiesForCountry, isJobCountry, jobCountries, type JobCountry } from "@/lib/job-locations";
import { ApiError } from "@/lib/api/http";
import { clearAuthToken } from "@/lib/auth/store";
import { cn } from "@/lib/utils";
import { jobFormSchema, type JobFormValues, type JobStatus } from "@/lib/validators/jobs";

type JobEditorFormProps = {
  mode: "create" | "edit";
  jobId?: string;
};

function getDefaultCountry(): JobCountry {
  return "India";
}

function getDefaultCity(country: JobCountry) {
  const cities = getCitiesForCountry(country);
  return cities[0] ?? "";
}

function parseCountryAndCity(location: string, fallbackCountry: JobCountry) {
  if (!location || location.toLowerCase().includes("remote")) {
    return {
      country: "Remote" as JobCountry,
      city: "Remote",
    };
  }

  const parts = location.split(",").map((item) => item.trim()).filter(Boolean);

  if (parts.length >= 2) {
    const maybeCountry = parts[parts.length - 1];

    if (isJobCountry(maybeCountry)) {
      return {
        country: maybeCountry,
        city: parts[0],
      };
    }
  }

  return {
    country: fallbackCountry,
    city: parts[0] ?? getDefaultCity(fallbackCountry),
  };
}

const defaultCountry = getDefaultCountry();
const defaultCity = getDefaultCity(defaultCountry);

const emptyState: JobFormValues = {
  title: "",
  department: "",
  country: defaultCountry,
  city: defaultCity,
  location: buildJobLocation(defaultCountry, defaultCity),
  type: "full-time",
  experience: "",
  salaryRange: "",
  skills: [],
  description: "",
  status: "draft",
};

export function JobEditorForm({ mode, jobId }: JobEditorFormProps) {
  const router = useRouter();
  const [values, setValues] = useState<JobFormValues>(emptyState);
  const [errors, setErrors] = useState<Partial<Record<keyof JobFormValues, string>>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(mode === "edit");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitIntent, setSubmitIntent] = useState<JobStatus | null>(null);
  const [skillInput, setSkillInput] = useState("");

  const cityOptions = useMemo(() => getCitiesForCountry(values.country), [values.country]);

  useEffect(() => {
    let active = true;

    async function loadJob() {
      if (mode !== "edit" || !jobId) {
        setValues(emptyState);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);

      try {
        const job = await getAdminJobById(jobId);

        if (!active) {
          return;
        }

        const fallbackCountry = getDefaultCountry();
        const inferred = parseCountryAndCity(job.location, fallbackCountry);
        const nextCountry = isJobCountry(job.country) ? job.country : inferred.country;
        const allowedCities = getCitiesForCountry(nextCountry);
        const candidateCity = (job.city || inferred.city).trim();
        const nextCity = allowedCities.includes(candidateCity) ? candidateCity : (allowedCities[0] ?? candidateCity);

        setValues({
          title: job.title,
          department: job.department || "General",
          country: nextCountry,
          city: nextCity,
          location: buildJobLocation(nextCountry, nextCity),
          type: job.type,
          experience: job.experience,
          salaryRange: job.salaryRange ?? "",
          skills: job.skills ?? [],
          description: job.description,
          status: job.status === "published" ? "published" : "draft",
        });
      } catch (error) {
        if (!active) {
          return;
        }

        if (error instanceof ApiError && error.status === 401) {
          clearAuthToken();
          router.replace("/admin/login");
          return;
        }

        if (error instanceof ApiError && error.status === 404) {
          setFormError("Job not found.");
        } else {
          setFormError(error instanceof Error ? error.message : "Unable to load job.");
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    }

    loadJob();

    return () => {
      active = false;
    };
  }, [jobId, mode, router]);

  function updateField<K extends keyof JobFormValues>(field: K, value: JobFormValues[K]) {
    setValues((current) => ({
      ...current,
      [field]: value,
    }));

    setErrors((current) => ({
      ...current,
      [field]: undefined,
    }));
    setFormError(null);
  }

  function updateCountry(value: JobCountry) {
    const nextCity = getDefaultCity(value);

    setValues((current) => ({
      ...current,
      country: value,
      city: nextCity,
      location: buildJobLocation(value, nextCity),
    }));

    setErrors((current) => ({
      ...current,
      country: undefined,
      city: undefined,
      location: undefined,
    }));
    setFormError(null);
  }

  function updateCity(value: string) {
    updateField("city", value);
    updateField("location", buildJobLocation(values.country, value));
  }

  function addSkill() {
    const trimmed = skillInput.trim();

    if (!trimmed) {
      return;
    }

    if (values.skills.includes(trimmed)) {
      setSkillInput("");
      return;
    }

    updateField("skills", [...values.skills, trimmed]);
    setSkillInput("");
  }

  function removeSkill(skill: string) {
    updateField(
      "skills",
      values.skills.filter((item) => item !== skill),
    );
  }

  async function persistJob(nextStatus: JobStatus) {
    const payload: JobFormValues = {
      ...values,
      status: nextStatus,
      location: buildJobLocation(values.country, values.city),
      skills: values.skills.map((item) => item.trim()).filter(Boolean),
    };

    const parsed = jobFormSchema.safeParse(payload);

    if (!parsed.success) {
      setErrors(getFieldErrors(parsed.error));
      return;
    }

    setSubmitIntent(nextStatus);
    setIsSubmitting(true);

    try {
      if (mode === "create") {
        const result = await createAdminJob(parsed.data);
        toast.success(result.message);
      } else if (jobId) {
        const result = await updateAdminJob(jobId, parsed.data);
        toast.success(result.message);
      }

      router.push("/admin/jobs");
      router.refresh();
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        clearAuthToken();
        router.replace("/admin/login");
        return;
      }

      setFormError(error instanceof Error ? error.message : "Unable to save job.");
    } finally {
      setIsSubmitting(false);
      setSubmitIntent(null);
    }
  }

  if (isLoading) {
    return (
      <Card className="border-white/10 bg-white/5 backdrop-blur-xl">
        <CardContent className="p-6 text-sm text-slate-400">Loading job...</CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-white/10 bg-white/5 backdrop-blur-xl">
      <CardHeader>
        <CardTitle className="text-xl text-white">
          {mode === "create" ? "Create New Job" : `Edit Job ${jobId ?? ""}`}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-5">
        {formError ? (
          <div className="rounded-md border border-red-400/35 bg-red-500/10 px-3 py-2 text-sm text-red-100">
            {formError}
          </div>
        ) : null}

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label className="text-xs uppercase tracking-[0.16em] text-slate-400">Title</Label>
            <Input
              value={values.title}
              onChange={(event) => updateField("title", event.target.value)}
              placeholder="Product Designer"
              className="border-white/15 bg-white/5 text-slate-100 placeholder:text-slate-400"
              aria-invalid={Boolean(errors.title)}
            />
            {errors.title ? <p className="text-xs text-red-300">{errors.title}</p> : null}
          </div>

          <div className="space-y-2">
            <Label className="text-xs uppercase tracking-[0.16em] text-slate-400">Department</Label>
            <Input
              value={values.department}
              onChange={(event) => updateField("department", event.target.value)}
              placeholder="Design"
              className="border-white/15 bg-white/5 text-slate-100 placeholder:text-slate-400"
              aria-invalid={Boolean(errors.department)}
            />
            {errors.department ? <p className="text-xs text-red-300">{errors.department}</p> : null}
          </div>

          <div className="space-y-2">
            <Label className="text-xs uppercase tracking-[0.16em] text-slate-400">Country</Label>
            <Select value={values.country} onValueChange={(value) => updateCountry(value as JobCountry)}>
              <SelectTrigger className="border-white/15 bg-white/5 text-slate-100">
                <SelectValue placeholder="Select country" />
              </SelectTrigger>
              <SelectContent className="border-white/10 bg-[#0f1e32] text-slate-100">
                {jobCountries.map((country) => (
                  <SelectItem key={country} value={country} className="focus:bg-white/10">
                    {country}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.country ? <p className="text-xs text-red-300">{errors.country}</p> : null}
          </div>

          <div className="space-y-2">
            <Label className="text-xs uppercase tracking-[0.16em] text-slate-400">City</Label>
            <Select value={values.city} onValueChange={updateCity}>
              <SelectTrigger className="border-white/15 bg-white/5 text-slate-100">
                <SelectValue placeholder="Select city" />
              </SelectTrigger>
              <SelectContent className="border-white/10 bg-[#0f1e32] text-slate-100">
                {cityOptions.map((city) => (
                  <SelectItem key={city} value={city} className="focus:bg-white/10">
                    {city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.city ? <p className="text-xs text-red-300">{errors.city}</p> : null}
          </div>

          <div className="space-y-2">
            <Label className="text-xs uppercase tracking-[0.16em] text-slate-400">Job Type</Label>
            <Select value={values.type} onValueChange={(value) => updateField("type", value as JobFormValues["type"])}>
              <SelectTrigger className="border-white/15 bg-white/5 text-slate-100">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent className="border-white/10 bg-[#0f1e32] text-slate-100">
                <SelectItem value="full-time" className="focus:bg-white/10">
                  Full-time
                </SelectItem>
                <SelectItem value="part-time" className="focus:bg-white/10">
                  Part-time
                </SelectItem>
                <SelectItem value="contract" className="focus:bg-white/10">
                  Contract
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-xs uppercase tracking-[0.16em] text-slate-400">Experience</Label>
            <Input
              value={values.experience}
              onChange={(event) => updateField("experience", event.target.value)}
              placeholder="3+ years"
              className="border-white/15 bg-white/5 text-slate-100 placeholder:text-slate-400"
              aria-invalid={Boolean(errors.experience)}
            />
            {errors.experience ? <p className="text-xs text-red-300">{errors.experience}</p> : null}
          </div>

          <div className="space-y-2">
            <Label className="text-xs uppercase tracking-[0.16em] text-slate-400">Salary Range</Label>
            <Input
              value={values.salaryRange}
              onChange={(event) => updateField("salaryRange", event.target.value)}
              placeholder="$90k - $120k"
              className="border-white/15 bg-white/5 text-slate-100 placeholder:text-slate-400"
              aria-invalid={Boolean(errors.salaryRange)}
            />
            {errors.salaryRange ? <p className="text-xs text-red-300">{errors.salaryRange}</p> : null}
          </div>
        </div>

        <div className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-xs text-slate-300">
          Location saved as: <span className="font-semibold text-slate-100">{buildJobLocation(values.country, values.city)}</span>
        </div>

        <div className="space-y-2">
          <Label className="text-xs uppercase tracking-[0.16em] text-slate-400">Skills</Label>
          <div className="flex flex-wrap gap-2">
            {values.skills.map((skill) => (
              <Badge
                key={skill}
                variant="outline"
                className="gap-1 border-amber-300/35 bg-amber-300/10 px-2 py-1 text-xs text-amber-100"
              >
                {skill}
                <button
                  type="button"
                  onClick={() => removeSkill(skill)}
                  className="inline-flex items-center rounded p-0.5 hover:bg-amber-200/20"
                  aria-label={`Remove ${skill}`}
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              value={skillInput}
              onChange={(event) => setSkillInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  addSkill();
                }
              }}
              placeholder="Add skill and press Enter"
              className="border-white/15 bg-white/5 text-slate-100 placeholder:text-slate-400"
            />
            <Button type="button" variant="outline" onClick={addSkill}>
              Add
            </Button>
          </div>
          {errors.skills ? <p className="text-xs text-red-300">{errors.skills}</p> : null}
        </div>

        <div className="space-y-2">
          <Label className="text-xs uppercase tracking-[0.16em] text-slate-400">Description</Label>
          <Textarea
            value={values.description}
            onChange={(event) => updateField("description", event.target.value)}
            placeholder="Describe responsibilities, requirements, and expectations."
            className="min-h-36 border-white/15 bg-white/5 text-slate-100 placeholder:text-slate-400"
            aria-invalid={Boolean(errors.description)}
          />
          {errors.description ? <p className="text-xs text-red-300">{errors.description}</p> : null}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-white/10 bg-white/5 px-4 py-3">
          <div>
            <p className="text-sm font-semibold text-white">Published</p>
            <p className="text-xs text-slate-400">Control whether this job appears on the careers page.</p>
          </div>
          <button
            type="button"
            onClick={() => updateField("status", values.status === "published" ? "draft" : "published")}
            className={cn(
              "relative inline-flex h-7 w-14 items-center rounded-full border transition-colors",
              values.status === "published"
                ? "border-amber-300/60 bg-amber-300/30"
                : "border-white/25 bg-slate-500/20",
            )}
            aria-label="Toggle published state"
          >
            <span
              className={cn(
                "inline-block h-5 w-5 rounded-full bg-white transition-transform",
                values.status === "published" ? "translate-x-8" : "translate-x-1",
              )}
            />
          </button>
        </div>

        <div className="flex flex-wrap justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => persistJob("draft")} disabled={isSubmitting}>
            {isSubmitting && submitIntent === "draft" ? "Saving..." : "Save Draft"}
          </Button>
          <Button type="button" onClick={() => persistJob("published")} disabled={isSubmitting}>
            {isSubmitting && submitIntent === "published" ? "Publishing..." : "Publish"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
