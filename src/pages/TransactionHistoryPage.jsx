import { useState, useMemo, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import TransactionRow from '../components/domain/TransactionRow'
import { FormSelect } from '../components/ui/FormInput'
import { useCustomer } from '../hooks/useCustomer'
import { useTransaction } from '../hooks/useTransaction'
import { getPackageById } from '../services/packageService'

export function TransactionHistoryPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { phoneLines } = useCustomer()
  const { transactions, loading, error, refetch } = useTransaction()
  const [filterPhoneLine, setFilterPhoneLine] = useState('all')
  const [packagesMap, setPackagesMap] = useState({})
  const [lastRefresh, setLastRefresh] = useState(Date.now())

  useEffect(() => {
    const loadPackageDetails = async () => {
      const packageIds = [...new Set(transactions.map(t => t.packageId))]
      const newPackagesMap = { ...packagesMap }
      
      for (const pkgId of packageIds) {
        if (!newPackagesMap[pkgId]) {
          try {
            const pkg = await getPackageById(pkgId)
            newPackagesMap[pkgId] = pkg
          } catch (err) {
            console.error('Failed to load package:', pkgId)
          }
        }
      }
      setPackagesMap(newPackagesMap)
    }
    
    if (transactions.length > 0) {
      loadPackageDetails()
    }
  }, [transactions.length])

  const filteredTransactions = useMemo(() => {
    if (filterPhoneLine === 'all') return transactions
    return transactions.filter(t => t.phoneLineId === parseInt(filterPhoneLine))
  }, [transactions, filterPhoneLine])

  const handleReorder = (transaction) => {
    navigate('/checkout', { 
      state: { 
        packageId: transaction.packageId,
        phoneLineId: transaction.phoneLineId,
        reorder: true
      } 
    })
  }

  const phoneLineOptions = [
    { value: 'all', label: 'Semua Nomor' },
    ...phoneLines.map(line => ({
      value: line.id.toString(),
      label: line.phoneNumber
    }))
  ]

  useEffect(() => {
    const shouldRefresh = location.state?.shouldRefresh
    if (shouldRefresh) {
      refetch()
      setLastRefresh(Date.now())
      navigate('.', { replace: true, state: {} })
    } else {
      refetch()
    }
  }, [location.state])

  const handleManualRefresh = async () => {
    setLastRefresh(Date.now())
    await refetch()
  }

  if (loading && transactions.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-16 bg-gray-200 rounded"></div>
          <div className="h-16 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Riwayat Transaksi</h1>
        <button
          onClick={handleManualRefresh}
          className="text-sm text-primary hover:text-primary-dark flex items-center px-3 py-2 rounded-lg hover:bg-primary/10 transition-colors"
          title="Refresh data"
        >
          <svg 
            className="w-4 h-4 mr-1" 
            style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }}
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh
        </button>
      </div>

      <div className="mb-6">
        <FormSelect
          label="Filter berdasarkan nomor"
          options={phoneLineOptions}
          value={filterPhoneLine}
          onChange={(e) => setFilterPhoneLine(e.target.value)}
          className="w-full sm:w-64"
        />
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
          Gagal memuat riwayat transaksi. Silakan coba lagi.
          <button 
            onClick={handleManualRefresh}
            className="ml-2 underline font-medium"
          >
            Coba lagi
          </button>
        </div>
      )}

      {transactions.length === 0 ? (
        <Card className="p-12 text-center">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <h3 className="mt-2 text-lg font-medium text-gray-900">Belum ada transaksi</h3>
          <p className="mt-1 text-gray-500">Transaksi Anda akan muncul di sini setelah membeli paket data</p>
          <Button
            variant="primary"
            className="mt-6"
            onClick={() => navigate('/catalog')}
          >
            Beli Paket Data
          </Button>
        </Card>
      ) : filteredTransactions.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-gray-500">Tidak ada transaksi untuk nomor yang dipilih</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredTransactions
            .sort((a, b) => new Date(b.purchaseDate) - new Date(a.purchaseDate))
            .map(transaction => {
              const pkg = packagesMap[transaction.packageId]
              const phoneLine = phoneLines.find(l => l.id === transaction.phoneLineId)
              
              return (
                <TransactionRow
                  key={transaction.id}
                  transaction={transaction}
                  package={pkg}
                  phoneLine={phoneLine}
                  onReorder={handleReorder}
                />
              )
            })}
        </div>
      )}

      {transactions.length > 0 && (
        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600 text-center">
            Total {transactions.length} transaksi
            {filterPhoneLine !== 'all' && ` (difilter)`}
            <span className="block mt-1 text-xs text-gray-400">
              Terakhir diperbarui: {new Date(lastRefresh).toLocaleTimeString('id-ID')}
            </span>
          </p>
        </div>
      )}
    </div>
  )
}

export default TransactionHistoryPage
