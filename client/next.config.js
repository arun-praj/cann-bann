/** @type {import('next').NextConfig} */
const nextConfig = {
   reactStrictMode: false,
   swcMinify: true,
   serverRuntimeConfig: {
      URI: 'http://django:3000',
   },
   publicRuntimeConfig: {
      URI: 'localhost:8000',
   },
   webpack: (config) => {
      config.watchOptions = {
         poll: 1000,
         aggregateTimeout: 300,
      }

      return config
   },
}

module.exports = nextConfig
