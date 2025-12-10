'use client'

import { usePathname } from 'next/navigation'
import { ChevronRight, type LucideIcon } from 'lucide-react'
import Link from 'next/link'

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@/components/ui/sidebar'
import { cn } from '@/libs/utils'

function isActiveRoute(href: string, pathname: string): boolean {
  // For root path, use exact match
  if (href === '/') {
    return pathname === '/'
  }
  // For other paths, check if pathname starts with href to support sub-routes
  return pathname.startsWith(href)
}

export function NavMain({
  items,
  label,
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
  label: string
}) {
  const pathname = usePathname()

  return (
    <SidebarGroup>
      <SidebarGroupLabel className="font-semibold">{label}</SidebarGroupLabel>
      <SidebarMenu>
        {items.map(item => {
          const isActive = isActiveRoute(item.href, pathname)
          return (
            <Collapsible key={item.title} asChild defaultOpen={item.isActive}>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip={item.title}>
                  <Link
                    href={item.href}
                    target={item.href.includes('trainghiem') ? '_blank' : undefined}
                    prefetch={false}
                    className={`gap-3 hover:bg-white/80 hover:[&>div]:text-(--signature-blue)/80 ${
                      isActive ? 'bg-white/80 [&>div]:text-(--signature-blue)/80' : ''
                    }`}
                  >
                    <div className="text-foreground flex size-4 items-center justify-center transition-colors">
                      {item.icon && <item.icon />}
                    </div>
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
                {item.items?.length ? (
                  <>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuAction className="data-[state=open]:rotate-90">
                        <ChevronRight />
                        <span className="sr-only">Toggle</span>
                      </SidebarMenuAction>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {item.items?.map(subItem => {
                          const isSubActive = isActiveRoute(subItem.href, pathname)
                          return (
                            <SidebarMenuSubItem key={subItem.title}>
                              <SidebarMenuSubButton asChild>
                                <Link
                                  href={subItem.href}
                                  target={
                                    subItem.href.includes('trainghiem') ? '_blank' : undefined
                                  }
                                  prefetch={false}
                                  className={cn(
                                    'hover:bg-sidebar-hover',
                                    isSubActive ? 'bg-sidebar-hover' : '',
                                  )}
                                >
                                  <span>{subItem.title}</span>
                                </Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          )
                        })}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </>
                ) : null}
              </SidebarMenuItem>
            </Collapsible>
          )
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}
