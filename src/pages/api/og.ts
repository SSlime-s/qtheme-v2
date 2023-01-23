import { ImageResponse } from '@vercel/og'
import { NextRequest } from 'next/server'
import { extractShowcaseUser } from '@/lib/extractUser'
import { newClient } from '@/lib/api'
import { gql } from 'graphql-request'
import { SmallPreview } from '@/components/preview'
import { themeSchema } from '@/model/theme'
import { resolveTheme } from '@/lib/theme'
import { lightTheme } from '@/lib/theme/default'

export const config = {
  runtime: 'experimental-edge',
}

const getThemeQuery = gql`
  query GetTheme($id: ID!) {
    getTheme(id: $id) {
      theme {
        author
        theme
        title
        type
      }
    }
  }
`
interface GetThemeResponse {
  getTheme: {
    theme: {
      author: string
      theme: string
      title: string
      type: 'LIGHT' | 'DARK' | 'OTHER'
    }
  }
}

const res = async (req: NextRequest) => {
  const userId = extractShowcaseUser(req)
  const dom = SmallPreview({
    author: 'SSlime',
    theme: resolveTheme(lightTheme),
  })
  if (dom === null) {
    return new Response('Not Found', { status: 404 })
  }
  return new ImageResponse(dom, {
    width: 1200,
    height: 630,
  })

  // const id = req.nextUrl.searchParams.get('id')

  // if (id === null) {
  //   // TODO: default の ogp を考える
  //   return new Response('Unimplemented', { status: 501 })
  // }

  // const client = newClient()
  // try {
  //   console.log('here', 49)
  //   const { getTheme } = await client.request<GetThemeResponse>(getThemeQuery, {
  //     id,
  //   })

  //   console.log('here', 54)
  //   const { author, theme, title, type } = getTheme.theme
  //   console.log('here', 56)
  //   const parsedTheme = themeSchema.parse(JSON.parse(theme))
  //   console.log('here', 58)
  //   const resolvedTheme = resolveTheme(parsedTheme)

  //   console.log('here', 61)
  //   const dom = SmallPreview({ author, theme: resolvedTheme })
  //   if (dom === null) {
  //     return new Response('Not Found', { status: 404 })
  //   }

  //   console.log('here', 67)
  //   const imageResponse = new ImageResponse(dom, {
  //     width: 1200,
  //     height: 630,
  //   })

  //   return imageResponse
  // } catch (e) {
  //   return new Response(`Error: ${e}`, { status: 500 })
  // }
}
export default res
