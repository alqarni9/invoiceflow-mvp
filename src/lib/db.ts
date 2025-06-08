import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: "postgresql://postgres:2020@localhost:5432/postgres?schema=public"
    },
  },
})

export default prisma 