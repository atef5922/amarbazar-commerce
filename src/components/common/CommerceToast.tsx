"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { useCommerceStore } from "@/store/useCommerceStore";

export function CommerceToast() {
  const { toast, dismissToast } = useCommerceStore();

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(dismissToast, 2600);
    return () => window.clearTimeout(timer);
  }, [toast, dismissToast]);

  return (
    <AnimatePresence>
      {toast ? (
        <motion.div
          className="fixed right-4 top-24 z-[100] flex max-w-[calc(100vw-32px)] items-center gap-3 rounded-xl border border-primary/15 bg-white px-4 py-3 text-sm font-bold text-ink shadow-xl sm:right-6"
          initial={{ opacity: 0, y: -14, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -14, scale: 0.98 }}
          transition={{ duration: 0.22 }}
        >
          <CheckCircle2 className="h-5 w-5 shrink-0 text-primary" />
          <span className="line-clamp-2">{toast}</span>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
