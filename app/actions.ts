'use server'

import { syncAll } from '@/libs/sync'
import { init } from '@instantdb/admin'
import { cookies } from 'next/headers'
import { extractUrlFromIframe, sanitizeUrl, sanitizeInput } from '@/libs/sanitize'

function getRequiredEnv(name: string): string {
  const v = process.env[name]
  if (!v) throw new Error(`Missing required env var: ${name}`)
  return v
}

const db = init({
  appId: getRequiredEnv('INSTANTDB_APP_ID'),
  adminToken: getRequiredEnv('INSTANTDB_ADMIN_TOKEN'),
})

async function verifyAdmin() {
  const token = (await cookies()).get('token')?.value
  if (!token) return null
  return await db.auth.verifyToken(token)
}

export async function setAuthTokenCookie(token: string) {
  const cookieStore = await cookies()
  cookieStore.set('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  })
}

export async function cleanCookies() {
  const cookieStore = await cookies()
  cookieStore.delete('token')
  cookieStore.delete('idb-token')
  cookieStore.delete('instantdb-token')
}

export async function syncData() {
  try {
    const user = await verifyAdmin()
    if (!user) {
      return {
        success: false,
        message: 'Not authenticated',
        error: 'UNAUTHORIZED',
      }
    }

    const result = await syncAll()

    // Consider sync successful if at least one component succeeded
    const sheetsSucceeded = result.sheets?.success ?? false
    const chuyendeSucceeded = result.chuyende?.success ?? false
    const anySucceeded = sheetsSucceeded || chuyendeSucceeded

    // Build detailed message
    let message = 'Đồng bộ thành công'
    if (!result.success && anySucceeded) {
      // Partial success
      const failedComponents = []
      if (!sheetsSucceeded) failedComponents.push('sheets')
      if (!chuyendeSucceeded) failedComponents.push('chuyên đề')
      message = `Đồng bộ thành công (Kiểm tra lại: ${failedComponents.join(', ')})`
    } else if (!anySucceeded) {
      message = 'Đồng bộ thất bại'
    }

    return {
      success: anySucceeded,
      message,
    }
  } catch (error: any) {
    console.error('Sync failed with exception:', error)
    return { success: false, message: error.message || 'Đồng bộ thất bại' }
  }
}

export async function updateBaoCaoNgaySettings(iframeUrl: string) {
  try {
    const user = await verifyAdmin()
    if (!user) {
      return {
        success: false,
        message: 'Not authenticated',
        error: 'UNAUTHORIZED',
      }
    }

    if (!iframeUrl || typeof iframeUrl !== 'string') {
      return { success: false, message: 'URL không được để trống' }
    }

    // Extract structure from iframe if present, and sanitize
    const cleanUrl = extractUrlFromIframe(iframeUrl)

    // Validate URL format
    try {
      new URL(cleanUrl)
    } catch {
      return { success: false, message: 'Định dạng URL không hợp lệ' }
    }

    // Query for existing record
    const query = {
      baocaongay: {},
    }
    const existing = await db.query(query)
    const existingRecords = existing?.baocaongay || []
    const now = new Date().toISOString()

    if (existingRecords.length > 0) {
      // Update existing record
      const recordId = existingRecords[0].id
      await db.transact(
        db.tx.baocaongay[recordId].update({
          url: cleanUrl,
          updated: now,
        }),
      )
    } else {
      // Create new record (singleton pattern)
      const singletonId = 'baocaongay-settings-singleton'
      await db.transact(
        db.tx.baocaongay[singletonId].update({
          url: cleanUrl,
          updated: now,
        }),
      )
    }

    return { success: true, message: 'Thêm URL thành công' }
  } catch (error: any) {
    console.error('Error updating bao cao ngay settings:', error)
    return { success: false, message: error.message || 'Có lỗi xảy ra khi thêm URL' }
  }
}

export async function updateHoiDapLinks(
  tcqcUrl: string,
  quytrinhUrl: string,
  tuyenTruyenUrl: string,
  baoCaoUrl: string,
) {
  try {
    const user = await verifyAdmin()
    if (!user) {
      return {
        success: false,
        message: 'Not authenticated',
        error: 'UNAUTHORIZED',
      }
    }

    if (!tcqcUrl || !quytrinhUrl || !tuyenTruyenUrl || !baoCaoUrl) {
      return { success: false, message: 'URL không được để trống' }
    }

    const cleanTcqc = sanitizeUrl(tcqcUrl)
    const cleanQuytrinh = sanitizeUrl(quytrinhUrl)
    const cleanTuyenTruyen = sanitizeUrl(tuyenTruyenUrl)
    const cleanBaoCao = sanitizeUrl(baoCaoUrl)

    const now = new Date().toISOString()

    // Helper to update or create a link record
    const updateLink = async (name: string, url: string) => {
      const query = { hoidap: { $: { where: { name } } } }
      const existing = await db.query(query)
      const records = existing?.hoidap || []

      if (records.length > 0) {
        const recordId = records[0].id
        await db.transact(
          db.tx.hoidap[recordId].update({
            link: url,
            updated: now,
          }),
        )
      } else {
        const id = crypto.randomUUID()
        await db.transact(
          db.tx.hoidap[id].update({
            name,
            link: url,
            updated: now,
          }),
        )
      }
    }

    await Promise.all([
      updateLink('tcqc', cleanTcqc),
      updateLink('quytrinh', cleanQuytrinh),
      updateLink('tuyentruyen', cleanTuyenTruyen),
      updateLink('baocao', cleanBaoCao),
    ])

    return { success: true, message: 'Cập nhật thành công' }
  } catch (error: any) {
    console.error('Error updating:', error)
    return { success: false, message: error.message || 'Có lỗi xảy ra khi cập nhật' }
  }
}

// Lesson Management Actions

type LessonCollection = 'ailessons' | 'aiadvancedlessons'

type LessonData = {
  title: string
  order: number
  videoUrl: string
  sections: Array<{
    title: string
    content: string
    contentType: 'paragraph' | 'list' | 'html'
    order: number
    listItems?: string[]
  }>
}

export async function createLesson(collection: LessonCollection, lessonData: LessonData) {
  try {
    const user = await verifyAdmin()
    if (!user) {
      return {
        success: false,
        message: 'Not authenticated',
        error: 'UNAUTHORIZED',
      }
    }

    if (!lessonData.title || !lessonData.videoUrl) {
      return { success: false, message: 'Tiêu đề và URL video không được để trống' }
    }

    const cleanTitle = sanitizeInput(lessonData.title)
    const cleanVideoUrl = sanitizeUrl(lessonData.videoUrl)

    // Note: We're not deeply sanitizing sections content here to avoid breaking HTML content.
    // Ideally rich text content should be sanitized with a robust HTML sanitizer on input or render.

    const id = crypto.randomUUID()
    const now = Date.now()

    await db.transact(
      db.tx[collection][id].update({
        ...lessonData,
        title: cleanTitle,
        videoUrl: cleanVideoUrl,
        created: now,
        updated: now,
      }),
    )

    return { success: true, message: 'Tạo bài học thành công', lessonId: id }
  } catch (error: any) {
    console.error('Error creating lesson:', error)
    return { success: false, message: error.message || 'Có lỗi xảy ra khi tạo bài học' }
  }
}

export async function updateLesson(
  collection: LessonCollection,
  lessonId: string,
  lessonData: LessonData,
) {
  try {
    const user = await verifyAdmin()
    if (!user) {
      return {
        success: false,
        message: 'Not authenticated',
        error: 'UNAUTHORIZED',
      }
    }

    if (!lessonData.title || !lessonData.videoUrl) {
      return { success: false, message: 'Tiêu đề và URL video không được để trống' }
    }

    const cleanTitle = sanitizeInput(lessonData.title)
    const cleanVideoUrl = sanitizeUrl(lessonData.videoUrl)

    const now = Date.now()

    await db.transact(
      db.tx[collection][lessonId].update({
        ...lessonData,
        title: cleanTitle,
        videoUrl: cleanVideoUrl,
        updated: now,
      }),
    )

    return { success: true, message: 'Cập nhật bài học thành công' }
  } catch (error: any) {
    console.error('Error updating lesson:', error)
    return { success: false, message: error.message || 'Có lỗi xảy ra khi cập nhật bài học' }
  }
}

export async function deleteLesson(collection: LessonCollection, lessonId: string) {
  try {
    const user = await verifyAdmin()
    if (!user) {
      return {
        success: false,
        message: 'Not authenticated',
        error: 'UNAUTHORIZED',
      }
    }

    await db.transact(db.tx[collection][lessonId].delete())

    return { success: true, message: 'Xóa bài học thành công' }
  } catch (error: any) {
    console.error('Error deleting lesson:', error)
    return { success: false, message: error.message || 'Có lỗi xảy ra khi xóa bài học' }
  }
}

export async function reorderLessons(
  collection: LessonCollection,
  lessonId: string,
  direction: 'up' | 'down',
) {
  try {
    const user = await verifyAdmin()
    if (!user) {
      return {
        success: false,
        message: 'Uh oh, you are not authenticated',
        error: 'UNAUTHORIZED',
      }
    }

    // Query all lessons
    const query = { [collection]: {} }
    const result = await db.query(query)
    const lessons = result?.[collection] || []

    // Find current lesson
    const currentLesson = lessons.find((l: any) => l.id === lessonId)
    if (!currentLesson) {
      return { success: false, message: 'Không tìm thấy bài học' }
    }

    // Sort lessons by order
    const sortedLessons = [...lessons].sort((a: any, b: any) => a.order - b.order)
    const currentIndex = sortedLessons.findIndex((l: any) => l.id === lessonId)

    // Find adjacent lesson
    const adjacentIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1
    if (adjacentIndex < 0 || adjacentIndex >= sortedLessons.length) {
      return { success: false, message: 'Không thể di chuyển bài học' }
    }

    const adjacentLesson = sortedLessons[adjacentIndex]
    const now = Date.now()

    // Swap order values
    await db.transact([
      db.tx[collection][currentLesson.id].update({
        order: adjacentLesson.order,
        updated: now,
      }),
      db.tx[collection][adjacentLesson.id].update({
        order: currentLesson.order,
        updated: now,
      }),
    ])

    return { success: true, message: 'Di chuyển bài học thành công' }
  } catch (error: any) {
    console.error('Error reordering lessons:', error)
    return { success: false, message: error.message || 'Có lỗi xảy ra khi di chuyển bài học' }
  }
}

export async function bulkReorderLessons(
  collection: LessonCollection,
  reorderedLessons: Array<{ id: string; order: number }>,
) {
  try {
    // Verify the user token
    const user = await verifyAdmin()
    if (!user) {
      return {
        success: false,
        message: 'Not authenticated',
        error: 'UNAUTHORIZED',
      }
    }

    const now = Date.now()
    const updates = reorderedLessons.map(lesson =>
      db.tx[collection][lesson.id].update({
        order: lesson.order,
        updated: now,
      }),
    )
    await db.transact(updates)

    return { success: true, message: 'Sắp xếp lại bài học thành công' }
  } catch (error: any) {
    console.error('Error bulk reordering lessons:', error)
    return { success: false, message: error.message || 'Có lỗi xảy ra khi sắp xếp lại bài học' }
  }
}
