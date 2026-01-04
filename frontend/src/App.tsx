import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './auth/AuthContext'
import LoginPage from './pages/login/LoginPage'
import ProtectedRoute from './auth/ProtectedRoute'
import FeedPage from './pages/feed/FeedPage'
import PublicRoute from './auth/PublicRoute'
import RegisterPage from './pages/register/RegisterPage'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          } />
          <Route path="/register" element={
            <PublicRoute>
              <RegisterPage />
            </PublicRoute>
          } />
          <Route path="/feed" element={
            <ProtectedRoute>
              <FeedPage />
            </ProtectedRoute>
          } />
          <Route path="*" element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
