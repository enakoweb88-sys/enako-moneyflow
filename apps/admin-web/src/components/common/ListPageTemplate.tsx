import React, { useState } from 'react'
import {
  Filter,
  SlidersHorizontal,
  Plus,
  Search,
  ChevronLeft,
  ChevronRight,
  X,
  Inbox,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

export interface ListTab {
  id: string
  label: string
  count?: number
}

export interface ListPageTemplateProps {
  title: string
  subtitle?: string
  primaryActionLabel?: string
  primaryActionShortcut?: string
  onPrimaryAction?: () => void
  tabs: ListTab[]
  activeTab: string
  onTabChange: (tabId: string) => void
  infoBanner?: {
    message: string
    linkText?: string
    onLinkClick?: () => void
  }
  statusChips?: { id: string; label: string }[]
  activeStatusChip?: string
  onStatusChipChange?: (statusId: string) => void
  searchPlaceholder?: string
  searchValue?: string
  onSearchChange?: (val: string) => void
  totalCount?: number
  currentPage?: number
  pageSize?: number
  onPageChange?: (page: number) => void
  children?: React.ReactNode
  isEmpty?: boolean
  emptyStateTitle?: string
  emptyStateDescription?: string
  emptyStateLinkText?: string
  onEmptyStateLinkClick?: () => void
}

export const ListPageTemplate: React.FC<ListPageTemplateProps> = ({
  title,
  subtitle,
  primaryActionLabel,
  primaryActionShortcut,
  onPrimaryAction,
  tabs,
  activeTab,
  onTabChange,
  infoBanner,
  statusChips = [
    { id: 'all', label: 'All' },
    { id: 'completed', label: 'Completed' },
    { id: 'pending', label: 'Pending' },
    { id: 'flagged', label: 'Flagged' },
    { id: 'failed', label: 'Failed' },
  ],
  activeStatusChip = 'all',
  onStatusChipChange,
  searchPlaceholder = 'Search records...',
  searchValue,
  onSearchChange,
  totalCount = 0,
  currentPage = 1,
  pageSize = 10,
  onPageChange,
  children,
  isEmpty = false,
  emptyStateTitle = 'No records found',
  emptyStateDescription = 'There are no items matching the selected filters.',
  emptyStateLinkText = 'Learn more in documentation',
  onEmptyStateLinkClick,
}) => {
  const [showBanner, setShowBanner] = useState(true)
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  const startRecord = Math.min((currentPage - 1) * pageSize + 1, totalCount)
  const endRecord = Math.min(currentPage * pageSize, totalCount)

  return (
    <div className="space-y-6 max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      {/* Top Header Row: Title & Primary Action */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">{title}</h1>
          {subtitle && <p className="text-xs sm:text-sm text-slate-500 mt-1">{subtitle}</p>}
        </div>

        {primaryActionLabel && onPrimaryAction && (
          <div className="flex items-center space-x-2">
            <Button
              variant="default"
              size="sm"
              onClick={onPrimaryAction}
              className="bg-[#001f5b] hover:bg-[#001744] text-white flex items-center space-x-1.5 shadow-2xs"
            >
              <Plus className="w-4 h-4" />
              <span>{primaryActionLabel}</span>
              {primaryActionShortcut && (
                <kbd className="ml-1.5 px-1.5 py-0.5 text-[10px] font-mono bg-white/20 text-white rounded">
                  {primaryActionShortcut}
                </kbd>
              )}
            </Button>
          </div>
        )}
      </div>

      {/* Tabs Row (Plain text tabs mirroring Stripe) */}
      <div className="border-b border-slate-200">
        <nav className="flex space-x-6 overflow-x-auto no-scrollbar" aria-label="Tabs">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onTabChange(tab.id)}
                className={`py-3 px-1 text-sm font-semibold border-b-2 whitespace-nowrap transition-colors flex items-center space-x-2 cursor-pointer ${
                  isActive
                    ? 'border-[#001f5b] text-[#001f5b]'
                    : 'border-transparent text-slate-500 hover:text-slate-900 hover:border-slate-300'
                }`}
              >
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span
                    className={`px-1.5 py-0.5 text-xs rounded-full font-mono ${
                      isActive ? 'bg-[#001f5b]/10 text-[#001f5b]' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            )
          })}
        </nav>
      </div>

      {/* Optional Dismissible Info Banner */}
      {infoBanner && showBanner && (
        <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs text-slate-700 animate-in fade-in duration-150">
          <div className="flex items-center space-x-2.5">
            <span className="w-2 h-2 rounded-full bg-[#00c2c7]/100 shrink-0" />
            <span>{infoBanner.message}</span>
            {infoBanner.linkText && (
              <button
                type="button"
                onClick={infoBanner.onLinkClick}
                className="font-semibold text-[#001f5b] hover:text-[#0a0f2c] underline underline-offset-2 ml-1 cursor-pointer"
              >
                {infoBanner.linkText}
              </button>
            )}
          </div>
          <button
            type="button"
            onClick={() => setShowBanner(false)}
            className="p-1 rounded text-slate-400 hover:text-slate-600 hover:bg-slate-200/50"
            aria-label="Dismiss banner"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Controls Row: Status Filter Chips + Search + Filter Button */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 pt-1">
        {/* Status Chips */}
        <div className="flex flex-wrap items-center gap-1.5">
          {statusChips.map((chip) => {
            const isChipActive = activeStatusChip === chip.id
            return (
              <button
                key={chip.id}
                type="button"
                onClick={() => onStatusChipChange && onStatusChipChange(chip.id)}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-all cursor-pointer ${
                  isChipActive
                    ? 'bg-slate-900 text-white shadow-2xs font-semibold'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {chip.label}
              </button>
            )
          })}
        </div>

        {/* Search & Actions */}
        <div className="flex items-center space-x-2">
          {onSearchChange && (
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchValue || ''}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder={searchPlaceholder}
                className="pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:border-slate-400 w-48 sm:w-60 shadow-2xs"
              />
            </div>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="border-slate-200 text-slate-700 hover:bg-slate-50 text-xs flex items-center space-x-1.5 h-8"
          >
            <Filter className="w-3.5 h-3.5" />
            <span>Filter</span>
          </Button>

          <button
            type="button"
            className="p-1.5 text-slate-500 hover:text-slate-800 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 h-8 w-8 flex items-center justify-center cursor-pointer"
            title="Customize Columns"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Advanced Filter Drawer / Panel */}
      {isFilterOpen && (
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs animate-in slide-in-from-top-2 duration-150">
          <div>
            <label className="block text-slate-600 font-medium mb-1">Date Range</label>
            <select className="w-full bg-white border border-slate-200 rounded-md p-1.5 text-slate-800 outline-hidden">
              <option>All Time</option>
              <option>Today</option>
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>
          <div>
            <label className="block text-slate-600 font-medium mb-1">Currency Corridor</label>
            <select className="w-full bg-white border border-slate-200 rounded-md p-1.5 text-slate-800 outline-hidden">
              <option>All Corridors</option>
              <option>EUR / XAF</option>
              <option>USD / XAF</option>
              <option>GBP / XAF</option>
            </select>
          </div>
          <div className="flex items-end space-x-2">
            <Button
              variant="default"
              size="sm"
              onClick={() => setIsFilterOpen(false)}
              className="bg-[#001f5b] text-white text-xs h-7.5"
            >
              Apply Filter
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsFilterOpen(false)}
              className="text-xs h-7.5 border-slate-200"
            >
              Reset
            </Button>
          </div>
        </div>
      )}

      {/* Main Content Area: Table or Empty State */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
        {isEmpty ? (
          /* Stripe-style Calm Empty State */
          <div className="py-20 px-6 text-center space-y-4 max-w-md mx-auto">
            <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center mx-auto text-slate-400">
              <Inbox className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-900">{emptyStateTitle}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">{emptyStateDescription}</p>
            </div>
            {emptyStateLinkText && (
              <button
                type="button"
                onClick={onEmptyStateLinkClick}
                className="text-xs font-semibold text-[#001f5b] hover:text-[#0a0f2c] underline underline-offset-4 cursor-pointer"
              >
                {emptyStateLinkText}
              </button>
            )}
          </div>
        ) : (
          children
        )}

        {/* Minimalist Pagination Bar */}
        {!isEmpty && totalCount > 0 && (
          <div className="px-5 py-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
            <span>
              Showing <span className="font-semibold text-slate-800 font-mono">{startRecord}</span>–
              <span className="font-semibold text-slate-800 font-mono">{endRecord}</span> of{' '}
              <span className="font-semibold text-slate-800 font-mono">{totalCount}</span> results
            </span>

            <div className="flex items-center space-x-1">
              <button
                type="button"
                disabled={currentPage <= 1}
                onClick={() => onPageChange && onPageChange(currentPage - 1)}
                className="p-1 rounded border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
                aria-label="Previous Page"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="px-2 font-mono font-medium text-slate-700">{currentPage}</span>
              <button
                type="button"
                disabled={endRecord >= totalCount}
                onClick={() => onPageChange && onPageChange(currentPage + 1)}
                className="p-1 rounded border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
                aria-label="Next Page"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
