const nodeExternals = require('webpack-node-externals'); // eslint-disable-line

const EXCLUDE = /(node_modules|bower_components|dist|client|client\.react)/;

module.exports = {
  entry: ['./server/index.ts'],
  output: {
    library: 'npmGuiServer',
    libraryTarget: 'umd',
    path: `${__dirname}/dist/server`,
    filename: './[name].js',
  },
  devtool: 'cheap-source-map',
  target: 'node',
  node: {
    __dirname: false,
    __filename: false,
  },
  module: {
    rules: [{
      test: /\.ts$/,
      loader: 'ts-loader',
      exclude: EXCLUDE,
      options: {
        configFile: 'tsconfig.server.json',
      },
    }],
  },
  resolve: {
    modules: ['node_modules'],
    extensions: ['.tsx', '.ts', '.js'],
  },
};
