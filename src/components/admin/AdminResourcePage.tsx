"use client";

import Image from "next/image";
import Link from "next/link";
import { Copy, Download, Edit3, Plus, Search, Trash2, Upload } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/common/Button";

type ResourceRow = Record<string, string | number | undefined>;

export function AdminResourcePage({
  title,
  description,
  rows,
  columns,
  primaryAction,
  imageKey
}: {
  title: string;
  description: string;
  rows: ResourceRow[];
  columns: string[];
  primaryAction?: { label: string; href?: string };
  imageKey?: string;
}) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<string[]>([]);

  const filtered = useMemo(() => {
    const value = query.toLowerCase();
    if (!value) return rows;
    return rows.filter((row) => Object.values(row).join(" ").toLowerCase().includes(value));
  }, [query, rows]);

  return (
    <div className="grid gap-5">
      <section className="rounded-2xl border border-zinc-100 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-black">{title}</h2>
            <p className="mt-1 text-sm text-zinc-500">{description}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="light" className="ring-1 ring-zinc-200"><Upload className="h-4 w-4" /> Import</Button>
            <Button variant="light" className="ring-1 ring-zinc-200"><Download className="h-4 w-4" /> Export</Button>
            {primaryAction?.href ? (
              <Link href={primaryAction.href} className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-primary px-5 text-sm font-bold text-white transition-all hover:-translate-y-0.5 hover:bg-accent hover:shadow-lg">
                <Plus className="h-4 w-4" /> {primaryAction.label}
              </Link>
            ) : (
              <Button><Plus className="h-4 w-4" /> {primaryAction?.label ?? "Add New"}</Button>
            )}
          </div>
        </div>
        <div className="mt-5 grid gap-3 md:grid-cols-[1fr_auto_auto]">
          <label className="flex h-11 items-center rounded-lg border border-zinc-200 px-3 transition-colors focus-within:border-primary">
            <Search className="mr-2 h-4 w-4 text-zinc-400" />
            <input value={query} onChange={(event) => setQuery(event.target.value)} className="min-w-0 flex-1 text-sm outline-none" placeholder={`Search ${title.toLowerCase()}...`} />
          </label>
          <select className="h-11 rounded-lg border border-zinc-200 px-3 text-sm font-bold outline-none focus:border-primary">
            <option>All Status</option>
            <option>Published</option>
            <option>Draft</option>
            <option>Active</option>
          </select>
          <select className="h-11 rounded-lg border border-zinc-200 px-3 text-sm font-bold outline-none focus:border-primary">
            <option>Newest</option>
            <option>Price Low</option>
            <option>Price High</option>
            <option>Stock</option>
          </select>
        </div>
        {selected.length ? (
          <div className="mt-4 flex flex-wrap items-center gap-3 rounded-xl bg-soft p-3 text-sm font-bold">
            <span>{selected.length} selected</span>
            <button className="text-primary">Bulk publish</button>
            <button className="text-primary">Bulk delete</button>
          </div>
        ) : null}
      </section>

      <section className="overflow-hidden rounded-2xl border border-zinc-100 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] border-collapse text-left text-sm">
            <thead className="bg-soft text-xs font-black uppercase text-zinc-500">
              <tr>
                <th className="px-5 py-4"><input type="checkbox" className="accent-primary" /></th>
                {columns.map((column) => <th key={column} className="px-5 py-4">{column}</th>)}
                <th className="px-5 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((row, index) => {
                const key = String(row.id ?? row.name ?? row.title ?? index);
                return (
                  <tr key={key} className="border-t border-zinc-100 transition-colors hover:bg-soft/50">
                    <td className="px-5 py-4">
                      <input
                        type="checkbox"
                        checked={selected.includes(key)}
                        onChange={(event) => setSelected((current) => event.target.checked ? [...current, key] : current.filter((item) => item !== key))}
                        className="accent-primary"
                      />
                    </td>
                    {columns.map((column, columnIndex) => {
                      const value = row[toKey(column)];
                      return (
                        <td key={column} className="px-5 py-4">
                          {columnIndex === 0 && imageKey && row[imageKey] ? (
                            <span className="flex items-center gap-3">
                              <span className="relative h-12 w-12 overflow-hidden rounded-lg bg-soft">
                                <Image src={String(row[imageKey])} alt={String(value)} fill sizes="48px" className="object-contain p-1.5" />
                              </span>
                              <span className="line-clamp-1 font-black">{String(value ?? "-")}</span>
                            </span>
                          ) : (
                            <span className={column.toLowerCase().includes("status") ? "rounded-full bg-soft px-2 py-1 text-xs font-black text-primary" : "font-semibold text-zinc-700"}>
                              {String(value ?? "-")}
                            </span>
                          )}
                        </td>
                      );
                    })}
                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        <button className="grid h-9 w-9 place-items-center rounded-lg border border-zinc-200 transition-colors hover:border-primary hover:text-primary" aria-label="Duplicate"><Copy className="h-4 w-4" /></button>
                        <button className="grid h-9 w-9 place-items-center rounded-lg border border-zinc-200 transition-colors hover:border-primary hover:text-primary" aria-label="Edit"><Edit3 className="h-4 w-4" /></button>
                        <button className="grid h-9 w-9 place-items-center rounded-lg border border-zinc-200 transition-colors hover:border-primary hover:text-primary" aria-label="Delete"><Trash2 className="h-4 w-4" /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function toKey(column: string) {
  return column.charAt(0).toLowerCase() + column.slice(1).replace(/\s+(.)/g, (_, char: string) => char.toUpperCase());
}
