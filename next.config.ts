const withPWA = require("next-pwa")({
  dest: "public",
});

module.exports = withPWA({
  images: {
    domains: ["avatars.githubusercontent.com"],
  },
  experimental: {
    optimizePackageImports: ["@chakra-ui/react"],
  },
});
