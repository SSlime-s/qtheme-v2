import crypto from "node:crypto";

import { BASE_URL } from "@/utils/baseUrl";
import { logger } from "@repo/logger";

interface ThemeInfo {
	author: string;
	themeId: string;
	title: string;
}

export const publishThemeWebhook = async ({
	author,
	themeId,
	title,
}: ThemeInfo) => {
	return await sendTraqWebhook(
		`# [${title}](${BASE_URL}/theme/${themeId}) が公開されました :tada:
作成者: :@${author}.large: @${author}`,
	);
};

const sendTraqWebhook = async (content: string) => {
	const id = process.env.WEBHOOK_ID ?? "";
	const secret = process.env.WEBHOOK_SECRET ?? "";
	if (id === "" || secret === "") {
		logger.error(
			{ on: "sendTraqWebhook" },
			"WEBHOOK_ID or WEBHOOK_SECRET is not set",
		);
		return;
	}
	const url = `https://q.trap.jp/api/v3/webhooks/${id}`;

	const headers = {
		"Content-Type": "text/plain; charset=utf-8",
		"X-Traq-Signature": calcHMACSHA1(content, secret),
	};

	const res = await fetch(url, {
		method: "POST",
		headers,
		body: content,
	});
	logger.info({ res }, "sendTraqWebhook");

	if (!res.ok) {
		throw new Error(`Failed to send webhook: ${res.status} ${res.statusText}`);
	}

	return res;
};

const calcHMACSHA1 = (message: string, secret: string) => {
	return crypto.createHmac("sha1", secret).update(message).digest("hex");
};
