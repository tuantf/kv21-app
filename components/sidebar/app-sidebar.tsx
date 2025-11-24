'use client'

import * as React from 'react'

import { NavHeader } from './nav-header'
import { NavMain } from './nav-main'
import { NavUser } from './nav-user'
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader } from '@/components/ui/sidebar'
import { route } from '@/libs/route'

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props} className="bg-sidebar p-2">
      <SidebarHeader>
        <NavHeader />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={route.overview} label="Tổng quan" />
        <NavMain items={route.other} label="Công việc khác" />
        <NavMain items={route.ai} label="AI" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={route.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
