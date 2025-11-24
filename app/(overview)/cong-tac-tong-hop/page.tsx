'use client'

import { Button } from '@/components/ui/button'
import { RotateCw } from 'lucide-react'
import { useState, useRef } from 'react'
import { motion } from 'motion/react'
import { Header } from '@/components/header'
import { ActiveCoordinatorTable } from './_components/active-coordinator-table'
import { CompletedCoordinatorTable } from './_components/completed-coordinator-table'
import { toast } from 'sonner'
import { Sync } from '@/app/actions'
import { db } from '@/libs/instantdb'
import { initial, animate, transition } from '@/libs/motion'

const SYNC_COOLDOWN_MS = Number(process.env.NEXT_PUBLIC_SYNC_COOLDOWN_MS || 30000) // 30 seconds

export default function Page() {
  const [isSyncing, setIsSyncing] = useState(false)
  const lastSyncTimeRef = useRef<number | null>(null)

  const query = { tonghop: {}, tonghopketthuc: {} }
  const { data, isLoading, error } = db.useQuery(query)

  if (error) {
    toast.error('Lỗi khi tải dữ liệu, vui lòng tải lại trang')
    throw new Error('Lỗi khi tải dữ liệu: ' + error.message)
  }
  const handleSync = async () => {
    const now = Date.now()

    // Check rate limit
    if (lastSyncTimeRef.current !== null) {
      const timeSinceLastSync = now - lastSyncTimeRef.current
      if (timeSinceLastSync < SYNC_COOLDOWN_MS) {
        const remainingSeconds = Math.ceil((SYNC_COOLDOWN_MS - timeSinceLastSync) / 1000)
        toast.warning(`Vui lòng đợi ${remainingSeconds} giây trước khi đồng bộ lại`)
        return
      }
    }

    setIsSyncing(true)
    toast.loading('Đang đồng bộ dữ liệu...')

    try {
      const result = await Sync()

      if (result.success) {
        // Wait a moment for the database to be updated
        await new Promise(resolve => setTimeout(resolve, 1000))

        toast.dismiss()
        toast.success(result.message)
        // Update last sync time on success
        lastSyncTimeRef.current = Date.now()
      } else {
        toast.dismiss()
        toast.error(result.message)
      }
    } catch (error) {
      console.error('Failed to sync:', error)
      toast.dismiss()
      toast.error('Đồng bộ thất bại')
    } finally {
      setIsSyncing(false)
    }
  }

  const SyncButton = (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleSync}
      disabled={isSyncing}
      className="hover:bg-ring/20 size-7"
    >
      <RotateCw className={isSyncing ? 'animate-spin' : ''} />
    </Button>
  )

  return (
    <>
      <Header title="Công tác tổng hợp" extraButtons={SyncButton} />
      <main className="flex flex-col gap-4 p-4 pt-0">
        <motion.div initial={initial} animate={animate} transition={transition}>
          <ActiveCoordinatorTable data={data ?? {}} isLoading={isLoading} />
        </motion.div>
        <motion.div initial={initial} animate={animate} transition={transition}>
          <CompletedCoordinatorTable data={data ?? {}} isLoading={isLoading} />
        </motion.div>
      </main>
    </>
  )
}
