import Card from '../ui/Card'
import Button from '../ui/Button'
import { StatusBadge } from '../ui/Badge'
import { formatIDR } from '../../utils/currency'
import { formatDateTime } from '../../utils/date'

export function TransactionRow({ transaction, package: pkg, phoneLine, onReorder }) {
  return (
    <Card padding="sm" className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <StatusBadge status={transaction.status} />
          <span className="text-xs text-gray-500">#{transaction.id}</span>
        </div>
        <h4 className="font-semibold text-gray-900 truncate">{pkg?.name || 'Unknown Package'}</h4>
        <p className="text-sm text-gray-600 mt-1">
          {phoneLine?.phoneNumber || 'Unknown Number'}
        </p>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-right hidden sm:block">
          <p className="text-sm text-gray-500">{formatDateTime(transaction.purchaseDate)}</p>
          <p className="text-lg font-bold text-primary currency-idr">
            {formatIDR(transaction.amountPaid)}
          </p>
        </div>
        
        {onReorder && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onReorder(transaction)}
          >
            Beli Lagi
          </Button>
        )}
      </div>
    </Card>
  )
}

export function TransactionTableRow({ transaction, package: pkg, phoneLine, onReorder }) {
  return (
    <tr className="hover:bg-gray-50">
      <td className="px-4 py-3 whitespace-nowrap">
        <div className="text-sm font-medium text-gray-900">#{transaction.id}</div>
        <div className="text-xs text-gray-500">{formatDateTime(transaction.purchaseDate)}</div>
      </td>
      <td className="px-4 py-3">
        <div className="text-sm font-medium text-gray-900">{pkg?.name}</div>
        <div className="text-xs text-gray-500">{phoneLine?.phoneNumber}</div>
      </td>
      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 currency-idr">
        {formatIDR(transaction.amountPaid)}
      </td>
      <td className="px-4 py-3 whitespace-nowrap">
        <StatusBadge status={transaction.status} />
      </td>
      <td className="px-4 py-3 whitespace-nowrap">
        {onReorder && (
          <button
            onClick={() => onReorder(transaction)}
            className="text-primary hover:text-primary-dark text-sm font-medium"
          >
            Beli Lagi
          </button>
        )}
      </td>
    </tr>
  )
}

export default TransactionRow
