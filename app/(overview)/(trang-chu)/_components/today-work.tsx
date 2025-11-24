'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CalendarDays } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { DataTable, ExtendedColumnDef } from '@/components/ui/data-table'
import { useMemo } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { CalendarTodayWork } from './calendar'

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

// Move formatter outside component to avoid recreating on each render
const weekdayFormatter = new Intl.DateTimeFormat('vi-VN', {
  weekday: 'long',
})

const TodayWork = ({ data, isLoading }: { data: Record<string, any>[]; isLoading: boolean }) => {
  // Calculate date once per mount to prevent hydration errors and avoid empty state flash
  const todayDate = useMemo(() => {
    const now = new Date()
    const weekdayFormatted = weekdayFormatter.format(now)
    const weekday =
      weekdayFormatted.charAt(0).toUpperCase() + weekdayFormatted.slice(1).toLowerCase()
    const day = String(now.getDate()).padStart(2, '0')
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const year = now.getFullYear()
    return (
      <>
        {weekday}, ngày{' '}
        <span className="font-semibold">
          {day}/{month}/{year}
        </span>
      </>
    )
  }, [])

  return (
    <Card className="flex h-full flex-col rounded-lg shadow-none">
      <CardHeader>
        <div className="flex items-center gap-x-2">
          <CardTitle>Công việc hôm nay</CardTitle>
          <div className="grow"></div>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="hover:bg-ring/20 size-7">
                <CalendarDays className="text-muted-foreground size-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="bg-card/80 w-auto border-none p-0 shadow-none backdrop-blur-sm"
              align="end"
            >
              <CalendarTodayWork />
            </PopoverContent>
          </Popover>
        </div>
        <CardDescription>{todayDate}</CardDescription>
      </CardHeader>
      <CardContent className="min-h-0 flex-1">
        {isLoading ? (
          <Skeleton className="h-full w-full" />
        ) : (
          <div className="h-full w-full overflow-y-auto rounded-lg border">
            <DataTable columns={columns} data={data} />
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export { TodayWork }
