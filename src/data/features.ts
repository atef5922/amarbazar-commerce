import {
  BadgeCheck,
  CreditCard,
  Headphones,
  PackageCheck,
  RefreshCw,
  Search,
  ShieldCheck,
  Smartphone,
  Truck,
  WalletCards
} from "lucide-react";

export const featureHighlights = [
  {
    title: "Fast Delivery",
    description: "Reliable delivery flow for Dhaka and expanding coverage across Bangladesh.",
    icon: Truck
  },
  {
    title: "Secure Payment",
    description: "Frontend prepared for safe checkout options like cards, bKash, Nagad, and COD.",
    icon: ShieldCheck
  },
  {
    title: "Easy Return",
    description: "Simple return request journey designed for customer confidence.",
    icon: RefreshCw
  },
  {
    title: "Genuine Products",
    description: "Single-vendor quality control keeps catalog standards consistent.",
    icon: BadgeCheck
  },
  {
    title: "Best Price",
    description: "Clear pricing, offer labels, and Bangladesh-friendly product ranges.",
    icon: WalletCards
  },
  {
    title: "24/7 Customer Support",
    description: "Support-ready contact channels for order, product, and return questions.",
    icon: Headphones
  },
  {
    title: "Mobile Friendly Shopping",
    description: "Responsive product discovery, cart, wishlist, and comparison flows.",
    icon: Smartphone
  },
  {
    title: "Trusted Single-Vendor Store",
    description: "One store owner manages products, pricing, service, and customer experience.",
    icon: PackageCheck
  }
];

export const howItWorks = [
  { title: "Browse Products", description: "Search, filter, compare, and inspect product details.", icon: Search },
  { title: "Add to Cart", description: "Save favorite items and adjust cart quantity anytime.", icon: PackageCheck },
  { title: "Confirm Order", description: "A future-ready checkout UI prepared for backend integration.", icon: CreditCard },
  { title: "Fast Delivery", description: "Trackable delivery experience planned for Bangladesh shoppers.", icon: Truck }
];

export const comparisonRows = [
  ["Single-vendor quality control", "Curated by one store owner", "Mixed standards"],
  ["Fast browsing experience", "Lightweight frontend and clean product cards", "Often cluttered"],
  ["Mobile-first design", "Designed for small screens first", "Desktop-first layouts"],
  ["Easy product search", "Search, filters, sort, and view toggle", "Basic search only"],
  ["Simple cart system", "Local cart, wishlist, compare, quick view", "Fragmented flows"],
  ["Clear product pricing", "BDT price, old price, discount, stock", "Inconsistent pricing"],
  ["Customer support", "Phone, email, form, and help FAQs", "Hard to reach"]
];
