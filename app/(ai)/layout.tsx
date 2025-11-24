'use client'

import { ViewTransition, ReactNode } from 'react'
import { AppSidebar } from '@/components/sidebar/app-sidebar'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { Toaster } from '@/components/ui/sonner'

const OverviewLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div onContextMenu={e => e.preventDefault()}>
      <div>
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset>
            <ViewTransition>{children}</ViewTransition>
          </SidebarInset>
        </SidebarProvider>
        <Toaster richColors />
      </div>
    </div>
  )
}

export default OverviewLayout
