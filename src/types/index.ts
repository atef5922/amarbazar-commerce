export type ProductCategory =
  | "Smartphones"
  | "Laptops"
  | "Headphones"
  | "Smart Watches"
  | "Speakers"
  | "Accessories"
  | "Cameras"
  | "Home Appliances"
  | "Smart TVs"
  | "Gaming";

export type Product = {
  id: string;
  slug?: string;
  name: string;
  category: ProductCategory;
  brand: string;
  image: string;
  hoverImage?: string;
  images?: string[];
  thumbnail?: string;
  price: number;
  oldPrice?: number;
  discount?: string | number;
  rating: number;
  reviewCount?: number;
  reviews: number;
  badge?: "New" | "Sale" | "Hot";
  isNew?: boolean;
  isSale?: boolean;
  isHot?: boolean;
  isFeatured?: boolean;
  isBestSeller?: boolean;
  isSpecial?: boolean;
  shortDescription?: string;
  description: string;
  specifications?: Record<string, string>;
  tags?: string[];
  warranty?: string;
  deliveryInfo?: string;
  stock: number;
};

export type Category = {
  id: string;
  name: ProductCategory | string;
  image: string;
  count: number;
};

export type Banner = {
  id: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  image: string;
  tone: "orange" | "purple" | "light";
};

export type Blog = {
  id: string;
  title: string;
  excerpt: string;
  image: string;
  date: string;
};
