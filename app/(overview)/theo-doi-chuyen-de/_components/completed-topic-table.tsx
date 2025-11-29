'use client'

import { useState, useMemo } from 'react'
import { db } from '@/libs/instantdb'
import { id } from '@instantdb/react'
import {
  SortableDataTable,
  ExtendedColumnDef,
  createDragHandleColumn,
} from '@/components/ui/sortable-data-table'
import { Trash2, Plus, Ellipsis, Pencil, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { sanitizeInput, sanitizeUrl } from '@/libs/sanitize'
import { getProgressColor, getProgressColorClass } from '@/libs/get-progress-color'
import { Skeleton } from '@/components/ui/skeleton'
import { MotionProgress } from '@/components/ui/progress'

type ChuyendeRow = {
  id: string
  created?: string
  name?: string
  doc?: string
  progress?: string
  report?: string
  supervisor?: string
  link?: string
  updated?: string
  order?: number
}

export const CompletedTopicTable = ({
  data,
  isLoading,
}: {
  data: { chuyende?: ChuyendeRow[]; chuyendeketthuc?: ChuyendeRow[] }
  isLoading: boolean
}) => {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [editingRowId, setEditingRowId] = useState<string | null>(null)
  const [deletingRowId, setDeletingRowId] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    name: '',
    doc: '',
    link: '',
    report: '',
    supervisor: '',
  })

  const [errors, setErrors] = useState({
    name: '',
    doc: '',
    link: '',
    report: '',
    supervisor: '',
  })

  const clearForm = () => {
    setFormData({
      name: '',
      doc: '',
      link: '',
      report: '',
      supervisor: '',
    })
    setErrors({
      name: '',
      doc: '',
      link: '',
      report: '',
      supervisor: '',
    })
  }

  const trimSheetsLink = (link: string): string => {
    if (!link) return link
    // Check if it's a Google Sheets link
    if (link.includes('docs.google.com/spreadsheets')) {
      const editIndex = link.indexOf('/edit')
      if (editIndex !== -1) {
        // Trim everything after /edit
        return link.substring(0, editIndex + 5) // +5 to include '/edit'
      }
    }
    return link
  }

  const checkDuplicateLink = (sanitizedLink: string, excludeRowId: string | null): boolean => {
    if (!sanitizedLink || !data) return false

    const chuyendeData = (data.chuyende || []) as ChuyendeRow[]
    const chuyendeketthucData = (data.chuyendeketthuc || []) as ChuyendeRow[]

    // Check in chuyende collection
    const duplicateInChuyende = chuyendeData.some(
      row =>
        row.link &&
        row.id !== excludeRowId &&
        trimSheetsLink(sanitizeUrl(row.link)) === sanitizedLink,
    )

    // Check in chuyendeketthuc collection
    const duplicateInChuyendeketthuc = chuyendeketthucData.some(
      row =>
        row.link &&
        row.id !== excludeRowId &&
        trimSheetsLink(sanitizeUrl(row.link)) === sanitizedLink,
    )

    return duplicateInChuyende || duplicateInChuyendeketthuc
  }

  const validateForm = () => {
    const newErrors = {
      name: '',
      doc: '',
      link: '',
      report: '',
      supervisor: '',
    }

    let hasError = false

    if (!formData.name.trim()) {
      newErrors.name = 'Trường này không được để trống'
      hasError = true
    }

    if (!formData.doc.trim()) {
      newErrors.doc = 'Trường này không được để trống'
      hasError = true
    }

    if (!formData.link.trim()) {
      newErrors.link = 'Trường này không được để trống'
      hasError = true
    } else {
      // Check for duplicate link
      const sanitizedLink = trimSheetsLink(sanitizeUrl(formData.link))
      if (checkDuplicateLink(sanitizedLink, editingRowId)) {
        newErrors.link = 'Liên kết này đã tồn tại'
        hasError = true
      }
    }

    if (!formData.report.trim()) {
      newErrors.report = 'Trường này không được để trống'
      hasError = true
    }

    if (!formData.supervisor.trim()) {
      newErrors.supervisor = 'Trường này không được để trống'
      hasError = true
    }

    setErrors(newErrors)
    return !hasError
  }

  const handleAddRow = async () => {
    // Validate form
    if (!validateForm()) {
      return
    }

    try {
      const now = new Date().toISOString()

      // Sanitize all inputs
      const sanitizedName = sanitizeInput(formData.name)
      const sanitizedDoc = sanitizeInput(formData.doc)
      const sanitizedLink = trimSheetsLink(sanitizeUrl(formData.link))
      const sanitizedReport = sanitizeInput(formData.report)
      const sanitizedSupervisor = sanitizeInput(formData.supervisor)

      // Get max order from existing data
      const chuyendeketthucData = (data.chuyendeketthuc || []) as ChuyendeRow[]
      const maxOrder = chuyendeketthucData.reduce((max, item) => Math.max(max, item.order ?? 0), -1)

      await db.transact(
        db.tx.chuyendeketthuc[id()].update({
          created: now,
          name: sanitizedName,
          doc: sanitizedDoc,
          link: sanitizedLink,
          report: sanitizedReport,
          supervisor: sanitizedSupervisor,
          updated: now,
          order: maxOrder + 1,
        }),
      )

      // Clear form and errors
      clearForm()
      setDialogOpen(false)
    } catch (error) {
      console.error('Error adding row:', error)
    }
  }

  const handleEdit = (row: ChuyendeRow) => {
    setEditingRowId(row.id)
    setFormData({
      name: row.name || '',
      doc: row.doc || '',
      link: row.link || '',
      report: row.report || '',
      supervisor: row.supervisor || '',
    })
    setErrors({
      name: '',
      doc: '',
      link: '',
      report: '',
      supervisor: '',
    })
    setEditDialogOpen(true)
  }

  const handleUpdate = async () => {
    // Validate form
    if (!validateForm()) {
      return
    }

    if (!editingRowId) return

    try {
      const now = new Date().toISOString()

      // Sanitize all inputs
      const sanitizedName = sanitizeInput(formData.name)
      const sanitizedDoc = sanitizeInput(formData.doc)
      const sanitizedLink = trimSheetsLink(sanitizeUrl(formData.link))
      const sanitizedReport = sanitizeInput(formData.report)
      const sanitizedSupervisor = sanitizeInput(formData.supervisor)

      await db.transact(
        db.tx.chuyendeketthuc[editingRowId].update({
          name: sanitizedName,
          doc: sanitizedDoc,
          link: sanitizedLink,
          report: sanitizedReport,
          supervisor: sanitizedSupervisor,
          updated: now,
        }),
      )

      // Clear form and errors
      clearForm()
      setEditingRowId(null)
      setEditDialogOpen(false)
    } catch (error) {
      console.error('Error updating row:', error)
    }
  }

  const handleDelete = (rowId: string) => {
    setDeletingRowId(rowId)
    setDeleteDialogOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!deletingRowId) return

    try {
      await db.transact(db.tx.chuyendeketthuc[deletingRowId].delete())

      setDeleteDialogOpen(false)
      setDeletingRowId(null)
    } catch (error) {
      console.error('Error deleting row:', error)
    }
  }

  const handleMarkAsActive = async (row: ChuyendeRow) => {
    try {
      const now = new Date().toISOString()

      // Get max order from chuyende
      const chuyendeData = (data.chuyende || []) as ChuyendeRow[]
      const maxOrder = chuyendeData.reduce((max, item) => Math.max(max, item.order ?? 0), -1)

      // Create new record in chuyende with same data
      await db.transact(
        db.tx.chuyende[id()].update({
          created: row.created || now,
          name: row.name || '',
          doc: row.doc || '',
          link: row.link || '',
          report: row.report || '',
          supervisor: row.supervisor || '',
          progress: row.progress || '',
          updated: now,
          order: maxOrder + 1,
        }),
      )

      // Delete from chuyendeketthuc
      await db.transact(db.tx.chuyendeketthuc[row.id].delete())
    } catch (error) {
      console.error('Error marking as active:', error)
    }
  }

  const handleReorder = async (reorderedItems: ChuyendeRow[]) => {
    try {
      const updates = reorderedItems.map((item, index) =>
        db.tx.chuyendeketthuc[item.id].update({ order: index }),
      )
      await db.transact(updates)
    } catch (error) {
      console.error('Error reordering:', error)
    }
  }

  // Sort data by order field
  const sortedData = useMemo(() => {
    const chuyendeketthucData = (data.chuyendeketthuc || []) as ChuyendeRow[]
    return [...chuyendeketthucData].sort((a, b) => {
      const orderA = a.order ?? Number.MAX_SAFE_INTEGER
      const orderB = b.order ?? Number.MAX_SAFE_INTEGER
      return orderA - orderB
    })
  }, [data.chuyendeketthuc])

  const createColumns = (): ExtendedColumnDef<ChuyendeRow, unknown>[] => [
    createDragHandleColumn<ChuyendeRow>(),
    {
      accessorKey: 'name',
      header: 'Tên chuyên đề',
      size: 250,
      highlight: true,
      cell: ({ row }) => {
        return row.original.name?.toUpperCase()
      },
    },
    {
      accessorKey: 'doc',
      header: 'Văn bản',
      size: 150,
      highlight: true,
      cell: ({ row }) => {
        return row.original.doc?.toUpperCase()
      },
    },
    {
      accessorKey: 'progress',
      header: 'Tiến độ',
      size: 100,
      align: 'center',
      highlight: false,
      cell: ({ row }) => {
        const progress = Number(row.original.progress)
        const progressString = progress ? progress.toString() + '%' : ''
        const progressColor = getProgressColor(progress, 'backward')
        return progress ? (
          <div className="flex items-center justify-center gap-2">
            <div style={{ '--progress-color': progressColor } as React.CSSProperties}>
              <MotionProgress
                value={progress}
                className="w-10 *:data-[slot=progress-indicator]:bg-(--progress-color)"
              />
            </div>
            <div className={`font-medium ${getProgressColorClass(progress, 'backward')}`}>
              {progressString}
            </div>
          </div>
        ) : null
      },
    },
    {
      accessorKey: 'report',
      header: 'Chế độ báo cáo',
      size: 150,
      align: 'center',
      highlight: true,
    },
    {
      accessorKey: 'supervisor',
      header: 'Cán bộ phụ trách',
      size: 100,
      align: 'center',
      highlight: true,
    },
    {
      accessorKey: 'link',
      header: 'Trang theo dõi',
      size: 100,
      align: 'center',
      highlight: false,
      cell: ({ row }) => {
        const link = row.original.link
        if (!link) {
          return null
        }
        return (
          <div className="m-0 flex items-center justify-center p-0">
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center"
            >
              <img src="/logo/sheets.svg" alt="Google Sheets" className="size-4" />
            </a>
          </div>
        )
      },
    },
    {
      id: 'actions',
      header: '',
      highlight: true,
      cell: ({ row }) => (
        <db.SignedIn>
          <div className="flex items-center justify-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-4 w-4">
                  <Ellipsis className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleEdit(row.original)}>
                  <Pencil className="mr-2 h-4 w-4" />
                  Chỉnh sửa
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleMarkAsActive(row.original)}>
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Đánh dấu đang thực hiện
                </DropdownMenuItem>
                <DropdownMenuItem
                  variant="destructive"
                  onClick={() => handleDelete(row.original.id)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Xóa
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </db.SignedIn>
      ),
      enableSorting: false,
      size: 40,
      align: 'right',
    },
  ]

  const columns = createColumns()

  return (
    <Card className="h-full rounded-lg shadow-none">
      <CardHeader className="flex items-center justify-center">
        <CardTitle>Các chuyên đề đã kết thúc</CardTitle>
        <div className="grow"></div>
        <db.SignedIn>
          <Dialog
            open={dialogOpen}
            onOpenChange={open => {
              setDialogOpen(open)
            }}
          >
            <DialogTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="hover:bg-signature-blue/80 size-7 bg-transparent shadow-none transition-colors"
              >
                <Plus />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Thêm chuyên đề</DialogTitle>
                <DialogDescription>
                  Thêm mới chuyên đề vào bảng theo dõi chuyên đề
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Tên chuyên đề</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={e => {
                      setFormData({ ...formData, name: e.target.value })
                      if (errors.name) {
                        setErrors({ ...errors, name: '' })
                      }
                    }}
                    aria-invalid={!!errors.name}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="doc">Văn bản</Label>
                  <Input
                    id="doc"
                    value={formData.doc}
                    onChange={e => {
                      setFormData({ ...formData, doc: e.target.value })
                      if (errors.doc) {
                        setErrors({ ...errors, doc: '' })
                      }
                    }}
                    aria-invalid={!!errors.doc}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="link">Liên kết</Label>
                  <Input
                    id="link"
                    value={formData.link}
                    onChange={e => {
                      setFormData({ ...formData, link: e.target.value })
                      if (errors.link) {
                        setErrors({ ...errors, link: '' })
                      }
                    }}
                    aria-invalid={!!errors.link}
                  />
                  {errors.link && <p className="text-destructive text-sm">{errors.link}</p>}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="report">Chế độ báo cáo</Label>
                  <Input
                    id="report"
                    value={formData.report}
                    onChange={e => {
                      setFormData({ ...formData, report: e.target.value })
                      if (errors.report) {
                        setErrors({ ...errors, report: '' })
                      }
                    }}
                    aria-invalid={!!errors.report}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="supervisor">Cán bộ phụ trách</Label>
                  <Input
                    id="supervisor"
                    value={formData.supervisor}
                    onChange={e => {
                      setFormData({ ...formData, supervisor: e.target.value })
                      if (errors.supervisor) {
                        setErrors({ ...errors, supervisor: '' })
                      }
                    }}
                    aria-invalid={!!errors.supervisor}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setDialogOpen(false)}
                  className="hover:bg-sidebar shadow-none"
                >
                  Huỷ
                </Button>
                <Button
                  variant="outline"
                  type="submit"
                  onClick={handleAddRow}
                  className="border-signature-blue/80 bg-signature-blue/80 hover:bg-signature-blue/90 text-white shadow-none transition-colors hover:text-white"
                >
                  Thêm chuyên đề
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Chỉnh sửa chuyên đề</DialogTitle>
                <DialogDescription>
                  Cập nhật thông tin chuyên đề trong bảng theo dõi
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-name">Tên chuyên đề</Label>
                  <Input
                    id="edit-name"
                    value={formData.name}
                    onChange={e => {
                      setFormData({ ...formData, name: e.target.value })
                      if (errors.name) {
                        setErrors({ ...errors, name: '' })
                      }
                    }}
                    aria-invalid={!!errors.name}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-doc">Văn bản</Label>
                  <Input
                    id="edit-doc"
                    value={formData.doc}
                    onChange={e => {
                      setFormData({ ...formData, doc: e.target.value })
                      if (errors.doc) {
                        setErrors({ ...errors, doc: '' })
                      }
                    }}
                    aria-invalid={!!errors.doc}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-link">Liên kết</Label>
                  <Input
                    id="edit-link"
                    value={formData.link}
                    onChange={e => {
                      setFormData({ ...formData, link: e.target.value })
                      if (errors.link) {
                        setErrors({ ...errors, link: '' })
                      }
                    }}
                    aria-invalid={!!errors.link}
                  />
                  {errors.link && <p className="text-destructive text-sm">{errors.link}</p>}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-report">Chế độ báo cáo</Label>
                  <Input
                    id="edit-report"
                    value={formData.report}
                    onChange={e => {
                      setFormData({ ...formData, report: e.target.value })
                      if (errors.report) {
                        setErrors({ ...errors, report: '' })
                      }
                    }}
                    aria-invalid={!!errors.report}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-supervisor">Cán bộ phụ trách</Label>
                  <Input
                    id="edit-supervisor"
                    value={formData.supervisor}
                    onChange={e => {
                      setFormData({ ...formData, supervisor: e.target.value })
                      if (errors.supervisor) {
                        setErrors({ ...errors, supervisor: '' })
                      }
                    }}
                    aria-invalid={!!errors.supervisor}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setEditDialogOpen(false)}
                  className="hover:bg-sidebar shadow-none"
                >
                  Huỷ
                </Button>
                <Button
                  variant="outline"
                  type="submit"
                  onClick={handleUpdate}
                  className="border-signature-blue/80 bg-signature-blue/80 hover:bg-signature-blue/90 text-white shadow-none transition-colors hover:text-white"
                >
                  Lưu thay đổi
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </db.SignedIn>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-30 w-full" />
        ) : (
          <div className="h-full w-full overflow-y-auto rounded-lg border">
            <SortableDataTable columns={columns} data={sortedData} onReorder={handleReorder} />
          </div>
        )}
      </CardContent>
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa chuyên đề này không? Hành động này không thể hoàn tác.
              {deletingRowId && (
                <span className="mt-2 block font-medium">
                  {sortedData.find(row => row.id === deletingRowId)?.name?.toUpperCase()}
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Huỷ</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  )
}
