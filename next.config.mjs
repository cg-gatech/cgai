/** @type {import('next').NextConfig} */

const isGithubPages = process.env.GITHUB_PAGES === 'true';
const repoName = process.env.GITHUB_REPO || ''; // 'cgai'
const basePath = isGithubPages ? `/${repoName}` : '';

const nextConfig = {
  // Only needed if you plan to deploy static files (GitHub Pages)
  ...(isGithubPages && {
    output: isGithubPages ? 'export' : undefined,
    images: { unoptimized: isGithubPages },
    basePath, assetPrefix: basePath
  }),

  webpack: (config, { isServer }) => {
    if (!isServer) {
      // We're in the browser build, so we can safely exclude the sharp module
      config.externals.push('sharp');
    }

    // shader support
    config.module.rules.push({
      test: /\.(glsl|vs|fs|vert|frag)$/,
      exclude: /node_modules/,
      use: ['raw-loader', 'glslify-loader'],
    });

    return config;
  },

  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  }

//   transpilePackages: ['three'],
};

export default nextConfig;
