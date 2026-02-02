import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import PhoneLineSelector from '../components/domain/PhoneLineSelector'
import { useCustomer } from '../hooks/useCustomer'
import { useTransaction } from '../hooks/useTransaction'
import { formatIDR } from '../utils/currency'

export function CheckoutPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { customer, phoneLines, loading: customerLoading, refetch } = useCustomer()
  const { create, createLoading, createError } = useTransaction()
  
  const [selectedLineId, setSelectedLineId] = useState('')
  const [confirmed, setConfirmed] = useState(false)
  const [error, setError] = useState('')

  const pkg = location.state?.package

  useEffect(() => {
    if (!pkg) {
      navigate('/catalog')
    }
  }, [pkg, navigate])

  useEffect(() => {
    if (phoneLines.length > 0 && !selectedLineId) {
      setSelectedLineId(phoneLines[0].id)
    }
  }, [phoneLines, selectedLineId])

  const handleSubmit = async () => {
    if (!selectedLineId) {
      setError('Silakan pilih nomor telepon')
      return
    }

    if (!confirmed) {
      setError('Silakan konfirmasi pesanan Anda')
      return
    }

    try {
      const transaction = await create({
        phoneLineId: selectedLineId,
        packageId: pkg.id,
        amountPaid: pkg.price,
        purchaseDate: new Date().toISOString()
      })
      
      navigate('/confirmation', { 
        state: { 
          package: pkg,
          phoneLineId: selectedLineId,
          transaction: transaction
        } 
      })
    } catch (err) {
      setError(err.message)
    }
  }

  if (customerLoading) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  if (!pkg) return null

  const selectedPhoneLine = phoneLines.find(line => line.id === selectedLineId)

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
      >
        <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Kembali
      </button>

      <h1 className="text-2xl font-bold text-gray-900 mb-6">Checkout</h1>

      {(error || createError) && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
          {error || createError}
        </div>
      )}

      <div className="space-y-6">
        <Card className="p-5">
          <h2 className="font-semibold text-gray-900 mb-4">Paket yang Dipilih</h2>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-gray-900">{pkg.name}</h3>
              <p className="text-sm text-gray-500 mt-1">
                {pkg.dataQuota !== null ? `${pkg.dataQuota}GB` : 'Unlimited'} • {pkg.validityDays} hari
              </p>
            </div>
            <div className="text-right">
              <p className="text-xl font-bold text-primary">{formatIDR(pkg.price)}</p>
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <h2 className="font-semibold text-gray-900 mb-4">Pilih Nomor Telepon</h2>
          <PhoneLineSelector
            phoneLines={phoneLines}
            selectedLineId={selectedLineId}
            onSelect={setSelectedLineId}
          />
        </Card>

        <Card className="p-5">
          <h2 className="font-semibold text-gray-900 mb-4">Ringkasan Pesanan</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Paket</span>
              <span className="font-medium">{pkg.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Nomor Telepon</span>
              <span className="font-medium">{selectedPhoneLine?.phoneNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Masa Aktif</span>
              <span className="font-medium">{pkg.validityDays} hari</span>
            </div>
            <div className="pt-3 border-t border-gray-200">
              <div className="flex justify-between">
                <span className="font-semibold text-gray-900">Total Pembayaran</span>
                <span className="text-xl font-bold text-primary">{formatIDR(pkg.price)}</span>
              </div>
            </div>
          </div>
        </Card>

        <label className="block">
          <input
            type="checkbox"
            checked={confirmed}
            onChange={(e) => {
              setConfirmed(e.target.checked)
              setError('')
            }}
            className="w-5 h-5 text-primary border-gray-300 rounded focus:ring-primary"
          />
          <span className="ml-3 text-sm text-gray-600">
            Saya menyetujui bahwa pesanan ini sudah benar dan ingin melanjutkan pembayaran
          </span>
        </label>

        <div className="flex space-x-4">
          <Button
            variant="outline"
            size="lg"
            className="flex-1"
            onClick={() => navigate('/catalog')}
          >
            Batal
          </Button>
          <Button
            variant="primary"
            size="lg"
            className="flex-1"
            onClick={handleSubmit}
            loading={createLoading}
            disabled={!confirmed || !selectedLineId}
          >
            Konfirmasi Pembelian
          </Button>
        </div>
      </div>
    </div>
  )
}

export default CheckoutPage
