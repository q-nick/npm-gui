var webpack = require('webpack');
var ngAnnotatePlugin = require('ng-annotate-webpack-plugin');

module.exports = {
    entry: {
        vendor: './lib/public/app/vendor.js',
        app: './lib/public/app/npm-gui.js'
    },
    output: {
        filename: './lib/public/npm-gui.js'
    },
    watchOptions: {
        poll: 1000
    },
    plugins: [
        new ngAnnotatePlugin({
            add: true
            // other ng-annotate options here
        }),
        new webpack.optimize.CommonsChunkPlugin('vendor', './lib/public/vendor.js')
    ]
};