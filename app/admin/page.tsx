import { redirect } from "next/navigation";
import { AdminDashboard } from "@/components/AdminDashboard";
import { getImoveis } from "@/lib/imoveis";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  if (!hasSupabaseEnv()) {
    redirect("/admin/login");
  }

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  const { data } = await getImoveis();

  return <AdminDashboard initialImoveis={data} email={user.email ?? "corretor"} />;
}
