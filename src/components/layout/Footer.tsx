import Link from "next/link";
import { Facebook, Instagram, Mail, MapPin, Phone, Send, Youtube } from "lucide-react";
import { Button } from "@/components/common/Button";

export function Footer() {
  return (
    <footer className="w-full bg-white">
      <div className="container-page grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-[1.2fr_0.85fr_1fr_1.1fr] lg:py-16">
        <div>
          <Link href="/" className="inline-block text-3xl font-black text-primary transition-transform duration-300 hover:scale-[1.02]">
            Amar<span className="text-ink">Bazar</span>
          </Link>
          <p className="mt-4 max-w-sm text-sm leading-7 text-zinc-500">
            AmarBazar is a premium single-vendor electronics store in Bangladesh, offering original smartphones, gadgets, accessories, and electronics with fast delivery and reliable support.
          </p>
          <div className="mt-6 flex gap-3 text-zinc-500">
            {[Facebook, Instagram, Youtube].map((Icon, index) => (
              <Link
                key={index}
                href="/"
                className="grid h-9 w-9 place-items-center rounded-full border border-zinc-200 transition-all duration-300 hover:-translate-y-1 hover:border-primary hover:bg-primary hover:text-white"
                aria-label="Social link"
              >
                <Icon className="h-4 w-4" />
              </Link>
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-sm font-black uppercase">My Account</h3>
          <div className="mt-5 grid gap-3 text-sm text-zinc-500">
            {["About Us", "Contact Us", "Terms & Conditions", "Returns & Exchanges", "Shipping & Delivery"].map((item) => (
              <Link key={item} href="/contact" className="hover-underline w-fit transition-colors duration-300 hover:text-primary">
                {item}
              </Link>
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-sm font-black uppercase">Contact Us</h3>
          <div className="mt-5 grid gap-4 text-sm text-zinc-500">
            <p className="flex gap-3"><MapPin className="h-4 w-4 shrink-0 text-primary" /> AmarBazar Electronics Store, Dhaka 1212</p>
            <p className="flex gap-3"><Phone className="h-4 w-4 shrink-0 text-primary" /> Call Us: 123-456-789</p>
            <p className="flex gap-3"><Mail className="h-4 w-4 shrink-0 text-primary" /> support@amarbazar.com</p>
          </div>
        </div>
        <div>
          <h3 className="text-sm font-black uppercase">Newsletter</h3>
          <form className="mt-5 grid gap-3">
            <input className="h-11 border border-zinc-200 px-3 text-sm outline-none transition-colors duration-300 focus:border-primary" placeholder="Enter Full Name" />
            <input className="h-11 border border-zinc-200 px-3 text-sm outline-none transition-colors duration-300 focus:border-primary" placeholder="Enter Email Address" />
            <Button className="w-fit"><Send className="h-4 w-4" /> Submit Now</Button>
          </form>
        </div>
      </div>
    </footer>
  );
}
