'use client'

import { Button } from '@/components/ui/button'
import { cn } from '@/libs/utils'
import { Inter, IBM_Plex_Serif } from 'next/font/google'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'motion/react'
import VerticalCutReveal from '@/components/fancy/text/vertical-cut-reveal'

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
})

const ibm_plex_serif = IBM_Plex_Serif({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
})

const Page = () => {
  return (
    <div className="min-h-min snap-y snap-mandatory overflow-y-scroll scroll-smooth bg-white md:h-screen">
      <section className="flex flex-col items-center justify-center gap-16 p-4 md:h-screen md:snap-center md:flex-row md:p-16">
        <div className="flex h-dvh w-full flex-1 flex-col justify-between gap-4 md:h-full">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link href="/" prefetch={false} className="flex items-center gap-4">
              <div className="h-8 w-8 -translate-y-1">
                <Image src="/pccc.avif" alt="pccc" width={100} height={100} />
              </div>
              <div>
                <div className="text-sm font-semibold">PHÒNG CẢNH SÁT PCCC&CNCH</div>
                <div className="leading-none">ĐỘI CC&CNCH KHU VỰC SỐ 21</div>
              </div>
            </Link>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="aspect-1594/786 w-full"
          >
            <Image
              src="/trainghiem/headline.svg"
              alt="pccc"
              width={1594}
              height={786}
              className="h-auto w-full max-w-full"
            />
          </motion.div>
          <div className={cn('text-md -translate-y-8 italic md:text-lg', ibm_plex_serif.className)}>
            <VerticalCutReveal
              splitBy="words"
              staggerDuration={0.04}
              staggerFrom="first"
              transition={{
                type: 'spring',
                stiffness: 200,
                damping: 21,
              }}
            >
              "Chương trình trải nghiệm thực tế mang đến kiến thức, kỹ năng bổ ích về phòng cháy,
              chữa cháy, cứu nạn, cứu hộ cùng nhiều hoạt động thú vị"
            </VerticalCutReveal>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex gap-4"
          >
            <Button
              variant="outline"
              className="border-signature-blue/80 hover:bg-signature-blue/80 bg-transparent shadow-none transition-colors hover:text-white"
            >
              Đăng ký tham gia
            </Button>
            <Button variant="outline" className="bg-transparent shadow-none">
              Tìm hiểu thêm
            </Button>
          </motion.div>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex h-full w-full flex-1 items-center justify-center gap-4 rounded-xl border"
        >
          Video placeholder
        </motion.div>
      </section>
      <section className="bg-signature-blue/10 flex h-screen snap-center items-center justify-center gap-16 p-16">
        <div className="flex h-full w-full flex-1 items-center justify-center gap-4 border">
          Ben trai
        </div>
        <div className="flex h-full w-full flex-1 items-center justify-center gap-4 border">
          Ben phai
        </div>
      </section>
      <section className="bg-signature-orange/10 flex h-screen snap-center items-center justify-center gap-8 p-8">
        <div className="flex h-full w-full flex-1 items-center justify-center gap-4 border">
          Ben trai
        </div>
        <div className="flex h-full w-full flex-1 items-center justify-center gap-4 border">
          Ben phai
        </div>
      </section>
      <section className="bg-card flex h-screen snap-center items-center justify-center gap-8 p-8">
        <div className="flex h-full w-full flex-1 items-center justify-center gap-4 border">
          Ben trai
        </div>
        <div className="flex h-full w-full flex-1 items-center justify-center gap-4 border">
          Ben phai
        </div>
      </section>
    </div>
  )
}

export default Page
