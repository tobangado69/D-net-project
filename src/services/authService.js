import { request } from './api'

export const login = async (username, password) => {
  if (username === 'demo' && password === 'demo') {
    const customers = await request('GET', `/customers?id=1`)
    const customer = customers[0]
    if (!customer) {
      throw new Error('Customer not found')
    }
    localStorage.setItem('customerId', customer.id)
    return customer
  } else {
    throw new Error('Invalid credentials. Use username: demo, password: demo')
  }
}

export const logout = async () => {
  localStorage.removeItem('customerId')
}

export default { login, logout }
