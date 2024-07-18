/// <reference path="./global.d.ts" />

import { PrismaClient } from "./generated/prisma-client";

export const prisma = globalThis.prisma ?? new PrismaClient({
	transactionOptions: {
		maxWait: 5000,
		timeout: 10000,
	}
});

if (process.env.NODE_ENV !== "production") globalThis.prisma = prisma;

export * from "./generated/prisma-client";
