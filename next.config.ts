import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  /* config options here */
  allowedDevOrigins: ['localhost', '10.199.1.16'],

  // Rewrite the scripts.js file to the umami script.js file
  // This is to avoid the umami script being blocked by the browser
  async rewrites() {
    return [
      {
        source: '/scripts.js',
        destination: 'https://cloud.umami.is/script.js',
      },
    ]
  },
}

export default nextConfig
