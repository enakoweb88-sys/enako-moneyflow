import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import '@/i18n'
import { MockProvider } from '@/mock/MockContext'
import { ShellLayout } from '@/components/layout/ShellLayout'

const queryClient = new QueryClient()

export const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <MockProvider>
        <BrowserRouter>
          <Routes>
            <Route path="*" element={<ShellLayout />} />
          </Routes>
        </BrowserRouter>
      </MockProvider>
    </QueryClientProvider>
  )
}

export default App
