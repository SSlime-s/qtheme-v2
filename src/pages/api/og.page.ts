import { ImageResponse } from '@vercel/og'
import { NextRequest } from 'next/server'
import { SmallPreview } from '@/components/preview'
import { themeSchema } from '@/model/theme'
import { resolveTheme } from '@/utils/theme'
import { lightTheme } from '@/utils/theme/default'

export const config = {
  runtime: 'experimental-edge',
}

const res = async (req: NextRequest) => {
  const author = req.nextUrl.searchParams.get('author') ?? 'traP'
  const rawTheme = req.nextUrl.searchParams.get('theme')
  if (rawTheme === null) {
    return new Response('Not Found', { status: 404 })
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
  })
  if (dom === null) {
    return new Response('Not Found', { status: 404 })
  }
  return new ImageResponse(dom, {
    width: 1200,
    height: 675,
  })
}
export default res
