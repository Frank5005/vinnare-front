import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import React from 'react'
import { AuthProvider } from './context/AuthContext'
import { PurchaseProvider } from './context/purchaseContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <PurchaseProvider>
        <App />
      </PurchaseProvider>
    </AuthProvider>
  </StrictMode>,
)
