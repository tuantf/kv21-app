'use client'

import { Bubbles, Droplet } from 'lucide-react'
import Typewriter from '../fancy/text/typewriter'

const NavTextLogo = () => {
  return (
    <a href="/">
      <div className="flex items-center justify-center gap-2">
        <div className="grid flex-1 pr-1 text-left text-sm leading-tight">
          <span className="mr-1 truncate font-bold">CÔNG TY NƯỚC</span>
          <div>
            <Typewriter
              text={['SỐ 21', 'KV21', 'MÊ LINH', 'KHU VỰC SỐ 21']}
              speed={90}
              className="bg-linear-to-r from-[#1e88e5] to-[#64b5f6] bg-clip-text font-bold text-pretty text-transparent"
              waitTime={5000}
              deleteSpeed={80}
              cursorChar={'_'}
            />
          </div>
        </div>
      </div>
    </a>
  )
}

export { NavTextLogo }
