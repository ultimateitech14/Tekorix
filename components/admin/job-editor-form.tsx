"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Check, Minus, Plus, X } from "lucide-react";
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
import { buildJobLocation, getCitiesForCountry, isJobCountry, jobCountries } from "@/lib/job-locations";
import { ApiError } from "@/lib/api/http";
import { clearAuthToken } from "@/lib/auth/store";
import { cn } from "@/lib/utils";
import { jobFormSchema, type JobFormValues, type JobStatus } from "@/lib/validators/jobs";

type JobEditorFormProps = {
  mode: "create" | "edit";
  jobId?: string;
};

type CustomInputField = "country" | "city" | "department" | "jobType";

const defaultDepartmentOptions = [
  "Engineering",
  "Design",
  "Product",
  "Marketing",
  "Operations",
  "Sales",
  "Customer Success",
  "Finance",
  "Human Resources",
  "General",
];

const defaultJobTypeOptions = ["full-time", "part-time", "contract"];

function normalizeOptionValue(value: string) {
  return value.trim().replace(/\s+/g, " ");
}

function dedupeOptions(values: string[]) {
  return Array.from(new Set(values.map((value) => normalizeOptionValue(value)).filter(Boolean)));
}

function formatOptionLabel(value: string) {
  if (value === "full-time") {
    return "Full-time";
  }

  if (value === "part-time") {
    return "Part-time";
  }

  if (value === "contract") {
    return "Contract";
  }

  return value
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((part) => `${part.slice(0, 1).toUpperCase()}${part.slice(1)}`)
    .join(" ");
}

function getDefaultCountry(): string {
  return "India";
}

function getDefaultCity(country: string) {
  const cities = getCitiesForCountry(country);
  return cities[0] ?? "";
}

function parseCountryAndCity(location: string, fallbackCountry: string) {
  if (!location || location.toLowerCase().includes("remote")) {
    return {
      country: "Remote",
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

type CustomOptionControlsProps = {
  selectSlot: ReactNode;
  inputValue: string;
  onInputChange: (value: string) => void;
  onAdd: () => void;
  onRemove: () => void;
  placeholder: string;
  canRemove: boolean;
  selectedLabel?: string;
};

function CustomOptionControls({
  selectSlot,
  inputValue,
  onInputChange,
  onAdd,
  onRemove,
  placeholder,
  canRemove,
  selectedLabel,
}: CustomOptionControlsProps) {
  const [isAdding, setIsAdding] = useState(false);

  function handleAdd() {
    if (!inputValue.trim()) {
      return;
    }

    onAdd();
    setIsAdding(false);
  }

  return (
    <div className="space-y-2">
      <div className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_auto]">
        <div className="min-w-0">{selectSlot}</div>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => setIsAdding((current) => !current)}
            className={cn(
              "h-11 w-11 rounded-xl",
              isAdding && "border-[#1B66B3] bg-[#EAF4FF] text-[#145188] hover:bg-[#EAF4FF]",
            )}
            aria-label="Add custom option"
            title="Add custom option"
          >
            <Plus className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={onRemove}
            disabled={!canRemove}
            className="h-11 w-11 rounded-xl"
            aria-label="Remove selected custom option"
            title={canRemove ? "Remove selected custom option" : "Select a custom option to remove it"}
          >
            <Minus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {isAdding ? (
        <div className="flex flex-col gap-2 rounded-xl border border-[#D4E8FC] bg-white/80 p-2.5 sm:flex-row sm:items-center">
          <Input
            value={inputValue}
            onChange={(event) => onInputChange(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                handleAdd();
              }
            }}
            placeholder={placeholder}
            className="border-[#D4E8FC] bg-[#F8FBFF] text-slate-900 placeholder:text-slate-500"
          />
          <div className="flex items-center gap-2">
            <Button type="button" size="icon" onClick={handleAdd} className="h-10 w-10 rounded-xl" aria-label="Save custom option">
              <Check className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => {
                setIsAdding(false);
                onInputChange("");
              }}
              className="h-10 w-10 rounded-xl text-slate-700 hover:text-slate-900"
              aria-label="Cancel custom option"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ) : null}

      <p className="text-xs text-slate-500">
        {canRemove && selectedLabel
          ? `Selected custom option: ${selectedLabel}`
          : "Use + to add a custom option. Use - to remove the selected custom option."}
      </p>
    </div>
  );
}

export function JobEditorForm({ mode, jobId }: JobEditorFormProps) {
  const router = useRouter();
  const [values, setValues] = useState<JobFormValues>(emptyState);
  const [errors, setErrors] = useState<Partial<Record<keyof JobFormValues, string>>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(mode === "edit");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitIntent, setSubmitIntent] = useState<JobStatus | null>(null);
  const [skillInput, setSkillInput] = useState("");
  const [customCountries, setCustomCountries] = useState<string[]>([]);
  const [customCitiesByCountry, setCustomCitiesByCountry] = useState<Record<string, string[]>>({});
  const [customDepartments, setCustomDepartments] = useState<string[]>([]);
  const [customJobTypes, setCustomJobTypes] = useState<string[]>([]);
  const [customInputs, setCustomInputs] = useState<Record<CustomInputField, string>>({
    country: "",
    city: "",
    department: "",
    jobType: "",
  });

  const countryOptions = useMemo(() => dedupeOptions([...jobCountries, ...customCountries]), [customCountries]);
  const cityOptions = useMemo(
    () => dedupeOptions([...getCitiesForCountry(values.country), ...(customCitiesByCountry[values.country] ?? [])]),
    [customCitiesByCountry, values.country],
  );
  const departmentOptions = useMemo(
    () => dedupeOptions([...defaultDepartmentOptions, ...customDepartments]),
    [customDepartments],
  );
  const jobTypeOptions = useMemo(() => dedupeOptions([...defaultJobTypeOptions, ...customJobTypes]), [customJobTypes]);
  const selectedCountryIsCustom = !jobCountries.includes(values.country as (typeof jobCountries)[number]);
  const selectedCityIsCustom = Boolean(values.city) && !getCitiesForCountry(values.country).includes(values.city);
  const selectedDepartmentIsCustom = Boolean(values.department) && !defaultDepartmentOptions.includes(values.department);
  const selectedJobTypeIsCustom = Boolean(values.type) && !defaultJobTypeOptions.includes(values.type);

  useEffect(() => {
    let active = true;

    async function loadJob() {
      if (mode !== "edit" || !jobId) {
        setValues(emptyState);
        setCustomCountries([]);
        setCustomCitiesByCountry({});
        setCustomDepartments([]);
        setCustomJobTypes([]);
        setCustomInputs({
          country: "",
          city: "",
          department: "",
          jobType: "",
        });
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
        const nextDepartment = job.department || "General";

        setValues({
          title: job.title,
          department: nextDepartment,
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

        if (!jobCountries.includes(nextCountry as (typeof jobCountries)[number])) {
          setCustomCountries((current) => dedupeOptions([...current, nextCountry]));
        }

        if (nextCity && !getCitiesForCountry(nextCountry).includes(nextCity)) {
          setCustomCitiesByCountry((current) => ({
            ...current,
            [nextCountry]: dedupeOptions([...(current[nextCountry] ?? []), nextCity]),
          }));
        }

        if (!defaultDepartmentOptions.includes(nextDepartment)) {
          setCustomDepartments((current) => dedupeOptions([...current, nextDepartment]));
        }

        if (!defaultJobTypeOptions.includes(job.type)) {
          setCustomJobTypes((current) => dedupeOptions([...current, job.type]));
        }
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

  function updateCustomInput(field: CustomInputField, value: string) {
    setCustomInputs((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function updateCountry(value: string) {
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

  function addCustomCountry() {
    const nextCountry = normalizeOptionValue(customInputs.country);

    if (!nextCountry) {
      return;
    }

    setCustomCountries((current) => dedupeOptions([...current, nextCountry]));
    updateCustomInput("country", "");
    updateCountry(nextCountry);
  }

  function removeSelectedCountry() {
    if (!selectedCountryIsCustom) {
      return;
    }

    setCustomCountries((current) => current.filter((item) => item !== values.country));
    updateCountry(defaultCountry);
  }

  function addCustomCity() {
    const nextCity = normalizeOptionValue(customInputs.city);

    if (!nextCity) {
      return;
    }

    setCustomCitiesByCountry((current) => ({
      ...current,
      [values.country]: dedupeOptions([...(current[values.country] ?? []), nextCity]),
    }));
    updateCustomInput("city", "");
    updateCity(nextCity);
  }

  function removeSelectedCity() {
    if (!selectedCityIsCustom) {
      return;
    }

    setCustomCitiesByCountry((current) => {
      const nextCities = (current[values.country] ?? []).filter((item) => item !== values.city);
      const next = { ...current };

      if (nextCities.length) {
        next[values.country] = nextCities;
      } else {
        delete next[values.country];
      }

      return next;
    });

    const nextCity = getDefaultCity(values.country);
    updateCity(nextCity);
  }

  function addCustomDepartment() {
    const nextDepartment = normalizeOptionValue(customInputs.department);

    if (!nextDepartment) {
      return;
    }

    setCustomDepartments((current) => dedupeOptions([...current, nextDepartment]));
    updateCustomInput("department", "");
    updateField("department", nextDepartment);
  }

  function removeSelectedDepartment() {
    if (!selectedDepartmentIsCustom) {
      return;
    }

    setCustomDepartments((current) => current.filter((item) => item !== values.department));
    updateField("department", "");
  }

  function addCustomJobType() {
    const nextJobType = normalizeOptionValue(customInputs.jobType).toLowerCase();

    if (!nextJobType) {
      return;
    }

    setCustomJobTypes((current) => dedupeOptions([...current, nextJobType]));
    updateCustomInput("jobType", "");
    updateField("type", nextJobType);
  }

  function removeSelectedJobType() {
    if (!selectedJobTypeIsCustom) {
      return;
    }

    setCustomJobTypes((current) => current.filter((item) => item !== values.type));
    updateField("type", "full-time");
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
      <Card className="border-[#D4E8FC] bg-[#F8FBFF] backdrop-blur-xl">
        <CardContent className="p-6 text-sm text-slate-500">Loading job...</CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-[#D4E8FC] bg-[#F8FBFF] backdrop-blur-xl">
      <CardHeader>
        <CardTitle className="text-xl text-slate-900">
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
            <Label className="text-xs uppercase tracking-[0.16em] text-slate-500">Title</Label>
            <Input
              value={values.title}
              onChange={(event) => updateField("title", event.target.value)}
              placeholder="Product Designer"
              className="border-[#D4E8FC] bg-[#F8FBFF] text-slate-900 placeholder:text-slate-500"
              aria-invalid={Boolean(errors.title)}
            />
            {errors.title ? <p className="text-xs text-red-300">{errors.title}</p> : null}
          </div>

          <div className="space-y-2">
            <Label className="text-xs uppercase tracking-[0.16em] text-slate-500">Department</Label>
            <CustomOptionControls
              selectSlot={
                <Select value={values.department} onValueChange={(value) => updateField("department", value)}>
                  <SelectTrigger className="border-[#D4E8FC] bg-[#F8FBFF] text-slate-900">
                    <SelectValue placeholder="Select or add department" />
                  </SelectTrigger>
                  <SelectContent className="border-[#D4E8FC] bg-[#F8FBFF] text-slate-900">
                    {departmentOptions.map((department) => (
                      <SelectItem key={department} value={department} className="focus:bg-[#EDF5FF] focus:text-slate-900">
                        {department}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              }
              inputValue={customInputs.department}
              onInputChange={(value) => updateCustomInput("department", value)}
              onAdd={addCustomDepartment}
              onRemove={removeSelectedDepartment}
              placeholder="Add custom department"
              canRemove={selectedDepartmentIsCustom}
              selectedLabel={selectedDepartmentIsCustom ? values.department : undefined}
            />
            {errors.department ? <p className="text-xs text-red-300">{errors.department}</p> : null}
          </div>

          <div className="space-y-2">
            <Label className="text-xs uppercase tracking-[0.16em] text-slate-500">Country</Label>
            <CustomOptionControls
              selectSlot={
                <Select value={values.country} onValueChange={updateCountry}>
                  <SelectTrigger className="border-[#D4E8FC] bg-[#F8FBFF] text-slate-900">
                    <SelectValue placeholder="Select or add country" />
                  </SelectTrigger>
                  <SelectContent className="border-[#D4E8FC] bg-[#F8FBFF] text-slate-900">
                    {countryOptions.map((country) => (
                      <SelectItem key={country} value={country} className="focus:bg-[#EDF5FF] focus:text-slate-900">
                        {country}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              }
              inputValue={customInputs.country}
              onInputChange={(value) => updateCustomInput("country", value)}
              onAdd={addCustomCountry}
              onRemove={removeSelectedCountry}
              placeholder="Add custom country"
              canRemove={selectedCountryIsCustom}
              selectedLabel={selectedCountryIsCustom ? values.country : undefined}
            />
            {errors.country ? <p className="text-xs text-red-300">{errors.country}</p> : null}
          </div>

          <div className="space-y-2">
            <Label className="text-xs uppercase tracking-[0.16em] text-slate-500">City</Label>
            <CustomOptionControls
              selectSlot={
                <Select value={values.city} onValueChange={updateCity}>
                  <SelectTrigger className="border-[#D4E8FC] bg-[#F8FBFF] text-slate-900">
                    <SelectValue placeholder="Select or add city" />
                  </SelectTrigger>
                  <SelectContent className="border-[#D4E8FC] bg-[#F8FBFF] text-slate-900">
                    {cityOptions.map((city) => (
                      <SelectItem key={city} value={city} className="focus:bg-[#EDF5FF] focus:text-slate-900">
                        {city}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              }
              inputValue={customInputs.city}
              onInputChange={(value) => updateCustomInput("city", value)}
              onAdd={addCustomCity}
              onRemove={removeSelectedCity}
              placeholder={`Add custom city for ${values.country || "selected country"}`}
              canRemove={selectedCityIsCustom}
              selectedLabel={selectedCityIsCustom ? values.city : undefined}
            />
            {errors.city ? <p className="text-xs text-red-300">{errors.city}</p> : null}
          </div>

          <div className="space-y-2">
            <Label className="text-xs uppercase tracking-[0.16em] text-slate-500">Job Type</Label>
            <CustomOptionControls
              selectSlot={
                <Select value={values.type} onValueChange={(value) => updateField("type", value)}>
                  <SelectTrigger className="border-[#D4E8FC] bg-[#F8FBFF] text-slate-900">
                    <SelectValue placeholder="Select or add job type" />
                  </SelectTrigger>
                  <SelectContent className="border-[#D4E8FC] bg-[#F8FBFF] text-slate-900">
                    {jobTypeOptions.map((jobType) => (
                      <SelectItem key={jobType} value={jobType} className="focus:bg-[#EDF5FF] focus:text-slate-900">
                        {formatOptionLabel(jobType)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              }
              inputValue={customInputs.jobType}
              onInputChange={(value) => updateCustomInput("jobType", value)}
              onAdd={addCustomJobType}
              onRemove={removeSelectedJobType}
              placeholder="Add custom job type"
              canRemove={selectedJobTypeIsCustom}
              selectedLabel={selectedJobTypeIsCustom ? formatOptionLabel(values.type) : undefined}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs uppercase tracking-[0.16em] text-slate-500">Experience</Label>
            <Input
              value={values.experience}
              onChange={(event) => updateField("experience", event.target.value)}
              placeholder="4, 4 years, or 4+ years"
              className="border-[#D4E8FC] bg-[#F8FBFF] text-slate-900 placeholder:text-slate-500"
              aria-invalid={Boolean(errors.experience)}
            />
            {errors.experience ? <p className="text-xs text-red-300">{errors.experience}</p> : null}
          </div>

          <div className="space-y-2">
            <Label className="text-xs uppercase tracking-[0.16em] text-slate-500">Salary Range</Label>
            <Input
              value={values.salaryRange}
              onChange={(event) => updateField("salaryRange", event.target.value)}
              placeholder="$90k - $120k"
              className="border-[#D4E8FC] bg-[#F8FBFF] text-slate-900 placeholder:text-slate-500"
              aria-invalid={Boolean(errors.salaryRange)}
            />
            {errors.salaryRange ? <p className="text-xs text-red-300">{errors.salaryRange}</p> : null}
          </div>
        </div>

        <div className="rounded-lg border border-[#D4E8FC] bg-[#F8FBFF] px-3 py-2 text-xs text-slate-600">
          Location saved as: <span className="font-semibold text-slate-900">{buildJobLocation(values.country, values.city)}</span>
        </div>

        <div className="space-y-2">
          <Label className="text-xs uppercase tracking-[0.16em] text-slate-500">Skills</Label>
          <div className="flex flex-wrap gap-2">
            {values.skills.map((skill) => (
              <Badge
                key={skill}
                variant="outline"
                className="gap-1 border-amber-300/35 bg-amber-300/10 px-2 py-1 text-xs text-amber-700"
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
              className="border-[#D4E8FC] bg-[#F8FBFF] text-slate-900 placeholder:text-slate-500"
            />
            <Button type="button" variant="outline" onClick={addSkill}>
              Add
            </Button>
          </div>
          {errors.skills ? <p className="text-xs text-red-300">{errors.skills}</p> : null}
        </div>

        <div className="space-y-2">
          <Label className="text-xs uppercase tracking-[0.16em] text-slate-500">Description</Label>
          <Textarea
            value={values.description}
            onChange={(event) => updateField("description", event.target.value)}
            placeholder="Optional: describe responsibilities, requirements, or delivery context."
            className="min-h-36 border-[#D4E8FC] bg-[#F8FBFF] text-slate-900 placeholder:text-slate-500"
            aria-invalid={Boolean(errors.description)}
          />
          {errors.description ? <p className="text-xs text-red-300">{errors.description}</p> : null}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-[#D4E8FC] bg-[#F8FBFF] px-4 py-3">
          <div>
            <p className="text-sm font-semibold text-slate-900">Published</p>
            <p className="text-xs text-slate-500">Control whether this job appears on the careers page.</p>
          </div>
          <button
            type="button"
            onClick={() => updateField("status", values.status === "published" ? "draft" : "published")}
            className={cn(
              "relative inline-flex h-7 w-14 items-center rounded-full border transition-colors",
              values.status === "published"
                ? "border-amber-300/60 bg-amber-300/30"
                : "border-[#BAD7F6] bg-slate-500/20",
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


