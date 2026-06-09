import { redirect } from "next/navigation";
import AdminShell from "@/components/adminlayoutWrapper";
//import { requireAdminRole } from "@/lib/auth";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  //await requireAdminRole();

  if (!children) {
    redirect("/admin/dashboard");
  }

  return <AdminShell>{children}</AdminShell>;
}
