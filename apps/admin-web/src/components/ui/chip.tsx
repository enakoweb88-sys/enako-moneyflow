import * as React from 'react'

interface ChipProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode
}

export const Chip: React.FC<ChipProps> = ({ children, className = '', ...props }) => {
  return (
    <span
      className={`inline-block px-2.5 py-1 bg-white text-slate-700 text-xs font-mono rounded border border-slate-200 select-none ${className}`}
      {...props}
    >
      {children}
    </span>
  )
}
