import { Config } from '@shared/config'
import { Logger } from '@shared/logger'

import { PrismaClient, Prisma } from '@prisma/client'

export interface IDatabase {
  get client(): PrismaClient

  connect(): void
  disconnect(): void
}

export class Database implements IDatabase {
  private readonly prisma: PrismaClient

  constructor(
    private readonly config: Config,
    private readonly logger: Logger
  ) {
    if (config.db) {
      this.prisma = new PrismaClient({
        log: [this.config.db.logLevel as Prisma.LogLevel]
      })
    } else {
      this.logger.error('DB_ERROR, missing config. Exiting.')
      process.exit(1)
    }
  }

  get client() {
    return this.prisma
  }

  async connect() {
    this.prisma.$connect()
  }

  async disconnect() {
    this.prisma.$disconnect()
  }
}
