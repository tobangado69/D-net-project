import { request } from './api'

export const getTransactions = async (customerId) => {
  return request('GET', `/transactions?customerId=${customerId}`)
}

export const createTransaction = async (transactionData) => {
  return request('POST', '/transactions', transactionData)
}

export const getTransactionById = async (transactionId) => {
  return request('GET', `/transactions/${transactionId}`)
}

export default { getTransactions, createTransaction, getTransactionById }
