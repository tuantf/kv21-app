'use client'

import * as React from 'react'

import { NavHeader } from './nav-header'
import { NavMain } from './nav-main'
import { NavUser } from './nav-user'
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader } from '@/components/ui/sidebar'
import { routes } from '@/routes'

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props} className="bg-sidebar p-2">
      <SidebarHeader>
        <NavHeader />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={routes.overview} label="Tổng quan" />
        <NavMain items={routes.other} label="Công việc khác" />
        <NavMain items={routes.ai} label="AI" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={routes.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
