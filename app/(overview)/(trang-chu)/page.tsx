'use client'

import { TodayWork, TargetChart, RescueChartBar, IncidentChartBar } from './_components'
import { Header } from '@/components/header'
import { Button } from '@/components/ui/button'
import { RotateCw } from 'lucide-react'
import { toast } from 'sonner'
import { useState, useRef } from 'react'
import { motion } from 'motion/react'
import { Sync } from '@/app/actions'
import { db } from '@/libs/instantdb'

const SYNC_COOLDOWN = Number(process.env.NEXT_PUBLIC_SYNC_COOLDOWN || 30000)

export default function Page() {
  const [isSyncing, setIsSyncing] = useState(false)
  const lastSyncTimeRef = useRef<number | null>(null)

  const query = { sheets: {} }
  const { data, isLoading, error } = db.useQuery(query)

  if (error) {
    toast.error('Lỗi khi tải dữ liệu, vui lòng tải lại trang')
    throw new Error('Lỗi khi tải dữ liệu: ' + error.message)
  }

  const handleSync = async () => {
    const now = Date.now()
    // Fetch API to save data from Google Sheets to InstantDB
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
    <div className="flex h-auto flex-col md:h-screen">
      <Header title="Trang chủ" extraButtons={SyncButton} />
      <main className="flex flex-1 flex-col gap-4 overflow-auto p-4 pt-0 md:overflow-hidden">
        <motion.section
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="min-h-0 flex-none md:flex-1 md:basis-2/5"
        >
          <div className="flex h-full flex-1 flex-col gap-4 md:flex-row">
            <div className="min-h-[300px] flex-1 md:min-h-min md:basis-1/3">
              <IncidentChartBar
                data={data?.sheets?.find(sheet => sheet.sheetName === 'chay')?.data ?? []}
                isLoading={isLoading}
              />
            </div>
            <div className="min-h-[300px] flex-1 md:min-h-min md:basis-1/3">
              <RescueChartBar
                data={data?.sheets?.find(sheet => sheet.sheetName === 'cnch')?.data ?? []}
                isLoading={isLoading}
              />
            </div>
            <div className="min-h-[300px] flex-1 md:min-h-min md:basis-1/3">
              <TargetChart
                data={data?.sheets?.find(sheet => sheet.sheetName === 'chitieu')?.data ?? []}
                isLoading={isLoading}
              />
            </div>
          </div>
        </motion.section>
        <motion.section
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex-none md:min-h-0 md:flex-1 md:basis-3/5"
        >
          <TodayWork
            data={data?.sheets?.find(sheet => sheet.sheetName === 'cvhomnay')?.data ?? []}
            isLoading={isLoading}
          />
        </motion.section>
      </main>
    </div>
  )
}
