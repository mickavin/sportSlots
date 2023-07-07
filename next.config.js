/** @type {import('next').NextConfig} */
const path = require('path')

module.exports = {
  reactStrictMode: false,
  env: {
    MONGODB_URL: process.env.MONGODB_URL,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'wikmit.s3.eu-west-3.amazonaws.com',
      },
    ],
  },
  pageExtensions: ["page.js"],
  sassOptions: {
    includePaths: [
      path.join(__dirname, '\\src\\scss\\dark.scss'),
      path.join(__dirname, '\\src\\scss\\index.scss'),
      path.join(__dirname, '\\src\\scss\\responsive.scss'),
      path.join(__dirname, '\\src\\scss\\style.scss'),
      path.join(__dirname, '\\src\\scss\\vars.scss')
    ],
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      // Transform all direct `react-native` imports to `react-native-web`
      'react-native$': 'react-native-web',
    }
    config.resolve.extensions = [
      '.web.js',
      '.web.jsx',
      '.web.ts',
      '.web.tsx',
      ...config.resolve.extensions,
    ]
    return config
  },
  transpilePackages: [
    'react-native-web', 
    "react-native-gifted-chat",
    "react-native-lightbox",
    "react-native-parsed-text",
    "react-native-typing-animation",
    "react-native-communications",
    "react-native-iphone-x-helper",
    "@expo/react-native-action-sheet",
    "react-native"]
};