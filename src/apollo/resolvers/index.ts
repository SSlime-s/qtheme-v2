import { createTheme } from './createTheme'
import { deleteTheme } from './deleteTheme'
import { getAuthors } from './getAuthors'
import { getMe } from './getMe'
import { getRandomTheme } from './getRandomTheme'
import { getTheme } from './getTheme'
import { getThemes } from './getThemes'
import { toggleLike } from './toggleLike'
import { updateTheme } from './updateTheme'

import type { Resolvers } from '@/apollo/generated/resolvers'
import type { PrismaClient } from '@prisma/client'
import type { Connection } from 'mysql2/promise'
import type { NextApiResponse } from 'next'

export interface ContextValue {
  userId?: string
  connection?: Connection
  revalidate?: NextApiResponse['revalidate']
  prisma: PrismaClient
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
    getMe,
  },

  Mutation: {
    createTheme,
    updateTheme,
    deleteTheme,
    toggleLike,
  },
}
