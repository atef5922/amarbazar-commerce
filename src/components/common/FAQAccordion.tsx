"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { cn } from "@/utils/cn";

export function FAQAccordion({ items }: { items: string[][] }) {
  const [open, setOpen] = useState(0);

  return (
    <div className="grid gap-3">
      {items.map(([question, answer], index) => (
        <div key={question} className="border border-zinc-100 bg-white shadow-sm">
          <button
            className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left font-bold transition-colors hover:text-primary"
            onClick={() => setOpen(open === index ? -1 : index)}
          >
            {question}
            <ChevronDown className={cn("h-4 w-4 shrink-0 transition-transform duration-300", open === index && "rotate-180")} />
          </button>
          <div className={cn("grid transition-all duration-300", open === index ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}>
            <div className="overflow-hidden">
              <p className="border-t border-zinc-100 px-5 py-4 text-sm leading-7 text-zinc-600">{answer}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
