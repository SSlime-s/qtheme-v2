import { Config } from 'apollo-server-micro'
import { Connection } from 'mysql2/promise'
import { createTheme } from './createTheme'
import { deleteTheme } from './deleteTheme'
import { getRandomTheme } from './getRandomTheme'
import { getTheme } from './getTheme'
import { getThemes } from './getThemes'
import { toggleLike } from './toggleLike'
import { updateTheme } from './updateTheme'

export interface ContextValue {
  userId?: string
  connection?: Connection
}

export const resolvers: Config['resolvers'] = {
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
  },

  Mutation: {
    createTheme,
    updateTheme,
    deleteTheme,
    toggleLike,
  },
}
