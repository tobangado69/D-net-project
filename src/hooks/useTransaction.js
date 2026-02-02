import { useState, useCallback, useRef } from 'react'
import { useFetch } from './useFetch'
import { useAuth } from '../context/AuthContext'
import { getTransactions, createTransaction, getTransactionById } from '../services/transactionService'

export function useTransaction() {
  const { customer } = useAuth()
  const [createLoading, setCreateLoading] = useState(false)
  const [createError, setCreateError] = useState(null)
  const fetchRef = useRef(null)

  const fetchTransactions = useCallback(async () => {
    if (!customer) return []
    return getTransactions(customer.id)
  }, [customer?.id])

  const { 
    data: transactions, 
    loading: transactionsLoading, 
    error: transactionsError, 
    refetch: refetchTransactions 
  } = useFetch(fetchTransactions, [customer?.id])

  fetchRef.current = refetchTransactions

  const create = useCallback(async (transactionData) => {
    if (!customer) throw new Error('Not authenticated')
    
    setCreateLoading(true)
    setCreateError(null)
    try {
      console.log('Creating transaction with data:', transactionData)
      const transaction = await createTransaction({
        ...transactionData,
        customerId: customer.id,
        status: 'completed',
        purchaseDate: transactionData.purchaseDate || new Date().toISOString()
      })
      console.log('Transaction created:', transaction)
      
      if (fetchRef.current) {
        console.log('Refetching transactions...')
        await fetchRef.current()
        console.log('Transactions refetched successfully')
      }
      
      return transaction
    } catch (err) {
      console.error('Error creating transaction:', err)
      setCreateError(err.message)
      throw err
    } finally {
      setCreateLoading(false)
    }
  }, [customer?.id])

  const getById = useCallback(async (transactionId) => {
    return getTransactionById(transactionId)
  }, [])

  const refetch = useCallback(async () => {
    if (fetchRef.current) {
      await fetchRef.current()
    }
  }, [])

  return {
    transactions: transactions || [],
    loading: transactionsLoading,
    error: transactionsError || createError,
    createLoading,
    createError,
    create,
    getById,
    refetch
  }
}

export default useTransaction
