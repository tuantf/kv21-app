'use client'

import { useState, useMemo, useEffect } from 'react'
import Link from 'next/link'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { ChartConfig, ChartContainer } from '@/components/ui/chart'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Cell, LabelList } from 'recharts'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight, SquareArrowOutUpRight } from 'lucide-react'
import { getProgressColor } from '@/libs/get-progress-color'

const chartConfig = {} satisfies ChartConfig

// Calculate fiscal year progress (15/12 previous year to 15/12 current year)
const calculateYearProgress = (now: Date, currentYearStart: Date, currentYearEnd: Date): number => {
  const totalDays = (currentYearEnd.getTime() - currentYearStart.getTime()) / (1000 * 60 * 60 * 24)
  const daysPassed = (now.getTime() - currentYearStart.getTime()) / (1000 * 60 * 60 * 24)
  return Math.round((daysPassed / totalDays) * 100)
}

const TargetChart = ({ data, isLoading }: { data: Record<string, any>[]; isLoading: boolean }) => {
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

  // Helper function handles comma and dot decimal separators
  const parseValue = (value: any): number => {
    if (value == null || value === '') return 0
    const str = String(value).trim()
    if (str === '') return 0

    // Replace comma with dot for decimal parsing
    const normalized = str.replace(',', '.')
    const parsed = parseFloat(normalized)
    return isNaN(parsed) ? 0 : Math.round(parsed)
  }

  // Simplified data transformation: group -> categories array
  const groupedData = useMemo(() => {
    const groups: Record<
      string,
      {
        groupLabel: string
        categories: Array<{ category: string; value: number }>
      }
    > = {}

    data.forEach((row: any) => {
      const group = row['Nhóm']
      const groupLabel = row['Nhóm Label'] || group
      const category = row['Danh mục']
      const value = row['Hoàn thành']

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
      })
    })

    return groups
  }, [data])

  // Convert groupedData to array for navigation
  const groupsArray = useMemo(() => {
    return Object.keys(groupedData).map(groupKey => ({
      groupKey,
      ...groupedData[groupKey],
    }))
  }, [groupedData])

  // Carousel state - track current group index
  const [currentGroupIndex, setCurrentGroupIndex] = useState(0)

  // Update current group index when data loads
  useEffect(() => {
    if (groupsArray.length > 0 && currentGroupIndex >= groupsArray.length) {
      setCurrentGroupIndex(0)
    }
  }, [groupsArray.length, currentGroupIndex])

  // Navigation functions with wrapping
  const goToNext = () => {
    setCurrentGroupIndex(prev => (prev + 1) % groupsArray.length)
  }

  const goToPrevious = () => {
    setCurrentGroupIndex(prev => (prev - 1 + groupsArray.length) % groupsArray.length)
  }

  // Get current group data
  const currentGroup = groupsArray[currentGroupIndex] || null

  // Transform categories to chart-ready format
  const chartData = currentGroup?.categories || []

  const ticks = [0, 25, 50, 75, 100]

  const yearProgressColor = getProgressColor(dateValues.yearProgress, 'forward')

  return (
    <Card className="h-full w-full flex-1 gap-4 rounded-lg shadow-none">
      <CardHeader>
        <div className="flex flex-1 items-start justify-center">
          <CardTitle>Chỉ tiêu công tác</CardTitle>
          <div className="grow"></div>
          <span className="text-muted-foreground text-sm leading-none font-medium">
            {currentGroup?.groupLabel}
          </span>
        </div>
        <CardDescription className="flex gap-1">
          <span>Năm {dateValues.displayYear} đã qua </span>
          <span style={{ color: yearProgressColor, opacity: 0.8 }} className="font-bold">
            {dateValues.yearProgress}%
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 px-0">
        {isLoading ? (
          <Skeleton className="mx-6 h-full" />
        ) : currentGroup ? (
          <div className="flex h-full w-full items-stretch px-2">
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="default"
                onClick={goToPrevious}
                className="h-full w-2"
                aria-label="Previous group"
                disabled={groupsArray.length <= 1}
              >
                <ChevronLeft />
              </Button>
            </div>
            {/* Vertical Bar Chart */}
            <div className="h-full w-full">
              <ChartContainer config={chartConfig} className="h-full w-full">
                <BarChart
                  accessibilityLayer
                  data={chartData}
                  margin={{
                    top: 0,
                    right: 48,
                    left: 4,
                    bottom: 0,
                  }}
                  layout="vertical"
                >
                  <CartesianGrid horizontal={false} stroke="#e6e6e6" />
                  <XAxis
                    type="number"
                    tickLine={false}
                    tickMargin={0}
                    axisLine={false}
                    ticks={ticks}
                    domain={[0, 100]}
                    interval={0}
                    allowDecimals={false}
                    hide
                    height={0}
                  />
                  <YAxis
                    dataKey="category"
                    type="category"
                    axisLine={false}
                    tickLine={false}
                    width={80}
                    interval={0}
                    includeHidden
                  />
                  <Bar dataKey="value" radius={[4, 4, 4, 4]} fillOpacity={0.8} maxBarSize={20}>
                    {chartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={`${getProgressColor(entry.value, 'backward')}`}
                      />
                    ))}
                    <LabelList
                      dataKey="value"
                      position="right"
                      formatter={(value: number) => `${value}%`}
                      className="font-mono font-bold"
                    />
                  </Bar>
                </BarChart>
              </ChartContainer>
            </div>
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="default"
                onClick={goToNext}
                className="h-full w-2"
                aria-label="Next group"
                disabled={groupsArray.length <= 1}
              >
                <ChevronRight />
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-muted-foreground flex h-full items-center justify-center">
            Không có dữ liệu
          </div>
        )}
      </CardContent>
      <CardFooter>
        {isLoading ? (
          <Skeleton className="h-4 w-full" />
        ) : (
          <CardDescription className="group/footer text-muted-foreground items-center text-xs whitespace-pre">
            <Link
              href="/theo-doi-chi-tieu"
              prefetch={false}
              className="flex items-center gap-x-1 hover:underline"
            >
              <span>Theo dõi chỉ tiêu</span>
              <SquareArrowOutUpRight className="group-hover/footer:text-signature-orange/80 size-3 translate-y-0.25" />
            </Link>
          </CardDescription>
        )}
      </CardFooter>
    </Card>
  )
}

export { TargetChart }
