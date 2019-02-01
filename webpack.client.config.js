const HtmlWebpackPlugin = require('html-webpack-plugin'); // eslint-disable-line
const VueLoaderPlugin = require('vue-loader/lib/plugin'); // eslint-disable-line

const EXCLUDE = /(node_modules|bower_components|dist|server|client)/;

module.exports = {
  entry: './react/index.tsx',
  output: {
    path: `${__dirname}/dist/client`,
    filename: './[name].js',
  },
  devtool: 'cheap-source-map',
  target: 'web',
  module: {
    rules: [
      {
        test: /\.css$/,
        exclude: EXCLUDE,
        use: [
          'style-loader?sourceMap',
          {
            loader: 'typings-for-css-modules-loader',
            options: {
              modules: true,
              namedExport: true,
              localIdentName: '[name]-[local]--[hash:base64:5]',
            },
          },
        ],
      },
      {
        test: /\.ts(x?)$/,
        loader: 'ts-loader',
        exclude: EXCLUDE,
        options: {
          configFile: 'tsconfig.client.json',
        },
      },
      {
        test: /\.(png|woff|woff2|eot|otf|ttf|svg|gif|jpg)$/,
        loader: 'url-loader',
        options: {
          limit: 1000,
        },
      },
      {
        test: /\.css$/,
        include: [/node_modules/],
        use: [
          { loader: 'style-loader' },
          { loader: 'css-loader' },
        ],
      },
    ],
  },
  resolve: {
    modules: ['node_modules'],
    alias: {
      // vue$: 'vue/dist/vue.esm.js',
      'github-buttons$': './github-buttons.common.js',
      'open-iconic$': 'open-iconic/font/css/open-iconic.css',
    },
    extensions: ['.ts', '.tsx', '.js', '.css'],
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'NPM-GUI',
      template: 'react/index.template.html',
      hash: true,
      mobile: true,
    }),
  ],
  devServer: {
    compress: true,
    port: 9000,
    proxy: [
      {
        context: ['/api/**'],
        target: 'http://localhost:9002/',
        secure: false,
        ws: true,
      },
    ],
  },
};
