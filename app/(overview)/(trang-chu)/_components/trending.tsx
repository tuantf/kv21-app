'use client'

import { TrendingUp, TrendingDown, X } from 'lucide-react'

const Trending = ({ type }: { type: 'up' | 'down' | 'null' }) => {
  return (
    <>
      {type === 'up' ? (
        <>
          <TrendingUp className="text-signature-orange/80 size-3 md:translate-y-0.25" />
          <span> </span>
        </>
      ) : type === 'down' ? (
        <>
          <TrendingDown className="text-signature-blue/80 size-3 md:translate-y-0.25" />
          <span> </span>
        </>
      ) : null}
    </>
  )
}

export { Trending }
