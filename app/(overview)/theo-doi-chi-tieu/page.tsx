'use client'

import { Header } from '@/components/header'
import { db } from '@/libs/instantdb'
import { ForceLogin } from '@/components/login/force-login'

export default function Page() {
  return (
    <>
      <Header title="Theo dõi chi tiêu" />
      <div className="flex h-full flex-1 flex-col items-center justify-center gap-4 p-0 pt-0">
        Coming soon...
      </div>
    </>
  )
}
