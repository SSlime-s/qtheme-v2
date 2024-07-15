import { gql, useQuery } from "@apollo/client";
import { SmallPreview } from "@repo/theme-preview";
import { resolveTheme } from "@repo/theme/resolve";
import { FaExternalLinkAlt } from "react-icons/fa";
import { client } from "./apollo";

import "./styles.css";

const getThemes = gql`
  query GetThemes {
    getThemes(only_like: true) {
      total,
      themes {
        id,
        title,
        author,
        theme,
      }
    }
  }
`;
// FIXME: graphql-codegen とかで型つける
interface ResTheme {
	id: string;
	title: string;
	author: string;
	theme: string;
}

const traqRegex = /^https:\/\/q.trap.jp\/.*/;
const exTraqRegex = /^https:\/\/q\.ex\.trap\.jp\/.*/;

async function sendThemeToContentScript(theme: string) {
	chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
		const activeTab = tabs[0];
		if (
			activeTab?.id === undefined ||
			(activeTab.url?.match(traqRegex) === null &&
				activeTab.url?.match(exTraqRegex) === null)
		) {
			return;
		}

		chrome.tabs.sendMessage(activeTab.id, {
			name: "setTheme",
			body: {
				theme,
			},
		});
	});
}

function IndexPopup() {
	const {
		data: themes,
		loading,
		error,
	} = useQuery(getThemes, {
		client,
	});

	if (error !== undefined) {
		if (error.message === "Forbidden") {
			return (
				<div className="w-96 p-4 bg-slate-700 text-white">
					<p>この拡張機能は現在 traP 部員限定です。</p>
					<p>
						traP 部員の方はこちらからログインしてください
						<div>
							<a
								href="https://qtheme-v2.trap.games/_oauth/login"
								target="_blank"
								rel="noreferrer"
								className="text-cyan-400 underline flex gap-1 items-center"
							>
								QTheme v2 <FaExternalLinkAlt />
							</a>
						</div>
					</p>
				</div>
			);
		}
		return (
			<div className="w-96 p-4 bg-slate-700 text-red-300">
				Error: {error.message}
			</div>
		);
	}

	return (
		<div className="w-96 p-4 bg-slate-700 text-white h-500">
			<div>
				<a
					href="https://qtheme-v2.trap.games"
					target="_blank"
					rel="noreferrer"
					className="text-cyan-200 underline flex items-center gap-1 glass-morphism p-1 rounded-sm w-fit"
				>
					Open QTheme v2 <FaExternalLinkAlt />
				</a>
			</div>
			<div>
				<span className="rainbow-border rounded-sm w-fit mt-4 p-[1px]">
					<a
						href="https://q.trap.jp/channels/gps/times/SSlime"
						target="_blank"
						rel="noreferrer"
						className="text-cyan-200 underline flex items-center gap-1 glass-morphism p-1 rounded-sm w-fit"
					>
						Feedback <FaExternalLinkAlt />
					</a>
				</span>
			</div>

			<h2 className="text-lg font-bold my-2">
				{loading ? "Loading ..." : `Favoite (${themes?.getThemes.total})`}
			</h2>
			<div className="grid grid-cols-2 gap-4">
				{loading &&
					Array.from({ length: 6 }, (_, i) => ({ id: i })).map(({ id }) => (
						<div
							key={id}
							className="bg-slate-300 rounded-md animate-pulse aspect-video"
						/>
					))}
				{themes?.getThemes.themes.map((theme: ResTheme) => (
					<button
						type="button"
						className="glass-morphism rounded-md transition-transform transform hover:scale-105"
						key={theme.id}
						onClick={() => sendThemeToContentScript(theme.theme)}
					>
						<h3 className="truncate">
							{theme.title || <span className="text-slate-200">なし</span>}
						</h3>
						<p className="text-right pr-1 truncate">{theme.author}</p>
						<SmallPreview
							theme={resolveTheme(JSON.parse(theme.theme))}
							author={theme.author}
						/>
					</button>
				))}
			</div>
		</div>
	);
}

export default IndexPopup;
