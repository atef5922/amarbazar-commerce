import { Suspense } from "react";
import { AdminAuth } from "@/components/admin/AdminAuth";

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<div className="grid min-h-screen place-items-center bg-[#f7f7fb] font-black">Loading admin login...</div>}>
      <AdminAuth mode="login" />
    </Suspense>
  );
}
