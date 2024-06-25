import type { CodegenConfig } from "@graphql-codegen/cli";

const defaultAdd = [
	{
		add: {
			content: `// ************************************************************
// * This file is automatically generated by graphql-codegen. *
// *                                                          *
// * Do not make direct changes to the file.                  *
// ************************************************************`,
		},
	},
] as const;

const defaultConfig: CodegenConfig["config"] = {
	enumsAsConst: true,
	// avoidOptionals: {
	//   field: true,
	//   inputValue: false,
	//   object: true,
	//   defaultValue: false,
	// },
	strictScalars: true,
};

const config: CodegenConfig = {
	overwrite: true,
	schema: "src/apollo/schema.graphql",
	documents: "src/**/*.graphql",
	generates: {
		"src/apollo/generated/resolvers.ts": {
			plugins: ["typescript", "typescript-resolvers", ...defaultAdd],
			config: {
				...defaultConfig,
				enumValues: {
					Visibility: {
						PUBLIC: "public",
						PRIVATE: "private",
						DRAFT: "draft",
					},
					Type: {
						LIGHT: "light",
						DARK: "dark",
						OTHER: "other",
					},
				},
				scalars: {
					DateTime: "Date",
				},
			},
		},
		"src/apollo/generated/graphql.ts": {
			plugins: ["typescript", ...defaultAdd],
			config: {
				...defaultConfig,
				scalars: {
					DateTime: "string",
				},
			},
		},
		"./src/": {
			plugins: [
				"typescript-operations",
				"typescript-graphql-request",
				...defaultAdd,
			],
			preset: "near-operation-file",
			presetConfig: {
				extension: ".generated.ts",
				baseTypesPath: "~@/apollo/generated/graphql",
			},
			config: {
				...defaultConfig,
				scalars: {
					DateTime: "string",
				},
			},
		},
	},
};
export default config;
