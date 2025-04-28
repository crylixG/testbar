import React from "react";
import { cn } from "@/lib/utils";

interface PixelImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {}

export default function PixelImage({ 
  className,
  ...props 
}: PixelImageProps) {
  return (
    <img 
      className={cn("pixel-image", className)} 
      {...props}
    />
  );
}
