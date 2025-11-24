import type { Metadata } from 'next'
import { Geist_Mono, Geist } from 'next/font/google'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
  display: 'swap',
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Công ty nước số 21',
  description: 'Công ty nước số 21',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const umamiId = process.env.NEXT_PUBLIC_UMAMI_ID

  return (
    <html lang="en">
      <head>{umamiId && <script defer src="/scripts.js" data-website-id={umamiId} />}</head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>{children}</body>
    </html>
  )
}
