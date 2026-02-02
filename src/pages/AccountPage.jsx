import { useState } from 'react'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import Modal from '../components/ui/Modal'
import FormInput from '../components/ui/FormInput'
import { useCustomer } from '../hooks/useCustomer'
import { useNavigate } from 'react-router-dom'
import { formatDate } from '../utils/date'
import { PHONE_LINE_STATUS } from '../utils/constants'

export function AccountPage() {
  const navigate = useNavigate()
  const { customer, phoneLines, loading, addPhoneLine } = useCustomer()
  const [showAddModal, setShowAddModal] = useState(false)
  const [newPhoneNumber, setNewPhoneNumber] = useState('')
  const [addError, setAddError] = useState('')
  const [addLoading, setAddLoading] = useState(false)

  const handleAddPhoneLine = async () => {
    if (!newPhoneNumber.trim()) {
      setAddError('Nomor telepon wajib diisi')
      return
    }

    if (!/^\+?[0-9]{10,15}$/.test(newPhoneNumber.replace(/[\s-]/g, ''))) {
      setAddError('Format nomor telepon tidak valid')
      return
    }

    setAddLoading(true)
    try {
      await addPhoneLine(newPhoneNumber)
      setShowAddModal(false)
      setNewPhoneNumber('')
      setAddError('')
    } catch (err) {
      setAddError(err.message)
    } finally {
      setAddLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  if (!customer) return null

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Akun Saya</h1>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <Card className="p-6">
            <div className="text-center">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">
                  {customer.name?.charAt(0).toUpperCase()}
                </span>
              </div>
              <h2 className="text-lg font-semibold text-gray-900">{customer.name}</h2>
              <p className="text-sm text-gray-500 mt-1">{customer.email}</p>
              <div className="mt-4">
                <Badge variant="success">Aktif</Badge>
              </div>
              <p className="text-xs text-gray-400 mt-4">
                Terdaftar sejak {formatDate(customer.registrationDate)}
              </p>
            </div>
          </Card>
        </div>

        <div className="md:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Nomor Telepon</h2>
            <Button variant="primary" size="sm" onClick={() => setShowAddModal(true)}>
              + Tambah
            </Button>
          </div>

          {phoneLines.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-gray-500 mb-4">Belum ada nomor telepon terdaftar</p>
              <Button variant="outline" onClick={() => setShowAddModal(true)}>
                Tambah Nomor
              </Button>
            </Card>
          ) : (
            <div className="space-y-3">
              {phoneLines.map(line => (
                <Card key={line.id} padding="sm" hover>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{line.phoneNumber}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant={line.status === 'active' ? 'success' : 'gray'} size="sm">
                            {line.status === 'active' ? 'Aktif' : 'Tidak Aktif'}
                          </Badge>
                          {line.lastPurchaseDate && (
                            <span className="text-xs text-gray-500">
                              Terakhir: {formatDate(line.lastPurchaseDate)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate('/catalog')}
                      >
                        Beli Paket
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      <Modal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false)
          setNewPhoneNumber('')
          setAddError('')
        }}
        title="Tambah Nomor Telepon"
        size="sm"
      >
        <div className="space-y-4">
          {addError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-800">
              {addError}
            </div>
          )}
          <FormInput
            label="Nomor Telepon"
            type="tel"
            value={newPhoneNumber}
            onChange={(e) => {
              setNewPhoneNumber(e.target.value)
              setAddError('')
            }}
            placeholder="+6281234567890"
            required
          />
          <p className="text-sm text-gray-500">
            Format: +62 diikuti nomor telepon (10-15 digit)
          </p>
          <div className="flex space-x-3">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => {
                setShowAddModal(false)
                setNewPhoneNumber('')
                setAddError('')
              }}
            >
              Batal
            </Button>
            <Button
              variant="primary"
              className="flex-1"
              onClick={handleAddPhoneLine}
              loading={addLoading}
            >
              Tambah
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default AccountPage
