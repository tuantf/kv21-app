import * as React from 'react'
import { type LucideIcon } from 'lucide-react'

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'

export function NavSecondary({
  items,
  ...props
}: {
  items: {
    title: string
    href: string
    icon?: LucideIcon
    isActive?: boolean
    items?: {
      title: string
      href: string
      isActive?: boolean
    }[]
  }[]
} & React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
  return (
    <SidebarGroup {...props}>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map(item => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild size="sm" className="hover:bg-ring/20">
                <a href={item.href}>
                  <div className="text-foreground/80 flex size-3 items-center justify-center">
                    {item.icon && <item.icon />}
                  </div>
                  <span className="-translate-y-0.25">{item.title}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
