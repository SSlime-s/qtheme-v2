/// <reference path="./global.d.ts" />

import { logger } from "@repo/logger";
import { PrismaClient } from "./generated/prisma-client";

function constructor() {
	const prisma = new PrismaClient({
		transactionOptions: {
			maxWait: 5000,
			timeout: 10000,
		},
		log: [
			{
				emit: "event",
				level: "query",
			},
			{
				emit: "event",
				level: "info",
			},
			{
				emit: "event",
				level: "warn",
			},
			{
				emit: "event",
				level: "error",
			},
		],
	});

	prisma.$on("query", (e) => {
		if (e.duration < 1000) {
			logger.trace({ query: e.query, params: e.params }, "Prisma query");
		} else {
			logger.info(e, "Prisma query");
		}
	});

	prisma.$on("info", (e) => {
		logger.info(e, "Prisma info");
	});

	prisma.$on("warn", (e) => {
		logger.warn(e, "Prisma warn");
	});

	prisma.$on("error", (e) => {
		logger.error(e, "Prisma error");
	});

	return prisma;
}

export const prisma = globalThis.prisma ?? constructor();

if (process.env.NODE_ENV !== "production") globalThis.prisma = prisma;

export * from "./generated/prisma-client";
