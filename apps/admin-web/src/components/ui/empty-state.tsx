import * as React from 'react'
import { Button } from './button'

interface EmptyStateProps {
  title?: string
  description?: string
  actionLabel?: string
  onAction?: () => void
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No items need your attention right now.',
  description,
  actionLabel,
  onAction,
}) => {
  return (
    <div className="py-12 px-6 text-center bg-white rounded-xl border border-slate-200">
      <div className="text-sm font-semibold text-slate-700">{title}</div>
      {description && (
        <div className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">{description}</div>
      )}
      {actionLabel && onAction && (
        <div className="mt-4">
          <Button variant="outline" size="sm" onClick={onAction}>
            {actionLabel}
          </Button>
        </div>
      )}
    </div>
  )
}
