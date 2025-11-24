import { Droplet } from 'lucide-react'
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '../ui/sidebar'
import { NavTextLogo } from './nav-text-logo'

const NavHeader = () => {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton size="lg" asChild className="hover:bg-transparent">
          <div className="flex items-center gap-2">
            <div className="relative size-[28px]">
              <Droplet
                size={28}
                className="absolute inset-0 size-[28px] text-transparent"
                stroke="url(#bubbles-gradient)"
              />
              <svg className="absolute inset-0 size-0" aria-hidden="true">
                <defs>
                  <linearGradient id="bubbles-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#1e88e5" />
                    <stop offset="100%" stopColor="#64b5f6" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <NavTextLogo />
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}

export { NavHeader }
