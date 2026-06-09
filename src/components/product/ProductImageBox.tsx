import Image from "next/image";
import { cn } from "@/utils/cn";

const fallbackImage = "https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=700&q=80";

export function ProductImageBox({
  src,
  alt,
  sizes = "260px",
  className,
  imageClassName,
  priority = false
}: {
  src?: string;
  alt: string;
  sizes?: string;
  className?: string;
  imageClassName?: string;
  priority?: boolean;
}) {
  return (
    <span className={cn("relative block aspect-square overflow-hidden rounded-md bg-[#f8fafc]", className)}>
      <Image
        src={src || fallbackImage}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        className={cn("object-contain p-5 transition-transform duration-500", imageClassName)}
      />
    </span>
  );
}
