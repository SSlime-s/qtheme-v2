import { ClientError } from 'graphql-request'
import { NextResponse } from 'next/server'

import { getSdk } from './Middleware.generated'
import { newClient } from './utils/api'

import type { NextRequest } from 'next/server'

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  const client = newClient()
  const sdk = getSdk(client)

  const id = request.nextUrl.pathname
    .replace(/^\/theme\//, '')
    .replace(/\/$/, '')

  if (id.includes('/')) {
    return NextResponse.next()
  }

  try {
    const { getTheme } = await sdk.HasPermission({
      id,
    })

    if (getTheme === null || getTheme === undefined) {
      return NextResponse.rewrite(new URL('/error/404', request.url))
    }
  } catch (e) {
    if (e instanceof ClientError) {
      if (e.message.startsWith('Not found')) {
        return NextResponse.rewrite(new URL('/error/404', request.url))
      }
    }
    return NextResponse.rewrite(new URL('/error/500', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/theme/:path*',
}
