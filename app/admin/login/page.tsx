import { LoginForm } from "@/components/login-form";
import { hasSupabaseEnv } from "@/lib/supabase/env";

export default function LoginPage() {
  return <LoginForm configured={hasSupabaseEnv()} />;
}
