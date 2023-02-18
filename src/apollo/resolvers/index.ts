import { Connection } from 'mysql2/promise'
import { Resolvers } from '@/apollo/generated/graphql'
import { createTheme } from './createTheme'
import { deleteTheme } from './deleteTheme'
import { getAuthors } from './getAuthors'
import { getRandomTheme } from './getRandomTheme'
import { getTheme } from './getTheme'
import { getThemes } from './getThemes'
import { toggleLike } from './toggleLike'
import { updateTheme } from './updateTheme'

export interface ContextValue {
  userId?: string
  connection?: Connection
}

export const resolvers: Resolvers<ContextValue> = {
  Visibility: {
    PUBLIC: 'public',
    PRIVATE: 'private',
    DRAFT: 'draft',
  },
  Type: {
    LIGHT: 'light',
    DARK: 'dark',
    OTHER: 'other',
  },
  Query: {
    getRandomTheme,
    getTheme,
    getThemes,
    getAuthors,
  },

  Mutation: {
    createTheme,
    updateTheme,
    deleteTheme,
    toggleLike,
  },
}
