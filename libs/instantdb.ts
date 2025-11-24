import { init } from '@instantdb/react'

const KV21_APP_ID = process.env.NEXT_PUBLIC_INSTANTDB_APP_ID

if (!KV21_APP_ID) {
  throw new Error('KV21_APP_ID is not set')
}

export const db = init({ appId: KV21_APP_ID })
