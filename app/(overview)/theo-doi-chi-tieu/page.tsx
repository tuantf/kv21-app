'use client'

import { Header } from '@/components/header'
import { motion } from 'motion/react'
import { initial, animate, transition } from '@/libs/motion'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { useState, useRef, useMemo } from 'react'
import { db } from '@/libs/instantdb'
import { syncData } from '@/app/actions'
import { RotateCw } from 'lucide-react'
import { TargetChart } from './_components/target-chart'
import { parseValue } from '@/libs/parse-value'
import { cn } from '@/libs/utils'
import { getProgressColorClass } from '@/libs/get-progress-color'
import { Card, CardTitle, CardDescription } from '@/components/ui/card'
import Image from 'next/image'
import Link from 'next/link'

const query = {
  sheets: {
    $: {
      where: {
        sheetName: 'chitieu',
      },
    },
  },
  links: {
    $: {
      where: {
        name: 'theodoichitieu',
      },
    },
  },
}

const SYNC_COOLDOWN = Number(process.env.NEXT_PUBLIC_SYNC_COOLDOWN || 60000)

const calculateYearProgress = (now: Date, currentYearStart: Date, currentYearEnd: Date): number => {
  const totalDays = (currentYearEnd.getTime() - currentYearStart.getTime()) / (1000 * 60 * 60 * 24)
  const daysPassed = (now.getTime() - currentYearStart.getTime()) / (1000 * 60 * 60 * 24)
  return Math.round((daysPassed / totalDays) * 100)
}

export default function Page() {
  const [isSyncing, setIsSyncing] = useState(false)
  const lastSyncTimeRef = useRef<number | null>(null)

  // Calculate all date-related values once per mount to prevent hydration errors
  const dateValues = useMemo(() => {
    const now = new Date()
    const currentYear = now.getFullYear()
    const newYearStart = new Date(currentYear, 11, 15)
    const newYearEnd = new Date(currentYear + 1, 11, 14)
    const currentYearStart = now < newYearStart ? new Date(currentYear - 1, 11, 15) : newYearStart
    const currentYearEnd = new Date(currentYearStart.getFullYear() + 1, 11, 14)
    const displayYear = now >= newYearStart && now <= newYearEnd ? currentYear + 1 : currentYear
    const yearProgress = calculateYearProgress(now, currentYearStart, currentYearEnd)

    return {
      now,
      currentYear,
      newYearStart,
      newYearEnd,
      currentYearStart,
      currentYearEnd,
      displayYear,
      yearProgress,
    }
  }, [])

  const { data, isLoading, error } = db.useQuery(query)

  if (error) {
    toast.error('Lỗi khi tải dữ liệu, vui lòng tải lại trang')
    console.error('Lỗi khi tải dữ liệu:', error)
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
      const result = await syncData()

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

  // Simplified data transformation: group -> categories array
  const groupedData = useMemo(() => {
    const groups: Record<
      string,
      {
        groupLabel: string
        categories: Array<{ category: string; value: number; note?: string }>
      }
    > = {}

    data?.sheets[0]?.data?.forEach((row: any) => {
      const group = row['Nhóm']
      const groupLabel = row['Nhóm Label'] || group
      const category = row['Danh mục']
      const value = row['Hoàn thành']
      const note = row['Ghi chú']

      // Filter out rows with missing essential data
      if (!group || !category || value == null) return

      const groupKey = String(group)
      if (!groups[groupKey]) {
        groups[groupKey] = {
          groupLabel: String(groupLabel),
          categories: [],
        }
      }
      groups[groupKey].categories.push({
        category: String(category),
        value: parseValue(value),
        note: String(note),
      })
    })

    return groups
  }, [data?.sheets[0]?.data])

  // Convert groupedData to array for rendering
  const groupsArray = useMemo(() => Object.values(groupedData), [groupedData])

  // Order: [0] kiểm tra [1] tuyên truyền [2] huấn luyện [3] phương án [4] khác

  return (
    <>
      <Header title="Theo dõi chi tiêu" extraButtons={SyncButton} />
      <main className="flex flex-1 flex-col gap-4 overflow-auto p-4 pt-0 md:overflow-hidden">
        <motion.section initial={initial} animate={animate} transition={transition}>
          <Card className="flex h-16 items-center justify-between gap-2 rounded-lg px-6 py-0 shadow-none">
            <div className="flex h-full w-full flex-1 items-center justify-between">
              <div className="flex flex-col items-start gap-1.5">
                <CardTitle className="flex items-center gap-1">
                  <span>Năm {dateValues.displayYear} đã qua</span>
                  <span
                    className={cn(
                      'font-semibold',
                      getProgressColorClass(Number(dateValues.yearProgress), 'forward'),
                    )}
                  >
                    {dateValues.yearProgress}%
                  </span>
                </CardTitle>
                <CardDescription>
                  Chỉ tiêu tính đến ngày{' '}
                  <span className="font-semibold">
                    {dateValues.now.toLocaleDateString('vi-VN')}
                  </span>
                </CardDescription>
              </div>
              <Link href={data?.links[0]?.url || ''} prefetch={false} target="_blank">
                <Image
                  src="/logo/sheets.svg"
                  alt="Google Sheets"
                  width={16}
                  height={16}
                  className="size-5"
                />
              </Link>
            </div>
          </Card>
        </motion.section>
        <motion.section
          initial={initial}
          animate={animate}
          transition={transition}
          className="min-h-0 flex-none md:flex-1 md:basis-1/2"
        >
          <div className="flex h-full flex-1 flex-col gap-4 md:flex-row">
            <TargetChart
              label="kiểm tra"
              data={groupsArray[0]?.categories || []}
              isLoading={isLoading}
            />
            <TargetChart
              label="tuyên truyền"
              data={groupsArray[1]?.categories || []}
              isLoading={isLoading}
            />
            <TargetChart
              label="huấn luyện"
              data={groupsArray[2]?.categories || []}
              isLoading={isLoading}
            />
          </div>
        </motion.section>
        <motion.section
          initial={initial}
          animate={animate}
          transition={transition}
          className="min-h-0 flex-none md:flex-1 md:basis-1/2"
        >
          <div className="flex h-full flex-1 flex-col gap-4 md:flex-row">
            <TargetChart
              label="phương án"
              data={groupsArray[3]?.categories || []}
              isLoading={isLoading}
            />
            <TargetChart
              label="khác"
              data={groupsArray[4]?.categories || []}
              isLoading={isLoading}
            />
          </div>
        </motion.section>
      </main>
    </>
  )
}
