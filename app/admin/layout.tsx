import type { Metadata } from "next";

import { noIndexRobots } from "@/lib/seo";

type AdminLayoutProps = {
  children: React.ReactNode;
};

export const metadata: Metadata = {
  robots: noIndexRobots,
};

export default function AdminLayout({ children }: AdminLayoutProps) {
  return <>{children}</>;
}
