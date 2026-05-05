import { requestApi } from "@/lib/api/http";

export type AdminImageUploadFolder = "blog" | "team" | "profiles";

export async function uploadAdminImage(payload: {
  folder: AdminImageUploadFolder;
  fileName: string;
  dataUrl: string;
}) {
  const result = await requestApi<{ path: string }, typeof payload>("/api/admin/media/images", {
    auth: true,
    method: "POST",
    body: payload,
  });

  return result.data.path;
}
