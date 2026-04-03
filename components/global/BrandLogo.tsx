import Image from "next/image";

import { tekorixBrand } from "@/lib/constants/branding";
import { cn } from "@/lib/utils";

type BrandLogoProps = {
  className?: string;
  priority?: boolean;
  sizes?: string;
};

export function BrandLogo({ className, priority = false, sizes }: BrandLogoProps) {
  return (
    <Image
      src={tekorixBrand.logo.src}
      alt={tekorixBrand.logo.alt}
      width={tekorixBrand.logo.width}
      height={tekorixBrand.logo.height}
      priority={priority}
      sizes={sizes}
      className={cn("w-auto select-none", className)}
    />
  );
}
