import path from "node:path";
import { configDefaults, defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		globals: true,
		environment: "jsdom",
		exclude: configDefaults.exclude,
		alias: {
			"@": path.resolve(__dirname, "src"),
		},
	},
});
