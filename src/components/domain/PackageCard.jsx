import { Link } from 'react-router-dom'
import Card from '../ui/Card'
import Button from '../ui/Button'
import { CategoryBadge } from '../ui/Badge'
import { formatIDR } from '../../utils/currency'

export function PackageCard({ package: pkg, onSelect }) {
  return (
    <Card hover className="h-full flex flex-col">
      <div className="flex items-start justify-between mb-3">
        <CategoryBadge category={pkg.category} />
        {pkg.dataQuota === null && (
          <span className="badge badge-accent">Unlimited</span>
        )}
      </div>

      <h3 className="text-xl font-bold text-gray-900 mb-2">{pkg.name}</h3>
      
      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{pkg.description}</p>

      <div className="flex-1">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-gray-500 text-xs">Data</p>
            <p className="font-semibold text-gray-900">
              {pkg.dataQuota !== null ? `${pkg.dataQuota}GB` : 'Unlimited'}
            </p>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-gray-500 text-xs">Masa Aktif</p>
            <p className="font-semibold text-gray-900">{pkg.validityDays} hari</p>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Harga</p>
            <p className="text-2xl font-bold text-primary currency-idr">
              {formatIDR(pkg.price)}
            </p>
          </div>
          <Button
            variant="primary"
            size="md"
            onClick={() => onSelect(pkg)}
          >
            Pilih
          </Button>
        </div>
      </div>
    </Card>
  )
}

export function PackageCardList({ package: pkg, onSelect }) {
  return (
    <Card hover className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <CategoryBadge category={pkg.category} />
          <span className="text-sm text-gray-500">
            {pkg.validityDays} hari
          </span>
        </div>
        <h3 className="text-lg font-semibold text-gray-900">{pkg.name}</h3>
        <p className="text-sm text-gray-600 mt-1">{pkg.description}</p>
        <div className="mt-2 flex items-center gap-4 text-sm">
          <span className="text-gray-700">
            <strong>{pkg.dataQuota !== null ? `${pkg.dataQuota}GB` : 'Unlimited'}</strong> data
          </span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="text-sm text-gray-500">Harga</p>
          <p className="text-xl font-bold text-primary currency-idr">
            {formatIDR(pkg.price)}
          </p>
        </div>
        <Button
          variant="primary"
          size="sm"
          onClick={() => onSelect(pkg)}
        >
          Pilih
        </Button>
      </div>
    </Card>
  )
}

export default PackageCard
