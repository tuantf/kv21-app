'use client'

import { XAxis, YAxis, CartesianGrid, Bar, BarChart, Cell, LabelList } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import { Skeleton } from '@/components/ui/skeleton'
import { getProgressColor, getProgressColorClass } from '@/libs/get-progress-color'
import { cn } from '@/libs/utils'

const chartConfig = {} satisfies ChartConfig
const ticks = [0, 25, 50, 75, 100]

const TargetChart = ({
  label,
  data,
  isLoading,
  labelAngle,
  textAnchor,
}: {
  label: string
  data: Array<{ category: string; value: number; note?: string }>
  isLoading: boolean
  labelAngle?: number
  textAnchor?: 'start' | 'end' | 'middle'
}) => {
  return (
    <Card className="h-full w-full flex-1 gap-4 rounded-lg py-4 shadow-none">
      <CardHeader>
        <CardTitle>
          Chỉ tiêu{' '}
          <span className="decoration-signature-blue/80 lowercase underline underline-offset-4">
            {label}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 px-4">
        {isLoading ? (
          <Skeleton className="mx-6 h-full" />
        ) : (
          <ChartContainer config={chartConfig} className="h-full min-h-[232px] w-full md:min-h-0">
            <BarChart
              accessibilityLayer
              data={data}
              margin={{
                top: 24,
                right: 4,
                left: 8,
                bottom: 40,
              }}
            >
              <CartesianGrid vertical={false} stroke="var(--chart-stroke)" />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    labelFormatter={value => value}
                    formatter={(value, name, item) => {
                      // Display the note if it exists
                      const note = item.payload.note
                      return (
                        <div className="flex w-full justify-between gap-2">
                          <div className="items-center">
                            <span
                              className={cn(
                                'font-semibold',
                                getProgressColorClass(Number(value), 'backward'),
                              )}
                            >
                              {value}%
                            </span>
                          </div>
                          {note && <div className="text-foreground/80">{note}</div>}
                        </div>
                      )
                    }}
                  />
                }
              />
              <XAxis
                dataKey="category"
                type="category"
                tickLine={false}
                tickMargin={0}
                axisLine={false}
                interval={0}
                height={48}
                angle={labelAngle || -45}
                textAnchor={textAnchor || 'end'}
              />
              <YAxis
                dataKey="value"
                type="number"
                axisLine={false}
                tickLine={false}
                ticks={ticks}
                tickMargin={8}
                fontSize={11}
                width={32}
                interval={0}
                includeHidden
              />
              <Bar dataKey="value" radius={[4, 4, 4, 4]} fillOpacity={0.8} maxBarSize={24}>
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={`${getProgressColor(entry.value, 'backward')}`}
                    className="cursor-pointer"
                  />
                ))}
                <LabelList
                  dataKey="value"
                  position="top"
                  offset={10}
                  formatter={(value: number) => `${value}%`}
                  className="font-mono font-bold"
                />
              </Bar>
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}

export { TargetChart }
