import { GraphQLError } from 'graphql'
import { connectDb } from '@/model/db'
import { ContextValue } from '.'
import { getTheme } from './getTheme'
import { ulid } from 'ulid'

export const createTheme = async (
  _: unknown,
  args: {
    title: string
    description: string
    visibility: 'public' | 'private' | 'draft'
    type: 'light' | 'dark' | 'other'
    theme: string
  },
  { userId }: ContextValue
) => {
  if (userId === undefined) {
    throw new GraphQLError('Forbidden')
  }
  const { title, description, visibility, type, theme } = args
  const id = ulid()
  try {
    const connection = await connectDb()
    const sql = `
          INSERT INTO themes (
            id,
            title,
            description,
            author_user_id,
            visibility,
            type,
            theme
          ) VALUES (
            ?, ?, ?, ?, ?, ?, ?
          )
        `
    await connection.execute(sql, [
      id,
      title,
      description,
      userId,
      visibility,
      type,
      theme,
    ])
  } catch (err: unknown) {
    console.error(err)
    throw new GraphQLError(`Internal server error: ${err}`)
  }
  return getTheme(_, { id }, { userId })
}
