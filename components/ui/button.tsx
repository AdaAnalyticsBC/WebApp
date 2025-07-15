"use client"

import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { useState, useEffect } from "react"
import { motion } from "motion/react"

import { cn } from "@/lib/utils"
import { useCursorHover } from "@/components/custom-cursor"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-1 whitespace-nowrap transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default:
          "bg-primary button-1 shadow-xs hover:bg-primary/90 transition-colors duration-300 rounded-full pl-3 pr-2 py-1.5 md:py-2 gap-1.5 md:gap-6",
        destructive:
          "bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60 transition-colors duration-300 rounded-full",
        outline:
          "border-1 border-neutral-500 flex items-center justify-center bg-transparent transition-colors duration-300 rounded-full pl-3 pr-2 py-1.5 md:py-2 gap-1.5 md:gap-6",
        secondary:
          "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80 transition-colors duration-300 rounded-full",
        ghost:
          "hover:bg-accent dark:hover:bg-accent/50 transition-colors duration-300 rounded-full",
        link: "transition-colors duration-300",
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
  const [isPressed, setIsPressed] = useState(false)
  const { onMouseEnter, onMouseLeave } = useCursorHover()

  useEffect(() => {
    setMounted(true)
  }, [])

      const handleMouseEnter = () => {
      setHovered(true)
      // Only default and destructive variants have dark backgrounds and need white dots
      const isDarkVariant = variant === 'default' || variant === 'destructive'
      onMouseEnter('hover', '', undefined, isDarkVariant)
    }

    const handleMouseLeave = () => {
      setHovered(false)
      setIsPressed(false) // Reset pressed state when leaving button
      onMouseLeave()
    }

    const handleMouseDown = () => {
      setIsPressed(true)
    }

    const handleMouseUp = () => {
      setIsPressed(false)
    }

      if (variant === "link") {
      return (
        <motion.div
          animate={{ scale: isPressed ? 0.95 : 1 }}
          transition={{ duration: 0.1, ease: "easeOut" }}
        >
          <Comp
            data-slot="button"
            className={cn(buttonVariants({ variant, className }))}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            {...props}
          >
            {props.children}
          </Comp>
        </motion.div>
      )
    }
    return (
      <motion.div
        animate={{ scale: isPressed ? 0.95 : 1 }}
        transition={{ duration: 0.1, ease: "easeOut" }}
      >
        <Comp
          data-slot="button"
          className={cn(buttonVariants({ variant, className }))}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          {...props}
        >
          {props.children}
        </Comp>
      </motion.div>
    )
}

export { Button, buttonVariants }
