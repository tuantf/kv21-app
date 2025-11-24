'use client'

import { useEffect, useState, useMemo } from 'react'
import { XAxis, YAxis, CartesianGrid, Bar, ComposedChart, Line } from 'recharts'
import { TrendingUp, TrendingDown } from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { maxChartDataValue as maxValue } from '@/libs/max-chart-data-value'
import { extractYear, filterAndTransformByYear, calculateTotal } from '@/libs/transform-data'

const chartConfig = {} satisfies ChartConfig

const RescueChartBar = ({
  data,
  isLoading,
}: {
  data: Record<string, any>[]
  isLoading: boolean
}) => {
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear())

  // Extract available years from data
  const availableYears = useMemo(() => {
    if (!data || data.length === 0) {
      return []
    }
    const years = new Set<number>()
    data.forEach(item => {
      const year = extractYear(item)
      if (year !== null) {
        years.add(year)
      }
    })
    return Array.from(years).sort((a, b) => a - b) // Sort ascending (oldest first)
  }, [data])

  // Update selected year when available years change
  useEffect(() => {
    if (availableYears.length > 0 && !availableYears.includes(selectedYear)) {
      setSelectedYear(availableYears[0])
    }
  }, [availableYears, selectedYear])

  // Filter and transform data by selected year
  const chartData = useMemo(() => {
    return filterAndTransformByYear(data, selectedYear, ['Nổ', 'CNCH'])
  }, [data, selectedYear])

  // Filter and transform data for previous year
  const prevYearChartData = useMemo(() => {
    return filterAndTransformByYear(data, selectedYear - 1, ['Nổ', 'CNCH'])
  }, [data, selectedYear])

  // Calculate totals
  const totalNo = useMemo(() => calculateTotal(chartData, 'Nổ'), [chartData])
  const totalCNCH = useMemo(() => calculateTotal(chartData, 'CNCH'), [chartData])
  const prevYearTotalNo = useMemo(
    () => calculateTotal(prevYearChartData, 'Nổ'),
    [prevYearChartData],
  )
  const prevYearTotalCNCH = useMemo(
    () => calculateTotal(prevYearChartData, 'CNCH'),
    [prevYearChartData],
  )

  // Calculate differences
  const diffNo = totalNo - prevYearTotalNo
  const diffCNCH = totalCNCH - prevYearTotalCNCH

  const maxDataValue = maxValue(chartData)
  const ticks = Array.from({ length: maxDataValue + 1 }, (_, i) => i)

  return (
    <Card className="bg-card h-full w-full flex-1 gap-4 rounded-lg shadow-none">
      <CardHeader>
        <div className="flex flex-1 items-start justify-center gap-x-2">
          <CardTitle>Số vụ nổ, vụ CNCH</CardTitle>
          <div className="grow"></div>
          <Select
            value={selectedYear.toString()}
            onValueChange={value => setSelectedYear(Number(value))}
          >
            <SelectTrigger className="text-muted-foreground h-2! border-none! px-0 text-sm font-medium shadow-none">
              <SelectValue placeholder="Chọn năm" />
            </SelectTrigger>
            <SelectContent
              onCloseAutoFocus={e => e.preventDefault()}
              tabIndex={undefined}
              className="min-w-24"
            >
              <SelectGroup className="text-muted-foreground text-sm font-medium">
                {availableYears.map(year => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <CardDescription className="flex items-center whitespace-pre">
          Tổng số: <span className="font-bold">{totalNo}</span> vụ nổ,{' '}
          <span className="font-bold">{totalCNCH}</span> vụ CNCH
        </CardDescription>
      </CardHeader>
      <CardContent className="h-full w-full flex-1 items-center justify-center">
        {isLoading ? (
          <Skeleton className="h-full w-full" />
        ) : (
          <ChartContainer config={chartConfig} className="h-full w-full">
            <ComposedChart
              accessibilityLayer
              data={chartData}
              margin={{
                top: 4,
                right: 4,
                left: 0,
                bottom: 2,
              }}
            >
              <CartesianGrid vertical={false} stroke="#e6e6e6" />
              <XAxis
                dataKey="Tháng"
                tickLine={false}
                tickMargin={4}
                axisLine={false}
                fontSize={11}
                tickFormatter={value => value.toString()}
                height={16}
                interval={0}
                includeHidden
              />
              <ChartTooltip
                cursor={{ stroke: '#233d4d', strokeWidth: 1 }}
                content={<ChartTooltipContent />}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tickMargin={4}
                ticks={ticks}
                fontSize={11}
                minTickGap={2}
                domain={[0, maxDataValue]}
                interval={'equidistantPreserveStart'}
                allowDecimals={false}
                width={24}
              />
              <Bar
                dataKey="Nổ"
                stackId="stack"
                fill="#1e88e5"
                name="Nổ"
                radius={[4, 4, 4, 4]}
                fillOpacity={0.8}
                maxBarSize={24}
              />
              <Bar
                dataKey="CNCH"
                stackId="stack"
                fill="#90caf9"
                name="CNCH"
                radius={[4, 4, 4, 4]}
                fillOpacity={0.8}
                maxBarSize={24}
              />
              <Line
                type="basis"
                dataKey="Total"
                stroke="#1e88e566"
                strokeWidth={2}
                dot={false}
                name="Tổng"
              />
            </ComposedChart>
          </ChartContainer>
        )}
      </CardContent>
      <CardFooter className="flex">
        {isLoading ? (
          <Skeleton className="h-4 w-full" />
        ) : (
          <CardDescription className="text-muted-foreground flex items-center text-xs whitespace-pre">
            <span>
              So với <span className="font-semibold">{selectedYear - 1}</span>:{' '}
            </span>
            {prevYearChartData.length === 0 ? (
              <span>không có dữ liệu</span>
            ) : (
              <>
                <span
                  className={`${diffNo > 0 ? 'text-[#ff4800]/80' : diffNo < 0 ? 'text-[#1e88e5]/80' : ''} font-semibold whitespace-pre`}
                >
                  {diffNo > 0 ? 'tăng' : diffNo < 0 ? 'giảm' : 'tăng/giảm'} {Math.abs(diffNo)}{' '}
                </span>
                vụ nổ{' '}
                {diffNo > 0 ? (
                  <TrendingUp className="size-3 translate-y-0.25 text-[#ff4800]/80" />
                ) : diffNo < 0 ? (
                  <TrendingDown className="size-3 translate-y-0.25 text-[#1e88e5]/80" />
                ) : null}
                <span>{' và '}</span>
                <span
                  className={`${diffCNCH > 0 ? 'text-[#ff4800]/80' : diffCNCH < 0 ? 'text-[#1e88e5]/80' : ''} font-semibold whitespace-pre`}
                >
                  {diffCNCH > 0 ? 'tăng' : diffCNCH < 0 ? 'giảm' : 'tăng/giảm'}{' '}
                  {Math.abs(diffCNCH)}{' '}
                </span>
                vụ CNCH{' '}
                {diffCNCH > 0 ? (
                  <TrendingUp className="size-3 translate-y-0.25 text-[#ff4800]/80" />
                ) : diffCNCH < 0 ? (
                  <TrendingDown className="size-3 translate-y-0.25 text-[#1e88e5]/80" />
                ) : null}{' '}
              </>
            )}
          </CardDescription>
        )}
      </CardFooter>
    </Card>
  )
}

export { RescueChartBar }
