import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import { CategoryBadge } from '../components/ui/Badge'
import { LoadingPage } from '../components/ui/LoadingSpinner'
import ErrorAlert from '../components/ui/ErrorAlert'
import { usePackages } from '../hooks/usePackages'
import { formatIDR } from '../utils/currency'

export function PackageDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { allPackages, loading, error } = usePackages()
  const [pkg, setPkg] = useState(null)

  useEffect(() => {
    if (allPackages.length > 0) {
      const foundPackage = allPackages.find(p => p.id === parseInt(id))
      setPkg(foundPackage)
    }
  }, [allPackages, id])

  const handleSelect = () => {
    navigate('/checkout', { state: { package: pkg } })
  }

  if (loading) return <LoadingPage message="Memuat detail paket..." />
  
  if (error || !pkg) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ErrorAlert message="Gagal memuat detail paket. Silakan coba lagi." />
      </div>
    )
  }

  const relatedPackages = allPackages
    .filter(p => p.category === pkg.category && p.id !== pkg.id)
    .slice(0, 3)

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
      >
        <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Kembali
      </button>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <CategoryBadge category={pkg.category} />
                <h1 className="text-2xl font-bold text-gray-900 mt-2">{pkg.name}</h1>
              </div>
              {pkg.dataQuota === null && (
                <Badge variant="accent">Unlimited</Badge>
              )}
            </div>

            <p className="text-gray-600 mb-6">{pkg.description}</p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <p className="text-sm text-gray-500">Data</p>
                <p className="text-xl font-bold text-gray-900">
                  {pkg.dataQuota !== null ? `${pkg.dataQuota}GB` : 'Unlimited'}
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <p className="text-sm text-gray-500">Masa Aktif</p>
                <p className="text-xl font-bold text-gray-900">{pkg.validityDays} hari</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <p className="text-sm text-gray-500">Harga</p>
                <p className="text-xl font-bold text-primary">{formatIDR(pkg.price)}</p>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Fitur Paket</h3>
              <ul className="space-y-2">
                {pkg.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <svg className="w-5 h-5 text-accent mr-2 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Card>

          {relatedPackages.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Paket Serupa</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {relatedPackages.map(related => (
                  <Card key={related.id} hover padding="sm" className="cursor-pointer" onClick={() => navigate(`/packages/${related.id}`)}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-900">{related.name}</span>
                      <CategoryBadge category={related.category} />
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">{related.dataQuota}GB</span>
                      <span className="font-semibold text-primary">{formatIDR(related.price)}</span>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-1">
          <Card className="p-6 sticky top-24">
            <h3 className="font-semibold text-gray-900 mb-4">Ringkasan Pesanan</h3>
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Paket</span>
                <span className="font-medium">{pkg.name}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Data</span>
                <span className="font-medium">
                  {pkg.dataQuota !== null ? `${pkg.dataQuota}GB` : 'Unlimited'}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Masa Aktif</span>
                <span className="font-medium">{pkg.validityDays} hari</span>
              </div>
              <div className="pt-3 border-t border-gray-200">
                <div className="flex justify-between">
                  <span className="font-semibold text-gray-900">Total</span>
                  <span className="text-xl font-bold text-primary">{formatIDR(pkg.price)}</span>
                </div>
              </div>
            </div>
            <Button variant="primary" size="lg" className="w-full" onClick={handleSelect}>
              Pilih Paket Ini
            </Button>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default PackageDetailPage
