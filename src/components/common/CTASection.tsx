import Link from "next/link";
import { Button } from "@/components/common/Button";

export function CTASection({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <section className="bg-gradient-to-r from-secondary to-primary py-12 text-white lg:py-14">
      <div className="container-page flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
        <div>
          <h2 className="text-3xl font-black md:text-4xl">{title}</h2>
          <p className="mt-2 max-w-2xl text-white/85">{subtitle}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link href="/products"><Button variant="light">Browse Products</Button></Link>
          <Link href="/contact"><Button className="bg-white/10 ring-1 ring-white/40 hover:bg-white hover:text-primary">Contact Support</Button></Link>
        </div>
      </div>
    </section>
  );
}
