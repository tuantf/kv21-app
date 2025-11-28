'use client'

import React, { useRef } from 'react'
import SimpleMarquee from '@/components/fancy/blocks/simple-marquee'
import { motion } from 'motion/react'
import { cn } from '@/libs/utils'
import { Inter, IBM_Plex_Serif } from 'next/font/google'
import { ArrowDown } from 'lucide-react'
import { db } from '@/libs/instantdb'
import Link from 'next/link'

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

const exampleImages = [
  '/trainghiem/1.avif',
  '/trainghiem/2.avif',
  '/trainghiem/3.avif',
  '/trainghiem/4.avif',
  '/trainghiem/5.avif',
  '/trainghiem/6.avif',
  '/trainghiem/7.avif',
  '/trainghiem/8.avif',
  '/trainghiem/9.avif',
  '/trainghiem/10.avif',
  '/trainghiem/11.avif',
  '/trainghiem/12.avif',
  '/trainghiem/13.avif',
  '/trainghiem/14.avif',
  '/trainghiem/15.avif',
]

const initial = { opacity: 0, y: 20, filter: 'blur(10px)' }
const animate = { opacity: 1, y: 0, filter: 'blur(0px)' }
const transition = { duration: 0.75 }

const MarqueeItem = ({ children }: { children: React.ReactNode }) => (
  <div className="mx-2 cursor-pointer duration-300 ease-in-out hover:scale-105 sm:mx-3 md:mx-4">
    {children}
  </div>
)

export default function SimpleMarqueeDemo() {
  const firstThird = exampleImages.slice(0, Math.floor(exampleImages.length / 3))
  const secondThird = exampleImages.slice(
    Math.floor(exampleImages.length / 3),
    Math.floor((2 * exampleImages.length) / 3),
  )
  const lastThird = exampleImages.slice(Math.floor((2 * exampleImages.length) / 3))

  const container = useRef<HTMLDivElement>(null)

  return (
    <div
      className="relative flex h-screen w-dvw flex-col items-center justify-center overflow-x-hidden overflow-y-auto bg-white"
      ref={container}
      style={{
        backgroundImage: `radial-gradient(circle, #d1d5db8c 1px, transparent 1px)`,
        backgroundSize: '24px 24px',
      }}
    >
      <db.SignedIn>
        <Link href="/" prefetch={false}>
          <motion.div
            initial={initial}
            animate={animate}
            transition={transition}
            className={cn(
              ibm_plex_serif.className,
              'md:text-md ht absolute top-0 z-10 mt-8 flex items-center justify-center text-center',
            )}
          >
            <img src="/pccc.avif" alt="logo" className="mr-3 h-10" />
            <div>
              <p className="text-xs md:text-sm">PHÒNG CẢNH SÁT PCCC&CNCH</p>
              <p className="text-md leading-tight font-bold tracking-tight md:text-lg">
                ĐỘI CC&CNCH KHU VỰC SỐ 21
              </p>
            </div>
          </motion.div>
        </Link>
      </db.SignedIn>
      <db.SignedOut>
        <motion.div
          initial={initial}
          animate={animate}
          transition={transition}
          className={cn(
            ibm_plex_serif.className,
            'md:text-md ht absolute top-0 z-10 mt-8 flex items-center justify-center text-center text-sm',
          )}
        >
          <img src="/pccc.avif" alt="logo" className="mr-3 h-10" />
          <div>
            <p className="text-xs md:text-sm">PHÒNG CẢNH SÁT PCCC&CNCH</p>
            <p className="text-md leading-tight font-bold tracking-tight md:text-lg">
              ĐỘI CC&CNCH KHU VỰC SỐ 21
            </p>
          </div>
        </motion.div>
      </db.SignedOut>
      <motion.h1
        initial={initial}
        animate={animate}
        transition={transition}
        className={cn(
          inter.className,
          'absolute top-1/6 z-10 px-2 text-center text-3xl leading-tight font-bold tracking-tight sm:text-5xl md:-mt-4 md:text-6xl',
        )}
      >
        Chương trình tuyên truyền, <br /> trải nghiệm, thực hành <br />
        <span className={cn(ibm_plex_serif.className, 'font-medium italic')}>
          <span className="text-signature-orange/80">chữa cháy</span> và{' '}
          <span className="text-signature-blue/80">cứu nạn cứu hộ</span>
        </span>
      </motion.h1>
      <motion.p
        initial={initial}
        animate={animate}
        transition={transition}
        className={cn(
          ibm_plex_serif.className,
          'z-10 -mt-16 max-w-2xl px-2 text-center text-sm italic md:mt-8 md:text-lg',
        )}
      >
        "Chương trình trải nghiệm thực tế mang đến kiến thức, kỹ năng bổ ích về phòng cháy, chữa
        cháy, cứu nạn, cứu hộ cùng nhiều hoạt động thú vị"
      </motion.p>

      <motion.div
        initial={initial}
        animate={animate}
        transition={transition}
        className="absolute top-0 z-0 flex h-[170%] w-full flex-col items-center justify-center space-y-2 sm:h-[200%] sm:space-y-3 md:space-y-4"
        style={{
          maskImage: 'linear-gradient(to right, transparent, black 4%, black 96%, transparent)',
          WebkitMaskImage:
            'linear-gradient(to right, transparent, black 4%, black 96%, transparent)',
        }}
      >
        <SimpleMarquee
          className="w-full"
          baseVelocity={4}
          repeat={4}
          draggable={false}
          scrollSpringConfig={{ damping: 50, stiffness: 400 }}
          slowDownFactor={0.1}
          slowdownOnHover
          slowDownSpringConfig={{ damping: 60, stiffness: 300 }}
          scrollAwareDirection={true}
          scrollContainer={container}
          useScrollVelocity={true}
          direction="left"
        >
          {firstThird.map((src, i) => (
            <MarqueeItem key={i}>
              <img
                src={src}
                alt={`Image ${i + 1}`}
                className="h-27 w-48 rounded-lg object-cover sm:h-36 sm:w-64 md:h-45 md:w-80"
              />
            </MarqueeItem>
          ))}
        </SimpleMarquee>

        <SimpleMarquee
          className="w-full"
          baseVelocity={4}
          repeat={4}
          scrollAwareDirection={true}
          scrollSpringConfig={{ damping: 50, stiffness: 400 }}
          slowdownOnHover
          slowDownFactor={0.1}
          slowDownSpringConfig={{ damping: 60, stiffness: 300 }}
          useScrollVelocity={true}
          scrollContainer={container}
          draggable={false}
          direction="right"
        >
          {secondThird.map((src, i) => (
            <MarqueeItem key={i}>
              <img
                src={src}
                alt={`Image ${i + firstThird.length}`}
                className="h-27 w-48 rounded-lg object-cover sm:h-27 sm:w-48 md:h-45 md:w-80"
              />
            </MarqueeItem>
          ))}
        </SimpleMarquee>

        <SimpleMarquee
          className="w-full"
          baseVelocity={4}
          repeat={4}
          draggable={false}
          scrollSpringConfig={{ damping: 50, stiffness: 400 }}
          slowDownFactor={0.1}
          slowdownOnHover
          slowDownSpringConfig={{ damping: 60, stiffness: 300 }}
          scrollAwareDirection={true}
          scrollContainer={container}
          useScrollVelocity={true}
          direction="left"
        >
          {lastThird.map((src, i) => (
            <MarqueeItem key={i}>
              <img
                src={src}
                alt={`Image ${i + firstThird.length + secondThird.length}`}
                className="h-27 w-48 rounded-lg object-cover sm:h-27 sm:w-48 md:h-45 md:w-80"
              />
            </MarqueeItem>
          ))}
        </SimpleMarquee>
      </motion.div>

      <motion.div
        initial={initial}
        animate={animate}
        transition={{ ...transition, delay: 0.2 }}
        className={cn(
          'absolute top-[120%] z-10 flex h-30 w-full items-center justify-between px-4 md:top-[160%] md:h-40 xl:w-2/5',
          ibm_plex_serif.className,
        )}
      >
        <div className="flex h-full flex-1 flex-col items-start justify-between gap-1.5">
          <div className="group flex items-center gap-2 text-sm font-medium md:text-xl">
            Đăng ký tham gia chương trình
            <ArrowDown className="size-4 transition-transform duration-300 group-hover:translate-x-1 md:translate-y-0.5" />
          </div>
          <p className="text-[10.5px] md:text-sm">
            <span>
              Liên hệ: đồng chí Đại uý Trần Quốc Bình - Cán bộ <br />
              Đội CC&CNCH khu vực số 21
            </span>
          </p>
          <p className="text-[10.5px] md:text-sm">SĐT: 0398.217.095</p>
          <p className="text-[10.5px] md:text-sm">
            <span>
              Địa chỉ: Trụ sở Đội CC&CNCH khu vực số 21 - <br />
              Số 9, đường Đại Thịnh, xã Quang Minh, TP Hà Nội
            </span>
          </p>
        </div>
        <Link href="https://maps.app.goo.gl/hPzAMmZQ6kCj2t9Z9" target="_blank" prefetch={false}>
          <img src="/trainghiem/place.avif" alt="pccc" className="h-26 rounded-lg md:h-40" />
        </Link>
      </motion.div>
    </div>
  )
}
