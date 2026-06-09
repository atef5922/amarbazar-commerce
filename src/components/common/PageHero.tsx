import Link from "next/link";

export function PageHero({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <section className="bg-gradient-to-r from-soft via-white to-soft py-10 lg:py-14">
      <div className="container-page">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 text-xs font-bold uppercase text-zinc-500">
            <Link href="/" className="transition-colors hover:text-primary">Home</Link>
            <span>/</span>
            <span className="text-primary">{title}</span>
          </div>
          <h1 className="mt-3 text-4xl font-black text-ink md:text-5xl">{title}</h1>
          <p className="mt-3 text-base leading-7 text-zinc-600 md:text-lg">{subtitle}</p>
        </div>
      </div>
    </section>
  );
}
