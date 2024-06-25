import type { PrismaClient } from "./generated/prisma-client";

declare global {
	var prisma: PrismaClient | undefined;
}
