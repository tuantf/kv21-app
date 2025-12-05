'use client'

import { motion } from 'motion/react'
import { initial, animate, transition } from '@/libs/motion'
import { Beams } from '@/components/background/beam'
import React, { useState, useRef } from 'react'
import { db } from '@/libs/instantdb'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from '@/components/ui/input-otp'
import { REGEXP_ONLY_DIGITS } from 'input-otp'
import { Card, CardContent } from '@/components/ui/card'
import { NavCustomLogo } from '@/components/sidebar/nav-logo'

export default function LoginPage() {
  const [sentEmail, setSentEmail] = useState('')
  return (
    <div className="relative">
      <Beams className="absolute inset-0" />
      <div className="relative z-10 flex min-h-svh flex-col items-center justify-center gap-6 bg-transparent p-4 md:bg-transparent md:p-8">
        <motion.div initial={initial} animate={animate} transition={transition}>
          <div className="bg-card/50 mb-6 flex w-full max-w-sm flex-col items-center justify-center gap-6 backdrop-blur-sm">
            <Card className="items-center justify-center bg-transparent shadow-none">
              <div className="scale-110">
                <NavCustomLogo text="CÔNG TY NƯỚC" />
              </div>
              <CardContent>
                {!sentEmail ? (
                  <EmailStep onSendEmail={setSentEmail} />
                ) : (
                  <CodeStep sentEmail={sentEmail} />
                )}
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

const EMAIL_STEP_COOLDOWN = Number(process.env.NEXT_PUBLIC_EMAIL_STEP_COOLDOWN || 10000) // Default 10 seconds
const CODE_STEP_COOLDOWN = Number(process.env.NEXT_PUBLIC_CODE_STEP_COOLDOWN || 10000) // Default 10 seconds

function EmailStep({ onSendEmail }: { onSendEmail: (email: string) => void }) {
  const [email, setEmail] = useState('')
  const lastSendTimeRef = useRef<number | null>(null)
  const router = useRouter()
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const now = Date.now()
    // Check rate limit
    if (lastSendTimeRef.current !== null) {
      const timeSinceLastSend = now - lastSendTimeRef.current
      if (timeSinceLastSend < EMAIL_STEP_COOLDOWN) {
        const remainingSeconds = Math.ceil((EMAIL_STEP_COOLDOWN - timeSinceLastSend) / 1000)
        toast.warning(`Vui lòng đợi ${remainingSeconds} giây trước khi thử lại`)
        return
      }
    }

    onSendEmail(email)
    db.auth
      .sendMagicCode({ email })
      .then(() => {
        // Update last send time on success
        lastSendTimeRef.current = Date.now()
      })
      .catch(err => {
        toast.error('Có lỗi xảy ra: ' + err.body?.message)
        onSendEmail('')
      })
  }

  const handleEmailNotExisted = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    toast.error(
      `Người dùng với email ${email} không tồn tại, vui lòng liên hệ người quản lý phần mềm để được hỗ trợ`,
    )
  }

  const { data } = db.useQuery(email ? { $users: { $: { where: { email: email } } } } : null)
  const isEmailExisted = data?.$users?.length && data.$users.length > 0

  return (
    <form
      key="email"
      onSubmit={isEmailExisted ? handleSubmit : handleEmailNotExisted}
      className="flex flex-col items-center gap-6"
    >
      <p className="text-lg font-semibold">Đăng nhập</p>
      <p className="text-muted-foreground text-center text-sm">
        Nhập email vào ô dưới đây, và mã xác thực sẽ được gửi đến email của bạn
      </p>
      <Input
        type="email"
        className="w-full rounded-md border border-gray-300 px-3 py-1"
        placeholder="email@kv21.io.vn"
        required
        value={email}
        onChange={e => setEmail(e.target.value)}
      />
      <Button
        type="submit"
        className="bg-signature-blue/80 hover:bg-signature-blue/90 w-full text-white"
      >
        Gửi mã xác thực 🎉
      </Button>
      <div
        className="text-muted-foreground cursor-pointer text-center text-sm hover:underline"
        onClick={() => router.push('/')}
      >
        Trở về trang chủ
      </div>
    </form>
  )
}

function CodeStep({ sentEmail }: { sentEmail: string }) {
  const router = useRouter()
  const [code, setCode] = useState('')
  const lastSubmitTimeRef = useRef<number | null>(null)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const now = Date.now()
    // Check rate limit
    if (lastSubmitTimeRef.current !== null) {
      const timeSinceLastSubmit = now - lastSubmitTimeRef.current
      if (timeSinceLastSubmit < CODE_STEP_COOLDOWN) {
        const remainingSeconds = Math.ceil((CODE_STEP_COOLDOWN - timeSinceLastSubmit) / 1000)
        toast.warning(`Vui lòng đợi ${remainingSeconds} giây trước khi thử lại`)
        return
      }
    }

    db.auth
      .signInWithMagicCode({ email: sentEmail, code })
      .then(() => {
        // Update last submit time on success
        lastSubmitTimeRef.current = Date.now()
        router.push('/')
      })
      .catch(err => {
        setCode('')
        toast.error('Có lỗi xảy ra: ' + err.body?.message)
      })
  }

  return (
    <form key="code" onSubmit={handleSubmit} className="flex flex-col items-center space-y-6">
      <p className="text-lg font-semibold">Nhập mã xác thực</p>
      <p className="text-muted-foreground text-center text-sm">
        Mã xác thực đã được gửi đến email <strong>{sentEmail}</strong>. Kiểm tra email của bạn và
        nhập mã xác thực vào ô dưới đây.
      </p>
      <InputOTP
        type="text"
        pattern={REGEXP_ONLY_DIGITS}
        required
        value={code}
        onChange={value => setCode(value)}
        maxLength={6}
      >
        <InputOTPGroup>
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
          <InputOTPSlot index={2} />
          <InputOTPSlot index={3} />
          <InputOTPSlot index={4} />
          <InputOTPSlot index={5} />
        </InputOTPGroup>
      </InputOTP>
      <Button
        type="submit"
        className="bg-signature-blue/80 hover:bg-signature-blue/90 w-full text-white"
      >
        Đăng nhập 🎉
      </Button>
      <div
        className="text-muted-foreground cursor-pointer text-center text-sm hover:underline"
        onClick={() => router.push('/')}
      >
        Trở về trang chủ
      </div>
    </form>
  )
}
