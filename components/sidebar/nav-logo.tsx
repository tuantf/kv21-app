'use client'
import Image from 'next/image'
import Typewriter from '../fancy/text/typewriter'

const NavLogo = () => {
  return (
    <a href="/">
      <div className="flex items-center justify-center gap-2">
        <Image src="/water.webp" alt="Logo" width={64} height={64} className="size-8" />
        <div className="grid flex-1 text-left text-sm leading-tight">
          <span className="truncate font-bold">CÔNG TY NƯỚC</span>
          <Typewriter
            text={['SỐ 21', 'KV21', 'MÊ LINH', 'KHU VỰC SỐ 21']}
            speed={90}
            className="bg-linear-to-r from-sky-600 to-cyan-400 bg-clip-text font-bold text-pretty text-transparent"
            waitTime={5000}
            deleteSpeed={80}
            cursorChar={'_'}
          />
        </div>
      </div>
    </a>
  )
}

export { NavLogo }
