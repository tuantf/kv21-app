import Image from 'next/image'
import { cn } from '@/libs/utils'

const Background = ({ className }: { className?: string } = {}) => {
  return (
    <div className={cn('absolute h-full w-full', className)}>
      <Image className="blur-2xl" src="/bg.webp" alt="Background" fill />
    </div>
  )
}

export default Background
