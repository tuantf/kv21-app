'use client'

import { Card, CardTitle } from '@/components/ui/card'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import type { AILessonSection } from '@/libs/lesson-schema'

type LessonViewerProps = {
  title: string
  sections: AILessonSection[]
  videoUrl: string
}

export const LessonViewer = ({ title, sections, videoUrl }: LessonViewerProps) => {
  // Sections are already sorted by order from the hook
  const sortedSections = [...sections].sort((a, b) => a.order - b.order)

  return (
    <Card className="bg-card flex-1 rounded-lg border px-6 shadow-none">
      <CardTitle className="items-center text-lg">{title}</CardTitle>
      <div className="flex h-full flex-1 flex-col gap-6 md:flex-row">
        <div className="flex basis-2/5 flex-col">
          <Accordion type="single" defaultValue="item-1" collapsible className="w-full">
            {sortedSections.map((section, index) => (
              <AccordionItem key={`${section.title}-${index}`} value={`item-${index + 1}`}>
                <AccordionTrigger className="text-md leading-none font-semibold">
                  {section.title}
                </AccordionTrigger>
                <AccordionContent>
                  {section.contentType === 'paragraph' && (
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {section.content}
                    </p>
                  )}
                  {section.contentType === 'list' && section.listItems && (
                    <ul className="text-muted-foreground space-y-2 text-sm leading-relaxed">
                      {section.listItems.map((item, itemIndex) => (
                        <li key={itemIndex} className="flex items-start gap-2">
                          <span className="text-signature-blue/80">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                  {section.contentType === 'html' && (
                    <div
                      className="text-muted-foreground text-sm leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: section.content }}
                    />
                  )}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
        <div className="basis-3/5">
          <iframe
            width="560"
            height="315"
            src={videoUrl}
            title="YouTube video player"
            className="h-full w-full items-center justify-center border-none"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            loading="lazy"
            allowFullScreen
          />
        </div>
      </div>
    </Card>
  )
}
