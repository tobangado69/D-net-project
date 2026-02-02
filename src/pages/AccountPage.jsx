import { useState } from 'react'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import Modal from '../components/ui/Modal'
import FormInput from '../components/ui/FormInput'
import FormSelect from '../components/ui/FormInput'
import { useCustomer } from '../hooks/useCustomer'
import { useNavigate } from 'react-router-dom'
import { formatDate } from '../utils/date'

export function AccountPage() {
  const navigate = useNavigate()
  const { customer, phoneLines, loading, addPhoneLine, updateCustomer, updatePhoneLine, deletePhoneLine, updateLoading } = useCustomer()
  
  // Add phone line modal state
  const [showAddModal, setShowAddModal] = useState(false)
  const [newPhoneNumber, setNewPhoneNumber] = useState('')
  const [addError, setAddError] = useState('')
  const [addLoading, setAddLoading] = useState(false)
  
  // Edit profile modal state
  const [showEditModal, setShowEditModal] = useState(false)
  const [editName, setEditName] = useState('')
  const [editEmail, setEditEmail] = useState('')
  const [editError, setEditError] = useState('')
  
  // Delete confirmation modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleteLine, setDeleteLine] = useState(null)
  const [deleteLoading, setDeleteLoading] = useState(false)
  
  // Phone line status update state
  const [statusUpdateLoading, setStatusUpdateLoading] = useState(null)

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

  const handleEditProfile = async () => {
    // Validate name
    if (!editName.trim()) {
      setEditError('Nama wajib diisi')
      return
    }
    
    if (editName.trim().length < 2) {
      setEditError('Nama minimal 2 karakter')
      return
    }

    if (editName.trim().length > 50) {
      setEditError('Nama maksimal 50 karakter')
      return
    }

    // Email validation (basic)
    if (!editEmail.trim()) {
      setEditError('Email wajib diisi')
      return
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(editEmail)) {
      setEditError('Format email tidak valid')
      return
    }

    try {
      await updateCustomer({
        name: editName.trim(),
        email: editEmail.trim()
      })
      setShowEditModal(false)
      setEditError('')
    } catch (err) {
      setEditError(err.message)
    }
  }

  const handleStatusChange = async (lineId, newStatus) => {
    setStatusUpdateLoading(lineId)
    try {
      await updatePhoneLine(lineId, { status: newStatus })
    } catch (err) {
      console.error('Failed to update status:', err)
    } finally {
      setStatusUpdateLoading(null)
    }
  }

  const handleDeleteLine = async () => {
    if (!deleteLine) return
    
    setDeleteLoading(true)
    try {
      await deletePhoneLine(deleteLine.id)
      setShowDeleteModal(false)
      setDeleteLine(null)
    } catch (err) {
      console.error('Failed to delete phone line:', err)
    } finally {
      setDeleteLoading(false)
    }
  }

  const openEditModal = () => {
    setEditName(customer.name || '')
    setEditEmail(customer.email || '')
    setEditError('')
    setShowEditModal(true)
  }

  const openDeleteModal = (line) => {
    setDeleteLine(line)
    setShowDeleteModal(true)
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

  const statusOptions = [
    { value: 'active', label: 'Aktif' },
    { value: 'inactive', label: 'Tidak Aktif' }
  ]

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
              <Button
                variant="outline"
                size="sm"
                className="mt-4 w-full"
                onClick={openEditModal}
              >
                Ubah Profil
              </Button>
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
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900">{line.phoneNumber}</p>
                        <div className="flex flex-wrap items-center gap-2 mt-1">
                          {statusUpdateLoading === line.id ? (
                            <span className="text-xs text-gray-500">Mengubah...</span>
                          ) : (
                            <Badge variant={line.status === 'active' ? 'success' : 'gray'} size="sm">
                              {line.status === 'active' ? 'Aktif' : 'Tidak Aktif'}
                            </Badge>
                          )}
                          {line.lastPurchaseDate && (
                            <span className="text-xs text-gray-500">
                              Terakhir: {formatDate(line.lastPurchaseDate)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-2">
                      <div className="w-full sm:w-36">
                        <select
                          value={line.status}
                          onChange={(e) => handleStatusChange(line.id, e.target.value)}
                          disabled={statusUpdateLoading === line.id || updateLoading}
                          className="w-full text-sm border-gray-300 rounded-lg focus:ring-primary focus:border-primary px-3 py-2"
                        >
                          {statusOptions.map(option => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate('/catalog')}
                        className="w-full sm:w-auto"
                      >
                        Beli Paket
                      </Button>
                      <button
                        onClick={() => openDeleteModal(line)}
                        className="p-2 text-gray-400 hover:text-error hover:bg-error/10 rounded-lg transition-colors"
                        title="Hapus nomor"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add Phone Line Modal */}
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

      {/* Edit Profile Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false)
          setEditError('')
        }}
        title="Ubah Profil"
        size="sm"
      >
        <div className="space-y-4">
          {editError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-800">
              {editError}
            </div>
          )}
          <FormInput
            label="Nama Lengkap"
            type="text"
            value={editName}
            onChange={(e) => {
              setEditName(e.target.value)
              setEditError('')
            }}
            placeholder="Masukkan nama lengkap"
            required
          />
          <FormInput
            label="Email"
            type="email"
            value={editEmail}
            onChange={(e) => {
              setEditEmail(e.target.value)
              setEditError('')
            }}
            placeholder="Masukkan email"
            required
          />
          <div className="flex space-x-3">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => {
                setShowEditModal(false)
                setEditError('')
              }}
            >
              Batal
            </Button>
            <Button
              variant="primary"
              className="flex-1"
              onClick={handleEditProfile}
              loading={updateLoading}
            >
              Simpan
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false)
          setDeleteLine(null)
        }}
        title="Hapus Nomor Telepon"
        size="sm"
      >
        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-10 h-10 bg-error/10 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-error" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div>
              <p className="font-medium text-gray-900">Apakah Anda yakin?</p>
              <p className="text-sm text-gray-500 mt-1">
                Nomor telepon <strong>{deleteLine?.phoneNumber}</strong> akan dihapus永久. Tindakan ini tidak dapat dibatalkan.
              </p>
            </div>
          </div>
          
          <div className="flex space-x-3 pt-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => {
                setShowDeleteModal(false)
                setDeleteLine(null)
              }}
            >
              Batal
            </Button>
            <Button
              variant="primary"
              className="flex-1 bg-error hover:bg-error-dark focus:ring-error"
              onClick={handleDeleteLine}
              loading={deleteLoading}
            >
              Hapus
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default AccountPage
