import { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import { useCustomer } from '../hooks/useCustomer'
import { formatIDR } from '../utils/currency'
import { formatDateTime } from '../utils/date'

export function ConfirmationPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { phoneLines } = useCustomer()
  
  const pkg = location.state?.package
  const phoneLineId = location.state?.phoneLineId
  const transaction = location.state?.transaction

  useEffect(() => {
    if (!pkg || !phoneLineId) {
      navigate('/catalog')
    }
  }, [pkg, phoneLineId, navigate])

  if (!pkg) return null

  const phoneLine = phoneLines.find(line => line.id === phoneLineId)
  const transactionId = transaction?.id || `TXN${Date.now().toString().slice(-6)}`
  const transactionDate = transaction?.purchaseDate || new Date().toISOString()

  return (
    <div className="max-w-lg mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-10 h-10 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Pembelian Berhasil!</h1>
        <p className="mt-2 text-gray-600">
          Terima kasih telah membeli paket data
        </p>
      </div>

      <Card className="p-6 mb-6">
        <div className="text-center pb-4 border-b border-gray-100">
          <p className="text-sm text-gray-500">ID Transaksi</p>
          <p className="text-xl font-mono font-bold text-gray-900">#{transactionId}</p>
          <p className="text-sm text-gray-500 mt-1">{formatDateTime(transactionDate)}</p>
        </div>

        <div className="py-4 space-y-4">
          <div className="flex justify-between">
            <span className="text-gray-600">Paket</span>
            <span className="font-medium text-gray-900">{pkg.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Nomor Telepon</span>
            <span className="font-medium text-gray-900">{phoneLine?.phoneNumber}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Masa Aktif</span>
            <span className="font-medium text-gray-900">{pkg.validityDays} hari</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Status</span>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              Berhasil
            </span>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-100">
          <div className="flex justify-between">
            <span className="font-semibold text-gray-900">Total Dibayar</span>
            <span className="text-2xl font-bold text-primary">{formatIDR(pkg.price)}</span>
          </div>
        </div>
      </Card>

      <div className="bg-accent/5 border border-accent/20 rounded-lg p-4 mb-6">
        <div className="flex">
          <svg className="w-5 h-5 text-accent mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="text-sm text-gray-700">
            <p className="font-medium text-accent-dark">Paket sudah aktif!</p>
            <p className="mt-1">Data akan langsung tersedia di nomor {phoneLine?.phoneNumber}</p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <Button
          variant="primary"
          size="lg"
          className="w-full"
          onClick={() => navigate('/transactions', { state: { shouldRefresh: true } })}
        >
          Lihat Riwayat Transaksi
        </Button>
        <Button
          variant="outline"
          size="lg"
          className="w-full"
          onClick={() => navigate('/catalog')}
        >
          Beli Paket Lainnya
        </Button>
      </div>
    </div>
  )
}

export default ConfirmationPage
