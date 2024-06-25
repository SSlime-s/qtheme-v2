/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	distDir: "build",
	compiler: {
		emotion: true,
	},
	pageExtensions: ["page.tsx", "page.ts", "page.jsx", "page.js"],
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "q.trap.jp",
				port: "",
			},
		],
	},

	webpack: (config, _options) => {
		config.module.rules.push({
			test: /\.(graphql|gql)$/,
			exclude: /node_modules/,
			loader: "graphql-tag/loader",
		});

		return config;
	},

	// transpilePackages: ['@repo/database', '@repo/theme'],

	experimental: {
		externalDir: true,
	},
};

module.exports = nextConfig;
