'use client'

import { ReactNode, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { AppSidebar } from '@/components/sidebar/app-sidebar'
import { SidebarInset, SidebarProvider, useSidebar } from '@/components/ui/sidebar'
import { Toaster } from '@/components/ui/sonner'

const SidebarContent = ({ children }: { children: ReactNode }) => {
  const { isMobile, setOpenMobile } = useSidebar()
  const pathname = usePathname()

  useEffect(() => {
    if (isMobile) {
      setOpenMobile(false)
    }
  }, [pathname, isMobile, setOpenMobile])

  return (
    <>
      <AppSidebar />
      <SidebarInset>{children}</SidebarInset>
    </>
  )
}

const OverviewLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div onContextMenu={e => e.preventDefault()}>
      <div>
        <SidebarProvider>
          <SidebarContent>{children}</SidebarContent>
        </SidebarProvider>
        <Toaster richColors />
      </div>
    </div>
  )
}

export default OverviewLayout
