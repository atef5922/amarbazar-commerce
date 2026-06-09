"use client";

import { usePathname } from "next/navigation";
import { ActivityPopup } from "@/components/common/ActivityPopup";
import { BackToTop } from "@/components/common/BackToTop";
import { CommerceToast } from "@/components/common/CommerceToast";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { QuickViewModal } from "@/components/product/QuickViewModal";

export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <Header />
      {children}
      <Footer />
      <CartDrawer />
      <CommerceToast />
      <QuickViewModal />
      <ActivityPopup />
      <BackToTop />
    </>
  );
}
