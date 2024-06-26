import type { NextRequest } from "next/server";

export const config = {
	runtime: "edge",
};

const res = async (req: NextRequest) => {
	const params = req.nextUrl.searchParams;
	if (process.env.OGP_URL === undefined) {
		return new Response("Internal Server Error", { status: 500 });
	}

	const ogp_url = new URL(process.env.OGP_URL);
	for (const [key, value] of params) {
		ogp_url.searchParams.append(key, value);
	}

	const response = await fetch(ogp_url);

	if (!response.ok) {
		const body = await response.text();
		const { status, headers, statusText } = response;
		return new Response(body, { status, headers, statusText });
	}

	const blob = await response.blob();
	const headers = new Headers(response.headers);
	headers.set("Content-Type", blob.type);
	headers.set("Cache-Control", "public, max-age=604800, immutable");

	const { status, statusText } = response;

	return new Response(blob, { headers, status, statusText });
};
export default res;
