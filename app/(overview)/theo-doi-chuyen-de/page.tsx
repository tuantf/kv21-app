'use client'

import { ActiveTopicTable } from './_components/active-topic-table'
import { CompletedTopicTable } from './_components/completed-topic-table'
import { Button } from '@/components/ui/button'
import { RotateCw } from 'lucide-react'
import { toast } from 'sonner'
import { useState, useRef } from 'react'
import { Header } from '@/components/header'
import { motion } from 'motion/react'
import { Sync } from '@/app/actions'
import { db } from '@/libs/instantdb'
import { initial, animate, transition } from '@/libs/motion'

const SYNC_COOLDOWN = Number(process.env.NEXT_PUBLIC_SYNC_COOLDOWN || 30000) // 20 seconds

export default function Page() {
  const [isSyncing, setIsSyncing] = useState(false)
  const lastSyncTimeRef = useRef<number | null>(null)

  const query = { chuyende: {}, chuyendeketthuc: {} }
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
      if (timeSinceLastSync < SYNC_COOLDOWN) {
        const remainingSeconds = Math.ceil((SYNC_COOLDOWN - timeSinceLastSync) / 1000)
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
        await new Promise(resolve => setTimeout(resolve, 500))

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
      <Header title="Theo dõi chuyên đề" extraButtons={SyncButton} />
      <main className="flex flex-col gap-4 p-4 pt-0">
        <motion.div initial={initial} animate={animate} transition={transition}>
          <ActiveTopicTable data={data ?? {}} isLoading={isLoading} />
        </motion.div>
        <motion.div initial={initial} animate={animate} transition={transition}>
          <CompletedTopicTable data={data ?? {}} isLoading={isLoading} />
        </motion.div>
      </main>
    </>
  )
}
