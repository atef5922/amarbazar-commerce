import { AuthForm } from "@/components/auth/AuthForm";

export const dynamic = "force-dynamic";

export default function ForgotPasswordPage() {
  return <AuthForm mode="forgot" />;
}
