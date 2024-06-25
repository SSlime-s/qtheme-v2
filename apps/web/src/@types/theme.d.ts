import type { ResolvedTheme } from "@repo/theme/resolve";
import "@emotion/react";

declare module "@emotion/react" {
	export interface Theme {
		theme: ResolvedTheme;
	}
}
