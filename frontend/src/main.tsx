import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import LoginPage from './pages/LoginPage.tsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import ChatPage from './pages/ChatPage.tsx'
import RegisterPage from './pages/RegisterPage.tsx'
import { AppProvider } from '@/components/context/app.context.tsx'
import ProtectedRoute from '@/components/auth/index.tsx'
import { Toaster } from './components/ui/sonner.tsx'
import { SocketProvider } from './components/context/socket.context.tsx'

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <ChatPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
])


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SocketProvider>
      <AppProvider>
        <RouterProvider router={router} />
        <Toaster />
      </AppProvider>
    </SocketProvider>
  </StrictMode>,
)
