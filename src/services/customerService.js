import { request } from './api'

export const getCustomer = async (customerId) => {
  const customers = await request('GET', `/customers?id=${customerId}`)
  if (!customers || customers.length === 0) {
    throw new Error('Customer not found')
  }
  return customers[0]
}

export const getPhoneLines = async (customerId) => {
  return request('GET', `/phoneLines?customerId=${customerId}`)
}

export const addPhoneLine = async (phoneLineData) => {
  return request('POST', '/phoneLines', phoneLineData)
}

export default { getCustomer, getPhoneLines, addPhoneLine }
