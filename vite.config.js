/* eslint-disable import/no-extraneous-dependencies */
const react = require('@vitejs/plugin-react');

/** @type {import('vite').UserConfig} */
module.exports = {
  plugins: [react()],
  root: './client',
  server: {
    proxy: {
      '/trpc/': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/trpc/, ''),
      },
    },
  },
};
