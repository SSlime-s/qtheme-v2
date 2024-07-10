import { gql, useQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import { client } from "./apollo";

const getThemes = gql`
  query GetThemes {
    getThemes {
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

function IndexPopup() {
	const [data, setData] = useState("");
	const me = useQuery(getThemes, {
		client,
	});
	console.debug(me);

	useEffect(() => {
		async function fetchData() {
			const res = await client.query({
				query: gql`
          query Whoami {
            getMe
          }
        `,
			});
			setData(res.data.getMe);
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
