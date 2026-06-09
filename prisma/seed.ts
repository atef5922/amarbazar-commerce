import { PrismaClient, ProductBadge, PublishStatus } from "@prisma/client";

const prisma = new PrismaClient();

const categories = [
  "Smartphones",
  "Laptops",
  "Headphones",
  "Smart Watches",
  "Speakers",
  "Cameras",
  "Accessories",
  "Routers",
  "Chargers",
  "Smart TVs",
  "Gaming"
];

const brands = ["Samsung", "Apple", "Xiaomi", "Realme", "Sony", "JBL", "Asus", "HP", "Canon", "TP-Link", "Anker", "Baseus", "Amazfit", "Logitech"];

const products = [
  ["Samsung Galaxy S24 Ultra", "samsung-galaxy-s24-ultra", "AMB-SAM-S24U", "Samsung", "Smartphones", 145000, 159000, 12, ProductBadge.HOT, "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?auto=format&fit=crop&w=900&q=80"],
  ["iPhone 15 Pro Max", "iphone-15-pro-max", "AMB-APP-IP15PM", "Apple", "Smartphones", 175000, 189000, 9, ProductBadge.NEW, "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=900&q=80"],
  ["Xiaomi Redmi Note 13 Pro", "xiaomi-redmi-note-13-pro", "AMB-XIA-RN13P", "Xiaomi", "Smartphones", 32990, 36990, 24, ProductBadge.SALE, "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=900&q=80"],
  ["Realme 12 Pro", "realme-12-pro", "AMB-REA-12P", "Realme", "Smartphones", 28990, 32990, 19, ProductBadge.NEW, "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?auto=format&fit=crop&w=900&q=80"],
  ["Sony WH-1000XM5 Headphone", "sony-wh-1000xm5", "AMB-SON-XM5", "Sony", "Headphones", 32990, 38990, 18, ProductBadge.HOT, "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&w=900&q=80"],
  ["Apple AirPods Pro", "apple-airpods-pro", "AMB-APP-AIRP", "Apple", "Headphones", 24990, 28990, 20, ProductBadge.NEW, "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?auto=format&fit=crop&w=900&q=80"],
  ["JBL Flip Speaker", "jbl-flip-speaker", "AMB-JBL-FLIP", "JBL", "Speakers", 9990, 11990, 31, ProductBadge.SALE, "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=900&q=80"],
  ["MacBook Air M2", "macbook-air-m2", "AMB-APP-MBA-M2", "Apple", "Laptops", 145000, 158000, 8, ProductBadge.HOT, "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=900&q=80"],
  ["Asus Vivobook 15", "asus-vivobook-15", "AMB-ASU-VIVO15", "Asus", "Laptops", 75000, 82990, 15, ProductBadge.SALE, "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=900&q=80"],
  ["HP Pavilion Laptop", "hp-pavilion-laptop", "AMB-HP-PAV", "HP", "Laptops", 89990, 97990, 13, ProductBadge.NEW, "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=900&q=80"],
  ["Canon EOS Camera", "canon-eos-camera", "AMB-CAN-EOS", "Canon", "Cameras", 85000, 94000, 10, ProductBadge.HOT, "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=900&q=80"],
  ["TP-Link Dual Band Router", "tp-link-router", "AMB-TPL-ROUTER", "TP-Link", "Routers", 3990, 4990, 36, ProductBadge.SALE, "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=900&q=80"],
  ["Anker Power Bank 20000mAh", "anker-power-bank", "AMB-ANK-PB20", "Anker", "Accessories", 4990, 5990, 45, ProductBadge.HOT, "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?auto=format&fit=crop&w=900&q=80"],
  ["Baseus Fast Charger 65W", "baseus-fast-charger", "AMB-BAS-65W", "Baseus", "Chargers", 2490, 3190, 52, ProductBadge.NEW, "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=900&q=80"]
] as const;

const homepageSections = [
  ["hero-slider", "HERO_SLIDER", "Hero Slider", 1],
  ["promo-banners", "PROMO_BANNERS", "Promo Banners", 2],
  ["top-brands", "TOP_BRANDS", "Top Brands", 3],
  ["hot-deals", "HOT_DEALS", "Today's Hot Deal", 4],
  ["new-arrivals", "NEW_ARRIVALS", "New Arrivals", 5],
  ["featured-products", "FEATURED_PRODUCTS", "Featured Products", 6],
  ["best-sellers", "BEST_SELLERS", "Best Sellers", 7],
  ["special-products", "SPECIAL_PRODUCTS", "Special Products", 8]
] as const;

async function main() {
  for (const [index, name] of categories.entries()) {
    await prisma.category.upsert({
      where: { slug: slugify(name) },
      update: { name, status: PublishStatus.PUBLISHED, sortOrder: index + 1 },
      create: { slug: slugify(name), name, status: PublishStatus.PUBLISHED, sortOrder: index + 1, showHome: index < 6 }
    });
  }

  for (const [index, name] of brands.entries()) {
    await prisma.brand.upsert({
      where: { slug: slugify(name) },
      update: { name, status: PublishStatus.PUBLISHED, sortOrder: index + 1, showTop: index < 12 },
      create: { slug: slugify(name), name, status: PublishStatus.PUBLISHED, sortOrder: index + 1, showTop: index < 12 }
    });
  }

  for (const item of products) {
    const [name, slug, sku, brandName, categoryName, price, oldPrice, stock, badge, image] = item;
    const brand = await prisma.brand.findUniqueOrThrow({ where: { slug: slugify(brandName) } });
    const category = await prisma.category.findUniqueOrThrow({ where: { slug: slugify(categoryName) } });
    const discountPercent = Math.max(0, Math.round(((oldPrice - price) / oldPrice) * 100));

    const product = await prisma.product.upsert({
      where: { slug },
      update: { name, sku, brandId: brand.id, categoryId: category.id, price, oldPrice, stock, discountPercent, badges: [badge], status: PublishStatus.PUBLISHED },
      create: {
        name,
        slug,
        sku,
        brandId: brand.id,
        categoryId: category.id,
        price,
        oldPrice,
        stock,
        discountPercent,
        badges: [badge],
        status: PublishStatus.PUBLISHED,
        warranty: "Official warranty",
        tags: [brandName, categoryName, "electronics", "bangladesh"],
        shortDescription: `${name} original electronics product for AmarBazar Bangladesh.`,
        description: `${name} is an original electronics product with reliable support, fast delivery, and BDT pricing for Bangladesh customers.`
      }
    });

    await prisma.productImage.upsert({
      where: { id: `${product.id}-main` },
      update: { url: image, alt: name, featured: true, sortOrder: 0 },
      create: { id: `${product.id}-main`, productId: product.id, url: image, alt: name, featured: true, sortOrder: 0 }
    });
  }

  await prisma.banner.upsert({
    where: { id: "seed-hero-gadget-mega-sale" },
    update: {},
    create: {
      id: "seed-hero-gadget-mega-sale",
      title: "Gadget Mega Sale",
      subtitle: "Up to 30% off electronics",
      description: "Smartphones, laptops, audio, and accessories for AmarBazar customers.",
      image: "https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=1400&q=80",
      buttonText: "Shop Deals",
      buttonLink: "/shop",
      type: "HERO",
      position: "home",
      status: PublishStatus.PUBLISHED,
      sortOrder: 1
    }
  });

  for (const [key, type, title, sortOrder] of homepageSections) {
    await prisma.homepageSection.upsert({
      where: { key },
      update: { type, title, enabled: true, status: PublishStatus.PUBLISHED, sortOrder },
      create: { key, type, title, enabled: true, status: PublishStatus.PUBLISHED, sortOrder }
    });
  }

  await prisma.coupon.upsert({
    where: { code: "GADGET10" },
    update: {},
    create: { code: "GADGET10", discountType: "PERCENTAGE", discountValue: 10, minOrderAmount: 2000, status: "ACTIVE" }
  });

  await prisma.setting.upsert({
    where: { key: "store.about" },
    update: { value: "AmarBazar is a premium single-vendor electronics store in Bangladesh.", group: "store" },
    create: { key: "store.about", value: "AmarBazar is a premium single-vendor electronics store in Bangladesh.", group: "store" }
  });
}

function slugify(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

main()
  .then(async () => {
    await prisma.$disconnect();
    console.log("AmarBazar database seeded.");
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
