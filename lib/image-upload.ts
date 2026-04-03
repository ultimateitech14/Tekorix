export const MIN_IMAGE_UPLOAD_SIZE_BYTES = 50 * 1024;
export const MAX_IMAGE_UPLOAD_SIZE_BYTES = 800 * 1024;

export function validateImageUploadFile(file: File) {
  if (!file.type.toLowerCase().startsWith("image/")) {
    return "Please choose a valid image file.";
  }

  if (file.size < MIN_IMAGE_UPLOAD_SIZE_BYTES) {
    return "Image must be at least 50KB.";
  }

  if (file.size > MAX_IMAGE_UPLOAD_SIZE_BYTES) {
    return "Image must be 800KB or smaller.";
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
