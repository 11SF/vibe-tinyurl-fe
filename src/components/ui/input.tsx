import * as React from "react"
import { cn } from "@/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-black/20 px-3 py-2 text-sm ring-offset-background backdrop-blur-sm transition-all",
          "file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-cyan focus-visible:ring-offset-2 focus-visible:border-neon-cyan/50",
          "hover:border-neon-cyan/30 hover:bg-black/30",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "cyber-border",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }