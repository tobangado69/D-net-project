import { useNavigate } from 'react-router-dom'
import PackageCard from '../components/domain/PackageCard'
import PackageFilter from '../components/domain/PackageFilter'
import { LoadingGrid } from '../components/ui/LoadingSpinner'
import ErrorAlert from '../components/ui/ErrorAlert'
import { usePackages } from '../hooks/usePackages'

export function CatalogPage() {
  const navigate = useNavigate()
  const {
    packages,
    loading,
    error,
    filters,
    categories,
    sortOptions,
    setFilterCategory,
    setFilterSort,
    setFilterSearch,
    resetFilters
  } = usePackages()

  const handleSelectPackage = (pkg) => {
    navigate('/checkout', { state: { package: pkg } })
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ErrorAlert message="Gagal memuat paket data. Silakan coba lagi." />
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Katalog Paket Data</h1>
        <p className="mt-2 text-gray-600">
          Pilih paket data yang sesuai dengan kebutuhan Anda
        </p>
      </div>

      <div className="mb-6">
        <PackageFilter
          categories={categories}
          sortOptions={sortOptions}
          filters={filters}
          onCategoryChange={setFilterCategory}
          onSortChange={setFilterSort}
          onSearchChange={setFilterSearch}
          onReset={resetFilters}
          searchQuery={filters.searchQuery}
        />
      </div>

      {loading ? (
        <LoadingGrid count={6} />
      ) : packages.length === 0 ? (
        <div className="text-center py-16">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="mt-2 text-lg font-medium text-gray-900">Tidak ada paket ditemukan</h3>
          <p className="mt-1 text-gray-500">Coba ubah filter atau kata pencarian Anda</p>
          <button
            onClick={resetFilters}
            className="mt-4 text-primary hover:text-primary-dark font-medium"
          >
            Hapus filter
          </button>
        </div>
      ) : (
        <>
          <p className="mb-4 text-sm text-gray-500">
            Menampilkan {packages.length} paket
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {packages.map(pkg => (
              <PackageCard
                key={pkg.id}
                package={pkg}
                onSelect={handleSelectPackage}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default CatalogPage
