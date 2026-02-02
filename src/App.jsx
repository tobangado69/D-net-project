import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Header from './components/domain/Header'
import LoginPage from './pages/LoginPage'
import CatalogPage from './pages/CatalogPage'
import PackageDetailPage from './pages/PackageDetailPage'
import CheckoutPage from './pages/CheckoutPage'
import ConfirmationPage from './pages/ConfirmationPage'
import AccountPage from './pages/AccountPage'
import TransactionHistoryPage from './pages/TransactionHistoryPage'

function ProtectedRoute({ children }) {
  const { customer, loading } = useAuth()
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
      </div>
    )
  }
  
  if (!customer) {
    return <Navigate to="/login" replace />
  }
  
  return children
}

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <div className="min-h-screen flex flex-col">
                <Header />
                <main className="flex-1">
                  <Routes>
                    <Route path="/" element={<Navigate to="/catalog" replace />} />
                    <Route path="/catalog" element={<CatalogPage />} />
                    <Route path="/packages/:id" element={<PackageDetailPage />} />
                    <Route path="/checkout" element={<CheckoutPage />} />
                    <Route path="/confirmation" element={<ConfirmationPage />} />
                    <Route path="/account" element={<AccountPage />} />
                    <Route path="/transactions" element={<TransactionHistoryPage />} />
                  </Routes>
                </main>
              </div>
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  )
}

export default App
