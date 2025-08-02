/** @type {import('next').NextConfig} */
const nextConfig = {
  // Next.js 14 中 appDir 已经是默认启用的，不需要在 experimental 中配置
  
  // 配置图片优化
  images: {
    // 禁用图片优化，直接使用原始图片
    unoptimized: true,
  },
  
  // 添加重定向配置
  async redirects() {
    return [
      {
        source: '/map',
        destination: '/map.html',
        permanent: true,
      },
    ]
  },
  
  // 配置缓存头
  async headers() {
    return [
      {
        source: '/fonts/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
          {
            key: 'ETag',
            value: '"wedding-fonts"',
          },
        ],
      },
      {
        source: '/wedding.jpg',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
          {
            key: 'ETag',
            value: '"wedding-image"',
          },
        ],
      },
      {
        source: '/wedding-music.mp3',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
          {
            key: 'ETag',
            value: '"wedding-music"',
          },
        ],
      },
      {
        source: '/map.html',
        headers: [
          {
            key: 'Content-Type',
            value: 'text/html',
          },
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
          {
            key: 'ETag',
            value: '"wedding-map"',
          },
          // 添加CORS头，解决跨域问题
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type',
          },
        ],
      },
      {
        source: '/manifest.json',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/manifest+json',
          },
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/sw.js',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/javascript',
          },
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, must-revalidate',
          },
        ],
      },
      // 添加图片优化相关的头部
      {
        source: '/_next/image/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig 