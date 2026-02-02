import { useState } from 'react'
import Button from '../ui/Button'
import { FormSelect } from '../ui/FormInput'

export function PackageFilter({
  categories,
  sortOptions,
  filters,
  onCategoryChange,
  onSortChange,
  onSearchChange,
  onReset,
  searchQuery
}) {
  const [showMobileFilters, setShowMobileFilters] = useState(false)

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Cari paket..."
              className="w-full px-4 py-2.5 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
            />
            <svg
              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        <button
          className="sm:hidden px-4 py-2 border border-gray-300 rounded-lg text-gray-700 flex items-center justify-center gap-2"
          onClick={() => setShowMobileFilters(!showMobileFilters)}
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          Filter & Urutan
        </button>

        <div className="hidden sm:flex gap-3">
          <FormSelect
            options={categories}
            value={filters.category}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="w-40"
          />
          <FormSelect
            options={sortOptions}
            value={filters.sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="w-48"
          />
        </div>
      </div>

      {showMobileFilters && (
        <div className="sm:hidden p-4 bg-gray-50 rounded-lg space-y-3">
          <FormSelect
            label="Kategori"
            options={categories}
            value={filters.category}
            onChange={(e) => onCategoryChange(e.target.value)}
          />
          <FormSelect
            label="Urutkan"
            options={sortOptions}
            value={filters.sortBy}
            onChange={(e) => onSortChange(e.target.value)}
          />
        </div>
      )}

      {(filters.category !== 'all' || filters.sortBy !== 'price-asc' || searchQuery) && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Filter aktif:</span>
          {filters.category !== 'all' && (
            <span className="inline-flex items-center px-2 py-1 bg-primary/10 text-primary rounded-full text-xs">
              {categories.find(c => c.value === filters.category)?.label}
              <button
                onClick={() => onCategoryChange('all')}
                className="ml-1 hover:text-primary-dark"
              >
                ×
              </button>
            </span>
          )}
          {searchQuery && (
            <span className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
              "{searchQuery}"
              <button
                onClick={() => onSearchChange('')}
                className="ml-1 hover:text-gray-900"
              >
                ×
              </button>
            </span>
          )}
          <button
            onClick={onReset}
            className="text-sm text-primary hover:text-primary-dark ml-2"
          >
            Reset filter
          </button>
        </div>
      )}
    </div>
  )
}

export default PackageFilter
