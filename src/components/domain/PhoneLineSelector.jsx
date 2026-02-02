import { useState } from 'react'
import Card from '../ui/Card'
import Button from '../ui/Button'
import { StatusBadge } from '../ui/Badge'
import { PHONE_LINE_STATUS } from '../../utils/constants'

export function PhoneLineSelector({ phoneLines, selectedLineId, onSelect, disabled = false }) {
  const [showAddForm, setShowAddForm] = useState(false)
  const [newPhoneNumber, setNewPhoneNumber] = useState('')
  const [error, setError] = useState('')

  const handleAddLine = () => {
    if (!newPhoneNumber.trim()) {
      setError('Nomor telepon wajib diisi')
      return
    }
    
    if (!/^\+?[0-9]{10,15}$/.test(newPhoneNumber.replace(/[\s-]/g, ''))) {
      setError('Format nomor telepon tidak valid')
      return
    }

    // In a real app, this would call an API
    setShowAddForm(false)
    setNewPhoneNumber('')
    setError('')
  }

  if (phoneLines.length === 0 && !showAddForm) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 mb-4">Belum ada nomor telepon terdaftar</p>
        <Button variant="primary" onClick={() => setShowAddForm(true)}>
          Tambah Nomor
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {phoneLines.map(line => (
        <label
          key={line.id}
          className={`block cursor-pointer ${disabled ? 'opacity-50 pointer-events-none' : ''}`}
        >
          <input
            type="radio"
            name="phoneLine"
            value={line.id}
            checked={selectedLineId === line.id}
            onChange={() => onSelect(line.id)}
            disabled={disabled}
            className="sr-only peer"
          />
          <Card
            padding="sm"
            className={`transition-all ${
              selectedLineId === line.id
                ? 'ring-2 ring-primary border-primary bg-primary/5'
                : 'hover:border-gray-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  selectedLineId === line.id
                    ? 'border-primary bg-primary'
                    : 'border-gray-300'
                }`}>
                  {selectedLineId === line.id && (
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{line.phoneNumber}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <StatusBadge status={line.status} />
                    {line.lastPurchaseDate && (
                      <span className="text-xs text-gray-500">
                        Terakhir: {new Date(line.lastPurchaseDate).toLocaleDateString('id-ID')}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </label>
      ))}

      {!showAddForm ? (
        <button
          onClick={() => setShowAddForm(true)}
          disabled={disabled}
          className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-primary hover:text-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          + Tambah Nomor Baru
        </button>
      ) : (
        <Card padding="sm" className="bg-gray-50">
          <h4 className="font-medium text-gray-900 mb-3">Tambah Nomor Baru</h4>
          <div className="space-y-3">
            <div>
              <input
                type="tel"
                value={newPhoneNumber}
                onChange={(e) => {
                  setNewPhoneNumber(e.target.value)
                  setError('')
                }}
                placeholder="+6281234567890"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              />
              {error && <p className="text-sm text-error mt-1">{error}</p>}
            </div>
            <div className="flex space-x-2">
              <Button variant="primary" size="sm" onClick={handleAddLine}>
                Tambah
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setShowAddForm(false)
                  setNewPhoneNumber('')
                  setError('')
                }}
              >
                Batal
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}

export default PhoneLineSelector
