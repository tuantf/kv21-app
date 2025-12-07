'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
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
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Plus, Trash2, MoveUp, MoveDown, ArrowDown, ArrowUp } from 'lucide-react'
import { toast } from 'sonner'
import { createLesson, updateLesson } from '@/app/actions'
import type { AILesson } from '@/libs/lesson-schema'
import { Spinner } from '@/components/ui/spinner'

type LessonCollection = 'ailessons' | 'aiadvancedlessons'

type Section = {
  title: string
  content: string
  contentType: 'paragraph' | 'list' | 'html'
  order: number
  listItems?: string[]
}

type LessonEditorDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  collection: LessonCollection
  lesson?: AILesson
  existingLessons?: AILesson[]
  onSuccess: () => void
}

export function LessonEditorDialog({
  open,
  onOpenChange,
  collection,
  lesson,
  existingLessons = [],
  onSuccess,
}: LessonEditorDialogProps) {
  const [title, setTitle] = useState('')
  const [videoUrl, setVideoUrl] = useState('')
  const [order, setOrder] = useState('')
  const [sections, setSections] = useState<Section[]>([])
  const [saving, setSaving] = useState(false)

  // Calculate max order from existing lessons for new lesson
  const getMaxOrder = () => {
    if (existingLessons.length === 0) return 0
    return Math.max(...existingLessons.map(l => l.order), -1) + 1
  }

  // Initialize form when lesson changes or dialog opens
  useEffect(() => {
    if (open) {
      if (lesson) {
        setTitle(lesson.title)
        setVideoUrl(lesson.videoUrl)
        setOrder(lesson.order.toString())
        setSections(lesson.sections || [])
      } else {
        setTitle('')
        setVideoUrl('')
        // Auto-set order to max + 1 (last position) for new lessons
        setOrder(getMaxOrder().toString())
        setSections([])
      }
    }
  }, [lesson, open, existingLessons])

  const handleAddSection = () => {
    // Calculate max order from existing sections to avoid race conditions
    const maxOrder = sections.length > 0 ? Math.max(...sections.map(s => s.order), -1) + 1 : 0

    setSections([
      ...sections,
      {
        title: '',
        content: '',
        contentType: 'paragraph',
        order: maxOrder,
        listItems: [],
      },
    ])
  }

  const handleRemoveSection = (index: number) => {
    const newSections = sections.filter((_, i) => i !== index)
    // Re-order sections
    setSections(newSections.map((s, i) => ({ ...s, order: i })))
  }

  const handleMoveSection = (index: number, direction: 'up' | 'down') => {
    const newSections = [...sections]
    const targetIndex = direction === 'up' ? index - 1 : index + 1

    if (targetIndex < 0 || targetIndex >= newSections.length) return // Swap sections
    ;[newSections[index], newSections[targetIndex]] = [newSections[targetIndex], newSections[index]]

    // Update order values
    setSections(newSections.map((s, i) => ({ ...s, order: i })))
  }

  const handleUpdateSection = (index: number, field: keyof Section, value: any) => {
    const newSections = [...sections]
    newSections[index] = { ...newSections[index], [field]: value }

    // If content type changes to list, initialize listItems if needed
    if (field === 'contentType' && value === 'list' && !newSections[index].listItems) {
      newSections[index].listItems = ['']
    }

    setSections(newSections)
  }

  const handleAddListItem = (sectionIndex: number) => {
    const newSections = [...sections]
    newSections[sectionIndex].listItems = [...(newSections[sectionIndex].listItems || []), '']
    setSections(newSections)
  }

  const handleUpdateListItem = (sectionIndex: number, itemIndex: number, value: string) => {
    const newSections = [...sections]
    if (newSections[sectionIndex].listItems) {
      newSections[sectionIndex].listItems![itemIndex] = value
    }
    setSections(newSections)
  }

  const handleRemoveListItem = (sectionIndex: number, itemIndex: number) => {
    const newSections = [...sections]
    newSections[sectionIndex].listItems = newSections[sectionIndex].listItems?.filter(
      (_, i) => i !== itemIndex,
    )
    setSections(newSections)
  }

  const handleSave = async () => {
    // Validation
    if (!title.trim()) {
      toast.error('Vui lòng nhập tiêu đề bài học')
      return
    }
    if (!videoUrl.trim()) {
      toast.error('Vui lòng nhập URL video')
      return
    }
    if (!order || isNaN(parseInt(order)) || parseInt(order) < 0) {
      toast.error('Vui lòng nhập số thứ tự hợp lệ')
      return
    }

    // Validate sections
    for (const section of sections) {
      if (!section.title.trim()) {
        toast.error('Tất cả các phần phải có tiêu đề')
        return
      }
      if (
        section.contentType === 'list' &&
        (!section.listItems || section.listItems.length === 0)
      ) {
        toast.error(`Phần "${section.title}" phải có ít nhất một mục danh sách`)
        return
      }
    }

    setSaving(true)
    try {
      const lessonData = {
        title: title.trim(),
        videoUrl: videoUrl.trim(),
        order: parseInt(order),
        sections: sections.map(s => ({
          ...s,
          title: s.title.trim(),
          content: s.content.trim(),
          listItems:
            s.contentType === 'list' ? s.listItems?.filter(item => item.trim()) : undefined,
        })),
      }

      const result = lesson
        ? await updateLesson(collection, lesson.id, lessonData)
        : await createLesson(collection, lessonData)

      if (result.success) {
        toast.success(result.message)
        onSuccess()
        onOpenChange(false)
      } else {
        toast.error(result.message)
      }
    } catch (error: any) {
      toast.error(error.message || 'Có lỗi xảy ra')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[80vh] flex-col sm:max-w-5xl">
        <DialogHeader>
          <DialogTitle>{lesson ? 'Chỉnh sửa' : 'Thêm mới'}</DialogTitle>
          <DialogDescription>
            {lesson ? 'Cập nhật thông tin bài học' : 'Tạo bài học mới'}
          </DialogDescription>
        </DialogHeader>
        <div className="min-h-0 flex-1 overflow-y-auto">
          <div className="grid flex-1 gap-6 overflow-y-auto py-4">
            {/* Basic Information */}
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Tiêu đề bài học *</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="Nhập tiêu đề bài học"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="videoUrl">URL Video *</Label>
                <Input
                  id="videoUrl"
                  value={videoUrl}
                  onChange={e => setVideoUrl(e.target.value)}
                  placeholder="https://www.youtube.com/embed/..."
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="order">Số thứ tự</Label>
                <Input
                  id="order"
                  type="number"
                  value={order}
                  onChange={e => setOrder(e.target.value)}
                  placeholder="1"
                  min="0"
                  disabled={!!lesson}
                />
              </div>
            </div>

            {/* Sections */}
            <div className="grid gap-4">
              <div className="flex items-center justify-between">
                <Label>Nội dung các phần</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddSection}
                  className="gap-2"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              <div className="grid gap-4">
                {sections.map((section, sectionIndex) => (
                  <div key={sectionIndex} className="rounded-lg border p-4">
                    <div className="mb-4 flex items-center justify-between">
                      <Label className="font-semibold">Phần {sectionIndex + 1}</Label>
                      <div className="flex">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => handleMoveSection(sectionIndex, 'up')}
                          disabled={sectionIndex === 0}
                          className="h-8 w-8"
                        >
                          <ArrowUp className="h-4 w-4" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => handleMoveSection(sectionIndex, 'down')}
                          disabled={sectionIndex === sections.length - 1}
                          className="h-8 w-8"
                        >
                          <ArrowDown className="h-4 w-4" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveSection(sectionIndex)}
                          className="text-destructive hover:text-destructive h-8 w-8"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="grid gap-3">
                      <div className="grid gap-2">
                        <Label htmlFor={`section-title-${sectionIndex}`}>Tiêu đề *</Label>
                        <Input
                          id={`section-title-${sectionIndex}`}
                          value={section.title}
                          onChange={e => handleUpdateSection(sectionIndex, 'title', e.target.value)}
                          placeholder="Nhập Tiêu đề"
                        />
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor={`section-type-${sectionIndex}`}>Loại nội dung</Label>
                        <Select
                          value={section.contentType}
                          onValueChange={value =>
                            handleUpdateSection(sectionIndex, 'contentType', value)
                          }
                        >
                          <SelectTrigger id={`section-type-${sectionIndex}`}>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="paragraph">Đoạn văn</SelectItem>
                            <SelectItem value="list">Danh sách</SelectItem>
                            <SelectItem value="html">HTML</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {section.contentType === 'list' ? (
                        <div className="grid gap-2">
                          <div className="flex items-center justify-between">
                            <Label>Các mục danh sách</Label>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => handleAddListItem(sectionIndex)}
                              className="h-7"
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                          {section.listItems?.map((item, itemIndex) => (
                            <div key={itemIndex} className="flex gap-2">
                              <Input
                                value={item}
                                onChange={e =>
                                  handleUpdateListItem(sectionIndex, itemIndex, e.target.value)
                                }
                                placeholder={`Mục ${itemIndex + 1}`}
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => handleRemoveListItem(sectionIndex, itemIndex)}
                                className="text-destructive hover:text-destructive h-9 w-9 shrink-0"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="grid gap-2">
                          <Label htmlFor={`section-content-${sectionIndex}`}>
                            Nội dung {section.contentType === 'html' && '(HTML)'}
                          </Label>
                          <Textarea
                            id={`section-content-${sectionIndex}`}
                            value={section.content}
                            onChange={e =>
                              handleUpdateSection(sectionIndex, 'content', e.target.value)
                            }
                            placeholder={
                              section.contentType === 'html'
                                ? 'Nhập mã HTML'
                                : 'Nhập nội dung đoạn văn'
                            }
                            rows={4}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {sections.length === 0 && (
                  <div className="text-muted-foreground py-8 text-center text-sm">
                    Chưa có phần nào. Nhấn "Thêm phần" để bắt đầu.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <DialogFooter className="gap-4 md:gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={saving}
            className="hover:bg-sidebar h-8 w-full shadow-none md:w-20"
          >
            Hủy
          </Button>
          <Button
            onClick={handleSave}
            disabled={saving}
            className="bg-signature-blue/80 hover:bg-signature-blue/90 h-8 w-full text-white shadow-none transition-colors hover:text-white md:w-20"
          >
            {saving ? <Spinner /> : 'Lưu'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
