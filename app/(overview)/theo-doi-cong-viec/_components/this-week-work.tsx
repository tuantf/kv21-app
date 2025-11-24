'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { DataTable, ExtendedColumnDef } from '@/components/ui/data-table'
import { useMemo } from 'react'

const columns: ExtendedColumnDef<Record<string, string>, unknown>[] = [
  {
    accessorKey: 'Nội dung công việc',
    header: 'Nội dung công việc',
    size: 400,
    highlight: true,
  },
  {
    accessorKey: 'Văn bản',
    header: 'Văn bản',
    size: 150,
    align: 'center',
    highlight: true,
  },
  {
    accessorKey: 'Cán bộ thực hiện',
    header: 'Cán bộ thực hiện',
    size: 150,
    align: 'center',
    highlight: true,
  },
  {
    accessorKey: 'Chỉ huy phụ trách',
    header: 'Chỉ huy phụ trách',
    size: 150,
    align: 'center',
    highlight: true,
  },
  {
    accessorKey: 'Thời hạn',
    header: 'Thời hạn',
    size: 120,
    align: 'center',
    highlight: true,
  },
  {
    accessorKey: 'Ghi chú',
    header: 'Ghi chú',
    size: 120,
    align: 'center',
    highlight: true,
  },
]

const ThisWeekWork = ({ data, isLoading }: { data: Record<string, any>[]; isLoading: boolean }) => {
  const weekRange = useMemo(() => {
    const now = new Date()
    const currentDay = now.getDay()
    // Get Monday (day 1) - if today is Sunday (0), go back 6 days, otherwise go back (currentDay - 1) days
    const mondayOffset = currentDay === 0 ? -6 : 1 - currentDay
    const monday = new Date(now)
    monday.setDate(now.getDate() + mondayOffset)

    // Get Sunday (6 days after Monday)
    const sunday = new Date(monday)
    sunday.setDate(monday.getDate() + 6)

    const formatDate = (date: Date) => {
      const day = String(date.getDate()).padStart(2, '0')
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const year = date.getFullYear()
      return `${day}/${month}/${year}`
    }

    return (
      <>
        Từ ngày <span className="font-semibold">{formatDate(monday)}</span> đến ngày{' '}
        <span className="font-semibold">{formatDate(sunday)}</span>
      </>
    )
  }, [])

  return (
    <Card className="h-full w-full flex-1 rounded-lg shadow-none">
      <CardHeader>
        <CardTitle>Công việc tuần này</CardTitle>
        <CardDescription>{weekRange}</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-30 w-full" />
        ) : (
          <div className="h-full w-full rounded-lg border">
            <DataTable columns={columns} data={data} />
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export { ThisWeekWork }
