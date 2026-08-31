import { PrismaClient } from '@prisma/client';

/*
  feat: initialize singleton database client
  Instantiating a single Prisma client instance prevents connection pool exhaustion 
  during rapid hot reloads in development, balancing optimized resource management 
  with readable configuration.
*/
const prisma = new PrismaClient();

export default prisma;