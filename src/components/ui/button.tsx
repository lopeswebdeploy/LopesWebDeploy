import * as React from "react"
import { cn } from "@/lib/utils"

const Button = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: "default" | "outline" | "luxury" | "luxury-outline"
    size?: "sm" | "default" | "lg" | "xl"
  }
>(({ className, variant = "default", size = "default", ...props }, ref) => {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background",
        {
          "bg-primary text-primary-foreground hover:bg-primary/90": variant === "default",
          "border border-input hover:bg-accent hover:text-accent-foreground": variant === "outline",
          "bg-brand-coral text-white hover:bg-brand-coral/90": variant === "luxury",
          "border border-brand-coral text-brand-coral hover:bg-brand-coral hover:text-white": variant === "luxury-outline",
        },
        {
          "h-9 px-3": size === "sm",
          "h-10 py-2 px-4": size === "default",
          "h-11 px-8": size === "lg",
          "h-12 px-10 text-base": size === "xl",
        },
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
Button.displayName = "Button"

export { Button }
