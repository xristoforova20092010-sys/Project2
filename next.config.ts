import type { NextConfig } from "next";

const isGitHubPages = process.env.GITHUB_PAGES === "true";

const nextConfig: NextConfig = {
  output: isGitHubPages ? "export" : undefined,
  basePath: isGitHubPages ? "/Project2" : "",
  assetPrefix: isGitHubPages ? "/Project2/" : undefined,
  images: {
    unoptimized: isGitHubPages,
  },
};

export default nextConfig;
