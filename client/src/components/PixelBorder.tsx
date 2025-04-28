import React from "react";
import { cn } from "@/lib/utils";

interface PixelBorderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  withCorners?: boolean;
}

export default function PixelBorder({ 
  children, 
  className,
  withCorners = false,
  ...props 
}: PixelBorderProps) {
  return (
    <div 
      className={cn(
        "pixel-border", 
        withCorners && "pixel-corner", 
        className
      )} 
      {...props}
    >
      {children}
    </div>
  );
}
