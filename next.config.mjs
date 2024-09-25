// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export',
    // Ensure API routes are not included in the static export
    async exportPathMap(defaultPathMap) {
      const filteredPathMap = Object.keys(defaultPathMap)
        .filter((path) => !path.startsWith('/api')) // Remove API routes
        .reduce((acc, path) => {
          acc[path] = defaultPathMap[path];
          return acc;
        }, {});
  
      return filteredPathMap;
    },
  };
  
  export default nextConfig;
  