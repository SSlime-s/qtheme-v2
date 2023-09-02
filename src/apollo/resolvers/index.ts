import { createTheme } from './createTheme'
import { deleteTheme } from './deleteTheme'
import { getAuthors } from './getAuthors'
import { getRandomTheme } from './getRandomTheme'
import { getTheme } from './getTheme'
import { getThemes } from './getThemes'
import { toggleLike } from './toggleLike'
import { updateTheme } from './updateTheme'

import type { Resolvers } from '@/apollo/generated/resolvers'
import type { Connection } from 'mysql2/promise'

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
