// Modified for Supervisor compatibility. License: Apache 2.0.
import { cn } from "cn";
import NextImage from "next/image";
import type { Experimental_GeneratedImage } from "ai";

export type ImageProps = Experimental_GeneratedImage & {
  className?: string;
  alt?: string;
};

export const Image = ({
  base64,
  mediaType,
  alt = "",
  className,
}: ImageProps) => (
  <NextImage
    alt={alt}
    width={1024}
    height={1024}
    unoptimized
    className={cn(
      "h-auto max-w-full overflow-hidden rounded-md",
      className
    )}
    src={`data:${mediaType};base64,${base64}`}
  />
);
