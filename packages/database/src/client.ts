/// <reference path="./global.d.ts" />

import { PrismaClient } from './generated/prisma-client'

export const prisma = globalThis.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma

export * from './generated/prisma-client'
