import React from 'react'
import DashboardProvider from './provider'
import { Toaster } from '@/components/ui/sonner'

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <DashboardProvider>
        <div>
        {children}
        <Toaster position='top-right'
        richColors
        />
        </div>
      </DashboardProvider>
    </div>
  )
}

export default DashboardLayout
