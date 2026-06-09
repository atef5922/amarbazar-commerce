"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { ImagePlus, Save, Sparkles } from "lucide-react";
import { Button } from "@/components/common/Button";
import { brands } from "@/data/brands";
import { categories } from "@/data/categories";
import { products } from "@/data/products";
import { slugify } from "@/utils/format";

export function AdminProductForm({ productId }: { productId?: string }) {
  const product = products.find((item) => item.id === productId) ?? products[0];
  const [name, setName] = useState(productId ? product.name : "");
  const slug = useMemo(() => slugify(name || "new-electronics-product"), [name]);

  return (
    <form className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
      <section className="grid gap-5">
        <Panel title="Product Information">
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Product Name"><input value={name} onChange={(event) => setName(event.target.value)} className="admin-field" placeholder="Samsung Galaxy S24 Ultra" /></Field>
            <Field label="Slug"><input value={slug} readOnly className="admin-field bg-soft" /></Field>
            <Field label="SKU"><input className="admin-field" placeholder="AB-SKU-1001" /></Field>
            <Field label="Brand"><select className="admin-field">{brands.map((brand) => <option key={brand}>{brand}</option>)}</select></Field>
            <Field label="Category"><select className="admin-field">{categories.map((category) => <option key={category.id}>{String(category.name)}</option>)}</select></Field>
            <Field label="Status"><select className="admin-field"><option>Published</option><option>Draft</option></select></Field>
          </div>
        </Panel>

        <Panel title="Pricing & Stock">
          <div className="grid gap-4 md:grid-cols-4">
            <Field label="Price"><input className="admin-field" placeholder="145000" /></Field>
            <Field label="Old Price"><input className="admin-field" placeholder="159000" /></Field>
            <Field label="Discount"><input className="admin-field" placeholder="9% OFF" /></Field>
            <Field label="Stock Quantity"><input className="admin-field" placeholder="12" /></Field>
          </div>
        </Panel>

        <Panel title="Descriptions">
          <div className="grid gap-4">
            <Field label="Short Description"><input className="admin-field" placeholder="Premium flagship smartphone..." /></Field>
            <Field label="Full Description"><textarea className="admin-field min-h-36 resize-none" placeholder="Detailed electronics product description..." /></Field>
          </div>
        </Panel>

        <Panel title="Specifications">
          <div className="grid gap-4 md:grid-cols-2">
            {["Warranty", "Connectivity", "Battery", "Display", "Storage", "Color", "Origin", "Delivery Info"].map((field) => (
              <Field key={field} label={field}><input className="admin-field" placeholder={field} /></Field>
            ))}
          </div>
        </Panel>

        <Panel title="SEO">
          <div className="grid gap-4">
            <Field label="SEO Title"><input className="admin-field" /></Field>
            <Field label="SEO Description"><textarea className="admin-field min-h-24 resize-none" /></Field>
            <Field label="SEO Keywords"><input className="admin-field" placeholder="smartphone, samsung, bangladesh" /></Field>
          </div>
        </Panel>
      </section>

      <aside className="grid h-fit gap-5">
        <Panel title="Product Images">
          <div className="relative aspect-square overflow-hidden rounded-xl bg-soft">
            <Image src={product.image} alt={product.name} fill sizes="320px" className="object-contain p-6" />
          </div>
          <button type="button" className="mt-4 grid min-h-28 place-items-center rounded-xl border border-dashed border-primary/40 bg-soft text-center text-sm font-bold text-primary">
            <span><ImagePlus className="mx-auto mb-2 h-6 w-6" /> Drag and drop images<br />Supabase Storage ready</span>
          </button>
        </Panel>

        <Panel title="Badges">
          <div className="grid gap-3 text-sm font-bold">
            {["New", "Sale", "Hot", "Featured", "Best Seller", "Special Product", "New Arrival"].map((badge) => (
              <label key={badge} className="flex items-center gap-2"><input type="checkbox" className="accent-primary" /> {badge}</label>
            ))}
          </div>
        </Panel>

        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <Button className="w-full"><Save className="h-4 w-4" /> Save Product</Button>
          <Button type="button" variant="light" className="mt-3 w-full ring-1 ring-zinc-200"><Sparkles className="h-4 w-4" /> Preview Frontend</Button>
        </div>
      </aside>
    </form>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-zinc-100 bg-white p-5 shadow-sm">
      <h2 className="mb-4 text-lg font-black">{title}</h2>
      {children}
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block text-sm font-black">
      {label}
      <span className="mt-2 block">{children}</span>
    </label>
  );
}
