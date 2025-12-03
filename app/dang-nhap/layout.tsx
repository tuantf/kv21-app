'use client'

import { ViewTransition, ReactNode } from 'react'
import { Toaster } from '@/components/ui/sonner'

const LoginLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div onContextMenu={e => e.preventDefault()}>
      <div>
        <ViewTransition>{children}</ViewTransition>
        <Toaster richColors />
      </div>
    </div>
  )
}

export default LoginLayout
