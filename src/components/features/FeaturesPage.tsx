import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, ShieldCheck } from "lucide-react";
import { Button } from "@/components/common/Button";
import { CTASection } from "@/components/common/CTASection";
import { FAQAccordion } from "@/components/common/FAQAccordion";
import { comparisonRows, featureHighlights, howItWorks } from "@/data/features";
import { featureFaqs } from "@/data/faqs";

export function FeaturesPage() {
  return (
    <main className="bg-soft">
      <section className="bg-gradient-to-r from-white via-soft to-white py-14 lg:py-20">
        <div className="container-page grid items-center gap-10 lg:grid-cols-[1fr_0.85fr]">
          <div>
            <p className="text-sm font-black uppercase text-primary">AmarBazar Features</p>
            <h1 className="mt-3 max-w-3xl text-4xl font-black leading-tight text-ink md:text-6xl">Why Shop With AmarBazar?</h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-zinc-600">
              A faster, simpler, and more reliable online shopping experience for Bangladesh.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/products"><Button>Start Shopping</Button></Link>
              <Link href="/products"><Button variant="secondary">View Offers</Button></Link>
            </div>
          </div>
          <div className="relative min-h-[360px] overflow-hidden bg-white shadow-soft">
            <Image
              src="https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?auto=format&fit=crop&w=900&q=80"
              alt="Happy online shopping"
              fill
              priority
              sizes="650px"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-secondary/35 to-primary/15" />
          </div>
        </div>
      </section>

      <section className="bg-white py-12 lg:py-16">
        <div className="container-page">
          <SectionHeading eyebrow="Highlights" title="Everything shoppers expect from a modern store" />
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {featureHighlights.map((feature) => (
              <FeatureCard key={feature.title} {...feature} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-soft py-12 lg:py-16">
        <div className="container-page">
          <SectionHeading eyebrow="How It Works" title="A simple shopping journey" />
          <div className="mt-8 grid gap-4 md:grid-cols-4">
            {howItWorks.map((step, index) => (
              <StepCard key={step.title} index={index + 1} {...step} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-12 lg:py-16">
        <div className="container-page grid items-center gap-10 lg:grid-cols-[0.9fr_1fr]">
          <div>
            <SectionHeading eyebrow="Benefits" title="Built for Bangladesh-relevant shopping" align="left" />
            <div className="mt-6 grid gap-3">
              {[
                "Curated quality products",
                "Bangladesh-relevant product collection",
                "Simple checkout",
                "Transparent pricing",
                "Easy customer support",
                "Reliable delivery process"
              ].map((benefit) => (
                <p key={benefit} className="flex items-center gap-3 text-zinc-600">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  {benefit}
                </p>
              ))}
            </div>
          </div>
          <div className="relative min-h-[420px] overflow-hidden bg-soft shadow-sm">
            <Image
              src="https://images.unsplash.com/photo-1607083206968-13611e3d76db?auto=format&fit=crop&w=900&q=80"
              alt="Shopping packages"
              fill
              sizes="700px"
              className="object-cover transition-transform duration-700 hover:scale-105"
            />
          </div>
        </div>
      </section>

      <section className="bg-soft py-12 lg:py-16">
        <div className="container-page">
          <SectionHeading eyebrow="Compare" title="AmarBazar vs typical online store" />
          <div className="mt-8 overflow-x-auto bg-white shadow-sm">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="bg-secondary text-white">
                <tr>
                  <th className="p-4">Feature</th>
                  <th className="p-4">AmarBazar</th>
                  <th className="p-4">Typical Online Store</th>
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map(([feature, amarbazar, typical]) => (
                  <tr key={feature} className="border-b border-zinc-100">
                    <td className="p-4 font-bold">{feature}</td>
                    <td className="p-4 text-zinc-600">{amarbazar}</td>
                    <td className="p-4 text-zinc-500">{typical}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-r from-secondary to-primary py-10 text-white">
        <div className="container-page grid gap-4 md:grid-cols-4">
          {["Free Shipping Offers", "Easy Return", "Secure Checkout", "Support Available"].map((promise) => (
            <div key={promise} className="flex items-center gap-3 bg-white/10 p-5 ring-1 ring-white/20 transition-transform duration-300 hover:-translate-y-1">
              <ShieldCheck className="h-6 w-6" />
              <span className="font-black">{promise}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white py-12 lg:py-16">
        <div className="container-page grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <SectionHeading eyebrow="FAQ" title="Common AmarBazar questions" align="left" />
          <FAQAccordion items={featureFaqs} />
        </div>
      </section>

      <CTASection title="Ready to shop smarter?" subtitle="Browse AmarBazar products or contact support for help choosing the right item." />
    </main>
  );
}

function SectionHeading({ eyebrow, title, align = "center" }: { eyebrow: string; title: string; align?: "left" | "center" }) {
  return (
    <div className={align === "center" ? "mx-auto max-w-3xl text-center" : "max-w-2xl"}>
      <p className="text-sm font-black uppercase text-primary">{eyebrow}</p>
      <h2 className="mt-2 text-3xl font-black text-ink md:text-4xl">{title}</h2>
    </div>
  );
}

function FeatureCard({ title, description, icon: Icon }: { title: string; description: string; icon: React.ElementType }) {
  return (
    <article className="group bg-white p-6 shadow-sm ring-1 ring-zinc-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:ring-primary/20">
      <div className="grid h-12 w-12 place-items-center bg-soft text-primary transition-all duration-300 group-hover:bg-primary group-hover:text-white">
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="mt-5 text-lg font-black">{title}</h3>
      <p className="mt-2 text-sm leading-7 text-zinc-600">{description}</p>
    </article>
  );
}

function StepCard({ title, description, icon: Icon, index }: { title: string; description: string; icon: React.ElementType; index: number }) {
  return (
    <article className="relative bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <span className="absolute right-5 top-5 text-4xl font-black text-soft">{index}</span>
      <Icon className="h-8 w-8 text-primary" />
      <h3 className="mt-5 text-lg font-black">{title}</h3>
      <p className="mt-2 text-sm leading-7 text-zinc-600">{description}</p>
    </article>
  );
}
