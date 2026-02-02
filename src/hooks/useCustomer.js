import { useState, useCallback } from 'react'
import { useFetch } from './useFetch'
import { useAuth } from '../context/AuthContext'
import { getCustomer, getPhoneLines, addPhoneLine as addPhoneLineService, updateCustomer as updateCustomerService, updatePhoneLine as updatePhoneLineService, deletePhoneLine as deletePhoneLineService } from '../services/customerService'

export function useCustomer() {
  const { customer } = useAuth()
  const [phoneLinesLoading, setPhoneLinesLoading] = useState(false)
  const [updateLoading, setUpdateLoading] = useState(false)
  const [updateError, setUpdateError] = useState(null)

  const { data: customerData, loading: customerLoading, error: customerError, refetch: refetchCustomer } = useFetch(
    () => customer ? getCustomer(customer.id) : Promise.resolve(null),
    [customer?.id]
  )

  const { data: phoneLines, loading: phoneLinesLoadingFetch, error: phoneLinesError, refetch: refetchPhoneLines } = useFetch(
    () => customer ? getPhoneLines(customer.id) : Promise.resolve([]),
    [customer?.id]
  )

  const addPhoneLine = useCallback(async (phoneNumber) => {
    if (!customer) throw new Error('Not authenticated')
    
    setPhoneLinesLoading(true)
    try {
      const newPhoneLine = await addPhoneLineService({
        customerId: customer.id,
        phoneNumber,
        status: 'active',
        lastPurchaseDate: null
      })
      refetchPhoneLines()
      return newPhoneLine
    } finally {
      setPhoneLinesLoading(false)
    }
  }, [customer, refetchPhoneLines])

  const updateCustomer = useCallback(async (data) => {
    if (!customer) throw new Error('Not authenticated')
    
    setUpdateLoading(true)
    setUpdateError(null)
    try {
      const updated = await updateCustomerService(customer.id, data)
      refetchCustomer()
      return updated
    } catch (err) {
      setUpdateError(err.message)
      throw err
    } finally {
      setUpdateLoading(false)
    }
  }, [customer, refetchCustomer])

  const updatePhoneLine = useCallback(async (lineId, data) => {
    if (!customer) throw new Error('Not authenticated')
    
    setPhoneLinesLoading(true)
    try {
      const updated = await updatePhoneLineService(lineId, data)
      refetchPhoneLines()
      return updated
    } finally {
      setPhoneLinesLoading(false)
    }
  }, [customer, refetchPhoneLines])

  const deletePhoneLine = useCallback(async (lineId) => {
    if (!customer) throw new Error('Not authenticated')
    
    setPhoneLinesLoading(true)
    try {
      await deletePhoneLineService(lineId)
      refetchPhoneLines()
    } finally {
      setPhoneLinesLoading(false)
    }
  }, [customer, refetchPhoneLines])

  const refetch = useCallback(() => {
    refetchCustomer()
    refetchPhoneLines()
  }, [refetchCustomer, refetchPhoneLines])

  return {
    customer: customerData,
    phoneLines: phoneLines || [],
    loading: customerLoading || phoneLinesLoadingFetch || phoneLinesLoading,
    error: customerError || phoneLinesError || updateError,
    addPhoneLine,
    updateCustomer,
    updatePhoneLine,
    deletePhoneLine,
    updateLoading,
    refetch
  }
}

export default useCustomer
