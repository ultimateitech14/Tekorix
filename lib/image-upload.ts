export const MAX_IMAGE_UPLOAD_SIZE_BYTES = 5 * 1024 * 1024;
export const SUPPORTED_IMAGE_UPLOAD_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
] as const;

export function validateImageUploadFile(file: File) {
  if (!SUPPORTED_IMAGE_UPLOAD_TYPES.includes(file.type.toLowerCase() as (typeof SUPPORTED_IMAGE_UPLOAD_TYPES)[number])) {
    return "Please choose a JPG, PNG, WEBP, GIF, or AVIF image.";
  }

  if (file.size > MAX_IMAGE_UPLOAD_SIZE_BYTES) {
    return "Image must be 5MB or smaller.";
  }

  return null;
}

export function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      const result = reader.result;

      if (typeof result === "string") {
        resolve(result);
        return;
      }

      reject(new Error("Unable to read file."));
    };

    reader.onerror = () => {
      reject(new Error("Unable to read file."));
    };

    reader.readAsDataURL(file);
  });
}
