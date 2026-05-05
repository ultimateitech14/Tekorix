"use client";

import Image from "next/image";
import { useId, useRef, useState, type DragEvent } from "react";
import { ImagePlus, Loader2, UploadCloud, X } from "lucide-react";
import { toast } from "sonner";

import { uploadAdminImage, type AdminImageUploadFolder } from "@/lib/api/admin/media";
import { resolveAssetUrl } from "@/lib/asset-url";
import { readFileAsDataUrl, validateImageUploadFile } from "@/lib/image-upload";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type AdminImageUploadFieldProps = {
  label: string;
  value: string;
  folder: AdminImageUploadFolder;
  previewAlt: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  fallbackPreviewSrc?: string;
  helperText?: string;
  recommendedSizeText?: string;
  removeLabel?: string;
};

export function AdminImageUploadField({
  label,
  value,
  folder,
  previewAlt,
  onChange,
  disabled = false,
  fallbackPreviewSrc,
  helperText,
  recommendedSizeText,
  removeLabel = "Remove Image",
}: AdminImageUploadFieldProps) {
  const inputId = useId();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const hasSelectedImage = value.trim().length > 0;
  const previewSrc = hasSelectedImage ? resolveAssetUrl(value) : resolveAssetUrl(fallbackPreviewSrc ?? "");

  async function uploadFile(file: File) {
    const error = validateImageUploadFile(file);

    if (error) {
      toast.error(error);
      return;
    }

    setIsUploading(true);

    try {
      const dataUrl = await readFileAsDataUrl(file);
      const uploadedPath = await uploadAdminImage({
        folder,
        fileName: file.name,
        dataUrl,
      });

      onChange(uploadedPath);
      toast.success("Image uploaded.");
    } catch (uploadError) {
      toast.error(uploadError instanceof Error ? uploadError.message : "Unable to upload image.");
    } finally {
      setIsUploading(false);
    }
  }

  function handleDrop(event: DragEvent<HTMLButtonElement>) {
    event.preventDefault();
    setIsDragging(false);

    if (disabled || isUploading) {
      return;
    }

    const file = event.dataTransfer.files?.[0];

    if (file) {
      void uploadFile(file);
    }
  }

  return (
    <div className="space-y-3">
      <Label htmlFor={inputId} className="text-xs text-slate-500">
        {label}
      </Label>

      <div className="flex flex-col gap-3 rounded-md border border-[#D4E8FC] bg-white/[0.02] p-3 sm:flex-row sm:items-center">
        {previewSrc ? (
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsPreviewOpen(true)}
              className="relative block h-16 w-16 overflow-hidden rounded-xl border border-[#D4E8FC] bg-[#F8FBFF] transition hover:border-[#9FC8F2]"
              aria-label="Preview selected image"
            >
              <Image src={previewSrc} alt={previewAlt} fill sizes="64px" className="object-cover" unoptimized />
            </button>

            {hasSelectedImage ? (
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  onChange("");
                  setIsPreviewOpen(false);
                }}
                disabled={disabled || isUploading}
                className="absolute -right-2 -top-2 inline-flex h-6 w-6 items-center justify-center rounded-full border border-[#D4E8FC] bg-[#F8FBFF] text-slate-700 shadow-sm transition hover:bg-[#EAF4FF] disabled:cursor-not-allowed disabled:opacity-60"
                aria-label={removeLabel}
                title={removeLabel}
              >
                <X className="h-3.5 w-3.5" />
              </button>
            ) : null}
          </div>
        ) : (
          <div className="flex h-16 w-16 items-center justify-center rounded-xl border border-dashed border-[#D4E8FC] bg-[#F8FBFF] text-slate-400">
            <ImagePlus className="h-5 w-5" />
          </div>
        )}

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-slate-900">
            {value.trim() ? value.split("/").at(-1) : "No image selected"}
          </p>
          <p className="text-xs text-slate-500">
            {helperText ?? "Drag and drop an image here, or choose a file from your device."}
          </p>
          {recommendedSizeText ? <p className="mt-1 text-xs text-slate-500">{recommendedSizeText}</p> : null}
        </div>
      </div>

      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(event) => {
          event.preventDefault();
          if (!disabled && !isUploading) {
            setIsDragging(true);
          }
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        disabled={disabled || isUploading}
        className={cn(
          "flex w-full flex-col items-center justify-center rounded-xl border border-dashed px-4 py-6 text-center transition-colors",
          isDragging
            ? "border-[#1B66B3] bg-[#EAF4FF]"
            : "border-[#C3DDF9] bg-[#F8FBFF] hover:border-[#9FC8F2] hover:bg-[#F4F9FF]",
          (disabled || isUploading) && "cursor-not-allowed opacity-70",
        )}
      >
        {isUploading ? <Loader2 className="h-5 w-5 animate-spin text-[#1B66B3]" /> : <UploadCloud className="h-5 w-5 text-[#1B66B3]" />}
        <span className="mt-2 text-sm font-medium text-slate-900">
          {isUploading ? "Uploading..." : "Drag and drop or click to upload"}
        </span>
        <span className="mt-1 text-xs text-slate-500">Supported: JPG, PNG, WEBP, GIF, AVIF up to 5MB.</span>
      </button>

      <input
        ref={fileInputRef}
        id={inputId}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0];

          if (file) {
            void uploadFile(file);
          }

          event.currentTarget.value = "";
        }}
      />

      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-h-[92vh] w-[calc(100vw-1rem)] max-w-4xl border-[#D4E8FC] bg-[#0F172A] p-2 sm:p-4">
          <DialogTitle className="sr-only">{previewAlt || "Image preview"}</DialogTitle>
          {previewSrc ? (
            <div className="flex items-center justify-center">
              <Image
                src={previewSrc}
                alt={previewAlt}
                width={1600}
                height={1000}
                className="max-h-[82vh] w-auto max-w-full rounded-lg object-contain"
                unoptimized
              />
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}
