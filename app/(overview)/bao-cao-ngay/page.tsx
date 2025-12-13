'use client'

import { Spinner } from '@/components/ui/spinner'
import { Button } from '@/components/ui/button'
import { Settings } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'
import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Image from 'next/image'
import { extractUrlFromIframe } from '@/libs/sanitize'
import { Header } from '@/components/header'
import { updateBaoCaoNgaySettings } from '@/app/actions'
import { db } from '@/libs/instantdb'

const query = { baocaongay: {}, links: { $: { where: { name: 'baocaongay' } } } }

export default function Page() {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [urlInput, setUrlInput] = useState('')
  const [urlError, setUrlError] = useState('')

  const { data, isLoading } = db.useQuery(query)

  const iframeUrl = data?.baocaongay[0]?.url || null

  const validateUrl = (url: string): boolean => {
    if (!url.trim()) {
      setUrlError('URL không được để trống')
      return false
    }
    try {
      new URL(url)
      setUrlError('')
      return true
    } catch {
      setUrlError('Định dạng URL không hợp lệ')
      return false
    }
  }

  const handleOpenDialog = () => {
    // TODO: Add permission check here when authentication is implemented
    // Example: if (!user || !user.isAdmin) {
    //   toast.error('Bạn không có quyền chỉnh sửa')
    //   return
    // }
    setUrlInput(iframeUrl || '')
    setUrlError('')
    setDialogOpen(true)
  }

  const handleSave = async () => {
    if (!validateUrl(urlInput)) {
      return
    }

    try {
      toast.loading('Đang lưu URL...')
      const result = await updateBaoCaoNgaySettings(urlInput.trim())

      if (result.success) {
        toast.dismiss()
        toast.success(result.message)
        setDialogOpen(false)
        setUrlInput('')
      } else {
        toast.dismiss()
        toast.error(result.message)
      }
    } catch (error: any) {
      toast.dismiss()
      toast.error(error.message || 'Thêm URL thất bại')
    }
  }

  const SettingsButton = (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleOpenDialog}
      className="hover:bg-ring/20 size-7"
    >
      <Settings className="h-4 w-4" />
    </Button>
  )

  return (
    <>
      <Header title="Báo cáo ngày" extraButtons={SettingsButton} />
      <div className="flex flex-1 flex-col gap-4 p-0 pt-0">
        {isLoading ? (
          <div className="flex h-full items-center justify-center">
            <Spinner className="text-signature-blue/80 size-5" />
          </div>
        ) : iframeUrl ? (
          <div className="h-full w-full border-none dark:brightness-100 dark:hue-rotate-180 dark:invert dark:saturate-100">
            <iframe className="h-full w-full border-none" src={iframeUrl} />
          </div>
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-4 rounded-lg border border-dashed p-8">
            <Image
              src="/logo/forms.svg"
              alt="Google Form"
              className="size-12"
              width={48}
              height={48}
            />
            <div className="text-center">
              <h3 className="text-lg font-semibold">Chưa cài đặt Google Form</h3>
              <p className="text-muted-foreground mt-2 text-sm">
                Hãy nhấn{' '}
                <span
                  onClick={handleOpenDialog}
                  className="hover:text-signature-blue/80 cursor-pointer font-semibold underline"
                >
                  vào đây
                </span>{' '}
                để thêm Google Form
              </p>
              <p className="text-muted-foreground mt-2 text-sm">
                <Link href={data?.links[0]?.url || ''} target="_blank">
                  Hoặc ấn vào đây để báo cáo trực tiếp{' '}
                  <span className="hover:text-signature-blue/80 cursor-pointer font-medium underline">
                    {data?.links[0]?.url}
                  </span>
                </Link>
              </p>
            </div>
          </div>
        )}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Cấu hình Google Form</DialogTitle>
            <DialogDescription>
              Nhập URL của Google Form hoặc trang web bạn muốn hiển thị trong trang báo cáo ngày
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="iframe-url">URL</Label>
              <Input
                id="iframe-url"
                type="url"
                placeholder="https://docs.google.com/forms/..."
                value={urlInput}
                onChange={e => {
                  const extractedUrl = extractUrlFromIframe(e.target.value)
                  setUrlInput(extractedUrl)
                  if (urlError) {
                    setUrlError('')
                  }
                }}
                aria-invalid={!!urlError}
              />
              {urlError && <p className="text-destructive text-sm">{urlError}</p>}
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDialogOpen(false)}
              className="hover:bg-sidebar shadow-none"
            >
              Hủy
            </Button>
            <Button
              onClick={handleSave}
              variant="outline"
              className="border-signature-blue/80 bg-signature-blue/80 hover:bg-signature-blue/90 text-white shadow-none transition-colors hover:text-white"
            >
              Lưu
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
