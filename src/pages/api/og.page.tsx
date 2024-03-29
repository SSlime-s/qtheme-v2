import { ImageResponse } from '@vercel/og'

import { SmallPreview } from '@/components/preview'
import { themeSchema } from '@/model/theme'
import { resolveTheme } from '@/utils/theme'
import { lightTheme } from '@/utils/theme/default'

import type { NextRequest } from 'next/server'

export const config = {
  runtime: 'experimental-edge',
}

const res = async (req: NextRequest) => {
  const author = req.nextUrl.searchParams.get('author') ?? 'traP'
  const rawTheme = req.nextUrl.searchParams.get('theme')
  if (rawTheme === null) {
    const dom = Fallback({})
    if (dom === null) {
      return new Response('Internal Server Error', { status: 500 })
    }
    return new ImageResponse(dom, {
      width: 1200,
      height: 630,
    })
  }
  let theme
  try {
    theme = themeSchema.parse(JSON.parse(rawTheme))
  } catch (err) {
    // fallback 考える
    theme = lightTheme
  }
  const resolvedTheme = resolveTheme(theme)

  const dom = SmallPreview({
    author,
    theme: resolvedTheme,
    ogp: true,
  })
  if (dom === null) {
    return new Response('Not Found', { status: 404 })
  }
  return new ImageResponse(dom, {
    width: 1200,
    height: 630,
  })
}
export default res

const Fallback: React.FC = () => {
  return (
    <div style={{ display: 'flex', position: 'relative' }}>
      <SmallPreview author={'traP'} theme={resolveTheme(lightTheme)} ogp />
      <div
        style={{
          display: 'flex',
          position: 'absolute',
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <span
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            borderRadius: '32px',
          }}
        >
          <span
            style={{
              backgroundColor: 'rgba(0, 91, 172, 0.3)',
              color: 'black',
              borderRadius: '32px',
              fontSize: '180px',
              padding: '32px 64px',
              fontWeight: 'bold',
            }}
          >
            QTheme
          </span>
        </span>
      </div>
    </div>
  )
}
