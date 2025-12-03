'use client'

import { XAxis, YAxis, CartesianGrid, Bar, BarChart, Cell, LabelList } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartConfig, ChartContainer } from '@/components/ui/chart'
import { Skeleton } from '@/components/ui/skeleton'
import { getProgressColor } from '@/libs/get-progress-color'

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
  data: Array<{ category: string; value: number }>
  isLoading: boolean
  labelAngle?: number
  textAnchor?: 'start' | 'end' | 'middle'
}) => {
  return (
    <Card className="h-full w-full flex-1 gap-4 rounded-lg shadow-none">
      <CardHeader>
        <CardTitle>
          Chỉ tiêu{' '}
          <span className="decoration-signature-blue/80 lowercase underline underline-offset-4">
            {label}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        {isLoading ? (
          <Skeleton className="mx-6 h-full" />
        ) : (
          <ChartContainer config={chartConfig} className="h-full w-full">
            <BarChart
              accessibilityLayer
              data={data}
              margin={{
                top: 24,
                right: 4,
                left: 8,
                bottom: 32,
              }}
            >
              <CartesianGrid vertical={false} stroke="#e6e6e6" />
              <XAxis
                dataKey="category"
                type="category"
                tickLine={false}
                tickMargin={0}
                axisLine={false}
                interval={0}
                height={40}
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
