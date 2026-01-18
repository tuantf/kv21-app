import { init } from '@instantdb/admin'

const trang_chu = ['chay', 'cnch', 'cvhomnay', 'chitieu', 'cvtuannay', 'cvtuantoi']

const MAX_CONCURRENT_REQUESTS = 10

function getRequiredEnv(name: string): string {
  const v = process.env[name]
  if (!v) {
    // Log detailed error server-side
    console.error(`Missing required env var: ${name}`)
    throw new Error('Configuration error')
  }
  return v
}

function logError(message: string, ...args: any[]) {
  // Always log errors, but sanitize in production
  if (process.env.NODE_ENV === 'production') {
    console.error(message)
  } else {
    console.error(message, ...args)
  }
}

export function sheetUrl(sheetName: string) {
  const SHEET_ID = getRequiredEnv('SHEET_ID')
  return `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=${encodeURIComponent(sheetName)}&headers=1`
}

function formatDateTime(): string {
  const now = new Date()
  const formatter = new Intl.DateTimeFormat('vi-VN', {
    timeZone: 'Asia/Ho_Chi_Minh',
    hour: '2-digit',
    minute: '2-digit',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour12: false,
  })

  // Format: "HH:mm dd/MM/yyyy"
  return formatter.format(now).replace(',', '')
}

export function transformData(json: string): Record<string, any>[] {
  // 1. Strip wrapper
  const jsonString = json
    .replace(/^\/\*O_o\*\/\n?google\.visualization\.Query\.setResponse\(/, '')
    .replace(/\);$/, '')
  // 2. Parse JSON
  const parsed = JSON.parse(jsonString)
  // 3. Extract schema and rows
  const cols = parsed.table.cols.map((col: any) => col.label)

  // Common Google Sheets error values to filter out
  const SHEET_ERRORS = ['#N/A', '#REF!', '#VALUE!', '#DIV/0!', '#NAME?', '#NULL!', '#NUM!']

  const rows = parsed.table.rows.map((r: any) =>
    r.c.map((c: any) => {
      if (!c) return null
      // Prefer formatted value if it exists and is not empty
      const value = c.f !== undefined && c.f !== null && c.f !== '' ? c.f : c.v

      // Filter out Google Sheets error values
      if (typeof value === 'string' && SHEET_ERRORS.includes(value)) {
        return null
      }

      return value
    }),
  )
  // 4. Turn into array of objects
  const data = rows.map((r: any) => {
    let obj: Record<string, any> = {}
    cols.forEach((col: string, i: number) => (obj[col] = r[i]))
    return obj
  })
  return data
}

// InstantDB SDK initialization (server). We use adminToken for server-side cron safety.
const db = init({
  appId: getRequiredEnv('INSTANTDB_APP_ID'),
  adminToken: getRequiredEnv('INSTANTDB_ADMIN_TOKEN'),
})
// Note: adminToken is used on server; cast to any to satisfy types if not exposed in typings

async function updateBySheetName(params: {
  sheetName: string
  sheetData: Record<string, any>[]
}): Promise<{ saved: number; skipped: number }> {
  const { sheetName, sheetData } = params
  if (!sheetData.length) return { saved: 0, skipped: 0 }

  try {
    // Query for existing row by name
    const query = {
      sheets: {
        $: {
          where: {
            sheetName: sheetName,
          },
        },
      },
    }
    const existing = await db.query(query)
    const existingRows = existing?.sheets || []
    let rowId: string

    if (existingRows.length > 0) {
      // Update existing row
      rowId = existingRows[0].id
      await db.transact(db.tx.sheets[rowId].update({ data: sheetData, updated: formatDateTime() }))
    } else {
      throw new Error('Data not found')
    }
    return { saved: 1, skipped: 0 }
  } catch (err) {
    logError('InstantDB update error:', err)
    return { saved: 0, skipped: 1 }
  }
}

async function syncSheet(sheetName: string): Promise<{
  sheetName: string
  success: boolean
  error?: string
}> {
  try {
    const gvizUrl = sheetUrl(sheetName)
    const res = await fetch(gvizUrl, { cache: 'no-store' })

    if (!res.ok) {
      return {
        sheetName,
        success: false,
        error: `Failed to fetch from Google Sheets: ${res.status}`,
      }
    }

    const text = await res.text()
    const transformedData = transformData(text)
    const { saved, skipped } = await updateBySheetName({
      sheetName,
      sheetData: transformedData,
    })

    return {
      sheetName,
      success: true,
    }
  } catch (err: any) {
    const errorMessage = err?.message || 'Unknown error'
    logError(`Error syncing sheet ${sheetName}:`, errorMessage)
    return {
      sheetName,
      success: false,
      error: errorMessage,
    }
  }
}

export async function syncAllSheets() {
  // Process all sheets in parallel
  const results = await Promise.allSettled(trang_chu.map(sheet => syncSheet(sheet)))

  // Transform results into detailed status
  const sheetResults = results.map((result, index) => {
    if (result.status === 'fulfilled') {
      return result.value
    } else {
      return {
        sheetName: trang_chu[index],
        success: false,
        error: result.reason?.message || 'Unknown error during processing',
      }
    }
  })

  // Calculate summary statistics
  const succeeded = sheetResults.filter(r => r.success)
  const failed = sheetResults.filter(r => !r.success)

  return {
    success: failed.length === 0,
    summary: {
      total: sheetResults.length,
      succeeded: succeeded.length,
      failed: failed.length,
    },
    details: sheetResults,
  }
}

// --- Chuyen De Sync Logic ---

/**
 * Extracts Google Sheet ID from a Google Sheets URL
 * Handles both /edit and /view URLs, trims after /edit
 */
function extractSheetId(link: string): string | null {
  if (!link) return null

  // Match pattern: /spreadsheets/d/{SHEET_ID}/
  const match = link.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/)
  return match ? match[1] : null
}

/**
 * Builds Google Sheets gviz API URL for a specific sheet tab
 */
function getSheetDataUrl(sheetId: string, sheetName: string = 'data'): string {
  return `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json&sheet=${encodeURIComponent(sheetName)}`
}

/**
 * Parses gviz response to extract A1 cell value (first row, first column)
 */
function parseProgressFromGviz(json: string): string | null {
  try {
    // Strip wrapper
    const jsonString = json
      .replace(/^\/\*O_o\*\/\n?google\.visualization\.Query\.setResponse\(/, '')
      .replace(/\);$/, '')

    // Parse JSON
    const parsed = JSON.parse(jsonString)

    // Extract first cell value (A1)
    if (parsed.table?.rows?.[0]?.c?.[0]) {
      const cell = parsed.table.rows[0].c[0]
      // Prefer formatted value if available, otherwise use raw value
      const value = cell.f !== undefined && cell.f !== null && cell.f !== '' ? cell.f : cell.v
      return value !== null && value !== undefined ? String(value) : null
    }

    return null
  } catch (err) {
    logError('Error parsing gviz response:', err)
    return null
  }
}

/**
 * Converts progress string to number and rounds to one decimal place
 * Returns null if the value cannot be converted to a valid number
 */
function convertProgressToNumber(progress: string | null): number | null {
  if (!progress) return null

  // Remove any whitespace
  const trimmed = progress.trim()
  if (trimmed === '') return null

  // Parse to float
  const num = parseFloat(trimmed)

  // Check if parsing resulted in NaN
  if (isNaN(num)) return null

  // Round to one decimal place
  const factor = Math.pow(10, 2)
  return Math.round(num * factor) / factor
}

/**
 * Fetches progress value from Google Sheets sheet
 */
async function fetchProgress(
  sheetId: string,
  sheetName: string = 'data',
): Promise<{ success: boolean; progress: string | null; error?: string }> {
  try {
    const url = getSheetDataUrl(sheetId, sheetName)
    const res = await fetch(url, { cache: 'no-store' })

    if (!res.ok) {
      return {
        success: false,
        progress: null,
        error: `Failed to fetch from Google Sheets: ${res.status}`,
      }
    }

    const text = await res.text()
    const progress = parseProgressFromGviz(text)

    return {
      success: true,
      progress,
    }
  } catch (err: any) {
    return {
      success: false,
      progress: null,
      error: err?.message || 'Unknown error',
    }
  }
}

/**
 * Syncs progress for a single record
 */
async function syncRecordProgress(record: {
  id: string
  link?: string
  name?: string
  progresssource?: string
}): Promise<{ id: string; success: boolean; progress: number | null; error?: string }> {
  if (!record.link) {
    return {
      id: record.id,
      success: true,
      progress: null,
      error: undefined,
    }
  }

  const sheetId = extractSheetId(record.link)
  if (!sheetId) {
    return {
      id: record.id,
      success: true,
      progress: null,
      error: undefined,
    }
  }

  const fetchResult = await fetchProgress(sheetId, record.progresssource)
  if (!fetchResult.success || fetchResult.progress === null) {
    if (
      fetchResult.error?.includes('Failed to fetch from Google Sheets: 400') ||
      fetchResult.error?.includes('Failed to fetch from Google Sheets: 404')
    ) {
      return {
        id: record.id,
        success: true,
        progress: null,
        error: undefined,
      }
    }

    return {
      id: record.id,
      success: false,
      progress: null,
      error: fetchResult.error || 'Failed to fetch progress',
    }
  }

  // Convert progress string to number and round to one decimal place
  const progressNumber = convertProgressToNumber(fetchResult.progress)
  if (progressNumber === null) {
    return {
      id: record.id,
      success: true,
      progress: null,
      error: undefined,
    }
  }

  // Update database
  try {
    await db.transact(
      db.tx.chuyende[record.id].update({
        progress: progressNumber,
      }),
    )

    return {
      id: record.id,
      success: true,
      progress: progressNumber,
    }
  } catch (err: any) {
    return {
      id: record.id,
      success: false,
      progress: null,
      error: `Database update failed: ${err?.message || 'Unknown error'}`,
    }
  }
}

export async function syncChuyenDeProgress() {
  try {
    // Fetch only chuyende records with non-null progresssource
    const chuyendeResult = await db.query({
      chuyende: {
        $: {
          where: {
            and: [{ progresssource: { $isNull: false } }, { progresssource: { $ne: '' } }],
          },
        },
      },
    })

    const chuyendeRecords = (chuyendeResult?.chuyende || []) as Array<{
      id: string
      link?: string
      name?: string
      progresssource?: string
    }>

    // Prepare all records for parallel processing
    const allRecords = chuyendeRecords

    // Process all records in batches with concurrency limit
    const allResults: PromiseSettledResult<{
      id: string
      success: boolean
      progress: number | null
      error?: string
    }>[] = []
    for (let i = 0; i < allRecords.length; i += MAX_CONCURRENT_REQUESTS) {
      const batch = allRecords.slice(i, i + MAX_CONCURRENT_REQUESTS)
      const batchPromises = batch.map(record => syncRecordProgress(record))
      const batchResults = await Promise.allSettled(batchPromises)
      allResults.push(...batchResults)
    }
    const results = allResults

    // Transform results into detailed status
    const recordResults = results.map((result, index) => {
      if (result.status === 'fulfilled') {
        return result.value
      } else {
        const record = allRecords[index]
        return {
          id: record.id,
          success: false,
          progress: null,
          error: result.reason?.message || 'Unknown error during processing',
        }
      }
    })

    // Calculate summary statistics
    // Records with success=true AND progress=null are SKIPPED (no data to sync)
    // Records with success=true AND progress!=null are SUCCEEDED (synced progress)
    // Records with success=false are FAILED (error during sync)
    const succeeded = recordResults.filter(r => r.success && r.progress !== null)
    const skipped = recordResults.filter(r => r.success && r.progress === null)
    const failed = recordResults.filter(r => !r.success)

    const criticalFailures = failed.filter(r => {
      const error = r.error || ''
      const isAcceptableFailure =
        error.includes('No link provided') ||
        error.includes('Invalid Google Sheets link') ||
        error.includes('Failed to fetch from Google Sheets: 400') ||
        error.includes('Failed to fetch from Google Sheets: 404')
      return !isAcceptableFailure
    })

    return {
      success: criticalFailures.length === 0,
      summary: {
        total: recordResults.length,
        succeeded: succeeded.length,
        failed: criticalFailures.length,
        skipped: skipped.length + (failed.length - criticalFailures.length),
      },
    }
  } catch (err: any) {
    throw new Error(err?.message || 'Unexpected error')
  }
}

/**
 * Unified sync function that syncs all data from Google Sheets to database
 * Syncs both sheets and chuyende progress
 */
export async function syncAll() {
  try {
    // Run both sync operations in parallel
    const [sheetsResult, chuyendeResult] = await Promise.allSettled([
      syncAllSheets(),
      syncChuyenDeProgress(),
    ])

    // Process sheets result
    const sheets =
      sheetsResult.status === 'fulfilled'
        ? sheetsResult.value
        : {
            success: false,
            summary: { total: 0, succeeded: 0, failed: 0 },
            error: sheetsResult.reason?.message || 'Unknown error',
          }

    // Process chuyende result
    const chuyende =
      chuyendeResult.status === 'fulfilled'
        ? chuyendeResult.value
        : {
            success: false,
            summary: { total: 0, succeeded: 0, failed: 0 },
            error: chuyendeResult.reason?.message || 'Unknown error',
          }

    // Combined success status
    const overallSuccess = sheets.success && chuyende.success

    return {
      success: overallSuccess,
      sheets,
      chuyende,
    }
  } catch (err: any) {
    throw new Error(err?.message || 'Unexpected error during sync')
  }
}
