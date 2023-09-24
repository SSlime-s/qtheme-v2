import { NextRequest } from 'next/server'

import type { IncomingMessage } from 'http'

const showcaseUserKey = 'x-showcase-user'
export const extractShowcaseUser = (req: IncomingMessage | NextRequest) => {
  if (
    process.env.NODE_ENV === 'development' &&
    process.env.DEBUG_USER !== undefined
  ) {
    return process.env.DEBUG_USER
  }

  let userId: string | undefined
  if (req instanceof NextRequest) {
    userId = req.headers.get(showcaseUserKey) ?? undefined
  } else {
    const unsafeUserId = req.headers[showcaseUserKey]
    if (Array.isArray(unsafeUserId)) {
      userId = unsafeUserId.join('')
    } else {
      userId = unsafeUserId
    }
  }
  return userId === '-' ? undefined : userId ?? undefined
}
