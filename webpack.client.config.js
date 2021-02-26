const HtmlWebpackPlugin = require('html-webpack-plugin'); // eslint-disable-line
const createStyledComponentsTransformer = require('typescript-plugin-styled-components').default; // eslint-disable-line

const styledComponentsTransformer = createStyledComponentsTransformer();

const EXCLUDE = /(node_modules|bower_components|dist|server)/;

module.exports = {
  entry: './client/index.tsx',
  output: {
    path: `${__dirname}/dist/client`,
    filename: './[name].js',
  },
  devtool: 'eval-source-map', // TODO
  target: 'web',
  module: {
    rules: [
      {
        test: /\.css$/,
        exclude: EXCLUDE,
        use: [
          { loader: 'style-loader' },
          { loader: 'css-loader' },
        ],
      },
      {
        test: /\.ts(x?)$/,
        loader: 'ts-loader',
        exclude: EXCLUDE,
        options: {
          configFile: 'tsconfig.json',
          getCustomTransformers: () => ({ before: [styledComponentsTransformer] }),

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
      'github-buttons$': './github-buttons.common.js',
      'open-iconic$': 'open-iconic/font/css/open-iconic.css',
    },
    extensions: ['.ts', '.tsx', '.js', '.css'],
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'NPM-GUI',
      template: 'client/index.template.html',
      hash: true,
      mobile: true,
    }),
  ],
  devServer: {
    compress: true,
    port: 9000,
    historyApiFallback: true,
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
