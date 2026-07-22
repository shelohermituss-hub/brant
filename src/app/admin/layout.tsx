import { redirect } from "next/navigation";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { requireAdmin, RequireAdminError } from "@/lib/supabase/require-admin";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  let adminName = "";

  try {
    const { profile } = await requireAdmin();
    adminName = profile.full_name;
  } catch (error) {
    if (error instanceof RequireAdminError && error.status === 401) {
      redirect("/onboarding/signin");
    }
    redirect("/home");
  }

  return (
    <div className="flex h-svh w-full">
      <AdminSidebar adminName={adminName} />
      <main className="flex-1 overflow-y-auto bg-surface-muted">{children}</main>
    </div>
  );
}
