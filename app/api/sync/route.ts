/*

  Path: /api/sync
  Method: GET

  What it does
  - Authorizes with bearer token from the Authorization header
  - Calls syncAll() from libs/sync.ts which syncs:
    - All sheets (chay, cnch, cvhomnay, chitieu, cvtuannay, cvtuantoi)
    - ChuyenDe progress (chuyende and chuyendeketthuc collections)
  - Returns unified sync results

  Required environment variables
  - SHEET_ID: Google Sheets ID (the long ID in the sheet URL)
  - INSTANTDB_APP_ID: InstantDB App ID (for SDK init)
  - INSTANTDB_ADMIN_TOKEN: InstantDB admin token (used as adminToken)
  - SYNC_TOKEN: Long random secret for endpoint bearer auth

  Auth (Bearer)
  - Clients must send: Authorization: Bearer <SYNC_TOKEN>
  - Recommended when calling from external schedulers like cron-job.org

  Example usage (local)
  curl -sS "http://localhost:3000/api/sync" -H "Authorization: Bearer <SYNC_TOKEN>"

  Example usage (production)
  https://your-domain.com/api/sync
  Header: Authorization: Bearer <SYNC_TOKEN>

  cron-job.org setup
  - URL: https://your-domain.com/api/sync
  - Method: GET
  - Advanced → Request Headers → add: Authorization: Bearer <SYNC_TOKEN>
  - Schedule: as needed (e.g., every 15 minutes)
*/

import { NextResponse } from 'next/server'
import { syncAll } from '@/libs/sync'
import { getSafeErrorMessage } from '@/libs/auth'

function getRequiredEnv(name: string): string {
  const v = process.env[name]
  if (!v) {
    // Log detailed error server-side
    console.error(`Missing required env var: ${name}`)
    throw new Error('Configuration error')
  }
  return v
}

export async function GET(req: Request) {
  try {
    // Bearer auth check
    const authHeader = (req.headers as any).get?.('authorization') || ''
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice('Bearer '.length) : ''
    const expected = getRequiredEnv('SYNC_TOKEN')

    if (!token || token !== expected) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Call unified sync logic
    const result = await syncAll()

    return NextResponse.json(result)
  } catch (err: any) {
    return NextResponse.json(
      { error: getSafeErrorMessage(err, 'An unexpected error occurred') },
      { status: 500 },
    )
  }
}
