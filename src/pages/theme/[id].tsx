import { GlassmorphismStyle } from '@/components/Glassmorphism'
import { Layout } from '@/components/layout'
import { SmallPreview } from '@/components/preview'
import { useTheme } from '@/lib/theme/hooks'
import styled from '@emotion/styled'
import { useRouter } from 'next/router'
import { NextPageWithLayout } from '@/pages/_app'
import { Message } from '@/components/Message'

const ThemePage: NextPageWithLayout = () => {
  const { id } = useRouter().query as { id: string }
  const { theme, resolvedTheme } = useTheme(id)

  if (theme === undefined) {
    return <div>loading...</div>
  }

  return (
    <div>
      <Message
        iconUser={theme.author}
        content={
          <>
            {theme.title}
            <Card>
              <SmallPreview theme={resolvedTheme} author={theme.author} />
            </Card>
          </>
        }
        date={theme.createdAt}
        tag={theme.type}
        name={theme.author}
        stamps={'todo'}
      />
      <Message
        iconUser={theme.author}
        content={theme.description}
        date={theme.createdAt}
        tag={theme.type}
        name='Description'
      />
    </div>
  )
}
ThemePage.getLayout = page => <Layout>{page}</Layout>
export default ThemePage

const Card = styled.div`
  ${GlassmorphismStyle}

  padding: 1rem;
  margin: 32px auto;
  max-width: 600px;
  width: calc(100% - 64px);
`
