import { requestApi } from "@/lib/api/http";
import type { BlogPostSection, PublicBlogPost } from "@/lib/api/blog-posts";

export type AdminBlogPost = PublicBlogPost & {
  id: string;
  isPublished: boolean;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type AdminBlogPostPayload = {
  slug: string;
  category: string;
  date: string;
  readTime: string;
  title: string;
  description: string;
  coverImage: string;
  coverAlt: string;
  intro: string;
  sections: BlogPostSection[];
  isPublished?: boolean;
};

type AdminAuthContext = {
  token?: string | null;
};

function withAdminAuth(context?: AdminAuthContext) {
  return {
    auth: true as const,
    token: context?.token,
  };
}

export async function getAdminBlogPosts(context?: AdminAuthContext) {
  const result = await requestApi<AdminBlogPost[]>("/api/v1/admin/blog-posts", withAdminAuth(context));
  return result.data;
}

export async function createAdminBlogPost(payload: AdminBlogPostPayload, context?: AdminAuthContext) {
  return requestApi<AdminBlogPost, AdminBlogPostPayload>("/api/v1/admin/blog-posts", {
    ...withAdminAuth(context),
    method: "POST",
    body: payload,
  });
}

export async function updateAdminBlogPost(id: string, payload: AdminBlogPostPayload, context?: AdminAuthContext) {
  return requestApi<AdminBlogPost, AdminBlogPostPayload>(`/api/v1/admin/blog-posts/${id}`, {
    ...withAdminAuth(context),
    method: "PUT",
    body: payload,
  });
}

export async function deleteAdminBlogPost(id: string, context?: AdminAuthContext) {
  return requestApi<null>(`/api/v1/admin/blog-posts/${id}`, {
    ...withAdminAuth(context),
    method: "DELETE",
  });
}

export async function publishAdminBlogPost(id: string, isPublished: boolean, context?: AdminAuthContext) {
  return requestApi<AdminBlogPost, { isPublished: boolean }>(`/api/v1/admin/blog-posts/${id}/publish`, {
    ...withAdminAuth(context),
    method: "PATCH",
    body: { isPublished },
  });
}
