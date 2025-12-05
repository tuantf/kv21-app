'use client'

import { db } from '@/libs/instantdb'
import { useMemo } from 'react'
import type { AILesson, AILessonSection } from '@/libs/lesson-schema'

// Course metadata (static, not from database)
const COURSE_METADATA = {
  'ai-phuc-vu-cong-viec': {
    title: 'AI phục vụ công việc',
    collection: 'ailessons' as const,
  },
  'ai-nang-cao': {
    title: 'AI nâng cao',
    collection: 'aiadvancedlessons' as const,
  },
} as const

export type Lesson = AILesson

export type Section = AILessonSection

export type CourseData = {
  course: {
    title: string
  }
  lessons: Lesson[]
}

/**
 * Hook to fetch all lessons for a specific course
 * @param courseSlug - The slug of the course (e.g., "ai-phuc-vu-cong-viec")
 */
export function useCourseLessons(courseSlug: string) {
  // Get the collection name based on course slug
  const courseMeta = COURSE_METADATA[courseSlug as keyof typeof COURSE_METADATA]

  if (!courseMeta) {
    return {
      data: null,
      isLoading: false,
      error: new Error(`Unknown course slug: ${courseSlug}`),
    }
  }

  // Query the specific collection directly
  const { data, isLoading, error } = db.useQuery({
    [courseMeta.collection]: {},
  })

  // Process and organize the data
  const processedData = useMemo(() => {
    if (!data || !data[courseMeta.collection]) {
      return null
    }

    // Get all lessons and sort by order
    const lessons = (data[courseMeta.collection] || []).sort(
      (a: any, b: any) => a.order - b.order,
    ) as Lesson[]

    // Sections are already nested in each lesson, just ensure they're sorted
    const lessonsWithSortedSections = lessons.map(lesson => ({
      ...lesson,
      sections: (lesson.sections || []).sort(
        (a: AILessonSection, b: AILessonSection) => a.order - b.order,
      ),
    }))

    return {
      course: {
        title: courseMeta.title,
      },
      lessons: lessonsWithSortedSections,
    }
  }, [data, courseMeta])

  return {
    data: processedData,
    isLoading,
    error,
  }
}
