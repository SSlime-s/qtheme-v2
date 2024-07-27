import { ImageResponse } from "next/og";

import { logger } from "@repo/logger";
import { type Theme, themeSchema } from "@repo/theme";
import { SmallPreview } from "@repo/theme-preview";
import { lightTheme } from "@repo/theme/default";
import { resolveTheme } from "@repo/theme/resolve";

import type { NextRequest } from "next/server";
import type { ReactElement } from "react";

export async function GET(req: NextRequest) {
	const author = req.nextUrl.searchParams.get("author") ?? "traP";
	const rawTheme = req.nextUrl.searchParams.get("theme");
	if (rawTheme === null) {
		const dom = Fallback();
		if (dom === null) {
			return new Response("Internal Server Error", { status: 500 });
		}
		return new ImageResponse(dom, {
			width: 1200,
			height: 630,
		});
	}
	let theme: Theme;
	try {
		theme = themeSchema.parse(JSON.parse(rawTheme));
	} catch (err) {
		logger.info({ err, rawTheme }, "Failed to parse theme");
		return new Response("Invalid Theme", { status: 400 });
	}
	const resolvedTheme = resolveTheme(theme);

	const dom = SmallPreview({
		author,
		theme: resolvedTheme,
		ogp: true,
	});
	if (dom === null) {
		return new Response("Internal Server Error", { status: 500 });
	}
	return new ImageResponse(dom as ReactElement, {
		width: 1200,
		height: 630,
	});
}

const Fallback = () => {
	return (
		<div style={{ display: "flex", position: "relative" }}>
			<SmallPreview author={"traP"} theme={resolveTheme(lightTheme)} ogp />
			<div
				style={{
					display: "flex",
					position: "absolute",
					top: 0,
					left: 0,
					bottom: 0,
					right: 0,
					alignItems: "center",
					justifyContent: "center",
				}}
			>
				<span
					style={{
						backgroundColor: "rgba(255, 255, 255, 0.9)",
						borderRadius: "32px",
					}}
				>
					<span
						style={{
							backgroundColor: "rgba(0, 91, 172, 0.3)",
							color: "black",
							borderRadius: "32px",
							fontSize: "180px",
							padding: "32px 64px",
							fontWeight: "bold",
						}}
					>
						QTheme
					</span>
				</span>
			</div>
		</div>
	);
};
