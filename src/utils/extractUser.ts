import { IncomingMessage } from 'http'
import { NextRequest } from 'next/server'

const showcaseUserKey = 'x-showcase-user'
export const extractShowcaseUser = (req: IncomingMessage | NextRequest) => {
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
