import { createContext, useContext, useState, useEffect } from 'react'
import { login, logout as authLogout } from '../services/authService'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [customer, setCustomer] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedCustomerId = localStorage.getItem('customerId')
    if (storedCustomerId) {
      const fetchCustomer = async () => {
        try {
          const customerData = await login('demo', 'demo')
          setCustomer(customerData)
        } catch (error) {
          localStorage.removeItem('customerId')
        } finally {
          setLoading(false)
        }
      }
      fetchCustomer()
    } else {
      setLoading(false)
    }
  }, [])

  const handleLogin = async (username, password) => {
    const customerData = await login(username, password)
    setCustomer(customerData)
    return customerData
  }

  const handleLogout = () => {
    authLogout()
    setCustomer(null)
  }

  return (
    <AuthContext.Provider value={{ customer, loading, login: handleLogin, logout: handleLogout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export default AuthContext
