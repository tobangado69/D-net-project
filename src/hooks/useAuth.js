import { useState, useCallback } from 'react'
import { useAuth as useAuthContext } from '../context/AuthContext'

export function useAuth() {
  const { customer, loading, login: contextLogin, logout: contextLogout } = useAuthContext()
  const [error, setError] = useState(null)
  const [loginLoading, setLoginLoading] = useState(false)

  const login = useCallback(async (username, password) => {
    setLoginLoading(true)
    setError(null)
    try {
      const user = await contextLogin(username, password)
      return user
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoginLoading(false)
    }
  }, [contextLogin])

  const logout = useCallback(() => {
    setError(null)
    contextLogout()
  }, [contextLogout])

  return {
    customer,
    loading,
    loginLoading,
    error,
    login,
    logout,
    isAuthenticated: !!customer
  }
}

export default useAuth
