import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
const globalForPrisma = globalThis;
function getConnectionString() {
    return process.env.DATABASE_URL || process.env.DIRECT_URL || process.env.DB_URL || "";
}
export function isPrismaConfigured() {
    return Boolean(getConnectionString());
}
function createPrismaClient() {
    const connectionString = getConnectionString();
    if (!connectionString)
        return null;
    return new PrismaClient({
        adapter: new PrismaPg({ connectionString }),
        log: process.env.PRISMA_LOG_QUERIES === "true" ? ["query", "error", "warn"] : ["error", "warn"],
    });
}
export const prisma = globalForPrisma.prisma || createPrismaClient();
if (process.env.NODE_ENV !== "production" && prisma) {
    globalForPrisma.prisma = prisma;
}
