// next.config.mjs
import createMDX from '@next/mdx';

const withMDX = createMDX({
  extension: /\.mdx?$/,
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  // 必要なら実験フラグ等
};

export default withMDX({
  ...nextConfig,
  pageExtensions: ['ts','tsx','md','mdx'],
});
