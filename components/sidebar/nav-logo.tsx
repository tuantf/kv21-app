'use client'

import { Droplet } from 'lucide-react'
import { NavTextLogo, NavCustomTextLogo } from './nav-text-logo'

const NavLogo = () => {
  return (
    <div className="flex items-center gap-2">
      <div className="relative size-[28px]">
        <Droplet
          size={28}
          className="absolute inset-0 size-[28px] text-transparent"
          stroke="url(#bubbles-gradient)"
        />
        <svg className="absolute inset-0 size-0" aria-hidden="true">
          <defs>
            <linearGradient id="bubbles-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#1e88e5" />
              <stop offset="100%" stopColor="#64b5f6" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      <NavTextLogo />
    </div>
  )
}

const NavCustomLogo = ({ text }: { text: string }) => {
  return (
    <div className="flex items-center gap-2">
      <div className="relative size-[28px]">
        <Droplet
          size={28}
          className="absolute inset-0 size-[28px] text-transparent"
          stroke="url(#bubbles-gradient)"
        />
        <svg className="absolute inset-0 size-0" aria-hidden="true">
          <defs>
            <linearGradient id="bubbles-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#1e88e5" />
              <stop offset="100%" stopColor="#64b5f6" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      <NavCustomTextLogo text={text} />
    </div>
  )
}

export { NavLogo, NavCustomLogo }
