/** @type {import('next').NextConfig} */
const isGithubPages = process.env.GITHUB_PAGES === 'true';
const repoName = process.env.GITHUB_REPO || ''; // 'cgai'

const nextConfig = {
  // Only needed if you plan to deploy static files (GitHub Pages)
  ...(isGithubPages && {
    output: 'export',
    images: { unoptimized: true },
    assetPrefix: `/${repoName}/`,
    basePath: `/${repoName}`,
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
    NEXT_PUBLIC_BASE_PATH: isGithubPages ? `/${repoName}` : '',
  }

//   transpilePackages: ['three'],
};

export default nextConfig;
