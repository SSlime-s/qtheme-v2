import { useEffect, useState } from "react";

function IndexPopup() {
	const [data, setData] = useState("");

	useEffect(() => {
		async function fetchData() {
			const res = await fetch("https://qtheme-v2.trap.games/api/graphql", {
				method: "POST",
				body: JSON.stringify({
					query: "query Whoami {\n  getMe\n}",
					operationName: "Whoami",
				}),
				headers: {
					"Content-Type": "application/json",
				},
			});
			const json = await res.json();
			setData(json.data);
		}
		fetchData();
	}, []);

	return (
		<div
			style={{
				padding: 16,
			}}
		>
			<h2>
				Welcome to your{" "}
				<a href="https://www.plasmo.com" target="_blank" rel="noreferrer">
					Plasmo
				</a>{" "}
				Extension!
			</h2>
			<input onChange={(e) => setData(e.target.value)} value={data} />
			<a href="https://docs.plasmo.com" target="_blank" rel="noreferrer">
				View Docs
			</a>
		</div>
	);
}

export default IndexPopup;
