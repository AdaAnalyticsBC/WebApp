"use client"

import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { useState, useEffect } from "react"
import { motion } from "motion/react"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-1 whitespace-nowrap text-[10px] font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default:
          "bg-primary button-1 shadow-xs hover:bg-primary/90 transition-colors duration-300 rounded-full px-3 pr-2 py-1.5 md:py-2 gap-1.5 md:gap-6",
        destructive:
          "bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60 transition-colors duration-300 rounded-full",
        outline:
          "border button-2 bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 transition-colors duration-300 rounded-full",
        secondary:
          "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80 transition-colors duration-300 rounded-full",
        ghost:
          "hover:bg-accent dark:hover:bg-accent/50 transition-colors duration-300 rounded-full",
        link: "button-2 underline-offset-4 transition-colors duration-300 bg-transparent rounded-none",
        none: "p-0",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Button({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  // Only animate underline after mount (client-side)
  const [mounted, setMounted] = useState(false)
  const [hovered, setHovered] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (variant === "link") {
    return (
      <Comp
        data-slot="button"
        className={cn(buttonVariants({ variant, className }), "relative overflow-hidden group")}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        {...props}
      >
        <span className="relative z-10 flex items-center gap-2 flex-row">{props.children}</span>
        {mounted && (
          <motion.span
            className="absolute left-0 bottom-[-2px] h-[1px] w-full bg-current origin-left"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: hovered ? 1 : 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            style={{ transformOrigin: "left" }}
            aria-hidden="true"
          />
        )}
      </Comp>
    )
  }
  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, className }))}
      {...props}
    >
      {props.children}
    </Comp>
  )
}

export { Button, buttonVariants }
