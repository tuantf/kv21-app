'use client'

import { ReactNode } from 'react'
import { SidebarTrigger } from '../ui/sidebar'
import { Separator } from '../ui/separator'
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbPage } from '../ui/breadcrumb'
import { NavTextLogo } from '../sidebar/nav-text-logo'
import { useSidebar } from '../ui/sidebar'
import { db } from '@/libs/instantdb'

interface HeaderProps {
  title: string
  extraButtons?: ReactNode
  isAdmin?: boolean
}

const Header = ({ title, extraButtons, isAdmin = false }: HeaderProps) => {
  const { isMobile, openMobile, open } = useSidebar()

  return (
    <header className="bg-background/20 sticky top-0 z-50 flex h-16 shrink-0 items-center gap-2 backdrop-blur-md">
      <div className="flex items-center gap-2 px-4">
        <SidebarTrigger className="hover:bg-ring/20 -ml-1" />
        <Separator orientation="vertical" className="bg-ring/80 data-[orientation=vertical]:h-4" />
        {!isAdmin ? (
          <db.SignedIn>
            {extraButtons && (
              <>
                {extraButtons}
                <Separator
                  orientation="vertical"
                  className="bg-ring/80 data-[orientation=vertical]:h-4"
                />
              </>
            )}
          </db.SignedIn>
        ) : (
          <>
            {extraButtons}
            <Separator
              orientation="vertical"
              className="bg-ring/80 data-[orientation=vertical]:h-4"
            />
          </>
        )}
        <Breadcrumb className="ml-1">
          <BreadcrumbList>
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbPage className="font-medium">{title}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className="grow"></div>
      <div
        className={`flex items-center gap-2 px-4 transition-opacity duration-1200 ${
          (isMobile && openMobile) || (!isMobile && open)
            ? 'pointer-events-none opacity-0'
            : 'opacity-100'
        }`}
      >
        <NavTextLogo />
      </div>
    </header>
  )
}

export { Header }
