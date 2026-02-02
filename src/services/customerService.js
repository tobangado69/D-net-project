import { request } from './api'

export const getCustomer = async (customerId) => {
  const customers = await request('GET', `/customers?id=${customerId}`)
  if (!customers || customers.length === 0) {
    throw new Error('Customer not found')
  }
  return customers[0]
}

export const updateCustomer = async (customerId, data) => {
  return request('PATCH', `/customers/${customerId}`, data)
}

export const getPhoneLines = async (customerId) => {
  return request('GET', `/phoneLines?customerId=${customerId}`)
}

export const addPhoneLine = async (phoneLineData) => {
  return request('POST', '/phoneLines', phoneLineData)
}

export const updatePhoneLine = async (phoneLineId, data) => {
  return request('PATCH', `/phoneLines/${phoneLineId}`, data)
}

export const deletePhoneLine = async (phoneLineId) => {
  return request('DELETE', `/phoneLines/${phoneLineId}`)
}

export default { getCustomer, updateCustomer, getPhoneLines, addPhoneLine, updatePhoneLine, deletePhoneLine }
