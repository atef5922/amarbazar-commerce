"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Send, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/common/Button";
import { PageHero } from "@/components/common/PageHero";
import { FAQAccordion } from "@/components/common/FAQAccordion";
import { contactInfo, supportTypes } from "@/data/contact";
import { contactFaqs } from "@/data/faqs";
import { cn } from "@/utils/cn";

const contactSchema = z.object({
  supportType: z.string().min(1, "Please select a support type."),
  fullName: z.string().min(2, "Full name is required."),
  email: z.string().email("Enter a valid email address."),
  phone: z.string().regex(/^(?:\+?88)?01[3-9]\d{8}$|^\d{3}-\d{3}-\d{3}$/, "Enter a valid phone number."),
  subject: z.string().min(3, "Subject is required."),
  message: z.string().min(10, "Message should be at least 10 characters.")
});

type ContactFormValues = z.infer<typeof contactSchema>;

export function ContactPageClient() {
  const [submitted, setSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      supportType: "Order Support",
      fullName: "",
      email: "",
      phone: "",
      subject: "",
      message: ""
    }
  });

  const selectedType = watch("supportType");

  function onSubmit() {
    setSubmitted(true);
    reset({
      supportType: "Order Support",
      fullName: "",
      email: "",
      phone: "",
      subject: "",
      message: ""
    });
    window.setTimeout(() => setSubmitted(false), 3500);
  }

  return (
    <main className="bg-soft">
      <PageHero title="Contact Us" subtitle="We are here to help you with orders, products, and support." />

      <section className="py-10 lg:py-12">
        <div className="container-page grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {contactInfo.map((item) => (
            <article key={item.title} className="group bg-white p-6 shadow-sm ring-1 ring-zinc-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:ring-primary/20">
              <div className="grid h-12 w-12 place-items-center bg-soft text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-white">
                <item.icon className="h-6 w-6" />
              </div>
              <h2 className="mt-5 font-black">{item.title}</h2>
              <p className="mt-2 text-sm font-bold text-ink">{item.value}</p>
              <p className="mt-1 text-sm leading-6 text-zinc-500">{item.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-white py-10 lg:py-14">
        <div className="container-page grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6 shadow-sm ring-1 ring-zinc-100 lg:p-8">
            <p className="text-sm font-black uppercase text-primary">Support Form</p>
            <h2 className="mt-2 text-3xl font-black">Send Message</h2>

            <div className="mt-6">
              <p className="mb-3 text-sm font-bold">Support Type</p>
              <div className="flex flex-wrap gap-2">
                {supportTypes.map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setValue("supportType", type, { shouldValidate: true })}
                    className={cn(
                      "border border-zinc-200 px-4 py-2 text-sm font-bold transition-all duration-300 hover:border-primary hover:text-primary",
                      selectedType === type && "border-primary bg-primary text-white hover:text-white"
                    )}
                  >
                    {type}
                  </button>
                ))}
              </div>
              {errors.supportType ? <FieldError message={errors.supportType.message} /> : null}
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <Field label="Full Name" error={errors.fullName?.message}><input {...register("fullName")} className={inputClass} placeholder="Your full name" /></Field>
              <Field label="Email Address" error={errors.email?.message}><input {...register("email")} className={inputClass} placeholder="you@example.com" /></Field>
              <Field label="Phone Number" error={errors.phone?.message}><input {...register("phone")} className={inputClass} placeholder="01XXXXXXXXX" /></Field>
              <Field label="Subject" error={errors.subject?.message}><input {...register("subject")} className={inputClass} placeholder="How can we help?" /></Field>
            </div>
            <Field label="Message" error={errors.message?.message} className="mt-4">
              <textarea {...register("message")} className={`${inputClass} min-h-36 py-3`} placeholder="Write your message" />
            </Field>
            <Button className="mt-5" disabled={isSubmitting}><Send className="h-4 w-4" /> Submit Message</Button>
            {submitted ? (
              <p className="mt-4 flex items-center gap-2 bg-emerald-50 p-3 text-sm font-bold text-emerald-700">
                <ShieldCheck className="h-4 w-4" /> Message received. AmarBazar support will contact you soon.
              </p>
            ) : null}
          </form>

          <div className="grid gap-5">
            <MapPlaceholder />
            <div className="bg-gradient-to-r from-secondary to-primary p-6 text-white shadow-sm">
              <p className="text-sm font-bold uppercase text-white/80">Need urgent help?</p>
              <h2 className="mt-2 text-3xl font-black">Call us now or send a message</h2>
              <div className="mt-5 flex flex-wrap gap-3">
                <a href="tel:123456789"><Button variant="light">Call Us Now</Button></a>
                <Button className="bg-white/10 ring-1 ring-white/40 hover:bg-white hover:text-primary">Send Message</Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-soft py-12 lg:py-14">
        <div className="container-page grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="text-sm font-black uppercase text-primary">Help Center</p>
            <h2 className="mt-2 text-3xl font-black">Frequently asked support questions</h2>
          </div>
          <FAQAccordion items={contactFaqs} />
        </div>
      </section>
    </main>
  );
}

const inputClass = "h-11 w-full border border-zinc-200 px-3 text-sm outline-none transition-colors duration-300 focus:border-primary";

function Field({ label, error, children, className }: { label: string; error?: string; children: React.ReactNode; className?: string }) {
  return (
    <label className={cn("block text-sm font-bold", className)}>
      {label}
      <div className="mt-2">{children}</div>
      {error ? <FieldError message={error} /> : null}
    </label>
  );
}

function FieldError({ message }: { message?: string }) {
  return <p className="mt-2 text-xs font-bold text-red-500">{message}</p>;
}

function MapPlaceholder() {
  return (
    <div className="relative grid min-h-[360px] place-items-center overflow-hidden bg-soft shadow-sm ring-1 ring-zinc-100">
      <div className="absolute inset-0 opacity-40" style={{ backgroundImage: "linear-gradient(#e5e7eb 1px, transparent 1px), linear-gradient(90deg, #e5e7eb 1px, transparent 1px)", backgroundSize: "34px 34px" }} />
      <div className="relative bg-white p-6 text-center shadow-soft">
        <p className="text-sm font-black uppercase text-primary">Map Placeholder</p>
        <h3 className="mt-2 text-2xl font-black">Dhaka, Bangladesh</h3>
        <p className="mt-2 text-sm text-zinc-500">Google Map integration will be connected later.</p>
      </div>
    </div>
  );
}
