import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	/* config options here */
	images: {
		domains: ["soe-storage.s3.ap-southeast-1.amazonaws.com"],
	},
	scripts: {
		domains: ["unpkg.com"],
	},
	experimental: {
		turbo: {
			resolveAlias: {
				canvas: "./empty-module.ts",
			},
		},
	},
	swcMinify: false,
};

export default nextConfig;
