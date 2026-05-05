import { requestApi } from "@/lib/api/http";

export type BlogPostSection = {
  heading: string;
  paragraphs: string[];
  bullets?: string[];
};

export type PublicBlogPost = {
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
};

export async function listPublicBlogPosts() {
  const result = await requestApi<Array<PublicBlogPost & { id?: string }>>("/api/v1/blog-posts");
  return result.data;
}

export async function getPublicBlogPostBySlug(slug: string) {
  const result = await requestApi<PublicBlogPost & { id?: string }>(`/api/v1/blog-posts/${encodeURIComponent(slug)}`);
  return result.data;
}
