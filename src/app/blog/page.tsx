import Image from "next/image";
import { blogs } from "@/data/blogs";

export default function BlogPage() {
  return (
    <main className="bg-soft py-8">
      <div className="container-page">
        <h1 className="text-3xl font-black">AmarBazar Blog</h1>
        <div className="mt-6 grid gap-5 md:grid-cols-3">
          {blogs.map((blog) => (
            <article key={blog.id} className="bg-white">
              <div className="relative aspect-[4/3]"><Image src={blog.image} alt={blog.title} fill sizes="380px" className="object-cover" /></div>
              <div className="p-5">
                <p className="text-xs font-bold uppercase text-primary">{blog.date}</p>
                <h2 className="mt-2 text-xl font-black">{blog.title}</h2>
                <p className="mt-2 text-sm leading-6 text-zinc-500">{blog.excerpt}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
