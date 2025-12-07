'use client'

import { ChevronsUpDown, Info, LogIn, LogOut, UserPen } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'
import { db } from '@/libs/instantdb'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { cleanCookies } from '@/app/actions'

export function NavUser() {
  const { isMobile } = useSidebar()
  const router = useRouter()
  const { user } = db.useAuth()
  const { data } = db.useQuery({ $users: { $: { where: { email: user?.email } } } })
  const userName = data?.$users?.[0]?.name
  const userAvatar = data?.$users?.[0]?.imageURL
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground gap-3"
            >
              <Avatar className="h-8 w-8 rounded-full">
                <AvatarImage src={userAvatar ?? null} alt={user?.email ?? ''} />
                <AvatarFallback className="rounded-lg">21</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 -translate-y-px text-left text-sm leading-tight">
                <span className="truncate font-medium">{userName}</span>
                <span className="truncate text-xs">{user?.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="bg-background w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? 'bottom' : 'top'}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-full">
                  <AvatarImage src={userAvatar ?? null} alt={user?.email ?? ''} />
                  <AvatarFallback className="rounded-full border border-gray-200">
                    21
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{userName}</span>
                  <span className="truncate text-xs">{user?.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <db.SignedOut>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem
                  className="hover:bg-ring/20"
                  onClick={() => router.push('/dang-nhap')}
                >
                  <LogIn />
                  Đăng nhập
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </db.SignedOut>
            <db.SignedIn>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem
                  className="hover:bg-ring/20"
                  onClick={() => router.push('/tai-khoan')}
                >
                  <UserPen />
                  Tài khoản
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="hover:bg-ring/20"
                  onClick={() => router.push('/gioi-thieu')}
                >
                  <Info />
                  Giới thiệu
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="hover:bg-ring/20"
                onClick={() => {
                  db.auth.signOut()
                  cleanCookies()
                  toast.success('Tạm biệt')
                }}
              >
                <LogOut />
                Đăng xuất
              </DropdownMenuItem>
            </db.SignedIn>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
