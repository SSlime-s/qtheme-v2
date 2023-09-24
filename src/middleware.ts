import { NextResponse } from 'next/server'

import { getSdk } from './Middleware.generated'
import { newClient } from './utils/api'

import type { NextRequest } from 'next/server'

// This function can be marked `async` if using `await` inside
export const middleware = async (request: NextRequest) => {
  const client = newClient()
  const sdk = getSdk(client)

  const id = request.nextUrl.pathname
    .replace(/^\/theme\//, '')
    .replace(/\/$/, '')

  try {
    const { getTheme } = await sdk.HasPermission({
      id,
    })

    if (getTheme === null || getTheme === undefined) {
      return NextResponse.rewrite('/error/404')
    }
  } catch (e) {
    return NextResponse.rewrite('/error/500')
  }
}

export const config = {
  matcher: '/theme/:id',
}
