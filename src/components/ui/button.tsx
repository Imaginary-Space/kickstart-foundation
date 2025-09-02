import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-r from-purple-600 via-purple-500 to-blue-600 text-white hover:from-purple-500 hover:via-purple-400 hover:to-blue-500 shadow-lg hover:shadow-xl transition-all duration-300 rounded-full",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        hero: "bg-gradient-primary text-primary-foreground hover:shadow-glow transition-all duration-300 transform hover:scale-105",
        camera: "bg-gradient-to-r from-slate-900 to-slate-700 text-white border border-slate-600 hover:from-slate-800 hover:to-slate-600 shadow-lg hover:shadow-xl transition-all duration-300",
        lens: "bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 text-white hover:from-blue-500 hover:via-purple-500 hover:to-blue-700 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-105",
        aperture: "bg-white text-slate-900 border-2 border-slate-300 hover:border-primary hover:text-primary shadow-md hover:shadow-lg transition-all duration-300 relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent before:-translate-x-full hover:before:translate-x-full before:transition-transform before:duration-700",
        shutter: "bg-gradient-to-r from-amber-500 to-orange-600 text-white hover:from-amber-400 hover:to-orange-500 shadow-lg hover:shadow-xl transition-all duration-300 border border-amber-400/30",
        darkroom: "bg-red-900 text-red-100 border border-red-700 hover:bg-red-800 hover:text-white shadow-lg hover:shadow-red-900/25 transition-all duration-300",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
