'use server'

import { syncAll } from '@/libs/sync'
import { init } from '@instantdb/admin'

function getRequiredEnv(name: string): string {
  const v = process.env[name]
  if (!v) throw new Error(`Missing required env var: ${name}`)
  return v
}

// InstantDB SDK initialization (server)
const db = init({
  appId: getRequiredEnv('INSTANTDB_APP_ID'),
  adminToken: getRequiredEnv('INSTANTDB_ADMIN_TOKEN'),
})

export async function Sync() {
  try {
    const result = await syncAll()
    return {
      success: result.success,
      message: result.success ? 'Đồng bộ thành công' : 'Đồng bộ thất bại',
    }
  } catch (error: any) {
    console.error('Sync failed:', error)
    return { success: false, message: error.message || 'Đồng bộ thất bại' }
  }
}

export async function updateBaoCaoNgaySettings(iframeUrl: string) {
  try {
    if (!iframeUrl || typeof iframeUrl !== 'string') {
      return { success: false, message: 'URL không được để trống' }
    }

    // Validate URL format
    try {
      new URL(iframeUrl)
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
          url: iframeUrl.trim(),
          updated: now,
        }),
      )
    } else {
      // Create new record (singleton pattern)
      const singletonId = 'baocaongay-settings-singleton'
      await db.transact(
        db.tx.baocaongay[singletonId].update({
          url: iframeUrl.trim(),
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

export async function updateHoiDapLinks(tcqcUrl: string, quytrinhUrl: string) {
  try {
    if (!tcqcUrl || !quytrinhUrl) {
      return { success: false, message: 'URL không được để trống' }
    }

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
            link: url.trim(),
            updated: now,
          }),
        )
      } else {
        const id = crypto.randomUUID()
        await db.transact(
          db.tx.hoidap[id].update({
            name,
            link: url.trim(),
            updated: now,
          }),
        )
      }
    }

    await Promise.all([updateLink('tcqc', tcqcUrl), updateLink('quytrinh', quytrinhUrl)])

    return { success: true, message: 'Cập nhật thành công' }
  } catch (error: any) {
    console.error('Error updating:', error)
    return { success: false, message: error.message || 'Có lỗi xảy ra khi cập nhật' }
  }
}
