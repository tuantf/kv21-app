import Link from 'next/link'
import Image from 'next/image'
import { Line1, Line2 } from '@/components/404'
import { MoveLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="h-svh w-full">
      <div className="flex h-full flex-1 items-center justify-center gap-4">
        <div className="relative h-24 w-24 overflow-hidden rounded-lg">
          <Image src="/other/station.avif" alt="404" fill loading="eager" />
        </div>
        <div className="flex flex-col items-start justify-center gap-2">
          <span className="text-3xl leading-none font-bold tracking-wider">404</span>
          <div className="w-60 pt-0.75">
            <Line1 width="100%" />
          </div>
          <Link
            href="/"
            prefetch={false}
            className="hover:text-signature-orange/80 flex items-center justify-center gap-1"
          >
            <div className="w-30">
              <Line2 width="100%" />
            </div>
            <MoveLeft className="size-4 translate-y-0.25" />
          </Link>
        </div>
      </div>
    </div>
  )
}
