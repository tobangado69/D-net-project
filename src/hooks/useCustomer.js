import { useState, useCallback } from 'react'
import { useFetch } from './useFetch'
import { useAuth } from '../context/AuthContext'
import { getCustomer, getPhoneLines, addPhoneLine as addPhoneLineService } from '../services/customerService'

export function useCustomer() {
  const { customer } = useAuth()
  const [phoneLinesLoading, setPhoneLinesLoading] = useState(false)

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

  const refetch = useCallback(() => {
    refetchCustomer()
    refetchPhoneLines()
  }, [refetchCustomer, refetchPhoneLines])

  return {
    customer: customerData,
    phoneLines: phoneLines || [],
    loading: customerLoading || phoneLinesLoadingFetch || phoneLinesLoading,
    error: customerError || phoneLinesError,
    addPhoneLine,
    refetch
  }
}

export default useCustomer
