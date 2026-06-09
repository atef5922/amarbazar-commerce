import { brands } from "@/data/brands";
import { categories } from "@/data/categories";
import { products } from "@/data/products";

export const adminRoles = ["SUPER_ADMIN", "ADMIN", "MANAGER", "STAFF"] as const;

export const adminMetrics = [
  { label: "Total Revenue", value: "৳ 18,42,500", change: "+18.4%" },
  { label: "Total Orders", value: "1,248", change: "+12.1%" },
  { label: "Total Products", value: String(products.length), change: "+6 new" },
  { label: "Total Customers", value: "8,420", change: "+9.8%" },
  { label: "Pending Orders", value: "42", change: "Needs review" },
  { label: "Low Stock Products", value: String(products.filter((product) => product.stock <= 12).length), change: "Restock soon" },
  { label: "New Customers", value: "318", change: "This month" },
  { label: "Coupon Usage", value: "684", change: "+21.7%" }
];

export const salesOverview = [
  { month: "Jan", revenue: 42, orders: 32 },
  { month: "Feb", revenue: 55, orders: 40 },
  { month: "Mar", revenue: 48, orders: 36 },
  { month: "Apr", revenue: 72, orders: 54 },
  { month: "May", revenue: 86, orders: 62 },
  { month: "Jun", revenue: 94, orders: 70 }
];

export const orderStatus = [
  { label: "Pending", value: 42 },
  { label: "Processing", value: 67 },
  { label: "Shipped", value: 93 },
  { label: "Delivered", value: 682 },
  { label: "Cancelled", value: 21 }
];

export const adminOrders = [
  { id: "AB-10245", customer: "Tanvir Rahman", total: "৳ 145,000", status: "Processing", payment: "COD", items: "Samsung Galaxy S24 Ultra" },
  { id: "AB-10244", customer: "Nusrat Jahan", total: "৳ 32,990", status: "Confirmed", payment: "bKash Paid", items: "Sony WH-1000XM5" },
  { id: "AB-10243", customer: "Mehedi Hasan", total: "৳ 75,000", status: "Shipped", payment: "Card Paid", items: "Asus Vivobook 15" },
  { id: "AB-10242", customer: "Farhana Akter", total: "৳ 9,990", status: "Delivered", payment: "Nagad Paid", items: "JBL Flip Speaker" }
];

export const adminCustomers = [
  { name: "Tanvir Rahman", phone: "+8801711000001", email: "tanvir@example.com", orders: 8, spent: "৳ 324,500", status: "Active" },
  { name: "Nusrat Jahan", phone: "+8801811000002", email: "nusrat@example.com", orders: 5, spent: "৳ 118,900", status: "Active" },
  { name: "Mehedi Hasan", phone: "+8801911000003", email: "mehedi@example.com", orders: 3, spent: "৳ 92,400", status: "Active" }
];

export const adminBanners = [
  { title: "Smartphone Mega Sale", type: "Hero Banner", position: "Homepage Hero", status: "Published", link: "/shop?offer=gadget-sale" },
  { title: "Laptop Deals", type: "Promo Banner", position: "Homepage Promo", status: "Published", link: "/shop?category=Laptops" },
  { title: "Accessories Festival", type: "Shop Banner", position: "Shop Top", status: "Draft", link: "/shop?offer=accessories-sale" }
];

export const adminCoupons = [
  { code: "GADGET10", type: "Percentage", value: "10%", minOrder: "৳ 5,000", status: "Active", expiry: "2026-12-31" },
  { code: "PHONE500", type: "Fixed", value: "৳ 500", minOrder: "৳ 20,000", status: "Active", expiry: "2026-09-30" },
  { code: "LAPTOP15", type: "Percentage", value: "15%", minOrder: "৳ 70,000", status: "Scheduled", expiry: "2026-10-15" }
];

export const adminReviews = [
  { product: "Samsung Galaxy S24 Ultra", customer: "Tanvir Rahman", rating: 5, status: "Approved", text: "Original product and fast delivery." },
  { product: "Sony WH-1000XM5 Headphone", customer: "Nusrat Jahan", rating: 5, status: "Pending", text: "Packaging was premium." },
  { product: "JBL Flip Speaker", customer: "Mehedi Hasan", rating: 4, status: "Approved", text: "Sound quality is excellent." }
];

export const adminBlogs = [
  { title: "Best Smartphones in Bangladesh 2026", category: "Buying Guide", status: "Published", date: "2026-06-01" },
  { title: "How to Choose Noise Cancelling Headphones", category: "Audio", status: "Draft", date: "2026-06-05" },
  { title: "Laptop Buying Guide for Students", category: "Laptops", status: "Published", date: "2026-05-28" }
];

export const adminNewsletter = [
  { email: "tanvir@example.com", name: "Tanvir Rahman", date: "2026-06-08", status: "Subscribed" },
  { email: "nusrat@example.com", name: "Nusrat Jahan", date: "2026-06-07", status: "Subscribed" },
  { email: "mehedi@example.com", name: "Mehedi Hasan", date: "2026-06-06", status: "Subscribed" }
];

export const adminMedia = products.slice(0, 8).map((product) => ({
  name: product.name,
  url: product.image,
  type: "Product Image",
  size: "Optimized remote image"
}));

export const adminProducts = products.map((product) => ({
  id: product.id,
  name: product.name,
  brand: product.brand,
  category: product.category,
  price: `৳ ${product.price.toLocaleString("en-BD")}`,
  stock: product.stock,
  status: "Published",
  badge: product.badge ?? "Standard",
  image: product.image
}));

export const adminCategories = categories.map((category, index) => ({
  name: String(category.name),
  slug: category.id,
  count: category.count,
  status: "Active",
  sortOrder: index + 1,
  homepage: index < 6 ? "Shown" : "Hidden"
}));

export const adminBrands = brands.map((brand, index) => ({
  name: brand,
  slug: brand.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
  status: "Active",
  topBrand: index < 12 ? "Shown" : "Hidden",
  sortOrder: index + 1
}));

export const adminHomepageSections = [
  "Hero Slider",
  "Promo Banners",
  "Top Brands",
  "Today's Hot Deal",
  "Category Product Tabs",
  "Service Strip",
  "Promo Product Cards",
  "New Products",
  "Featured Products",
  "Best Sellers",
  "On Sale",
  "Offer Boxes",
  "Large CTA Banner",
  "Circular Categories",
  "Special Products",
  "Testimonials",
  "Instagram Feed",
  "Newsletter"
].map((title, index) => ({
  title,
  status: "Enabled",
  sortOrder: index + 1,
  source: index < 5 ? "Dynamic products/data" : "Configurable content"
}));
