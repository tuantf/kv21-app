// InstantDB Schema Definition
// Simplified 2-collection structure with nested JSON

export const schema = {
  // Lessons for "AI phục vụ công việc" course
  ailessons: {
    id: 'string',
    title: 'string', // Lesson title
    order: 'number', // Display order
    videoUrl: 'string', // YouTube embed URL
    sections: 'json', // Array of section objects with nested listItems
    created: 'number',
    updated: 'number',
  },

  // Lessons for "AI nâng cao" course
  aiadvancedlessons: {
    id: 'string',
    title: 'string', // Lesson title
    order: 'number', // Display order
    videoUrl: 'string', // YouTube embed URL
    sections: 'json', // Array of section objects with nested listItems
    created: 'number',
    updated: 'number',
  },
}

// TypeScript types derived from schema

// Section structure stored as JSON
export type AILessonSection = {
  title: string
  content: string
  contentType: 'paragraph' | 'list' | 'html'
  order: number
  listItems?: string[] // Array of strings for list type sections
}

// Lesson structure
export type AILesson = {
  id: string
  title: string
  order: number
  videoUrl: string
  sections: AILessonSection[]
  created: number
  updated: number
}
