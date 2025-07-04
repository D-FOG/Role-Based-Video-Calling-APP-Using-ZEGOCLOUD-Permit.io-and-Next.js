import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  rewrites: async () => {
    return [
      // Keep this if you manually hit /api/socket
      {
        source: '/api/socket',
        destination: '/api/sockets',
      },
      {
        source: '/api/sockets/socket.io/:path*',
        destination: '/api/sockets/socket.io/:path*',
      },
    ]
  },
}

export default nextConfig
