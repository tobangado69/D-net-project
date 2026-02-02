import { useState, useMemo } from 'react'
import { useFetch } from './useFetch'
import { getAllPackages } from '../services/packageService'
import { PACKAGE_CATEGORIES, SORT_OPTIONS } from '../utils/constants'

export function usePackages() {
  const [category, setCategory] = useState('all')
  const [sortBy, setSortBy] = useState('price-asc')
  const [searchQuery, setSearchQuery] = useState('')

  const { data: packages, loading, error, refetch } = useFetch(
    () => getAllPackages(),
    []
  )

  const filteredAndSortedPackages = useMemo(() => {
    if (!packages) return []

    let result = [...packages]

    if (category !== 'all') {
      result = result.filter(pkg => pkg.category === category)
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      result = result.filter(pkg =>
        pkg.name.toLowerCase().includes(query) ||
        pkg.description.toLowerCase().includes(query)
      )
    }

    result.sort((a, b) => {
      switch (sortBy) {
        case 'price-asc':
          return a.price - b.price
        case 'price-desc':
          return b.price - a.price
        case 'quota-desc':
          return (b.dataQuota || 0) - (a.dataQuota || 0)
        case 'quota-asc':
          return (a.dataQuota || 0) - (b.dataQuota || 0)
        case 'validity-desc':
          return b.validityDays - a.validityDays
        case 'validity-asc':
          return a.validityDays - b.validityDays
        default:
          return 0
      }
    })

    return result
  }, [packages, category, sortBy, searchQuery])

  const categories = PACKAGE_CATEGORIES
  const sortOptions = SORT_OPTIONS

  const setFilterCategory = (newCategory) => {
    setCategory(newCategory)
  }

  const setFilterSort = (newSort) => {
    setSortBy(newSort)
  }

  const setFilterSearch = (query) => {
    setSearchQuery(query)
  }

  const resetFilters = () => {
    setCategory('all')
    setSortBy('price-asc')
    setSearchQuery('')
  }

  return {
    packages: filteredAndSortedPackages,
    allPackages: packages || [],
    loading,
    error,
    refetch,
    filters: {
      category,
      sortBy,
      searchQuery
    },
    categories,
    sortOptions,
    setFilterCategory,
    setFilterSort,
    setFilterSearch,
    resetFilters
  }
}

export default usePackages
