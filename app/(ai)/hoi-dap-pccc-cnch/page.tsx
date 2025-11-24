'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'motion/react'
import { Header } from '@/components/header'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'

export default function Page() {
  return (
    <div className="bg-background flex min-h-screen flex-col md:h-screen">
      <Header title="Hỏi đáp PCCC&CNCH" />
      <main className="flex flex-1 flex-col gap-4 overflow-auto p-4 pt-0 md:overflow-hidden">
        <motion.section
          initial={{ opacity: 0, y: 15, filter: 'blur(10px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.75, ease: 'easeInOut' }}
          className="min-h-0 flex-none md:flex-1 md:basis-1/2"
        >
          <div className="bg-card flex flex-1 flex-col gap-4 rounded-lg border md:h-full md:flex-row">
            <div className="flex flex-1 flex-col gap-4 p-4">
              <div className="flex items-center gap-4">
                <Image
                  src="/notebooklm.svg"
                  alt="logo"
                  width={40}
                  height={40}
                  className="size-10"
                />
                <div className="items-start">
                  <div className="text-lg font-semibold tracking-tight">
                    Hỏi đáp{' '}
                    <span className="text-signature-orange/80">
                      quy chuẩn, tiêu chuẩn PCCC&CNCH
                    </span>
                  </div>
                  <div className="text-muted-foreground text-sm font-medium">
                    Sử dụng NotebookLM AI
                  </div>
                </div>
              </div>

              <div className="w-full">
                <div className="bg-card hover:ring-ring/20 relative rounded-lg border p-2 transition-all hover:ring-2">
                  <div className="flex items-start gap-3">
                    <div className="text-muted-foreground/80 w-full bg-transparent text-sm outline-none">
                      Nhà xưởng sản xuất hạng C của Công ty A, cao 1 tầng, chiều cao 10m, diện tích
                      10000m2, có 100 người làm việc cần đảm bảo những yêu cầu gì về PCCC ?
                    </div>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <div className="flex"></div>
                    <div className="flex items-center gap-3">
                      <Link
                        href="https://notebooklm.google.com/notebook/8cf64ec5-d412-4919-ada5-7a231f8f4b49"
                        target="_blank"
                      >
                        <Button
                          variant="outline"
                          size="sm"
                          className="bg-signature-orange/80 hover:bg-signature-orange/95 text-white hover:text-white"
                        >
                          Đi đến NotebookLM
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid w-full gap-3">
                <div className="text-muted-foreground text-sm font-medium">
                  Một số câu hỏi tham khảo:
                </div>
                <div className="text-muted-foreground flex items-center gap-2 px-2 text-sm">
                  <ArrowRight className="h-4 w-4" />
                  Nhà xưởng sản xuất, gia công cơ khí, cao 1 tầng, chiều cao 7m, diện tích 12000m2
                  cần phải trang bị bao nhiêu bình chữa cháy ?
                </div>
                <div className="text-muted-foreground flex items-center gap-2 px-2 text-sm">
                  <ArrowRight className="h-4 w-4" />
                  Nhà xưởng sản xuất bao bì carton, diện tích 980m2 có phải trang bị hệ thống chữa
                  cháy tự động không, quy định chi tiết như thế nào ?
                </div>
              </div>
            </div>
            <div className="flex-1">
              <Image
                src="/ai/ai_screen_1.avif"
                alt="logo"
                width={2000}
                height={1000}
                className="h-full w-full object-contain"
              />
            </div>
          </div>
        </motion.section>
        <motion.section
          initial={{ opacity: 0, y: 15, filter: 'blur(10px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.75, ease: 'easeInOut' }}
          className="min-h-0 flex-none md:flex-1 md:basis-1/2"
        >
          <div className="bg-card flex h-full flex-1 flex-col gap-4 rounded-lg border md:flex-row">
            <div className="flex flex-1 flex-col gap-4 p-4">
              <div className="flex items-center gap-4">
                <Image
                  src="/notebooklm.svg"
                  alt="logo"
                  width={40}
                  height={40}
                  className="size-10"
                />
                <div className="items-start">
                  <div className="text-lg font-semibold tracking-tight">
                    Hỏi đáp <span className="text-signature-blue/80">quy trình công tác</span>
                  </div>
                  <div className="text-muted-foreground text-sm font-medium">
                    Sử dụng NotebookLM AI
                  </div>
                </div>
              </div>

              <div className="w-full">
                <div className="bg-card hover:ring-ring/20 relative rounded-lg border p-2 transition-all hover:ring-2">
                  <div className="flex items-start gap-3">
                    <div className="text-muted-foreground/80 w-full bg-transparent text-sm outline-none">
                      Nhiệm vụ của đồng chí cán bộ, chiến sỹ trực thông tin trong ca trực được quy
                      định như thế nào ?
                    </div>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <div className="flex"></div>
                    <div className="flex items-center gap-3">
                      <Link
                        href="https://notebooklm.google.com/notebook/8cf64ec5-d412-4919-ada5-7a231f8f4b49"
                        target="_blank"
                      >
                        <Button
                          variant="outline"
                          size="sm"
                          className="bg-signature-blue/80 hover:bg-signature-blue/95 text-white hover:text-white"
                        >
                          Đi đến NotebookLM
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid w-full gap-3">
                <div className="text-muted-foreground text-sm font-medium">
                  Một số câu hỏi tham khảo:
                </div>
                <div className="text-muted-foreground flex items-center gap-2 px-2 text-sm">
                  <ArrowRight className="h-4 w-4" />
                  Nhiệm vụ của đồng chí chỉ huy trong ca trực được quy định như thế nào ?
                </div>
                <div className="text-muted-foreground flex items-center gap-2 px-2 text-sm">
                  <ArrowRight className="h-4 w-4" />
                  Quy trình xác minh, giải quyết vụ cháy khi có cháy xảy ra ?
                </div>
              </div>
            </div>
            <div className="flex-1">
              <Image
                src="/ai/ai_screen_1.avif"
                alt="logo"
                width={2000}
                height={1000}
                className="h-full w-full object-contain"
              />
            </div>
          </div>
        </motion.section>
      </main>
    </div>
  )
}
