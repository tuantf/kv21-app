'use client'

import * as React from 'react'

import { Calendar } from '@/components/ui/calendar'
import { vi } from 'react-day-picker/locale'

export function CalendarTodayWork() {
  const today = new Date()
  const [date, setDate] = React.useState<Date | undefined>(today)

  return (
    <Calendar
      mode="single"
      defaultMonth={date}
      selected={date}
      onSelect={setDate}
      disabled={{
        before: today,
      }}
      classNames={{
        selected: `[&[data-selected=true]_button]:bg-signature-orange/80 [&[data-selected=true]_button]:text-white [&[data-selected=true]_button]:rounded-md`,
      }}
      modifiers={{
        today: today,
      }}
      modifiersClassNames={{
        today: 'bg-signature-blue/80 text-white rounded-md',
      }}
      locale={vi}
      formatters={{
        formatCaption: month => {
          const monthName = month.toLocaleDateString('vi-VN', {
            month: 'numeric',
            year: 'numeric',
          })
          return 'Tháng ' + monthName
        },
        formatWeekdayName: day => {
          const dayOfWeek = day.getDay()
          const weekdayMap = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7']
          return weekdayMap[dayOfWeek]
        },
      }}
      showOutsideDays={false}
      className="rounded-lg border bg-transparent shadow-none"
    />
  )
}
