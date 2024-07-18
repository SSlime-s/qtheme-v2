/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	distDir: "build",
	compiler: {
		emotion: true,
	},
	cacheMaxMemorySize: 10 * 1024 * 1024, // 10MB
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

	webpack: (config, { webpack }) => {
		config.module.rules.push({
			test: /\.(graphql|gql)$/,
			exclude: /node_modules/,
			loader: "graphql-tag/loader",
		});

		config.plugins.push(
			new webpack.NormalModuleReplacementPlugin(/^node:/, (resource) => {
				resource.request = resource.request.replace(/^node:/, "");
			}),
		);

		return config;
	},

	// transpilePackages: ['@repo/database', '@repo/theme'],

	experimental: {
		externalDir: true,
	},
};

module.exports = nextConfig;
