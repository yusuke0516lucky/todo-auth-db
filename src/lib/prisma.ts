import { PrismaClient } from '@prisma/client'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'

const dbUrl = process.env.DATABASE_URL ?? 'file:./dev.db'
// PrismaのSQLite URL: "file:./dev.db" → adapter用: "./dev.db"
const sqlitePath = dbUrl.startsWith('file:') ? dbUrl.slice('file:'.length) : dbUrl

const adapter = new PrismaBetterSqlite3({ url: sqlitePath })

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter })

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}