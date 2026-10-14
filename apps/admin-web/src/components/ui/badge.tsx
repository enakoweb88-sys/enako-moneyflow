import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs))
}

const badgeVariants = cva(
  'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider border select-none transition-colors duration-150',
  {
    variants: {
      variant: {
        success: 'bg-[#00c2c7]/15 text-[#006e72] border-[#00c2c7]/30',
        warning: 'bg-amber-100 text-amber-800 border-amber-200',
        danger: 'bg-rose-100 text-rose-800 border-rose-200',
        neutral: 'bg-slate-100 text-slate-700 border-slate-200',
        info: 'bg-sky-100 text-sky-800 border-sky-200',
      },
    },
    defaultVariants: {
      variant: 'neutral',
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {}

export const Badge: React.FC<BadgeProps> = ({ className, variant, children, ...props }) => {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props}>
      {children}
    </span>
  )
}
