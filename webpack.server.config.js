const nodeExternals = require('webpack-node-externals'); // eslint-disable-line

const EXCLUDE = /(node_modules|bower_components)/;

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
  // externals: [nodeExternals()],
  node: {
    __dirname: false,
    __filename: false,
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: 'ts-loader',
        exclude: EXCLUDE,
        // options: {
        //   presets: [
        //     [
        //       '@babel/env',
        //       {
        //         targets: {
        //           node: '6',
        //         },
        //       },
        //     ],
        //   ],
        //   plugins: ['@babel/plugin-transform-async-to-generator'],
        // },
      },
    ],
  },
  resolve: {
    modules: ['node_modules'],
    extensions: ['.tsx', '.ts', '.js' ],
  },
};
