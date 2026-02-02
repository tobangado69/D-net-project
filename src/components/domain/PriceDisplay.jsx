import { formatIDR } from '../../utils/currency'

export function PriceDisplay({ amount, size = 'md', className = '' }) {
  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl',
    xl: 'text-4xl'
  }

  const fontWeight = {
    sm: 'font-semibold',
    md: 'font-bold',
    lg: 'font-bold',
    xl: 'font-bold'
  }

  return (
    <span className={`${sizeClasses[size]} ${fontWeight[size]} text-primary ${className}`}>
      {formatIDR(amount)}
    </span>
  )
}

export function PriceBreakdown({ items, total, showTotal = true }) {
  return (
    <div className="space-y-2 text-sm">
      {items.map((item, index) => (
        <div key={index} className="flex justify-between text-gray-600">
          <span>{item.label}</span>
          <span>{formatIDR(item.amount)}</span>
        </div>
      ))}
      {showTotal && (
        <div className="flex justify-between text-gray-900 font-semibold pt-2 border-t border-gray-200">
          <span>Total</span>
          <span>{formatIDR(total)}</span>
        </div>
      )}
    </div>
  )
}

export function PriceComparison({ originalPrice, discountedPrice }) {
  const savings = originalPrice - discountedPrice
  const savingsPercentage = Math.round((savings / originalPrice) * 100)

  return (
    <div className="flex items-baseline gap-2">
      <PriceDisplay amount={discountedPrice} size="lg" />
      <span className="text-sm text-gray-500 line-through currency-idr">
        {formatIDR(originalPrice)}
      </span>
      <span className="badge badge-accent text-xs">
        Hemat {savingsPercentage}%
      </span>
    </div>
  )
}

export default PriceDisplay
