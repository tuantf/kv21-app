'use client'

import { LoginForm } from '@/components/login/login-form'
import { motion } from 'motion/react'
import { initial, animate, transition } from '@/libs/motion'
import { Beams } from '@/components/background/beam'
import React, { useState } from 'react'
import { db } from '@/libs/instantdb'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [sentEmail, setSentEmail] = useState('')
  return (
    <div className="relative">
      <Beams className="absolute inset-0" />
      <div className="bg-background relative z-10 flex min-h-svh flex-col items-center justify-center gap-6 p-2 md:bg-transparent md:p-8">
        <motion.div
          initial={initial}
          animate={animate}
          transition={transition}
          className="w-full max-w-sm"
        >
          <div className="flex flex-1 items-center justify-center">
            <div>
              {!sentEmail ? (
                <EmailStep onSendEmail={setSentEmail} />
              ) : (
                <CodeStep sentEmail={sentEmail} />
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

function EmailStep({ onSendEmail }: { onSendEmail: (email: string) => void }) {
  const [email, setEmail] = useState('')

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    onSendEmail(email)
    db.auth.sendMagicCode({ email }).catch(err => {
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
      className="flex flex-col items-center space-y-6"
    >
      <h2 className="text-xl font-bold">Đăng nhập</h2>
      <p className="text-center text-gray-700 italic">
        Nhập email vào ô dưới đây, và mã xác thực sẽ được gửi đến email của bạn
      </p>
      <input
        type="email"
        className="w-full rounded-md border border-gray-300 px-3 py-1"
        placeholder="email@kv21.io.vn"
        required
        autoFocus
        value={email}
        onChange={e => setEmail(e.target.value)}
      />
      <button
        type="submit"
        className="bg-signature-blue/80 hover:bg-signature-blue/90 w-full rounded-md px-3 py-1 font-bold text-white shadow-sm hover:text-white"
      >
        Gửi mã xác thực
      </button>
    </form>
  )
}

function CodeStep({ sentEmail }: { sentEmail: string }) {
  const router = useRouter()
  const [code, setCode] = useState('')
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    db.auth
      .signInWithMagicCode({ email: sentEmail, code })
      .then(() => {
        router.push('/')
      })
      .catch(err => {
        setCode('')
        toast.error('Có lỗi xảy ra: ' + err.body?.message)
      })
  }

  return (
    <form key="code" onSubmit={handleSubmit} className="flex flex-col items-center space-y-6">
      <h2 className="text-xl font-bold">Nhập mã xác thực</h2>
      <p className="text-center text-gray-700 italic">
        Mã xác thực đã được gửi đến email <strong>{sentEmail}</strong>. Kiểm tra email của bạn và
        nhập mã xác thực vào ô dưới đây.
      </p>
      <input
        type="text"
        className="w-full rounded-md border border-gray-300 px-3 py-1"
        placeholder="123456"
        required
        autoFocus
        value={code}
        onChange={e => setCode(e.target.value)}
      />
      <button
        type="submit"
        className="bg-signature-blue/80 hover:bg-signature-blue/90 w-full rounded-md px-3 py-1 font-bold text-white shadow-sm hover:text-white"
      >
        Đăng nhập
      </button>
    </form>
  )
}
