'use client'

import { useState, useMemo } from 'react'
import { Calendar } from '@/components/ui/calendar'
import { vi } from 'react-day-picker/locale'
import { SidebarGroup, SidebarGroupContent } from '../ui/sidebar'

export function CalendarTodayWork() {
  const today = new Date()
  const [date, setDate] = useState<Date | undefined>(today)

  const hideDays = useMemo(() => {
    // Get Monday of this week
    const dayOfWeek = today.getDay() // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1
    const mondayOfThisWeek = new Date(today)
    mondayOfThisWeek.setDate(today.getDate() - daysToMonday)
    mondayOfThisWeek.setHours(0, 0, 0, 0)

    // Get Sunday of next week (13 days after Monday of this week)
    const sundayOfNextWeek = new Date(mondayOfThisWeek)
    sundayOfNextWeek.setDate(mondayOfThisWeek.getDate() + 13)
    sundayOfNextWeek.setHours(23, 59, 59, 999)

    return {
      before: mondayOfThisWeek,
      after: sundayOfNextWeek,
    }
  }, [today])

  return (
    <SidebarGroup className="px-2">
      <SidebarGroupContent>
        <Calendar
          mode="single"
          defaultMonth={date}
          numberOfMonths={1}
          pagedNavigation={false}
          onSelect={setDate}
          disabled={{
            before: today,
          }}
          classNames={{
            selected: `[&[data-selected=true]_button]:bg-signature-orange/80 [&[data-selected=true]_button]:text-white [&[data-selected=true]_button]:rounded-md`,
            button_previous: 'hidden',
            button_next: 'hidden',
            month: 'flex flex-col w-full',
            month_caption: 'flex w-full px-2 h-8 items-center',
            caption_label: 'text-xs font-semibold text-sidebar-foreground/70',
            week: 'flex w-full mt-1',
            weekdays: 'flex w-full mb-0.5 mt-1 h-8 items-center [&>th]:text-foreground',
          }}
          modifiers={{
            today: today,
            hideDays,
          }}
          modifiersClassNames={{
            today: 'bg-signature-blue/80 text-white rounded-md',
            hideDays: 'hidden',
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
          showOutsideDays={true}
          className="border-none bg-transparent p-0 shadow-none"
        />
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
