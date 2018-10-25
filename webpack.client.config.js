const HtmlWebpackPlugin = require('html-webpack-plugin'); // eslint-disable-line
const VueLoaderPlugin = require('vue-loader/lib/plugin'); // eslint-disable-line

const EXCLUDE = /(node_modules|bower_components)/;

module.exports = {
  entry: './client/index.js',
  output: {
    path: `${__dirname}/dist/client`,
    filename: './[name].js',
  },
  devtool: 'cheap-source-map',
  target: 'web',
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        exclude: EXCLUDE,
        options: {
          loaders: {
            scss: 'vue-style-loader!css-loader',
          },
        },
      },
      {
        test: /\.(js)$/,
        loader: 'babel-loader',
        exclude: EXCLUDE,
        options: {
          presets: [
            [
              '@babel/env',
              {
                targets: {
                  browsers: 'defaults',
                },
              },
            ],
          ],
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
        loaders: ['style-loader', 'css-loader'],
      },
    ],
  },
  resolve: {
    modules: ['node_modules'],
    alias: {
      vue$: 'vue/dist/vue.esm.js',
      'open-iconic$': 'open-iconic/font/css/open-iconic.css',
    },
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'NPM-GUI',
      template: 'client/index.template.html',
      hash: true,
      mobile: true,
    }),
    new VueLoaderPlugin(),
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
