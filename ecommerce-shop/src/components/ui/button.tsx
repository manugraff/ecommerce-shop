import * as React from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
  size?: 'default' | 'sm' | 'lg' | 'icon'
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    const variantStyles = {
      default: 'bg-primary text-primary-foreground hover:bg-primary/90 [&>svg]:text-primary-foreground',
      destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90 [&>svg]:text-destructive-foreground',
      outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground [&>svg]:text-current',
      secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80 [&>svg]:text-secondary-foreground',
      ghost: 'hover:bg-accent hover:text-accent-foreground [&>svg]:text-current',
      link: 'text-primary underline-offset-4 hover:underline [&>svg]:text-current',
    }

    const sizeStyles = {
      default: 'h-10 px-4 py-2',
      sm: 'h-9 px-3 text-sm',
      lg: 'h-11 px-8 text-lg',
      icon: 'h-10 w-10',
    }

    return (
      <button
        className={cn(
          'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
          'disabled:opacity-50 disabled:pointer-events-none',
          '[&>svg]:shrink-0 [&>svg]:transition-colors',
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }