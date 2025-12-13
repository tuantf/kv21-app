'use client'

import { motion } from 'motion/react'
import { initial, animate, transition } from '@/libs/motion'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'

interface AskProps {
  title: React.ReactNode
  description: string
  sampleQuestion: string
  referenceQuestions: string[]
  buttonText: string
  buttonColorClass: string
  url: string
  imageSrc?: string
  imageAlt?: string
  isReverseLayout?: boolean
  preview?: boolean
}

const Ask = ({
  title,
  description,
  sampleQuestion,
  referenceQuestions,
  buttonText,
  buttonColorClass,
  url,
  imageSrc,
  imageAlt,
  isReverseLayout = false,
  preview = true,
}: AskProps) => {
  return (
    <motion.section
      initial={initial}
      animate={animate}
      transition={transition}
      className="min-h-0 flex-none md:flex-1 md:basis-1/2"
    >
      <div className="bg-card flex h-full flex-1 flex-col gap-4 rounded-lg border md:flex-row">
        <div className="flex flex-1 flex-col gap-4 p-4">
          <div className="flex items-center gap-4">
            <div className="dark:invert">
              <Image src="/logo/notebooklm.svg" alt="NotebookLM Logo" width={40} height={40} />
            </div>
            <div className="items-start">
              <div className="text-lg font-semibold tracking-tight">{title}</div>
              <div className="text-muted-foreground text-sm font-medium">{description}</div>
            </div>
          </div>

          <div className="w-full">
            <div className="bg-card hover:ring-ring/20 relative rounded-lg border p-2 transition-all hover:ring-2">
              <div className="flex items-start gap-3">
                <div className="text-muted-foreground/80 w-full bg-transparent text-sm outline-none">
                  {sampleQuestion}
                </div>
              </div>
              <div className="mt-2 flex items-center justify-between">
                <div className="flex"></div>
                <div className="flex items-center gap-3">
                  {url ? (
                    <Link href={url} target="_blank" prefetch={false}>
                      <Button
                        variant="outline"
                        size="sm"
                        className={`${buttonColorClass} text-white hover:text-white`}
                      >
                        {buttonText}
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      className={`${buttonColorClass} text-white hover:text-white`}
                      disabled
                    >
                      {buttonText}
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="grid w-full gap-3">
            <div className="text-muted-foreground text-sm font-medium">
              Một số câu hỏi tham khảo:
            </div>
            {referenceQuestions.map((q, index) => (
              <div
                key={index}
                className="text-muted-foreground flex items-center gap-2 px-2 text-sm"
              >
                <ArrowRight className="h-4 w-4" />
                {q}
              </div>
            ))}
          </div>
        </div>
        {preview && (
          <div className="flex-1">
            <Image
              src={imageSrc || ''}
              alt={imageAlt || ''}
              width={2000}
              height={1000}
              className="h-full w-full object-contain"
            />
          </div>
        )}
      </div>
    </motion.section>
  )
}

export { Ask }
