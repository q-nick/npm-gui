var webpack = require('webpack');
var ngAnnotatePlugin = require('ng-annotate-webpack-plugin');

module.exports = {
  entry: {
    vendor: './web-client/app/vendor.js',
    app: './web-client/app/npm-gui.js'
  },
  output: {
    filename: './web-client/npm-gui.js'
  },
  watchOptions: {
    poll: 1000
  },
  plugins: [
    new ngAnnotatePlugin({
      add: true
      // other ng-annotate options here
    }),
    new webpack.optimize.CommonsChunkPlugin('vendor', './web-client/vendor.js')
  ]
};
