'use client'

import * as React from 'react'

import { CalendarTodayWork } from './calendar'
import { NavHeader } from './nav-header'
import { NavMain } from './nav-main'
import { NavUserDefault } from './nav-user-default'
import { NavUser } from './nav-user'
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader } from '@/components/ui/sidebar'
import { routes } from '@/routes'
import { NavSecondary } from './nav-secondary'
import { db } from '@/libs/instantdb'

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props} className="bg-sidebar p-2">
      <SidebarHeader>
        <NavHeader />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={routes.overview} label="Tổng quan" />
        <NavMain items={routes.ai} label="AI" />
        <CalendarTodayWork />
      </SidebarContent>
      <SidebarFooter>
        <db.SignedIn>
          <NavSecondary items={routes.helper} />
          <NavUser />
        </db.SignedIn>
        <db.SignedOut>
          <NavUserDefault user={routes.user} />
        </db.SignedOut>
      </SidebarFooter>
    </Sidebar>
  )
}
