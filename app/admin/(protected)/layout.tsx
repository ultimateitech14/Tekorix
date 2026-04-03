import { AdminLayout } from "@/components/admin/AdminLayout";

type ProtectedAdminLayoutProps = {
  children: React.ReactNode;
};

export default function ProtectedAdminLayout({ children }: ProtectedAdminLayoutProps) {
  return <AdminLayout>{children}</AdminLayout>;
}
