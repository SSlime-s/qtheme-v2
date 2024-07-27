import { ClientError } from "graphql-request";
import { NextResponse } from "next/server";

import { getSdk } from "./Middleware.generated";
import { newClient } from "./utils/api";

import { logger } from "@repo/logger";
import type { NextRequest } from "next/server";

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
	const id = request.nextUrl.pathname
		.replace(/^\/theme\//, "")
		.replace(/\/$/, "");

	if (id.includes("/")) {
		return NextResponse.next();
	}

	try {
		const client = newClient();

		const cookie = request.headers.get("cookie");
		if (cookie !== null) {
			client.setHeader("cookie", cookie);
		}

		const sdk = getSdk(client);
		const { getTheme } = await sdk.HasPermission({
			id,
		});

		if (getTheme === null || getTheme === undefined) {
			return NextResponse.rewrite(new URL("/error/404", request.url));
		}
	} catch (e) {
		if (e instanceof ClientError) {
			if (e.message.startsWith("Not found")) {
				return NextResponse.rewrite(new URL("/error/404", request.url));
			}
		}
		logger.error({ err: e, on: "middleware", id }, "Failed to get theme");
		return NextResponse.rewrite(new URL("/error/500", request.url));
	}

	return NextResponse.next();
}

export const config = {
	matcher: "/theme/:path*",
};
