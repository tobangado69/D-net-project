import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import FormInput from '../components/ui/FormInput'
import ErrorAlert from '../components/ui/ErrorAlert'
import { useAuth } from '../hooks/useAuth'

export function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState({})
  const { login, loginLoading, error: authError } = useAuth()
  const navigate = useNavigate()

  const validate = () => {
    const newErrors = {}
    if (!username.trim()) {
      newErrors.username = 'Username wajib diisi'
    }
    if (!password) {
      newErrors.password = 'Password wajib diisi'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validate()) return

    try {
      await login(username, password)
      navigate('/catalog')
    } catch (err) {
      setErrors({ submit: err.message })
    }
  }

  const handleDemoLogin = async () => {
    setUsername('demo')
    setPassword('demo')
    
    try {
      await login('demo', 'demo')
      navigate('/catalog')
    } catch (err) {
      setErrors({ submit: err.message })
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">DataPackage</h1>
          <p className="mt-2 text-gray-600">Masuk untuk membeli paket data</p>
        </div>

        <Card className="p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {(errors.submit || authError) && (
              <ErrorAlert message={errors.submit || authError} />
            )}

            <FormInput
              label="Username"
              name="username"
              type="text"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value)
                if (errors.username) setErrors(prev => ({ ...prev, username: null }))
                if (errors.submit) setErrors(prev => ({ ...prev, submit: null }))
              }}
              placeholder="Masukkan username"
              error={errors.username}
              required
              autoComplete="username"
            />

            <FormInput
              label="Password"
              name="password"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                if (errors.password) setErrors(prev => ({ ...prev, password: null }))
                if (errors.submit) setErrors(prev => ({ ...prev, submit: null }))
              }}
              placeholder="Masukkan password"
              error={errors.password}
              required
              autoComplete="current-password"
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              loading={loginLoading}
            >
              Masuk
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">atau</span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              size="lg"
              className="w-full"
              onClick={handleDemoLogin}
              disabled={loginLoading}
            >
              Masuk dengan Demo
            </Button>
          </form>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 text-center">
              <strong>Demo Credentials:</strong><br />
              Username: <code className="bg-gray-100 px-1 rounded">demo</code><br />
              Password: <code className="bg-gray-100 px-1 rounded">demo</code>
            </p>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default LoginPage
