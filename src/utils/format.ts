export function formatPrice(value: number) {
  return `৳ ${new Intl.NumberFormat("en-BD").format(value)}`;
}

export function slugify(value: string) {
  return value.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}
