import { Head, Html, Main, NextScript } from "next/document";

import { googleTagManagerId } from "@/utils/gtm";

export default function Document() {
	return (
		<Html lang="ja">
			<Head />
			<body>
				<noscript>
					{/* biome-ignore lint/a11y/useIframeTitle: for gtm */}
					<iframe
						src={`https://www.googletagmanager.com/ns.html?id=${googleTagManagerId}`}
						height="0"
						width="0"
						style={{ display: "none", visibility: "hidden" }}
					/>
				</noscript>
				<Main />
				<div id="toast" />
				<div id="modal" />
				<NextScript />
			</body>
		</Html>
	);
}
