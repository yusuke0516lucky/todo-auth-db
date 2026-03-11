 import { PrismaClient } from '@prisma/client'
  import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'
  import Database from 'better-sqlite3'

  const db = new Database('./dev.db')   // ← ルート直下に dev.db があるため
  const adapter = new PrismaBetterSqlite3({ url: './dev.db' })

  const globalForPrisma = globalThis as unknown as {
      prisma: PrismaClient | undefined
  }

  export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter })

  if (process.env.NODE_ENV !== 'production') {
      globalForPrisma.prisma = prisma
  }
