import Link from "next/link";

export default function NotFoundPage() {
  return (
    <main className="bg-soft py-16 lg:py-24">
      <div className="container-page">
        <section className="mx-auto max-w-3xl rounded-3xl border border-zinc-100 bg-white px-6 py-14 text-center shadow-sm sm:px-10">
          <p className="text-sm font-black uppercase tracking-[0.28em] text-primary">404</p>
          <h1 className="mt-4 text-4xl font-black text-ink sm:text-5xl">Page Not Found</h1>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-zinc-500 sm:text-base">
            The page you are looking for is unavailable or may have been moved. You can return to the storefront and continue browsing.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link href="/" className="inline-flex h-12 items-center justify-center rounded-xl bg-primary px-6 text-sm font-black uppercase text-white transition-all hover:-translate-y-0.5 hover:bg-accent">
              Back to Home
            </Link>
            <Link href="/shop" className="inline-flex h-12 items-center justify-center rounded-xl border border-zinc-200 px-6 text-sm font-black uppercase text-ink transition-all hover:-translate-y-0.5 hover:border-primary hover:text-primary">
              Browse Shop
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
