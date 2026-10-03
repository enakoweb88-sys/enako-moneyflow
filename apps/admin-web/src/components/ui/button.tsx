import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs))
}

const buttonVariants = cva(
  'inline-flex items-center justify-center font-bold tracking-wider uppercase transition-all duration-150 ease-in-out cursor-pointer select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#001f5b] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 disabled:scale-100 active:scale-[0.98]',
  {
    variants: {
      variant: {
        default:
          'bg-[#001f5b] text-white hover:bg-[#001744] active:bg-[#001030] shadow-sm border border-transparent',
        secondary:
          'bg-slate-800 text-slate-100 hover:bg-slate-900 active:bg-slate-950 shadow-sm border border-transparent',
        outline:
          'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 hover:border-slate-300 active:bg-slate-100',
        danger:
          'bg-rose-600 text-white hover:bg-rose-700 active:bg-rose-800 shadow-sm border border-transparent',
        ghost:
          'bg-transparent text-slate-700 hover:bg-slate-100 hover:text-slate-900 active:bg-slate-200 border border-transparent',
      },
      size: {
        default: 'h-10 px-4 py-2 text-xs rounded-lg',
        sm: 'h-8 px-3 text-xs rounded-lg',
        lg: 'h-11 px-5 text-sm rounded-lg',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    )
  }
)

Button.displayName = 'Button'

// eslint-disable-next-line react-refresh/only-export-components
export { Button, buttonVariants }
