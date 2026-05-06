"use client";

import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { MoreHorizontal, Plus } from "lucide-react";
import { toast } from "sonner";

import { AdminImageUploadField } from "@/components/admin/AdminImageUploadField";
import { DataTable, type DataTableColumn } from "@/components/admin/DataTable";
import { FiltersBar } from "@/components/admin/FiltersBar";
import { StatusChip } from "@/components/admin/status-chip";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  createAdminBlogPost,
  deleteAdminBlogPost,
  getAdminBlogPosts,
  publishAdminBlogPost,
  updateAdminBlogPost,
  type AdminBlogPost,
  type AdminBlogPostPayload,
} from "@/lib/api/admin/blog-posts";
import type { BlogPostSection } from "@/lib/api/blog-posts";
import { ApiError } from "@/lib/api/http";
import { clearAuthToken } from "@/lib/auth/store";

type BlogRow = {
  id: string;
  title: string;
  category: string;
  date: string;
  status: string;
  updatedAt: string;
  slug: string;
};

type BlogEditorState = {
  slug: string;
  date: string;
  category: string;
  title: string;
  description: string;
  coverImage: string;
  content: string;
  isPublished: boolean;
};

const AUTO_SECTION_HEADING = "Overview";
const SECTION_MARKER = "## ";
const BULLET_MARKER = "- ";

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

function getCurrentMonthYear() {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
  }).format(new Date());
}

function estimateReadTime(text: string) {
  const totalWords = text
    .split(/\s+/)
    .map((item) => item.trim())
    .filter(Boolean).length;

  const minutes = Math.max(1, Math.ceil(totalWords / 180));
  return `${minutes} min read`;
}

function serializeBlogContent(post: AdminBlogPost) {
  const lines: string[] = [];
  const intro = post.intro.trim();

  if (intro) {
    lines.push(intro);
  }

  for (const section of post.sections) {
    const hideAutoHeading = post.sections.length === 1 && section.heading.trim() === AUTO_SECTION_HEADING;
    const paragraphs =
      hideAutoHeading && section.paragraphs[0]?.trim() === intro ? section.paragraphs.slice(1) : section.paragraphs;

    if (!paragraphs.length && !(section.bullets?.length ?? 0)) {
      continue;
    }

    if (lines.length) {
      lines.push("");
    }

    if (!hideAutoHeading && section.heading.trim()) {
      lines.push(`${SECTION_MARKER}${section.heading.trim()}`);
      lines.push("");
    }

    for (const paragraph of paragraphs) {
      lines.push(paragraph.trim());
      lines.push("");
    }

    for (const bullet of section.bullets ?? []) {
      lines.push(`${BULLET_MARKER}${bullet.trim()}`);
    }
  };

  return lines.join("\n").replace(/\n{3,}/g, "\n\n").trim();
}

function createEmptyEditorState(): BlogEditorState {
  return {
    slug: "",
    date: getCurrentMonthYear(),
    category: "",
    title: "",
    description: "",
    coverImage: "",
    content: "",
    isPublished: false,
  };
}

function mapPostToEditorState(post: AdminBlogPost): BlogEditorState {
  return {
    slug: post.slug,
    date: post.date,
    category: post.category,
    title: post.title,
    description: post.description,
    coverImage: post.coverImage,
    content: serializeBlogContent(post),
    isPublished: post.isPublished,
  };
}

function toContentBlocks(content: string) {
  return content
    .replace(/\r/g, "")
    .split(/\n{2,}/)
    .map((block) => block.split("\n").map((line) => line.trim()).filter(Boolean))
    .filter((block) => block.length);
}

function parseContentToSections(content: string) {
  const blocks = toContentBlocks(content);

  if (!blocks.length) {
    throw new Error("Content is required.");
  }

  const sections: BlogPostSection[] = [];
  let intro = "";
  let currentHeading = AUTO_SECTION_HEADING;
  let currentParagraphs: string[] = [];
  let currentBullets: string[] = [];

  function flushSection() {
    if (!currentParagraphs.length && !currentBullets.length) {
      return;
    }

    sections.push({
      heading: currentHeading,
      paragraphs: currentParagraphs.length ? currentParagraphs : [intro],
      bullets: currentBullets.length ? currentBullets : undefined,
    });

    currentParagraphs = [];
    currentBullets = [];
    currentHeading = AUTO_SECTION_HEADING;
  }

  for (const block of blocks) {
    if (block.length === 1 && block[0].startsWith(SECTION_MARKER)) {
      flushSection();
      currentHeading = block[0].slice(SECTION_MARKER.length).trim() || AUTO_SECTION_HEADING;
      continue;
    }

    const bullets = block
      .filter((line) => line.startsWith(BULLET_MARKER))
      .map((line) => line.slice(BULLET_MARKER.length).trim())
      .filter(Boolean);

    const isBulletBlock = bullets.length === block.length;

    if (!intro && !isBulletBlock) {
      intro = block.join(" ");
      continue;
    }

    if (isBulletBlock) {
      currentBullets.push(...bullets);
      continue;
    }

    currentParagraphs.push(block.join(" "));
  }

  flushSection();

  if (!intro) {
    intro = sections[0]?.paragraphs[0] ?? "";
  }

  if (!intro) {
    throw new Error("Add at least one paragraph to content.");
  }

  if (!sections.length) {
    sections.push({
      heading: AUTO_SECTION_HEADING,
      paragraphs: [intro],
    });
  }

  return {
    intro,
    sections,
    readTime: estimateReadTime(
      [intro, ...sections.flatMap((section) => [...section.paragraphs, ...(section.bullets ?? [])])].join(" "),
    ),
  };
}

function formatDate(value: string) {
  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) {
    return "Recently";
  }

  return parsed.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function BlogAdminPageContent() {
  const router = useRouter();
  const pathname = usePathname() ?? "/admin/blog";
  const searchParams = useSearchParams();
  const view = searchParams?.get("view") ?? "";

  const [posts, setPosts] = useState<AdminBlogPost[]>([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [editorState, setEditorState] = useState<BlogEditorState>(createEmptyEditorState);
  const [isSaving, setIsSaving] = useState(false);
  const [actionPostId, setActionPostId] = useState<string | null>(null);

  useEffect(() => {
    setIsEditorOpen(view === "new");

    if (view === "new") {
      setEditingPostId(null);
      setEditorState(createEmptyEditorState());
    }
  }, [view]);

  const loadPosts = useCallback(async () => {
    setIsLoading(true);

    try {
      const items = await getAdminBlogPosts();
      setPosts(items);
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        clearAuthToken();
        router.replace("/admin/login");
        return;
      }

      toast.error(error instanceof Error ? error.message : "Unable to load blog posts.");
      setPosts([]);
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  useEffect(() => {
    void loadPosts();
  }, [loadPosts]);

  const filteredPosts = useMemo(() => {
    const normalizedQuery = search.trim().toLowerCase();

    return posts.filter((post) => {
      const haystack = [post.title, post.category, post.slug, post.description].join(" ").toLowerCase();
      const matchesSearch = !normalizedQuery || haystack.includes(normalizedQuery);
      const matchesStatus =
        status === "all" ||
        (status === "published" && post.isPublished) ||
        (status === "draft" && !post.isPublished);

      return matchesSearch && matchesStatus;
    });
  }, [posts, search, status]);

  function syncEditorQuery(open: boolean) {
    const params = new URLSearchParams(searchParams?.toString() ?? "");

    if (open && !editingPostId) {
      params.set("view", "new");
    } else {
      params.delete("view");
    }

    const nextQuery = params.toString();
    router.replace(nextQuery ? `${pathname}?${nextQuery}` : pathname, { scroll: false });
  }

  function openCreateDialog() {
    setEditingPostId(null);
    setEditorState(createEmptyEditorState());
    setIsEditorOpen(true);
    syncEditorQuery(true);
  }

  function openEditDialog(post: AdminBlogPost) {
    setEditingPostId(post.id);
    setEditorState(mapPostToEditorState(post));
    setIsEditorOpen(true);
    syncEditorQuery(false);
  }

  function closeEditorDialog() {
    setIsEditorOpen(false);
    setEditingPostId(null);
    setEditorState(createEmptyEditorState());
    syncEditorQuery(false);
  }

  function updateEditorField<K extends keyof BlogEditorState>(field: K, value: BlogEditorState[K]) {
    setEditorState((current) => {
      const next = {
        ...current,
        [field]: value,
      };

      if (field === "title" && !editingPostId && (!current.slug || current.slug === slugify(current.title))) {
        next.slug = slugify(String(value));
      }

      return next;
    });
  }

  async function handleSavePost() {
    let contentPayload: ReturnType<typeof parseContentToSections>;

    try {
      contentPayload = parseContentToSections(editorState.content);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Content details are invalid.");
      return;
    }

    const payload: AdminBlogPostPayload = {
      slug: editingPostId ? editorState.slug : slugify(editorState.title),
      category: editorState.category.trim(),
      date: editorState.date.trim(),
      readTime: contentPayload.readTime,
      title: editorState.title.trim(),
      description: editorState.description.trim(),
      coverImage: editorState.coverImage.trim(),
      coverAlt: `${editorState.title.trim()} article cover image`,
      intro: contentPayload.intro,
      sections: contentPayload.sections,
      isPublished: editorState.isPublished,
    };

    if (
      !payload.slug ||
      !payload.category ||
      !payload.title ||
      !payload.coverImage ||
      !editorState.content.trim()
    ) {
      toast.error("Complete all required blog fields.");
      return;
    }

    setIsSaving(true);

    try {
      if (editingPostId) {
        const result = await updateAdminBlogPost(editingPostId, payload);
        toast.success(result.message);
      } else {
        const result = await createAdminBlogPost(payload);
        toast.success(result.message);
      }

      closeEditorDialog();
      await loadPosts();
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        clearAuthToken();
        router.replace("/admin/login");
        return;
      }

      toast.error(error instanceof Error ? error.message : "Unable to save blog post.");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleTogglePublish(post: AdminBlogPost) {
    setActionPostId(post.id);

    try {
      const result = await publishAdminBlogPost(post.id, !post.isPublished);
      toast.success(result.message);
      await loadPosts();
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        clearAuthToken();
        router.replace("/admin/login");
        return;
      }

      toast.error(error instanceof Error ? error.message : "Unable to update blog status.");
    } finally {
      setActionPostId(null);
    }
  }

  async function handleDelete(post: AdminBlogPost) {
    if (!window.confirm(`Delete "${post.title}"?`)) {
      return;
    }

    setActionPostId(post.id);

    try {
      const result = await deleteAdminBlogPost(post.id);
      toast.success(result.message);
      await loadPosts();
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        clearAuthToken();
        router.replace("/admin/login");
        return;
      }

      toast.error(error instanceof Error ? error.message : "Unable to delete blog post.");
    } finally {
      setActionPostId(null);
    }
  }

  const columns: DataTableColumn<BlogRow>[] = [
    {
      id: "title",
      header: "Title",
      cell: (row) => (
        <div>
          <p className="font-medium text-slate-900">{row.title}</p>
          <p className="text-xs text-slate-500">/{row.slug}</p>
        </div>
      ),
    },
    {
      id: "category",
      header: "Category",
      cell: (row) => <span className="text-slate-600">{row.category}</span>,
    },
    {
      id: "date",
      header: "Date Label",
      cell: (row) => <span className="text-slate-600">{row.date}</span>,
    },
    {
      id: "status",
      header: "Status",
      cell: (row) => <StatusChip status={row.status} />,
    },
    {
      id: "updatedAt",
      header: "Updated",
      cell: (row) => <span className="text-slate-600">{row.updatedAt}</span>,
    },
    {
      id: "actions",
      header: "Actions",
      headerClassName: "text-right",
      className: "text-right",
      cell: (row) => {
        const post = posts.find((item) => item.id === row.id);

        if (!post) {
          return null;
        }

        return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                className="text-slate-900 hover:bg-[#EDF5FF] hover:text-slate-900 data-[state=open]:bg-[#EDF5FF] data-[state=open]:text-slate-900"
              >
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Open actions</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="border-[#D4E8FC] bg-[#F8FBFF] text-slate-900">
              <DropdownMenuItem asChild className="cursor-pointer text-slate-900 focus:bg-[#EDF5FF] focus:text-slate-900 data-[highlighted]:bg-[#EDF5FF] data-[highlighted]:text-slate-900">
                <Link href={`/blog/${post.slug}`} target="_blank" rel="noreferrer">
                  Open public page
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer text-slate-900 focus:bg-[#EDF5FF] focus:text-slate-900 data-[highlighted]:bg-[#EDF5FF] data-[highlighted]:text-slate-900"
                onClick={() => openEditDialog(post)}
              >
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer text-slate-900 focus:bg-[#EDF5FF] focus:text-slate-900 data-[highlighted]:bg-[#EDF5FF] data-[highlighted]:text-slate-900"
                onClick={() => {
                  void handleTogglePublish(post);
                }}
                disabled={actionPostId === post.id}
              >
                {post.isPublished ? "Move to Draft" : "Publish"}
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-[#D4E8FC]" />
              <DropdownMenuItem
                className="cursor-pointer text-rose-600 focus:bg-rose-100 focus:text-rose-700 data-[highlighted]:bg-rose-100 data-[highlighted]:text-rose-700 disabled:text-rose-300"
                onClick={() => {
                  void handleDelete(post);
                }}
                disabled={actionPostId === post.id}
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const rows = filteredPosts.map((post) => ({
    id: post.id,
    title: post.title,
    category: post.category,
    date: post.date,
    status: post.isPublished ? "Published" : "Draft",
    updatedAt: formatDate(post.updatedAt),
    slug: post.slug,
  }));

  return (
    <>
      <div className="space-y-4">
        <FiltersBar
          searchValue={search}
          onSearchChange={setSearch}
          searchPlaceholder="Search blog posts by title, slug, or category"
          filters={[
            {
              label: "Status",
              value: status,
              onChange: setStatus,
              options: [
                { label: "All Statuses", value: "all" },
                { label: "Published", value: "published" },
                { label: "Draft", value: "draft" },
              ],
            },
          ]}
          extra={
            <Button type="button" onClick={openCreateDialog}>
              <Plus className="h-4 w-4" />
              Create Post
            </Button>
          }
        />

        <DataTable
          title="Blog Posts"
          description="Manage public blog articles and publish them to the website."
          columns={columns}
          data={rows}
          getRowId={(row) => row.id}
          emptyMessage={isLoading ? "Loading blog posts..." : "No blog posts found."}
          footer={<p className="text-xs text-slate-500">{filteredPosts.length} posts</p>}
        />
      </div>

      <Dialog open={isEditorOpen} onOpenChange={(open) => (open ? setIsEditorOpen(true) : closeEditorDialog())}>
        <DialogContent className="max-h-[92vh] w-[calc(100vw-1rem)] max-w-4xl overflow-y-auto rounded-xl border-[#D4E8FC] bg-[#F8FBFF] p-4 text-slate-900 sm:p-6">
          <DialogHeader className="pr-8">
            <DialogTitle>{editingPostId ? "Edit Blog Post" : "Create Blog Post"}</DialogTitle>
            <DialogDescription className="text-slate-500">
              Update the content that appears on the public blog and homepage article section.
            </DialogDescription>
          </DialogHeader>

          <div className="rounded-2xl border border-[#D4E8FC] bg-[#F4F9FF] px-4 py-3 text-sm text-slate-600">
            The blog URL, publish date, estimated reading time, and image alt text are generated automatically from your post details.
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input
                value={editorState.title}
                onChange={(event) => updateEditorField("title", event.target.value)}
                placeholder="Enter the blog post title"
              />
            </div>
            <div className="space-y-2">
              <Label>Category</Label>
              <Input
                value={editorState.category}
                onChange={(event) => updateEditorField("category", event.target.value)}
                placeholder="e.g. Hiring, Careers, Technology"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <AdminImageUploadField
                label="Cover Image"
                value={editorState.coverImage}
                folder="blog"
                previewAlt={editorState.title || "Blog cover image"}
                helperText="Upload the image that should appear on the blog card and article header."
                recommendedSizeText="Recommended: landscape image for blog cards and hero preview."
                onChange={(nextValue) => updateEditorField("coverImage", nextValue)}
                removeLabel="Remove Cover"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Description</Label>
              <Textarea
                value={editorState.description}
                onChange={(event) => updateEditorField("description", event.target.value)}
                className="min-h-24"
                placeholder="Optional: add a short summary for the blog card and article page"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Content</Label>
              <Textarea
                value={editorState.content}
                onChange={(event) => updateEditorField("content", event.target.value)}
                className="min-h-72"
                placeholder={[
                  "Write the article here.",
                  "",
                  "First paragraph becomes the intro.",
                  "",
                  "## Optional section heading",
                  "",
                  "Add normal paragraphs with a blank line between them.",
                  "",
                  "- Optional bullet point",
                  "- Another bullet point",
                ].join("\n")}
              />
              <p className="text-xs text-slate-500">
                Keep it simple: first paragraph intro banega. Blank line paragraph separate karti hai. Optional section heading ke liye `## Heading`, aur bullets ke liye `- item` use kar sakte ho.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3 rounded-lg border border-[#D4E8FC] bg-[#F4F9FF] px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-900">Publish post</p>
              <p className="text-xs text-slate-500">Published posts appear on `/blog` and the homepage article section.</p>
            </div>
            <button
              type="button"
              onClick={() => updateEditorField("isPublished", !editorState.isPublished)}
              className={`relative inline-flex h-7 w-14 items-center rounded-full border transition-colors ${
                editorState.isPublished ? "border-amber-300/60 bg-amber-300/30" : "border-[#BAD7F6] bg-slate-500/20"
              }`}
              aria-label="Toggle publish state"
            >
              <span
                className={`inline-block h-5 w-5 rounded-full bg-white transition-transform ${
                  editorState.isPublished ? "translate-x-8" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={closeEditorDialog} disabled={isSaving}>
              Cancel
            </Button>
            <Button onClick={() => void handleSavePost()} disabled={isSaving}>
              {isSaving ? "Saving..." : editingPostId ? "Save Changes" : "Create Post"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default function BlogAdminPage() {
  return (
    <Suspense fallback={<p className="text-sm text-slate-500">Loading blog admin...</p>}>
      <BlogAdminPageContent />
    </Suspense>
  );
}
