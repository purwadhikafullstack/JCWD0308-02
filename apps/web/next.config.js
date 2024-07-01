/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
      },
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  redirects: () => {
    return [
      {
        source: '/auth/login',
        destination: '/auth/signin',
        permanent: false
      }
    ]
  }
}

module.exports = nextConfig
