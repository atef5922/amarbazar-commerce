import { ShopClient } from "@/components/shop/ShopClient";
import { Suspense } from "react";

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="bg-soft py-20 text-center font-black">Loading shop...</div>}>
      <ShopClient />
    </Suspense>
  );
}
